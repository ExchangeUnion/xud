package xudtest

import (
	"bytes"
	"fmt"
	"github.com/ExchangeUnion/xud-simulation/connexttest"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"sync"
	"sync/atomic"
	"time"

	"context"
	"github.com/ExchangeUnion/xud-simulation/lntest"
	"github.com/ExchangeUnion/xud-simulation/xudrpc"
	"github.com/go-errors/errors"
	"github.com/phayes/freeport"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

var numActiveNodes int32

type nodeConfig struct {
	DataDir     string
	XUDPath     string
	LogPath     string
	TLSCertPath string

	LndBtcHost     string
	LndBtcPort     int
	LndBtcCertPath string
	LndBtcMacPath  string

	LndLtcHost     string
	LndLtcPort     int
	LndLtcCertPath string
	LndLtcMacPath  string

	RaidenDisable bool
	RaidenHost    string
	RaidenPort    int

	ConnextDisable bool
	ConnextHost    string
	ConnextPort    int

	P2PPort  int
	RPCPort  int
	HTTPPort int

	NoBalanceChecks bool
}

// genArgs generates a slice of command line arguments from the xud node
// config struct.
func (cfg nodeConfig) genArgs() []string {
	var args []string

	args = append(args, "--initdb=false")
	args = append(args, "--regtest")
	args = append(args, "--loglevel=trace")

	if cfg.NoBalanceChecks {
		args = append(args, "--nobalancechecks=true")
	}

	args = append(args, fmt.Sprintf("--xudir=%v", cfg.DataDir))
	args = append(args, fmt.Sprintf("--logpath=%v", cfg.LogPath))

	args = append(args, fmt.Sprintf("--rpc.port=%v", cfg.RPCPort))

	args = append(args, fmt.Sprintf("--http.port=%v", cfg.HTTPPort))

	args = append(args, fmt.Sprintf("--p2p.port=%v", cfg.P2PPort))
	args = append(args, fmt.Sprintf("--p2p.addresses=%v", cfg.P2PAddr()))

	args = append(args, fmt.Sprintf("--lnd.BTC.host=%v", cfg.LndBtcHost))
	args = append(args, fmt.Sprintf("--lnd.BTC.port=%v", cfg.LndBtcPort))
	args = append(args, fmt.Sprintf("--lnd.BTC.certpath=%v", cfg.LndBtcCertPath))
	args = append(args, fmt.Sprintf("--lnd.BTC.macaroonpath=%v", cfg.LndBtcMacPath))

	args = append(args, fmt.Sprintf("--lnd.LTC.host=%v", cfg.LndLtcHost))
	args = append(args, fmt.Sprintf("--lnd.LTC.port=%v", cfg.LndLtcPort))
	args = append(args, fmt.Sprintf("--lnd.LTC.certpath=%v", cfg.LndLtcCertPath))
	args = append(args, fmt.Sprintf("--lnd.LTC.macaroonpath=%v", cfg.LndLtcMacPath))

	if !cfg.RaidenDisable {
		args = append(args, fmt.Sprintf("--raiden.host=%v", cfg.RaidenHost))
		args = append(args, fmt.Sprintf("--raiden.port=%v", cfg.RaidenPort))
	} else {
		args = append(args, "--raiden.disable")
	}

	if !cfg.ConnextDisable {
		args = append(args, fmt.Sprintf("--connext.host=%v", cfg.ConnextHost))
		args = append(args, fmt.Sprintf("--connext.port=%v", cfg.ConnextPort))
		args = append(args, "--connext.webhookhost=127.0.0.1")
		args = append(args, fmt.Sprintf("--connext.webhookport=%v", cfg.HTTPPort))

	} else {
		args = append(args, "--connext.disable")
	}

	return args
}

// HarnessNode represents an instance of xud running within our test network
// harness. Each HarnessNode instance also fully embeds an RPC Client in
// order to pragmatically drive the node.
type HarnessNode struct {
	Cfg     *nodeConfig
	Cmd     *exec.Cmd
	EnvVars []string

	Name   string
	ID     int
	pubKey string

	LndBtcNode    *lntest.HarnessNode
	LndLtcNode    *lntest.HarnessNode
	ConnextClient *connexttest.HarnessClient

	// processExit is a channel that's closed once it's detected that the
	// process this instance of HarnessNode is bound to has exited.
	ProcessExit chan struct{}

	quit chan struct{}
	wg   sync.WaitGroup

	Client xudrpc.XudClient
}

func (cfg nodeConfig) RPCAddr() string {
	return net.JoinHostPort("127.0.0.1", strconv.Itoa(cfg.RPCPort))
}

func (cfg nodeConfig) P2PAddr() string {
	return net.JoinHostPort("127.0.0.1", strconv.Itoa(cfg.P2PPort))
}

func newNode(name string, xudPath string, noBalanceChecks bool) (*HarnessNode, error) {
	nodeNum := int(atomic.AddInt32(&numActiveNodes, 1))

	_ = os.Mkdir("./temp", 0755)
	dataDir, err := filepath.Abs("./temp/xuddatadir-" + name)
	if err != nil {
		return nil, err
	}

	cfg := nodeConfig{
		DataDir:         dataDir,
		XUDPath:         xudPath,
		NoBalanceChecks: noBalanceChecks,
		RaidenDisable:   true,
	}
	epoch := time.Now().Unix()
	cfg.LogPath = fmt.Sprintf("./temp/logs/xud-%s-%d.log", name, epoch)

	cfg.TLSCertPath = filepath.Join(cfg.DataDir, "tls.cert")
	cfg.P2PPort, err = freeport.GetFreePort()
	if err != nil {
		return nil, err
	}
	cfg.RPCPort, err = freeport.GetFreePort()
	if err != nil {
		return nil, err
	}
	cfg.HTTPPort, err = freeport.GetFreePort()
	if err != nil {
		return nil, err
	}

	cfg.RaidenHost = "127.0.0.1"
	cfg.RaidenPort, err = freeport.GetFreePort()
	if err != nil {
		return nil, err
	}

	return &HarnessNode{
		Cfg:  &cfg,
		Name: name,
		ID:   nodeNum,
	}, nil
}

// SetLnd sets the lnd configuration for a specified chain.
func (hn *HarnessNode) SetLnd(lndNode *lntest.HarnessNode, chain string) {
	switch chain {
	case "BTC":
		hn.Cfg.LndBtcHost = "127.0.0.1"
		hn.Cfg.LndBtcPort = lndNode.Cfg.RPCPort
		hn.Cfg.LndBtcCertPath = lndNode.Cfg.TLSCertPath
		hn.Cfg.LndBtcMacPath = lndNode.Cfg.AdminMacPath
		hn.LndBtcNode = lndNode
	case "LTC":
		hn.Cfg.LndLtcHost = "127.0.0.1"
		hn.Cfg.LndLtcPort = lndNode.Cfg.RPCPort
		hn.Cfg.LndLtcCertPath = lndNode.Cfg.TLSCertPath
		hn.Cfg.LndLtcMacPath = lndNode.Cfg.AdminMacPath
		hn.LndLtcNode = lndNode
	}
}

func (hn *HarnessNode) SetConnextClient(client *connexttest.HarnessClient) {
	hn.Cfg.ConnextHost = "0.0.0.0"
	hn.Cfg.ConnextPort = client.Cfg.Port
	hn.ConnextClient = client
}

func (hn *HarnessNode) SetEnvVars(envVars []string) {
	hn.EnvVars = envVars
}

// Start launches a new running process of xud.
func (hn *HarnessNode) Start(errorChan chan<- *XudError) error {
	hn.quit = make(chan struct{})

	args := hn.Cfg.genArgs()
	cmd := exec.Command(filepath.Join(hn.Cfg.XUDPath, "bin/xud"), args...)
	if hn.EnvVars != nil && len(hn.EnvVars) > 0 {
		cmd.Env = os.Environ()
		for _, kv := range hn.EnvVars {
			cmd.Env = append(cmd.Env, kv)
		}
	}
	hn.Cmd = cmd

	// Redirect stderr output to buffer
	var errb bytes.Buffer
	hn.Cmd.Stderr = &errb

	// Redirect stdout output to buffer
	var out bytes.Buffer
	hn.Cmd.Stdout = &out

	if err := hn.Cmd.Start(); err != nil {
		return err
	}

	// Launch a new goroutine which that bubbles up any potential fatal
	// process errors to the goroutine running the tests.
	hn.ProcessExit = make(chan struct{})
	hn.wg.Add(1)
	go func() {
		defer hn.wg.Done()

		err := hn.Cmd.Wait()
		if err != nil && errorChan != nil {
			errorChan <- &XudError{hn, errors.Errorf("%v: %v\n%v\n", err, errb.String(), out.String())}
		}

		// Signal any onlookers that this process has exited.
		close(hn.ProcessExit)
		hn.Client = nil
	}()

	// Since Stop uses the XudClient to stop the node, if we fail to get a
	// connected Client, we have to kill the process.
	conn, err := hn.ConnectRPC(false)
	if err != nil {
		hn.Cmd.Process.Kill()
		return err
	}

	hn.Client = xudrpc.NewXudClient(conn)

	if err := hn.WaitReady(); err != nil {
		return err
	}

	return nil
}

func (hn *HarnessNode) WaitReady() error {
	isReady := func() bool {
		_, err := hn.Client.GetInfo(context.Background(), &xudrpc.GetInfoRequest{})
		return err == nil
	}

	// Wait until xud node finish initializing, up to 20 sec.
	timeout := time.After(20 * time.Second)
	for !isReady() {
		select {
		case <-timeout:
			return fmt.Errorf("timeout waiting for xud to be ready")
		case <-time.After(1 * time.Second):
		}
	}

	return nil
}

// ConnectRPC uses the TLS certificate and admin macaroon files written by the
// xud node to create a gRPC Client connection.
func (hn *HarnessNode) ConnectRPC(useMacs bool) (*grpc.ClientConn, error) {
	// Wait until TLS certificate and admin macaroon are created before
	// using them, up to 20 sec.
	tlsTimeout := time.After(20 * time.Second)
	for !fileExists(hn.Cfg.TLSCertPath) {
		select {
		case <-tlsTimeout:
			return nil, fmt.Errorf("timeout waiting for TLS cert "+
				"file to be created after 20 seconds: %v", hn.Cfg.TLSCertPath)
		case <-time.After(1 * time.Second):
		}
	}

	opts := []grpc.DialOption{
		grpc.WithBlock(),
		grpc.WithTimeout(time.Second * 20),
	}

	tlsCreds, err := credentials.NewClientTLSFromFile(hn.Cfg.TLSCertPath, "")
	for tries := 5; tries > 0; tries-- {
		if err == nil {
			break
		}

		fmt.Printf("Failed to read TLS certificate: %v, remaining tries: %v\n", err, tries-1)
		time.Sleep(2 * time.Second)
		tlsCreds, err = credentials.NewClientTLSFromFile(hn.Cfg.TLSCertPath, "")
	}

	if err != nil {
		return nil, err
	}

	opts = append(opts, grpc.WithTransportCredentials(tlsCreds))

	return grpc.Dial(hn.Cfg.RPCAddr(), opts...)
}

func (hn *HarnessNode) shutdown(kill bool, cleanup bool) error {
	if err := hn.stop(kill); err != nil {
		return err
	}
	if cleanup {
		if err := hn.cleanup(); err != nil {
			return err
		}
	}
	return nil
}

func (hn *HarnessNode) stop(kill bool) error {
	// Do nothing if the process is not running.
	if hn.ProcessExit == nil {
		return nil
	}

	if hn.Client != nil {
		ctx := context.Background()
		req := xudrpc.ShutdownRequest{}
		if _, err := hn.Client.Shutdown(ctx, &req); err != nil {
			return fmt.Errorf("RPC Shutdown failure: %v", err)
		}
	}

	// Wait for xud process and other goroutines to exit.
	select {
	case <-hn.ProcessExit:
	case <-time.After(10 * time.Second):
		if !kill {
			return fmt.Errorf("process did not exit")
		}
		if err := hn.Cmd.Process.Kill(); err != nil {
			return fmt.Errorf("failed to kill process: %v", err)
		}
	}

	close(hn.quit)
	hn.wg.Wait()

	hn.quit = nil
	hn.ProcessExit = nil
	hn.Client = nil
	return nil
}

func (hn *HarnessNode) cleanup() error {
	return os.RemoveAll(hn.Cfg.DataDir)
}

// PubKey returns the pubkey for this node.
func (hn *HarnessNode) PubKey() string {
	return hn.pubKey
}

// SetPubKey sets the pubkey for this node.
func (hn *HarnessNode) SetPubKey(pubKey string) {
	hn.pubKey = pubKey
}

// NodeURI returns the p2p node uri for this node.
func (hn *HarnessNode) NodeURI() string {
	return fmt.Sprintf("%v@%v", hn.PubKey(), hn.Cfg.P2PAddr())
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
