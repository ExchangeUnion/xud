package xudtest

import (
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

	lndBtcNetwork *lntest.NetworkHarness
	lndLtcNetwork *lntest.NetworkHarness

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

func (n *NetworkHarness) newNode(name string) (*HarnessNode, error) {
	node, err := newNode(name)
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
	errChan := make(chan error, 4)
	wg.Add(4)

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
func (n *NetworkHarness) SetUp() error {
	var err error
	n.Alice, err = n.newNode("Alice")
	if err != nil {
		return err
	}
	n.Bob, err = n.newNode("Bob")
	if err != nil {
		return err
	}

	n.Carol, err = n.newNode("Carol")
	if err != nil {
		return err
	}

	n.Dave, err = n.newNode("Dave")
	if err != nil {
		return err
	}

	return nil
}

// SetLnd sets the lnd configuration for all nodes in the harness for a
// specified chain.
func (n *NetworkHarness) SetLnd(ln *lntest.NetworkHarness, chain string) {
	n.lndBtcNetwork = ln
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
