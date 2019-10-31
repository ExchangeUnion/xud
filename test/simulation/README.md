# Xud Simulation Tests

This test suite simulates real usage of `xud` and the second-layer payment channel network clients that it interacts with. It creates chains, generates blocks, and establishes payment channels. All commands to `xud` are issued via the gRPC API. This helps ensure that `xud` integrates with other nodes and software components properly and allows for more complete and realistic testing of `xud`.

## Install dependencies
The simulation tests are currently only tested and supported on Ubuntu 18.04, 19.04 & 19.10.

```
sudo apt-get install -y libz3-dev python3.7 python3.7-dev python3.7-venv python3-venv python3-dev jq libssl-dev net-tools git golang-1.12-go
```

Add go `golang-1.12-go` to PATH:
```
sudo ln -s /usr/lib/go-1.12/bin/go /usr/local/bin/go
```

## Usage
```
npm run test:sim
```

## Simulation Test Cases

Below is a list of implemented (checked) and planned (unchecked) test cases.

### Initialization

- [x] Verify connectivity to swap clients of all nodes.
- [x] Add currencies and pairs to all nodes.

### P2P

- [x] Discovery: Connect Alice to Bob, Bob to Carol, Dave to Carol. After a short while, all of them should end up connected.
- [x] Incorrect public key: Alice connects to Bob expecting an incorrect public key. Bob should reject the connection due to auth invalid target.
- [x] Banning: If Alice ban Bob, connection attempts from both directions should fail.
- [x] Unbanning: If Alice unban Bob, connection attempts from both directions should succeed.
- [x] Duplicate connection: If Alice and Bob are already connected, connection attempts from both directions should fail.

### Decentralized Order Book

- [x] Placed order should get broadcasted over the network, and added to connected peers' order books.
- [x] Removed order should get invalidated over the network, and removed from connected peers' order books.
- [ ] Placed order should get internal matches, and trigger order invalidation over the network.
- [ ] Peer disconnection should trigger orders removal to all his orders.

### Node State

- [ ] Removed pair or swap client (lnd/raiden) disconnected (after timeout elapsed) should trigger order removal for all the pair's orders, and removed from connected peers' order books.
- [ ] Updated `LND-BTC`/`LND-LTC` public keys should propagate over the network.

### Swaps

- [x] Placed order should trigger a swap.
- [ ] Placed order should trigger a swap and order invalidation on the maker order to all connected peers besides the taker peer.
- [x] Swaps that use multihop routes for payment on lnd.

## Adversarial Test Cases

Adversarial test cases pit a modified version of `xud` against a standard one to see how it deals with malicious and/or unexpected behavior from other nodes. These are intended to measure and improve the robustness of `xud` against attacks, faulty nodes or connections, and potential loss of funds.

### Swap partners go offline or become unresponsive

- [x] Taker becomes unresponsive after maker confirms quantity with a `SwapAcceptedPacket`.
- [ ] Maker becomes unresponsive after maker confirms quantity with a `SwapAcceptedPacket`.
- [ ] Taker becomes unresponsive after taker set up first HTLC to the maker.
- [x] Maker becomes unresponsive after taker set up first HTLC to the maker (to be fixed: <https://github.com/ExchangeUnion/xud/issues/1048>).
- [x] Taker becomes unresponsive after maker set up second HTLC to taker (before invoice is settled) (to be fixed: <https://github.com/ExchangeUnion/xud/issues/1049>).
- [ ] Maker becomes unresponsive after maker set up second HTLC to taker (before invoice is settled).
- [x] Taker becomes unresponsive after releasing the preimage (maker doesn't get `SwapCompletedPacket`).
- [ ] Maker becomes unresponsive after the taker released the preimage (maker doesn't get `SwapCompletedPacket`) (to be fixed: <https://github.com/ExchangeUnion/xud/issues/1050>).
- [ ] Taker becomes unresponsive after the maker released preimage for first payment.

### Swap partners close channels

- [ ] Taker force-closes/cooperatively closes channel after maker confirms quantity in `SwapAcceptedPacket`.
- [ ] Maker force-closes/cooperatively closes channel after maker confirms quantity in `SwapAcceptedPacket`.
- [ ] Taker force-closes/cooperatively closes channel after taker set up first HTLC to the maker.
- [ ] Maker force-closes/cooperatively closes channel after taker set up first HTLC to the maker.
- [ ] Taker force-closes/cooperatively closes channel after maker set up second HTLC to taker (before settling invoice).
- [ ] Maker force-closes/cooperatively closes channel after maker set up second HTLC to taker (before settling invoice).
- [ ] Taker force-closes/cooperatively closes channel after preimage release (maker doesn't get `SwapCompletedPacket`).
- [ ] Maker force-closes/cooperatively closes channel after preimage release (maker doesn't get `SwapCompletedPacket`).
- [ ] Taker force-closes/cooperatively closes channel after the maker released preimage for first payment.

### Change currency ticker/token address (after https://github.com/ExchangeUnion/xud/issues/910 is merged)

- [ ] Taker changes currency in p2p messages after maker confirms quantity in `SwapAcceptedPacket`.
- [ ] Taker changes currency (create htlc on different payment channel) after maker confirms quantity in `SwapAcceptedPacket`.
- [ ] Taker changes currency (create htlc on testnet payment channel of same currency) after maker confirms quantity in `SwapAcceptedPacket`.
- [ ] Maker changes currency in p2p messages after maker confirms quantity in `SwapAcceptedPacket`.
- [ ] Maker changes currency in p2p messages after taker set up first HTLC to the maker.
- [ ] Maker changes currency (create htlc on different payment channel) after taker set up first HTLC to the maker.
- [ ] Maker changes currency (create htlc on testnet payment channel of same currency) after taker set up first HTLC to the maker.
- [ ] Taker changes currency in p2p messages after taker set up first HTLC to the maker.
- [ ] Taker changes currency in p2p messages after maker set up second HTLC to the maker.
- [ ] Maker changes currency in p2p messages after maker set up second HTLC to the maker.
- [ ] Taker changes currency in p2p message after preimage release (in `SwapCompletedPacket`).

### Other potential categories of tests

- Send more or less for swap payments.
- Change amounts in p2p communication.
- Conflicting networks  (e.g. mainnet with simnet).
- Send/receive orders over channel/payment size limit.
- Shorten cltv delta and try to trick trading partner to accept it.
- Miscellaneous p2p message alteration.
- Change xud node key after successful connection on p2p layer.
