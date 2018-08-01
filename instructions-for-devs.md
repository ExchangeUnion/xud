# Instructions for Developers

## Install

First, clone the repository from GitHub and install dependencies.

```bash
git clone https://github.com/ExchangeUnion/xud
cd xud
npm install
```

Xud uses [MySQL](https://www.mysql.com/) or [MariaDB](https://mariadb.org/). You will have to install one of those and create a user *xud* and a database *xud* and grant all permissions for the new database to the *xud* user.

## Configuration

An **optional** configuration file uses [TOML](https://github.com/toml-lang/toml) and by default should be saved at  `~/.xud/xud.conf` on Linux or `AppData\Local\Xud\xud.conf` on Windows. Default settings which can be overridden are shown below.

```toml
[rpc]
port = 8886

[webproxy]
disable = false
port = 8080

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
host = "localhost"

[raiden]
disable = false
host = "localhost"
port = 5001
```

## Preparing your environment for the preAlpha (testnet) release

To initialize the database with some testing data, run the following command:

```bash
npm run db:init
```

The [preAlpha release](https://github.com/ExchangeUnion/xud/releases) only supports raiden swaps on testnet, thus we recommend to disable lnd for now, to avoid unnecessary error outputs:
```toml
[lnd]
disable = true
```
Then setup raiden by following [this guide](https://github.com/ExchangeUnion/xud/blob/raiden_swap/lib/raidenclient/README.md).

## Starting the Daemon

Open a new terminal and launch a `xud` process

```bash
~/xud/bin $ ./xud
2018-6-3 15:14:27 [GLOBAL] info: config loaded
2018-6-3 15:14:27 [DB] info: connected to database. host:localhost port:3306 database:xud
2018-6-3 15:14:28 [P2P] info: pool server listening on 0.0.0.0:8885
2018-6-3 15:14:28 [RPC] info: GRPC server listening on port 8886
2018-6-3 15:14:28 [RPC] info: gRPC Web API proxy listening on port 8080
```

Optional command line arguments to override defaults and settings in the [configuration](#configuration) file for a specific `xud` instance

```bash
~/xud/bin $ ./xud --help
Options:
  --help                        Show help                              [boolean]
  --version                     Show version number                    [boolean]
  --xudir, -x                   Data directory for xud                  [string]
  --db.database                 SQL database name                       [string]
  --db.host                     Hostname for SQL database               [string]
  --db.port                     Port for SQL database                   [number]
  --db.username                 User for SQL database                   [string]
  --lnd.certpath                Path to the SSL certificate for lnd     [string]
  --lnd.disable                 Disable lnd integration                [boolean]
  --lnd.host                    Host of the lnd gRPC interface          [string]
  --lnd.macaroonpath            Path of the admin macaroon for lnd      [string]
  --lnd.port                    Port of the lnd gRPC interface          [number]
  --p2p.listen                  Listen for incoming peers              [boolean]
  --p2p.port, -p                Port to listen for incoming peers       [number]
  --raiden.disable              Disable raiden integration             [boolean]
  --raiden.port                 Port for raiden REST service            [number]
  --rpc.port, -r                RPC service port                        [number]
  --webproxy.disable            Disable web proxy server               [boolean]
  --webproxy.port               Port for web proxy server               [number]
```

## Daemonize xud
If you want to daemonize `xud`, so you don't have to keep a terminal open, you can do this for example by adding the following to `systemd` on Ubuntu:

```bash
[Unit]
Description=Exchange Union Daemon
# If you want to daemonize lnd/raiden too, start lnd/raiden first 
# After=lnd.service

[Service]
User=xud
Group=xud
ExecStart=/usr/bin/xud

[Install]
WantedBy=multi-user.target
```

## Command-Line Interface

Interact with an `xud` process, identified by its `rpc` host and port

```bash
~/xud/bin $ ./xucli --help
xucli [command]

Commands:
  xucli connect <host> [port]               connect to an xu node
  xucli getinfo                             get general info from the xud node
  xucli getorders [pair_id] [max_results]   get orders from the order book
  xucli getpairs                            get order book's available pairs
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

## Code Documentation

[Read the TypeDoc here](https://exchangeunion.github.io/xud-typedoc/).

## Questions?
[![Gitter chat](https://img.shields.io/badge/chat-on%20gitter-rose.svg)](https://gitter.im/exchangeunion/Lobby)