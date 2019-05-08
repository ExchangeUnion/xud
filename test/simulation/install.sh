#!/bin/bash

delete_dir() {
	if ! rm -rf  $1 >/dev/null 2>&1; then
		echo "unable to delete directory $1"
		exit 1
	fi
	return 0
}

temp_gopath=$PWD/temp/go
temp_lndpath=${temp_gopath}/src/github.com/lightningnetwork/lnd
LND_TAG="v0.6.1-beta"
if [ -f ${temp_lndpath}/lnd-debug ]
then
  LND_VERSION=$(${temp_lndpath}/lnd-debug --version)
else
  LND_VERSION=""
fi

if [[ $LND_VERSION == *"$LND_TAG" ]]; then
    echo "lnd already installed"
else
    echo "deleting temporary gopath directory"
    delete_dir ${temp_gopath}

    echo "getting btcd..."
    GO111MODULE=off go get -u github.com/btcsuite/btcd

    echo "starting lnd clone..."
    if ! git clone -b ${LND_TAG} --depth 1 https://github.com/lightningnetwork/lnd ${temp_lndpath} > /dev/null 2>&1; then
       echo "unable to git clone lnd"
       exit 1
    fi
    echo "finished lnd clone"

    echo "starting lnd make..."
    if ! (cd ${temp_lndpath} && GO111MODULE=off GOPATH=${temp_gopath} make tags="invoicesrpc"); then
        echo "unable to make lnd"
        exit 1
    fi
    echo "finished lnd make"
fi
