#!/bin/bash
set -ex
source .env

./install-lnd.sh
./install-geth.sh
./install-solc.sh
./install-raiden-contracts.sh
./install-raiden.sh
./install-ethereum-utils.sh
./create-geth-genesis.sh
