export GO_PATH=$PWD/go
export TEMP_PATH="$PWD/temp"
export CACHE_PATH="$PWD/cache"
# lnd
export LND_PATH=${GO_PATH}/src/github.com/lightningnetwork/lnd
export LND_TAG="v0.7.1-beta"
 F
(cd lnd-docker && docker build -t lnd-docker . && docker run -v lnd-build-vol:/app lnd-docker)
ls
docker build -t xud-sim . && docker run -it -v lnd-build-vol:/lnd-build-vol xud-sim
