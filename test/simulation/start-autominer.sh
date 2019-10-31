#!/bin/bash
set -e
source .env
# shellcheck source=/dev/null
source "$CACHE_PATH/$ETH_UTILS_VENV_DIR/bin/activate"
python "$ETH_UTILS_SOURCE/geth-autominer.py" "$GETH_IPC" &
deactivate
sleep 1 # wait for autominer to start
