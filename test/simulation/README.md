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
### Sanity
- [x] Verify connectivity to swap clients.
- [x] Initialize nodes with currencies and pairs.
- [x] Connect between two nodes.

### P2P
- [ ] Discovery: Connect Alice to Bob, Bob to Carol. Alice and Carol should end up connected to Alice as well.
- [ ] Wrong identity: Alice connects to Bob expecting a random public key. Bob should reject the connection due to auth invalid target.
- [ ] Banning: If Alice bans Bob, connection attempts from both directions should fail.
- [ ] Unbanning: If Alice unbanned Bob, connection attempts from both directions should succeed.
- [ ] Duplicate connection: If Alice and Bob are already connected, connection attempts from both directions should get blocked.

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
