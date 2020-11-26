#!/usr/bin/env bash

# TODO(karl): enable connext V2 simulation tests
# if [[ $@ == "connext" || $# == 0 ]]
# then
    # mkdir -p temp
    # pushd temp
    # git clone https://github.com/ConnextProject/indra.git
    # cd indra
    # git checkout indra-7.3.14
    # make
    # popd
# fi

docker-compose build $@
