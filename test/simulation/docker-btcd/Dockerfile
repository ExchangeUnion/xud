FROM golang:1.11

WORKDIR /app

RUN git clone https://github.com/btcsuite/btcd.git
RUN cd btcd && git checkout tags/v0.20.1-beta
RUN cd btcd && GOPATH=/app/go go install
