package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"
	"testing"
	"time"

	"github.com/ExchangeUnion/xud-simulation/lntest"
	"github.com/ExchangeUnion/xud-simulation/xudrpc"
	"github.com/ExchangeUnion/xud-simulation/xudtest"
	ltcchaincfg "github.com/ltcsuite/ltcd/chaincfg"
	ltcchainhash "github.com/ltcsuite/ltcd/chaincfg/chainhash"
	ltctest "github.com/ltcsuite/ltcd/integration/rpctest"
	ltcclient "github.com/ltcsuite/ltcd/rpcclient"
	"github.com/ltcsuite/ltcutil"
	btcchaincfg "github.com/roasbeef/btcd/chaincfg"
	btcchainhash "github.com/roasbeef/btcd/chaincfg/chainhash"
	btctest "github.com/roasbeef/btcd/integration/rpctest"
	btcclient "github.com/roasbeef/btcd/rpcclient"
	"github.com/roasbeef/btcutil"
	"golang.org/x/net/context"
)

var (
	cfg *config
)

var testCases = []*testCase{
	{
		name: "network initialization", // must be the first test case to be run
		test: testNetworkInit,
	},
	{
		name: "p2p discovery",
		test: testP2PDiscovery,
	},
	{
		name: "p2p incorrect public key",
		test: testP2PIncorrectPubKey,
	},
	{
		name: "p2p ban unban",
		test: testP2PBanUnban,
	},
	{
		name: "p2p already connected",
		test: testP2PAlreadyConnected,
	},
	{
		name: "order broadcast and invalidation",
		test: testOrderBroadcastAndInvalidation,
	},
	{
		name: "order matching and swap",
		test: testOrderMatchingAndSwap,
	},
}

var securityTestCases = []*testCase{
	{
		name: "network initialization", // must be the first test case to be run
		test: testNetworkInit,
	},
	{
		name: "taker stalling on swapAccepted",
		test: testTakerStallingOnSwapAccepted,
	},
	{
		name: "maker stalling after 1st htlc",
		test: testMakerStallingAfter1stHTLC,
	},
	{ // FAILING
		name: "maker shutdown after 1st htlc",
		test: testMakerShutdownAfter1stHTLC,
	},
	{
		name: "taker stalling after 2nd htlc",
		test: testTakerStallingAfter2ndHTLC,
	},
	{ // FAILING
		name: "taker shutdown after 2nd htlc",
		test: testTakerShutdownAfter2ndHTLC,
	},
	{
		name:            "taker stalling after swap succeeded",
		test:            testTakerStallingAfterSwapSucceeded,
		balanceMutating: true,
	},
}

func TestMain(m *testing.M) {
	log.Println("installing dependencies...")
	output, err := installDeps()
	if err != nil {
		log.Fatalf("installation failure: %v", err)
	}
	log.Printf("installation output: %v", output)

	cfg = loadConfig()

	res := m.Run()
	os.Exit(res)
}

func TestAdversarialXUD(t *testing.T) {
	xudNetwork, teardown := launchNetwork(true)
	defer teardown()

	ht := newHarnessTest(context.Background(), t)
	t.Logf("Running %v security tests", len(securityTestCases))

	var aliceLatestBalance, bobLatestBalance *balances
	for i, testCase := range securityTestCases {
		success := t.Run(testCase.name, func(t1 *testing.T) {
			ctx, cancel := context.WithTimeout(context.Background(), time.Duration(cfg.Timeout))
			defer cancel()
			ht := newHarnessTest(ctx, t1)
			ht.RunTestCase(testCase, xudNetwork)
		})

		// Stop at the first failure. Mimic behavior of original test
		// framework.
		if !success {
			break
		}

		// Save the Alice and Bob balances after the initialization test or balance mutating tests (successful swaps).
		// On all other tests, verify that it hasn't changed.
		if i == 0 || testCase.balanceMutating {
			var err error
			aliceLatestBalance, err = getBalances(ht.ctx, xudNetwork.Alice)
			ht.assert.NoError(err)

			bobLatestBalance, err = getBalances(ht.ctx, xudNetwork.Bob)
			ht.assert.NoError(err)
		} else {
			aliceBalance, err := getBalances(ht.ctx, xudNetwork.Alice)
			ht.assert.NoError(err)
			ht.assert.Equal(aliceLatestBalance, aliceBalance, "alice balance mismatch")

			bobBalance, err := getBalances(ht.ctx, xudNetwork.Bob)
			ht.assert.NoError(err)
			ht.assert.Equal(bobLatestBalance, bobBalance, "bob balance mismatch")
		}
	}
}

func TestXUD(t *testing.T) {
	xudNetwork, teardown := launchNetwork(false)
	defer teardown()

	ht := newHarnessTest(context.Background(), t)
	t.Logf("Running %v integration tests", len(testCases))

	initialStates := make(map[int]*xudrpc.GetInfoResponse)
	for i, testCase := range testCases {
		success := t.Run(testCase.name, func(t1 *testing.T) {
			ctx, cancel := context.WithTimeout(context.Background(), time.Duration(cfg.Timeout))
			defer cancel()
			ht := newHarnessTest(ctx, t1)
			ht.RunTestCase(testCase, xudNetwork)
		})

		// Stop at the first failure. Mimic behavior of original test
		// framework.
		if !success {
			break
		}

		// Save the nodes initial state after the initialization test.
		// On all consecutive tests, verify that it hasn't changed,
		// so that tests won't be affected by preceding ones.
		if i == 0 {
			for num, node := range xudNetwork.ActiveNodes {
				res, err := node.Client.GetInfo(ht.ctx, &xudrpc.GetInfoRequest{})
				ht.assert.NoError(err)
				initialStates[num] = res
			}
		} else {
			for num, node := range xudNetwork.ActiveNodes {
				res, err := node.Client.GetInfo(ht.ctx, &xudrpc.GetInfoRequest{})
				ht.assert.NoError(err)
				initialState, ok := initialStates[num]
				ht.assert.True(ok)

				msg := fmt.Sprintf("test should not leave a node (%v) in altered state", node.Name)
				ht.assert.Equal(initialState.Version, res.Version, msg)
				ht.assert.Equal(initialState.NodePubKey, res.NodePubKey, msg)
				//		ht.assert.Equal(initialState.NumPeers, res.NumPeers, msg)
				ht.assert.Equal(initialState.NumPairs, res.NumPairs, msg)

				// TODO: check why the following assertion fails after 'order_matching_and_swap' test.
				// ht.assert.Equal(initialState.Orders, res.Orders, msg)
			}
		}
	}
}

func launchNetwork(noSanityChecks bool) (*xudtest.NetworkHarness, func()) {
	// Create XUD network instance without launching it.
	log.Printf("xud: creating network")
	xudHarness, err := xudtest.NewNetworkHarness()
	if err != nil {
		log.Fatalf("unable to create xud network harness: %v", err)
	}
	go func() {
		for {
			select {
			case xudError, more := <-xudHarness.ProcessErrors():
				if !more {
					return
				}

				if strings.Contains(xudError.Err.Error(), "signal: killed") {
					log.Printf("xud process (%v-%v) did not shutdown gracefully. process (%v) killed",
						xudError.Node.ID, xudError.Node.Name, xudError.Node.Cmd.Process.Pid)
				}
				log.Printf("xud process finished with error:\n%v", xudError)
			}
		}
	}()
	if err := xudHarness.SetUp(noSanityChecks); err != nil {
		log.Fatalf("cannot set up xud network: %v", err)
	}

	// Create LND-LTC network instance to gain access to the backend
	// 'OnTxAccepted' call back.
	var lndLtcNetworkHarness *lntest.NetworkHarness

	// Create and initialize LTCD instance.
	ltcHandlers := &ltcclient.NotificationHandlers{
		OnTxAccepted: func(hash *ltcchainhash.Hash, amt ltcutil.Amount) {
			newHash := new(lntest.Hash)
			copy(newHash[:], hash[:])
			lndLtcNetworkHarness.OnTxAccepted(newHash)
		},
	}
	ltcdHarness, err := ltctest.New(&ltcchaincfg.SimNetParams, ltcHandlers, []string{"--rejectnonstd", "--txindex"})
	if err != nil {
		log.Fatalf("ltcd: unable to create mining node: %v", err)
	}

	log.Printf("ltcd: launching node...")
	if err := ltcdHarness.SetUp(true, 50); err != nil {
		log.Fatalf("ltcd: unable to set up mining node: %v", err)
	}
	if err := ltcdHarness.Node.NotifyNewTransactions(false); err != nil {
		log.Fatalf("ltcd: unable to request transaction notifications: %v", err)
	}

	numBlocks := ltcchaincfg.SimNetParams.MinerConfirmationWindow * 2
	if _, err := ltcdHarness.Node.Generate(numBlocks); err != nil {
		log.Fatalf("ltcd: unable to generate blocks: %v", err)
	}
	log.Printf("ltcd: %d blocks generated", numBlocks)

	// Initialize LND-LTC network instance.
	lndLtcNetworkHarness, err = lntest.NewNetworkHarness(ltcdHarness, "litecoin")
	if err != nil {
		log.Fatalf("lnd-ltc: unable to create network harness: %v", err)
	}
	go func() {
		for {
			select {
			case err, more := <-lndLtcNetworkHarness.ProcessErrors():
				if !more {
					return
				}
				log.Printf("lnd-ltc: finished with error (stderr):\n%v", err)
			}
		}
	}()
	log.Printf("lnd-ltc: launching network...")
	if err = lndLtcNetworkHarness.SetUp(nil); err != nil {
		log.Fatalf("lnd-ltc: unable to set up test network: %v", err)
	}

	// Create LND-LTC network instance to gain access to the backend
	// 'OnTxAccepted' call back.
	var lndBtcNetworkHarness *lntest.NetworkHarness

	// Create and initialize BTCD instance.
	args := []string{"--rejectnonstd", "--txindex"}
	handlers := &btcclient.NotificationHandlers{
		OnTxAccepted: func(hash *btcchainhash.Hash, amt btcutil.Amount) {
			newHash := new(lntest.Hash)
			copy(newHash[:], hash[:])
			lndBtcNetworkHarness.OnTxAccepted(newHash)
		},
	}
	btcdHarness, err := btctest.New(&btcchaincfg.SimNetParams, handlers, args)
	if err != nil {
		log.Fatalf("btcd: unable to create mining node: %v", err)
	}

	log.Printf("btcd: launching node...")
	if err := btcdHarness.SetUp(true, 50); err != nil {
		log.Fatalf("btcd: unable to set up mining node: %v", err)
	}
	if err := btcdHarness.Node.NotifyNewTransactions(false); err != nil {
		log.Fatalf("btcd: unable to request transaction notifications: %v", err)
	}

	// Mine enough blocks in order for segwit and the CSV package
	// soft-fork to activate on SimNet.
	numBlocks = btcchaincfg.SimNetParams.MinerConfirmationWindow * 2
	if _, err := btcdHarness.Node.Generate(numBlocks); err != nil {
		log.Fatalf("btcd: unable to generate blocks: %v", err)
	}
	log.Printf("btcd: %d blocks generated", numBlocks)

	// Initialize LND-BTC network.
	lndBtcNetworkHarness, err = lntest.NewNetworkHarness(btcdHarness, "bitcoin")
	if err != nil {
		log.Fatalf("lnd-btc: unable to create harness: %v", err)
	}
	go func() {
		for {
			select {
			case err, more := <-lndBtcNetworkHarness.ProcessErrors():
				if !more {
					return
				}
				log.Printf("lnd-btc: finished with error (stderr):\n%v", err)
			}
		}
	}()
	log.Printf("lnd-btc: launching network...")
	if err = lndBtcNetworkHarness.SetUp(nil); err != nil {
		log.Fatalf("lnd-btc: unable to set up test network: %v", err)
	}

	// Launch XUD network.
	xudHarness.SetLnd(lndBtcNetworkHarness, "BTC")
	xudHarness.SetLnd(lndLtcNetworkHarness, "LTC")
	log.Printf("xud: launching network...")
	if err := xudHarness.Start(); err != nil {
		log.Fatalf("cannot start xud network: %v", err)
	}

	teardown := func() {
		if err := lndBtcNetworkHarness.TearDownAll(); err != nil {
			log.Fatalf("lnd-btc: cannot tear down network harness: %v", err)
		}
		log.Printf("lnd-btc: network harness teared down")

		if err := btcdHarness.TearDown(); err != nil {
			log.Fatalf("btcd: cannot tear down harness: %v", err)
		} else {
			log.Printf("btcd: harness teared down")
		}

		if err := lndLtcNetworkHarness.TearDownAll(); err != nil {
			log.Printf("lnd-ltc: cannot tear down network harness: %v", err)
		}
		log.Printf("lnd-ltc: network harness teared down")

		if err := ltcdHarness.TearDown(); err != nil {
			log.Fatalf("ltcd: cannot tear down harness: %v", err)
		}
		log.Printf("ltcd: harness teared down")

		if err := xudHarness.TearDownAll(cfg.XudKill, cfg.XudCleanup); err != nil {
			log.Fatalf("cannot tear down xud network harness: %v", err)
		} else {
			log.Printf("xud network harness teared down")
		}
	}

	return xudHarness, teardown
}

func installDeps() (string, error) {
	cmd := exec.Command("./install.sh")

	data, err := cmd.Output()
	if err != nil {
		// The program has exited with an exit code != 0
		return "", fmt.Errorf("installation error: %v", string(data))
	}

	return string(data), nil
}
