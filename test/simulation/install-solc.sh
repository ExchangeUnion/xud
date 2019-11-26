#!/bin/bash
set -ex
source .env
install_solc () {
  echo "installing solc"
  mkdir -p "$SOLC_PATH"
  cd "$SOLC_PATH"
  wget "$SOLC_SOURCE"
  mv solc-static-linux solc
  chmod 700 solc
}
if [ ! -d "$SOLC_PATH" ]; then
  install_solc
else
  ROOT=$PWD
  cd "$SOLC_PATH"
  CURRENT_SHA256SUM=$(sha256sum solc | awk '{print $1}')
  if [ "$CURRENT_SHA256SUM" == "$SOLC_SHA256SUM" ]; then
    echo "solc already installed"
  else
    echo "updating solc"
    cd "$ROOT"
    rm -Rf "$SOLC_PATH"
    install_solc
  fi
fi
