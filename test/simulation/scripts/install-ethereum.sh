#!/bin/bash
set -ex

$SCRIPTS_PATH/create-ethereum-account.sh "$TREASURY_ACCOUNT_PATH"

RAIDEN_ADDRESS_BOB="0x$(< "$TREASURY_ACCOUNT_PATH" jq -r .address)"
$SCRIPTS_PATH/generate-ethereum-blocks.sh 500 $RAIDEN_ADDRESS_BOB

# TODO: check why calling 'start-autominer.sh' from here is blocking when called from go test

# $SCRIPTS_PATH/deploy-contracts.sh

# raiden bob
EIP55_RAIDEN_ADDRESS_BOB="$(exec $SCRIPTS_PATH/address-to-eip55.sh "$RAIDEN_ADDRESS_BOB")"

$SCRIPTS_PATH/create-raiden-config.sh "$EIP55_RAIDEN_ADDRESS_BOB" "$RAIDEN_DATA_DIR_BOB"
# raiden alice
$SCRIPTS_PATH/create-ethereum-account.sh "$ALICE_ACCOUNT_PATH"
RAIDEN_ADDRESS_ALICE="0x$(< "$ALICE_ACCOUNT_PATH" jq -r .address)"
$SCRIPTS_PATH/generate-ethereum-blocks.sh 500 $RAIDEN_ADDRESS_ALICE

EIP55_RAIDEN_ADDRESS_ALICE=$(exec $SCRIPTS_PATH/address-to-eip55.sh "$RAIDEN_ADDRESS_ALICE")
$SCRIPTS_PATH/create-raiden-config.sh "$EIP55_RAIDEN_ADDRESS_ALICE" "$RAIDEN_DATA_DIR_ALICE"

