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

if [ -f ${temp_lndpath}/lnd-debug ]
then
    echo "lnd already installed"
else
    delete_dir ${temp_gopath}

    GO111MODULE=off GOPATH=${temp_gopath} go get -u github.com/golang/dep/cmd/dep
    GO111MODULE=off go get -u github.com/btcsuite/btcd

    echo "starting lnd clone..."
    if ! git clone -b resolver-cmd+simnet-ltcd https://github.com/ExchangeUnion/lnd.git ${temp_gopath}/src/github.com/lightningnetwork/lnd > /dev/null 2>&1; then
       echo "unable to git clone lnd"
       exit 1
    fi
    echo "finished lnd clone"

    echo "starting lnd make..."
    if ! (cd ${temp_lndpath} && GO111MODULE=off GOPATH=${temp_gopath} make); then
        echo "unable to make lnd"
        exit 1
    fi
    echo "finished lnd make"
fi
