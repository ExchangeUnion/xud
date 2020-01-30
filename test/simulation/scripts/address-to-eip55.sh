#!/bin/bash
set -ex

ADDRESS=$1

cd "$GETH_CACHE_PATH"
python3.7 -m venv "$ETH_UTILS_VENV_DIR"
# shellcheck source=/dev/null
source "$ETH_UTILS_VENV_DIR/bin/activate"
cd "$ETH_UTILS_SOURCE"
python3.7 $ETH_UTILS_SOURCE/eip55.py $ADDRESS
deactivate


