#!/bin/bash
pgrep btcd | xargs kill -15
pgrep ltcd | xargs kill -15
pgrep lnd | xargs kill -15
pgrep python | xargs kill -15
pgrep geth | xargs kill -15
