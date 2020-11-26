package xudtest

import (
	"context"
	// "fmt"
	// "github.com/ExchangeUnion/xud-simulation/connexttest"
	"sync"
	"time"

	"github.com/ExchangeUnion/xud-simulation/lntest"
)

// XudError is an error along with the node the error resulted from
type XudError struct {
	Node *HarnessNode
	Err  error
}

// NetworkHarness is an integration testing harness for xud.
type NetworkHarness struct {
	ActiveNodes map[int]*HarnessNode

	Alice *HarnessNode
	Bob   *HarnessNode
	Carol *HarnessNode
	Dave  *HarnessNode

	LndBtcNetwork *lntest.NetworkHarness
	LndLtcNetwork *lntest.NetworkHarness
	// ConnextNetwork *connexttest.NetworkHarness

	errorChan chan *XudError

	quit chan struct{}

	mtx sync.Mutex
}

// NewNetworkHarness creates and returns a new network harness.
func NewNetworkHarness() (*NetworkHarness, error) {
	n := NetworkHarness{
		ActiveNodes: make(map[int]*HarnessNode),
		errorChan:   make(chan *XudError),
		quit:        make(chan struct{}),
	}
	return &n, nil
}

type CtxSetter interface {
	SetCtx(ctx context.Context, cancel context.CancelFunc)
}

/*
func (n *NetworkHarness) newConnextClient(ctx context.Context, node *HarnessNode, envVars *[]string) (*connexttest.HarnessClient, error) {
	if err := n.ConnextNetwork.TearDown(node.ConnextClient.ID); err != nil {
		return nil, err
	}

	client, err := n.ConnextNetwork.NewClient(node.Name)
	if err != nil {
		return nil, err
	}
	if err := client.Start(n.ConnextNetwork.ErrorChan); err != nil {
		return nil, err
	}

	for _, kv := range *envVars {
		if kv == "CLIENT_TYPE=ConnextClient" {
			*envVars = append(*envVars, fmt.Sprintf("CLIENT_PID=%d", client.Cmd.Process.Pid))
			break
		}
	}

	return client, nil
}
*/

func (n *NetworkHarness) SetCustomXud(ctx context.Context, ctxSetter CtxSetter, node *HarnessNode, envVars []string) (*HarnessNode, error) {
	t := time.Now()

	/*
		connextClient, err := n.newConnextClient(ctx, node, &envVars)
		if err != nil {
			return nil, err
		}
	*/

	if err := node.shutdown(true, true); err != nil {
		return nil, err
	}
	delete(n.ActiveNodes, node.ID)

	customNode, err := n.newNode(node.Name, "/custom-xud-vol", true)
	if err != nil {
		return nil, err
	}
	customNode.SetEnvVars(envVars)
	customNode.SetLnd(node.LndBtcNode, "BTC")
	customNode.SetLnd(node.LndLtcNode, "LTC")
	// customNode.SetConnextClient(connextClient)

	if err := customNode.Start(n.errorChan); err != nil {
		return nil, err
	}

	// Adjust the ctx deadline so that time spent here
	// won't consume the timeout duration.
	d := time.Since(t)
	deadline, _ := ctx.Deadline()
	ctx, cancel := context.WithDeadline(context.Background(), deadline.Add(d))
	ctxSetter.SetCtx(ctx, cancel)

	return customNode, nil
}

func (n *NetworkHarness) newNode(name string, xudPath string, noBalanceChecks bool) (*HarnessNode, error) {
	node, err := newNode(name, xudPath, noBalanceChecks)
	if err != nil {
		return nil, err
	}

	n.mtx.Lock()
	n.ActiveNodes[node.ID] = node
	n.mtx.Unlock()

	return node, nil
}

// Start starts all xud nodes and their corresponding lnd nodes.
func (n *NetworkHarness) Start() error {
	var wg sync.WaitGroup
	wg.Add(4)
	errChan := make(chan error, 4)

	for _, _node := range n.ActiveNodes {
		node := _node
		go func() {
			defer wg.Done()
			if err := node.Start(n.errorChan); err != nil {
				if err != nil {
					errChan <- err
					return
				}
			}
		}()
	}

	wg.Wait()
	select {
	case err := <-errChan:
		return err
	default:
	}

	return nil
}

// SetUp creates the xud nodes to be used for this harness.
func (n *NetworkHarness) SetUp(noBalanceChecks bool) error {
	xudPath := "/xud-vol"
	var err error

	n.Alice, err = n.newNode("Alice", xudPath, noBalanceChecks)
	if err != nil {
		return err
	}
	n.Bob, err = n.newNode("Bob", xudPath, noBalanceChecks)
	if err != nil {
		return err
	}

	n.Carol, err = n.newNode("Carol", xudPath, noBalanceChecks)
	if err != nil {
		return err
	}

	n.Dave, err = n.newNode("Dave", xudPath, noBalanceChecks)
	if err != nil {
		return err
	}

	return nil
}

// SetLnd sets the lnd configuration for all nodes in the harness for a
// specified chain.
func (n *NetworkHarness) SetLnd(ln *lntest.NetworkHarness, chain string) {
	switch chain {
	case "BTC":
		n.LndBtcNetwork = ln
	case "LTC":
		n.LndLtcNetwork = ln
	}
	n.Alice.SetLnd(ln.Alice, chain)
	n.Bob.SetLnd(ln.Bob, chain)
	n.Carol.SetLnd(ln.Carol, chain)
	n.Dave.SetLnd(ln.Dave, chain)
}

/*
func (n *NetworkHarness) SetConnext(net *connexttest.NetworkHarness) {
	n.ConnextNetwork = net
	n.Alice.SetConnextClient(net.Alice)
	n.Bob.SetConnextClient(net.Bob)
	n.Carol.SetConnextClient(net.Carol)
	n.Dave.SetConnextClient(net.Dave)
}
*/

// ProcessErrors returns a channel used for reporting any fatal process errors.
// If any of the active nodes within the harness' test network incur a fatal
// error, that error is sent over this channel.
func (n *NetworkHarness) ProcessErrors() <-chan *XudError {
	return n.errorChan
}

// TearDownAll tears down all active nodes.
func (n *NetworkHarness) TearDownAll(kill bool, cleanup bool) error {
	for _, node := range n.ActiveNodes {
		if err := node.shutdown(kill, cleanup); err != nil {
			return err
		}

		delete(n.ActiveNodes, node.ID)
	}

	close(n.errorChan)
	close(n.quit)

	return nil
}

func (n *NetworkHarness) RestartNode(node *HarnessNode) error {
	err := node.shutdown(true, false)
	if err != nil {
		return err
	}

	return node.Start(n.errorChan)
}
