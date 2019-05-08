# xud-simulation

xud network simulation framework and integration tests.

## Installation & Usage

This project uses [go modules](https://github.com/golang/go/wiki/Modules) 
    to manage dependencies.
    
Requirements:

* Golang version >= 1.12
* Git

Installation & Usage:

```bash
$ GO111MODULE=on go test -v
````

## Network Scenarios Tests
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
