#!/usr/bin/env bash


docker-compose down

if [[ $# == 0 ]]
then
    docker volume ls -q --filter "name=simulation_btcd-vol" | grep -q . && docker volume rm simulation_btcd-vol || echo "volume simulation_btcd-vol not found"
    docker volume ls -q --filter "name=simulation_lnd-vol" | grep -q . && docker volume rm simulation_lnd-vol || echo "volume simulation_lnd-vol not found"
    docker volume ls -q --filter "name=simulation_connext-vol" | grep -q . && docker volume rm simulation_connext-vol || echo "volume simulation_connext-vol not found"
    docker volume ls -q --filter "name=simulation_gomod-vol" |  grep -q . && docker volume rm simulation_gomod-vol || echo "volume simulation_gomod-vol not found"
    docker volume ls -q --filter "name=simulation_xud-vol" |  grep -q . && docker volume rm simulation_xud-vol || echo "volume simulation_xud-vol not found"
    docker volume ls -q --filter "name=simulation_custom-xud-vol" |  grep -q . && docker volume rm simulation_custom-xud-vol || echo "volume simulation_custom-xud-vol not found"

    rm -rf temp/logs
else
    docker volume rm simulation_$@-vol
fi



