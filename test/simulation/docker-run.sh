#!/usr/bin/env bash

if [[ $@ == "TestIntegration" ]]
then
    pushd temp/indra
    make start
    popd
fi

docker-compose run -v $PWD/temp/logs:/app/temp/logs test go test -v -timeout 20m -run=$@

if [[ $@ == "TestIntegration" ]]
then
    pushd temp/indra
    make reset
    popd
fi


