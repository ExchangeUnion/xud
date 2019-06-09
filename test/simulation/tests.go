package main

import (
	"context"
	"errors"
	"fmt"
	"github.com/ExchangeUnion/xud-simulation/xudrpc"
	"github.com/ExchangeUnion/xud-simulation/xudtest"
	"github.com/stretchr/testify/require"
	"time"
)

// testNetworkInit implements:
// 1) Verify connectivity to swap clients of all nodes.
// 2) Add currencies and pairs to all nodes.

// testNetworkInit must be the first test case to be run, and the only one
// allowed to alter the nodes critical state (peers, order book, etc.).
// All following test cases must cleanup their changes before finishing
// so that test cases would be stateless and won't be affected
// by their preceding ones.
func testNetworkInit(net *xudtest.NetworkHarness, ht *harnessTest) {
	for _, node := range net.ActiveNodes {
		// Verify connectivity.
		timeout := time.Now().Add(10 * time.Second)
		for {
			req := &xudrpc.GetInfoRequest{}
			res, err := node.Client.GetInfo(ht.ctx, req)
			ht.assert.NoError(err)
			if len(res.Lnd["BTC"].Chains) == 1 && len(res.Lnd["LTC"].Chains) == 1 {
				ht.assert.Equal(res.Lnd["BTC"].Chains[0].Chain, "bitcoin")
				ht.assert.Equal(res.Lnd["BTC"].Chains[0].Network, "simnet")
				ht.assert.Equal(res.Lnd["LTC"].Chains[0].Chain, "litecoin")
				ht.assert.Equal(res.Lnd["LTC"].Chains[0].Network, "simnet")
				// Set the node public key.
				node.SetPubKey(res.NodePubKey)
				// Add pair to the node.
				ht.act.addPair(node, "LTC", "BTC", xudrpc.AddCurrencyRequest_LND)
				break
			}
			ht.assert.False(time.Now().After(timeout), "waiting for synced chains timeout")
			// retry interval
			time.Sleep(100 * time.Millisecond)
		}
	}
}

// testP2PDiscovery implements:
// Connect Alice to Bob, Bob to Carol, Dave to Carol. After a short while, all of them should end up connected.
func testP2PDiscovery(net *xudtest.NetworkHarness, ht *harnessTest) {
	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Connect Bob to Carol.
	ht.act.connect(net.Bob, net.Carol)
	ht.act.verifyConnectivity(net.Bob, net.Carol)

	// Carol should hear about Alice from Bob,
	// and should end up connected to her.
	time.Sleep(1 * time.Second)
	ht.act.verifyConnectivity(net.Alice, net.Carol)

	// Connect Dave to Carol.
	ht.act.connect(net.Dave, net.Carol)
	ht.act.verifyConnectivity(net.Dave, net.Carol)

	// Dave should hear about Alice and Bob from Carol,
	// and should end up connected to them.
	time.Sleep(1 * time.Second)
	ht.act.verifyConnectivity(net.Alice, net.Dave)
	ht.act.verifyConnectivity(net.Bob, net.Dave)

	// Cleanup.
	ht.act.disconnect(net.Alice, net.Bob)
	ht.act.disconnect(net.Alice, net.Carol)
	ht.act.disconnect(net.Alice, net.Dave)
	ht.act.disconnect(net.Bob, net.Carol)
	ht.act.disconnect(net.Bob, net.Dave)
	ht.act.disconnect(net.Carol, net.Dave)
}

// testP2PIncorrectPubKey implements:
// Alice connects to Bob expecting an incorrect public key.
// Bob should reject the connection due to auth invalid target.
func testP2PIncorrectPubKey(net *xudtest.NetworkHarness, ht *harnessTest) {
	// Alice connects to Bob while expecting an incorrect public key.
	incorrectPubKey := net.Bob.PubKey() + "Q"
	destNodeURI := fmt.Sprintf("%v@%v", incorrectPubKey, net.Bob.Cfg.P2PAddr())
	reqConn := &xudrpc.ConnectRequest{NodeUri: destNodeURI}

	// Bob should reject the connection since Alice signed her handshake data
	// specifying a different public key target then his.
	_, err := net.Alice.Client.Connect(ht.ctx, reqConn)
	ht.assert.Error(err)
	ht.assert.Contains(err.Error(), fmt.Sprintf(
		"Peer (%v) disconnected from us due to AuthFailureInvalidTarget", net.Bob.Cfg.P2PAddr()))
}

// testP2PBanUnban implements:
// 1) If Alice ban Bob, connection attempts from both directions should fail.
// 2) if Alice unban Bob, connection attempts from both directions should succeed.
func testP2PBanUnban(net *xudtest.NetworkHarness, ht *harnessTest) {
	// Alice to ban Bob.
	ht.act.ban(net.Alice, net.Bob)

	// Alice should not attempt to connect to Bob while he is banned.
	reqConn := &xudrpc.ConnectRequest{NodeUri: net.Bob.NodeURI()}
	_, err := net.Alice.Client.Connect(ht.ctx, reqConn)
	ht.assert.Error(err)
	ht.assert.Contains(err.Error(), fmt.Sprintf(
		"could not connect to node %v because it is banned", net.Bob.PubKey()))

	// If Bob connects to Alice, he should get rejected.
	reqConn = &xudrpc.ConnectRequest{NodeUri: net.Alice.NodeURI()}
	_, err = net.Bob.Client.Connect(ht.ctx, reqConn)
	ht.assert.Error(err)
	ht.assert.Contains(err.Error(), fmt.Sprintf(
		" Peer (%v) disconnected from us due to Banned", net.Alice.Cfg.P2PAddr()))

	// After Alice unban Bob, connection attempts from both directions should succeed.
	ht.act.unban(net.Alice, net.Bob)
	ht.act.connect(net.Alice, net.Bob)
	ht.act.disconnect(net.Alice, net.Bob)
	ht.act.connect(net.Bob, net.Alice)

	// Cleanup.
	ht.act.disconnect(net.Alice, net.Bob)
}

// testP2PAlreadyConnected implements:
// If Alice and Bob are already connected, connection attempts from both directions should fail.
func testP2PAlreadyConnected(net *xudtest.NetworkHarness, ht *harnessTest) {
	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Alice should not attempt to connect to Bob while they are already connected.
	reqConn := &xudrpc.ConnectRequest{NodeUri: net.Bob.NodeURI()}
	_, err := net.Alice.Client.Connect(ht.ctx, reqConn)
	ht.assert.Error(err)
	ht.assert.Contains(err.Error(), fmt.Sprintf(
		"node %v at %v already connected", net.Bob.PubKey(), net.Bob.Cfg.P2PAddr()))

	// Bob should not attempt to connect to Alice while they are already connected.
	reqConn = &xudrpc.ConnectRequest{NodeUri: net.Alice.NodeURI()}
	_, err = net.Bob.Client.Connect(ht.ctx, reqConn)
	ht.assert.Error(err)
	ht.assert.Contains(err.Error(), fmt.Sprintf(
		"node %v at %v already connected", net.Alice.PubKey(), net.Alice.Cfg.P2PAddr()))

	// Cleanup.
	ht.act.disconnect(net.Alice, net.Bob)
}

// testOrderBroadcastAndInvalidation implements:
// 1) Placed order should get broadcasted over the network, and added to connected peers' order books.
// 2) Removed order should get invalidated over the network, and removed from connected peers' order books.
func testOrderBroadcastAndInvalidation(net *xudtest.NetworkHarness, ht *harnessTest) {
	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	req := &xudrpc.PlaceOrderRequest{
		Price:    0.02,
		Quantity: 1000000,
		PairId:   "LTC/BTC",
		OrderId:  "random_order_id",
		Side:     xudrpc.OrderSide_BUY,
	}

	order := ht.act.placeOrderAndBroadcast(net.Alice, net.Bob, req)
	ht.act.removeOrderAndInvalidate(net.Alice, net.Bob, order)

	// Cleanup.
	ht.act.disconnect(net.Alice, net.Bob)
}

func testOrderMatchingAndSwap(net *xudtest.NetworkHarness, ht *harnessTest) {
	// Connect Alice to Bob.
	ht.act.connect(net.Alice, net.Bob)
	ht.act.verifyConnectivity(net.Alice, net.Bob)

	// Place an order on Alice.
	req := &xudrpc.PlaceOrderRequest{
		OrderId:  "maker_order_id",
		Price:    0.02,
		Quantity: 1000000,
		PairId:   "LTC/BTC",
		Side:     xudrpc.OrderSide_BUY,
	}
	ht.act.placeOrderAndBroadcast(net.Alice, net.Bob, req)

	// Place a matching order on Bob.
	req = &xudrpc.PlaceOrderRequest{
		OrderId:  "taker_order_id",
		Price:    req.Price,
		Quantity: req.Quantity,
		PairId:   req.PairId,
		Side:     xudrpc.OrderSide_SELL,
	}
	ht.act.placeOrderAndSwap(net.Bob, net.Alice, req)

	// Cleanup.
	ht.act.disconnect(net.Alice, net.Bob)
}

// actions provide self-contained reusable scenarios to be used in tests.
// each action performs its expected success/failure assertions by its own.
type actions struct {
	// assert provides assertion methods to stop test execution upon failure.
	assert *require.Assertions

	// ctx is the context for the test scenario.
	ctx context.Context
}

func (a *actions) addPair(node *xudtest.HarnessNode, baseCurrency string, quoteCurrency string,
	swapClient xudrpc.AddCurrencyRequest_SwapClient) {
	// Check the current number of pairs.
	resInfo, err := node.Client.GetInfo(a.ctx, &xudrpc.GetInfoRequest{})
	a.assert.NoError(err)

	prevNumPairs := resInfo.NumPairs

	// Add currencies.
	reqAddCurr := &xudrpc.AddCurrencyRequest{Currency: baseCurrency, SwapClient: swapClient}
	_, err = node.Client.AddCurrency(a.ctx, reqAddCurr)
	a.assert.NoError(err)

	reqAddCurr = &xudrpc.AddCurrencyRequest{Currency: quoteCurrency, SwapClient: swapClient}
	_, err = node.Client.AddCurrency(a.ctx, reqAddCurr)
	a.assert.NoError(err)

	// Add pair.
	reqAddPair := &xudrpc.AddPairRequest{BaseCurrency: baseCurrency, QuoteCurrency: quoteCurrency}
	_, err = node.Client.AddPair(a.ctx, reqAddPair)
	a.assert.NoError(err)

	// Verify that pair was added.
	resGetInfo, err := node.Client.GetInfo(a.ctx, &xudrpc.GetInfoRequest{})
	a.assert.NoError(err)
	a.assert.Equal(resGetInfo.NumPairs, prevNumPairs+1)
}

func (a *actions) connect(srcNode, destNode *xudtest.HarnessNode) {
	destNodeURI := fmt.Sprintf("%v@%v",
		destNode.PubKey(),
		destNode.Cfg.P2PAddr(),
	)

	// connect srcNode to destNode.
	reqConn := &xudrpc.ConnectRequest{NodeUri: destNodeURI}
	_, err := srcNode.Client.Connect(a.ctx, reqConn)
	a.assert.NoError(err)
}

func (a *actions) disconnect(srcNode, destNode *xudtest.HarnessNode) {
	a.ban(srcNode, destNode)
	a.unban(srcNode, destNode)
}

func (a *actions) ban(srcNode, destNode *xudtest.HarnessNode) {
	reqBan := &xudrpc.BanRequest{NodePubKey: destNode.PubKey()}
	_, err := srcNode.Client.Ban(a.ctx, reqBan)
	a.assert.NoError(err)
}

func (a *actions) unban(srcNode, destNode *xudtest.HarnessNode) {
	reqUnban := &xudrpc.UnbanRequest{NodePubKey: destNode.PubKey(), Reconnect: false}
	_, err := srcNode.Client.Unban(a.ctx, reqUnban)
	a.assert.NoError(err)
}

func (a *actions) placeOrderAndBroadcast(srcNode, destNode *xudtest.HarnessNode,
	req *xudrpc.PlaceOrderRequest) *xudrpc.Order {
	// Subscribe to added orders on destNode
	destNodeOrderChan := subscribeOrders(a.ctx, destNode)

	// Fetch nodes current order book state.
	prevSrcNodeCount, prevDestNodeCount, err := getOrdersCount(a.ctx, srcNode, destNode)
	a.assert.NoError(err)

	// Place the order on srcNode and verify the result.
	res, err := srcNode.Client.PlaceOrderSync(a.ctx, req)
	a.assert.NoError(err)

	// Verify the response.
	a.assert.Len(res.InternalMatches, 0)
	a.assert.Len(res.SwapSuccesses, 0)
	a.assert.Len(res.SwapFailures, 0)
	a.assert.NotNil(res.RemainingOrder)
	a.assert.NotEqual(res.RemainingOrder.Id, req.OrderId)
	a.assert.IsType(new(xudrpc.Order_LocalId), res.RemainingOrder.OwnOrPeer)
	a.assert.Equal(res.RemainingOrder.OwnOrPeer.(*xudrpc.Order_LocalId).LocalId, req.OrderId)

	// Retrieve and verify the added order event on destNode.
	e := <-destNodeOrderChan
	a.assert.NoError(e.err)
	a.assert.NotNil(e.orderUpdate)
	peerOrder := e.orderUpdate.GetOrder()

	// Verify the peer order.
	a.assert.NotEqual(peerOrder.Id, req.OrderId) // Local id should not equal the global id.
	a.assert.Equal(peerOrder.Price, req.Price)
	a.assert.Equal(peerOrder.PairId, req.PairId)
	a.assert.Equal(peerOrder.Quantity, req.Quantity)
	a.assert.Equal(peerOrder.Side, req.Side)
	a.assert.False(peerOrder.IsOwnOrder)
	a.assert.Equal(peerOrder.Id, res.RemainingOrder.Id)
	a.assert.IsType(new(xudrpc.Order_PeerPubKey), peerOrder.OwnOrPeer)
	a.assert.Equal(peerOrder.OwnOrPeer.(*xudrpc.Order_PeerPubKey).PeerPubKey, srcNode.PubKey())

	// Verify that a new order was added to the order books.
	srcNodeCount, destNodeCount, err := getOrdersCount(a.ctx, srcNode, destNode)
	a.assert.NoError(err)
	a.assert.Equal(srcNodeCount.Own, prevSrcNodeCount.Own+1)
	a.assert.Equal(srcNodeCount.Peer, prevSrcNodeCount.Peer)
	a.assert.Equal(destNodeCount.Own, prevDestNodeCount.Own)
	a.assert.Equal(destNodeCount.Peer, prevDestNodeCount.Peer+1)

	return res.RemainingOrder
}

func (a *actions) removeOrderAndInvalidate(srcNode, destNode *xudtest.HarnessNode, order *xudrpc.Order) {
	// Subscribe to removed orders on destNode.
	destNodeOrdersChan := subscribeOrders(a.ctx, destNode)

	// Fetch nodes current order book state.
	prevSrcNodeCount, prevDestNodeCount, err := getOrdersCount(a.ctx, srcNode, destNode)
	a.assert.NoError(err)
	a.assert.NotZero(prevSrcNodeCount)
	a.assert.NotZero(prevDestNodeCount)

	// Ensure that destNode and srcNode are connected.
	a.verifyConnectivity(destNode, srcNode)

	// Remove the order on srcNode.
	req := &xudrpc.RemoveOrderRequest{OrderId: order.OwnOrPeer.(*xudrpc.Order_LocalId).LocalId}
	res, err := srcNode.Client.RemoveOrder(a.ctx, req)
	a.assert.NoError(err)

	// Verify no quantity on hold.
	a.assert.Equal(res.QuantityOnHold, uint64(0))

	// Retrieve and verify the removed orders event on destNode.
	e := <-destNodeOrdersChan
	a.assert.NoError(e.err)
	a.assert.NotNil(e.orderUpdate)
	orderRemoval := e.orderUpdate.GetOrderRemoval()

	// Verify the order removal.
	a.assert.Empty(orderRemoval.LocalId)
	a.assert.Equal(orderRemoval.Quantity, order.Quantity)
	a.assert.Equal(orderRemoval.PairId, order.PairId)
	a.assert.False(orderRemoval.IsOwnOrder)

	// Verify that the order was removed from the order books.
	srcNodeCount, destNodeCount, err := getOrdersCount(a.ctx, srcNode, destNode)
	a.assert.NoError(err)
	a.assert.Equal(srcNodeCount.Own, prevSrcNodeCount.Own-1)
	a.assert.Equal(srcNodeCount.Peer, prevSrcNodeCount.Peer)
	a.assert.Equal(destNodeCount.Own, prevDestNodeCount.Own)
	a.assert.Equal(destNodeCount.Peer, prevDestNodeCount.Peer-1)
}

func (a *actions) placeOrderAndSwap(srcNode, destNode *xudtest.HarnessNode,
	req *xudrpc.PlaceOrderRequest) {
	ctx, cancel := context.WithCancel(a.ctx)
	defer cancel()

	destNodeSwapChan := subscribeSwaps(ctx, destNode, false)
	srcNodeSwapChan := subscribeSwaps(ctx, srcNode, true)

	// Place the order on srcNode and verify the result.
	res, err := srcNode.Client.PlaceOrderSync(ctx, req)
	a.assert.NoError(err)
	a.assert.Len(res.InternalMatches, 0)
	a.assert.Len(res.SwapFailures, 0)
	a.assert.Len(res.SwapSuccesses, 1)
	a.assert.Nil(res.RemainingOrder)

	// Retrieve and verify the swap events on both nodes.
	eMaker := <-destNodeSwapChan
	a.assert.NoError(eMaker.err)
	a.assert.NotNil(eMaker.swap)
	eTaker := <-srcNodeSwapChan
	a.assert.NoError(eTaker.err)
	a.assert.NotNil(eTaker.swap)

	// Verify that the swap event on the taker side is equal to PlaceOrder response swap.
	a.assert.Equal(eTaker.swap, res.SwapSuccesses[0])

	// Verify the swap events info.
	a.assert.Equal(eMaker.swap.OrderId, eTaker.swap.OrderId)
	a.assert.NotEqual(eMaker.swap.LocalId, eTaker.swap.LocalId)
	a.assert.Equal(eMaker.swap.PairId, eTaker.swap.PairId)
	a.assert.Equal(eMaker.swap.Quantity, eTaker.swap.Quantity)
	a.assert.Equal(eMaker.swap.RHash, eTaker.swap.RHash)

	a.assert.Equal(eMaker.swap.PeerPubKey, srcNode.PubKey())
	a.assert.Equal(eTaker.swap.PeerPubKey, destNode.PubKey())

	// TODO: add assertions on currency/amount
	//fmt.Printf("### taker: %v\n\n", eTaker.swap)
	//fmt.Printf("### maker: %v\n\n", eMaker.swap)
}

func (a *actions) verifyConnectivity(n1, n2 *xudtest.HarnessNode) {
	a.verifyPeer(n1, n2)
	a.verifyPeer(n2, n1)
}

func (a *actions) verifyPeer(srcNode, destNode *xudtest.HarnessNode) {
	resListPeers, err := srcNode.Client.ListPeers(a.ctx, &xudrpc.ListPeersRequest{})
	a.assert.NoError(err)

	peerIndex := -1
	for i := 0; i < len(resListPeers.Peers); i++ {
		if resListPeers.Peers[i].NodePubKey == destNode.PubKey() {
			peerIndex = i
			break
		}
	}
	a.assert.NotEqual(peerIndex, -1, "peer is missing")
	a.assert.Equal(resListPeers.Peers[peerIndex].LndPubKeys["BTC"], destNode.LndBtcNode.PubKeyStr)
	a.assert.Equal(resListPeers.Peers[peerIndex].LndPubKeys["LTC"], destNode.LndLtcNode.PubKeyStr)
}

type subscribeOrdersEvent struct {
	orderUpdate *xudrpc.OrderUpdate
	err         error
}

func subscribeOrders(ctx context.Context, node *xudtest.HarnessNode) <-chan *subscribeOrdersEvent {
	out := make(chan *subscribeOrdersEvent, 1)

	// Subscribe before starting a non-blocking routine.
	req := xudrpc.SubscribeOrdersRequest{}
	stream, err := node.Client.SubscribeOrders(ctx, &req)
	if err != nil {
		out <- &subscribeOrdersEvent{nil, err}
		return out
	}

	go func() {
		go func() {
			for {
				order, err := stream.Recv()
				out <- &subscribeOrdersEvent{order, err}
				if err != nil {
					break
				}
			}
		}()

		select {
		case <-ctx.Done():
			if e := ctx.Err(); e != context.Canceled {
				out <- &subscribeOrdersEvent{nil, errors.New("timeout reached before event was received")}
			}
		}
	}()

	return out
}

type subscribeSwapsEvent struct {
	swap *xudrpc.SwapSuccess
	err  error
}

func subscribeSwaps(ctx context.Context, node *xudtest.HarnessNode, includeTaker bool) <-chan *subscribeSwapsEvent {
	out := make(chan *subscribeSwapsEvent, 1)

	// Subscribe before starting a non-blocking routine.
	req := xudrpc.SubscribeSwapsRequest{IncludeTaker: includeTaker}
	stream, err := node.Client.SubscribeSwaps(ctx, &req)
	if err != nil {
		out <- &subscribeSwapsEvent{nil, err}
		return out
	}

	go func() {
		go func() {
			for {
				swap, err := stream.Recv()
				out <- &subscribeSwapsEvent{swap, err}
				if err != nil {
					break
				}
			}
		}()

		select {
		case <-ctx.Done():
			if e := ctx.Err(); e != context.Canceled {
				out <- &subscribeSwapsEvent{nil, errors.New("timeout reached before event was received")}
			}
		}
	}()

	return out
}

func getOrdersCount(ctx context.Context, n1, n2 *xudtest.HarnessNode) (*xudrpc.OrdersCount, *xudrpc.OrdersCount, error) {
	n1i, err := getInfo(ctx, n1)
	if err != nil {
		return nil, nil, err
	}

	n2i, err := getInfo(ctx, n2)
	if err != nil {
		return nil, nil, err
	}

	return n1i.Orders, n2i.Orders, nil
}

func getInfo(ctx context.Context, n *xudtest.HarnessNode) (*xudrpc.GetInfoResponse, error) {
	info, err := n.Client.GetInfo(ctx, &xudrpc.GetInfoRequest{})
	if err != nil {
		return nil, fmt.Errorf("RPC GetInfo failure: %v", err)
	}

	return info, nil
}
