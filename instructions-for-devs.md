# Instructions for Developers & Testers

This document contains `xud` setup instructions for developers and everyone with a need for more fine-grained control when running `xud`.

## 1. Install

First, clone the repository from GitHub and install dependencies. 

Developers & Testers:
```bash
git clone https://github.com/ExchangeUnion/xud
cd xud
npm install
```
For everyone else, we recommend using the [latest release](https://github.com/ExchangeUnion/xud/releases), below an example using the `1.0.0-prealpha` release tag:
```bash
git clone https://github.com/ExchangeUnion/xud 
cd xud
git checkout tags/1.0.0-prealpha -b 1.0.0-prealpha
npm install
```


`xud` uses [MySQL](https://www.mysql.com/) or [MariaDB](https://mariadb.org/). You will have to install one of those and create a user *xud* and a database *xud* and grant all permissions for the new database to the *xud* user.

## 2. Prepare your environment 

To initialize the database with some testing data, run the following command from `~/xud`:

```bash
npm run db:init
```

Setup raiden according to [this guide](https://github.com/ExchangeUnion/xud/blob/raiden_swap/lib/raidenclient/README.md).

[Releases](https://github.com/ExchangeUnion/xud/releases) currently only support raiden ERC20 swaps on testnet, thus we recommend to disable lnd in the config, to avoid unnecessary error outputs:
```toml
[lnd]
disable = true
```

## 3. Start `xud`

Open a new terminal and launch a `xud` process

```bash
~/xud/bin $ ./xud
2018-6-3 15:14:27 [GLOBAL] info: config loaded
2018-6-3 15:14:27 [DB] info: connected to database. host:localhost port:3306 database:xud
2018-6-3 15:14:28 [P2P] info: pool server listening on 0.0.0.0:8885
2018-6-3 15:14:28 [RPC] info: GRPC server listening on port 8886
2018-6-3 15:14:28 [RPC] info: gRPC Web API proxy listening on port 8080
```

Optional command line arguments to override defaults and settings in the [configuration](#configuration-optional) file for a specific `xud` instance

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

## 4. Interact with `xud` via Command-Line Interface

Interact with an `xud` process, identified by its `rpc` host and port using `xucli`. For getting up-to-date CLI commands, use `./xucli --help` as shown below:

```bash
~/xud/bin$ ./xucli --help
xucli <command>

Commands:
  xucli cancelorder <pair_id> <order_id>    cancel an order
  xucli connect <host> [port]               connect to an xu node
  xucli disconnect <host> [port]            disconnect from an xu node
  xucli executeSwap <identifier> <role>     execute an atomic swap
  <sending_amount> <sending_token>
  <receiving_amount> <receiving_token>
  xucli getinfo                             get general info from the xud node
  xucli getorders [pair_id] [max_results]   get orders from the order book
  xucli getpairs                            get order book's available pairs
  xucli placeorder <pair_id> <order_id>     place an order
  <quantity> [price]
  xucli shutdown                            gracefully shutdown the xud node
  xucli subscribepeerorders                 subscribe to incoming peer orders
  xucli subscribeswaps                      subscribe to executed swaps

Options:
  --help          Show help                                            [boolean]
  --version       Show version number                                  [boolean]
  --rpc.port, -p  RPC service port                      [number] [default: 8886]
  --rpc.host, -h  RPC service hostname           [string] [default: "localhost"]


```

Examples:
```bash
./xucli connect xud1.test.exchangeunion.com 8885
# Manually connect to another xud instance

./xucli placeorder BTC/LTC 1337 1 99
#Places a new limit order BUYING 1 BTC for 99 LTC, assigning the orderId 1337

./xucli placeorder BTC/LTC 1338 -1 99
#Places a new limit order SELLING 1 BTC for 99 LTC, assigning the orderId 1338

./xucli placeorder BTC/LTC 1339 1
#Places a new market order BUYING 1 BTC for the best LTC market price, assigning the orderId 1339

```

## Configuration (optional)

This *optional* configuration file uses [TOML](https://github.com/toml-lang/toml) and by default should be saved at  `~/.xud/xud.conf` on Linux or `AppData\Local\Xud\xud.conf` on Windows (run `xud` at least once for this folder to be created). Default settings which can be overridden are shown below.

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
#make sure this port is reachable from the internet

[lnd]
disable = false
host = "localhost"

[raiden]
disable = false
host = "localhost"
port = 5001
```

## Useful stuff for developers (optional)

### Auto-restart `xud` on file change

Auto restart on every file change under `dist` folder with `nodemon`:
 ```
nodemon --watch dist -e js bin/xud
```
 With args:
 ```
nodemon --watch dist -e js bin/xud --lnd.disable=true
```
### Daemonize `xud`
If you want to daemonize `xud`, so you don't have to keep a terminal open and xud starts on bootup, you can do this for example on Ubuntu by adding the following to `systemd`:

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
## Code Documentation

Read the [TypeDoc here](https://exchangeunion.github.io/xud-typedoc/).

## Development & Testing Discussion

[![Gitter chat](https://img.shields.io/badge/chat-on%20gitter-rose.svg)](https://gitter.im/exchangeunion/Lobby)