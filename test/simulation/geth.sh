#!/bin/bash
set -xe
declare -xp
# export PATH="$PWD/go/bin:$PATH"
# export PATH="$PWD/go/bin:$PATH"
# export GOPATH="$PWD/go"
# GETH_PATH="$PWD/go/src/github.com/ethereum/go-ethereum"
# git clone --verbose https://github.com/ethereum/go-ethereum "$GETH_PATH"
git clone https://github.com/ethereum/go-ethereum "$GOPATH/src/github.com/ethereum/go-ethereum"
cd "$GOPATH/src/github.com/ethereum/go-ethereum" || exit 1
git checkout v1.9.2
# cd "$GETH_PATH" || exit 1
# echo "go version $(go version)"
# go run build/ci.go install
go run build/ci.go install ./cmd/geth
