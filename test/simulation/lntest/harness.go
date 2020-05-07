package lntest

import (
	"errors"
	"fmt"
	"io/ioutil"
	"reflect"
	"strings"
	"sync"
	"time"

	"github.com/ltcsuite/ltcutil"

	"golang.org/x/net/context"
	"google.golang.org/grpc/grpclog"

	"github.com/lightningnetwork/lnd/lnrpc"
	ltcrpctest "github.com/ltcsuite/ltcd/integration/rpctest"
	ltctxscript "github.com/ltcsuite/ltcd/txscript"
	ltcwire "github.com/ltcsuite/ltcd/wire"
	"github.com/roasbeef/btcd/chaincfg/chainhash"
	"github.com/roasbeef/btcd/integration/rpctest"
	"github.com/roasbeef/btcd/txscript"
	"github.com/roasbeef/btcd/wire"
	"github.com/roasbeef/btcutil"
)

// NetworkHarness is an integration testing harness for the lightning network.
// The harness by default is created with two active nodes on the network:
// Alice and Bob.
type NetworkHarness struct {
	rpcConfig ConnConfig
	chain     string

	// Miner is a reference to a running full node that can be used to create
	// new blocks on the network.
	BtcMiner *rpctest.Harness
	LtcMiner *ltcrpctest.Harness

	activeNodes map[int]*HarnessNode

	nodesByPub map[string]*HarnessNode

	// The initial seeder nodes that are automatically
	// created to be the initial participants of the test network.
	Alice *HarnessNode
	Bob   *HarnessNode
	Carol *HarnessNode
	Dave  *HarnessNode

	seenTxns             chan *Hash
	bitcoinWatchRequests chan *txWatchRequest

	// Channel for transmitting stderr output from failed lightning node
	// to main process.
	lndErrorChan chan error

	quit chan struct{}

	mtx sync.Mutex
}

// NewNetworkHarness creates a new network test harness.
func NewNetworkHarness(rpcTestHarness interface{}, chain string) (*NetworkHarness, error) {
	var btcMiner *rpctest.Harness
	var ltcMiner *ltcrpctest.Harness
	var rpcConfig ConnConfig

	switch v := rpcTestHarness.(type) {
	case *rpctest.Harness:
		btcMiner = v
		rpcConfig = ConnConfig(v.RPCConfig())
	case *ltcrpctest.Harness:
		ltcMiner = v
		rpcConfig = ConnConfig(v.RPCConfig())
	default:
		return nil, fmt.Errorf("invalid rpcTestHarness type: %v", reflect.TypeOf(rpcTestHarness))
	}

	n := NetworkHarness{
		chain:                chain,
		activeNodes:          make(map[int]*HarnessNode),
		nodesByPub:           make(map[string]*HarnessNode),
		seenTxns:             make(chan *Hash),
		bitcoinWatchRequests: make(chan *txWatchRequest),
		lndErrorChan:         make(chan error),
		BtcMiner:             btcMiner,
		LtcMiner:             ltcMiner,
		rpcConfig:            rpcConfig,
		quit:                 make(chan struct{}),
	}
	go n.networkWatcher()
	return &n, nil
}

// LookUpNodeByPub queries the set of active nodes to locate a node according
// to its public key. The second value will be true if the node was found, and
// false otherwise.
func (n *NetworkHarness) LookUpNodeByPub(pubStr string) (*HarnessNode, error) {
	n.mtx.Lock()
	defer n.mtx.Unlock()

	node, ok := n.nodesByPub[pubStr]
	if !ok {
		return nil, fmt.Errorf("unable to find node")
	}

	return node, nil
}

// ProcessErrors returns a channel used for reporting any fatal process errors.
// If any of the active nodes within the harness' test network incur a fatal
// error, that error is sent over this channel.
func (n *NetworkHarness) ProcessErrors() <-chan error {
	return n.lndErrorChan
}

// fakeLogger is a fake grpclog.Logger implementation. This is used to stop
// grpc's logger from printing directly to stdout.
type fakeLogger struct{}

func (f *fakeLogger) Fatal(args ...interface{})                 {}
func (f *fakeLogger) Fatalf(format string, args ...interface{}) {}
func (f *fakeLogger) Fatalln(args ...interface{})               {}
func (f *fakeLogger) Print(args ...interface{})                 {}
func (f *fakeLogger) Printf(format string, args ...interface{}) {}
func (f *fakeLogger) Println(args ...interface{})               {}

// SetUp starts the initial seeder nodes within the test harness. The initial
// node's wallets will be funded wallets with ten 1 BTC outputs each. Finally
// rpc clients capable of communicating with the initial seeder nodes are
// created. Nodes are initialized with the given extra command line flags, which
// should be formatted properly - "--arg=value".
func (n *NetworkHarness) SetUp(lndArgs []string) error {
	// Swap out grpc's default logger with out fake logger which drops the
	// statements on the floor.
	grpclog.SetLogger(&fakeLogger{})

	// Start the initial seeder nodes within the test network, then connect
	// their respective RPC clients.
	var wg sync.WaitGroup
	errChan := make(chan error, 4)
	wg.Add(4)
	go func() {
		defer wg.Done()
		node, err := n.NewNode("Alice", lndArgs, n.chain)
		if err != nil {
			errChan <- err
			return
		}
		n.Alice = node
	}()
	go func() {
		defer wg.Done()
		node, err := n.NewNode("Bob", lndArgs, n.chain)
		if err != nil {
			errChan <- err
			return
		}
		n.Bob = node
	}()
	go func() {
		defer wg.Done()
		node, err := n.NewNode("Carol", lndArgs, n.chain)
		if err != nil {
			errChan <- err
			return
		}
		n.Carol = node
	}()
	go func() {
		defer wg.Done()
		node, err := n.NewNode("Dave", lndArgs, n.chain)
		if err != nil {
			errChan <- err
			return
		}
		n.Dave = node
	}()
	wg.Wait()
	select {
	case err := <-errChan:
		return err
	default:
	}

	// Load up the wallets of the seeder nodes with 10 outputs of 1 BTC
	// each.
	ctxb := context.Background()
	addrReq := &lnrpc.NewAddressRequest{
		Type: lnrpc.AddressType_NESTED_PUBKEY_HASH,
	}
	clients := []lnrpc.LightningClient{n.Alice, n.Bob, n.Carol}
	for _, client := range clients {
		for i := 0; i < 10; i++ {
			resp, err := client.NewAddress(ctxb, addrReq)
			if err != nil {
				return err
			}

			if n.BtcMiner != nil {
				addr, err := btcutil.DecodeAddress(resp.Address, n.BtcMiner.ActiveNet)
				if err != nil {
					return err
				}
				addrScript, err := txscript.PayToAddrScript(addr)
				if err != nil {
					return err
				}

				output := &wire.TxOut{
					PkScript: addrScript,
					Value:    btcutil.SatoshiPerBitcoin,
				}
				if _, err := n.BtcMiner.SendOutputs([]*wire.TxOut{output}, 30); err != nil {
					return err
				}
			}

			if n.LtcMiner != nil {

				addr, err := ltcutil.DecodeAddress(resp.Address, n.LtcMiner.ActiveNet)
				if err != nil {
					return err
				}
				addrScript, err := ltctxscript.PayToAddrScript(addr)
				if err != nil {
					return err
				}

				output := &ltcwire.TxOut{
					PkScript: addrScript,
					Value:    ltcutil.SatoshiPerBitcoin,
				}
				if _, err := n.LtcMiner.SendOutputs([]*ltcwire.TxOut{output}, 30); err != nil {
					return err
				}
			}
		}
	}

	// We generate several blocks in order to give the outputs created
	// above a good number of confirmations.

	if n.BtcMiner != nil {
		if _, err := n.BtcMiner.Node.Generate(10); err != nil {
			return err
		}
	}
	if n.LtcMiner != nil {
		if _, err := n.LtcMiner.Node.Generate(10); err != nil {
			return err
		}
	}

	// Finally, make connections between the nodes.
	if err := n.ConnectNodes(ctxb, n.Alice, n.Bob); err != nil {
		return err
	}
	if err := n.ConnectNodes(ctxb, n.Bob, n.Carol); err != nil {
		return err
	}
	if err := n.ConnectNodes(ctxb, n.Carol, n.Dave); err != nil {
		return err
	}

	// Now block until both wallets have fully synced up.
	expectedBalance := int64(btcutil.SatoshiPerBitcoin * 10)
	balReq := &lnrpc.WalletBalanceRequest{}
	balanceTicker := time.Tick(time.Millisecond * 50)
	balanceTimeout := time.After(time.Second * 30)
out:
	for {
		select {
		case <-balanceTicker:
			aliceResp, err := n.Alice.WalletBalance(ctxb, balReq)
			if err != nil {
				return err
			}
			bobResp, err := n.Bob.WalletBalance(ctxb, balReq)
			if err != nil {
				return err
			}

			if aliceResp.ConfirmedBalance == expectedBalance &&
				bobResp.ConfirmedBalance == expectedBalance {
				break out
			}
		case <-balanceTimeout:
			return fmt.Errorf("balances not synced after deadline")
		}
	}

	return nil
}

// TearDownAll tears down all active nodes within the test lightning network.
func (n *NetworkHarness) TearDownAll() error {

	for _, node := range n.activeNodes {
		if err := n.ShutdownNode(node); err != nil {
			return err
		}
	}

	close(n.lndErrorChan)
	close(n.quit)

	return nil
}

// NewNode fully initializes a returns a new HarnessNode bound to the
// current instance of the network harness. The created node is running, but
// not yet connected to other nodes within the network.
func (n *NetworkHarness) NewNode(name string, extraArgs []string, chain string) (*HarnessNode, error) {
	return n.newNode(name, extraArgs, false, chain)
}

// newNode initializes a new HarnessNode, supporting the ability to initialize a
// wallet with or without a seed. If hasSeed is false, the returned harness node
// can be used immediately. Otherwise, the node will require an additional
// initialization phase where the wallet is either created or restored.
func (n *NetworkHarness) newNode(name string, extraArgs []string,
	hasSeed bool, chain string) (*HarnessNode, error) {
	node, err := newNode(nodeConfig{
		Name:      name,
		Chain:     chain,
		HasSeed:   hasSeed,
		RPCConfig: &n.rpcConfig,
		ExtraArgs: extraArgs,
	})
	if err != nil {
		return nil, err
	}

	// Put node in activeNodes to ensure Shutdown is called even if Start
	// returns an error.
	n.mtx.Lock()
	n.activeNodes[node.NodeID] = node
	n.mtx.Unlock()

	if err := node.Start(n.lndErrorChan); err != nil {
		return nil, err
	}

	// If this node is to have a seed, it will need to be unlocked or
	// initialized via rpc. Delay registering it with the network until it
	// can be driven via an unlocked rpc connection.
	if node.Cfg.HasSeed {
		return node, nil
	}

	// With the node started, we can now record its public key within the
	// global mapping.
	n.RegisterNode(node)

	return node, nil
}

// RegisterNode records a new HarnessNode in the NetworkHarnesses map of known
// nodes. This method should only be called with nodes that have successfully
// retrieved their public keys via FetchNodeInfo.
func (n *NetworkHarness) RegisterNode(node *HarnessNode) {
	n.mtx.Lock()
	n.nodesByPub[node.PubKeyStr] = node
	n.mtx.Unlock()
}

// EnsureConnected will try to connect to two nodes, returning no error if they
// are already connected. If the nodes were not connected previously, this will
// behave the same as ConnectNodes. If a pending connection request has already
// been made, the method will block until the two nodes appear in each other's
// peers list, or until the 15s timeout expires.
func (n *NetworkHarness) EnsureConnected(ctx context.Context, a, b *HarnessNode) error {
	// errConnectionRequested is used to signal that a connection was
	// requested successfully, which is distinct from already being
	// connected to the peer.
	errConnectionRequested := errors.New("connection request in progress")

	tryConnect := func(a, b *HarnessNode) error {
		ctxt, _ := context.WithTimeout(ctx, 15*time.Second)
		bInfo, err := b.GetInfo(ctxt, &lnrpc.GetInfoRequest{})
		if err != nil {
			return err
		}

		req := &lnrpc.ConnectPeerRequest{
			Addr: &lnrpc.LightningAddress{
				Pubkey: bInfo.IdentityPubkey,
				Host:   b.Cfg.P2PAddr(),
			},
		}

		ctxt, _ = context.WithTimeout(ctx, 15*time.Second)
		_, err = a.ConnectPeer(ctxt, req)
		switch {

		// Request was successful, wait for both to display the
		// connection.
		case err == nil:
			return errConnectionRequested

			// If the two are already connected, we return early with no
			// error.
		case strings.Contains(err.Error(), "already connected to peer"):
			return nil

		default:
			return err
		}
	}

	aErr := tryConnect(a, b)
	bErr := tryConnect(b, a)
	switch {
	case aErr == nil && bErr == nil:
		// If both reported already being connected to each other, we
		// can exit early.
		return nil

	case aErr != errConnectionRequested:
		// Return any critical errors returned by either alice.
		return aErr

	case bErr != errConnectionRequested:
		// Return any critical errors returned by either bob.
		return bErr

	default:
		// Otherwise one or both requested a connection, so we wait for
		// the peers lists to reflect the connection.
	}

	findSelfInPeerList := func(a, b *HarnessNode) bool {
		// If node B is seen in the ListPeers response from node A,
		// then we can exit early as the connection has been fully
		// established.
		ctxt, _ := context.WithTimeout(ctx, 15*time.Second)
		resp, err := b.ListPeers(ctxt, &lnrpc.ListPeersRequest{})
		if err != nil {
			return false
		}

		for _, peer := range resp.Peers {
			if peer.PubKey == a.PubKeyStr {
				return true
			}
		}

		return false
	}

	err := WaitPredicate(func() bool {
		return findSelfInPeerList(a, b) && findSelfInPeerList(b, a)
	}, time.Second*15)
	if err != nil {
		return fmt.Errorf("peers not connected within 15 seconds")
	}

	return nil
}

// ConnectNodes establishes an encrypted+authenticated p2p connection from node
// a towards node b. The function will return a non-nil error if the connection
// was unable to be established.
//
// NOTE: This function may block for up to 15-seconds as it will not return
// until the new connection is detected as being known to both nodes.
func (n *NetworkHarness) ConnectNodes(ctx context.Context, a, b *HarnessNode) error {
	bobInfo, err := b.GetInfo(ctx, &lnrpc.GetInfoRequest{})
	if err != nil {
		return err
	}

	req := &lnrpc.ConnectPeerRequest{
		Addr: &lnrpc.LightningAddress{
			Pubkey: bobInfo.IdentityPubkey,
			Host:   b.Cfg.P2PAddr(),
		},
	}
	if _, err := a.ConnectPeer(ctx, req); err != nil {
		return err
	}

	err = WaitPredicate(func() bool {
		// If node B is seen in the ListPeers response from node A,
		// then we can exit early as the connection has been fully
		// established.
		resp, err := a.ListPeers(ctx, &lnrpc.ListPeersRequest{})
		if err != nil {
			return false
		}

		for _, peer := range resp.Peers {
			if peer.PubKey == b.PubKeyStr {
				return true
			}
		}

		return false
	}, time.Second*15)
	if err != nil {
		return fmt.Errorf("peers not connected within 15 seconds")
	}

	return nil
}

// DisconnectNodes disconnects node a from node b by sending RPC message
// from a node to b node
func (n *NetworkHarness) DisconnectNodes(ctx context.Context, a, b *HarnessNode) error {
	bobInfo, err := b.GetInfo(ctx, &lnrpc.GetInfoRequest{})
	if err != nil {
		return err
	}

	req := &lnrpc.DisconnectPeerRequest{
		PubKey: bobInfo.IdentityPubkey,
	}

	if _, err := a.DisconnectPeer(ctx, req); err != nil {
		return err
	}

	return nil
}

// RestartNode  attempts to restart a lightning node by shutting it down
// cleanly, then restarting the process. This function is fully blocking. Upon
// restart, the RPC connection to the node will be re-attempted, continuing iff
// the connection attempt is successful. If the callback parameter is non-nil,
// then the function will be executed after the node shuts down, but *before*
// the process has been started up again.
//
// This method can be useful when testing edge cases such as a node broadcast
// and invalidated prior state, or persistent state recovery, simulating node
// crashes, etc.
func (n *NetworkHarness) RestartNode(node *HarnessNode, callback func() error) error {
	if err := node.stop(); err != nil {
		return err
	}

	if callback != nil {
		if err := callback(); err != nil {
			return err
		}
	}

	return node.Start(n.lndErrorChan)
}

// ShutdownNode stops an active lnd process and returns when the process has
// exited and any temporary directories have been cleaned up.
func (n *NetworkHarness) ShutdownNode(node *HarnessNode) error {
	if err := node.shutdown(); err != nil {
		return err
	}

	delete(n.activeNodes, node.NodeID)
	return nil
}

// TODO(roasbeef): add a WithChannel higher-order function?
//  * python-like context manager w.r.t using a channel within a test
//  * possibly  adds more funds to the target wallet if the funds are not
//    enough

// txWatchRequest encapsulates a request to the harness' Bitcoin network
// watcher to dispatch a notification once a transaction with the target txid
// is seen within the test network.
type txWatchRequest struct {
	txid      Hash
	eventChan chan struct{}
}

// bitcoinNetworkWatcher is a goroutine which accepts async notification
// requests for the broadcast of a target transaction, and then dispatches the
// transaction once its seen on the Bitcoin network.
func (n *NetworkHarness) networkWatcher() {
	seenTxns := make(map[Hash]struct{})
	clients := make(map[Hash][]chan struct{})

	for {

		select {
		case <-n.quit:
			return

		case req := <-n.bitcoinWatchRequests:
			// If we've already seen this transaction, then
			// immediately dispatch the request. Otherwise, append
			// to the list of clients who are watching for the
			// broadcast of this transaction.
			if _, ok := seenTxns[req.txid]; ok {
				close(req.eventChan)
			} else {
				clients[req.txid] = append(clients[req.txid], req.eventChan)
			}
		case txid := <-n.seenTxns:
			// Add this txid to our set of "seen" transactions. So
			// we're able to dispatch any notifications for this
			// txid which arrive *after* it's seen within the
			// network.
			seenTxns[*txid] = struct{}{}

			// If there isn't a registered notification for this
			// transaction then ignore it.
			txClients, ok := clients[*txid]
			if !ok {
				continue
			}

			// Otherwise, dispatch the notification to all clients,
			// cleaning up the now un-needed state.
			for _, client := range txClients {
				close(client)
			}
			delete(clients, *txid)
		}
	}
}

// OnTxAccepted is a callback to be called each time a new transaction has been
// broadcast on the network.
func (n *NetworkHarness) OnTxAccepted(hash *Hash) {
	select {
	case n.seenTxns <- hash:
	case <-n.quit:
		return
	}
}

// WaitForTxBroadcast blocks until the target txid is seen on the network. If
// the transaction isn't seen within the network before the passed timeout,
// then an error is returned.
// TODO(roasbeef): add another method which creates queue of all seen transactions
func (n *NetworkHarness) WaitForTxBroadcast(ctx context.Context, txid Hash) error {
	// Return immediately if harness has been torn down.
	select {
	case <-n.quit:
		return fmt.Errorf("NetworkHarness has been torn down")
	default:
	}

	eventChan := make(chan struct{})

	n.bitcoinWatchRequests <- &txWatchRequest{
		txid:      txid,
		eventChan: eventChan,
	}

	select {
	case <-eventChan:
		return nil
	case <-n.quit:
		return fmt.Errorf("NetworkHarness has been torn down")
	case <-ctx.Done():
		return fmt.Errorf("tx not seen before context timeout")
	}
}

// OpenChannel attempts to open a channel between srcNode and destNode with the
// passed channel funding parameters. If the passed context has a timeout, then
// if the timeout is reached before the channel pending notification is
// received, an error is returned.
func (n *NetworkHarness) OpenChannel(ctx context.Context,
	srcNode, destNode *HarnessNode, amt btcutil.Amount,
	pushAmt btcutil.Amount, private bool) (lnrpc.Lightning_OpenChannelClient, error) {

	// Wait until srcNode and destNode have the latest chain synced.
	// Otherwise, we may run into a check within the funding manager that
	// prevents any funding workflows from being kicked off if the chain
	// isn't yet synced.
	if err := srcNode.WaitForBlockchainSync(ctx); err != nil {
		return nil, fmt.Errorf("Unable to sync srcNode chain: %v", err)
	}
	if err := destNode.WaitForBlockchainSync(ctx); err != nil {
		return nil, fmt.Errorf("Unable to sync destNode chain: %v", err)
	}

	openReq := &lnrpc.OpenChannelRequest{
		NodePubkey:         destNode.PubKey[:],
		LocalFundingAmount: int64(amt),
		PushSat:            int64(pushAmt),
		Private:            private,
	}

	respStream, err := srcNode.OpenChannel(ctx, openReq)
	if err != nil {
		return nil, fmt.Errorf("unable to open channel between "+
			"alice and bob: %v", err)
	}

	chanOpen := make(chan struct{})
	errChan := make(chan error)
	go func() {
		// Consume the "channel pending" update. This waits until the node
		// notifies us that the final message in the channel funding workflow
		// has been sent to the remote node.
		resp, err := respStream.Recv()
		if err != nil {
			errChan <- err
			return
		}
		if _, ok := resp.Update.(*lnrpc.OpenStatusUpdate_ChanPending); !ok {
			errChan <- fmt.Errorf("expected channel pending update, "+
				"instead got %v", resp)
			return
		}

		close(chanOpen)
	}()

	select {
	case <-ctx.Done():
		return nil, fmt.Errorf("timeout reached before chan pending "+
			"update sent: %v", err)
	case err := <-errChan:
		return nil, err
	case <-chanOpen:
		return respStream, nil
	}
}

// OpenPendingChannel attempts to open a channel between srcNode and destNode with the
// passed channel funding parameters. If the passed context has a timeout, then
// if the timeout is reached before the channel pending notification is
// received, an error is returned.
func (n *NetworkHarness) OpenPendingChannel(ctx context.Context,
	srcNode, destNode *HarnessNode, amt btcutil.Amount,
	pushAmt btcutil.Amount) (*lnrpc.PendingUpdate, error) {

	// Wait until srcNode and destNode have blockchain synced
	if err := srcNode.WaitForBlockchainSync(ctx); err != nil {
		return nil, fmt.Errorf("Unable to sync srcNode chain: %v", err)
	}
	if err := destNode.WaitForBlockchainSync(ctx); err != nil {
		return nil, fmt.Errorf("Unable to sync destNode chain: %v", err)
	}

	openReq := &lnrpc.OpenChannelRequest{
		NodePubkey:         destNode.PubKey[:],
		LocalFundingAmount: int64(amt),
		PushSat:            int64(pushAmt),
		Private:            false,
	}

	respStream, err := srcNode.OpenChannel(ctx, openReq)
	if err != nil {
		return nil, fmt.Errorf("unable to open channel between "+
			"alice and bob: %v", err)
	}

	chanPending := make(chan *lnrpc.PendingUpdate)
	errChan := make(chan error)
	go func() {
		// Consume the "channel pending" update. This waits until the node
		// notifies us that the final message in the channel funding workflow
		// has been sent to the remote node.
		resp, err := respStream.Recv()
		if err != nil {
			errChan <- err
			return
		}
		pendingResp, ok := resp.Update.(*lnrpc.OpenStatusUpdate_ChanPending)
		if !ok {
			errChan <- fmt.Errorf("expected channel pending update, "+
				"instead got %v", resp)
			return
		}

		chanPending <- pendingResp.ChanPending
	}()

	select {
	case <-ctx.Done():
		return nil, fmt.Errorf("timeout reached before chan pending " +
			"update sent")
	case err := <-errChan:
		return nil, err
	case pendingChan := <-chanPending:
		return pendingChan, nil
	}
}

// WaitForChannelOpen waits for a notification that a channel is open by
// consuming a message from the past open channel stream. If the passed context
// has a timeout, then if the timeout is reached before the channel has been
// opened, then an error is returned.
func (n *NetworkHarness) WaitForChannelOpen(ctx context.Context,
	openChanStream lnrpc.Lightning_OpenChannelClient) (*lnrpc.ChannelPoint, error) {

	errChan := make(chan error)
	respChan := make(chan *lnrpc.ChannelPoint)
	go func() {
		resp, err := openChanStream.Recv()
		if err != nil {
			errChan <- fmt.Errorf("unable to read rpc resp: %v", err)
			return
		}
		fundingResp, ok := resp.Update.(*lnrpc.OpenStatusUpdate_ChanOpen)
		if !ok {
			errChan <- fmt.Errorf("expected channel open update, "+
				"instead got %v", resp)
			return
		}

		respChan <- fundingResp.ChanOpen.ChannelPoint
	}()

	select {
	case <-ctx.Done():
		return nil, fmt.Errorf("timeout reached while waiting for " +
			"channel open")
	case err := <-errChan:
		return nil, err
	case chanPoint := <-respChan:
		return chanPoint, nil
	}
}

// CloseChannel close channel attempts to close the channel indicated by the
// passed channel point, initiated by the passed lnNode. If the passed context
// has a timeout, then if the timeout is reached before the channel close is
// pending, then an error is returned.
func (n *NetworkHarness) CloseChannel(ctx context.Context,
	lnNode *HarnessNode, cp *lnrpc.ChannelPoint,
	force bool) (lnrpc.Lightning_CloseChannelClient, *Hash, error) {

	// Create a channel outpoint that we can use to compare to channels
	// from the ListChannelsResponse.
	txidHash, err := getChanPointFundingTxid(cp)
	if err != nil {
		return nil, nil, err
	}
	fundingTxID, err := chainhash.NewHash(txidHash)
	if err != nil {
		return nil, nil, err
	}
	chanPoint := wire.OutPoint{
		Hash:  *fundingTxID,
		Index: cp.OutputIndex,
	}

	// We'll wait for *both* nodes to read the channel as active if we're
	// performing a cooperative channel closure.
	if !force {
		timeout := time.Second * 15
		listReq := &lnrpc.ListChannelsRequest{}

		// We define two helper functions, one two locate a particular
		// channel, and the other to check if a channel is active or
		// not.
		filterChannel := func(node *HarnessNode,
			op wire.OutPoint) (*lnrpc.Channel, error) {
			listResp, err := node.ListChannels(ctx, listReq)
			if err != nil {
				return nil, err
			}

			for _, c := range listResp.Channels {
				if c.ChannelPoint == op.String() {
					return c, nil
				}
			}

			return nil, fmt.Errorf("unable to find channel")
		}
		activeChanPredicate := func(node *HarnessNode) func() bool {
			return func() bool {
				channel, err := filterChannel(node, chanPoint)
				if err != nil {
					return false
				}

				return channel.Active
			}
		}

		// Next, we'll fetch the target channel in order to get the
		// harness node that will be receiving the channel close request.
		targetChan, err := filterChannel(lnNode, chanPoint)
		if err != nil {
			return nil, nil, err
		}
		receivingNode, err := n.LookUpNodeByPub(targetChan.RemotePubkey)
		if err != nil {
			return nil, nil, err
		}

		// Before proceeding, we'll ensure that the channel is active
		// for both nodes.
		err = WaitPredicate(activeChanPredicate(lnNode), timeout)
		if err != nil {
			return nil, nil, fmt.Errorf("channel of closing " +
				"node not active in time")
		}
		err = WaitPredicate(activeChanPredicate(receivingNode), timeout)
		if err != nil {
			return nil, nil, fmt.Errorf("channel of receiving " +
				"node not active in time")
		}
	}

	closeReq := &lnrpc.CloseChannelRequest{
		ChannelPoint: cp,
		Force:        force,
	}
	closeRespStream, err := lnNode.CloseChannel(ctx, closeReq)
	if err != nil {
		return nil, nil, fmt.Errorf("unable to close channel: %v", err)
	}

	errChan := make(chan error)
	fin := make(chan *Hash)
	go func() {
		// Consume the "channel close" update in order to wait for the closing
		// transaction to be broadcast, then wait for the closing tx to be seen
		// within the network.
		closeResp, err := closeRespStream.Recv()
		if err != nil {
			errChan <- err
			return
		}
		pendingClose, ok := closeResp.Update.(*lnrpc.CloseStatusUpdate_ClosePending)
		if !ok {
			errChan <- fmt.Errorf("expected channel close update, "+
				"instead got %v", pendingClose)
			return
		}

		closeTxid, err := NewHash(pendingClose.ClosePending.Txid)
		if err != nil {
			errChan <- err
			return
		}
		if err := n.WaitForTxBroadcast(ctx, *closeTxid); err != nil {
			errChan <- err
			return
		}
		fin <- closeTxid
	}()

	// Wait until either the deadline for the context expires, an error
	// occurs, or the channel close update is received.
	select {
	case <-ctx.Done():
		return nil, nil, fmt.Errorf("timeout reached before channel close " +
			"initiated")
	case err := <-errChan:
		return nil, nil, err
	case closeTxid := <-fin:
		return closeRespStream, closeTxid, nil
	}
}

// WaitForChannelClose waits for a notification from the passed channel close
// stream that the node has deemed the channel has been fully closed. If the
// passed context has a timeout, then if the timeout is reached before the
// notification is received then an error is returned.
func (n *NetworkHarness) WaitForChannelClose(ctx context.Context,
	closeChanStream lnrpc.Lightning_CloseChannelClient) (*chainhash.Hash, error) {

	errChan := make(chan error)
	updateChan := make(chan *lnrpc.CloseStatusUpdate_ChanClose)
	go func() {
		closeResp, err := closeChanStream.Recv()
		if err != nil {
			errChan <- err
			return
		}

		closeFin, ok := closeResp.Update.(*lnrpc.CloseStatusUpdate_ChanClose)
		if !ok {
			errChan <- fmt.Errorf("expected channel close update, "+
				"instead got %v", closeFin)
			return
		}

		updateChan <- closeFin
	}()

	// Wait until either the deadline for the context expires, an error
	// occurs, or the channel close update is received.
	select {
	case <-ctx.Done():
		return nil, fmt.Errorf("timeout reached before update sent")
	case err := <-errChan:
		return nil, err
	case update := <-updateChan:
		return chainhash.NewHash(update.ChanClose.ClosingTxid)
	}
}

// AssertChannelExists asserts that an active channel identified by the
// specified channel point exists from the point-of-view of the node.
func (n *NetworkHarness) AssertChannelExists(ctx context.Context,
	node *HarnessNode, chanPoint *wire.OutPoint) error {

	req := &lnrpc.ListChannelsRequest{}

	var predErr error
	pred := func() bool {
		resp, err := node.ListChannels(ctx, req)
		if err != nil {
			predErr = fmt.Errorf("unable fetch node's channels: %v", err)
			return false
		}

		for _, channel := range resp.Channels {
			if channel.ChannelPoint == chanPoint.String() {
				return channel.Active
			}

		}
		return false
	}

	if err := WaitPredicate(pred, time.Second*15); err != nil {
		return fmt.Errorf("channel not found: %v", predErr)
	}

	return nil
}

// WaitPredicate is a helper test function that will wait for a timeout period
// of time until the passed predicate returns true. This function is helpful as
// timing doesn't always line up well when running integration tests with
// several running lnd nodes. This function gives callers a way to assert that
// some property is upheld within a particular time frame.
func WaitPredicate(pred func() bool, timeout time.Duration) error {
	exitTimer := time.After(timeout)
	for {
		select {
		case <-exitTimer:
			return fmt.Errorf("predicate not satisfied after time out")
		default:
		}

		if pred() {
			return nil
		}
	}
}

// WaitInvariant is a helper test function that will wait for a timeout period
// of time, verifying that a statement remains true for the entire duration.
// This function is helpful as timing doesn't always line up well when running
// integration tests with several running lnd nodes. This function gives callers
// a way to assert that some property is maintained over a particular time
// frame.
func WaitInvariant(statement func() bool, timeout time.Duration) error {
	const pollInterval = 20 * time.Millisecond

	exitTimer := time.After(timeout)
	for {
		<-time.After(pollInterval)

		// Fail if the invariant is broken while polling.
		if !statement() {
			return fmt.Errorf("invariant broken before time out")
		}

		select {
		case <-exitTimer:
			return nil
		default:
		}
	}
}

// DumpLogs reads the current logs generated by the passed node, and returns
// the logs as a single string. This function is useful for examining the logs
// of a particular node in the case of a test failure.
// Logs from lightning node being generated with delay - you should
// add time.Sleep() in order to get all logs.
func (n *NetworkHarness) DumpLogs(node *HarnessNode) (string, error) {
	logFile := fmt.Sprintf("%v/simnet/lnd.log", node.Cfg.LogDir)

	buf, err := ioutil.ReadFile(logFile)
	if err != nil {
		return "", err
	}

	return string(buf), nil
}

// SendCoins attempts to send amt satoshis from the internal mining node to the
// targeted lightning node using a P2WKH address.
func (n *NetworkHarness) SendCoins(ctx context.Context, amt btcutil.Amount,
	target *HarnessNode) error {

	return n.sendCoins(
		ctx, amt, target, lnrpc.AddressType_WITNESS_PUBKEY_HASH,
	)
}

// SendCoinsNP2WKH attempts to send amt satoshis from the internal mining node
// to the targeted lightning node using a NP2WKH address.
func (n *NetworkHarness) SendCoinsNP2WKH(ctx context.Context,
	amt btcutil.Amount, target *HarnessNode) error {

	return n.sendCoins(
		ctx, amt, target, lnrpc.AddressType_NESTED_PUBKEY_HASH,
	)
}

// sendCoins attempts to send amt satoshis from the internal mining node to the
// targeted lightning node.
func (n *NetworkHarness) sendCoins(ctx context.Context, amt btcutil.Amount,
	target *HarnessNode,
	addrType lnrpc.AddressType) error {

	balReq := &lnrpc.WalletBalanceRequest{}
	initialBalance, err := target.WalletBalance(ctx, balReq)
	if err != nil {
		return err
	}

	// First, obtain an address from the target lightning node, preferring
	// to receive a p2wkh address s.t the output can immediately be used as
	// an input to a funding transaction.
	addrReq := &lnrpc.NewAddressRequest{
		Type: addrType,
	}
	resp, err := target.NewAddress(ctx, addrReq)
	if err != nil {
		return err
	}

	if n.BtcMiner != nil {
		addr, err := btcutil.DecodeAddress(resp.Address, n.BtcMiner.ActiveNet)
		if err != nil {
			return err
		}
		addrScript, err := txscript.PayToAddrScript(addr)
		if err != nil {
			return err
		}

		// Generate a transaction which creates an output to the target
		// pkScript of the desired amount.
		output := &wire.TxOut{
			PkScript: addrScript,
			Value:    int64(amt),
		}
		if _, err := n.BtcMiner.SendOutputs([]*wire.TxOut{output}, 30); err != nil {
			return err
		}

		// Finally, generate 6 new blocks to ensure the output gains a
		// sufficient number of confirmations.
		if _, err := n.BtcMiner.Node.Generate(6); err != nil {
			return err
		}
	}

	if n.LtcMiner != nil {
		addr, err := ltcutil.DecodeAddress(resp.Address, n.LtcMiner.ActiveNet)
		if err != nil {
			return err
		}
		addrScript, err := ltctxscript.PayToAddrScript(addr)
		if err != nil {
			return err
		}

		// Generate a transaction which creates an output to the target
		// pkScript of the desired amount.
		output := &ltcwire.TxOut{
			PkScript: addrScript,
			Value:    int64(amt),
		}
		if _, err := n.LtcMiner.SendOutputs([]*ltcwire.TxOut{output}, 30); err != nil {
			return err
		}

		// Finally, generate 6 new blocks to ensure the output gains a
		// sufficient number of confirmations.
		if _, err := n.LtcMiner.Node.Generate(6); err != nil {
			return err
		}
	}

	// Pause until the nodes current wallet balances reflects the amount
	// sent to it above.
	// TODO(roasbeef): factor out into helper func
	balanceTicker := time.Tick(time.Millisecond * 50)
	balanceTimeout := time.After(time.Second * 30)
	for {
		select {
		case <-balanceTicker:
			currentBal, err := target.WalletBalance(ctx, balReq)
			if err != nil {
				return err
			}

			if currentBal.ConfirmedBalance == initialBalance.ConfirmedBalance+int64(amt) {
				return nil
			}
		case <-balanceTimeout:
			return fmt.Errorf("balances not synced after deadline")
		}
	}
}

// ConnConfig describes the connection configuration parameters for the client.
// This
type ConnConfig struct {
	// Host is the IP address and port of the RPC server you want to connect
	// to.
	Host string

	// Endpoint is the websocket endpoint on the RPC server.  This is
	// typically "ws".
	Endpoint string

	// User is the username to use to authenticate to the RPC server.
	User string

	// Pass is the passphrase to use to authenticate to the RPC server.
	Pass string

	// DisableTLS specifies whether transport layer security should be
	// disabled.  It is recommended to always use TLS if the RPC server
	// supports it as otherwise your username and password is sent across
	// the wire in cleartext.
	DisableTLS bool

	// Certificates are the bytes for a PEM-encoded certificate chain used
	// for the TLS connection.  It has no effect if the DisableTLS parameter
	// is true.
	Certificates []byte

	// Proxy specifies to connect through a SOCKS 5 proxy server.  It may
	// be an empty string if a proxy is not required.
	Proxy string

	// ProxyUser is an optional username to use for the proxy server if it
	// requires authentication.  It has no effect if the Proxy parameter
	// is not set.
	ProxyUser string

	// ProxyPass is an optional password to use for the proxy server if it
	// requires authentication.  It has no effect if the Proxy parameter
	// is not set.
	ProxyPass string

	// DisableAutoReconnect specifies the client should not automatically
	// try to reconnect to the server when it has been disconnected.
	DisableAutoReconnect bool

	// DisableConnectOnNew specifies that a websocket client connection
	// should not be tried when creating the client with New.  Instead, the
	// client is created and returned unconnected, and Connect must be
	// called manually.
	DisableConnectOnNew bool

	// HTTPPostMode instructs the client to run using multiple independent
	// connections issuing HTTP POST requests instead of using the default
	// of websockets.  Websockets are generally preferred as some of the
	// features of the client such notifications only work with websockets,
	// however, not all servers support the websocket extensions, so this
	// flag can be set to true to use basic HTTP POST requests instead.
	HTTPPostMode bool

	// EnableBCInfoHacks is an option provided to enable compatiblity hacks
	// when connecting to blockchain.info RPC server
	EnableBCInfoHacks bool
}
