FROM golang:1.13

WORKDIR /app
COPY . .

RUN GOPATH=$PWD/go go get -u github.com/btcsuite/btcd

