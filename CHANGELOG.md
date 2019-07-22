# [1.0.0-testnet.1](https://github.com/ExchangeUnion/xud/compare/v1.0.0-alpha.11...v1.0.0-testnet.1) (2019-07-18)


### Bug Fixes

* **cli:** quantity rounding ([7e5daec](https://github.com/ExchangeUnion/xud/commit/7e5daec)), closes [#1015](https://github.com/ExchangeUnion/xud/issues/1015)
* **lnd:** add jstype to channel ids ([d0a2106](https://github.com/ExchangeUnion/xud/commit/d0a2106))
* **lndclient:** set status disabled when disabled ([2cff6f0](https://github.com/ExchangeUnion/xud/commit/2cff6f0))
* **lndclient:** unknown service lnrpc.Lightning ([9cb0d55](https://github.com/ExchangeUnion/xud/commit/9cb0d55)), closes [#1039](https://github.com/ExchangeUnion/xud/issues/1039)
* **orderbook:** nosanitycheck enabled order exchange ([7a46df8](https://github.com/ExchangeUnion/xud/commit/7a46df8))
* **orderbook:** rename SwapClients to SwapClient ([a01a261](https://github.com/ExchangeUnion/xud/commit/a01a261))
* **orderbook:** show aggregated quantity ([55538ce](https://github.com/ExchangeUnion/xud/commit/55538ce))
* **p2p:** NodeStateUpdatePacket process crash ([3c462ba](https://github.com/ExchangeUnion/xud/commit/3c462ba))
* **p2p:** prevent writing to closed socket ([9c0eed3](https://github.com/ExchangeUnion/xud/commit/9c0eed3))
* blockheight prop of `undefined` in GetInfo ([eedb4c2](https://github.com/ExchangeUnion/xud/commit/eedb4c2)), closes [#1011](https://github.com/ExchangeUnion/xud/issues/1011)
* calculate swap amount for market orders ([2399549](https://github.com/ExchangeUnion/xud/commit/2399549)), closes [#978](https://github.com/ExchangeUnion/xud/issues/978)
* clean shutdown ([28dfae9](https://github.com/ExchangeUnion/xud/commit/28dfae9))
* deprecation warnings from crypto dependency ([c28454e](https://github.com/ExchangeUnion/xud/commit/c28454e))
* load raiden token addresses from db ([d011c80](https://github.com/ExchangeUnion/xud/commit/d011c80))
* re-add http resolver listen ([af2bdae](https://github.com/ExchangeUnion/xud/commit/af2bdae))
* **tests:** make testNetworkInit wait for synced chains ([b5c5c5c](https://github.com/ExchangeUnion/xud/commit/b5c5c5c))
* round unitsToAmount conversion result ([8025e27](https://github.com/ExchangeUnion/xud/commit/8025e27)), closes [#1097](https://github.com/ExchangeUnion/xud/issues/1097)
* **p2p:** use forEach instead of an iterator with pb kvpArray ([9edb320](https://github.com/ExchangeUnion/xud/commit/9edb320))
* **p2p:** various reconnection issues ([3805b4e](https://github.com/ExchangeUnion/xud/commit/3805b4e))
* **raiden:** add getRoutes and getHeight compatibility ([39d1eb2](https://github.com/ExchangeUnion/xud/commit/39d1eb2))
* **raiden:** cleanup reconnectTimer on shutdown ([830efcc](https://github.com/ExchangeUnion/xud/commit/830efcc))
* **raiden:** getRoutes amount comparison ([eb25249](https://github.com/ExchangeUnion/xud/commit/eb25249))
* **raiden:** isDisabled mechanics ([7be460b](https://github.com/ExchangeUnion/xud/commit/7be460b))
* **raiden:** outbound capacity check ([eadc411](https://github.com/ExchangeUnion/xud/commit/eadc411))
* **raiden:** sendPayment secret response ([d01d0a4](https://github.com/ExchangeUnion/xud/commit/d01d0a4))
* **swapclients:** check capacity up front ([1fed617](https://github.com/ExchangeUnion/xud/commit/1fed617)), closes [#900](https://github.com/ExchangeUnion/xud/issues/900)
* **swaps:** add hardcoded support for DAI ([b68d88c](https://github.com/ExchangeUnion/xud/commit/b68d88c))
* **swaps:** don't retry verified currency sanity ([b8bb45a](https://github.com/ExchangeUnion/xud/commit/b8bb45a)), closes [#946](https://github.com/ExchangeUnion/xud/issues/946)
* **swaps:** ensure correct takerCltvDelta and makerCltvDelta usage ([5dc728b](https://github.com/ExchangeUnion/xud/commit/5dc728b))
* swap client initialization ([30907b0](https://github.com/ExchangeUnion/xud/commit/30907b0))
* **swaps:** prepend 0x to Raiden's sanity swap rHash ([a2de310](https://github.com/ExchangeUnion/xud/commit/a2de310))
* **swaps:** prevent SwapFailurePacket crash ([cbc1a48](https://github.com/ExchangeUnion/xud/commit/cbc1a48))
* **swaps:** remove stalled sanity swap invoice ([ca82c15](https://github.com/ExchangeUnion/xud/commit/ca82c15)), closes [#964](https://github.com/ExchangeUnion/xud/issues/964)
* swap sent/received amounts in satoshis ([2aa4ede](https://github.com/ExchangeUnion/xud/commit/2aa4ede)), closes [#1063](https://github.com/ExchangeUnion/xud/issues/1063)
* switch swap capacity check currency ([ea47b91](https://github.com/ExchangeUnion/xud/commit/ea47b91)), closes [#932](https://github.com/ExchangeUnion/xud/issues/932)
* testnet seed node pubkey update ([2e6c674](https://github.com/ExchangeUnion/xud/commit/2e6c674))
* use integer satoshi quantities ([3d12ada](https://github.com/ExchangeUnion/xud/commit/3d12ada)), closes [#740](https://github.com/ExchangeUnion/xud/issues/740)


### Features

* **cli:** add orderbook command ([e13aec3](https://github.com/ExchangeUnion/xud/commit/e13aec3))
* **cli:** enhance output of listpairs ([#925](https://github.com/ExchangeUnion/xud/issues/925)) ([6852ea2](https://github.com/ExchangeUnion/xud/commit/6852ea2))
* **cli:** formatted channelbalance output ([7618b4c](https://github.com/ExchangeUnion/xud/commit/7618b4c))
* discover nodes from a specific peer ([#920](https://github.com/ExchangeUnion/xud/issues/920)) ([1caa2a7](https://github.com/ExchangeUnion/xud/commit/1caa2a7))
* **client:** add maximum outbound capacity checks to baseclient ([0c698a1](https://github.com/ExchangeUnion/xud/commit/0c698a1))
* **lnd:** use lnd 0.6.1 w/ hold invoices ([35ae4f6](https://github.com/ExchangeUnion/xud/commit/35ae4f6)), closes [#798](https://github.com/ExchangeUnion/xud/issues/798)
* **logger:** add more detailed swaps logging ([4846d4b](https://github.com/ExchangeUnion/xud/commit/4846d4b))
* **logger:** optional subcontext ([f894a7c](https://github.com/ExchangeUnion/xud/commit/f894a7c))
* **orderbook:** add sanity checks to placeOrder ([315023c](https://github.com/ExchangeUnion/xud/commit/315023c))
* **orderbook:** order quantity threshold ([0464b3c](https://github.com/ExchangeUnion/xud/commit/0464b3c))
* **orderbook:** require token address for Raiden currencies ([033331c](https://github.com/ExchangeUnion/xud/commit/033331c))
* **raiden:** add sendPayment support ([e07f606](https://github.com/ExchangeUnion/xud/commit/e07f606))
* **raiden:** channel balance by currency ([a488fa7](https://github.com/ExchangeUnion/xud/commit/a488fa7)), closes [#1051](https://github.com/ExchangeUnion/xud/issues/1051)
* **raiden:** check direct channel before swap ([a87e903](https://github.com/ExchangeUnion/xud/commit/a87e903)), closes [#1027](https://github.com/ExchangeUnion/xud/issues/1027)
* **raiden:** detect raiden address change ([3db6ec2](https://github.com/ExchangeUnion/xud/commit/3db6ec2))
* **raiden:** log error message for 409 responses ([c8be4d0](https://github.com/ExchangeUnion/xud/commit/c8be4d0)), closes [#957](https://github.com/ExchangeUnion/xud/issues/957)
* **raiden:** pass secret hash to raiden ([963abcc](https://github.com/ExchangeUnion/xud/commit/963abcc))
* **raiden:** remove 0x from RaidenResolveRequest ([0529516](https://github.com/ExchangeUnion/xud/commit/0529516))
* **raiden-resolver:** add configuration option for listening interface ([46b1048](https://github.com/ExchangeUnion/xud/commit/46b1048))
* **rpc:** add limit to ListOrders call ([#820](https://github.com/ExchangeUnion/xud/issues/820)) ([1b78331](https://github.com/ExchangeUnion/xud/commit/1b78331)), closes [#748](https://github.com/ExchangeUnion/xud/issues/748)
* **rpc:** add raidenAddress to ListPeers response ([e6f6f6d](https://github.com/ExchangeUnion/xud/commit/e6f6f6d))
* **rpc:** add SubscribeSwapFailures rpc call ([722b420](https://github.com/ExchangeUnion/xud/commit/722b420)), closes [#817](https://github.com/ExchangeUnion/xud/issues/817)
* **rpc:** removed own orders in SubscribeOrders ([ce68965](https://github.com/ExchangeUnion/xud/commit/ce68965))
* http endpoint for raiden hash resolver ([3d1f4de](https://github.com/ExchangeUnion/xud/commit/3d1f4de)), closes [#931](https://github.com/ExchangeUnion/xud/issues/931)
* **seedutil:** generate eth keystore from aezeed mnemonic ([cdca98a](https://github.com/ExchangeUnion/xud/commit/cdca98a))
* add sanity swap checks after handshake ([b138afe](https://github.com/ExchangeUnion/xud/commit/b138afe)), closes [#676](https://github.com/ExchangeUnion/xud/issues/676)
* add testnet seed node ([#1085](https://github.com/ExchangeUnion/xud/issues/1085)) ([beb238d](https://github.com/ExchangeUnion/xud/commit/beb238d)), closes [#1061](https://github.com/ExchangeUnion/xud/issues/1061)
* **service:** add open channel support ([dab84af](https://github.com/ExchangeUnion/xud/commit/dab84af))
* **swaps:** get peer identifier for swaps ([fd8c17f](https://github.com/ExchangeUnion/xud/commit/fd8c17f))
* **swaps:** prevent raiden from being first leg ([7c76a3d](https://github.com/ExchangeUnion/xud/commit/7c76a3d))
* **swaps:** use configurable amount of subunits per currency ([ed79480](https://github.com/ExchangeUnion/xud/commit/ed79480))
* token identifiers for currencies ([98be295](https://github.com/ExchangeUnion/xud/commit/98be295)), closes [#910](https://github.com/ExchangeUnion/xud/issues/910)
* XU networks support ([#827](https://github.com/ExchangeUnion/xud/issues/827)) ([a5a06e1](https://github.com/ExchangeUnion/xud/commit/a5a06e1)), closes [#781](https://github.com/ExchangeUnion/xud/issues/781)
* xud master password ([6bfad02](https://github.com/ExchangeUnion/xud/commit/6bfad02)), closes [#912](https://github.com/ExchangeUnion/xud/issues/912)


### BREAKING CHANGES

* Changed p2p messaging structure for `SessionInit`
and `NodeStateUpdate` packets.
* New SanitySwapPacket.
* Database and p2p field type changes
* nodes database table & separate databases by network



# [1.0.0-alpha.11](https://github.com/ExchangeUnion/xud/compare/v1.0.0-alpha.10...v1.0.0-alpha.11) (2019-03-21)


### Bug Fixes

* **p2p:** fix connection timeout unhandled error ([d258551](https://github.com/ExchangeUnion/xud/commit/d258551))
* **p2p:** open peer before sending session ack ([2e6e1e8](https://github.com/ExchangeUnion/xud/commit/2e6e1e8)), closes [#839](https://github.com/ExchangeUnion/xud/issues/839)
* **p2p:** peer error logging ([67a632c](https://github.com/ExchangeUnion/xud/commit/67a632c))
* **packets:** correct order packet validation ([1329d37](https://github.com/ExchangeUnion/xud/commit/1329d37))
* **proto:** set price as double ([9869116](https://github.com/ExchangeUnion/xud/commit/9869116))


### Code Refactoring

* use generic lnd swap clients ([2de5c78](https://github.com/ExchangeUnion/xud/commit/2de5c78)), closes [#554](https://github.com/ExchangeUnion/xud/issues/554)


### Features

* **raiden:** add add minimum viable RaidenClient REST API integration ([5758c0c](https://github.com/ExchangeUnion/xud/commit/5758c0c))
* **rpc:** add failureReason to SwapFailure msg ([f2d9228](https://github.com/ExchangeUnion/xud/commit/f2d9228)), closes [#807](https://github.com/ExchangeUnion/xud/issues/807)
* **swaps:** handle taker getRoutes exceptions ([5c8c9dc](https://github.com/ExchangeUnion/xud/commit/5c8c9dc))


### Performance Improvements

* **p2p:** use async randomBytes for packet framer ([4756711](https://github.com/ExchangeUnion/xud/commit/4756711))


### BREAKING CHANGES

* Changes p2p packet structures for packets that
communicate the node state.
* Changes the way lnd config options are passed in via
command line arguments.



# [1.0.0-alpha.10](https://github.com/ExchangeUnion/xud/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2019-03-05)


### Bug Fixes

* **p2p:** handle multiple peer reputation events ([773c66e](https://github.com/ExchangeUnion/xud/commit/773c66e))
* **p2p:** toggle opened after handshake ([914b4f3](https://github.com/ExchangeUnion/xud/commit/914b4f3))


### Features

* **rpc:** add failed swaps to PlaceOrderSync ([ab6bc55](https://github.com/ExchangeUnion/xud/commit/ab6bc55)), closes [#807](https://github.com/ExchangeUnion/xud/issues/807)



# [1.0.0-alpha.9](https://github.com/ExchangeUnion/xud/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2019-02-22)


### Bug Fixes

* **orderbook:** remove entire order correctly ([eec8f48](https://github.com/ExchangeUnion/xud/commit/eec8f48)), closes [#804](https://github.com/ExchangeUnion/xud/issues/804)
* **p2p:** restore dropped pair logic ([907ee16](https://github.com/ExchangeUnion/xud/commit/907ee16)), closes [#756](https://github.com/ExchangeUnion/xud/issues/756)


### Features

* use SubscribeInvoices to monitor lnd ([#762](https://github.com/ExchangeUnion/xud/issues/762)) ([0646d6b](https://github.com/ExchangeUnion/xud/commit/0646d6b)), closes [#573](https://github.com/ExchangeUnion/xud/issues/573)
* **swaps:** define behavior for swap errors ([1641a32](https://github.com/ExchangeUnion/xud/commit/1641a32)), closes [#661](https://github.com/ExchangeUnion/xud/issues/661)


# [1.0.0-alpha.8](https://github.com/ExchangeUnion/xud/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2019-02-06)


### Bug Fixes

* **orderbook/db:** upsert orders ([0030687](https://github.com/ExchangeUnion/xud/commit/0030687))


### Features

* **orderbook:** partial order removal ([bc3913b](https://github.com/ExchangeUnion/xud/commit/bc3913b)), closes [#714](https://github.com/ExchangeUnion/xud/issues/714)


### Performance Improvements

* **swaps/orderbook:** placeOrder parallel swaps ([1bf7ce5](https://github.com/ExchangeUnion/xud/commit/1bf7ce5)), closes [#654](https://github.com/ExchangeUnion/xud/issues/654)



# [1.0.0-alpha.7](https://github.com/ExchangeUnion/xud/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2019-01-23)


### Bug Fixes

* **rpc:** subscribeorders http endpoints ([ce5a89a](https://github.com/ExchangeUnion/xud/commit/ce5a89a))
* **swaps:** ignore swap failed for inactive swaps ([e89f936](https://github.com/ExchangeUnion/xud/commit/e89f936))


### Features

* add configurable logger date formatting ([ee66a6c](https://github.com/ExchangeUnion/xud/commit/ee66a6c)), closes [#686](https://github.com/ExchangeUnion/xud/issues/686) [#686](https://github.com/ExchangeUnion/xud/issues/686)
* **cli:** improved streamorders ([#780](https://github.com/ExchangeUnion/xud/issues/780)) ([6084043](https://github.com/ExchangeUnion/xud/commit/6084043)), closes [#687](https://github.com/ExchangeUnion/xud/issues/687)
* parse uri without port ([db91489](https://github.com/ExchangeUnion/xud/commit/db91489))
* **p2p:** encryption & authentication ([#756](https://github.com/ExchangeUnion/xud/issues/756)) ([067378f](https://github.com/ExchangeUnion/xud/commit/067378f))
* **p2p:** revoke connection retries ([#750](https://github.com/ExchangeUnion/xud/issues/750)) ([f56bcc3](https://github.com/ExchangeUnion/xud/commit/f56bcc3))
* **p2p:** sending GET_NODES periodically ([#770](https://github.com/ExchangeUnion/xud/issues/770)) ([57c48de](https://github.com/ExchangeUnion/xud/commit/57c48de)), closes [#402](https://github.com/ExchangeUnion/xud/issues/402) [#402](https://github.com/ExchangeUnion/xud/issues/402)
* **p2p:** verify version compatibility ([59aa8ff](https://github.com/ExchangeUnion/xud/commit/59aa8ff)), closes [#154](https://github.com/ExchangeUnion/xud/issues/154) [#154](https://github.com/ExchangeUnion/xud/issues/154)
* **rpc:** failed swaps for PlaceOrder ([6c9c2a6](https://github.com/ExchangeUnion/xud/commit/6c9c2a6)), closes [#609](https://github.com/ExchangeUnion/xud/issues/609) [#734](https://github.com/ExchangeUnion/xud/issues/734)
* **rpc:** optionally subscribe to taker swaps ([6bbfd89](https://github.com/ExchangeUnion/xud/commit/6bbfd89)), closes [#688](https://github.com/ExchangeUnion/xud/issues/688)
* **swaps:** timeout stalled swaps ([a463056](https://github.com/ExchangeUnion/xud/commit/a463056)), closes [#653](https://github.com/ExchangeUnion/xud/issues/653)



# [1.0.0-alpha.6](https://github.com/ExchangeUnion/xud/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2018-12-28)


### Bug Fixes

* **cli:** use correct args for executeswap ([038c6a9](https://github.com/ExchangeUnion/xud/commit/038c6a9))
* **orderbook:** persist trade before remove order ([9ce892a](https://github.com/ExchangeUnion/xud/commit/9ce892a))
* **orderbook:** use pairs keys iterable ([3e26753](https://github.com/ExchangeUnion/xud/commit/3e26753)), closes [#766](https://github.com/ExchangeUnion/xud/issues/766)
* **p2p:** check before emitting open event ([f4f8dab](https://github.com/ExchangeUnion/xud/commit/f4f8dab))
* **p2p:** don't send empty GetOrders packet ([fbacd8b](https://github.com/ExchangeUnion/xud/commit/fbacd8b))
* **p2p:** hash order invalidations correctly ([d876e8b](https://github.com/ExchangeUnion/xud/commit/d876e8b)), closes [#767](https://github.com/ExchangeUnion/xud/issues/767)
* **p2p:** hash outgoing orders correctly ([d5b7408](https://github.com/ExchangeUnion/xud/commit/d5b7408)), closes [#758](https://github.com/ExchangeUnion/xud/issues/758)
* **p2p:** order invalidation packet ([#774](https://github.com/ExchangeUnion/xud/issues/774)) ([962124f](https://github.com/ExchangeUnion/xud/commit/962124f)), closes [#756](https://github.com/ExchangeUnion/xud/issues/756)
* **p2p:** terminate inbound peers on shutdown ([b9f312a](https://github.com/ExchangeUnion/xud/commit/b9f312a))
* **proto:** use 64 bit chan_id ints as strings ([5a9a518](https://github.com/ExchangeUnion/xud/commit/5a9a518)), closes [agreatfool/grpc_tools_node_protoc_ts#10](https://github.com/agreatfool/grpc_tools_node_protoc_ts/issues/10) [#745](https://github.com/ExchangeUnion/xud/issues/745)
* **rpc/p2p:** unban functionality ([#731](https://github.com/ExchangeUnion/xud/issues/731)) ([e5083e5](https://github.com/ExchangeUnion/xud/commit/e5083e5))
* **swap:** allow one extrac block to be created during swap ([0a4d149](https://github.com/ExchangeUnion/xud/commit/0a4d149))
* **swap:** Avoid fraction in cltvDelta ([08bf957](https://github.com/ExchangeUnion/xud/commit/08bf957))
* **swaps:** release order hold on sendpayment err ([9322a06](https://github.com/ExchangeUnion/xud/commit/9322a06))


### Code Refactoring

* **swaps:** rename errorReason swap field ([732a6d0](https://github.com/ExchangeUnion/xud/commit/732a6d0))


### Features

* **cli:** stream existing orders by default ([#730](https://github.com/ExchangeUnion/xud/issues/730)) ([a40b330](https://github.com/ExchangeUnion/xud/commit/a40b330))
* **db:** add rHash to trade ([0c30c89](https://github.com/ExchangeUnion/xud/commit/0c30c89))
* **db/orderbook:** persist trades from swaps ([4a2547e](https://github.com/ExchangeUnion/xud/commit/4a2547e)), closes [#608](https://github.com/ExchangeUnion/xud/issues/608)
* **orderbook:** add assertions to removeOrder ([9350a27](https://github.com/ExchangeUnion/xud/commit/9350a27))
* **p2p:** improve logging for p2p messaging ([32e3263](https://github.com/ExchangeUnion/xud/commit/32e3263))
* grpc server logging ([#736](https://github.com/ExchangeUnion/xud/issues/736)) ([d538757](https://github.com/ExchangeUnion/xud/commit/d538757))
* **p2p:** protobuf serialization/validation ([#712](https://github.com/ExchangeUnion/xud/issues/712)) ([5a030bd](https://github.com/ExchangeUnion/xud/commit/5a030bd))
* **p2p:** verify data integrity ([#751](https://github.com/ExchangeUnion/xud/issues/751)) ([3ff06b1](https://github.com/ExchangeUnion/xud/commit/3ff06b1))
* **p2p/db:** add failureReason field for swaps ([9cd0f4f](https://github.com/ExchangeUnion/xud/commit/9cd0f4f))
* **p2p/orderbook:** drop orders for dropped pairs ([f9a40c2](https://github.com/ExchangeUnion/xud/commit/f9a40c2)), closes [#599](https://github.com/ExchangeUnion/xud/issues/599)
* **rpc:** remove peerpubkey from executeswap cli ([40e0d44](https://github.com/ExchangeUnion/xud/commit/40e0d44)), closes [#694](https://github.com/ExchangeUnion/xud/issues/694)
* **rpc/orderbook:** handle remove order with hold ([afe2fe3](https://github.com/ExchangeUnion/xud/commit/afe2fe3)), closes [#552](https://github.com/ExchangeUnion/xud/issues/552)
* **swaps:** comprehensive SwapFailureReason ([2f3dcf5](https://github.com/ExchangeUnion/xud/commit/2f3dcf5)), closes [#671](https://github.com/ExchangeUnion/xud/issues/671)


### BREAKING CHANGES

* **p2p/db:** New `failureReason` p2p packet and database field.
* **swaps:** Renames `errorReason` field in database.



# [1.0.0-alpha.5](https://github.com/ExchangeUnion/xud/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2018-12-04)


### Bug Fixes

* **lnd:** don't default lnd clients as disabled ([3030b9c](https://github.com/ExchangeUnion/xud/commit/3030b9c)), closes [#672](https://github.com/ExchangeUnion/xud/issues/672)
* **p2p:** cancel retry connection timer ([28a06a4](https://github.com/ExchangeUnion/xud/commit/28a06a4))
* **rpc:** close streaming calls on shutdown ([84cfe8a](https://github.com/ExchangeUnion/xud/commit/84cfe8a)), closes [#699](https://github.com/ExchangeUnion/xud/issues/699)


### Features

* **db:** set null price for market orders ([b0b9797](https://github.com/ExchangeUnion/xud/commit/b0b9797))
* **orderbook:** don’t match with quantity on hold ([#697](https://github.com/ExchangeUnion/xud/issues/697)) ([2444ab9](https://github.com/ExchangeUnion/xud/commit/2444ab9))
* graceful shutdown on SIGINT ([3bc22d8](https://github.com/ExchangeUnion/xud/commit/3bc22d8))
* **orderbook/swaps:** accept partial swaps ([d73da4c](https://github.com/ExchangeUnion/xud/commit/d73da4c)), closes [#550](https://github.com/ExchangeUnion/xud/issues/550)
* **p2p:** reconnect to peer after disconnection ([#695](https://github.com/ExchangeUnion/xud/issues/695)) ([56fa2b4](https://github.com/ExchangeUnion/xud/commit/56fa2b4)), closes [#616](https://github.com/ExchangeUnion/xud/issues/616) [#698](https://github.com/ExchangeUnion/xud/issues/698)
* **rpc:** add currencies to swap result ([86dfed4](https://github.com/ExchangeUnion/xud/commit/86dfed4)), closes [#670](https://github.com/ExchangeUnion/xud/issues/670)
* **rpc/orderbook:** stream existing orders ([#657](https://github.com/ExchangeUnion/xud/issues/657)) ([25c39ef](https://github.com/ExchangeUnion/xud/commit/25c39ef)), closes [#534](https://github.com/ExchangeUnion/xud/issues/534)


### Performance Improvements

* use async fs & crypto methods ([2431685](https://github.com/ExchangeUnion/xud/commit/2431685))



# [1.0.0-alpha.4](https://github.com/ExchangeUnion/xud/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2018-11-16)


### Features

* **cli:** format buy & sell output ([d958cd5](https://github.com/ExchangeUnion/xud/commit/d958cd5)), closes [#620](https://github.com/ExchangeUnion/xud/issues/620)
* **cli:** sort getorders output ([c1d6627](https://github.com/ExchangeUnion/xud/commit/c1d6627))
* **db:** join swapdeal to order & node ([ac12dcf](https://github.com/ExchangeUnion/xud/commit/ac12dcf))
* **db:** persist taker trades ([#659](https://github.com/ExchangeUnion/xud/issues/659)) ([54a9291](https://github.com/ExchangeUnion/xud/commit/54a9291))
* **orderbook:** log when orders are matched ([4778e62](https://github.com/ExchangeUnion/xud/commit/4778e62))
* **orderbook:** logging enhancements ([9742228](https://github.com/ExchangeUnion/xud/commit/9742228)), closes [#649](https://github.com/ExchangeUnion/xud/issues/649)
* **orderbook/swaps:** verify route before executing the swap ([a290a60](https://github.com/ExchangeUnion/xud/commit/a290a60))
* **p2p:** add reputation events for errors ([#634](https://github.com/ExchangeUnion/xud/issues/634)) ([8b1199f](https://github.com/ExchangeUnion/xud/commit/8b1199f)), closes [#566](https://github.com/ExchangeUnion/xud/issues/566)
* **p2p:** disconnecting packet ([#658](https://github.com/ExchangeUnion/xud/issues/658)) ([f59bdab](https://github.com/ExchangeUnion/xud/commit/f59bdab))
* **rpc:** add hold field to orders ([#645](https://github.com/ExchangeUnion/xud/issues/645)) ([27ec3c2](https://github.com/ExchangeUnion/xud/commit/27ec3c2))
* **swaps:** check if rHash exists ([#642](https://github.com/ExchangeUnion/xud/issues/642)) ([ef2beb2](https://github.com/ExchangeUnion/xud/commit/ef2beb2)), closes [#547](https://github.com/ExchangeUnion/xud/issues/547)
* **swaps:** recalculate partial swap amts ([#633](https://github.com/ExchangeUnion/xud/issues/633)) ([d1f1eef](https://github.com/ExchangeUnion/xud/commit/d1f1eef))


### Performance Improvements

* **orderbook:** streamline matching routine ([65c5f31](https://github.com/ExchangeUnion/xud/commit/65c5f31))



# [1.0.0-alpha.3](https://github.com/ExchangeUnion/xud/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2018-11-09)


### Code Refactoring

* **swaps:** renaming packets & properties ([6c89c53](https://github.com/ExchangeUnion/xud/commit/6c89c53))


### Features

* **cli:** add global --json option/arg ([558bfc8](https://github.com/ExchangeUnion/xud/commit/558bfc8))
* **cli:** extend cli callback with optional formatting cb ([843f683](https://github.com/ExchangeUnion/xud/commit/843f683))
* **cli:** show table as getorders output ([f11f9ff](https://github.com/ExchangeUnion/xud/commit/f11f9ff))
* **db:** add Order and Trade models ([1dc83e8](https://github.com/ExchangeUnion/xud/commit/1dc83e8)), closes [#621](https://github.com/ExchangeUnion/xud/issues/621)
* **db/orderbook:** persist swapped orders ([03a9e16](https://github.com/ExchangeUnion/xud/commit/03a9e16))
* **orderbook:** add initialQuantity to orders ([3f07a9c](https://github.com/ExchangeUnion/xud/commit/3f07a9c))
* **orderbook/swaps:** release order hold ([838b71e](https://github.com/ExchangeUnion/xud/commit/838b71e)), closes [#549](https://github.com/ExchangeUnion/xud/issues/549)
* **rpc:** add UNAVAILABLE grpc error status code ([#632](https://github.com/ExchangeUnion/xud/issues/632)) ([e9c4697](https://github.com/ExchangeUnion/xud/commit/e9c4697))
* **swaps:** calculate swap amounts locally ([4882144](https://github.com/ExchangeUnion/xud/commit/4882144)), closes [#615](https://github.com/ExchangeUnion/xud/issues/615)
* **swaps:** check that swap request is valid ([a1da3db](https://github.com/ExchangeUnion/xud/commit/a1da3db))


### BREAKING CHANGES

* **swaps:** Renames p2p packets and packet body properties.
* **db:** Adds models and restructures existing models, `xud` databases will need to be recreated.



<a name="1.0.0-alpha.2"></a>
# [1.0.0-alpha.2](https://github.com/ExchangeUnion/xud/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2018-11-01)


### Bug Fixes

* **lnd:** automatically retry if chain out of sync ([be3b7c9](https://github.com/ExchangeUnion/xud/commit/be3b7c9)), closes [#593](https://github.com/ExchangeUnion/xud/issues/593)
* **p2p:** connect to peers with lastAddress only ([da960d6](https://github.com/ExchangeUnion/xud/commit/da960d6)), closes [#606](https://github.com/ExchangeUnion/xud/issues/606)
* **p2p:** consistent checks before connecting ([2847614](https://github.com/ExchangeUnion/xud/commit/2847614))
* **p2p:** don't remove peer orders without pubkey ([#586](https://github.com/ExchangeUnion/xud/issues/586)) ([9597afe](https://github.com/ExchangeUnion/xud/commit/9597afe)), closes [#539](https://github.com/ExchangeUnion/xud/issues/539)
* **swaps:** correctly set taker & maker amounts ([2819c06](https://github.com/ExchangeUnion/xud/commit/2819c06)), closes [#604](https://github.com/ExchangeUnion/xud/issues/604)


### Features

* nomatching mode ([#594](https://github.com/ExchangeUnion/xud/issues/594)) ([6fd1e49](https://github.com/ExchangeUnion/xud/commit/6fd1e49)), closes [#145](https://github.com/ExchangeUnion/xud/issues/145)
* **p2p:** track banned nodes ([#583](https://github.com/ExchangeUnion/xud/issues/583)) ([c5ed5a6](https://github.com/ExchangeUnion/xud/commit/c5ed5a6)), closes [#565](https://github.com/ExchangeUnion/xud/issues/565)
* **p2p/orderbook:** update supported pairs ([1014cbd](https://github.com/ExchangeUnion/xud/commit/1014cbd))
* **rpc:** add GetNodeInfo call ([#570](https://github.com/ExchangeUnion/xud/issues/570)) ([1a038a2](https://github.com/ExchangeUnion/xud/commit/1a038a2)), closes [#529](https://github.com/ExchangeUnion/xud/issues/529)
* **swaps:** store swapdeals in database ([#569](https://github.com/ExchangeUnion/xud/pull/569)) ([9a7a629a](https://github.com/ExchangeUnion/xud/commit/9a7a629a9b2c9b8d28d035dc32543aed5e30be47)), closes [#562](https://github.com/ExchangeUnion/xud/issues/562)



