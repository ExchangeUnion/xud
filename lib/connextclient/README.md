# Getting Started

These instructions will guide you on setting up Connext compatible with development builds of XUD.

## Prerequisites

- Linux, preferably [Ubuntu 17.04 or greater](https://wiki.ubuntu.com/Releases).
- Node, preferably [13.7 or greater](https://nodejs.org/en/)
- _If installing Go Ethereum from source_ - [Go 1.7 or greater](https://golang.org/doc/install), preferably the latest version.

## Go Ethereum

### Installing Go Ethereum

Install the latest release of Go Ethereum according to the [official instructions](https://github.com/ethereum/go-ethereum/wiki/Installing-Geth).

### Running Go Ethereum

Start `geth` and allow it to sync with the Ropsten testnet.

```bash
geth --testnet --fast --rpc --rpcapi eth,net,web3 --bootnodes "enode://20c9ad97c081d63397d7b685a412227a40e23c8bdc6688c6f37e97cfbc22d2b4d1db1510d8f61e6a8866ad7f0e17c02b14182d37ea7c3c8b9c2683aeb6b733a1@52.169.14.227:30303,enode://6ce05930c72abc632c58e2e4324f7c7ea478cec0ed4fa2528982cf34483094e9cbc9216e7aa349691242576d552a2a56aaeae426c5303ded677ce455ba1acd9d@13.84.180.240:30303"
```

### Creating an Account

Attach to the `geth` console.

```bash
geth attach --datadir ~/.ethereum/testnet
```

From within the console, create an account.

```bash
personal.newAccount()
```

## Connext

### Installing Connext

Install v0.3.0 from source with a virtual python environment.

```bash
git clone https://github.com/ConnextProject/rest-api-client
cd rest-api-client
npm install
npm run start
```

### Running Connext

Create environment variables file and point to the Etheruem and Connext node

```bash
CONNEXT_ETH_PROVIDER_URL="INSERT_URL"
CONNEXT_NODE_URL="INSERT_URL"
```

Then run the REST API server

```bash
npm run start
```