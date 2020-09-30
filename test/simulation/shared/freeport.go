package shared

import (
	"errors"
	"github.com/phayes/freeport"
	"sync"
)

var prevPorts = make(map[int]bool)
var freePortMtx sync.Mutex

func GetFreePort() (int, error) {
	freePortMtx.Lock()
	defer freePortMtx.Unlock()

	for i := 0; i < 10; i++ {
		port, err := freeport.GetFreePort()
		if err != nil {
			return 0, err
		}

		if !prevPorts[port] {
			prevPorts[port] = true
			return port, nil
		}
	}

	return 0, errors.New("failed getting a new port")
}
