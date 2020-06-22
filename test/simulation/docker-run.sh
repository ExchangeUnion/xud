#!/usr/bin/env bash

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
