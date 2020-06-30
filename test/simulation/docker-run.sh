#!/usr/bin/env bash

# we create the temp directory with the current user so it is the owner for permissions 
mkdir -p $PWD/temp/logs
docker-compose run -v $PWD/temp/logs:/app/temp/logs test go test -v -timeout 20m -run=$@
