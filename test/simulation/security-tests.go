package main

import (
	"github.com/ExchangeUnion/xud-simulation/xudrpc"
	"github.com/ExchangeUnion/xud-simulation/xudtest"
	"time"
)

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

	//_, err = net.LndBtcNetwork.BtcMiner.Node.Generate(1)
	//ht.assert.NoError(err)
}

func testMakerShutdownAfter1stHTLC(net *xudtest.NetworkHarness, ht *harnessTest) {
	var err error
	net.Alice, err = net.SetCustomXud(net.Alice, "adversarial/breakswap", []string{"BREAKSWAP=MAKER_1ST_HTLC_SHUTDOWN"})
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

	// Cleanup.

	removalRes, err := net.Bob.Client.RemoveOrder(ht.ctx, &xudrpc.RemoveOrderRequest{OrderId: bobOrderReq.OrderId})
	ht.assert.NoError(err)
	ht.assert.NotNil(removalRes)
	ht.assert.Equal(removalRes.QuantityOnHold, uint64(0))

	time.Sleep(2 * time.Second)

	_, err = net.LndLtcNetwork.LtcMiner.Node.Generate(1000)
	ht.assert.NoError(err)

	err = net.Alice.LndBtcNode.WaitForBlockchainSync(ht.ctx)
	ht.assert.NoError(err)

	err = net.Bob.LndBtcNode.WaitForBlockchainSync(ht.ctx)
	ht.assert.NoError(err)

	time.Sleep(2 * time.Second)
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

	time.Sleep(5 * time.Second)

	_, err = net.LndBtcNetwork.BtcMiner.Node.Generate(1)
	ht.assert.NoError(err)

	err = net.Alice.LndBtcNode.WaitForBlockchainSync(ht.ctx)
	ht.assert.NoError(err)

	err = net.Bob.LndBtcNode.WaitForBlockchainSync(ht.ctx)
	ht.assert.NoError(err)

	time.Sleep(5 * time.Second)
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
