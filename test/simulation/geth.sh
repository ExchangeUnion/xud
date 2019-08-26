#!/bin/bash
set -xe
GETH_PATH="$PWD/go/src/github.com/ethereum/go-ethereum"
git clone --verbose https://github.com/ethereum/go-ethereum "$GETH_PATH"
cd "$GETH_PATH" || exit 1
echo "go version $(go version)"
GO111MODULE=on make geth
