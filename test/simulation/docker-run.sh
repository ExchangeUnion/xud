#!/usr/bin/env bash

# create the temp directory with the current user so it is the owner for permissions
mkdir -p $PWD/temp/logs

pushd temp/indra
make start
popd

export DOCKER_CLIENT_TIMEOUT=120
export COMPOSE_HTTP_TIMEOUT=120
docker-compose run -v $PWD/temp/logs:/app/temp/logs test go test -v -timeout 20m -run=$@
res=$?

pushd temp/indra
make reset
popd

if [ res -ne 0 ]; then
    ./logs.sh
fi
exit $res
