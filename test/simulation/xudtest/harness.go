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

	lndBtcNetwork *lntest.NetworkHarness
	lndLtcNetwork *lntest.NetworkHarness

	errorChan chan *xudError

	quit chan struct{}

	mtx sync.Mutex
}

func NewNetworkHarness(lndBtcNetwork *lntest.NetworkHarness, lndLtcNetwork *lntest.NetworkHarness) (*NetworkHarness, error) {
	n := NetworkHarness{
		lndBtcNetwork: lndBtcNetwork,
		lndLtcNetwork: lndLtcNetwork,
		ActiveNodes:   make(map[int]*HarnessNode),
		errorChan:     make(chan *xudError),
		quit:          make(chan struct{}),
	}
	return &n, nil
}

func (n *NetworkHarness) newNode(name string, lndBtcNode *lntest.HarnessNode, lndLtcNode *lntest.HarnessNode) (*HarnessNode, error) {
	node, err := newNode(name, lndBtcNode, lndLtcNode)
	if err != nil {
		return nil, err
	}

	n.mtx.Lock()
	n.ActiveNodes[node.Id] = node
	n.mtx.Unlock()

	if err := node.start(n.errorChan); err != nil {
		return nil, err
	}

	return node, nil
}

func (n *NetworkHarness) SetUp() error {
	var wg sync.WaitGroup
	errChan := make(chan error, 2)
	wg.Add(2)
	go func() {
		defer wg.Done()
		node, err := n.newNode("Alice", n.lndBtcNetwork.Alice, n.lndLtcNetwork.Alice)
		if err != nil {
			errChan <- err
			return
		}
		n.Alice = node
	}()
	go func() {
		defer wg.Done()
		node, err := n.newNode("Bob", n.lndBtcNetwork.Bob, n.lndLtcNetwork.Bob)
		if err != nil {
			errChan <- err
			return
		}
		n.Bob = node

	}()
	wg.Wait()
	select {
	case err := <-errChan:
		return err
	default:
	}

	return nil
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
