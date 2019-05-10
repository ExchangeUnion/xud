package main

import (
	"context"
	"fmt"
	"github.com/ExchangeUnion/xud-simulation/xudtest"
	goerrors "github.com/go-errors/errors"
	"github.com/stretchr/testify/require"
	"testing"
)

type testCase struct {
	name string
	test func(net *xudtest.NetworkHarness, t *harnessTest)
}

// harnessTest wraps a regular testing.T providing enhanced error detection
// and propagation. All error will be augmented with a full stack-trace in
// order to aid in debugging. Additionally, any panics caused by active
// test cases will also be handled and represented as fatals.
type harnessTest struct {
	t *testing.T

	// testCase is populated during test execution and represents the
	// current test case.
	testCase *testCase

	// assert provides assertion methods to stop test execution upon failure.
	assert *require.Assertions

	// act provides collection of predefined actions to be used in the test scenario.
	act *actions

	// ctx is the context for the test scenario.
	ctx context.Context
}

// newHarnessTest creates a new instance of a harnessTest from a regular
// testing.T instance.
func newHarnessTest(ctx context.Context, t *testing.T) *harnessTest {
	assert := require.New(t)
	return &harnessTest{
		t:        t,
		testCase: nil,
		assert:   assert,
		ctx:      ctx,

		// actions instance to contain assert and ctx,
		// to avoid passing them on every method call.
		act: &actions{assert: assert, ctx: ctx},
	}
}

// Fatalf causes the current active test case to fail with a fatal error. All
// integration tests should mark test failures solely with this method due to
// the error stack traces it produces.
func (h *harnessTest) Fatalf(format string, a ...interface{}) {
	stacktrace := goerrors.Wrap(fmt.Sprintf(format, a...), 1).ErrorStack()

	if h.testCase != nil {
		h.t.Fatalf("Failed: (%v): exited with error: \n"+
			"%v", h.testCase.name, stacktrace)
	} else {
		h.t.Fatalf("Error outside of test: %v", stacktrace)
	}
}

func (h *harnessTest) Logf(format string, args ...interface{}) {
	h.t.Logf(format, args...)
}

// RunTestCase executes a harness test case. Any errors or panics will be
// represented as fatal.
func (h *harnessTest) RunTestCase(testCase *testCase, net *xudtest.NetworkHarness) {
	h.testCase = testCase
	defer func() {
		h.testCase = nil
	}()

	defer func() {
		if err := recover(); err != nil {
			description := goerrors.Wrap(err, 2).ErrorStack()
			h.t.Fatalf("Failed: (%v) panicked with: \n%v",
				h.testCase.name, description)
		}
	}()

	testCase.test(net, h)

	return
}
