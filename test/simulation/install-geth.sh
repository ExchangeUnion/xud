#!/bin/bash
set -e
GETH_SOURCE=$1
GETH_PATH=$2
EXPECTED_HASH=$3
install_geth () {
  echo "installing geth"
  git clone --depth 1 "$GETH_SOURCE" "$GETH_PATH"
  cd "$GETH_PATH"
  GOPATH=$GO_PATH CI=false GO111MODULE=off go run build/ci.go install ./cmd/geth
}
if [ ! -d "$GETH_PATH" ]; then
  install_geth
else
  ROOT=$PWD
  cd "$GETH_PATH"
  CURRENT_HASH=$(git rev-parse HEAD)
  if [ "$CURRENT_HASH" == "$EXPECTED_HASH" ]; then
    echo "geth already installed"
  else
    echo "updating geth"
    cd "$ROOT"
    rm -Rf "$GETH_PATH"
    install_geth
  fi
fi
