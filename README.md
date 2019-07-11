# Exchange Union Daemon

[![Discord](https://img.shields.io/discord/547402601885466658.svg)](https://discord.gg/YgDhMSn)
[![Build Status](https://travis-ci.org/ExchangeUnion/xud.svg?branch=master)](https://travis-ci.org/ExchangeUnion/xud)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/87238907485845eb879bd61c65561775)](https://www.codacy.com/app/sangaman/xud?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ExchangeUnion/xud&amp;utm_campaign=Badge_Grade)

The Exchange Union Daemon (`xud`) powers [Exchange Union](https://www.exchangeunion.com/), a decentralized exchange (DEX) built on the [Lightning](http://lightning.network/) and [Raiden](https://raiden.network/) networks to enable instant and trustless cryptocurrency swaps. The vision is to bring individuals and existing, centralized exchanges onto the same network and form one, global liquidity pool. This gives users a choice to either trade directly on the DEX, managing private keys and software stack, *or* to conveniently trade via a trusted exchange. Exchanges participating in the network aggregate the network's liquidity and can provide deeper order books and new trading pairs to their users. `xud` encompasses the following components:

* Integration with [lnd](https://github.com/lightningnetwork/lnd) and [raiden](https://github.com/raiden-network/raiden) nodes.
* Decentralized order book to locally aggregate orders from the known network.
* Matching engine to match new local orders with existing local and remote orders and initiate atomic swaps with remote peers.
* Peer-to-peer networking with and discovery of other nodes.
* gRPC API with web proxy to serve other applications, also accessible via the command-line interface `xucli`.

## Install

This section contains instructions for installing `xud` manually, without treating setup of dependencies like `bitcoind` or `lnd`. It is mainly geared towards developers. For all other users, we recommend our streamlined setup via [docker](https://github.com/ExchangeUnion/xud/wiki/Docker).

If you already have [Node.js](https://nodejs.org/en/download/) (min 10.15.3) installed, you can install `xud` via npm by running

```bash
sudo npm install xud -g --unsafe-perm
```

Detailed instructions for installing `xud` can be found in the wiki on our [Installation](https://github.com/ExchangeUnion/xud/wiki/Installation) page.

## Usage

Launch `xud`:

```
./xud
2018-9-11 01:11:59 [GLOBAL] info: config loaded
2018-9-11 01:11:59 [GLOBAL] info: Local nodePubKey is 029a96c975d301c1c8787fcb4647b5be65a3b8d8a70153ff72e3eac73759e5e345
2018-9-11 01:11:59 [DB] info: connected to database. host:localhost port:3306 database:xud
2018-9-11 01:11:59 [P2P] info: p2p server listening on 0.0.0.0:8885
2018-9-11 01:11:59 [RPC] info: gRPC server listening on localhost:8886
```

Open a new terminal and issue commands to `xud` with the `xucli` command line tool. To see a list of available commands, run:

```
./xucli --help
```

You can find more information on how to use `xud` in the wiki at [Running xud](https://github.com/ExchangeUnion/xud/wiki/Running-xud) and [Command Line Interface](https://github.com/ExchangeUnion/xud/wiki/Command-Line-Interface).

Note: If you installed `xud` globally via npm, you can run `xud` and `xucli` from anywhere. Otherwise you must run them from the `bin` folder.

## Documentation

Read the `xud` API documentation [here](http://api.exchangeunion.com) and code documentation [here](http://typedoc.exchangeunion.com/).

## License

All files in this repository are licensed under the [GNU Affero General Public License v3.0](LICENSE) unless explicitly stated otherwise in the header of a given file.

## Discussion

Comments, questions, and any development-related discussions are welcome in our [Discord chat](https://discord.gg/YgDhMSn)!