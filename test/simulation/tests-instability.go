package main

import (
	"fmt"
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
		name: "maker crashed after send payment", // replacing Alice
		test: testMakerCrashedAfterSend,
	},
	{
		name: "maker crashed after send payment with delayed settlement", // replacing Alice + Bob
		test: testMakerCrashedAfterSendDelayedSettlement,
	},
	{
		name: "maker lnd crashed before order settlement",
		test: testMakerLndCrashedBeforeSettlement,
	},
}

// testMakerLndCrashedBeforeSettlement
func testMakerCrashedAfterSend(net *xudtest.NetworkHarness, ht *harnessTest) {
	var err error
	net.Alice, err = net.SetCustomXud(ht.ctx, ht, net.Alice, "instability", []string{"BREAKSWAP=MAKER_CRASH_AFTER_SEND"})
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
	ht.assert.NoError(err)

	<-net.Alice.ProcessExit

	err = net.Alice.Start(nil)
	ht.assert.NoError(err)

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
	net.Alice, err = net.SetCustomXud(ht.ctx, ht, net.Alice, "instability", []string{"BREAKSWAP=MAKER_CRASH_AFTER_SEND"})
	ht.assert.NoError(err)

	net.Bob, err = net.SetCustomXud(ht.ctx, ht, net.Bob, "instability", []string{"BREAKSWAP=TAKER_DELAY_BEFORE_SETTLE"})
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
	ht.assert.Less(aliceIntermediateLtcBalance, alicePrevLtcBalance)

	// Delay to allow for payment to be claimed by bob then recovered by alice
	time.Sleep(10 * time.Second)

	// Verify that alice received her LTC
	aliceBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	aliceLtcBalance := aliceBalance.ltc.channel.GetBalance()
	ht.assert.Equal(alicePrevLtcBalance+ltcQuantity, aliceLtcBalance, "alice did not recover LTC funds")
}

func testMakerLndCrashedBeforeSettlement(net *xudtest.NetworkHarness, ht *harnessTest) {
	var err error
	net.Alice, err = net.SetCustomXud(ht.ctx, ht, net.Alice, "instability", []string{
		"BREAKSWAP=MAKER_LND_CRASHED_BEFORE_SETTLE",
		fmt.Sprintf("LNDLTC_PID=%d", net.Alice.LndLtcNode.Cmd.Process.Pid),
	})
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
	go net.Bob.Client.PlaceOrderSync(ht.ctx, bobOrderReq)

	// Alice's lnd-ltc is expected to be killed by Alice's custom xud.
	<-net.Alice.LndLtcNode.ProcessExit

	// Wait a bit so that Alice's call to lnd-ltc for settlement would fail.
	time.Sleep(5 * time.Second)

	// Restart Alice's lnd-ltc.
	err = net.Alice.LndLtcNode.Start(nil)
	ht.assert.NoError(err)

	// Brief delay to allow for swap to be recovered consistently.
	// The pending swap recheck interval is usually 5m, but was adjusted in
	// Alice's custom xud to 5s (as well as the swap completion timeout interval).
	time.Sleep(10 * time.Second)

	// Verify that alice received her LTC.
	aliceBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	aliceLtcBalance := aliceBalance.ltc.channel.GetBalance()
	ht.assert.Equal(alicePrevLtcBalance+ltcQuantity, aliceLtcBalance, "alice did not recover LTC funds")
}
