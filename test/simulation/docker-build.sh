#!/usr/bin/env bash

if [[ $@ == "connext" || $# == 0 ]]
then
    mkdir -p temp
    pushd temp
    git clone https://github.com/ConnextProject/indra.git
    cd indra
    git checkout ab4daf9b63726ab5ca3d1903d910a2682b8855ef
    make
    popd
fi

docker-compose build $@
