#!/bin/bash
set -ex

# shellcheck source=/dev/null
python3.7 -m venv "$ETH_UTILS_VENV_PATH"
source "$ETH_UTILS_VENV_PATH/bin/activate"

python3.7 "$ETH_UTILS_SOURCE/geth-autominer.py" "$GETH_IPC" &
deactivate
sleep 1 # wait for autominer to start
