#!/usr/bin/env bash

docker-compose run test go test -v -timeout 20m -run=TestIntegration
