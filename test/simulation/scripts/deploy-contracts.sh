#!/bin/bash
set -ex

echo "##### 1"


GETH_PROVIDER="http://$(netstat -peanut | grep -m 1 geth | awk '{print $4}')"
ETH_ERC20="WETH"
WETH_SUPPLY=1000000000
MAX_UINT256=115792089237316195423570985008687907853269984665640564039457584007913129639935
(( "SECONDS_PER_DAY=60*60*24" ))
(( "DECAY=200*$SECONDS_PER_DAY" ))
(( "DURATION=200*$SECONDS_PER_DAY" ))
DEPOSIT=2000000000000000000000
touch "$PASSWORD_FILE"
chmod 600 "$PASSWORD_FILE"
cd "$RAIDEN_CONTRACTS_PATH"
# shellcheck source=/dev/null
python3.7 -m venv venv
source "venv/bin/activate"

echo "##### 1"

python3.7 -m raiden_contracts.deploy raiden --rpc-provider "$GETH_PROVIDER" --private-key "$TREASURY_ACCOUNT_PATH" --gas-price 10 --gas-limit 6000000 --max-token-networks 10 --password "$PASSWORD_FILE"

echo "##### 2"

TokenNetworkRegistry=$(< "$CONTRACTS_DEPLOYMENT_LOG_JSON" jq -r .contracts.TokenNetworkRegistry.address)

echo "##### 3"

python3.7 -m raiden_contracts.deploy token --rpc-provider $GETH_PROVIDER --private-key "$TREASURY_ACCOUNT_PATH" --gas-price 10 --token-supply 20000000 --token-name ServiceToken --token-decimals 18 --token-symbol SVT --password "$PASSWORD_FILE" > "$CONTRACTS_SERVICETOKEN_LOG_JSON"

echo "##### 4"

ServiceToken=$(< "$CONTRACTS_SERVICETOKEN_LOG_JSON" tail -3 | jq -r .CustomToken)

echo "##### 5"

python3.7 -m raiden_contracts.deploy services --rpc-provider $GETH_PROVIDER --private-key "$TREASURY_ACCOUNT_PATH" --gas-price 10 --gas-limit 6000000 --token-address "$ServiceToken" --user-deposit-whole-limit $MAX_UINT256 --service-deposit-bump-numerator 6 --service-deposit-bump-denominator 5 --service-deposit-decay-constant "$DECAY" --initial-service-deposit-price $DEPOSIT --service-deposit-min-price 1000 --service-registration-duration "$DURATION" --token-network-registry-address "$TokenNetworkRegistry" --password "$PASSWORD_FILE"

echo "##### 6"

python3.7 -m raiden_contracts.deploy token --rpc-provider $GETH_PROVIDER --private-key "$TREASURY_ACCOUNT_PATH" --gas-price 10 --token-supply $WETH_SUPPLY --token-name $ETH_ERC20 --token-decimals 18 --token-symbol $ETH_ERC20 --password "$PASSWORD_FILE" > "$CONTRACTS_WETH_LOG_JSON"

echo "##### 7"

echo "$CONTRACTS_WETH_LOG_JSON"

echo "##### 8"

WethToken=$(< "$CONTRACTS_WETH_LOG_JSON" tail -3 | jq -r .CustomToken)
echo "$WethToken"


rm -f "$WETH_ADDRESS_FILE"
echo "$WethToken" >> "$WETH_ADDRESS_FILE"
python3.7 -m raiden_contracts.deploy register --rpc-provider $GETH_PROVIDER --private-key "$TREASURY_ACCOUNT_PATH" --gas-price 10 --token-address "$WethToken" --token-network-registry-address "$TokenNetworkRegistry" --channel-participant-deposit-limit 115792089237316195423570985008687907853269984665640564039457584007913129639935 --token-network-deposit-limit 115792089237316195423570985008687907853269984665640564039457584007913129639935 --password "$PASSWORD_FILE"
