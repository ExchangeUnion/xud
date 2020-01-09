FROM golang:1.11

WORKDIR /app
COPY . .

RUN apt-get update --allow-releaseinfo-change --fix-missing && apt-get upgrade -y && apt-get clean
RUN apt-get install -y curl python3.7 python3.7-dev python3.7-distutils python3-venv python3.7-venv
RUN apt-get install libssl-dev

RUN ./install-lnd.sh
RUN ./install-geth.sh
RUN ./install-solc.sh

RUN ./install-raiden-contracts.sh
RUN ./install-raiden.sh
RUN ./install-ethereum-utils.sh
RUN ./create-geth-genesis.sh

RUN go get -u github.com/btcsuite/btcd
RUN GO111MODULE=on go get -d
