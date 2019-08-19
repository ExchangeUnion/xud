package xudtest

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"sync"

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

func (n *NetworkHarness) SetCustomXud(node *HarnessNode, branch string, envVars []string) (*HarnessNode, error) {
	err := node.shutdown(true, true)
	if err != nil {
		return nil, err
	}
	delete(n.ActiveNodes, node.ID)

	wd, err := os.Getwd()
	if err != nil {
		return nil, err
	}

	xudPath := filepath.Join(wd, "./temp", branch)
	if _, err := os.Stat(xudPath); os.IsNotExist(err) {
		log.Printf("custon xud not found at %v, installing...", xudPath)
		_, err := exec.Command("git", "clone", "-b", branch, "https://github.com/ExchangeUnion/xud", xudPath).Output()
		if err != nil {
			return nil, fmt.Errorf("custom xud git clone failure: %v", err)
		}

		cmd := exec.Command("npm", "i")
		cmd.Dir = xudPath
		_, err = cmd.Output()
		if err != nil {
			return nil, fmt.Errorf("custom xud npm i failure: %v", err)
		}

		cmd = exec.Command("npm", "run", "compile")
		cmd.Dir = xudPath
		_, err = cmd.Output()
		if err != nil {
			return nil, fmt.Errorf("custom xud compilation failure: %v", err)
		}
	}

	customNode, err := n.newNode(node.Name, xudPath, true)
	if err != nil {
		return nil, err
	}

	customNode.SetEnvVars(envVars)
	customNode.SetLnd(node.LndBtcNode, "BTC")
	customNode.SetLnd(node.LndLtcNode, "LTC")

	var wg sync.WaitGroup
	wg.Add(1)
	errChan := make(chan error, 1)
	go func() {
		defer wg.Done()
		if err := customNode.start(n.errorChan); err != nil {
			if err != nil {
				errChan <- err
				return
			}
		}
	}()
	wg.Wait()

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

// Start starts this xud node and its corresponding lnd nodes.
func (n *NetworkHarness) Start() error {
	var wg sync.WaitGroup
	wg.Add(4)
	errChan := make(chan error, 4)

	for _, _node := range n.ActiveNodes {
		node := _node
		go func() {
			defer wg.Done()
			if err := node.start(n.errorChan); err != nil {
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
	xudPath, err := filepath.Abs("../../")
	if err != nil {
		return err
	}

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
