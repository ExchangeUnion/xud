#!/usr/bin/env bash

docker-compose down
docker volume rm simulation_btcd-vol
docker volume rm simulation_geth-vol
docker volume rm simulation_gomod-vol
docker volume rm simulation_lnd-vol
docker volume rm simulation_raiden-vol
