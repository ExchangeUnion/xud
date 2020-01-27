#!/bin/bash

echo "creating ethereum account..."
./create-ethereum-account.sh "$TREASURY_ACCOUNT_PATH"
RAIDEN_ADDRESS_BOB="0x$(< "$TREASURY_ACCOUNT_PATH" jq -r .address)"
./generate-ethereum-blocks.sh 500 $RAIDEN_ADDRESS_BOB

echo "starting autominer..."
./start-autominer.sh

echo "deploying contracts..."
./deploy-contracts.sh


echo "creating raiden config..."
# raiden bob
EIP55_RAIDEN_ADDRESS_BOB="$(exec ./address-to-eip55.sh "$RAIDEN_ADDRESS_BOB")"
./create-raiden-config.sh "$EIP55_RAIDEN_ADDRESS_BOB" "$RAIDEN_DATA_DIR_BOB"
# raiden alice
./create-ethereum-account.sh "$ALICE_ACCOUNT_PATH"
RAIDEN_ADDRESS_ALICE="0x$(< "$ALICE_ACCOUNT_PATH" jq -r .address)"
./generate-ethereum-blocks.sh 500 $RAIDEN_ADDRESS_ALICE
EIP55_RAIDEN_ADDRESS_ALICE=$(exec ./address-to-eip55.sh "$RAIDEN_ADDRESS_ALICE")
./create-raiden-config.sh "$EIP55_RAIDEN_ADDRESS_ALICE" "$RAIDEN_DATA_DIR_ALICE"
./cleanup-processes.sh
