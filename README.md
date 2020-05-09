# Exchange Union Daemon

[![Discord](https://img.shields.io/discord/547402601885466658.svg)](https://discord.gg/YgDhMSn)
[![Build Status](https://travis-ci.org/ExchangeUnion/xud.svg?branch=master)](https://travis-ci.org/ExchangeUnion/xud)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/87238907485845eb879bd61c65561775)](https://www.codacy.com/app/sangaman/xud?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ExchangeUnion/xud&amp;utm_campaign=Badge_Grade)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)


![xud logo](logo.png)

The Exchange Union Daemon ([`xud`](https://github.com/ExchangeUnion/xud)) is the reference implementation powering [OpenDEX](https://opendex.network), a decentralized exchange built on top of the [Lightning](https://lightning.network/) and [Connext](https://connext.network/) network. `xud` brings individual traders, market makers and exchanges onto OpenDEX to form a single global trading network and liquidity pool.

Get started trading 👉 [here](https://docs.exchangeunion.com/start-trading/user-guide) 👈

## OpenDEX Network Specification Compliance
`xud` implements the [OpenDEX protocol](https://opendex.network) and fully conforms to its so-called [BOLD](https://opendex.network/read/bold-00) specifications. BOLD stands for:
Basis of L3 DEX. The naming is intentionally derived from [BOLT](https://github.com/lightningnetwork/lightning-rfc), the Lightning Network specifications and role model of OpenDEX. The specifications are currently being drafted by several implementers based around the world, including the developers of `xud`. The BOLDs, as well as `xud`s implementation of it is still a work-in-progress. The current status of `xud`'s BOLD compliance is:
  - [X] [BOLD #1: Message Format](https://opendex.network/read/01-message-format)
  - [X] [BOLD #2: Peer Protocol](https://opendex.network/read/02-peer-protocol)
  - [X] [BOLD #3: Trade Protocol](https://opendex.network/read/03-trade-protocol)
  - [X] [BOLD #4: Swap Protocol](https://opendex.network/read/04-swap-protocol)

`xud` encompasses the following components:

* Integration with [lnd](https://github.com/lightningnetwork/lnd) and [connext](https://github.com/connext/rest-api-client) clients.
* Decentralized order book to locally aggregate orders from the known network.
* Matching engine to match new local orders with existing local and remote orders and initiate atomic swaps with remote peers.
* Peer-to-peer networking with and discovery of other nodes.
* [gRPC API](https://grpc.io/) with web proxy to serve other applications, also accessible via the command-line interface `xucli`.

## Documentation

The daemon has been designed to be as developer friendly as possible in order to facilitate application development on top of `xud`.
* [docs.exchangeunion.com](https://docs.exchangeunion.com): the starting point and up-to-date collection of guides, links and examples
* [api.exchangeunion.com](https://api.exchangeunion.com): The automatically generated gRPC API documentation
* [typedoc.exchangeunion.com](https://typedoc.exchangeunion.com/): The automatically generated code documentation

## Installation

This section contains brief instructions for installing `xud` manually, without treating setup of dependencies like `bitcoind` or `lnd`. It is mainly geared towards developers. For all other users, we recommend our streamlined [xud-docker](https://docs.exchangeunion.com/start-trading) setup.

If you already have [Node.js](https://nodejs.org/en/download/) installed, you can install `xud` via npm by running

```bash
sudo npm install xud -g --unsafe-perm
```

We officially support the current Node.js LTS only, since it often takes time for the latest version to be supported by the gRPC library. Detailed instructions for installing `xud` can be found in the [installation](https://docs.exchangeunion.com/development/native-installation) &  [developer docs](https://docs.exchangeunion.com/development).

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

You can find more information on how to use & configure `xud` in the [docs for developers](https://docs.exchangeunion.com/development).

Note: If you installed `xud` globally via npm, you can run `xud` and `xucli` from anywhere. Otherwise you must run them from the `bin` folder.

## License

All files in this repository are licensed under the [GNU Affero General Public License v3.0](LICENSE) unless explicitly stated otherwise in the header of a given file.

## Discussion

Comments, questions, and any development-related discussions are welcome in our [Discord chat](https://discord.gg/YgDhMSn)!
