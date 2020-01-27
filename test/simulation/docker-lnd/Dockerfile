FROM golang:1.11

ENV GO_PATH=$PWD/go
ENV LND_PATH=${GO_PATH}/src/github.com/lightningnetwork/lnd
ENV LND_TAG="v0.7.1-beta"

WORKDIR /app
COPY . .

RUN ./install-lnd.sh
