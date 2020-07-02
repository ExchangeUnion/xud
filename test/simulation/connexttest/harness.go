package connexttest

import (
	"sync"
)

type ConnextError struct {
	Client *HarnessClient
	Err    error
}

var (
	clientPath = "/connext-vol/rest-api-client"

	// 172.17.0.1 is the static IP equivalent of `host.docker.internal` for accessing
	// the `localhost` of the host machine.
	EthProviderURL = "http://172.17.0.1:8545"
	NodeURL        = "http://172.17.0.1:8080"
)

type NetworkHarness struct {
	ActiveClients map[int]*HarnessClient

	Alice *HarnessClient
	Bob   *HarnessClient
	Carol *HarnessClient
	Dave  *HarnessClient

	Wallet *EthWallet

	errorChan chan *ConnextError

	quit chan struct{}

	mtx sync.Mutex
}

// NewNetworkHarness creates and returns a new network harness.
func NewNetworkHarness() *NetworkHarness {
	n := NetworkHarness{
		ActiveClients: make(map[int]*HarnessClient),
		errorChan:     make(chan *ConnextError),
		quit:          make(chan struct{}),
	}
	return &n
}

func (n *NetworkHarness) newClient(name string, path string) (*HarnessClient, error) {
	client, err := newClient(name, path, EthProviderURL, NodeURL)
	if err != nil {
		return nil, err
	}

	n.mtx.Lock()
	n.ActiveClients[client.ID] = client
	n.mtx.Unlock()

	return client, nil
}

// Start starts all xud nodes and their corresponding lnd nodes.
func (n *NetworkHarness) Start() error {
	var wg sync.WaitGroup
	wg.Add(4)
	errChan := make(chan error, 4)

	for _, _client := range n.ActiveClients {
		client := _client
		go func() {
			defer wg.Done()
			if err := client.Start(n.errorChan); err != nil {
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

	var err error
	n.Wallet, err = newEthWallet(EthProviderURL, "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat")
	if err != nil {
		return err
	}

	return nil
}

// SetUp creates the xud nodes to be used for this harness.
func (n *NetworkHarness) SetUp() error {
	var err error

	n.Alice, err = n.newClient("Alice", clientPath)
	if err != nil {
		return err
	}
	n.Bob, err = n.newClient("Bob", clientPath)
	if err != nil {
		return err
	}

	n.Carol, err = n.newClient("Carol", clientPath)
	if err != nil {
		return err
	}

	n.Dave, err = n.newClient("Dave", clientPath)
	if err != nil {
		return err
	}

	return nil
}

func (n *NetworkHarness) ProcessErrors() <-chan *ConnextError {
	return n.errorChan
}

// TearDownAll tears down all active nodes.
func (n *NetworkHarness) TearDownAll() error {
	for _, client := range n.ActiveClients {
		if err := client.shutdown(true, true); err != nil {
			return err
		}

		delete(n.ActiveClients, client.ID)
	}

	close(n.errorChan)
	close(n.quit)

	return nil
}
