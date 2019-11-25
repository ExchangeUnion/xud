#!/bin/bash
set -e
source .env

install_ethereum_utils () {
  echo "installing ethereum utils"
  cd "$CACHE_PATH"
  python3.7 -m venv "$ETH_UTILS_VENV_DIR"
  # shellcheck source=/dev/null
  source "$ETH_UTILS_VENV_DIR/bin/activate"
  cd "$ETH_UTILS_SOURCE"
  pip install --upgrade pip
  pip install -r requirements.txt
  deactivate
}
if [ ! -d "$CACHE_PATH/$ETH_UTILS_VENV_DIR" ]; then
  install_ethereum_utils
else
  echo "ethereum utils already installed"
fi
