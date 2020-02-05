FROM golang:1.13

ENV WD=/app
WORKDIR $WD

ENV GO_PATH=${WD}/go
ENV CACHE_PATH=${WD}/cache

ENV GETH_PATH=${GO_PATH}/src/github.com/etENVhereum/go-ethereum
ENV GETH_BINARY_PATH=${GETH_PATH}/build/bin/geth
ENV GETH_DATA_DIR=${WD}/datadir
ENV GETH_NETWORK_ID=4321
ENV GETH_RPCADDR=localhost
ENV GETH_SOURCE=https://github.com/ExchangeUnion/go-ethereum
ENV GETH_COMMIT_HASH=e0bb1631c21042336d230c11de0dfe8580aa28c4
ENV DAG_DIR=${CACHE_PATH}/.ethash
ENV GETH_IPC=${GETH_DATA_DIR}/geth.ipc
ENV GENESIS_JSON=${WD}/utils/genesis.json

COPY . .

RUN ./install-geth.sh

# TODO: switch to python based image

ENV ETH_UTILS_SOURCE=${WD}/utils/ethereum
ENV ETH_UTILS_VENV_DIR=eth-utils-venv
ENV ETH_UTILS_VENV_PATH=${CACHE_PATH}/${ETH_UTILS_VENV_DIR}
ENV ACCOUNTS_PATH=${GETH_DATA_DIR}/keystore
ENV TREASURY_ACCOUNT_PATH=${ACCOUNTS_PATH}/treasury
ENV ALICE_ACCOUNT_PATH=${ACCOUNTS_PATH}/alice

RUN apt-get update --allow-releaseinfo-change --fix-missing && apt-get upgrade -y && apt-get clean
RUN apt-get install -y curl python3.7 python3.7-dev python3.7-distutils python3-venv python3.7-venv

# needed due to ethereum/scrypt package openssl-aes dependency
RUN apt-get install libssl-dev

WORKDIR $WD
RUN ./install-ethereum-utils.sh
RUN ./create-geth-genesis.sh

