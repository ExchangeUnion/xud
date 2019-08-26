#!/bin/bash
GETH_PATH="$PWD/go/src/github.com/ethereum/go-ethereum"
git clone --verbose https://github.com/ethereum/go-ethereum "$GETH_PATH"
cd "$GETH_PATH" || exit 1
make geth
