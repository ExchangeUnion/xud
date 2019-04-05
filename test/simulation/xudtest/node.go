package xudtest

import (
	"bytes"
	"fmt"
	"github.com/ExchangeUnion/xud-simulation/lntest"
	"github.com/ExchangeUnion/xud-simulation/xudrpc"
	"github.com/go-errors/errors"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"net"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"sync"
	"sync/atomic"
	"time"
)

var (
	numActiveNodes int32 = 0
	baseP2pPort          = 40000
	baseRpcPort          = 30000
)

type nodeConfig struct {
	DataDir     string
	XUDPath     string
	TLSCertPath string

	LndBtcHost     string
	LndBtcPort     int
	LndBtcCertPath string
	LndBtcMacPath  string

	LndLtcHost     string
	LndLtcPort     int
	LndLtcCertPath string
	LndLtcMacPath  string

	P2PPort int
	RPCPort int
}

// genArgs generates a slice of command line arguments from the xud node
// config struct.
func (cfg nodeConfig) genArgs() []string {
	var args []string

	args = append(args, "--initdb=false")
	args = append(args, "--loglevel=debug")
	args = append(args, "--raiden.disable")

	args = append(args, fmt.Sprintf("--xudir=%v", cfg.DataDir))
	args = append(args, fmt.Sprintf("--p2p.port=%v", cfg.P2PPort))
	args = append(args, fmt.Sprintf("--rpc.port=%v", cfg.RPCPort))

	args = append(args, fmt.Sprintf("--lnd.BTC.host=%v", cfg.LndBtcHost))
	args = append(args, fmt.Sprintf("--lnd.BTC.port=%v", cfg.LndBtcPort))
	args = append(args, fmt.Sprintf("--lnd.BTC.certpath=%v", cfg.LndBtcCertPath))
	args = append(args, fmt.Sprintf("--lnd.BTC.macaroonpath=%v", cfg.LndBtcMacPath))

	args = append(args, fmt.Sprintf("--lnd.LTC.host=%v", cfg.LndLtcHost))
	args = append(args, fmt.Sprintf("--lnd.LTC.port=%v", cfg.LndLtcPort))
	args = append(args, fmt.Sprintf("--lnd.LTC.certpath=%v", cfg.LndLtcCertPath))
	args = append(args, fmt.Sprintf("--lnd.LTC.macaroonpath=%v", cfg.LndLtcMacPath))

	return args
}

// HarnessNode represents an instance of xud running within our test network
// harness. Each HarnessNode instance also fully embeds an RPC Client in
// order to pragmatically drive the node.
type HarnessNode struct {
	Cfg *nodeConfig
	Cmd *exec.Cmd

	Name   string
	Id     int
	pubKey string

	LndBtcNode *lntest.HarnessNode
	LndLtcNode *lntest.HarnessNode

	// processExit is a channel that's closed once it's detected that the
	// process this instance of HarnessNode is bound to has exited.
	processExit chan struct{}

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

func newNode(name string, lndBtcNode *lntest.HarnessNode, lndLtcNode *lntest.HarnessNode) (*HarnessNode, error) {
	nodeNum := int(atomic.AddInt32(&numActiveNodes, 1))

	dataDir, err := filepath.Abs("./xuddatadir-" + name)
	if err != nil {
		return nil, err
	}

	xudPath, err := filepath.Abs("../../")
	if err != nil {
		return nil, err
	}

	cfg := nodeConfig{
		DataDir:        dataDir,
		XUDPath:        xudPath,
		LndBtcHost:     "127.0.0.1",
		LndBtcPort:     lndBtcNode.Cfg.RPCPort,
		LndBtcCertPath: lndBtcNode.Cfg.TLSCertPath,
		LndBtcMacPath:  lndBtcNode.Cfg.AdminMacPath,
		LndLtcHost:     "127.0.0.1",
		LndLtcPort:     lndLtcNode.Cfg.RPCPort,
		LndLtcCertPath: lndLtcNode.Cfg.TLSCertPath,
		LndLtcMacPath:  lndLtcNode.Cfg.AdminMacPath,
	}

	cfg.TLSCertPath = filepath.Join(cfg.DataDir, "tls.cert")
	cfg.P2PPort = baseP2pPort + nodeNum
	cfg.RPCPort = baseRpcPort + nodeNum

	return &HarnessNode{
		Cfg:        &cfg,
		Name:       name,
		Id:         nodeNum,
		LndBtcNode: lndBtcNode,
		LndLtcNode: lndLtcNode,
	}, nil
}

// Start launches a new running process of xud.
func (hn *HarnessNode) start(errorChan chan<- *xudError) error {
	hn.quit = make(chan struct{})

	args := hn.Cfg.genArgs()
	hn.Cmd = exec.Command(filepath.Join(hn.Cfg.XUDPath, "bin/xud"), args...)

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
	hn.processExit = make(chan struct{})
	hn.wg.Add(1)
	go func() {
		defer hn.wg.Done()

		err := hn.Cmd.Wait()
		if err != nil {
			errorChan <- &xudError{hn, errors.Errorf("%v: %v\n%v\n", err, errb.String(), out.String())}
		}

		// Signal any onlookers that this process has exited.
		close(hn.processExit)
	}()

	// Since Stop uses the XudClient to stop the node, if we fail to get a
	// connected Client, we have to kill the process.
	conn, err := hn.ConnectRPC(false)
	if err != nil {
		hn.Cmd.Process.Kill()
		return err
	}

	hn.Client = xudrpc.NewXudClient(conn)

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
				"file to be created after 30 seconds: %v", hn.Cfg.TLSCertPath)
		case <-time.After(100 * time.Millisecond):
		}
	}

	opts := []grpc.DialOption{
		grpc.WithBlock(),
		grpc.WithTimeout(time.Second * 20),
	}

	tlsCreds, err := credentials.NewClientTLSFromFile(hn.Cfg.TLSCertPath, "")
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
	if hn.processExit == nil {
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
	case <-hn.processExit:
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
	hn.processExit = nil
	hn.Client = nil
	return nil
}

func (hn *HarnessNode) cleanup() error {
	return os.RemoveAll(hn.Cfg.DataDir)
}

func (hn *HarnessNode) PubKey() string {
	return hn.pubKey
}

func (hn *HarnessNode) SetPubKey(pubKey string) {
	hn.pubKey = pubKey
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
