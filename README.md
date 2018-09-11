# Exchange Union

[![Gitter chat](https://img.shields.io/badge/chat-on%20gitter-rose.svg)](https://gitter.im/exchangeunion/Lobby)
[![Build Status](https://travis-ci.org/ExchangeUnion/xud.svg?branch=master)](https://travis-ci.org/ExchangeUnion/xud)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/87238907485845eb879bd61c65561775)](https://www.codacy.com/app/sangaman/xud?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ExchangeUnion/xud&amp;utm_campaign=Badge_Grade)

[Exchange Union](https://www.exchangeunion.com/) (XU) is a decentralized exchange layer built on the [Lightning](http://lightning.network/) and [Raiden](https://raiden.network/) networks to enable trustless and instant cryptocurrency swaps and order fulfillment between exchanges. This repository contains the Exchange Union Daemon (`xud`) software which encompasses the following components:

* Integration with [lnd](https://github.com/lightningnetwork/lnd) and [raiden](https://github.com/raiden-network/raiden) nodes.
* Decentralized order book to aggregate orders from the known network.
* Matching engine to match incoming local orders with existing local and remote orders and initiate atomic swaps.
* Peer-to-peer networking with other XU nodes.
* gRPC API with web proxy to serve other applications, also accessible by command-line interface.

## Install

If you already have [Node.js](https://nodejs.org/en/download/) installed, you can install `xud` via npm by running

```bash
sudo npm install xud -g --unsafe-perm
```

Detailed instructions for installing `xud` can be found in the wiki on our [Installation](https://github.com/ExchangeUnion/xud/wiki/Installation) page. Instructions for installing via Docker are on our [Docker](https://github.com/ExchangeUnion/xud/wiki/Docker) page.

## Usage

Open a new terminal and launch `xud`. 

```
$ ./xud
2018-9-11 01:11:59 [GLOBAL] info: config loaded
2018-9-11 01:11:59 [GLOBAL] info: Local nodePubKey is 029a96c975d301c1c8787fcb4647b5be65a3b8d8a70153ff72e3eac73759e5e345
2018-9-11 01:11:59 [DB] info: connected to database. host:localhost port:3306 database:xud
2018-9-11 01:11:59 [P2P] info: p2p server listening on 0.0.0.0:8885
2018-9-11 01:11:59 [RPC] info: gRPC server listening on localhost:8886
```

Issue commands to `xud` with the `xucli` command line tool. To see a list of available commands:

```
./xucli --help
```

You can find more information on how to use `xud` in the wiki at [Running xud](https://github.com/ExchangeUnion/xud/wiki/Running-xud) and [Command Line Interface](https://github.com/ExchangeUnion/xud/wiki/Command-Line-Interface).

Note: If you installed `xud` globally, you can run `xud` and `xucli` from anywhere. Otherwise you must run them from the `bin` folder.

## Code Documentation

Read the [TypeDoc here](https://exchangeunion.github.io/xud-typedoc/).

## Development & Testing Discussion

Comments, questions, and any development-related discussions are welcome in our [Gitter chat](https://gitter.im/exchangeunion/Lobby)
