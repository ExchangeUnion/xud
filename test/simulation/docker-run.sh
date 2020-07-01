#!/usr/bin/env bash

# create the temp directories with the current user so it is the owner for permissions
mkdir -p $PWD/temp/logs
mkdir -p $PWD/temp/indra

if [[ $@ == "TestIntegration" || $# == 0 ]]
then
    pushd temp/indra
    make start
    popd
fi

export DOCKER_CLIENT_TIMEOUT=120
export COMPOSE_HTTP_TIMEOUT=120
docker-compose run -v $PWD/temp/logs:/app/temp/logs test go test -v -timeout 20m -run=$@
res=$?


if [[ $@ == "TestIntegration" || $# == 0 ]]
then
    pushd temp/indra
    make reset
    popd
fi

exit $res
