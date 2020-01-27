#!/bin/bash

ADDRESS=$1
# shellcheck source=/dev/null
python3.7 -m venv "$ETH_UTILS_VENV_PATH"
source "$ETH_UTILS_VENV_PATH/bin/activate"

python3.7 $ETH_UTILS_SOURCE/eip55.py $ADDRESS
deactivate
