#!/bin/bash
set -ex
ADDRESS=$1
# shellcheck source=/dev/null
source "$ETH_UTILS_VENV_PATH/bin/activate"
python $ETH_UTILS_SOURCE/eip55.py $ADDRESS
deactivate
