FROM golang:1.11

ENV WD=/app
WORKDIR $WD

ENV GO_PATH=${WD}/go
ENV LND_PATH=${GO_PATH}/src/github.com/lightningnetwork/lnd
ENV LND_TAG="v0.8.2-beta"

COPY . .

RUN ./install-lnd.sh
