FROM golang:1.11

WORKDIR /app
COPY . .

RUN GOPATH=$PWD/go go get -u github.com/btcsuite/btcd

