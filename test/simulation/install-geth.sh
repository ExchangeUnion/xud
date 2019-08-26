#!/bin/bash
set -xe
export GO_PATH=$PWD/go # TODO: temp - delete later
export GOPATH=$PWD/go # TODO: temp - delete later
ROOT=$PWD
# GETH_PATH="$GO_PATH/src/github.com/ExchangeUnion/go-ethereum"
GETH_PATH="$GO_PATH/src/github.com/ethereum/go-ethereum"
EXPECTED_GETH_COMMIT="e0bb1631c21042336d230c11de0dfe8580aa28c4"
GETH_BINARY_PATH="$GETH_PATH/build/bin/geth"
GETH_DATA_DIR="$ROOT/temp/geth/data"
GETH_RPCADDR="localhost"
GETH_PORT=8545
GETH_NETWORK_ID=4321
GETH_PROVIDER="http://$GETH_RPCADDR:$GETH_PORT"
GENESIS_JSON="$ROOT/utils/genesis.json"
CONTRACTS_PATH="$ROOT/temp/raiden-contracts"
CONTRACTS_DEPLOYMENT_LOG_JSON="$CONTRACTS_PATH/raiden_contracts/data/deployment_private_net.json"
CONTRACTS_WETH_LOG_JSON="$CONTRACTS_PATH/weth.log"
CONTRACTS_REPOSITORY="https://github.com/ExchangeUnion/raiden-contracts.git"
CONTRACTS_BRANCH="simnet-contracts"
SOLC_DIR="$ROOT/temp/solc"
# rm -Rf "$GO_PATH"
# rm -Rf "$PWD/temp" # TODO: delete later
mkdir -p "$GETH_DATA_DIR"
if [ -f "$GETH_BINARY_PATH" ]
  then
    GETH_COMMIT=$(GOPATH=$GO_PATH $GETH_BINARY_PATH version | grep "Commit:")
  else
    GETH_COMMIT=""
fi

if [[ $GETH_COMMIT == *"$EXPECTED_GETH_COMMIT" ]]; then
    echo "geth already installed"
else echo "starting geth clone..."

  # if ! git clone --depth 1 https://github.com/ExchangeUnion/go-ethereum "$GETH_PATH" > /dev/null 2>&1; then
      # echo "unable to git clone geth"
      # exit 1
  # fi
  # git clone --verbose --depth 1 https://github.com/ExchangeUnion/go-ethereum "$GETH_PATH"
  git clone --verbose https://github.com/ethereum/go-ethereum "$GETH_PATH"
  echo "finished geth clone"

  # echo "cloning raiden-contracts..."
  # if ! git clone --depth 1 $CONTRACTS_REPOSITORY -b $CONTRACTS_BRANCH "$CONTRACTS_PATH" > /dev/null 2>&1; then
    # echo "unable to git clone raiden-contracts"
    # exit 1
  # fi
  # echo "finished raiden-contracts clone"
#
  # mkdir -p "$SOLC_DIR"
  # cd "$SOLC_DIR" || exit 1
  # wget https://github.com/ethereum/solidity/releases/download/v0.4.23/solidity-ubuntu-trusty.zip
  # unzip solidity-ubuntu-trusty.zip
  # export PATH="$SOLC_DIR:$PATH"
  # echo "solc version is $(solc --version)" # TODO: debug remove

  echo "starting geth make..."
  cd "$GETH_PATH" || exit 1
  GOPATH=$GO_PATH GO111MODULE=off make geth
  # if ! (cd "$GETH_PATH" && GOPATH=$GO_PATH GO111MODULE=off make geth); then
      # echo "unable to make geth"
      # exit 1
  # fi
  echo "finished geth make"
  exit 1

  echo "setting up Ethereum chain..."
  # create a genesis block
  GOPATH="$GO_PATH" "$GETH_BINARY_PATH" --datadir "$GETH_DATA_DIR" init "$GENESIS_JSON"
  # start geth in the background
  GOPATH="$GO_PATH" "$GETH_BINARY_PATH" --datadir "$GETH_DATA_DIR" --networkid $GETH_NETWORK_ID --rpcapi "eth,net,web3,txpool" --rpc --rpcaddr "$GETH_RPCADDR" --rpcport $GETH_PORT &
  GETH_PID=$!
  echo "Geth process running with PID: $GETH_PID"
  # kill -15 $GETH_PID TODO: cleanup geth
  virtualenv "$ROOT/temp/autominer-venv" # TODO: use absolute path
  # shellcheck source=/dev/null
  source "$ROOT/temp/autominer-venv/bin/activate"
  cd "$ROOT/utils" || exit 1
  pip install -r requirements.txt
  TREASURY_ACCOUNT=$(./geth-create-account.sh "$GETH_BINARY_PATH" --datadir "$GETH_DATA_DIR" --networkid 4321)
  echo "TREASURY_ACCOUNT is: $TREASURY_ACCOUNT"
  TREASURY_ACCOUNT_TMP_PATH="$GETH_DATA_DIR/keystore/*$TREASURY_ACCOUNT"
  TREASURY_ACCOUNT_PATH="$GETH_DATA_DIR/keystore/treasury"
  # shellcheck disable=SC2086
  mv $TREASURY_ACCOUNT_TMP_PATH $TREASURY_ACCOUNT_PATH
  python geth-autominer.py "$GETH_DATA_DIR/geth.ipc" &
  AUTOMINER_PID=$!
  echo "Autominer process running with PID: $AUTOMINER_PID"
  # kill -15 $AUTOMINER_PID TODO: cleanup autominer
  deactivate
  virtualenv "$CONTRACTS_PATH/venv"
  # shellcheck source=/dev/null
  source "$CONTRACTS_PATH/venv/bin/activate"
  cd "$CONTRACTS_PATH" || exit 1
  make install
  make verify_contracts
  make compile_contracts
  pip uninstall web3 -y
  pip install web3==4.9.1
  pip install raiden_libs
  export PASSWORD_FILE="$GETH_DATA_DIR/passwd"
  touch "$PASSWORD_FILE"
  chmod 600 "$PASSWORD_FILE"
  export MAX_UINT256=115792089237316195423570985008687907853269984665640564039457584007913129639935
  python -m raiden_contracts.deploy raiden --rpc-provider $GETH_PROVIDER --private-key "$TREASURY_ACCOUNT_PATH" --gas-price 10 --gas-limit 6000000 --password-file "$PASSWORD_FILE"
  TokenNetworkRegistry=$(< "$CONTRACTS_DEPLOYMENT_LOG_JSON" jq -r .contracts.TokenNetworkRegistry.address)
  python -m raiden_contracts.deploy token --rpc-provider "$GETH_PROVIDER" --private-key "$TREASURY_ACCOUNT_PATH" --gas-price 10 --token-supply 100000000000000000 --token-name WETH --token-decimals 18 --token-symbol WETH --password-file "$PASSWORD_FILE" > "$CONTRACTS_WETH_LOG_JSON"
  WethToken=$(< "$CONTRACTS_WETH_LOG_JSON" tail -3 | jq -r .CustomToken)
  # shellcheck disable=SC2086
  python -m raiden_contracts.deploy register --rpc-provider "$GETH_PROVIDER" --private-key "$TREASURY_ACCOUNT_PATH" --gas-price 100 --gas-limit 6000000 --token-address $WethToken --registry-address $TokenNetworkRegistry --password-file "$PASSWORD_FILE"
fi
