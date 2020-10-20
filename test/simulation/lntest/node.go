package lntest

import (
	"bytes"
	"encoding/hex"
	"flag"
	"fmt"
	"github.com/ExchangeUnion/xud-simulation/shared"
	"io"
	"io/ioutil"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"sync"
	"time"

	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"gopkg.in/macaroon.v2"

	"github.com/go-errors/errors"
	"github.com/lightningnetwork/lnd/lnrpc"
	"github.com/lightningnetwork/lnd/macaroons"
	"github.com/roasbeef/btcd/chaincfg/chainhash"
	"github.com/roasbeef/btcd/wire"
)

var (
	// numActiveNodes is the number of active nodes within the test network.
	numActiveNodes = 0

	// logOutput is a flag that can be set to append the output from the
	// seed nodes to log files.
	logOutput = flag.Bool("logoutput", true,
		"log output from node n to file outputn.log")

	// logPubKeyBytes is the number of bytes of the node's PubKey that
	// will be appended to the log file name. The whole PubKey is too
	// long and not really necessary to quickly identify what node
	// produced which log file.
	logPubKeyBytes = 4

	// trickleDelay is the amount of time in milliseconds between each
	// release of announcements by AuthenticatedGossiper to the network.
	trickleDelay = 50

	// The maximum CLTV delta from the current height
	// that should be used to set the timelock for the final hop.
	maxCltvExpiry = 5000
)

type nodeConfig struct {
	Name      string
	RPCConfig *ConnConfig
	BaseDir   string
	ExtraArgs []string
	Chain     string

	DataDir        string
	LogDir         string
	TLSCertPath    string
	TLSKeyPath     string
	AdminMacPath   string
	ReadMacPath    string
	InvoiceMacPath string

	HasSeed bool

	P2PPort  int
	RPCPort  int
	RESTPort int
}

func (cfg nodeConfig) P2PAddr() string {
	return net.JoinHostPort("127.0.0.1", strconv.Itoa(cfg.P2PPort))
}

func (cfg nodeConfig) RPCAddr() string {
	return net.JoinHostPort("127.0.0.1", strconv.Itoa(cfg.RPCPort))
}

func (cfg nodeConfig) RESTAddr() string {
	return net.JoinHostPort("127.0.0.1", strconv.Itoa(cfg.RESTPort))
}

func (cfg nodeConfig) DBPath() string {
	return filepath.Join(cfg.DataDir, "graph", "simnet/channel.db")
}

// genArgs generates a slice of command line arguments from the lightning node
// config struct.
func (cfg nodeConfig) genArgs() []string {
	var args []string

	var daemon string
	switch cfg.Chain {
	case "bitcoin":
		daemon = "btcd"
	case "litecoin":
		daemon = "ltcd"
	}

	encodedCert := hex.EncodeToString(cfg.RPCConfig.Certificates)
	args = append(args, fmt.Sprintf("--%v.simnet", cfg.Chain))
	args = append(args, "--nobootstrap")
	args = append(args, "--debuglevel=debug")
	args = append(args, fmt.Sprintf("--%v.active", cfg.Chain))
	args = append(args, fmt.Sprintf("--%v.defaultchanconfs=1", cfg.Chain))
	args = append(args, fmt.Sprintf("--%v.defaultremotedelay=4", cfg.Chain))
	args = append(args, fmt.Sprintf("--%v.rpchost=%v", daemon, cfg.RPCConfig.Host))
	args = append(args, fmt.Sprintf("--%v.rpcuser=%v", daemon, cfg.RPCConfig.User))
	args = append(args, fmt.Sprintf("--%v.rpcpass=%v", daemon, cfg.RPCConfig.Pass))
	args = append(args, fmt.Sprintf("--%v.rawrpccert=%v", daemon, encodedCert))
	args = append(args, fmt.Sprintf("--rpclisten=%v", cfg.RPCAddr()))
	args = append(args, fmt.Sprintf("--restlisten=%v", cfg.RESTAddr()))
	args = append(args, fmt.Sprintf("--listen=%v", cfg.P2PAddr()))
	args = append(args, fmt.Sprintf("--externalip=%v", cfg.P2PAddr()))
	args = append(args, fmt.Sprintf("--logdir=%v", cfg.LogDir))
	args = append(args, fmt.Sprintf("--datadir=%v", cfg.DataDir))
	args = append(args, fmt.Sprintf("--tlscertpath=%v", cfg.TLSCertPath))
	args = append(args, fmt.Sprintf("--tlskeypath=%v", cfg.TLSKeyPath))
	args = append(args, fmt.Sprintf("--configfile=%v", cfg.DataDir))
	args = append(args, fmt.Sprintf("--adminmacaroonpath=%v", cfg.AdminMacPath))
	args = append(args, fmt.Sprintf("--readonlymacaroonpath=%v", cfg.ReadMacPath))
	args = append(args, fmt.Sprintf("--invoicemacaroonpath=%v", cfg.InvoiceMacPath))
	args = append(args, fmt.Sprintf("--externalip=%s", cfg.P2PAddr()))
	args = append(args, fmt.Sprintf("--trickledelay=%v", trickleDelay))
	args = append(args, fmt.Sprintf("--max-cltv-expiry=%v", maxCltvExpiry))

	if !cfg.HasSeed {
		args = append(args, "--noseedbackup")
	}

	if cfg.ExtraArgs != nil {
		args = append(args, cfg.ExtraArgs...)
	}

	return args
}

// HarnessNode represents an instance of lnd running within our test network
// harness. Each HarnessNode instance also fully embeds an RPC client in
// order to pragmatically drive the node.
type HarnessNode struct {
	Cfg *nodeConfig

	// NodeID is a unique identifier for the node within a NetworkHarness.
	NodeID int

	// PubKey is the serialized compressed identity public key of the node.
	// This field will only be populated once the node itself has been
	// started via the Start() method.
	PubKey    [33]byte
	PubKeyStr string

	Cmd     *exec.Cmd
	pidFile string
	logFile *os.File

	// ProcessExit is a channel that's closed once it's detected that the
	// process this instance of HarnessNode is bound to has exited.
	ProcessExit chan struct{}

	chanWatchRequests chan *chanWatchRequest

	quit chan struct{}
	wg   sync.WaitGroup

	lnrpc.LightningClient

	lnrpc.WalletUnlockerClient
}

// Assert *HarnessNode implements the lnrpc.LightningClient interface.
var _ lnrpc.LightningClient = (*HarnessNode)(nil)
var _ lnrpc.WalletUnlockerClient = (*HarnessNode)(nil)

// newNode creates a new test lightning node instance from the passed config.
func newNode(cfg nodeConfig) (*HarnessNode, error) {
	var err error
	if cfg.BaseDir == "" {
		cfg.BaseDir, err = ioutil.TempDir("", "lndtest-node")
		if err != nil {
			return nil, err
		}
	}
	cfg.DataDir = filepath.Join(cfg.BaseDir, "data")
	cfg.LogDir = filepath.Join(cfg.BaseDir, "log")
	cfg.TLSCertPath = filepath.Join(cfg.DataDir, "tls.cert")
	cfg.TLSKeyPath = filepath.Join(cfg.DataDir, "tls.key")
	cfg.AdminMacPath = filepath.Join(cfg.DataDir, "admin.macaroon")
	cfg.ReadMacPath = filepath.Join(cfg.DataDir, "readonly.macaroon")
	cfg.InvoiceMacPath = filepath.Join(cfg.DataDir, "invoice.macaroon")

	cfg.P2PPort, err = shared.GetFreePort()
	if err != nil {
		return nil, err
	}
	cfg.RPCPort, err = shared.GetFreePort()
	if err != nil {
		return nil, err
	}
	cfg.RESTPort, err = shared.GetFreePort()
	if err != nil {
		return nil, err
	}

	nodeNum := numActiveNodes
	numActiveNodes++

	return &HarnessNode{
		Cfg:               &cfg,
		NodeID:            nodeNum,
		chanWatchRequests: make(chan *chanWatchRequest),
		quit:              make(chan struct{}),
	}, nil
}

// DBPath returns the filepath to the channeldb database file for this node.
func (hn *HarnessNode) DBPath() string {
	return hn.Cfg.DBPath()
}

// Start launches a new process running lnd. Additionally, the PID of the
// launched process is saved in order to possibly kill the process forcibly
// later.
//
// This may not clean up properly if an error is returned, so the caller should
// call shutdown() regardless of the return value.
func (hn *HarnessNode) Start(lndError chan<- error) error {
	args := hn.Cfg.genArgs()
	args = append(args, fmt.Sprintf("--profile=%d", 9000+hn.NodeID))
	hn.Cmd = exec.Command("/lnd-vol/go/src/github.com/lightningnetwork/lnd/lnd-debug", args...)

	// Redirect stderr output to buffer
	var errb bytes.Buffer
	hn.Cmd.Stderr = &errb

	// Make sure the log file cleanup function is initialized, even
	// if no log file is created.
	var finalizeLogfile = func() {
		if hn.logFile != nil {
			hn.logFile.Close()
		}
	}

	// If the logoutput flag is passed, redirect output from the nodes to
	// log files.
	if *logOutput {
		epoch := time.Now().Unix()
		fileName := fmt.Sprintf("./temp/logs/lnd-%s-%s-%d.log", hn.Cfg.Chain, hn.Cfg.Name, epoch)

		// Create file if not exists, otherwise append.
		file, err := os.OpenFile(fileName,
			os.O_WRONLY|os.O_APPEND|os.O_CREATE, 0666)
		if err != nil {
			return err
		}

		// Pass node's stderr to both errb and the file.
		w := io.MultiWriter(&errb, file)
		hn.Cmd.Stderr = w

		// Pass the node's stdout only to the file.
		hn.Cmd.Stdout = file

		// Let the node keep a reference to this file, such
		// that we can add to it if necessary.
		hn.logFile = file
	}

	if err := hn.Cmd.Start(); err != nil {
		return err
	}

	// Launch a new goroutine which that bubbles up any potential fatal
	// process errors to the goroutine running the tests.
	hn.ProcessExit = make(chan struct{})
	go func() {
		err := hn.Cmd.Wait()

		if err != nil {
			lndError <- errors.Errorf("%v\n%v\n", err, errb.String())
		}

		// Signal any onlookers that this process has exited.
		close(hn.ProcessExit)

		// Make sure log file is closed.
		finalizeLogfile()
	}()

	// Write process ID to a file.
	if err := hn.writePidFile(); err != nil {
		hn.Cmd.Process.Kill()
		return err
	}

	// Since Stop uses the LightningClient to stop the node, if we fail to get a
	// connected client, we have to kill the process.
	useMacaroons := !hn.Cfg.HasSeed
	conn, err := hn.ConnectRPC(useMacaroons)
	if err != nil {
		hn.Cmd.Process.Kill()
		return err
	}

	// If the node was created with a seed, we will need to perform an
	// additional step to unlock the wallet. The connection returned will
	// only use the TLS certs, and can only perform operations necessary to
	// unlock the daemon.
	if hn.Cfg.HasSeed {
		hn.WalletUnlockerClient = lnrpc.NewWalletUnlockerClient(conn)
		return nil
	}

	return hn.initLightningClient(conn)
}

// Init initializes a harness node by passing the init request via rpc. After
// the request is submitted, this method will block until an
// macaroon-authenticated rpc connection can be established to the harness node.
// Once established, the new connection is used to initialize the
// LightningClient and subscribes the HarnessNode to topology changes.
func (hn *HarnessNode) Init(ctx context.Context,
	initReq *lnrpc.InitWalletRequest) error {

	timeout := time.Duration(time.Second * 15)
	ctxt, _ := context.WithTimeout(ctx, timeout)
	_, err := hn.InitWallet(ctxt, initReq)
	if err != nil {
		return err
	}

	// Wait for the wallet to finish unlocking, such that we can connect to
	// it via a macaroon-authenticated rpc connection.
	var conn *grpc.ClientConn
	if err = WaitPredicate(func() bool {
		conn, err = hn.ConnectRPC(true)
		return err == nil
	}, 5*time.Second); err != nil {
		return err
	}

	return hn.initLightningClient(conn)
}

// initLightningClient constructs the grpc LightningClient from the given client
// connection and subscribes the harness node to graph topology updates.
// This method also spawns a lightning network watcher for this node,
// which watches for topology changes.
func (hn *HarnessNode) initLightningClient(conn *grpc.ClientConn) error {
	// Construct the LightningClient that will allow us to use the
	// HarnessNode directly for normal rpc operations.
	hn.LightningClient = lnrpc.NewLightningClient(conn)

	// Set the harness node's pubkey to what the node claims in GetInfo.
	err := hn.FetchNodeInfo()
	if err != nil {
		return err
	}

	// Launch the watcher that will hook into graph related topology change
	// from the PoV of this node.
	hn.wg.Add(1)
	go hn.lightningNetworkWatcher()

	return nil
}

// FetchNodeInfo queries an unlocked node to retrieve its public key.
func (hn *HarnessNode) FetchNodeInfo() error {
	// Obtain the lnid of this node for quick identification purposes.
	ctxb := context.Background()
	info, err := hn.GetInfo(ctxb, &lnrpc.GetInfoRequest{})
	if err != nil {
		return err
	}

	hn.PubKeyStr = info.IdentityPubkey

	pubkey, err := hex.DecodeString(info.IdentityPubkey)
	if err != nil {
		return err
	}
	copy(hn.PubKey[:], pubkey)

	return nil
}

// AddToLog adds a line of choice to the node's logfile. This is useful
// to interleave test output with output from the node.
func (hn *HarnessNode) AddToLog(line string) error {
	// If this node was not set up with a log file, just return early.
	if hn.logFile == nil {
		return nil
	}
	if _, err := hn.logFile.WriteString(line); err != nil {
		return err
	}
	return nil
}

// writePidFile writes the process ID of the running lnd process to a .pid file.
func (hn *HarnessNode) writePidFile() error {
	filePath := filepath.Join(hn.Cfg.BaseDir, fmt.Sprintf("%v.pid", hn.NodeID))

	pid, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer pid.Close()

	_, err = fmt.Fprintf(pid, "%v\n", hn.Cmd.Process.Pid)
	if err != nil {
		return err
	}

	hn.pidFile = filePath
	return nil
}

// ConnectRPC uses the TLS certificate and admin macaroon files written by the
// lnd node to create a gRPC client connection.
func (hn *HarnessNode) ConnectRPC(useMacs bool) (*grpc.ClientConn, error) {
	// Wait until TLS certificate and admin macaroon are created before
	// using them, up to 20 sec.
	tlsTimeout := time.After(30 * time.Second)
	for !fileExists(hn.Cfg.TLSCertPath) {
		select {
		case <-tlsTimeout:
			return nil, fmt.Errorf("timeout waiting for TLS cert " +
				"file to be created after 30 seconds")
		case <-time.After(100 * time.Millisecond):
		}
	}

	opts := []grpc.DialOption{
		grpc.WithBlock(),
		grpc.WithTimeout(time.Second * 120),
	}

	tlsCreds, err := credentials.NewClientTLSFromFile(hn.Cfg.TLSCertPath, "")
	if err != nil {
		return nil, err
	}

	opts = append(opts, grpc.WithTransportCredentials(tlsCreds))

	if !useMacs {
		return grpc.Dial(hn.Cfg.RPCAddr(), opts...)
	}

	macTimeout := time.After(30 * time.Second)
	for !fileExists(hn.Cfg.AdminMacPath) {
		select {
		case <-macTimeout:
			return nil, fmt.Errorf("timeout waiting for admin " +
				"macaroon file to be created after 30 seconds")
		case <-time.After(100 * time.Millisecond):
		}
	}

	macBytes, err := ioutil.ReadFile(hn.Cfg.AdminMacPath)
	if err != nil {
		return nil, err
	}
	mac := &macaroon.Macaroon{}
	if err = mac.UnmarshalBinary(macBytes); err != nil {
		return nil, err
	}

	macCred := macaroons.NewMacaroonCredential(mac)
	opts = append(opts, grpc.WithPerRPCCredentials(macCred))

	return grpc.Dial(hn.Cfg.RPCAddr(), opts...)
}

// SetExtraArgs assigns the ExtraArgs field for the node's configuration. The
// changes will take effect on restart.
func (hn *HarnessNode) SetExtraArgs(extraArgs []string) {
	hn.Cfg.ExtraArgs = extraArgs
}

// cleanup cleans up all the temporary files created by the node's process.
func (hn *HarnessNode) cleanup() error {
	return os.RemoveAll(hn.Cfg.BaseDir)
}

// Stop attempts to stop the active lnd process.
func (hn *HarnessNode) stop() error {
	// Do nothing if the process is not running.
	if hn.ProcessExit == nil {
		return nil
	}

	// If Start() failed before creating a client, we will just wait for the
	// child process to die.
	if hn.LightningClient != nil {
		// Don't watch for error because sometimes the RPC connection gets
		// closed before a response is returned.
		req := lnrpc.StopRequest{}
		ctx := context.Background()
		hn.LightningClient.StopDaemon(ctx, &req)
	}

	// Wait for lnd process and other goroutines to exit.
	select {
	case <-hn.ProcessExit:
	case <-time.After(60 * time.Second):
		return fmt.Errorf("process did not exit")
	}

	close(hn.quit)
	hn.wg.Wait()

	hn.quit = nil
	hn.ProcessExit = nil
	hn.LightningClient = nil
	hn.WalletUnlockerClient = nil
	return nil
}

// shutdown stops the active lnd process and cleans up any temporary directories
// created along the way.
func (hn *HarnessNode) shutdown() error {
	if err := hn.stop(); err != nil {
		return err
	}
	if err := hn.cleanup(); err != nil {
		return err
	}
	return nil
}

// closeChanWatchRequest is a request to the lightningNetworkWatcher to be
// notified once it's detected within the test Lightning Network, that a
// channel has either been added or closed.
type chanWatchRequest struct {
	chanPoint wire.OutPoint

	chanOpen bool

	eventChan chan struct{}
}

// getChanPointFundingTxid returns the given channel point's funding txid in
// raw bytes.
func getChanPointFundingTxid(chanPoint *lnrpc.ChannelPoint) ([]byte, error) {
	var txid []byte

	// A channel point's funding txid can be get/set as a byte slice or a
	// string. In the case it is a string, decode it.
	switch chanPoint.GetFundingTxid().(type) {
	case *lnrpc.ChannelPoint_FundingTxidBytes:
		txid = chanPoint.GetFundingTxidBytes()
	case *lnrpc.ChannelPoint_FundingTxidStr:
		s := chanPoint.GetFundingTxidStr()
		h, err := chainhash.NewHashFromStr(s)
		if err != nil {
			return nil, err
		}

		txid = h[:]
	}

	return txid, nil
}

// lightningNetworkWatcher is a goroutine which is able to dispatch
// notifications once it has been observed that a target channel has been
// closed or opened within the network. In order to dispatch these
// notifications, the GraphTopologySubscription client exposed as part of the
// gRPC interface is used.
func (hn *HarnessNode) lightningNetworkWatcher() {
	defer hn.wg.Done()

	graphUpdates := make(chan *lnrpc.GraphTopologyUpdate)
	hn.wg.Add(1)
	go func() {
		defer hn.wg.Done()

		ctxb := context.Background()
		req := &lnrpc.GraphTopologySubscription{}
		topologyClient, err := hn.SubscribeChannelGraph(ctxb, req)
		if err != nil {
			// We panic here in case of an error as failure to
			// create the topology client will cause all subsequent
			// tests to fail.
			panic(fmt.Errorf("unable to create topology "+
				"client: %v", err))
		}

		for {
			update, err := topologyClient.Recv()
			if err == io.EOF {
				return
			} else if err != nil {
				return
			}

			select {
			case graphUpdates <- update:
			case <-hn.quit:
				return
			}
		}
	}()

	// For each outpoint, we'll track an integer which denotes the number
	// of edges seen for that channel within the network. When this number
	// reaches 2, then it means that both edge advertisements has
	// propagated through the network.
	openChans := make(map[wire.OutPoint]int)
	openClients := make(map[wire.OutPoint][]chan struct{})

	closedChans := make(map[wire.OutPoint]struct{})
	closeClients := make(map[wire.OutPoint][]chan struct{})

	for {
		select {

		// A new graph update has just been received, so we'll examine
		// the current set of registered clients to see if we can
		// dispatch any requests.
		case graphUpdate := <-graphUpdates:
			// For each new channel, we'll increment the number of
			// edges seen by one.
			for _, newChan := range graphUpdate.ChannelUpdates {
				txidHash, _ := getChanPointFundingTxid(newChan.ChanPoint)
				txid, _ := chainhash.NewHash(txidHash)
				op := wire.OutPoint{
					Hash:  *txid,
					Index: newChan.ChanPoint.OutputIndex,
				}
				openChans[op]++

				// For this new channel, if the number of edges
				// seen is less than two, then the channel
				// hasn't been fully announced yet.
				if numEdges := openChans[op]; numEdges < 2 {
					continue
				}

				// Otherwise, we'll notify all the registered
				// clients and remove the dispatched clients.
				for _, eventChan := range openClients[op] {
					close(eventChan)
				}
				delete(openClients, op)
			}

			// For each channel closed, we'll mark that we've
			// detected a channel closure while lnd was pruning the
			// channel graph.
			for _, closedChan := range graphUpdate.ClosedChans {
				txidHash, _ := getChanPointFundingTxid(closedChan.ChanPoint)
				txid, _ := chainhash.NewHash(txidHash)
				op := wire.OutPoint{
					Hash:  *txid,
					Index: closedChan.ChanPoint.OutputIndex,
				}
				closedChans[op] = struct{}{}

				// As the channel has been closed, we'll notify
				// all register clients.
				for _, eventChan := range closeClients[op] {
					close(eventChan)
				}
				delete(closeClients, op)
			}

			// A new watch request, has just arrived. We'll either be able
			// to dispatch immediately, or need to add the client for
			// processing later.
		case watchRequest := <-hn.chanWatchRequests:
			targetChan := watchRequest.chanPoint

			// TODO(roasbeef): add update type also, checks for
			// multiple of 2
			if watchRequest.chanOpen {
				// If this is an open request, then it can be
				// dispatched if the number of edges seen for
				// the channel is at least two.
				if numEdges := openChans[targetChan]; numEdges >= 2 {
					close(watchRequest.eventChan)
					continue
				}

				// Otherwise, we'll add this to the list of
				// watch open clients for this out point.
				openClients[targetChan] = append(openClients[targetChan],
					watchRequest.eventChan)
				continue
			}

			// If this is a close request, then it can be
			// immediately dispatched if we've already seen a
			// channel closure for this channel.
			if _, ok := closedChans[targetChan]; ok {
				close(watchRequest.eventChan)
				continue
			}

			// Otherwise, we'll add this to the list of close watch
			// clients for this out point.
			closeClients[targetChan] = append(closeClients[targetChan],
				watchRequest.eventChan)

		case <-hn.quit:
			return
		}
	}
}

// WaitForNetworkChannelOpen will block until a channel with the target
// outpoint is seen as being fully advertised within the network. A channel is
// considered "fully advertised" once both of its directional edges has been
// advertised within the test Lightning Network.
func (hn *HarnessNode) WaitForNetworkChannelOpen(ctx context.Context,
	op *lnrpc.ChannelPoint) error {

	eventChan := make(chan struct{})

	txidHash, err := getChanPointFundingTxid(op)
	if err != nil {
		return err
	}
	txid, err := chainhash.NewHash(txidHash)
	if err != nil {
		return err
	}

	hn.chanWatchRequests <- &chanWatchRequest{
		chanPoint: wire.OutPoint{
			Hash:  *txid,
			Index: op.OutputIndex,
		},
		eventChan: eventChan,
		chanOpen:  true,
	}

	select {
	case <-eventChan:
		return nil
	case <-ctx.Done():
		return fmt.Errorf("channel not opened before timeout")
	}
}

// WaitForNetworkChannelClose will block until a channel with the target
// outpoint is seen as closed within the network. A channel is considered
// closed once a transaction spending the funding outpoint is seen within a
// confirmed block.
func (hn *HarnessNode) WaitForNetworkChannelClose(ctx context.Context,
	op *lnrpc.ChannelPoint) error {

	eventChan := make(chan struct{})

	txidHash, err := getChanPointFundingTxid(op)
	if err != nil {
		return err
	}
	txid, err := chainhash.NewHash(txidHash)
	if err != nil {
		return err
	}

	hn.chanWatchRequests <- &chanWatchRequest{
		chanPoint: wire.OutPoint{
			Hash:  *txid,
			Index: op.OutputIndex,
		},
		eventChan: eventChan,
		chanOpen:  false,
	}

	select {
	case <-eventChan:
		return nil
	case <-ctx.Done():
		return fmt.Errorf("channel not closed before timeout")
	}
}

// WaitForBlockchainSync will block until the target nodes has fully
// synchronized with the blockchain. If the passed context object has a set
// timeout, then the goroutine will continually poll until the timeout has
// elapsed. In the case that the chain isn't synced before the timeout is up,
// then this function will return an error.
func (hn *HarnessNode) WaitForBlockchainSync(ctx context.Context) error {
	errChan := make(chan error, 1)
	retryDelay := time.Millisecond * 100

	go func() {
		for {
			select {
			case <-ctx.Done():
			case <-hn.quit:
				return
			default:
			}

			getInfoReq := &lnrpc.GetInfoRequest{}
			getInfoResp, err := hn.GetInfo(ctx, getInfoReq)
			if err != nil {
				errChan <- err
				return
			}
			if getInfoResp.SyncedToChain {
				errChan <- nil
				return
			}

			select {
			case <-ctx.Done():
				return
			case <-time.After(retryDelay):
			}
		}
	}()

	select {
	case <-hn.quit:
		return nil
	case err := <-errChan:
		return err
	case <-ctx.Done():
		return fmt.Errorf("Timeout while waiting for blockchain sync")
	}
}

// fileExists reports whether the named file or directory exists.
// This function is taken from https://github.com/btcsuite/btcd
func fileExists(name string) bool {
	if _, err := os.Stat(name); err != nil {
		if os.IsNotExist(err) {
			return false
		}
	}
	return true
}
