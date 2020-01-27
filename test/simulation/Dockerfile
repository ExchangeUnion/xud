FROM golang:1.11

ENV WD=/app
WORKDIR $WD

ENV TEMP_PATH=${WD}/temp
ENV GETH_CACHE_PATH=/geth-vol/cache

# GETH
ENV GETH_CACHE_PATH=/geth-vol/cache
ENV GETH_GOPATH=/geth-vol/go
ENV GETH_PATH=${GETH_GOPATH}/src/github.com/etENVhereum/go-ethereum
ENV GETH_BINARY_PATH=${GETH_PATH}/build/bin/geth
ENV GETH_DATA_DIR=/geth-vol/datadir
ENV ETH_UTILS_SOURCE=/geth-vol/utils/ethereum
ENV ETH_UTILS_VENV_DIR=eth-utils-venv
ENV ETH_UTILS_VENV_PATH=${GETH_CACHE_PATH}/${ETH_UTILS_VENV_DIR}
ENV ACCOUNTS_PATH=${GETH_DATA_DIR}/keystore
ENV TREASURY_ACCOUNT_PATH=${ACCOUNTS_PATH}/treasury
ENV ALICE_ACCOUNT_PATH=${ACCOUNTS_PATH}/alice
ENV GETH_NETWORK_ID=4321
ENV GETH_RPCADDR=localhost
ENV DAG_DIR=${GETH_CACHE_PATH}/.ethash
ENV GETH_IPC=${GETH_DATA_DIR}/geth.ipc
ENV PASSWORD_FILE=${GETH_DATA_DIR}/passwd

# RAIDEN CONTRACTS
ENV RAIDEN_CONTRACTS_PATH=/raiden-vol/temp/raiden-contracts
ENV PASSWORD_FILE=${GETH_DATA_DIR}/passwd
ENV CONTRACTS_DEPLOYMENT_LOG_JSON=${RAIDEN_CONTRACTS_PATH}/raiden_contracts/data/deployment_private_net.json
ENV CONTRACTS_SERVICETOKEN_LOG_JSON=${TEMP_PATH}/servicetoken.log
ENV CONTRACTS_WETH_LOG_JSON=${TEMP_PATH}/weth.log
ENV WETH_ADDRESS_FILE=${TEMP_PATH}/weth-address.txt

# btcd executable file is expected to be found in $PATH
ENV PATH="/btcd-vol/go/bin:${PATH}"

# use test-docker dependencies download
ENV GOPATH="/gomod-vol/go"

RUN apt-get update
RUN apt-get install -y jq
RUN apt-get install -y curl python3.7 python3.7-dev python3.7-distutils python3-venv python3.7-venv
RUN apt-get install -y net-tools

COPY . .

