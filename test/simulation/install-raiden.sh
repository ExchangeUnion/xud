#!/bin/bash
set -e
source .env
install_raiden () {
  echo "installing raiden"
  git clone --depth 1 "$RAIDEN_REPOSITORY" -b "$RAIDEN_BRANCH" "$RAIDEN_PATH"
  cd "$RAIDEN_PATH"
  python3.7 -m venv venv
  # shellcheck source=/dev/null
  source venv/bin/activate
  pip install --upgrade pip
  pip install --upgrade -r requirements.txt
  python setup.py develop
  deactivate
}
if [ ! -d "$RAIDEN_PATH" ]; then
  install_raiden
else
  ROOT=$PWD
  cd "$RAIDEN_PATH"
  CURRENT_HASH=$(git rev-parse HEAD)
  if [ "$CURRENT_HASH" == "$RAIDEN_COMMIT_HASH" ]; then
    echo "raiden already installed"
  else
    echo "updating raiden"
    cd "$ROOT"
    rm -Rf "$RAIDEN_PATH"
    install_raiden
  fi
fi
