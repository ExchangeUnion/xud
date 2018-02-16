# Exchange Union

[Exchange Union](https://www.exchangeunion.com/) (XU) is a decentralized exchange layer built on the [Lightning](http://lightning.network/) and [Raiden](https://raiden.network/) networks to enable trustless and instant cryptocurrency swaps and order fulfillment between exchanges.

This repo contains the early stages of an XU node implementation which will contain the following components:

* Integration with [lnd](https://github.com/lightningnetwork/lnd) and [raiden](https://github.com/raiden-network/raiden) nodes.
* Orderbook data stored in a local mysql/mariadb database.
* Peer-to-peer networking with other XU nodes via TCP.
* A JSON-RPC API to serve other applications and a command-line interface.

Contributions, feedback, and questions are welcome.
