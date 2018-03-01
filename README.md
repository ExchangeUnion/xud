# Exchange Union

[Exchange Union](https://www.exchangeunion.com/) (XU) is a decentralized exchange layer built on the [Lightning](http://lightning.network/) and [Raiden](https://raiden.network/) networks to enable trustless and instant cryptocurrency swaps and order fulfillment between exchanges.

This repo contains the early stages of an XU node implementation which encompasses the following components:

* Integration with [lnd](https://github.com/lightningnetwork/lnd) and [raiden](https://github.com/raiden-network/raiden) nodes.
* Orderbook data stored in a local mysql/mariadb database.
* Peer-to-peer networking with other XU nodes via TCP.
* A JSON-RPC API to serve other applications and a command-line interface.

Contributions, feedback, and questions are welcome.

## Install

First, clone the repository from GitHub and install dependencies.

```bash
git clone https://github.com/ExchangeUnion/xunion
cd xunion
npm install
```

XUnion uses [MySQL](https://www.mysql.com/) or [MariaDB](https://mariadb.org/). You will have to install one of those and create a user and database named `xunion` and grant all permissions for that database to the new user.

## Starting the Daemon

```bash
cd bin
./xunion
```

## Configuration

The configuration file uses [TOML](https://github.com/toml-lang/toml) and by default is located at  `~/.xunion/xunion.conf` on Linux or `AppData\Local\XUnion\xunion.conf` on Windows. Default settings which can be overridden are shown below.

```toml
lndDir = "~/.lnd"
rpcPort = 8886

[db]
user = "xunion"
password = ""
database = "xunion"
port = 3306

[p2p]
listen = true
port = 8885
```
