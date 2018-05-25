# Exchange Union

[![Gitter chat](https://img.shields.io/badge/chat-on%20gitter-rose.svg)](https://gitter.im/exchangeunion/Lobby)
[![Build Status](https://travis-ci.org/ExchangeUnion/xud.svg?branch=master)](https://travis-ci.org/ExchangeUnion/xud)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/87238907485845eb879bd61c65561775)](https://www.codacy.com/app/sangaman/xud?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ExchangeUnion/xud&amp;utm_campaign=Badge_Grade)

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

## Configuration

An optional configuration file uses [TOML](https://github.com/toml-lang/toml) and by default should be saved at  `~/.xud/xud.conf` on Linux or `AppData\Local\Xud\xud.conf` on Windows. Default settings which can be overridden are shown below.

```toml
[rpc]
port = 8886

[db]
username = "xud"
password = ""
database = "xud"
port = 3306
host = "localhost"

[p2p]
listen = true
port = 8885

[lnd]
disable = false
datadir = "~/.lnd"
host = "localhost"

[raiden]
disable = false
host = "localhost"
port = 5001

[orderbook]
internalmatching = true
```

## Starting the Daemon

Launch a new `xud` process

```bash
~/xud $ cd bin
~/xud/bin $ ./xud
2018-3-2 11:36:06 - info: config loaded
2018-3-2 11:36:06 - info: connected to database
2018-3-2 11:36:06 - info: P2P server listening on port 8885
2018-3-2 11:36:06 - info: RPC server listening on port 8886
```

Optional command line arguments to override defaults and settings in the [Configuration](#configuration) file for a specific `xud` instance

```bash
~/xud/bin $ ./xud --help
Options:
  --help                        Show help                              [boolean]
  --version                     Show version number                    [boolean]
  --rpc.port, -r                RPC service port                        [number]
  --p2p.port, -p                Port to listen for incoming peers       [number]
  --p2p.listen                  Listen for incoming peers              [boolean]
  --xudir, -x                   Data directory for xud                  [string]
  --db.host                     Hostname for SQL database               [string]
  --db.port                     Port for SQL database                   [number]
  --db.username                 User for SQL database                   [string]
  --db.database                 SQL database name                       [string]
  --db.dialect                  SQL database dialect                    [string]
  --lnd.disable                 Disable lnd integration                [boolean]
  --lnd.datadir                 Data directory for lnd                  [string]
  --lnd.certpath                Path to the SSL certificate for lnd     [string]
  --lnd.host                    Host of the lnd gRPC interface          [string]
  --lnd.port                    Port of the lnd gRPC interface          [number]
  --lnd.macaroonpath            Path of the admin macaroon for lnd      [string]
  --raiden.disable              Disable raiden integration             [boolean]
  --raiden.port                 Port for raiden REST service            [number]
  --orderbook.internalmatching  OrderBook Internal Matching            [boolean]
```

## Command-Line Interface

Interact with an `xud` process, identified by its `rpc` host and port

```bash
~/xud/bin $ ./xucli --help
xucli [command]

Commands:
  xucli connect <host> [port]               connect to an xu node
  xucli getinfo                             get general info from the xud node
  xucli getorders [pair_id] [max_results]   get orders from the orderbook
  xucli getpairs                            get orderbook's available pairs
  xucli placeorder <pair_id> <price>        place an order
  <quantity>
  xucli shutdown                            gracefully shutdown the xud node
  xucli tokenswap <identifier> <role>       perform a raiden token swap
  <sending_amount> <sending_token>
  <receiving_amount> <receiving_token>

Options:
  --help          Show help                                            [boolean]
  --version       Show version number                                  [boolean]
  --rpc.port, -p  The RPC service port                  [number] [default: 8886]
  --rpc.host, -h  The RPC service hostname       [string] [default: "localhost"]
```

## Database Initialization

To initialize the database with default testing data, run the following command:

```bash
npm run db:init
```

## Documentation

[Read the TypeDoc here](https://exchangeunion.github.io/xud-typedoc/).
