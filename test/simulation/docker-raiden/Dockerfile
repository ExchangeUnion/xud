FROM golang:1.11
RUN apt-get update --allow-releaseinfo-change --fix-missing && apt-get upgrade -y && apt-get clean
RUN apt-get install -y curl python3.7 python3.7-dev python3.7-distutils python3-venv python3.7-venv

ENV WD=/raiden-vol
WORKDIR $WD

ENV TEMP_PATH=${WD}/temp
ENV CACHE_PATH=${WD}/cache

# RAIDEN
ENV RAIDEN_PATH=${TEMP_PATH}/raiden
ENV RAIDEN_BRANCH=develop
ENV RAIDEN_COMMIT_HASH=eb2af878dd2adf953b1dfb387f6a9ece27f50301
ENV RAIDEN_REPOSITORY=https://github.com/ExchangeUnion/raiden.git
ENV RAIDEN_CONF_TEMPLATE=${WD}/raiden-config-template.toml
ENV RAIDEN_DATA_DIR_BOB=${TEMP_PATH}/raiden-bob
ENV RAIDEN_DATA_DIR_ALICE=${TEMP_PATH}/raiden-alice

# CONTRATS
ENV RAIDEN_CONTRACTS_REPOSITORY=https://github.com/ExchangeUnion/raiden-contracts.git
ENV RAIDEN_CONTRACTS_BRANCH=simnet-contracts
ENV RAIDEN_CONTRACTS_PATH=${TEMP_PATH}/raiden-contracts
ENV RAIDEN_CONTRACTS_COMMIT_HASH=4b7a7e47a1278f895883fe77746b45210bbe7d09
ENV WETH_ADDRESS_FILE=${TEMP_PATH}/weth-address.txt
ENV CONTRACTS_WETH_LOG_JSON=${TEMP_PATH}/weth.log
ENV CONTRACTS_SERVICETOKEN_LOG_JSON=${TEMP_PATH}/servicetoken.log
ENV PASSWORD_FILE=${GETH_DATA_DIR}/passwd
ENV CONTRACTS_DEPLOYMENT_LOG_JSON=${RAIDEN_CONTRACTS_PATH}/raiden_contracts/data/deployment_private_net.json
ENV CONTRACTS_DEPLOYMENT_SERVICE_LOG_JSON=${RAIDEN_CONTRACTS_PATH}/raiden_contracts/data/deployment_services_private_net.json

# SOLC
ENV SOLC_SOURCE=https://github.com/ethereum/solidity/releases/download/v0.5.4/solc-static-linux
ENV SOLC_PATH=${CACHE_PATH}/solc
ENV SOLC_SHA256SUM=0fde347db5e632fc3aef3ca8da74896d8df7a35287646e7fbdee829fe236054a

COPY . .

RUN ./install-solc.sh
RUN ./install-raiden-contracts.sh
RUN ./install-raiden.sh




