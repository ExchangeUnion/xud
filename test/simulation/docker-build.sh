#!/usr/bin/env bash

if [[ $@ == "connext" || $# == 0 ]]
then
    mkdir -p temp
    pushd temp
    git clone https://github.com/ConnextProject/indra.git
    cd indra
    make
    popd
fi

docker-compose build $@
