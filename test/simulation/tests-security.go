package main

import (
	"github.com/ExchangeUnion/xud-simulation/xudrpc"
	"github.com/ExchangeUnion/xud-simulation/xudtest"
	"github.com/lightningnetwork/lnd/lnrpc"
	"time"
)

// securityTestCases are test cases which try to break the protocol via
// an adversarial custom xud client. They are relying on payment channels
// to be open before running them, and balance checks to occur after.
var securityTestCases = []*testCase{
	{
		name: "network initialization", // must be the first test case to be run
		test: testNetworkInit,
	},
	{
		name: "taker stalling on swapAccepted",
		test: testTakerStallingOnSwapAccepted,
	},
	{
		name: "maker stalling after 1st htlc",
		test: testMakerStallingAfter1stHTLC,
	},
	{
		name: "taker stalling after 2nd htlc",
		test: testTakerStallingAfter2ndHTLC,
	},
	{
		name:             "taker stalling after swap succeeded",
		test:             testTakerStallingAfterSwapSucceeded,
		balanceMayChange: true,
	},
}

// unsettledChannelsSecurityTests are test cases which try to break the protocol via
// an adversarial custom xud client. Payment channels opening/closing and balance checks
// are done within the tests. This is because they simulate more complicated scenarios,
// wheres the channels are left in unsettled state due to pending HTLCs.
var unsettledChannelsSecurityTests = []*testCase{
	{
		name: "network initialization", // must be the first test case to be run
		test: testNetworkInit,
	},
	{
		name: "maker shutdown after 1st htlc",
		test: testMakerShutdownAfter1stHTLC,
	},
	{
		name: "taker shutdown after 2nd htlc",
		test: testTakerShutdownAfter2ndHTLC,
	},
}

func testTakerStallingOnSwapAccepted(net *xudtest.NetworkHarness, ht *harnessTest) {
	var err error
	net.Alice, err = net.SetCustomXud(net.Alice, "adversarial/breakswap", []string{"BREAKSWAP=TAKER_SWAPACCEPTED_STALL"})
	ht.assert.NoError(err)
	ht.act.init(net.Alice)

	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Place an order on Bob.
	bobOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "maker_order_id",
		Price:    0.02,
		Quantity: 1000000,
		PairId:   "LTC/BTC",
		Side:     xudrpc.OrderSide_BUY,
	}
	bobOrder := ht.act.placeOrderAndBroadcast(net.Bob, net.Alice, bobOrderReq)

	// Subscribe to swap failures on Bob before placing the matching order on Alice.
	bobSwapFailuresChan := subscribeSwapFailures(ht.ctx, net.Bob, false)

	// Place a matching order on Alice.
	aliceOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "taker_order_id",
		Price:    bobOrderReq.Price,
		Quantity: bobOrderReq.Quantity,
		PairId:   bobOrderReq.PairId,
		Side:     xudrpc.OrderSide_SELL,
	}
	res, err := net.Alice.Client.PlaceOrderSync(ht.ctx, aliceOrderReq)
	ht.assert.NoError(err)
	ht.assert.Len(res.InternalMatches, 0)
	ht.assert.Len(res.SwapSuccesses, 0)
	ht.assert.Len(res.SwapFailures, 1)
	ht.assert.Equal(res.SwapFailures[0].FailureReason, "DealTimedOut")
	ht.assert.NotNil(res.RemainingOrder)
	ht.assert.Equal(res.RemainingOrder.GetLocalId(), aliceOrderReq.OrderId)
	ht.assert.Equal(res.RemainingOrder.Quantity, aliceOrderReq.Quantity)

	e := <-bobSwapFailuresChan
	ht.assert.NoError(e.err)
	ht.assert.NotNil(e.swapFailure)
	ht.assert.Equal(e.swapFailure.PeerPubKey, net.Alice.PubKey())
	ht.assert.Equal(e.swapFailure.FailureReason, "SwapTimedOut")
	ht.assert.Equal(e.swapFailure.OrderId, bobOrder.Id)

	// Cleanup.

	removalRes, err := net.Bob.Client.RemoveOrder(ht.ctx, &xudrpc.RemoveOrderRequest{OrderId: bobOrderReq.OrderId})
	ht.assert.NoError(err)
	ht.assert.NotNil(removalRes)
	ht.assert.Equal(removalRes.QuantityOnHold, uint64(0))

	removalRes, err = net.Alice.Client.RemoveOrder(ht.ctx, &xudrpc.RemoveOrderRequest{OrderId: aliceOrderReq.OrderId})
	ht.assert.NoError(err)
	ht.assert.NotNil(removalRes)
	ht.assert.Equal(removalRes.QuantityOnHold, uint64(0))

	ht.act.disconnect(net.Alice, net.Bob)
}

func testMakerStallingAfter1stHTLC(net *xudtest.NetworkHarness, ht *harnessTest) {
	var err error
	net.Alice, err = net.SetCustomXud(net.Alice, "adversarial/breakswap", []string{"BREAKSWAP=MAKER_1ST_HTLC_STALL"})
	ht.assert.NoError(err)
	ht.act.init(net.Alice)

	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Place an order on Alice.
	aliceOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "maker_order_id",
		Price:    0.02,
		Quantity: 1000000,
		PairId:   "LTC/BTC",
		Side:     xudrpc.OrderSide_BUY,
	}
	aliceOrder := ht.act.placeOrderAndBroadcast(net.Alice, net.Bob, aliceOrderReq)

	// Subscribe to swap failures on Alice before placing the matching order on Bob.
	aliceSwapFailuresChan := subscribeSwapFailures(ht.ctx, net.Alice, false)

	// Place a matching order on Bob.
	bobOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "taker_order_id",
		Price:    aliceOrderReq.Price,
		Quantity: aliceOrderReq.Quantity,
		PairId:   aliceOrderReq.PairId,
		Side:     xudrpc.OrderSide_SELL,
	}

	res, err := net.Bob.Client.PlaceOrderSync(ht.ctx, bobOrderReq)
	ht.assert.NoError(err)
	ht.assert.Len(res.InternalMatches, 0)
	ht.assert.Len(res.SwapSuccesses, 0)
	ht.assert.Len(res.SwapFailures, 1)
	ht.assert.Equal(res.SwapFailures[0].FailureReason, "SwapTimedOut")
	ht.assert.NotNil(res.RemainingOrder)
	ht.assert.Equal(res.RemainingOrder.GetLocalId(), bobOrderReq.OrderId)
	ht.assert.Equal(res.RemainingOrder.Quantity, bobOrderReq.Quantity)

	e := <-aliceSwapFailuresChan
	ht.assert.NoError(e.err)
	ht.assert.NotNil(e.swapFailure)
	ht.assert.Equal(e.swapFailure.PeerPubKey, net.Bob.PubKey())
	ht.assert.Equal(e.swapFailure.FailureReason, "SwapTimedOut")
	ht.assert.Equal(e.swapFailure.OrderId, aliceOrder.Id)

	// Cleanup.

	removalRes, err := net.Alice.Client.RemoveOrder(ht.ctx, &xudrpc.RemoveOrderRequest{OrderId: aliceOrderReq.OrderId})
	ht.assert.NoError(err)
	ht.assert.NotNil(removalRes)
	ht.assert.Equal(removalRes.QuantityOnHold, uint64(0))

	removalRes, err = net.Bob.Client.RemoveOrder(ht.ctx, &xudrpc.RemoveOrderRequest{OrderId: bobOrderReq.OrderId})
	ht.assert.NoError(err)
	ht.assert.NotNil(removalRes)
	ht.assert.Equal(removalRes.QuantityOnHold, uint64(0))

	ht.act.disconnect(net.Alice, net.Bob)

	_, err = net.LndBtcNetwork.BtcMiner.Node.Generate(6)
	ht.assert.NoError(err)
}

func testMakerShutdownAfter1stHTLC(net *xudtest.NetworkHarness, ht *harnessTest) {
	var err error
	net.Alice, err = net.SetCustomXud(net.Alice, "adversarial/breakswap", []string{"BREAKSWAP=MAKER_1ST_HTLC_SHUTDOWN"})
	ht.assert.NoError(err)
	ht.act.init(net.Alice)

	alicePrevBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	bobPrevBalance, err := getBalance(ht.ctx, net.Bob)
	ht.assert.NoError(err)

	aliceBtcChanPoint, err := openBtcChannel(ht.ctx, net.LndBtcNetwork, net.Alice.LndBtcNode, net.Bob.LndBtcNode)
	ht.assert.NoError(err)
	_, err = openLtcChannel(ht.ctx, net.LndLtcNetwork, net.Bob.LndLtcNode, net.Alice.LndLtcNode)
	ht.assert.NoError(err)

	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Place an order on Alice.
	aliceOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "maker_order_id",
		Price:    0.02,
		Quantity: 1000000,
		PairId:   "LTC/BTC",
		Side:     xudrpc.OrderSide_BUY,
	}
	_ = ht.act.placeOrderAndBroadcast(net.Alice, net.Bob, aliceOrderReq)

	// Subscribe to swap failures on Alice before placing the matching order on Bob.
	aliceSwapFailuresChan := subscribeSwapFailures(ht.ctx, net.Alice, false)

	// Place a matching order on Bob.
	bobOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "taker_order_id",
		Price:    aliceOrderReq.Price,
		Quantity: aliceOrderReq.Quantity,
		PairId:   aliceOrderReq.PairId,
		Side:     xudrpc.OrderSide_SELL,
	}

	res, err := net.Bob.Client.PlaceOrderSync(ht.ctx, bobOrderReq)
	ht.assert.NoError(err)
	ht.assert.Len(res.InternalMatches, 0)
	ht.assert.Len(res.SwapSuccesses, 0)
	ht.assert.Len(res.SwapFailures, 1)
	ht.assert.Equal(res.SwapFailures[0].FailureReason, "SwapTimedOut")
	ht.assert.NotNil(res.RemainingOrder)
	ht.assert.Equal(res.RemainingOrder.GetLocalId(), bobOrderReq.OrderId)
	ht.assert.Equal(res.RemainingOrder.Quantity, bobOrderReq.Quantity)

	// Alice had shutdown so we'll get an error.
	e := <-aliceSwapFailuresChan
	ht.assert.EqualError(e.err, "rpc error: code = Unavailable desc = transport is closing")

	<-net.Alice.ProcessExit

	// Cleanup.

	removalRes, err := net.Bob.Client.RemoveOrder(ht.ctx, &xudrpc.RemoveOrderRequest{OrderId: bobOrderReq.OrderId})
	ht.assert.NoError(err)
	ht.assert.NotNil(removalRes)
	ht.assert.Equal(removalRes.QuantityOnHold, uint64(0))

	// Closing maker BTC channel and checking balance.

	err = closeBtcChannel(ht.ctx, net.LndBtcNetwork, net.Alice.LndBtcNode, aliceBtcChanPoint, false)
	ht.assert.NoError(err)

	onchainFeesThreshold := int64(20000)
	aliceBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	walletDiff := alicePrevBalance.btc.wallet.TotalBalance - aliceBalance.btc.wallet.TotalBalance
	ht.assert.True(walletDiff < onchainFeesThreshold,
		"alice btc wallet balance mismatch (prev: %v, current: %v)", alicePrevBalance.btc.wallet.TotalBalance, aliceBalance.btc.wallet.TotalBalance)

	// Closing taker LTC channel and checking balance.
	// First, find the pending HTLC expiration height.

	bobLtcChanList, err := net.Bob.LndLtcNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})
	ht.assert.Equal(len(bobLtcChanList.Channels), 1)
	bobChan := bobLtcChanList.Channels[0]
	ht.assert.True(bobChan.RemoteBalance == 0)
	ht.assert.True(bobChan.LocalBalance > 0)
	ht.assert.Equal(len(bobChan.PendingHtlcs), 1)
	expirationHeight := bobChan.PendingHtlcs[0].ExpirationHeight

	// Expire the HTLC.

	ltcInfo, err := net.LndLtcNetwork.LtcMiner.Node.GetInfo()
	ht.assert.NoError(err)
	_, err = net.LndLtcNetwork.LtcMiner.Node.Generate(expirationHeight - uint32(ltcInfo.Blocks))
	ht.assert.NoError(err)
	ltcInfo, err = net.LndLtcNetwork.LtcMiner.Node.GetInfo()
	ht.assert.True(ltcInfo.Blocks >= int32(expirationHeight))

	time.Sleep(25 * time.Second)

	// Verify channel was closed (by force-close, as the outgoing HTLC got expired).

	bobLtcChanList, err = net.Bob.LndLtcNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})
	ht.assert.Equal(len(bobLtcChanList.Channels), 0)

	// Wait for publishing CLTV-delayed HTLC output using timeout tx.

	_, err = net.LndLtcNetwork.LtcMiner.Node.Generate(1)
	ht.assert.NoError(err)

	time.Sleep(5 * time.Second)

	// Wait for HTLC output to be fully confirmed.

	_, err = net.LndLtcNetwork.LtcMiner.Node.Generate(6)
	ht.assert.NoError(err)

	time.Sleep(35 * time.Second)

	// Check balance.

	onchainFeesThreshold = int64(200000)
	bobBalance, err := getBalance(ht.ctx, net.Bob)
	ht.assert.NoError(err)
	walletDiff = bobPrevBalance.ltc.wallet.TotalBalance - bobBalance.ltc.wallet.TotalBalance
	ht.assert.True(walletDiff < onchainFeesThreshold,
		"bob ltc wallet balance mismatch (prev: %v, current: %v)", bobPrevBalance.ltc.wallet.TotalBalance, bobBalance.ltc.wallet.TotalBalance)
}

func testTakerStallingAfter2ndHTLC(net *xudtest.NetworkHarness, ht *harnessTest) {
	var err error
	net.Alice, err = net.SetCustomXud(net.Alice, "adversarial/breakswap", []string{"BREAKSWAP=TAKER_2ND_HTLC_STALL"})
	ht.assert.NoError(err)
	ht.act.init(net.Alice)

	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Place an order on Bob.
	bobOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "maker_order_id",
		Price:    0.02,
		Quantity: 1000000,
		PairId:   "LTC/BTC",
		Side:     xudrpc.OrderSide_BUY,
	}
	bobOrder := ht.act.placeOrderAndBroadcast(net.Bob, net.Alice, bobOrderReq)

	// Subscribe to swap failures on Bob before placing the matching order on Alice.
	bobSwapFailuresChan := subscribeSwapFailures(ht.ctx, net.Bob, false)

	// Place a matching order on Alice.
	aliceOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "taker_order_id",
		Price:    bobOrderReq.Price,
		Quantity: bobOrderReq.Quantity,
		PairId:   bobOrderReq.PairId,
		Side:     xudrpc.OrderSide_SELL,
	}
	res, err := net.Alice.Client.PlaceOrderSync(ht.ctx, aliceOrderReq)
	ht.assert.NoError(err)
	ht.assert.Len(res.InternalMatches, 0)
	ht.assert.Len(res.SwapSuccesses, 0)
	ht.assert.Len(res.SwapFailures, 1)
	ht.assert.Equal(res.SwapFailures[0].FailureReason, "SwapTimedOut")
	ht.assert.NotNil(res.RemainingOrder)
	ht.assert.Equal(res.RemainingOrder.GetLocalId(), aliceOrderReq.OrderId)
	ht.assert.Equal(res.RemainingOrder.Quantity, aliceOrderReq.Quantity)

	e := <-bobSwapFailuresChan
	ht.assert.NoError(e.err)
	ht.assert.NotNil(e.swapFailure)
	ht.assert.Equal(e.swapFailure.PeerPubKey, net.Alice.PubKey())
	ht.assert.Equal(e.swapFailure.FailureReason, "SwapTimedOut")
	ht.assert.Equal(e.swapFailure.OrderId, bobOrder.Id)

	// Cleanup.

	removalRes, err := net.Bob.Client.RemoveOrder(ht.ctx, &xudrpc.RemoveOrderRequest{OrderId: bobOrderReq.OrderId})
	ht.assert.NoError(err)
	ht.assert.NotNil(removalRes)
	ht.assert.Equal(removalRes.QuantityOnHold, uint64(0))

	removalRes, err = net.Alice.Client.RemoveOrder(ht.ctx, &xudrpc.RemoveOrderRequest{OrderId: aliceOrderReq.OrderId})
	ht.assert.NoError(err)
	ht.assert.NotNil(removalRes)
	ht.assert.Equal(removalRes.QuantityOnHold, uint64(0))

	ht.act.disconnect(net.Alice, net.Bob)
}

func testTakerShutdownAfter2ndHTLC(net *xudtest.NetworkHarness, ht *harnessTest) {
	var err error
	net.Alice, err = net.SetCustomXud(net.Alice, "adversarial/breakswap", []string{"BREAKSWAP=TAKER_2ND_HTLC_SHUTDOWN"})
	ht.assert.NoError(err)
	ht.act.init(net.Alice)

	alicePrevBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	bobPrevBalance, err := getBalance(ht.ctx, net.Bob)
	ht.assert.NoError(err)

	_, err = openBtcChannel(ht.ctx, net.LndBtcNetwork, net.Bob.LndBtcNode, net.Alice.LndBtcNode)
	ht.assert.NoError(err)
	aliceLtcChanPoint, err := openLtcChannel(ht.ctx, net.LndLtcNetwork, net.Alice.LndLtcNode, net.Bob.LndLtcNode)
	ht.assert.NoError(err)

	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Place an order on Bob.
	bobOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "maker_order_id",
		Price:    0.02,
		Quantity: 1000000,
		PairId:   "LTC/BTC",
		Side:     xudrpc.OrderSide_BUY,
	}
	bobOrder := ht.act.placeOrderAndBroadcast(net.Bob, net.Alice, bobOrderReq)

	// Subscribe to swap failures on Bob before placing the matching order on Alice.
	bobSwapFailuresChan := subscribeSwapFailures(ht.ctx, net.Bob, false)

	// Place a matching order on Alice.
	aliceOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "taker_order_id",
		Price:    bobOrderReq.Price,
		Quantity: bobOrderReq.Quantity,
		PairId:   bobOrderReq.PairId,
		Side:     xudrpc.OrderSide_SELL,
	}
	_, err = net.Alice.Client.PlaceOrderSync(ht.ctx, aliceOrderReq)
	ht.assert.Error(err)

	//<-net.Alice.ProcessExit

	e := <-bobSwapFailuresChan
	ht.assert.NoError(e.err)
	ht.assert.NotNil(e.swapFailure)
	ht.assert.Equal(e.swapFailure.PeerPubKey, net.Alice.PubKey())
	ht.assert.Equal(e.swapFailure.FailureReason, "SwapTimedOut")
	ht.assert.Equal(e.swapFailure.OrderId, bobOrder.Id)

	// Cleanup.

	removalRes, err := net.Bob.Client.RemoveOrder(ht.ctx, &xudrpc.RemoveOrderRequest{OrderId: bobOrderReq.OrderId})
	ht.assert.NoError(err)
	ht.assert.NotNil(removalRes)
	ht.assert.Equal(removalRes.QuantityOnHold, uint64(0))

	// Closing maker BTC channel and checking balance.
	// First, find the pending HTLC expiration height.

	bobBtcChanList, err := net.Bob.LndBtcNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})
	ht.assert.Equal(len(bobBtcChanList.Channels), 1)
	bobChan := bobBtcChanList.Channels[0]
	ht.assert.True(bobChan.RemoteBalance == 0)
	ht.assert.True(bobChan.LocalBalance > 0)
	ht.assert.Equal(len(bobChan.PendingHtlcs), 1)
	expirationHeight := bobChan.PendingHtlcs[0].ExpirationHeight

	// Expire the HTLC.

	btcInfo, err := net.LndBtcNetwork.BtcMiner.Node.GetInfo()
	ht.assert.NoError(err)
	_, err = net.LndBtcNetwork.BtcMiner.Node.Generate(expirationHeight - uint32(btcInfo.Blocks))
	ht.assert.NoError(err)
	btcInfo, err = net.LndBtcNetwork.BtcMiner.Node.GetInfo()
	ht.assert.True(btcInfo.Blocks >= int32(expirationHeight))

	time.Sleep(25 * time.Second)

	// Verify channel was closed (by force-close, as the outgoing HTLC got expired).

	bobBtcChanList, err = net.Bob.LndBtcNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})
	ht.assert.Equal(len(bobBtcChanList.Channels), 0)

	// Wait for publishing CLTV-delayed HTLC output using timeout tx.

	_, err = net.LndBtcNetwork.BtcMiner.Node.Generate(1)
	ht.assert.NoError(err)

	time.Sleep(5 * time.Second)

	// Wait for HTLC output to be fully confirmed.

	_, err = net.LndBtcNetwork.BtcMiner.Node.Generate(6)
	ht.assert.NoError(err)

	time.Sleep(35 * time.Second)

	// Check balance.

	onchainFeesThreshold := int64(200000)
	bobBalance, err := getBalance(ht.ctx, net.Bob)
	ht.assert.NoError(err)
	walletDiff := bobPrevBalance.btc.wallet.TotalBalance - bobBalance.btc.wallet.TotalBalance
	ht.assert.True(walletDiff < onchainFeesThreshold,
		"bob Btc wallet balance mismatch (prev: %v, current: %v)", bobPrevBalance.btc.wallet.TotalBalance, bobBalance.btc.wallet.TotalBalance)

	// Closing taker LTC channel and checking balance.
	// It has no pending HTLC because the maker cancelled his invoice after the swap timeout.

	err = closeLtcChannel(ht.ctx, net.LndLtcNetwork, net.Alice.LndLtcNode, aliceLtcChanPoint, false)
	ht.assert.NoError(err)

	onchainFeesThreshold = int64(200000)
	aliceBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	walletDiff = alicePrevBalance.ltc.wallet.TotalBalance - aliceBalance.ltc.wallet.TotalBalance
	ht.assert.True(walletDiff < onchainFeesThreshold,
		"alice ltc wallet balance mismatch (prev: %v, current: %v)", alicePrevBalance.ltc.wallet.TotalBalance, aliceBalance.ltc.wallet.TotalBalance)
}

func testTakerStallingAfterSwapSucceeded(net *xudtest.NetworkHarness, ht *harnessTest) {
	var err error
	net.Alice, err = net.SetCustomXud(net.Alice, "adversarial/breakswap", []string{"BREAKSWAP=TAKER_SWAPSUCCEEDED_STALL"})
	ht.assert.NoError(err)
	ht.act.init(net.Alice)

	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Place an order on Bob.
	bobOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "maker_order_id",
		Price:    0.02,
		Quantity: 1000000,
		PairId:   "LTC/BTC",
		Side:     xudrpc.OrderSide_BUY,
	}
	bobOrder := ht.act.placeOrderAndBroadcast(net.Bob, net.Alice, bobOrderReq)

	// Subscribe to swap failures on Bob before placing the matching order on Alice.
	bobSwapsChan := subscribeSwaps(ht.ctx, net.Bob, false)

	// Place a matching order on Alice.
	aliceOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "taker_order_id",
		Price:    bobOrderReq.Price,
		Quantity: bobOrderReq.Quantity,
		PairId:   bobOrderReq.PairId,
		Side:     xudrpc.OrderSide_SELL,
	}
	res, err := net.Alice.Client.PlaceOrderSync(ht.ctx, aliceOrderReq)
	ht.assert.NoError(err)
	ht.assert.Len(res.InternalMatches, 0)
	ht.assert.Len(res.SwapSuccesses, 1)
	ht.assert.Len(res.SwapFailures, 0)
	ht.assert.Nil(res.RemainingOrder)

	e := <-bobSwapsChan
	ht.assert.NoError(e.err)
	ht.assert.NotNil(e.swap)
	ht.assert.Equal(e.swap.PeerPubKey, net.Alice.PubKey())
	ht.assert.Equal(e.swap.OrderId, bobOrder.Id)

	// Cleanup.

	ht.act.disconnect(net.Alice, net.Bob)
}
