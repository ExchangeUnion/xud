# Exchange Union

[![Gitter chat](https://img.shields.io/badge/chat-on%20gitter-rose.svg)](https://gitter.im/exchangeunion/Lobby)
[![Build Status](https://travis-ci.org/ExchangeUnion/xud.svg?branch=master)](https://travis-ci.org/ExchangeUnion/xud)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/87238907485845eb879bd61c65561775)](https://www.codacy.com/app/sangaman/xud?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ExchangeUnion/xud&amp;utm_campaign=Badge_Grade)

[Exchange Union](https://www.exchangeunion.com/) (XU) is a decentralized exchange layer built on the [Lightning](http://lightning.network/) and [Raiden](https://raiden.network/) networks to enable trustless and instant cryptocurrency swaps and order fulfillment between exchanges.

This repo contains the early stages of the Exchange Union Daemon ("xud") which encompasses the following components:

* Integration with [lnd](https://github.com/lightningnetwork/lnd) and [raiden](https://github.com/raiden-network/raiden) nodes.
* Order book data stored in a local mysql/mariadb database.
* Peer-to-peer networking with other XU nodes
* A gRPC API with web proxy to serve other applications, also accessible by command-line interface.

Contributions, feedback, and questions are welcome.

## Instructions for Developers

[Here](instructions-for-devs.md) (Manual setup).

## Instructions for Exchanges

[Here](instructions-for-exchanges.md) (Using Docker).


## Code Documentation

Read the [TypeDoc here](https://exchangeunion.github.io/xud-typedoc/).

## Questions?
[![Gitter chat](https://img.shields.io/badge/chat-on%20gitter-rose.svg)](https://gitter.im/exchangeunion/Lobby)
