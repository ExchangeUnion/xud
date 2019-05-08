package main

import "time"

const (
	defaultXudKill    = true
	defaultXudCleanup = true
	defaultTimeout    = int64(5 * time.Second)
)

// config defines the configuration for integration tests.
type config struct {
	XudKill    bool  `long:"xudkill" description:"whether to kill an hanging xud process which otherwise will fail the test procedure"`
	XudCleanup bool  `long:"xudclean" description:"whether to delete xud instances data directories"`
	Timeout    int64 `long:"timeout" description:"the timeout for a single test execution"`
}

// loadConfig initializes and parses the config using a config file and command
// line options.
// TODO: parse command-line args and override the default values
func loadConfig() *config {
	return &config{
		XudKill:    defaultXudKill,
		XudCleanup: defaultXudCleanup,
		Timeout:    defaultTimeout,
	}
}
