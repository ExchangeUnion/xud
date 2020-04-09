#!/usr/bin/env bash

rm -rf temp/logs

docker-compose down
docker volume ls -q --filter "name=simulation_btcd-vol" | grep -q . && docker volume rm simulation_btcd-vol || echo "volume simulation_btcd-vol not found"
docker volume ls -q --filter "name=simulation_lnd-vol" | grep -q . && docker volume rm simulation_lnd-vol || echo "volume simulation_lnd-vol not found"
docker volume ls -q --filter "name=simulation_gomod-vol" |  grep -q . && docker volume rm simulation_gomod-vol || echo "volume simulation_gomod-vol not found"
docker volume ls -q --filter "name=simulation_xud-vol" |  grep -q . && docker volume rm simulation_xud-vol || echo "volume simulation_xud-vol not found"
docker volume ls -q --filter "name=simulation_custom-xud-vol" |  grep -q . && docker volume rm simulation_custom-xud-vol || echo "volume simulation_custom-xud-vol not found"

