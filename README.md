# Exchange Union

[![Gitter chat](https://img.shields.io/badge/chat-on%20gitter-rose.svg)](https://gitter.im/exchangeunion/Lobby)

[Exchange Union](https://www.exchangeunion.com/) (XU) is a decentralized exchange layer built on the [Lightning](http://lightning.network/) and [Raiden](https://raiden.network/) networks to enable trustless and instant cryptocurrency swaps and order fulfillment between exchanges.

This repo contains the early stages of the Exchange Union Daemon ("xud") which encompasses the following components:

* Integration with [lnd](https://github.com/lightningnetwork/lnd) and [raiden](https://github.com/raiden-network/raiden) nodes.
* Orderbook data stored in a local mysql/mariadb database.
* Peer-to-peer networking with other XU nodes via TCP.
* A JSON-RPC API to serve other applications and a command-line interface.

Contributions, feedback, and questions are welcome.

## Install

First, clone the repository from GitHub and install dependencies.

```bash
git clone https://github.com/ExchangeUnion/xud
cd xud
npm install
```

Xud uses [MySQL](https://www.mysql.com/) or [MariaDB](https://mariadb.org/). You will have to install one of those and create a user and database grant all permissions for the new database to the new user.

## Starting the Daemon

```bash
~/xud $ cd bin
~/xud/bin $ ./xud
2018-3-2 11:36:06 - info: config loaded
2018-3-2 11:36:06 - info: connected to database
2018-3-2 11:36:06 - info: P2P server listening on port 8885
2018-3-2 11:36:06 - info: RPC server listening on port 8886
```

## Command-Line Interface

Spawn a new `xud` process

```bash
~/xud/bin $ ./xud 
Options:
  -r, --rpc.port                                        [number] [default: 8886]
  -p, --p2p.port                                        [number] [default: 8885] 
```

Interact with an `xud` process, identified by his `rpc` port
```bash
~/xud/bin $ ./xucli --help
xucli [command]

Commands:
  xucli connect <host> [port]                    connect to an xu node
  xucli getinfo                                  get general info from the xud node
  xucli getorders                                get orders from the orderbook
  xucli getpairs                                 get orderbook's available pairs
  xucli placeorder <pair_id> <price> <quantity>  place an order
  xucli shutdown                                 gracefully shutdown the xud node
  xucli tokenswap <identifier> <role>            perform a raiden token swap
  <sending_amount> <sending_token>
  <receiving_amount> <receiving_token>

Options:
  --version      Show version number                                   [boolean]
  --help         Show help                                             [boolean]
  -r, --rpc.port                                        [number] [default: 8886]
```

## Configuration

The configuration file uses [TOML](https://github.com/toml-lang/toml) and by default is located at  `~/.xud/xud.conf` on Linux or `AppData\Local\Xud\xud.conf` on Windows. Default settings which can be overridden are shown below.

```toml
[rpc]
port = 8886

[db]
username = "xud"
password = null
database = "xud"
port = 3306
host = "localhost"

[p2p]
listen = true
port = 8885

[lnd]
disable = false
rpcprotopath = "lndrpc.proto"

[raiden]
disable = false
port = 5001
```


## Database Initialization

To initialize the database with default testing data, run the following command:

```bash
npm run db:init
```
