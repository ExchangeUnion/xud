# Connext

## Installing Connext node for local development
```bash
git clone https://github.com/ConnextProject/indra.git
cd indra
make
```
### Running Connext node
```bash
make start
```

For logs
```bash
bash ops/logs.sh node
```

## Installing Connext REST API client
```bash
git clone https://github.com/ConnextProject/rest-api-client
cd rest-api-client
npm install
```

### Running Connext REST API client
Create environment variables file and point to the Etheruem and Connext node

```bash
CONNEXT_ETH_PROVIDER_URL="http://0.0.0.0:8545"
CONNEXT_NODE_URL="http://0.0.0.0:8080"
```

Then run the REST API server
```bash
npm run start
```

## Add Connext to xud.conf
```bash
[connext]
disable = false
host = "localhost"
port = 5040
```

## Add ETH currency
```bash
./bin/xucli addcurrency ETH Connext 18 --token_address="0x0000000000000000000000000000000000000000"
```
A restart of xud is currently required for it to show up under `xucli getbalance` call.

Optionally, in regtest environment you can also add a test ERC20 token TOK:
`./bin/xucli addcurrency TOK Connext 18 --token_address="0xEcFcaB0A285d3380E488A39B4BB21e777f8A4EaC"`

## Fund the Connext client address
Get the Connext address from the output of `./bin/xucli getinfo`

Initialize MetaMask wallet with seed `candy maple cake sugar pudding cream honey rich smooth crumble sweet treat` - this is the root treasury account for local development network/chain: `http://localhost:8545`.

After making a transfer your funds should be visible as wallet balance in the output of `./bin/xucli getbalance`.

## Open a payment channel between the node and client
`./bin/xucli openchannel Connext ETH 1`

Optionally, in regtest environment, add a channel for TOK:
`./bin/xucli openchannel Connext TOK 1`

Your funds should now be visiable as channel balance in the output of `./bin/xucli getbalance`.

## Add trading pair
`./bin/xucli addpair ETH BTC`.

A restart of xud is currently required for the trading pair to be swappable.

At this point you should be able to perform ETHBTC swaps.

Optionally, in regtest environment, you can also add a test ERC20 token TOK pair:
`./bin/xucli addpair TOK BTC`
