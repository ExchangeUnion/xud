#!/bin/bash


cd ~/xud
npm run proto
npm run compile
bin/xud &
sleep 3
bin/xucli listpeers
