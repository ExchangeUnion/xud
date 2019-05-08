package xudtest

import (
	"github.com/ExchangeUnion/xud-simulation/lntest"
	"sync"
)

type xudError struct {
	Node *HarnessNode
	Err  error
}

type NetworkHarness struct {
	ActiveNodes map[int]*HarnessNode

	Alice *HarnessNode
	Bob   *HarnessNode
	Carol *HarnessNode
	Dave  *HarnessNode

	lndBtcNetwork *lntest.NetworkHarness
	lndLtcNetwork *lntest.NetworkHarness

	errorChan chan *xudError

	quit chan struct{}

	mtx sync.Mutex
}

func NewNetworkHarness() (*NetworkHarness, error) {
	n := NetworkHarness{
		ActiveNodes: make(map[int]*HarnessNode),
		errorChan:   make(chan *xudError),
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
	n.ActiveNodes[node.Id] = node
	n.mtx.Unlock()

	return node, nil
}

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

func (n *NetworkHarness) SetUp() error {
	node, err := n.newNode("Alice")
	if err != nil {
		return err
	}
	n.Alice = node

	node, err = n.newNode("Bob")
	if err != nil {
		return err
	}
	n.Bob = node

	node, err = n.newNode("Carol")
	if err != nil {
		return err
	}
	n.Carol = node

	node, err = n.newNode("Dave")
	if err != nil {
		return err
	}
	n.Dave = node

	return nil
}

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
func (n *NetworkHarness) ProcessErrors() <-chan *xudError {
	return n.errorChan
}

// TearDownAll tears down all active nodes.
func (n *NetworkHarness) TearDownAll(kill bool, cleanup bool) error {
	for _, node := range n.ActiveNodes {
		if err := node.shutdown(kill, cleanup); err != nil {
			return err
		}

		delete(n.ActiveNodes, node.Id)
	}

	close(n.errorChan)
	close(n.quit)

	return nil
}
