# Getting Started

These instructions will guide you on setting up Connext compatible with development builds of XUD.

## Prerequisites

- Linux, preferably [Ubuntu 17.04 or greater](https://wiki.ubuntu.com/Releases).
- [Python 3.6.3](https://www.python.org/downloads/release/python-363/) (included in newer versions of Ubuntu).
- _If installing Go Ethereum from source_ - [Go 1.7 or greater](https://golang.org/doc/install), preferably the latest version.

## Dependencies

Run the following commands to ensure you have the required dependencies.

```bash
sudo apt-get update
sudo apt-get install build-essential automake pkg-config libtool libffi-dev libgmp-dev libssl-dev
```

## Go Ethereum

### Installing Go Ethereum

Install the latest release of Go Ethereum according to the [official instructions](https://github.com/ethereum/go-ethereum/wiki/Installing-Geth).

### Running Go Ethereum

Start `geth` and allow it to sync with the Ropsten testnet.

```bash
geth --testnet --fast --rpc --rpcapi eth,net,web3 --bootnodes "enode://20c9ad97c081d63397d7b685a412227a40e23c8bdc6688c6f37e97cfbc22d2b4d1db1510d8f61e6a8866ad7f0e17c02b14182d37ea7c3c8b9c2683aeb6b733a1@52.169.14.227:30303,enode://6ce05930c72abc632c58e2e4324f7c7ea478cec0ed4fa2528982cf34483094e9cbc9216e7aa349691242576d552a2a56aaeae426c5303ded677ce455ba1acd9d@13.84.180.240:30303"
```

### Creating an Account

Attach to the `geth` console.

```bash
geth attach --datadir ~/.ethereum/testnet
```

From within the console, create an account.

```bash
personal.newAccount()
```

## Solidity Compiler

Install `solc` v0.4.18 from source.

```bash
git clone --recursive https://github.com/ethereum/solidity.git
cd solidity
git checkout tags/v0.4.18
git submodule update --init --recursive
./scripts/install_deps.sh
./scripts/build.sh
```

## Connext

### Installing Connext

Install v0.3.0 from source with a virtual python environment.

```bash
git clone https://github.com/connext-network/connext.git
cd connext
git checkout tags/v0.3.0
virtualenv rdnenv
source rdnenv/bin/activate
pip3 install --upgrade -r requirements-dev.txt
python3 setup.py develop
```

If the `virtualenv` command fails, ensure you have it installed and retry.

```bash
pip3 install virtualenv
```

### Running Connext

Make sure to run `source rdnenv/bin/activate` in any terminal before starting Connext.

```bash
connext --keystore-path  ~/.ethereum/testnet/keystore
```

_Note:_ If you encounter the error below, it can be resolved by changing `from gevent.wsgi import WSGIServer` to `from gevent.pywsgi import WSGIServer` in `connext/api/rest.py`.

```bash
Traceback (most recent call last):
  File "/home/walli/connext/rdnenv/bin/connext", line 11, in <module>
    load_entry_point('connext', 'console_scripts', 'connext')()
  File "/home/walli/connext/connext/__main__.py", line 7, in main
    from connext.ui.cli import run
  File "/home/walli/connext/connext/ui/cli.py", line 23, in <module>
    from connext.api.rest import APIServer, RestAPI
  File "/home/walli/connext/connext/api/rest.py", line 13, in <module>
    from gevent.wsgi import WSGIServer
ModuleNotFoundError: No module named 'gevent.wsgi'
```
