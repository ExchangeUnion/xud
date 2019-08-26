#!/bin/bash
set -xe
"$@" --exec "loadScript(\"$PWD/create-account.js\")" attach | grep "account:" | awk '{print $2}'
