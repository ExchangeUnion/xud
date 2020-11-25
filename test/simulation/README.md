# Xud Simulation Tests

This test suite simulates real usage of `xud` and the second-layer payment channel network clients that it interacts with. It creates chains, generates blocks, and establishes payment channels. All commands to `xud` are issued via the gRPC API. This helps ensure that `xud` integrates with other nodes and software components properly and allows for more complete and realistic testing of `xud`.

## Requirements:
- [docker](https://docs.docker.com/install/)
- [docker-compose](https://docs.docker.com/compose/install/)
- [node / npm](https://nodejs.org/en/download/), [build-essential](https://packages.ubuntu.com/focal/build-essential) and [python](https://www.python.org/downloads/) (needed for `xud` build and scripts)
- [jq](https://packages.ubuntu.com/focal/jq)

Successfully tested hw/sw stack:
- ubuntu `20.04` / `20.10`
- node `v14.15.1` (via nvm)
- npm `6.14.8` (via nvm)
- docker `19.03.13` & docker-compose `1.27.4` (via `apt install docker.io`)
- 25 GB disk size, 4 CPU, 16 GB memory
- Good internet connection

## General Usage

### Build images (if not available) and run all test suites

```bash
npm run test:sim
```

### Run test suites separately after building all images manually

```bash
npm run test:sim:build
npm run test:sim:run:integration
npm run test:sim:run:security
npm run test:sim:run:stability
```

### If you encounter issues, try

```bash
cd xud
npm run test:sim:clean
npm run test:sim:clean:indra
docker system prune -a
npm run test:sim
```

If you still have issues, try these commands before running above again:

```
rm -rf ./test/simulation/temp
docker swarm init
npm install -g typescript
```

## Specific Usage

### Specific image builds

When making changes to the simulation test code, one must build the `test` image before rerunning the tests:

```bash
npm run test:sim:build:test
npm run test:sim:run
```

When making changes to non-test `xud` code, one must build the `xud` image and clean its volume before rerunning the tests:

```bash
npm run test:sim:clean:xud
npm run test:sim:build:xud
npm run test:sim:run
```

When making changes to `lnd` version/tag, one must build the `lnd` image and clean its volume before rerunning the tests:

```bash
npm run test:sim:clean:lnd
npm run test:sim:build:lnd
npm run test:sim:run
```

### About `custom-xud`

`custom-xud` is a modified version of `xud` used to simulate different custom behaviours (adversarial or instability), which are used in the Security/Instability test suites.

The mechanism in which `custom-xud` is created is via the git patch file named `custom-xud.patch`.

To modify the patch, one should first apply it to the current working tree (it is advisable to stash or commit current changes before doing so):

```bash
npm run test:sim:custom-xud:apply
```

If the patch cannot be applied cleanly, it will create `.rej` files in the same directory as any files which were not able to be patched. You will need to go through and manually apply (or discard) the changes that could not be automatically applied.

To reverse the applied patch, and restore previous working tree state:

```bash
npm run test:sim:custom-xud:reverse
```

To override the patch with new changes from the current working tree:

```bash
npm run test:sim:custom-xud:patch
```

To run the tests with the modified patch, one must build the `xud` image and clean its `custom-xud` volume before rerunning the tests:

```bash
npm run test:sim:clean:custom-xud
npm run test:sim:build:xud
npm run test:sim:run
```

### Logs

Upon every test run, all of `xud` & `lnd` nodes logs are being directed to `temp/logs`.

For printing them unto console:

```bash
npm run test:sim:logs
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
- [x] Added trading pairs and currencies should trigger broadcast of active orders from connected peers' order books. 
- [ ] Placed order should get internal matches, and trigger order invalidation over the network.
- [ ] Peer disconnection should trigger orders removal to all his orders.

### Node State

- [ ] Removed pair or swap client (lnd/connext) disconnected (after timeout elapsed) should trigger order removal for all the pair's orders, and removed from connected peers' order books.
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
- [ ] Taker becomes unresponsive after the maker released preimage for first payment.

### Swap partners close channels

- [ ] Taker force-closes/cooperatively closes channel after maker confirms quantity in `SwapAcceptedPacket`.
- [ ] Maker force-closes/cooperatively closes channel after maker confirms quantity in `SwapAcceptedPacket`.
- [ ] Taker force-closes/cooperatively closes channel after taker set up first HTLC to the maker.
- [ ] Maker force-closes/cooperatively closes channel after taker set up first HTLC to the maker.
- [ ] Taker force-closes/cooperatively closes channel after maker set up second HTLC to taker (before settling invoice).
- [ ] Maker force-closes/cooperatively closes channel after maker set up second HTLC to taker (before settling invoice).
- [ ] Taker force-closes/cooperatively closes channel after the maker released preimage for first payment.

### Change currency ticker/token address (after [#910](https://github.com/ExchangeUnion/xud/issues/910) is merged)

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

### Other potential categories of tests

- Send more or less for swap payments.
- Change amounts in p2p communication.
- Conflicting networks  (e.g. mainnet with simnet).
- Send/receive orders over channel/payment size limit.
- Shorten cltv delta and try to trick trading partner to accept it.
- Miscellaneous p2p message alteration.
- Change xud node key after successful connection on p2p layer.
