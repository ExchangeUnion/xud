package main

import (
	"time"

	"github.com/ExchangeUnion/xud-simulation/lntest"
	"github.com/ExchangeUnion/xud-simulation/xudrpc"
	"github.com/ExchangeUnion/xud-simulation/xudtest"
	"github.com/lightningnetwork/lnd/lnrpc"
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
		name: "taker stalling after 2nd htlc",
		test: testTakerStallingAfter2ndHTLC,
	},
	{
		name: "taker shutdown after 2nd htlc",
		test: testTakerShutdownAfter2ndHTLC,
	},
}

func waitForChannelClose(lndNode *lntest.HarnessNode, ht *harnessTest) {
	// Verify channel was closed (by force-close, as the outgoing HTLC got expired).
	attempts := 0
	chanList, err := lndNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})

	ht.assert.NoError(err)

	for len(chanList.Channels) > 0 && attempts < 60 {
		time.Sleep(5 * time.Second)
		chanList, err = lndNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})
		attempts++
	}

	ht.assert.NoError(err)
	ht.assert.Equal(len(chanList.Channels), 0)
}

func testTakerStallingOnSwapAccepted(net *xudtest.NetworkHarness, ht *harnessTest) {
	var err error
	net.Alice, err = net.SetCustomXud(ht.ctx, ht, net.Alice, []string{"CUSTOM_SCENARIO=SECURITY::TAKER_SWAPACCEPTED_STALL"})
	ht.assert.NoError(err)
	ht.act.init(net.Alice)

	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Place an order on Bob.
	bobOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "taker_stalling_on_swap_accepted",
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
		OrderId:  "taker_stalling_on_swap_accepted",
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
	ht.assert.Equal(e.swapFailure.FailureReason, "DealTimedOut")
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
	net.Alice, err = net.SetCustomXud(ht.ctx, ht, net.Alice, []string{"CUSTOM_SCENARIO=SECURITY::MAKER_1ST_HTLC_STALL"})
	ht.assert.NoError(err)
	ht.act.init(net.Alice)

	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Place an order on Alice.
	aliceOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "maker_stalling_after_1st_htlc",
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
		OrderId:  "maker_stalling_after_1st_htlc",
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
	ht.assert.True(res.SwapFailures[0].FailureReason == "SwapTimedOut" || res.SwapFailures[0].FailureReason == "PaymentRejected")
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
	net.Alice, err = net.SetCustomXud(ht.ctx, ht, net.Alice, []string{"CUSTOM_SCENARIO=SECURITY::MAKER_1ST_HTLC_SHUTDOWN"})
	ht.assert.NoError(err)
	ht.act.init(net.Alice)

	alicePrevBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	bobPrevBalance, err := getBalance(ht.ctx, net.Bob)
	ht.assert.NoError(err)

	amt := int64(15000000)
	pushAmt := int64(7500000)
	aliceBtcChanPoint, err := openBtcChannel(ht.ctx, net.LndBtcNetwork, net.Alice.LndBtcNode, net.Bob.LndBtcNode, amt, pushAmt)
	ht.assert.NoError(err)
	_, err = openLtcChannel(ht.ctx, net.LndLtcNetwork, net.Bob.LndLtcNode, net.Alice.LndLtcNode, amt, pushAmt)
	ht.assert.NoError(err)

	bobPrevLtcChanList, err := net.Bob.LndLtcNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})
	ht.assert.NoError(err)
	ht.assert.Equal(len(bobPrevLtcChanList.Channels), 1)
	bobPrevLtcChan := bobPrevLtcChanList.Channels[0]

	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Place an order on Alice.
	aliceOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "maker_shutdown_after_1st_htlc",
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
		OrderId:  "maker_shutdown_after_1st_htlc",
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

	onchainFeesThreshold := int64(200000)
	aliceBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	walletDiff := alicePrevBalance.btc.wallet.TotalBalance - aliceBalance.btc.wallet.TotalBalance - pushAmt
	ht.assert.True(walletDiff < onchainFeesThreshold,
		"alice btc wallet balance mismatch (prev: %v, current: %v)", alicePrevBalance.btc.wallet.TotalBalance, aliceBalance.btc.wallet.TotalBalance)

	// Closing taker LTC channel and checking balance.
	// First, find the pending HTLC expiration height.

	bobLtcChanList, err := net.Bob.LndLtcNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})
	ht.assert.Equal(len(bobLtcChanList.Channels), 1)
	bobLtcChan := bobLtcChanList.Channels[0]
	ht.assert.Greater(bobPrevLtcChan.LocalBalance-bobLtcChan.LocalBalance, int64(bobOrderReq.Quantity))
	ht.assert.Equal(bobPrevLtcChan.RemoteBalance, bobLtcChan.RemoteBalance)
	ht.assert.Equal(len(bobLtcChan.PendingHtlcs), 1)
	expirationHeight := bobLtcChan.PendingHtlcs[0].ExpirationHeight

	// Expire the HTLC.

	ltcInfo, err := net.LndLtcNetwork.LtcMiner.Node.GetInfo()
	ht.assert.NoError(err)
	_, err = net.LndLtcNetwork.LtcMiner.Node.Generate(expirationHeight - uint32(ltcInfo.Blocks))
	ht.assert.NoError(err)
	ltcInfo, err = net.LndLtcNetwork.LtcMiner.Node.GetInfo()
	ht.assert.True(ltcInfo.Blocks >= int32(expirationHeight))

	// Verify channel was closed (by force-close, as the outgoing HTLC got expired).

	waitForChannelClose(net.Bob.LndLtcNode, ht)

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
	walletDiff = bobPrevBalance.ltc.wallet.TotalBalance - bobBalance.ltc.wallet.TotalBalance - pushAmt
	ht.assert.True(walletDiff < onchainFeesThreshold,
		"bob ltc wallet balance mismatch (prev: %v, current: %v)", bobPrevBalance.ltc.wallet.TotalBalance, bobBalance.ltc.wallet.TotalBalance)
}

func testTakerStallingAfter2ndHTLC(net *xudtest.NetworkHarness, ht *harnessTest) {
	var err error
	net.Alice, err = net.SetCustomXud(ht.ctx, ht, net.Alice, []string{"CUSTOM_SCENARIO=SECURITY::TAKER_2ND_HTLC_STALL"})
	ht.assert.NoError(err)
	ht.act.init(net.Alice)

	alicePrevBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	bobPrevBalance, err := getBalance(ht.ctx, net.Bob)
	ht.assert.NoError(err)

	amt := int64(15000000)
	pushAmt := int64(7500000)
	aliceLtcChanPoint, err := openLtcChannel(ht.ctx, net.LndLtcNetwork, net.Alice.LndLtcNode, net.Bob.LndLtcNode, amt, pushAmt)
	ht.assert.NoError(err)
	_, err = openBtcChannel(ht.ctx, net.LndBtcNetwork, net.Bob.LndBtcNode, net.Alice.LndBtcNode, amt, pushAmt)
	ht.assert.NoError(err)

	alicePrevLtcChanList, err := net.Alice.LndLtcNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})
	ht.assert.NoError(err)
	ht.assert.Equal(len(alicePrevLtcChanList.Channels), 1)
	alicePrevLtcChan := alicePrevLtcChanList.Channels[0]

	bobPrevBtcChanList, err := net.Bob.LndBtcNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})
	ht.assert.NoError(err)
	ht.assert.Equal(len(bobPrevBtcChanList.Channels), 1)
	bobPrevBtcChan := bobPrevBtcChanList.Channels[0]

	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Place an order on Bob.
	bobOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "taker_stalling_2nd_htlc",
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
		OrderId:  "taker_stalling_2nd_htlc",
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

	// Cleanup.

	removalRes, err := net.Alice.Client.RemoveOrder(ht.ctx, &xudrpc.RemoveOrderRequest{OrderId: aliceOrderReq.OrderId})
	ht.assert.NoError(err)
	ht.assert.NotNil(removalRes)
	ht.assert.Equal(removalRes.QuantityOnHold, uint64(0))

	// Closing maker BTC channel and checking balance.
	// First, find the pending HTLC expiration height.

	bobBtcChanList, err := net.Bob.LndBtcNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})
	ht.assert.Equal(len(bobBtcChanList.Channels), 1)
	bobBtcChan := bobBtcChanList.Channels[0]
	ht.assert.Greater(bobPrevBtcChan.LocalBalance-bobBtcChan.LocalBalance, int64(float64(bobOrderReq.Quantity)*bobOrderReq.Price))
	ht.assert.Equal(bobPrevBtcChan.RemoteBalance, bobBtcChan.RemoteBalance)
	ht.assert.Equal(len(bobBtcChan.PendingHtlcs), 1)
	expirationHeight := bobBtcChan.PendingHtlcs[0].ExpirationHeight

	// Expire the HTLC.

	btcInfo, err := net.LndBtcNetwork.BtcMiner.Node.GetInfo()
	ht.assert.NoError(err)
	_, err = net.LndBtcNetwork.BtcMiner.Node.Generate(expirationHeight - uint32(btcInfo.Blocks))
	ht.assert.NoError(err)
	btcInfo, err = net.LndBtcNetwork.BtcMiner.Node.GetInfo()
	ht.assert.True(btcInfo.Blocks >= int32(expirationHeight))

	// Verify channel was closed (by force-close, as the outgoing HTLC got expired).

	waitForChannelClose(net.Bob.LndBtcNode, ht)

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
	walletDiff := bobPrevBalance.btc.wallet.TotalBalance - bobBalance.btc.wallet.TotalBalance - pushAmt
	ht.assert.True(walletDiff < onchainFeesThreshold,
		"bob Btc wallet balance mismatch (prev: %v, current: %v)", bobPrevBalance.btc.wallet.TotalBalance, bobBalance.btc.wallet.TotalBalance)

	e := <-bobSwapFailuresChan
	ht.assert.NoError(e.err)
	ht.assert.NotNil(e.swapFailure)
	ht.assert.Equal(e.swapFailure.PeerPubKey, net.Alice.PubKey())
	ht.assert.Equal(e.swapFailure.FailureReason, "SendPaymentFailure")
	ht.assert.Equal(e.swapFailure.OrderId, bobOrder.Id)

	// After Bob's outgoing BTC payment fails, he should cancel the invoice
	// for the incoming LTC payment since he's no longer at risk of losing funds

	aliceLtcChanList, err := net.Alice.LndLtcNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})
	ht.assert.Equal(len(aliceLtcChanList.Channels), 1)
	aliceLtcChan := aliceLtcChanList.Channels[0]
	ht.assert.Equal(alicePrevLtcChan.LocalBalance, aliceLtcChan.LocalBalance)
	ht.assert.Equal(alicePrevLtcChan.RemoteBalance, aliceLtcChan.RemoteBalance)
	ht.assert.Equal(len(aliceLtcChan.PendingHtlcs), 0)

	// Closing taker LTC channel and checking balance.
	// It has no pending HTLC because the maker cancelled his invoice after the swap timeout.

	err = closeLtcChannel(ht.ctx, net.LndLtcNetwork, net.Alice.LndLtcNode, aliceLtcChanPoint, false)
	ht.assert.NoError(err)

	// Check LTC balance

	onchainFeesThreshold = int64(200000)
	aliceBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	walletDiff = alicePrevBalance.ltc.wallet.TotalBalance - aliceBalance.ltc.wallet.TotalBalance - pushAmt
	ht.assert.True(walletDiff < onchainFeesThreshold,
		"alice ltc wallet balance mismatch (prev: %v, current: %v)", alicePrevBalance.ltc.wallet.TotalBalance, aliceBalance.ltc.wallet.TotalBalance)

	removalRes, err = net.Bob.Client.RemoveOrder(ht.ctx, &xudrpc.RemoveOrderRequest{OrderId: bobOrderReq.OrderId})
	ht.assert.NoError(err)
	ht.assert.NotNil(removalRes)
	ht.assert.Equal(removalRes.QuantityOnHold, uint64(0))
}

func testTakerShutdownAfter2ndHTLC(net *xudtest.NetworkHarness, ht *harnessTest) {
	var err error
	net.Alice, err = net.SetCustomXud(ht.ctx, ht, net.Alice, []string{"CUSTOM_SCENARIO=SECURITY::TAKER_2ND_HTLC_SHUTDOWN"})
	ht.assert.NoError(err)
	ht.act.init(net.Alice)

	alicePrevBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	bobPrevBalance, err := getBalance(ht.ctx, net.Bob)
	ht.assert.NoError(err)

	amt := int64(15000000)
	pushAmt := int64(7500000)
	aliceLtcChanPoint, err := openLtcChannel(ht.ctx, net.LndLtcNetwork, net.Alice.LndLtcNode, net.Bob.LndLtcNode, amt, pushAmt)
	ht.assert.NoError(err)
	_, err = openBtcChannel(ht.ctx, net.LndBtcNetwork, net.Bob.LndBtcNode, net.Alice.LndBtcNode, amt, pushAmt)
	ht.assert.NoError(err)

	alicePrevLtcChanList, err := net.Alice.LndLtcNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})
	ht.assert.NoError(err)
	ht.assert.Equal(len(alicePrevLtcChanList.Channels), 1)
	alicePrevLtcChan := alicePrevLtcChanList.Channels[0]

	bobPrevBtcChanList, err := net.Bob.LndBtcNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})
	ht.assert.NoError(err)
	ht.assert.Equal(len(bobPrevBtcChanList.Channels), 1)
	bobPrevBtcChan := bobPrevBtcChanList.Channels[0]

	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Place an order on Bob.
	bobOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "taker_shutdown_after_2nd_htlc",
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
		OrderId:  "taker_shutdown_after_2nd_htlc",
		Price:    bobOrderReq.Price,
		Quantity: bobOrderReq.Quantity,
		PairId:   bobOrderReq.PairId,
		Side:     xudrpc.OrderSide_SELL,
	}
	_, err = net.Alice.Client.PlaceOrderSync(ht.ctx, aliceOrderReq)
	ht.assert.Error(err)

	// Cleanup.

	// Closing maker BTC channel and checking balance.
	// First, find the pending HTLC expiration height.

	bobBtcChanList, err := net.Bob.LndBtcNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})
	ht.assert.Equal(len(bobBtcChanList.Channels), 1)
	bobBtcChan := bobBtcChanList.Channels[0]
	ht.assert.Greater(bobPrevBtcChan.LocalBalance-bobBtcChan.LocalBalance, int64(float64(bobOrderReq.Quantity)*bobOrderReq.Price))
	ht.assert.Equal(bobPrevBtcChan.RemoteBalance, bobBtcChan.RemoteBalance)
	ht.assert.Equal(len(bobBtcChan.PendingHtlcs), 1)
	expirationHeight := bobBtcChan.PendingHtlcs[0].ExpirationHeight

	// Expire the BTC HTLC.

	btcInfo, err := net.LndBtcNetwork.BtcMiner.Node.GetInfo()
	ht.assert.NoError(err)
	_, err = net.LndBtcNetwork.BtcMiner.Node.Generate(expirationHeight - uint32(btcInfo.Blocks))
	ht.assert.NoError(err)
	btcInfo, err = net.LndBtcNetwork.BtcMiner.Node.GetInfo()
	ht.assert.True(btcInfo.Blocks >= int32(expirationHeight))

	// Verify BTC channel was closed (by force-close, as the outgoing HTLC got expired).

	waitForChannelClose(net.Bob.LndBtcNode, ht)

	// Wait for publishing CLTV-delayed BTC HTLC output using timeout tx.

	_, err = net.LndBtcNetwork.BtcMiner.Node.Generate(1)
	ht.assert.NoError(err)

	time.Sleep(5 * time.Second)

	// Wait for BTC HTLC output to be fully confirmed.

	_, err = net.LndBtcNetwork.BtcMiner.Node.Generate(6)
	ht.assert.NoError(err)

	time.Sleep(35 * time.Second)

	// Check BTC balance.

	onchainFeesThreshold := int64(200000)
	bobBalance, err := getBalance(ht.ctx, net.Bob)
	ht.assert.NoError(err)
	walletDiff := bobPrevBalance.btc.wallet.TotalBalance - bobBalance.btc.wallet.TotalBalance - pushAmt
	ht.assert.True(walletDiff < onchainFeesThreshold,
		"bob Btc wallet balance mismatch (prev: %v, current: %v)", bobPrevBalance.btc.wallet.TotalBalance, bobBalance.btc.wallet.TotalBalance)

	// Wait for swap to fail

	e := <-bobSwapFailuresChan
	ht.assert.NoError(e.err)
	ht.assert.NotNil(e.swapFailure)
	ht.assert.Equal(e.swapFailure.PeerPubKey, net.Alice.PubKey())
	ht.assert.Equal(e.swapFailure.FailureReason, "SendPaymentFailure")
	ht.assert.Equal(e.swapFailure.OrderId, bobOrder.Id)

	// After Bob's outgoing BTC payment fails, he should cancel the invoice
	// for the incoming LTC payment since he's no longer at risk of losing funds

	aliceLtcChanList, err := net.Alice.LndLtcNode.ListChannels(ht.ctx, &lnrpc.ListChannelsRequest{})
	ht.assert.Equal(len(aliceLtcChanList.Channels), 1)
	aliceLtcChan := aliceLtcChanList.Channels[0]
	ht.assert.Equal(alicePrevLtcChan.LocalBalance, aliceLtcChan.LocalBalance)
	ht.assert.Equal(alicePrevLtcChan.RemoteBalance, aliceLtcChan.RemoteBalance)
	ht.assert.Equal(len(aliceLtcChan.PendingHtlcs), 0)

	// Closing taker LTC channel and checking balance.
	// It has no pending HTLC because the maker cancelled his invoice after the swap timeout.

	err = closeLtcChannel(ht.ctx, net.LndLtcNetwork, net.Alice.LndLtcNode, aliceLtcChanPoint, false)
	ht.assert.NoError(err)

	// Check LTC balance

	onchainFeesThreshold = int64(200000)
	aliceBalance, err := getBalance(ht.ctx, net.Alice)
	ht.assert.NoError(err)
	walletDiff = alicePrevBalance.ltc.wallet.TotalBalance - aliceBalance.ltc.wallet.TotalBalance - pushAmt
	ht.assert.True(walletDiff < onchainFeesThreshold,
		"alice ltc wallet balance mismatch (prev: %v, current: %v)", alicePrevBalance.ltc.wallet.TotalBalance, aliceBalance.ltc.wallet.TotalBalance)

	removalRes, err := net.Bob.Client.RemoveOrder(ht.ctx, &xudrpc.RemoveOrderRequest{OrderId: bobOrderReq.OrderId})
	ht.assert.NoError(err)
	ht.assert.NotNil(removalRes)
	ht.assert.Equal(removalRes.QuantityOnHold, uint64(0))
}

func testTakerStallingAfterSwapSucceeded(net *xudtest.NetworkHarness, ht *harnessTest) {
	var err error
	net.Alice, err = net.SetCustomXud(ht.ctx, ht, net.Alice, []string{"CUSTOM_SCENARIO=SECURITY::TAKER_SWAPSUCCEEDED_STALL"})
	ht.assert.NoError(err)
	ht.act.init(net.Alice)

	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Place an order on Bob.
	bobOrderReq := &xudrpc.PlaceOrderRequest{
		OrderId:  "taker_stalling_after_swap_succeeded",
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
		OrderId:  "taker_stalling_after_swap_succeeded",
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
