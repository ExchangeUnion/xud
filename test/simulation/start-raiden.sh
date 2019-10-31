#!/bin/bash
set -ex
source .env
RAIDEN_DATA_DIR=$1
RAIDEN_PORT=$2
RESOLVER_PORT=$3
GETH_PORT=$4
CONF_FILE="$RAIDEN_DATA_DIR/config.toml"
OUTPUT_PATH="$RAIDEN_DATA_DIR/raiden.log"
GETH_PROVIDER="http://$GETH_RPCADDR:$GETH_PORT"
# shellcheck source=/dev/null
source "$RAIDEN_PATH/venv/bin/activate"
cd "$RAIDEN_PATH"
python raiden --config-file "$CONF_FILE" --eth-rpc-endpoint "$GETH_PROVIDER" --no-sync-check --api-address "localhost:$RAIDEN_PORT" --datadir "$RAIDEN_DATA_DIR" --resolver-endpoint "http://127.0.0.1:$RESOLVER_PORT/resolveraiden" >> "$OUTPUT_PATH" 2>&1 &
deactivate
