# [1.0.0-beta.2](https://github.com/ExchangeUnion/xud/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-03-31)


### Bug Fixes

* **lnd:** don't check for manual unlock ([565b623](https://github.com/ExchangeUnion/xud/commit/565b6231aa8aa92903dd5474ceb61315eeb1ea40))
* **lnd:** exponential backoff for grpc client wait ([a17f73b](https://github.com/ExchangeUnion/xud/commit/a17f73ba19b4ac823866737256325f9a3de501bf)), closes [#1415](https://github.com/ExchangeUnion/xud/issues/1415)
* allow unlock with disconnected lnd ([659d70b](https://github.com/ExchangeUnion/xud/commit/659d70b9f7b527fbd639fc75cb15ef4c707a13f0))


### Features

* different gRPC & HTTP port depending on active network ([#1286](https://github.com/ExchangeUnion/xud/issues/1286)) ([347f814](https://github.com/ExchangeUnion/xud/commit/347f8148eb4a91086a5d11e852e04686fa5c6410))
* **rpc/cli:** node aliases ([#1362](https://github.com/ExchangeUnion/xud/issues/1362)) ([73e5665](https://github.com/ExchangeUnion/xud/commit/73e5665f922708618ceded99a5d591c0af2996a3))
* **swapclient:** add Locked status ([f7b35a1](https://github.com/ExchangeUnion/xud/commit/f7b35a16450f174504ead351bb380633bd21fd57)), closes [#1411](https://github.com/ExchangeUnion/xud/issues/1411)
* derive child seed from node key ([899c301](https://github.com/ExchangeUnion/xud/commit/899c301ca399db1d217982943c681b7987fd2f3c))



# [1.0.0-beta.1](https://github.com/ExchangeUnion/xud/compare/v1.0.0-beta...v1.0.0-beta.1) (2020-02-27)


### Bug Fixes

* **cli:** print UNAVAILABLE errors correctly ([f0c3e38](https://github.com/ExchangeUnion/xud/commit/f0c3e38312bb51d3661ffbb8b29d531a799cd101)), closes [#1371](https://github.com/ExchangeUnion/xud/issues/1371)
* **lnd:** auto unlock consistently ([9329d33](https://github.com/ExchangeUnion/xud/commit/9329d33c78e3660bb1eb3ffb4bdadc506c71e6df))
* **lnd:** prevent undefined error ([3ee94de](https://github.com/ExchangeUnion/xud/commit/3ee94de20ed61e9c5f61dc5240ca3aa3bc908e5b)), closes [#1367](https://github.com/ExchangeUnion/xud/issues/1367)
* **rpc/lnd:** lnd already unlocked ([f75a672](https://github.com/ExchangeUnion/xud/commit/f75a6726bfc0eebc17924c5eae6494f92ae60ae0))
* **swaps:** only query routes for connected swap clients ([5bd76f6](https://github.com/ExchangeUnion/xud/commit/5bd76f63de9f710123e34b43164c668d7b1b9065))


### Features

* **cli:** add price max precision checks for orders creation ([#1385](https://github.com/ExchangeUnion/xud/issues/1385)) ([c037f66](https://github.com/ExchangeUnion/xud/commit/c037f669f2e6e90f245035d3932de8fbf00a95aa))
* **cli:** better messages when unlock/create fail ([c124e76](https://github.com/ExchangeUnion/xud/commit/c124e76989dac9cc6bd5537c83ddbe391544498b)), closes [#1370](https://github.com/ExchangeUnion/xud/issues/1370)
* **config:** property type and value checking ([7c8590f](https://github.com/ExchangeUnion/xud/commit/7c8590f1261d74914120cb11c430b9c05abeb354)), closes [#1222](https://github.com/ExchangeUnion/xud/issues/1222)
* **p2p:** add tor config option ([f5e76f2](https://github.com/ExchangeUnion/xud/commit/f5e76f2cd202ad7a1c0deaa168c9d64b7f98b8fd))
* **peer:** add native tor support ([b2e3ac5](https://github.com/ExchangeUnion/xud/commit/b2e3ac5ad1c8787be83c3c752cfb49919bf1cd23))
* **rpc:** add owner parameter for listorders ([8b0704e](https://github.com/ExchangeUnion/xud/commit/8b0704edae388dd7ee9ec800ab436b7d8e9df3d4)), closes [#1323](https://github.com/ExchangeUnion/xud/issues/1323)
* disable raiden currencies w/out direct chan ([fbb9660](https://github.com/ExchangeUnion/xud/commit/fbb966023e8c82872719384679c9e71d7d46018c)), closes [#1027](https://github.com/ExchangeUnion/xud/issues/1027)
* **rpc:** wrong password error for unlock ([c9aa988](https://github.com/ExchangeUnion/xud/commit/c9aa988289748f72e2f56dd35ad36f885f53cdbf))
* **swaps:** track swap failure currency ([5c82992](https://github.com/ExchangeUnion/xud/commit/5c829929853c6c746751cb8036747973deed9cca))
* use seedutil to generate mnemonic ([e9e6736](https://github.com/ExchangeUnion/xud/commit/e9e67364b79bde5ab9490af7545236a7644d763e)), closes [#1253](https://github.com/ExchangeUnion/xud/issues/1253)


### Performance Improvements

* **rpc/orderbook:** listorders array concatenation ([0e7196c](https://github.com/ExchangeUnion/xud/commit/0e7196c6b9f9437db99067653f1269794f5bd8d4))



# [1.0.0-beta](https://github.com/ExchangeUnion/xud/compare/v1.0.0-mainnet...v1.0.0-beta) (2020-01-16)


### Bug Fixes

* **backup:** wait for lnd and resubscribe to channel backups ([3a33834](https://github.com/ExchangeUnion/xud/commit/3a3383499ef32f709c58fe0856d867f29a33918f))
* **lnd:** mark lnd as disconnected when channelbalance returns unimplemented ([87a9126](https://github.com/ExchangeUnion/xud/commit/87a91262baba1725c4f72d162e86d3c295722d37))
* **p2p:** handshake race conditions ([9b58a05](https://github.com/ExchangeUnion/xud/commit/9b58a050639e011f0de1c5c495b027c53dbfd0a9)), closes [#1309](https://github.com/ExchangeUnion/xud/issues/1309)
* **p2p:** remove error event from Peer ([8927a09](https://github.com/ExchangeUnion/xud/commit/8927a09aadbfaa8fa726d0a33602f0422675286c)), closes [#1129](https://github.com/ExchangeUnion/xud/issues/1129)
* **rpc/cli:** separate inactive channel balance in getbalance ([1f0c3c5](https://github.com/ExchangeUnion/xud/commit/1f0c3c5efa8ad0222cb3e85b7ecb6ddd05e27658))
* **test:** install geth script ([#1340](https://github.com/ExchangeUnion/xud/issues/1340)) ([7500491](https://github.com/ExchangeUnion/xud/commit/750049167ec88551d958c0e01bc9a458d9c0205b))
* show LND info while it is out of sync ([#1294](https://github.com/ExchangeUnion/xud/issues/1294)) ([8fc6096](https://github.com/ExchangeUnion/xud/commit/8fc6096c1694520ccbce8985bd94edadc583c71b))
* simplify wallet creation output ([#1288](https://github.com/ExchangeUnion/xud/issues/1288)) ([a593288](https://github.com/ExchangeUnion/xud/commit/a593288f6c74b23f6493410b0b4fb7fa378c2eba))

### Features

* **lnd:** retry init if misconfigured (WIP) ([#1363](https://github.com/ExchangeUnion/xud/issues/1363)) ([2f233d2](https://github.com/ExchangeUnion/xud/commit/2f233d29b9c37c12030354bce122e83b0d1742e9))
* restore from backup ([9703c76](https://github.com/ExchangeUnion/xud/commit/9703c767d51a50bb674cbf3bff2c0686fd365f07))
* use deciphered seed for xud key ([99d49eb](https://github.com/ExchangeUnion/xud/commit/99d49ebffa229a704a7fe35aa8e47c84c0c57b88))
* **cli:** change orderbook default precision ([bf55948](https://github.com/ExchangeUnion/xud/commit/bf559482bd50daa98b42da96d8ed04221b14a72c))
* **config:** add maxlimits options ([d9cfe1f](https://github.com/ExchangeUnion/xud/commit/d9cfe1f8fe496d7c4eb77066f0ea456444a564e9)), closes [#1304](https://github.com/ExchangeUnion/xud/issues/1304)
* **grpc:** Convert Raiden contract addresses to EIP55 format ([a9484d0](https://github.com/ExchangeUnion/xud/commit/a9484d07d242956d0c0195affda2e85ff08b4c60))
* **lnd:** wait for tls.cert ([6398cd5](https://github.com/ExchangeUnion/xud/commit/6398cd5fee2abb843d403321f039e70c2594fd28))
* **orderbook:** immediate-or-cancel orders ([c499d8b](https://github.com/ExchangeUnion/xud/commit/c499d8bae7dd6c15de4c6d9f74b53211cd92b9c8)), closes [#622](https://github.com/ExchangeUnion/xud/issues/622)
* **p2p:** log disconnection packet reason enum ([#1272](https://github.com/ExchangeUnion/xud/issues/1272)) ([dd3fa65](https://github.com/ExchangeUnion/xud/commit/dd3fa656853e774353c5ea5c5be189a4dbddcdea)), closes [#1267](https://github.com/ExchangeUnion/xud/issues/1267)
* **resolver:** retry flag in error message ([30a9f31](https://github.com/ExchangeUnion/xud/commit/30a9f313d3537f3401a6d71e8671980b029224b6)), closes [#1282](https://github.com/ExchangeUnion/xud/issues/1282)
* **rpc:** create error if clients misconfigured ([1887d53](https://github.com/ExchangeUnion/xud/commit/1887d531ebb82ee84af5ece265a4202d4f2c0756)), closes [#1287](https://github.com/ExchangeUnion/xud/issues/1287)
* **rpc:** RestoreNode call to restore from seed ([4357adb](https://github.com/ExchangeUnion/xud/commit/4357adb444b7dc0df8c07eb3cdf4ce4418f7b286)), closes [#1017](https://github.com/ExchangeUnion/xud/issues/1017) [#1020](https://github.com/ExchangeUnion/xud/issues/1020)
* add OpenDEX BOLD specs to readme, minor fixes ([#1348](https://github.com/ExchangeUnion/xud/issues/1348)) ([e4ab35e](https://github.com/ExchangeUnion/xud/commit/e4ab35e0019f27bb08e30473ab9c751bdd2cea82))
* **rpc:** GetBalance enhancements ([#1197](https://github.com/ExchangeUnion/xud/issues/1197)) ([fc984cb](https://github.com/ExchangeUnion/xud/commit/fc984cb5f6ba010382a5c216e38c1b2772c57424))
* **rpc:** notify when xud is starting ([931d8e8](https://github.com/ExchangeUnion/xud/commit/931d8e8af8ef8370386351d822617c4aa2c5025d)), closes [#1258](https://github.com/ExchangeUnion/xud/issues/1258)
* **rpc:** unlock returns list of locked wallets ([2fd2b5d](https://github.com/ExchangeUnion/xud/commit/2fd2b5d293851411a5e12d9f53d1cae17cd0f92a)), closes [#1319](https://github.com/ExchangeUnion/xud/issues/1319)
* **swaps:** Resolve unknown hashes from database ([#1342](https://github.com/ExchangeUnion/xud/issues/1342)) ([afd43e1](https://github.com/ExchangeUnion/xud/commit/afd43e12f055b5c12178bebc7ba8eeaeb241c7d8))
* add backup daemon ([#1032](https://github.com/ExchangeUnion/xud/issues/1032)) ([225d61a](https://github.com/ExchangeUnion/xud/commit/225d61a13998ae5ab9d765c652de22ca55256f9e))
* add xud status ([#1285](https://github.com/ExchangeUnion/xud/issues/1285)) ([c04f837](https://github.com/ExchangeUnion/xud/commit/c04f837a7ba41a5f5d851715e0e3577966ccacdb)), closes [#1176](https://github.com/ExchangeUnion/xud/issues/1176)
* **swaps:** add flexibility to second leg route ([c109d8f](https://github.com/ExchangeUnion/xud/commit/c109d8f0212ddc3037298817e1d19633d24ede39)), closes [#1165](https://github.com/ExchangeUnion/xud/issues/1165)
* **swaps:** UNKNOWN_PAYMENT_ERROR code ([d32dfb6](https://github.com/ExchangeUnion/xud/commit/d32dfb6f02386052ba88367c45291f526c5ec7d8))


# [1.0.0-mainnet](https://github.com/ExchangeUnion/xud/compare/v1.0.0-testnet.1...v1.0.0-mainnet) (2019-10-03)


### Bug Fixes

* don't allow new connections while pool closes ([173303b](https://github.com/ExchangeUnion/xud/commit/173303b))
* reconnect log message ([#1260](https://github.com/ExchangeUnion/xud/issues/1260)) ([8034c6c](https://github.com/ExchangeUnion/xud/commit/8034c6c))
* **cli:** executeswap don't set undefined quantity ([8e61343](https://github.com/ExchangeUnion/xud/commit/8e61343)), closes [#1175](https://github.com/ExchangeUnion/xud/issues/1175)
* **cli:** naming inconsistencies ([#1203](https://github.com/ExchangeUnion/xud/issues/1203)) ([f94c7f3](https://github.com/ExchangeUnion/xud/commit/f94c7f3))
* **lnd:** wait for macaroon before wallet created ([6ae653d](https://github.com/ExchangeUnion/xud/commit/6ae653d))
* **lnd:** waitForReady infinite deadline ([#1152](https://github.com/ExchangeUnion/xud/issues/1152)) ([86d2b20](https://github.com/ExchangeUnion/xud/commit/86d2b20))
* **p2p:** prevent xud from crashing when connecting to peer timeouts ([7932b51](https://github.com/ExchangeUnion/xud/commit/7932b51))
* **peer:** logging label/node pub key ([dec2a46](https://github.com/ExchangeUnion/xud/commit/dec2a46))
* **pool:** xud crashes upon receiving NodeStateUpdatePacket including an unexisting trading pair ([693a01b](https://github.com/ExchangeUnion/xud/commit/693a01b))
* **raiden:** log new address correctly ([0e8fa0d](https://github.com/ExchangeUnion/xud/commit/0e8fa0d))
* **seedutil:** avoid logging seed in logs ([6fdc36b](https://github.com/ExchangeUnion/xud/commit/6fdc36b))
* **seedutil:** separate aezeed & encryption pwords ([977e3d9](https://github.com/ExchangeUnion/xud/commit/977e3d9))
* **swapclient:** continue reconnection attempts ([a1a2586](https://github.com/ExchangeUnion/xud/commit/a1a2586)), closes [#1240](https://github.com/ExchangeUnion/xud/issues/1240)
* **swapclientmanager:** catch genseed errors ([d5b0fed](https://github.com/ExchangeUnion/xud/commit/d5b0fed))
* **swaps:** add resolve request validation slippage ([99600c4](https://github.com/ExchangeUnion/xud/commit/99600c4))
* **swaps:** calc lock duration hours correctly ([73c43f6](https://github.com/ExchangeUnion/xud/commit/73c43f6)), closes [#1205](https://github.com/ExchangeUnion/xud/issues/1205)
* allow graceful shutdown while awaiting unlock ([3821ffd](https://github.com/ExchangeUnion/xud/commit/3821ffd))
* change dai ropsten contract to kyber dai ropsten contract ([#1148](https://github.com/ExchangeUnion/xud/issues/1148)) ([9e81fcc](https://github.com/ExchangeUnion/xud/commit/9e81fcc))
* change testnet seed node key, add mainnet seed node key ([#1193](https://github.com/ExchangeUnion/xud/issues/1193)) ([809c5d8](https://github.com/ExchangeUnion/xud/commit/809c5d8))
* log error message reason correctly ([#1209](https://github.com/ExchangeUnion/xud/issues/1209)) ([69962db](https://github.com/ExchangeUnion/xud/commit/69962db))
* README link adjustment wiki -> docs.exchangeunion.com ([9a03442](https://github.com/ExchangeUnion/xud/commit/9a03442))
* **swaps:** check payment rejected error code ([5682a0a](https://github.com/ExchangeUnion/xud/commit/5682a0a))
* **swaps:** prevent crash on send payment failure ([555349e](https://github.com/ExchangeUnion/xud/commit/555349e)), closes [#1155](https://github.com/ExchangeUnion/xud/issues/1155)
* **swaps:** set cltvLimit correctly ([31b41a1](https://github.com/ExchangeUnion/xud/commit/31b41a1)), closes [#1158](https://github.com/ExchangeUnion/xud/issues/1158)
* **swaps:** validate Raiden's resolve request ([6d525a7](https://github.com/ExchangeUnion/xud/commit/6d525a7))
* update simnet token addresses ([#1150](https://github.com/ExchangeUnion/xud/issues/1150)) ([7737da8](https://github.com/ExchangeUnion/xud/commit/7737da8))


### Features

* **cli:** enhance listpeers output ([d093597](https://github.com/ExchangeUnion/xud/commit/d093597))
* wait for lnd on create call ([a74780c](https://github.com/ExchangeUnion/xud/commit/a74780c)), closes [#1252](https://github.com/ExchangeUnion/xud/issues/1252)
* **cli:** enhance create output ([a3e94f1](https://github.com/ExchangeUnion/xud/commit/a3e94f1)), closes [#1210](https://github.com/ExchangeUnion/xud/issues/1210)
* **cli:** getinfo enhancements ([#1170](https://github.com/ExchangeUnion/xud/issues/1170)) ([6c5dae5](https://github.com/ExchangeUnion/xud/commit/6c5dae5)), closes [#1059](https://github.com/ExchangeUnion/xud/issues/1059)
* **cli:** hide password input ([dd6e8d9](https://github.com/ExchangeUnion/xud/commit/dd6e8d9))
* **cli:** improve create call response wording ([#1246](https://github.com/ExchangeUnion/xud/issues/1246)) ([f32fe6d](https://github.com/ExchangeUnion/xud/commit/f32fe6d))
* **cli:** output enhancements ([f234be1](https://github.com/ExchangeUnion/xud/commit/f234be1))
* **cli:** set exit code 1 on errored calls ([ff9aefd](https://github.com/ExchangeUnion/xud/commit/ff9aefd))
* **cli:** wait for client on create/unlock ([a6b1d97](https://github.com/ExchangeUnion/xud/commit/a6b1d97))
* **cli:** wait for tls cert on create ([0ceca00](https://github.com/ExchangeUnion/xud/commit/0ceca00))
* **config:** default p2p port based on network ([bc51422](https://github.com/ExchangeUnion/xud/commit/bc51422)), closes [#1238](https://github.com/ExchangeUnion/xud/issues/1238)
* **config:** exit on invalid config file ([356c2c7](https://github.com/ExchangeUnion/xud/commit/356c2c7))
* **db:** add simnet default currencies and pairs ([29d6479](https://github.com/ExchangeUnion/xud/commit/29d6479))
* **grpc:** log call response errors ([9913bda](https://github.com/ExchangeUnion/xud/commit/9913bda))
* **initservice:** return list of wallets ([15ec140](https://github.com/ExchangeUnion/xud/commit/15ec140)), closes [#1018](https://github.com/ExchangeUnion/xud/issues/1018)
* **lnd:** update to v0.7.1-beta ([#1141](https://github.com/ExchangeUnion/xud/issues/1141)) ([e73ec4b](https://github.com/ExchangeUnion/xud/commit/e73ec4b))
* **orderbook:** check for swap clients before add ([72335a0](https://github.com/ExchangeUnion/xud/commit/72335a0)), closes [#983](https://github.com/ExchangeUnion/xud/issues/983)
* **p2p:** log peer's expectedpubkey ([527a88d](https://github.com/ExchangeUnion/xud/commit/527a88d))
* **peer:** log pubkey on retry connect ([#1144](https://github.com/ExchangeUnion/xud/issues/1144)) ([97c0d1a](https://github.com/ExchangeUnion/xud/commit/97c0d1a))
* **rpc:** ListCurrencies enhancement ([3d716b6](https://github.com/ExchangeUnion/xud/commit/3d716b6)), closes [#1067](https://github.com/ExchangeUnion/xud/issues/1067)
* **swaps:** raiden claims recovered swap payments ([719e199](https://github.com/ExchangeUnion/xud/commit/719e199)), closes [#1251](https://github.com/ExchangeUnion/xud/issues/1251)
* $10 mainnet order size limits ([c6c74eb](https://github.com/ExchangeUnion/xud/commit/c6c74eb)), closes [#1230](https://github.com/ExchangeUnion/xud/issues/1230)
* create eth keystore with master seed ([9b4d9f9](https://github.com/ExchangeUnion/xud/commit/9b4d9f9)), closes [#1242](https://github.com/ExchangeUnion/xud/issues/1242)
* **swap:** persist active swap deals to db ([1a0692b](https://github.com/ExchangeUnion/xud/commit/1a0692b)), closes [#1079](https://github.com/ExchangeUnion/xud/issues/1079)
* **swapclient:** add timeout to initialization ([5c0f04e](https://github.com/ExchangeUnion/xud/commit/5c0f04e))
* **swapclient:** heartbeat ([f427158](https://github.com/ExchangeUnion/xud/commit/f427158)), closes [#1090](https://github.com/ExchangeUnion/xud/issues/1090)
* **swapclient:** update capacity on channelbalance ([3f43e66](https://github.com/ExchangeUnion/xud/commit/3f43e66))
* seed ports adjustment ([3b2cd3c](https://github.com/ExchangeUnion/xud/commit/3b2cd3c))
* **lnd:** automatically unlock wallet on restart ([457cb67](https://github.com/ExchangeUnion/xud/commit/457cb67)), closes [#1196](https://github.com/ExchangeUnion/xud/issues/1196)
* **swaps:** dynamic lock buffer ([cf83ab0](https://github.com/ExchangeUnion/xud/commit/cf83ab0)), closes [#1164](https://github.com/ExchangeUnion/xud/issues/1164)
* show git commit hash in version ([#1200](https://github.com/ExchangeUnion/xud/issues/1200)) ([876335e](https://github.com/ExchangeUnion/xud/commit/876335e))
* shutdown gracefully on SIGTERM ([847a251](https://github.com/ExchangeUnion/xud/commit/847a251))
* **rpc:** ListTrades command ([740b174](https://github.com/ExchangeUnion/xud/commit/740b174)), closes [#667](https://github.com/ExchangeUnion/xud/issues/667)
* **swaps:** improved remote error handling ([5e21166](https://github.com/ExchangeUnion/xud/commit/5e21166))
* **swaps:** logging improvements ([f2815d2](https://github.com/ExchangeUnion/xud/commit/f2815d2)), closes [#1157](https://github.com/ExchangeUnion/xud/issues/1157)
* **swaps:** recover crashed swap deals ([856f14a](https://github.com/ExchangeUnion/xud/commit/856f14a)), closes [#1079](https://github.com/ExchangeUnion/xud/issues/1079)
* limit trade & order sizes for mainnet ([f161d19](https://github.com/ExchangeUnion/xud/commit/f161d19)), closes [#948](https://github.com/ExchangeUnion/xud/issues/948)
* not connecting to its own addresses ([27547af](https://github.com/ExchangeUnion/xud/commit/27547af))
* shutdown xud on error during init ([9822d77](https://github.com/ExchangeUnion/xud/commit/9822d77))



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



