#!/bin/bash
set -e
source .env
$GETH_BINARY_PATH --datadir "$GETH_DATA_DIR" --networkid "$GETH_NETWORK_ID" attach
