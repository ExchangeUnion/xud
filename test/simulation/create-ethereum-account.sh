#!/bin/bash
set -e
source .env

NEW_ACCOUNT_PATH=$1
CREATED_ACCOUNT=$($GETH_BINARY_PATH --datadir "$GETH_DATA_DIR" --networkid "$GETH_NETWORK_ID" --exec "loadScript(\"$PWD/utils/create-account.js\")" attach | grep "account:" | awk '{print $2}')
mv $GETH_DATA_DIR/keystore/*$CREATED_ACCOUNT "$NEW_ACCOUNT_PATH"
