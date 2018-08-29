# Instructions for Developers & Testers

This document contains `xud` setup instructions for developers and everyone with a need for more fine-grained control when running `xud`.

## 1. Install

First, clone the repository from GitHub and install dependencies. Make sure to have minimum `nodejs` v8.11.3 installed. If not the case, checkout [the official instructions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions). 

Developers & Testers:
```bash
git clone https://github.com/ExchangeUnion/xud
cd xud
npm i
npm run compile
```
For everyone else, we recommend using the [latest release](https://github.com/ExchangeUnion/xud/releases), below an example using the `v1.0.0-prealpha.2` release tag:
```bash
git clone https://github.com/ExchangeUnion/xud 
cd xud
git checkout tags/v1.0.0-prealpha.2 -b v1.0.0-prealpha.2
npm i
npm run compile
```


`xud` uses [MySQL](https://www.mysql.com/) or [MariaDB](https://mariadb.org/). You will have to install one of those and create a user "xud" (password empty) and grant permissions to the "xud" user. Note: We currently don't support the *strong password mechanism* of MySQL 8.

Here an example of how to achieve the above:
```bash
sudo mysql
mysql> CREATE USER 'xud'@'localhost' IDENTIFIED BY '';
mysql> GRANT ALL ON *.* TO 'xud'@'localhost';
```


## 2. Start `xud`

Open a new terminal and launch a `xud` process.

```bash
~/xud/bin $ ./xud
2018-6-3 15:14:27 [GLOBAL] info: config loaded
2018-6-3 15:14:27 [DB] info: connected to database. host:localhost port:3306 database:xud
2018-6-3 15:14:28 [P2P] info: pool server listening on 0.0.0.0:8885
2018-6-3 15:14:28 [RPC] info: GRPC server listening on port 8886
2018-6-3 15:14:28 [RPC] info: gRPC Web API proxy listening on port 8080
```

*Optional*: Configure `xud` [as a daemon](#daemonize-xud).

Use `./xucli --help` to get up-to-date, optional command line arguments to override defaults and settings in the [configuration](#configuration-optional) file for a specific `xud` instance

```bash
~/xud/bin $ ./xud --help
Options:
  --help                 Show help                                     [boolean]
  --version              Show version number                           [boolean]
  --initDb               Whether to initialize the db with data        [boolean]
  --xudir, -x            Data directory for xud                         [string]
  --db.database          SQL database name                              [string]
  --db.host              Hostname for SQL database                      [string]
  --db.password          Password for SQL database                      [string]
  --db.port              Port for SQL database                          [number]
  --db.username          User for SQL database                          [string]
  --lndbtc.certpath      Path to the SSL certificate for lndBtc         [string]
  --lndbtc.disable       Disable lndBtc integration                    [boolean]
  --lndbtc.host          Host of the lndBtc gRPC interface              [string]
  --lndbtc.macaroonpath  Path of the admin macaroon for lndBtc          [string]
  --lndbtc.port          Port of the lndBtc gRPC interface              [number]
  --lndltc.certpath      Path to the SSL certificate for lndLtc         [string]
  --lndltc.disable       Disable lndLtc integration                    [boolean]
  --lndltc.host          Host of the lndLtc gRPC interface              [string]
  --lndltc.macaroonpath  Path of the admin macaroon for lndLtc          [string]
  --lndltc.port          Port of the lndLtc gRPC interface              [number]
  --p2p.addresses        String array of reachable addresses             [array]
  --p2p.listen           Listen for incoming peers                     [boolean]
  --p2p.port, -p         Port to listen for incoming peers              [number]
  --raiden.disable       Disable raiden integration                    [boolean]
  --raiden.port          Port for raiden REST service                   [number]
  --rpc.host             gRPC service host                              [string]
  --rpc.port, -r         gRPC service port                              [number]
  --webproxy.disable     Disable web proxy server                      [boolean]
  --webproxy.port        Port for web proxy server                      [number]
```

## 3. Interact with `xud` via Command-Line Interface

Once `xud` is running, you can use `xucli` to interact with it. For getting up-to-date CLI commands, use `./xucli --help` as shown below:

```bash
~/xud/bin$ ./xucli --help
xucli <command>

Commands:
  xucli cancelorder <pair_id> <order_id>    cancel an order
  xucli connect <node_pub_key> <host>       connect to an xu node
  [port]
  xucli disconnect <node_pub_key>           disconnect from an xu node
  xucli executeSwap <identifier> <role>     execute an atomic swap
  <sending_amount> <sending_token>
  <receiving_amount> <receiving_token>
  xucli getinfo                             get general info from the xud node
  xucli getorders <pair_id> [max_results]   get orders from the order book
  xucli getpairs                            get order book's available pairs
  xucli listpeers                           list connected peers
  xucli placeorder <pair_id> <order_id>     place an order, if price is 0 or
  <quantity> [price]                        unspecified a market order is placed
  xucli shutdown                            gracefully shutdown the xud node
  xucli subscribepeerorders                 subscribe to peer order events
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

./xucli placeorder LTC/BTC 1337 1 99
# Places a new limit order BUYING 1 BTC for 99 LTC, assigning the orderId 1337

./xucli placeorder LTC/BTC 1338 -1 99
# Places a new limit order SELLING 1 BTC for 99 LTC, assigning the orderId 1338

./xucli placeorder LTC/BTC 1339 1
# Places a new market order BUYING 1 BTC for the best LTC market price, assigning the orderId 1339

```

## Configuration (optional)

This *optional* configuration file uses [TOML](https://github.com/toml-lang/toml) and by default should be saved at  `~/.xud/xud.conf` on Linux or `AppData\Local\Xud\xud.conf` on Windows (run `xud` at least once for this folder to be created). All options with default values are shown below.

```toml
initDb = true # Whether to initalize a new database with default values

[rpc]
port = 8886
host = "localhost"

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
port = 8885 # The port to listen for incoming peer connections when listen = true
# A string array of reachable socket addresses for this node, port defaults to p2p.port if unspecified
addresses = [ "4.8.15.16:8885" ]

[lndbtc]
disable = false
host = "localhost"

[lndltc]
disable = false
host = "localhost"
certpath = "" # The default value is platform-specific
macaroonpath = "" # The default value is platform-specific

[raiden]
disable = false
host = "localhost"
port = 5001
```

An empty *xud* database with schema gets automatically created when launching `xud`. To initialize an additional *xud_test* database with some pre-filled testing data, run the following command from the `~/xud` folder:

```bash
npm run db:init
```

Use the [config file](#configuration-optional) or launch `xud` with `--db.database xud_test` to use the pre-filled *xud_test* database. 

[Releases](https://github.com/ExchangeUnion/xud/releases) currently don't support swaps, thus we recommend to disable lnd & raiden in the config, to avoid unnecessary error outputs:

```toml
[lndbtc]
disable = true

[lndltc]
disable = true

[raiden]
disable = true
```

## Useful stuff for developers (optional)

### Auto-restart `xud` on file change

Auto restart on every file change under `dist` folder with `nodemon`:
 ```
nodemon --watch dist -e js bin/xud
```
 With args:
 ```
nodemon --watch dist -e js bin/xud --lndbtc.disable=true --lndltc.disable=true
```
### Daemonize `xud`
If you want to daemonize `xud`, so you don't have to keep a terminal open and xud starts on bootup, you can do this for example on Ubuntu by adding the following to `systemd`:

```bash
[Unit]
Description= XUD - ExchangeUnion Daemon
ConditionPathExists=/opt/xud/dist/
After=network.target

[Service]
User=xud
Group=xud
WorkingDirectory=/opt/xud/
ExecStart=/usr/bin/node /opt/xud/dist/Xud.js
Type=simple

[Install]
WantedBy=multi-user.target
```
## Code Documentation

Read the [TypeDoc here](https://exchangeunion.github.io/xud-typedoc/).

## Development & Testing Discussion

[![Gitter chat](https://img.shields.io/badge/chat-on%20gitter-rose.svg)](https://gitter.im/exchangeunion/Lobby)
