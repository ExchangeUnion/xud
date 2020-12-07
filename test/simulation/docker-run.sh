#!/usr/bin/env bash

# create the temp directories with the current user so it is the owner for permissions
mkdir -p $PWD/temp/logs
# mkdir -p $PWD/temp/indra

# pushd temp/indra
# make start
# popd

export DOCKER_CLIENT_TIMEOUT=120
export COMPOSE_HTTP_TIMEOUT=120
testCmd="docker-compose run -v $PWD/temp/logs:/app/temp/logs test go test -v -timeout 30m -run=$@"
eval $testCmd
testRetCode=$?

if [[ $testRetCode != 0 ]]; then
    for i in 1 2 3; do
        printf "\ndocker-run.sh: test failed, re-running... ($i/3)\n\n"

        eval $testCmd
        testRetCode=$?

        if [[ $testRetCode == 0 ]]; then
            break
        fi
    done
fi

# pushd temp/indra
# make reset
# popd

exit $testRetCode
