#!/bin/bash

delete_dir() {
	if ! rm -rf  $1 >/dev/null 2>&1; then
		echo "unable to delete directory $1"
		exit 1
	fi
	return 0
}

GO_PATH=$PWD/go
LND_PATH=${GO_PATH}/src/github.com/lightningnetwork/lnd
LND_TAG="v0.7.1-beta"
if [ -f ${LND_PATH}/lnd-debug ]
then
  LND_VERSION=$(${LND_PATH}/lnd-debug --version)
else
  LND_VERSION=""
fi

if [[ $LND_VERSION == *"$LND_TAG" ]]; then
    echo "lnd already installed"
else
    echo "lnd version $LND_TAG not found"
    if [ -d "$LND_PATH" ]; then
      echo "deleting lnd directory"
      delete_dir ${LND_PATH}
    fi

    echo "getting btcd..."
    GOPATH=${GO_PATH} go get -u github.com/btcsuite/btcd

    echo "starting lnd clone..."
    if ! git clone -b ${LND_TAG} --depth 1 https://github.com/lightningnetwork/lnd ${LND_PATH} > /dev/null 2>&1; then
       echo "unable to git clone lnd"
       exit 1
    fi
    echo "finished lnd clone"

    echo "starting lnd make..."
    if ! (cd ${LND_PATH} && GOPATH=${GO_PATH} make tags="invoicesrpc"); then
        echo "unable to make lnd"
        exit 1
    fi
    echo "finished lnd make"
fi
