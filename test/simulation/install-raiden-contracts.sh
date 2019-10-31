#!/bin/bash
set -e
source .env
install_contracts () {
  echo "installing raiden-contracts"
  git clone --depth 1 "$RAIDEN_CONTRACTS_REPOSITORY" -b "$RAIDEN_CONTRACTS_BRANCH" "$RAIDEN_CONTRACTS_PATH"
  cd "$RAIDEN_CONTRACTS_PATH"
  python3.7 -m venv venv
  # shellcheck source=/dev/null
  source venv/bin/activate
  pip install --upgrade pip
  pip install -r requirements-dev.txt
  make install
  make verify_contracts
  export PATH="$SOLC_PATH:$PATH"
  echo "solc version: $(solc --version)"
  make compile_contracts
  deactivate
}
if [ ! -d "$RAIDEN_CONTRACTS_PATH" ]; then
  install_contracts
else
  ROOT=$PWD
  cd "$RAIDEN_CONTRACTS_PATH"
  CURRENT_HASH=$(git rev-parse HEAD)
  if [ "$CURRENT_HASH" == "$RAIDEN_CONTRACTS_COMMIT_HASH" ]; then
    echo "raiden-contracts already installed"
  else
    echo "updating raiden-contracts"
    cd "$ROOT"
    rm -Rf "$RAIDEN_CONTRACTS_PATH"
    install_contracts
  fi
fi
