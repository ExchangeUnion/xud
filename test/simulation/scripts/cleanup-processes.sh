#!/bin/bash
set -ex

if pgrep -x "btcd" > /dev/null
then
    pgrep btcd | xargs kill -15
fi

if pgrep -x "ltcd" > /dev/null
then
    pgrep ltcd | xargs kill -15
fi

if pgrep -x "lnd" > /dev/null
then
    pgrep lnd | xargs kill -15
fi

if pgrep -x "python3.7" > /dev/null
then
    pgrep python3.7 | xargs kill -15
fi

if pgrep -x "geth" > /dev/null
then
    pgrep geth | xargs kill -15
fi
