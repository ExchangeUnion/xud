package connexttest

import (
	"bytes"
	"fmt"
	"github.com/ExchangeUnion/xud-simulation/shared"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"sync"
	"sync/atomic"
	"syscall"
	"time"
)

var numActiveNodes int32

type Config struct {
	Name           string
	DataDir        string
	Path           string
	Port           int
	NodeURL        string
	EthProviderURL string
	Log            bool
}

func (cfg Config) genEnvVars() []string {
	var args []string
	args = append(args, fmt.Sprintf("CONNEXT_ETH_PROVIDER_URL=%v", cfg.EthProviderURL))
	args = append(args, fmt.Sprintf("CONNEXT_NODE_URL=%v", cfg.NodeURL))
	args = append(args, fmt.Sprintf("PORT=%v", cfg.Port))
	args = append(args, fmt.Sprintf("CONNEXT_STORE_DIR=%v", cfg.DataDir))
	args = append(args, fmt.Sprintf("LEGACY_MODE=true"))

	return args
}

type HarnessClient struct {
	Cfg     *Config
	ID      int
	EnvVars []string

	Cmd     *exec.Cmd
	pidFile string
	logFile *os.File

	ProcessExit chan struct{}

	quit chan struct{}
	wg   sync.WaitGroup

	Client *httpClient
}

func newClient(name, path, ethProviderURL, nodeURL string) (*HarnessClient, error) {
	nodeNum := int(atomic.AddInt32(&numActiveNodes, 1))

	_ = os.Mkdir("./temp", 0755)
	dataDir, err := filepath.Abs("./temp/connext-client-store-" + name)
	if err != nil {
		return nil, err
	}

	port, err := shared.GetFreePort()
	if err != nil {
		return nil, err
	}

	cfg := Config{
		Name:           name,
		Path:           path,
		DataDir:        dataDir,
		Port:           port,
		EthProviderURL: ethProviderURL,
		NodeURL:        nodeURL,
		Log:            true,
	}

	return &HarnessClient{
		Cfg:  &cfg,
		ID:   nodeNum,
		quit: make(chan struct{}),
	}, nil
}

func (hc *HarnessClient) SetEnvVars(envVars []string) {
	hc.EnvVars = envVars
}

// Start launches a new running process of connext-client.
func (hc *HarnessClient) Start(errorChan chan<- *ConnextError) error {
	hc.quit = make(chan struct{})

	cmd := exec.Command("node", filepath.Join(hc.Cfg.Path, "/build/src"))
	envVars := hc.Cfg.genEnvVars()
	if len(envVars) > 0 {
		cmd.Env = os.Environ()
		for _, kv := range envVars {
			cmd.Env = append(cmd.Env, kv)
		}
	}
	hc.Cmd = cmd

	// Redirect stderr output to buffer.
	var errb bytes.Buffer
	hc.Cmd.Stderr = &errb

	// Make sure the log file cleanup function is initialized, even
	// if no log file is created.
	var finalizeLogfile = func() {
		if hc.logFile != nil {
			_ = hc.logFile.Close()
		}
	}

	if hc.Cfg.Log {
		epoch := time.Now().Unix()
		fileName := fmt.Sprintf("./temp/logs/connext-client-%s-%d.log", hc.Cfg.Name, epoch)

		// Create file if not exists, otherwise append.
		file, err := os.OpenFile(fileName,
			os.O_WRONLY|os.O_APPEND|os.O_CREATE, 0666)
		if err != nil {
			return err
		}

		// Pass node's stderr to both errb and the file.
		w := io.MultiWriter(&errb, file)
		hc.Cmd.Stderr = w

		// Pass the node's stdout only to the file.
		hc.Cmd.Stdout = file

		// Let the node keep a reference to this file, such
		// that we can add to it if necessary.
		hc.logFile = file
	}

	if err := hc.Cmd.Start(); err != nil {
		return err
	}

	// Launch a new goroutine which that bubbles up any potential fatal
	// process errors to the goroutine running the tests.
	hc.ProcessExit = make(chan struct{})
	hc.wg.Add(1)
	go func() {
		defer hc.wg.Done()

		err := hc.Cmd.Wait()

		if err != nil && errorChan != nil {
			errorChan <- &ConnextError{Client: hc, Err: fmt.Errorf("%v\n%v\n", err, errb.String())}
		}

		// Signal any onlookers that this process has exited.
		close(hc.ProcessExit)
		hc.Client = nil

		// Make sure log file is closed.
		finalizeLogfile()
	}()

	hc.Client = newHTTPClient(fmt.Sprintf("http://0.0.0.0:%v", hc.Cfg.Port))

	if err := hc.WaitReady(); err != nil {
		return err
	}

	return nil
}

func (hn *HarnessClient) WaitReady() error {
	isReady := func() bool {
		return hn.Client.health() == nil
	}

	// Wait until connect-client is ready, up to 20 sec.
	timeout := time.After(20 * time.Second)
	for !isReady() {
		select {
		case <-timeout:
			return fmt.Errorf("timeout waiting for connext-client to be ready")
		case <-time.After(1 * time.Second):
		}
	}

	return nil
}

func (hc *HarnessClient) shutdown(kill bool, cleanup bool) error {
	if err := hc.stop(kill); err != nil {
		return err
	}
	if cleanup {
		if err := hc.cleanup(); err != nil {
			return err
		}
	}
	return nil
}

func (hc *HarnessClient) stop(kill bool) error {
	// Do nothing if the process is not running.
	if hc.ProcessExit == nil {
		return nil
	}

	if err := hc.Cmd.Process.Signal(syscall.SIGTERM); err != nil {
		return fmt.Errorf("failed to terminate process: %v", err)
	}

	close(hc.quit)
	hc.wg.Wait()

	hc.quit = nil
	hc.ProcessExit = nil
	hc.Client = nil
	return nil
}

func (hc *HarnessClient) cleanup() error {
	return os.RemoveAll(hc.Cfg.DataDir)
}
