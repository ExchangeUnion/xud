package main

import (
	"time"

	"github.com/ExchangeUnion/xud-simulation/xudrpc"
	"github.com/ExchangeUnion/xud-simulation/xudtest"
)

var ltcQuantity int64 = 1000000

// instabilityTestCases are test cases which try to simulate instability
// due to bugs, network outages, or system issues. They test whether xud
// can handle such problems gracefully and prevent loss of funds.
var instabilityTestCases = []*testCase{
	{
		name: "network initialization", // must be the first test case to be run
		test: testNetworkInit,
	},
	{
		name: "maker crashed after send payment",
		test: testMakerCrashedAfterSend,
	},
	{
		name: "maker crashed after send payment with delayed settlement",
		test: testMakerCrashedAfterSendDelayedSettlement,
	},
}

func testMakerCrashedAfterSend(net *xudtest.NetworkHarness, ht *harnessTest) {
	var err error
	net.Alice, err = net.SetCustomXud(net.Alice, "instability", []string{"BREAKSWAP=MAKER_CRASH_AFTER_SEND"})
	ht.assert.NoError(err)
	ht.act.init(net.Alice)

	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Save the initial balance.
	alicePrevBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	alicePrevLtcBalance := alicePrevBalance.ltc.channel.GetBalance()

	// Place an order on Alice.
	aliceOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "maker_order_id",
		Price:    0.02,
		Quantity: uint64(ltcQuantity),
		PairId:   "LTC/BTC",
		Side:     xudrpc.OrderSide_BUY,
	}
	ht.act.placeOrderAndBroadcast(net.Alice, net.Bob, aliceOrderReq)

	// Place a matching order on Bob.
	bobOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "taker_order_id",
		Price:    aliceOrderReq.Price,
		Quantity: aliceOrderReq.Quantity,
		PairId:   aliceOrderReq.PairId,
		Side:     xudrpc.OrderSide_SELL,
	}
	_, err = net.Bob.Client.PlaceOrderSync(ht.ctx, bobOrderReq)

	<-net.Alice.ProcessExit

	net.Alice.Start(nil)

	// Brief delay to allow for swap to be recovered consistently
	time.Sleep(1 * time.Second)

	// Verify that alice received her LTC
	aliceBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	aliceLtcBalance := aliceBalance.ltc.channel.GetBalance()
	ht.assert.Equal(alicePrevLtcBalance+ltcQuantity, aliceLtcBalance, "alice did not receive LTC")
}

func testMakerCrashedAfterSendDelayedSettlement(net *xudtest.NetworkHarness, ht *harnessTest) {
	var err error
	net.Alice, err = net.SetCustomXud(net.Alice, "instability", []string{"BREAKSWAP=MAKER_CRASH_AFTER_SEND"})
	ht.assert.NoError(err)

	net.Bob, err = net.SetCustomXud(net.Bob, "instability", []string{"BREAKSWAP=TAKER_DELAY_BEFORE_SETTLE"})
	ht.assert.NoError(err)

	ht.act.init(net.Alice)
	ht.act.init(net.Bob)

	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Save the initial balance.
	alicePrevBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	alicePrevLtcBalance := alicePrevBalance.ltc.channel.GetBalance()

	// Place an order on Alice.
	aliceOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "maker_order_id",
		Price:    0.02,
		Quantity: uint64(ltcQuantity),
		PairId:   "LTC/BTC",
		Side:     xudrpc.OrderSide_BUY,
	}
	ht.act.placeOrderAndBroadcast(net.Alice, net.Bob, aliceOrderReq)

	// Place a matching order on Bob.
	bobOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "taker_order_id",
		Price:    aliceOrderReq.Price,
		Quantity: aliceOrderReq.Quantity,
		PairId:   aliceOrderReq.PairId,
		Side:     xudrpc.OrderSide_SELL,
	}
	go net.Bob.Client.PlaceOrderSync(ht.ctx, bobOrderReq)

	<-net.Alice.ProcessExit

	net.Alice.Start(nil)

	// Verify that alice hasn't claimed her LTC yet. The incoming LTC payment
	// cannot be settled until the outgoing BTC payment is settled by bob,
	// which is being intentionally delayed.
	aliceIntermediateBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	aliceIntermediateLtcBalance := aliceIntermediateBalance.ltc.channel.GetBalance()
	ht.assert.NotEqual(alicePrevLtcBalance+ltcQuantity, aliceIntermediateLtcBalance)

	// Delay to allow for payment to be claimed by bob then recovered by alice
	time.Sleep(4 * time.Second)

	// Verify that alice received her LTC
	aliceBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	aliceLtcBalance := aliceBalance.ltc.channel.GetBalance()
	ht.assert.Equal(alicePrevLtcBalance+ltcQuantity, aliceLtcBalance, "alice did not receive LTC")
}
