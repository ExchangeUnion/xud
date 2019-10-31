#!/bin/bash
set -e
source .env

if [ -d "$GETH_DATA_DIR" ]; then
  rm -Rf "$GETH_DATA_DIR"
  echo "Deleting geth data"
fi
GOPATH="$GO_PATH" "$GETH_BINARY_PATH" --datadir "$GETH_DATA_DIR" init "$GENESIS_JSON"
