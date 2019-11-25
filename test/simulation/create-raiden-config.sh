#!/bin/bash
set -ex
source .env
RAIDEN_ADDRESS=$1
RAIDEN_DATA_DIR=$2
RAIDEN_CONF_FILE="$RAIDEN_DATA_DIR/config.toml"
SecretRegistry=$(< "$CONTRACTS_DEPLOYMENT_LOG_JSON" jq -r .contracts.SecretRegistry.address)
TokenNetworkRegistry=$(< "$CONTRACTS_DEPLOYMENT_LOG_JSON" jq -r .contracts.TokenNetworkRegistry.address)
OneToN=$(< "$CONTRACTS_DEPLOYMENT_SERVICE_LOG_JSON" jq -r .contracts.OneToN.address)
UserDeposit=$(< "$CONTRACTS_DEPLOYMENT_SERVICE_LOG_JSON" jq -r .contracts.UserDeposit.address)
MonitoringService=$(< "$CONTRACTS_DEPLOYMENT_SERVICE_LOG_JSON" jq -r .contracts.MonitoringService.address)
echo "TokenNetworkRegistry is $TokenNetworkRegistry"
echo "SecretRegistry is $SecretRegistry"
echo "OneToN is $OneToN"
echo "UserDeposit is $UserDeposit"
echo "MonitoringService is $MonitoringService"
mkdir -p "$RAIDEN_DATA_DIR"
cp "$RAIDEN_CONF_TEMPLATE" "$RAIDEN_CONF_FILE"
sed -i "s/<secret-registry-address>/$SecretRegistry/g" "$RAIDEN_CONF_FILE"
sed -i "s/<tokennetwork-registry-address>/$TokenNetworkRegistry/g" "$RAIDEN_CONF_FILE"
sed -i "s/<one-to-n-contract-address>/$OneToN/g" "$RAIDEN_CONF_FILE"
sed -i "s/<user-deposit-contract-address>/$UserDeposit/g" "$RAIDEN_CONF_FILE"
sed -i "s/<monitoring-service-contract-address>/$MonitoringService/g" "$RAIDEN_CONF_FILE"
sed -i "s/<network-id>/$GETH_NETWORK_ID/g" "$RAIDEN_CONF_FILE"
sed -i "s#<account-address>#$RAIDEN_ADDRESS#g" "$RAIDEN_CONF_FILE"
sed -i "s#<password-file>#$PASSWORD_FILE#g" "$RAIDEN_CONF_FILE"
sed -i "s#<data-directory>#$RAIDEN_DATA_DIR#g" "$RAIDEN_CONF_FILE"
sed -i "s#<keystore-path>#$ACCOUNTS_PATH#g" "$RAIDEN_CONF_FILE"
