## [1.2.1](https://github.com/ExchangeUnion/xud/compare/v1.0.0...v1.2.1) (2020-11-19)

This maintenance release includes a number of features, most significantly it switches xud to use lnd's new `sendpaymentv2` call to prepare for multi-channel trades. It also improves xud's shutdown behavior and fixes several bugs.

### Bug Fixes

* added swap success log entry ([#1649](https://github.com/ExchangeUnion/xud/issues/1649)) ([e914ec0](https://github.com/ExchangeUnion/xud/commit/e914ec028f6420bbf2d973b92626f6284a9a8ba5))
* graceful shutdown ([#1994](https://github.com/ExchangeUnion/xud/issues/1994)) ([cde3203](https://github.com/ExchangeUnion/xud/commit/cde320312dcd08f70123b5949d038205748d6148))
* **cli:** typo in unlock.ts ([#1944](https://github.com/ExchangeUnion/xud/issues/1944)) ([7f61b32](https://github.com/ExchangeUnion/xud/commit/7f61b321c7e5c77585650ef7ff8415bdc29f6c15))
* **lnd:** don't calculate negative capacities ([b1020c1](https://github.com/ExchangeUnion/xud/commit/b1020c1a5cf2b386b9948efad9b5868232323945))
* addpair should prevent adding same base and quote assets ([#1559](https://github.com/ExchangeUnion/xud/issues/1559)) ([69f502f](https://github.com/ExchangeUnion/xud/commit/69f502f12b9fab12a558cc304eb5b58e19836561))
* tls certificate check on startup ([#1510](https://github.com/ExchangeUnion/xud/issues/1510)) ([9633678](https://github.com/ExchangeUnion/xud/commit/9633678de77fcd1728118998b896e60ec1261f90))
* use regtest instead of regnet arg ([7c6a226](https://github.com/ExchangeUnion/xud/commit/7c6a22640c414003ec3a88adc623d622065677df))
* **lnd:** handling hold invoice check errors ([#1969](https://github.com/ExchangeUnion/xud/issues/1969)) ([5746516](https://github.com/ExchangeUnion/xud/commit/57465168e24ed467427265af446c27a31427912a)), closes [#1968](https://github.com/ExchangeUnion/xud/issues/1968)
* alias missing in streamorders ([#1725](https://github.com/ExchangeUnion/xud/issues/1725)) ([#1962](https://github.com/ExchangeUnion/xud/issues/1962)) ([d537206](https://github.com/ExchangeUnion/xud/commit/d537206abec4835f96807853c66b23acaeb62e88))
* **cli:** openchannel assertion error for string amount ([#1950](https://github.com/ExchangeUnion/xud/issues/1950)) ([a0cc6d7](https://github.com/ExchangeUnion/xud/commit/a0cc6d74dc73176cb43ba496a73f32be31adb8cd)), closes [#1643](https://github.com/ExchangeUnion/xud/issues/1643)
* **connext:** not enough balance for closechannel ([#1963](https://github.com/ExchangeUnion/xud/issues/1963)) ([6599d88](https://github.com/ExchangeUnion/xud/commit/6599d885cfce3361715b99037013aca89220a658))
* **p2p:** don't reconnect peers when pool closed ([#1965](https://github.com/ExchangeUnion/xud/issues/1965)) ([8483e1e](https://github.com/ExchangeUnion/xud/commit/8483e1e35d7fdc80404cac59768ddc61a773b465)), closes [#1668](https://github.com/ExchangeUnion/xud/issues/1668) [/github.com/ExchangeUnion/xud/issues/1668#issuecomment-684828808](https://github.com//github.com/ExchangeUnion/xud/issues/1668/issues/issuecomment-684828808)
* **rpc:** no success if no channels to close ([#1689](https://github.com/ExchangeUnion/xud/issues/1689)) ([#1942](https://github.com/ExchangeUnion/xud/issues/1942)) ([17e40de](https://github.com/ExchangeUnion/xud/commit/17e40deda3ced6de23030094b6ada5f11dd383df))
* getinfo output for lnd channels ([#1940](https://github.com/ExchangeUnion/xud/issues/1940)) ([#1948](https://github.com/ExchangeUnion/xud/issues/1948)) ([962daa4](https://github.com/ExchangeUnion/xud/commit/962daa46081bc3122a04afa82bbe88eb53ec0026))
* implemented showing all pairs instead of active ones for listpeers ([206dad0](https://github.com/ExchangeUnion/xud/commit/206dad04b0151e3514f7883e066c361c034defca))
* listorders limit displays first orders instead of last ([#1883](https://github.com/ExchangeUnion/xud/issues/1883)) ([e101e6f](https://github.com/ExchangeUnion/xud/commit/e101e6fb3d0ede2cf6439d10dafa410b533035da))
* manual ban causes an undefined log entry ([#1779](https://github.com/ExchangeUnion/xud/issues/1779)) ([e7f8178](https://github.com/ExchangeUnion/xud/commit/e7f817841fccee30415f754816644f161fe6cc2c))
* order invalidation only be sent to peers with active pair ([#1530](https://github.com/ExchangeUnion/xud/issues/1530)) ([#1890](https://github.com/ExchangeUnion/xud/issues/1890)) ([0dc85bd](https://github.com/ExchangeUnion/xud/commit/0dc85bd83ad0514241e85ae3a958bb01d31594b0))
* propagating currencies and pairs on database if initDB true even DB is filled ([17c7cb5](https://github.com/ExchangeUnion/xud/commit/17c7cb54c3a55189ca459a9a842a7e2aa4886a6b))
* propagating nodes on database if initDB true even DB is filled ([#1907](https://github.com/ExchangeUnion/xud/issues/1907)) ([246136e](https://github.com/ExchangeUnion/xud/commit/246136e3d2992711ce5e09d132cf79348bf99e6e))
* rename tradinglimits reserved_inbound json_name ([7e56011](https://github.com/ExchangeUnion/xud/commit/7e560111dbb10079a6e9c488d46fb0ecc8bb1cb6))
* xudrpc GetBalanceResponse json_name ([#1909](https://github.com/ExchangeUnion/xud/issues/1909)) ([26f89e6](https://github.com/ExchangeUnion/xud/commit/26f89e6d01cce2ec9d66dc39c0538d142a5af18c))
* **connext:** avoid scientific notation for amount ([#1905](https://github.com/ExchangeUnion/xud/issues/1905)) ([cc1e689](https://github.com/ExchangeUnion/xud/commit/cc1e689181bfe4bafa19112d634a6eb12178cbe9))
* **connext:** remove BigInt to avoid precision loss ([#1893](https://github.com/ExchangeUnion/xud/issues/1893)) ([d9ddd1c](https://github.com/ExchangeUnion/xud/commit/d9ddd1cfa16614fc914c61ded2c5e84fd7bd743c))


### Features

* **lnd:** SendPaymentV2 ([51c60dc](https://github.com/ExchangeUnion/xud/commit/51c60dcdc09df38a641dcc6142bee2539b8c85f6)), closes [#1590](https://github.com/ExchangeUnion/xud/issues/1590)
* **rpc:** runtime addcurrency for lnd & connext ([#1746](https://github.com/ExchangeUnion/xud/issues/1746)) ([fc83823](https://github.com/ExchangeUnion/xud/commit/fc8382313854b259ca97256004c8ddbb35dcffca))
* **swapclient:** auto init wallets on xud unlock ([#1973](https://github.com/ExchangeUnion/xud/issues/1973)) ([a1287dd](https://github.com/ExchangeUnion/xud/commit/a1287dda7740a92e92d8799bf4f2a8a0279d21a8)), closes [#1929](https://github.com/ExchangeUnion/xud/issues/1929)
* reserved capacity checks on PlaceOrder ([#1949](https://github.com/ExchangeUnion/xud/issues/1949)) ([d458745](https://github.com/ExchangeUnion/xud/commit/d4587458ab15a43bb6f4cfea18ee13cbd2653075)), closes [#1947](https://github.com/ExchangeUnion/xud/issues/1947)
* **lnd:** change gRPC client options ([aefdce8](https://github.com/ExchangeUnion/xud/commit/aefdce84e2c6cae35bf243f21a5224427fe2bfcc))
* derive child seed for swap clients ([be4121f](https://github.com/ExchangeUnion/xud/commit/be4121fd04156318c68dba28ee5f1a2483fd0c07)), closes [#1576](https://github.com/ExchangeUnion/xud/issues/1576)
* removeorder output changed to a more meaningful message ([#1526](https://github.com/ExchangeUnion/xud/issues/1526)) ([ba04193](https://github.com/ExchangeUnion/xud/commit/ba041938cdcddb3aedec0db8fe4f571e2608b9d1))
* **connext:** request collateral for order amount ([75078c0](https://github.com/ExchangeUnion/xud/commit/75078c059bfd752ae47c4530a671bd7a95568975)), closes [#1845](https://github.com/ExchangeUnion/xud/issues/1845)
* **rpc:** SetLogLevel ([#1955](https://github.com/ExchangeUnion/xud/issues/1955)) ([8d10df0](https://github.com/ExchangeUnion/xud/commit/8d10df00f7442ea58286726f0348d0f43eae7622)), closes [#835](https://github.com/ExchangeUnion/xud/issues/835)
* added new grpc method to easily cancel all orders ([#1910](https://github.com/ExchangeUnion/xud/issues/1910)) ([c958e86](https://github.com/ExchangeUnion/xud/commit/c958e862542fb52fdeb6532cbe2d92dd4b52cedf))
* **cli:** case insensitive choices ([4c01b0e](https://github.com/ExchangeUnion/xud/commit/4c01b0e5fe5da75bcb3b4de063e0132929b358bb))
* **connext:** lazy collateralization ([#1916](https://github.com/ExchangeUnion/xud/issues/1916)) ([0f2b841](https://github.com/ExchangeUnion/xud/commit/0f2b841d3bc353cebca01f0bcdfec52c6c13e9d0)), closes [#1896](https://github.com/ExchangeUnion/xud/issues/1896)
* **connext:** reject app install for transfers without status field ([#1863](https://github.com/ExchangeUnion/xud/issues/1863)) ([519aa54](https://github.com/ExchangeUnion/xud/commit/519aa54fa9bfd138d6086f0de0406462a62a57bc))
* **connext:** unlock expired transfer apps ([#1857](https://github.com/ExchangeUnion/xud/issues/1857)) ([023434d](https://github.com/ExchangeUnion/xud/commit/023434de1eabe4811986b9156beef7a5a670c047))
* **logging:** order holds on trace level ([#1865](https://github.com/ExchangeUnion/xud/issues/1865)) ([5e3ad04](https://github.com/ExchangeUnion/xud/commit/5e3ad04ed8f2e35cb06479d2172d25bffa002768))
* **orderbook:** better replace order hold message ([b7fa00a](https://github.com/ExchangeUnion/xud/commit/b7fa00a7afc8ab0fe4e4f495395434e49e00f357))
* **rpc:** add txid to open/close channel response ([0669a3f](https://github.com/ExchangeUnion/xud/commit/0669a3f41f6a8de9cc6afcf4d8d58c91d18d5b58)), closes [#1860](https://github.com/ExchangeUnion/xud/issues/1860)
* **rpc:** expose reserved balance for GetBalance ([#1925](https://github.com/ExchangeUnion/xud/issues/1925)) ([8b18dd7](https://github.com/ExchangeUnion/xud/commit/8b18dd7426f01a760e571a0a5bb2310759229b64))
* **rpc:** reserved order amount for TradingLimits ([7f7cd68](https://github.com/ExchangeUnion/xud/commit/7f7cd683272e738a77480028c16095e8fb34c175)), closes [#1584](https://github.com/ExchangeUnion/xud/issues/1584) [#1678](https://github.com/ExchangeUnion/xud/issues/1678)
* **rpc:** show connext status on create/restore node ([#1902](https://github.com/ExchangeUnion/xud/issues/1902)) ([82e16a5](https://github.com/ExchangeUnion/xud/commit/82e16a5e4ed4fa91e481eac638b16eb10e5bb7de))
* **simnet:** add DAI ([#1915](https://github.com/ExchangeUnion/xud/issues/1915)) ([35e85b3](https://github.com/ExchangeUnion/xud/commit/35e85b31bfbfa72430f5db982b7f64f19b346f2a))
* sat_per_byte custom fee for openchannel ([#1832](https://github.com/ExchangeUnion/xud/issues/1832)) ([b56ad98](https://github.com/ExchangeUnion/xud/commit/b56ad98ecb31f94d304a31d3c060693506ae829a)), closes [#1829](https://github.com/ExchangeUnion/xud/issues/1829)
* **simnet:** upgrade simnet USDT contract address ([#1906](https://github.com/ExchangeUnion/xud/issues/1906)) ([7e5f8ef](https://github.com/ExchangeUnion/xud/commit/7e5f8ef30a1d01a4405757d4359b827ef86cf750))



# [1.2.0](https://github.com/ExchangeUnion/xud/compare/v1.0.0...v1.2.0) (2020-10-16)

This release includes a number of fixes and features, most significantly related to Connext integration.

- Inbound collateral from the Connext node is now dynamically requested upon orders being placed that receive a Connext currency.
- Keep track of inbound and outbound amounts reserved by standing orders in the orderbook, and expose these amounts on the `TradingLimits` call.

### Bug Fixes

* **cli:** switch getbalance table columns ([#1931](https://github.com/ExchangeUnion/xud/issues/1931)) ([49c8c18](https://github.com/ExchangeUnion/xud/commit/49c8c18cf9d00ede7f84ce617921ffc3aa9b18de)), closes [#1930](https://github.com/ExchangeUnion/xud/issues/1930)
* **orderbook:** don't remove 0 quantity w/ hold ([#1921](https://github.com/ExchangeUnion/xud/issues/1921)) ([5f3793a](https://github.com/ExchangeUnion/xud/commit/5f3793a0dc5d4c1cd042a2b5260d3db1942de750))
* bold link, mm link ([#1873](https://github.com/ExchangeUnion/xud/issues/1873)) ([54bd9ce](https://github.com/ExchangeUnion/xud/commit/54bd9ce11fc6297319b4c48c7fe9537b3031817b))
* checking for invoice support on lnd clients while verifying connection ([4c26aff](https://github.com/ExchangeUnion/xud/commit/4c26aff0bafc52053aaf928a4d1936bab4293950))
* don't activate unsupported pairs with peers ([0fe2d66](https://github.com/ExchangeUnion/xud/commit/0fe2d66d85c2fcc2d559740662977750ddae21e1))
* grpc throws error for addpair/withdraw for wrong argument ([#1844](https://github.com/ExchangeUnion/xud/issues/1844)) ([48a0a33](https://github.com/ExchangeUnion/xud/commit/48a0a33811c2ba52f3791b73f1eef8b8933e09cc))
* handling insufficient balance errors for swap clients ([246889b](https://github.com/ExchangeUnion/xud/commit/246889b89f7f9fa27ba47a31d1a2408d7a4a58a7))
* implemented showing all pairs instead of active ones for listpeers ([206dad0](https://github.com/ExchangeUnion/xud/commit/206dad04b0151e3514f7883e066c361c034defca))
* listorders limit displays first orders instead of last ([#1883](https://github.com/ExchangeUnion/xud/issues/1883)) ([e101e6f](https://github.com/ExchangeUnion/xud/commit/e101e6fb3d0ede2cf6439d10dafa410b533035da))
* propagating currencies and pairs on database if initDB true even DB is filled ([17c7cb5](https://github.com/ExchangeUnion/xud/commit/17c7cb54c3a55189ca459a9a842a7e2aa4886a6b))
* propagating nodes on database if initDB true even DB is filled ([#1907](https://github.com/ExchangeUnion/xud/issues/1907)) ([246136e](https://github.com/ExchangeUnion/xud/commit/246136e3d2992711ce5e09d132cf79348bf99e6e))
* xudrpc GetBalanceResponse json_name ([#1909](https://github.com/ExchangeUnion/xud/issues/1909)) ([26f89e6](https://github.com/ExchangeUnion/xud/commit/26f89e6d01cce2ec9d66dc39c0538d142a5af18c))
* **connext:** avoid scientific notation for amount ([#1905](https://github.com/ExchangeUnion/xud/issues/1905)) ([cc1e689](https://github.com/ExchangeUnion/xud/commit/cc1e689181bfe4bafa19112d634a6eb12178cbe9))
* **connext:** display error message for 400 status code ([#1911](https://github.com/ExchangeUnion/xud/issues/1911)) ([b4e1858](https://github.com/ExchangeUnion/xud/commit/b4e1858fd78005b43dcedf4ec5b5425c727639c5))
* **connext:** remove BigInt to avoid precision loss ([#1893](https://github.com/ExchangeUnion/xud/issues/1893)) ([d9ddd1c](https://github.com/ExchangeUnion/xud/commit/d9ddd1cfa16614fc914c61ded2c5e84fd7bd743c))
* order invalidation only be sent to peers with active pair ([#1530](https://github.com/ExchangeUnion/xud/issues/1530)) ([#1890](https://github.com/ExchangeUnion/xud/issues/1890)) ([0dc85bd](https://github.com/ExchangeUnion/xud/commit/0dc85bd83ad0514241e85ae3a958bb01d31594b0))


### Features

* **cli:** case insensitive choices ([4c01b0e](https://github.com/ExchangeUnion/xud/commit/4c01b0e5fe5da75bcb3b4de063e0132929b358bb))
* **connext:** lazy collateralization ([#1916](https://github.com/ExchangeUnion/xud/issues/1916)) ([0f2b841](https://github.com/ExchangeUnion/xud/commit/0f2b841d3bc353cebca01f0bcdfec52c6c13e9d0)), closes [#1896](https://github.com/ExchangeUnion/xud/issues/1896)
* **connext:** request collateral for order amount ([75078c0](https://github.com/ExchangeUnion/xud/commit/75078c059bfd752ae47c4530a671bd7a95568975)), closes [#1845](https://github.com/ExchangeUnion/xud/issues/1845)
* **logging:** order holds on trace level ([#1865](https://github.com/ExchangeUnion/xud/issues/1865)) ([5e3ad04](https://github.com/ExchangeUnion/xud/commit/5e3ad04ed8f2e35cb06479d2172d25bffa002768))
* **rpc:** add txid to open/close channel response ([0669a3f](https://github.com/ExchangeUnion/xud/commit/0669a3f41f6a8de9cc6afcf4d8d58c91d18d5b58)), closes [#1860](https://github.com/ExchangeUnion/xud/issues/1860)
* **rpc:** expose reserved balance for GetBalance ([#1925](https://github.com/ExchangeUnion/xud/issues/1925)) ([8b18dd7](https://github.com/ExchangeUnion/xud/commit/8b18dd7426f01a760e571a0a5bb2310759229b64))
* **rpc:** reserved order amount for TradingLimits ([7f7cd68](https://github.com/ExchangeUnion/xud/commit/7f7cd683272e738a77480028c16095e8fb34c175)), closes [#1584](https://github.com/ExchangeUnion/xud/issues/1584) [#1678](https://github.com/ExchangeUnion/xud/issues/1678)
* derive child seed for swap clients ([be4121f](https://github.com/ExchangeUnion/xud/commit/be4121fd04156318c68dba28ee5f1a2483fd0c07)), closes [#1576](https://github.com/ExchangeUnion/xud/issues/1576)
* **connext:** reject app install for transfers without status field ([#1863](https://github.com/ExchangeUnion/xud/issues/1863)) ([519aa54](https://github.com/ExchangeUnion/xud/commit/519aa54fa9bfd138d6086f0de0406462a62a57bc))
* **connext:** unlock expired transfer apps ([#1857](https://github.com/ExchangeUnion/xud/issues/1857)) ([023434d](https://github.com/ExchangeUnion/xud/commit/023434de1eabe4811986b9156beef7a5a670c047))
* **rpc:** show connext status on create/restore node ([#1902](https://github.com/ExchangeUnion/xud/issues/1902)) ([82e16a5](https://github.com/ExchangeUnion/xud/commit/82e16a5e4ed4fa91e481eac638b16eb10e5bb7de))
* **simnet:** add DAI ([#1915](https://github.com/ExchangeUnion/xud/issues/1915)) ([35e85b3](https://github.com/ExchangeUnion/xud/commit/35e85b31bfbfa72430f5db982b7f64f19b346f2a))
* sat_per_byte custom fee for openchannel ([#1832](https://github.com/ExchangeUnion/xud/issues/1832)) ([b56ad98](https://github.com/ExchangeUnion/xud/commit/b56ad98ecb31f94d304a31d3c060693506ae829a)), closes [#1829](https://github.com/ExchangeUnion/xud/issues/1829)
* **orderbook:** better replace order hold message ([b7fa00a](https://github.com/ExchangeUnion/xud/commit/b7fa00a7afc8ab0fe4e4f495395434e49e00f357))
* **orderbook:** log error message on remove order ([#1901](https://github.com/ExchangeUnion/xud/issues/1901)) ([788490f](https://github.com/ExchangeUnion/xud/commit/788490f430691e2e93a28e4aab39aa260213e5b3))
* **p2p:** don't log empty order packets ([#1871](https://github.com/ExchangeUnion/xud/issues/1871)) ([1b6d6d6](https://github.com/ExchangeUnion/xud/commit/1b6d6d6cf522517dbe138b8c7dda908b36f2d1a4))
* **p2p:** increase reconnection delay backoff ([#1870](https://github.com/ExchangeUnion/xud/issues/1870)) ([44af197](https://github.com/ExchangeUnion/xud/commit/44af19722ced03fa2fd89702fea88d07ef51ae08))
* **simnet:** change USDT contract address ([#1912](https://github.com/ExchangeUnion/xud/issues/1912)) ([0a2bdfd](https://github.com/ExchangeUnion/xud/commit/0a2bdfdba3507cbd0bba1a0af6d6f8b8b92c3272))
* **simnet:** upgrade simnet USDT contract address ([#1906](https://github.com/ExchangeUnion/xud/issues/1906)) ([7e5f8ef](https://github.com/ExchangeUnion/xud/commit/7e5f8ef30a1d01a4405757d4359b827ef86cf750))



# [1.1.0](https://github.com/ExchangeUnion/xud/compare/v1.0.0...v1.1.0) (2020-09-28)

Most notable features of this release:
- Xud now automatically requests inbound liquidity for connext currencies (ETH/ERC20) and prevents orders from entering the orderbook until there is sufficient inbound liquidity to cover the order. This "smart collateralization" feature considerably increases the likelihood that the orders can be executed successfully.
- The [DAI](https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f) token and `USDT/DAI` trading pair have been enabled by default.

### Bug Fixes

* bold link, mm link ([#1873](https://github.com/ExchangeUnion/xud/issues/1873)) ([54bd9ce](https://github.com/ExchangeUnion/xud/commit/54bd9ce11fc6297319b4c48c7fe9537b3031817b))
* don't activate unsupported pairs with peers ([0fe2d66](https://github.com/ExchangeUnion/xud/commit/0fe2d66d85c2fcc2d559740662977750ddae21e1))
* grpc throws error for addpair/withdraw for wrong argument ([#1844](https://github.com/ExchangeUnion/xud/issues/1844)) ([48a0a33](https://github.com/ExchangeUnion/xud/commit/48a0a33811c2ba52f3791b73f1eef8b8933e09cc))
* handling insufficient balance errors for swap clients ([246889b](https://github.com/ExchangeUnion/xud/commit/246889b89f7f9fa27ba47a31d1a2408d7a4a58a7))
* implemented showing all pairs instead of active ones for listpeers ([206dad0](https://github.com/ExchangeUnion/xud/commit/206dad04b0151e3514f7883e066c361c034defca))
* listorders limit displays first orders instead of last ([#1883](https://github.com/ExchangeUnion/xud/issues/1883)) ([e101e6f](https://github.com/ExchangeUnion/xud/commit/e101e6fb3d0ede2cf6439d10dafa410b533035da))
* order invalidation only be sent to peers with active pair ([#1530](https://github.com/ExchangeUnion/xud/issues/1530)) ([#1890](https://github.com/ExchangeUnion/xud/issues/1890)) ([0dc85bd](https://github.com/ExchangeUnion/xud/commit/0dc85bd83ad0514241e85ae3a958bb01d31594b0))
* propagating nodes on database if initDB true even DB is filled ([#1907](https://github.com/ExchangeUnion/xud/issues/1907)) ([246136e](https://github.com/ExchangeUnion/xud/commit/246136e3d2992711ce5e09d132cf79348bf99e6e))
* xudrpc GetBalanceResponse json_name ([#1909](https://github.com/ExchangeUnion/xud/issues/1909)) ([26f89e6](https://github.com/ExchangeUnion/xud/commit/26f89e6d01cce2ec9d66dc39c0538d142a5af18c))
* **connext:** avoid scientific notation for amount ([#1905](https://github.com/ExchangeUnion/xud/issues/1905)) ([cc1e689](https://github.com/ExchangeUnion/xud/commit/cc1e689181bfe4bafa19112d634a6eb12178cbe9))
* **connext:** display error message for 400 status code ([#1911](https://github.com/ExchangeUnion/xud/issues/1911)) ([b4e1858](https://github.com/ExchangeUnion/xud/commit/b4e1858fd78005b43dcedf4ec5b5425c727639c5))
* **connext:** remove BigInt to avoid precision loss ([#1893](https://github.com/ExchangeUnion/xud/issues/1893)) ([d9ddd1c](https://github.com/ExchangeUnion/xud/commit/d9ddd1cfa16614fc914c61ded2c5e84fd7bd743c))


### Features

* **connext:** reject app install for transfers without status field ([#1863](https://github.com/ExchangeUnion/xud/issues/1863)) ([519aa54](https://github.com/ExchangeUnion/xud/commit/519aa54fa9bfd138d6086f0de0406462a62a57bc))
* **connext:** request collateral for order amount ([75078c0](https://github.com/ExchangeUnion/xud/commit/75078c059bfd752ae47c4530a671bd7a95568975)), closes [#1845](https://github.com/ExchangeUnion/xud/issues/1845)
* **orderbook:** better replace order hold message ([b7fa00a](https://github.com/ExchangeUnion/xud/commit/b7fa00a7afc8ab0fe4e4f495395434e49e00f357))
* **rpc:** show connext status on create/restore node ([#1902](https://github.com/ExchangeUnion/xud/issues/1902)) ([82e16a5](https://github.com/ExchangeUnion/xud/commit/82e16a5e4ed4fa91e481eac638b16eb10e5bb7de))
* **simnet:** add DAI ([#1915](https://github.com/ExchangeUnion/xud/issues/1915)) ([35e85b3](https://github.com/ExchangeUnion/xud/commit/35e85b31bfbfa72430f5db982b7f64f19b346f2a))
* sat_per_byte custom fee for openchannel ([#1832](https://github.com/ExchangeUnion/xud/issues/1832)) ([b56ad98](https://github.com/ExchangeUnion/xud/commit/b56ad98ecb31f94d304a31d3c060693506ae829a)), closes [#1829](https://github.com/ExchangeUnion/xud/issues/1829)
* **connext:** unlock expired transfer apps ([#1857](https://github.com/ExchangeUnion/xud/issues/1857)) ([023434d](https://github.com/ExchangeUnion/xud/commit/023434de1eabe4811986b9156beef7a5a670c047))
* **logging:** order holds on trace level ([#1865](https://github.com/ExchangeUnion/xud/issues/1865)) ([5e3ad04](https://github.com/ExchangeUnion/xud/commit/5e3ad04ed8f2e35cb06479d2172d25bffa002768))
* **orderbook:** log error message on remove order ([#1901](https://github.com/ExchangeUnion/xud/issues/1901)) ([788490f](https://github.com/ExchangeUnion/xud/commit/788490f430691e2e93a28e4aab39aa260213e5b3))
* **p2p:** don't log empty order packets ([#1871](https://github.com/ExchangeUnion/xud/issues/1871)) ([1b6d6d6](https://github.com/ExchangeUnion/xud/commit/1b6d6d6cf522517dbe138b8c7dda908b36f2d1a4))
* **p2p:** increase reconnection delay backoff ([#1870](https://github.com/ExchangeUnion/xud/issues/1870)) ([44af197](https://github.com/ExchangeUnion/xud/commit/44af19722ced03fa2fd89702fea88d07ef51ae08))
* **rpc:** add txid to open/close channel response ([0669a3f](https://github.com/ExchangeUnion/xud/commit/0669a3f41f6a8de9cc6afcf4d8d58c91d18d5b58)), closes [#1860](https://github.com/ExchangeUnion/xud/issues/1860)
* **simnet:** change USDT contract address ([#1912](https://github.com/ExchangeUnion/xud/issues/1912)) ([0a2bdfd](https://github.com/ExchangeUnion/xud/commit/0a2bdfdba3507cbd0bba1a0af6d6f8b8b92c3272))
* **simnet:** upgrade simnet USDT contract address ([#1906](https://github.com/ExchangeUnion/xud/issues/1906)) ([7e5f8ef](https://github.com/ExchangeUnion/xud/commit/7e5f8ef30a1d01a4405757d4359b827ef86cf750))



## [1.0.1](https://github.com/ExchangeUnion/xud/compare/v1.0.0...v1.0.1) (2020-09-08)


### Features

* **connext:** reject app install for transfers without status field ([#1863](https://github.com/ExchangeUnion/xud/issues/1863)) ([519aa54](https://github.com/ExchangeUnion/xud/commit/519aa54fa9bfd138d6086f0de0406462a62a57bc))
* **connext:** unlock expired transfer apps ([#1857](https://github.com/ExchangeUnion/xud/issues/1857)) ([023434d](https://github.com/ExchangeUnion/xud/commit/023434de1eabe4811986b9156beef7a5a670c047))
* **logging:** order holds on trace level ([#1865](https://github.com/ExchangeUnion/xud/issues/1865)) ([5e3ad04](https://github.com/ExchangeUnion/xud/commit/5e3ad04ed8f2e35cb06479d2172d25bffa002768))
* **orderbook:** better replace order hold message ([b7fa00a](https://github.com/ExchangeUnion/xud/commit/b7fa00a7afc8ab0fe4e4f495395434e49e00f357))
* **p2p:** don't log empty order packets ([#1871](https://github.com/ExchangeUnion/xud/issues/1871)) ([1b6d6d6](https://github.com/ExchangeUnion/xud/commit/1b6d6d6cf522517dbe138b8c7dda908b36f2d1a4))
* **p2p:** increase reconnection delay backoff ([#1870](https://github.com/ExchangeUnion/xud/issues/1870)) ([44af197](https://github.com/ExchangeUnion/xud/commit/44af19722ced03fa2fd89702fea88d07ef51ae08))



# [1.0.0](https://github.com/ExchangeUnion/xud/compare/v1.0.0-beta.8...v1.0.0) (2020-09-01)

This is the first major release of xud. This release contains several key fixes and features designed to improve stability and the likelihood of successful swaps when trading with peers.

## Connext

This version continues expanding support for Connext. Tokens can now be withdrawn from one's Connext balance to an on-chain address. Collateral is automatically requested from the Connext node upon depositing tokens to allow for incoming payments to succeed on the first try.

It also handles and prevents an edge case that could have caused xud to crash if Connext receives an expected incoming transfer twice.

## Order Book

The decentralized order book has had some improvements to make it more robust. "Dust" orders - where at least one side of a trade may be for an amount so small that it doesn't meet minimum HTLC sizes - are automatically removed from the order book. Previously, fragments of partially filled or removed orders may have been left over and remained in the order book despite being effectively untradeable.

This version also improves the logic for adding back orders that failed to swap. Orders - or portions thereof - are removed from the order book as they are matched. However, if they are not swapped successfully then xud (unless being run in "strict" mode) will add them back to the order book so that they may be traded again by a future order, perhaps after correcting temporary network or channel management issues that may have caused the first swap attempt to fail. We've fixed this logic to ensure we always add back peer orders that fail a swap. On the other hand, we've also added checks to ensure we don't add back an order that is *no longer valid* - as may be the case when an order is canceled by a peer while we were attempting to swap it.

## Order Replacement

Order replacement has been supported since early pre-release versions of xud and is a handy way to update existing orders in response to changing market conditions. However, on the network layer, order replacements were communicated to peers via two separate packets - one to remove the old order and one to add the new one replacing it.  This allowed for the possibility of delays or inconsistency as the two packets may arrive or be processed at different times. This version supports replacing orders in a single packet, with the aim of making order replacement as atomic as possible both locally and on the xud network.

## Failed Swap Monitoring

Xud has a Swap Recovery module that was originally designed to recover swaps that were in progress during an unexpected crash, with the goal of ensuring that we claim any payments we are expecting from swaps. Over time this same module was used to monitor swaps that xud would deem as "failed" but where HTLCs were still pending. If an outgoing HTLC was eventually claimed by an unscrupulous peer, xud would claim its corresponding incoming payment.

This version goes back to Swap Recovery handling only swaps that were aborted due to an unexpected crash. Similar logic has been added to monitor pending HTLCs for active swaps separately. Swaps now remain "active" as long as any HTLCs exist, and the corresponding orders held in limbo until these HTLCs reach a final resolution. This ensures that orders cannot be double filled. Peers that we detect to have settled an old HTLC are immediately banned, as this is recognized as intentional malicious behavior that may exploit the [free option problem](https://lists.linuxfoundation.org/pipermail/lightning-dev/2018-December/001752.html).

### Bug Fixes

* **connext:** convert contract addresses to eip55 standard ([e08d43c](https://github.com/ExchangeUnion/xud/commit/e08d43c7179f26af6871be4e4d90b512f7f41131))
* **connext:** prevent duplicate htlcAccepted evts ([#1854](https://github.com/ExchangeUnion/xud/issues/1854)) ([aa3027a](https://github.com/ExchangeUnion/xud/commit/aa3027a6a6301e21b203a9b901fc89337a4f2cee)), closes [#1851](https://github.com/ExchangeUnion/xud/issues/1851)
* **orderbook:** add back fully matched orders ([1024b72](https://github.com/ExchangeUnion/xud/commit/1024b7223d96c9ee47da8cbe4357bcdad22f1873)), closes [#1816](https://github.com/ExchangeUnion/xud/issues/1816)
* **orderbook:** prevent stuck replace order holds ([#1842](https://github.com/ExchangeUnion/xud/issues/1842)) ([984e064](https://github.com/ExchangeUnion/xud/commit/984e06460466f82b661ccc9b41e7221be56625c9)), closes [#1835](https://github.com/ExchangeUnion/xud/issues/1835)
* **orderbook:** reject all dust peer orders ([8a1c816](https://github.com/ExchangeUnion/xud/commit/8a1c81618d74c289a15ff14c4f09b1ddf5192147))
* improve HttpServer error logging ([67ddfa4](https://github.com/ExchangeUnion/xud/commit/67ddfa4d910f3573a8b8de1f66858bbd44ccf717))
* restrict reputation events in non-strict mode ([#1808](https://github.com/ExchangeUnion/xud/issues/1808)) ([0d20cd3](https://github.com/ExchangeUnion/xud/commit/0d20cd3ef8c117d90c64b03deedd12a7a8d9b65c)), closes [#1802](https://github.com/ExchangeUnion/xud/issues/1802)
* strict command arg ([a26d67d](https://github.com/ExchangeUnion/xud/commit/a26d67d970cd52a5d44a106e70773ab14c188986))
* **service:** replace order id ([582a49b](https://github.com/ExchangeUnion/xud/commit/582a49b9846f9e700e4bb26425b22d732d111e28))


### Code Refactoring

* remove raiden support ([#1824](https://github.com/ExchangeUnion/xud/issues/1824)) ([9afe7d1](https://github.com/ExchangeUnion/xud/commit/9afe7d1d06bc14946eca15e8a1a0bd799d7003f4)), closes [#1516](https://github.com/ExchangeUnion/xud/issues/1516)


### Features

* implement Connext wallet withdrawals ([#1853](https://github.com/ExchangeUnion/xud/issues/1853)) ([6f97783](https://github.com/ExchangeUnion/xud/commit/6f97783301eb4618be6e2011753351d14c22cb35))
* **connext:** mark payment as failed when receiving 404 status ([d1f1f2c](https://github.com/ExchangeUnion/xud/commit/d1f1f2c5cc2ef17ef889f5a04bfc28a264654cd7))
* **connext:** request collateral after DEPOSIT_CONFIRMED_EVENT ([#1825](https://github.com/ExchangeUnion/xud/issues/1825)) ([dc6de05](https://github.com/ExchangeUnion/xud/commit/dc6de05e486fc57b1de90c9df426ebf669e0ad92))
* **orderbook:** automatically remove dust orders ([0d8435f](https://github.com/ExchangeUnion/xud/commit/0d8435f38f5facb673978cc0e09d553e478a7696)), closes [#1798](https://github.com/ExchangeUnion/xud/issues/1798) [#1785](https://github.com/ExchangeUnion/xud/issues/1785)
* **orderbook:** don't add back invalidated orders ([#1839](https://github.com/ExchangeUnion/xud/issues/1839)) ([ed43416](https://github.com/ExchangeUnion/xud/commit/ed4341672463f15c0c02d61723f9950ee109577b)), closes [#1838](https://github.com/ExchangeUnion/xud/issues/1838)
* **p2p:** replace order in single packet ([#1812](https://github.com/ExchangeUnion/xud/issues/1812)) ([de691b2](https://github.com/ExchangeUnion/xud/commit/de691b2f0a0bd70743121a6924cafa2035132eed)), closes [#1805](https://github.com/ExchangeUnion/xud/issues/1805) [#1806](https://github.com/ExchangeUnion/xud/issues/1806)
* **rpc:** log each call with trace not debug ([#1819](https://github.com/ExchangeUnion/xud/issues/1819)) ([eda2f8d](https://github.com/ExchangeUnion/xud/commit/eda2f8d4bdc53077c13b8b665fed2b5e9b7f903d)), closes [#1817](https://github.com/ExchangeUnion/xud/issues/1817)
* **simnet:** change USDT contract address ([91e73b0](https://github.com/ExchangeUnion/xud/commit/91e73b0505c81862e143293db8019037b1dcc85a))
* **swaps:** monitor pending payments before fail ([#1822](https://github.com/ExchangeUnion/xud/issues/1822)) ([1a4ee6e](https://github.com/ExchangeUnion/xud/commit/1a4ee6e9faf77e88d68464fe9026cca3c1524309)), closes [#1799](https://github.com/ExchangeUnion/xud/issues/1799) [#1794](https://github.com/ExchangeUnion/xud/issues/1794) [#1799](https://github.com/ExchangeUnion/xud/issues/1799) [#1794](https://github.com/ExchangeUnion/xud/issues/1794) [#1708](https://github.com/ExchangeUnion/xud/issues/1708)
* **tests:** upgrade connext simtests to 7.3.6 ([#1833](https://github.com/ExchangeUnion/xud/issues/1833)) ([57269d8](https://github.com/ExchangeUnion/xud/commit/57269d88e6953ca8ed8e48b2bf6482e89021ee8c))
* **tests:** upgrade connext simtests to 7.3.8 ([b067d14](https://github.com/ExchangeUnion/xud/commit/b067d14afcef745cf6c1b468f4dca104f057eded))


### BREAKING CHANGES

* removes raiden support & p2p packet fields



# [1.0.0-beta.8](https://github.com/ExchangeUnion/xud/compare/v1.0.0-beta.7...v1.0.0-beta.8) (2020-08-07)


### Bug Fixes

* **swaps:** no remote fail when sending payment ([dc7e4d2](https://github.com/ExchangeUnion/xud/commit/dc7e4d21652e6b7b86b158ac3ef2282ea882148d)), closes [#1749](https://github.com/ExchangeUnion/xud/issues/1749)
* **utils:** USDT units per currency ([ab7f95b](https://github.com/ExchangeUnion/xud/commit/ab7f95bb714b99df673cbec73b06de655a488039))
* change buy/sell command examples to btc/usdt ([d233ebb](https://github.com/ExchangeUnion/xud/commit/d233ebbc49e06dbb0273a1e609ee9b9b4395926c))
* change buy/sell command examples to btc/usdt ([#1786](https://github.com/ExchangeUnion/xud/issues/1786)) ([116ffc0](https://github.com/ExchangeUnion/xud/commit/116ffc0fe8e479ab0afdacc76808ef16b9db8f4f))
* **lnd:** totalOutboundAmount ([caf3782](https://github.com/ExchangeUnion/xud/commit/caf37823c2a8363dc7c493f241caa93f6b95c49e))
* **p2p:** handle multiple socket errors ([716f5d3](https://github.com/ExchangeUnion/xud/commit/716f5d3883244a6ef90637ecd2a2a1ee31d3151d)), closes [#1773](https://github.com/ExchangeUnion/xud/issues/1773)
* **p2p:** handle socket write callback errors ([79134fe](https://github.com/ExchangeUnion/xud/commit/79134fe47f4f862697843a51479404766af44f01))
* **p2p:** remove socket listeners after destroy ([8ec4d45](https://github.com/ExchangeUnion/xud/commit/8ec4d45d0b7d0ea049b52f762a0abd5b48525392))
* **rpc:** don't block TradingLimits on failure ([#1784](https://github.com/ExchangeUnion/xud/issues/1784)) ([43ae535](https://github.com/ExchangeUnion/xud/commit/43ae535531ced90a3dba6741de9e33a315625a40)), closes [#1766](https://github.com/ExchangeUnion/xud/issues/1766)
* **swaps:** don't log non-existent route ([#1772](https://github.com/ExchangeUnion/xud/issues/1772)) ([2ff63b9](https://github.com/ExchangeUnion/xud/commit/2ff63b9f4a3f7d69494c4ade5fdc1ac7ee2cd239))


### Features

* **cli:** print no more matches on partial mkt ([2f407d0](https://github.com/ExchangeUnion/xud/commit/2f407d00aac5f1974fee92b76be88aa21daa52d0)), closes [#1596](https://github.com/ExchangeUnion/xud/issues/1596)
* **config:** rename debug.testing to strict ([2a5f74c](https://github.com/ExchangeUnion/xud/commit/2a5f74c6464c159d41c4c92fe877ec5626096f61)), closes [#1757](https://github.com/ExchangeUnion/xud/issues/1757)
* **connext:** add USDT pairs to mainnet ([bf17eab](https://github.com/ExchangeUnion/xud/commit/bf17eab191d880034b53d838dad5d7a850d57ffd))
* **connext:** removeInvoice ([ee56800](https://github.com/ExchangeUnion/xud/commit/ee568003c389ed97ad7287fc3d28663ccfbc9c00)), closes [#1730](https://github.com/ExchangeUnion/xud/issues/1730)
* **connext:** request collateral after deposit ([#1783](https://github.com/ExchangeUnion/xud/issues/1783)) ([728b391](https://github.com/ExchangeUnion/xud/commit/728b391709ab561c48b36960bb28457c7e35897f)), closes [#1756](https://github.com/ExchangeUnion/xud/issues/1756)
* **lnd:** handle delayed macaroon creation ([c15f3db](https://github.com/ExchangeUnion/xud/commit/c15f3db2208af1fde3df95903ed0f08c4d152899))
* **lnd:** no inactive balance in trading limits ([#1764](https://github.com/ExchangeUnion/xud/issues/1764)) ([235dab3](https://github.com/ExchangeUnion/xud/commit/235dab36803b45ced018fe5aece0d9f772b9b046)), closes [#1636](https://github.com/ExchangeUnion/xud/issues/1636)
* **orderbook:** prevent sub-satoshi order & match ([#1785](https://github.com/ExchangeUnion/xud/issues/1785)) ([8a479db](https://github.com/ExchangeUnion/xud/commit/8a479dbc85262085bcfcaafb0d6a9d938639d979)), closes [#1594](https://github.com/ExchangeUnion/xud/issues/1594)
* **p2p:** log whether socket is inbound/outbound ([#1775](https://github.com/ExchangeUnion/xud/issues/1775)) ([87687a5](https://github.com/ExchangeUnion/xud/commit/87687a57d2c410b1bc27af7e061d0fbfb497e7e9))
* **p2p:** non-strict severe reputation events ([6f39fff](https://github.com/ExchangeUnion/xud/commit/6f39fff827e7cd02158c1af5c4c5d7d216d60233))
* **simnet:** add USDT ([69e556b](https://github.com/ExchangeUnion/xud/commit/69e556be1bf56e7eb6d7a2b8a72b2e4497cb6999))
* **simnet:** update USDT contract ([595b2df](https://github.com/ExchangeUnion/xud/commit/595b2df6ae67bdf376e01aa6033edbc54224cd4a))



# [1.0.0-beta.5](https://github.com/ExchangeUnion/xud/compare/v1.0.0-beta.3...v1.0.0-beta.5) (2020-07-06)


### Bug Fixes

* **cli:** accept lower case currencies ([#1629](https://github.com/ExchangeUnion/xud/issues/1629)) ([105ed51](https://github.com/ExchangeUnion/xud/commit/105ed518e7b476d1b4749a0d10c26f0d3a899740)), closes [#1626](https://github.com/ExchangeUnion/xud/issues/1626)
* **connext:** set default lookupPayment status as pending ([#1603](https://github.com/ExchangeUnion/xud/issues/1603)) ([141bcc5](https://github.com/ExchangeUnion/xud/commit/141bcc543e3e70dd6a26346bb517832973d78f48))
* **swaps:** cancel taker invoice on swap fail ([#1704](https://github.com/ExchangeUnion/xud/issues/1704)) ([b13ecdb](https://github.com/ExchangeUnion/xud/commit/b13ecdb3b7ec2c242466acaa70ac36dca85ab786)), closes [#1695](https://github.com/ExchangeUnion/xud/issues/1695)
* **swaps:** lookupPayment return Pending on error ([3d78a55](https://github.com/ExchangeUnion/xud/commit/3d78a55ce9d8cf5f7a07c71d8282633d43318bcd)), closes [#1701](https://github.com/ExchangeUnion/xud/issues/1701)
* remove old exchangeunion.com seed nodes ([#1669](https://github.com/ExchangeUnion/xud/issues/1669)) ([be62fd0](https://github.com/ExchangeUnion/xud/commit/be62fd027b8143866a61d309389149aa9d794ed7))
* **cli:** streamorders handling xud not ready ([#1663](https://github.com/ExchangeUnion/xud/issues/1663)) ([1f9e82f](https://github.com/ExchangeUnion/xud/commit/1f9e82f9e20b710a706af9e6caa620f40cbc425e))
* **p2p:** change connext_address to connext_identifier ([13157b0](https://github.com/ExchangeUnion/xud/commit/13157b050cd9a79961cdf9feaa69eb9fc1fdce48))
* **rpc:** close listeners for streaming calls ([b18d4d7](https://github.com/ExchangeUnion/xud/commit/b18d4d77eb28f90393a460bd36cb3cff4507bcf1)), closes [#1640](https://github.com/ExchangeUnion/xud/issues/1640)
* **swaps:** cancel timer immediately on complete ([883be70](https://github.com/ExchangeUnion/xud/commit/883be70d20cc9c54d6c3deb409068c3f4ac2fe00)), closes [#1634](https://github.com/ExchangeUnion/xud/issues/1634)
* **swaps:** don't try to accept a failed deal ([d827957](https://github.com/ExchangeUnion/xud/commit/d82795759653505c6a3a5fa54c57cb74a5c58c3a)), closes [#1614](https://github.com/ExchangeUnion/xud/issues/1614)
* **swaps:** go to recovery for all failures ([43f38d2](https://github.com/ExchangeUnion/xud/commit/43f38d2816226f91e75ba023ba609b399a4a2ba0)), closes [#1606](https://github.com/ExchangeUnion/xud/issues/1606)
* format ([e32d33c](https://github.com/ExchangeUnion/xud/commit/e32d33c2ef93ae35d42a4a7ecf847529ff957a1c))
* resolve alias for all known nodes ([3cbd2d8](https://github.com/ExchangeUnion/xud/commit/3cbd2d88bd40014a6ac62c7035900415423be77c))


### Features

* **backup:** stop backup on sigterm ([6745f08](https://github.com/ExchangeUnion/xud/commit/6745f08705157b39d01c8f6d3facfc542ba89733))
* **connext:** log all request errors ([54d449e](https://github.com/ExchangeUnion/xud/commit/54d449e8ed80b26e318d490bb2f6ad4014ca19df))
* penalize peers for delaying preimage release ([06a6bde](https://github.com/ExchangeUnion/xud/commit/06a6bdec1af51b79e2fc33d10215558560ee33e5))
* record recovered swap as a trade in db ([b322e2c](https://github.com/ExchangeUnion/xud/commit/b322e2cd0e30c4c5cd516701892b45220decb814))
* SwapRecovery sublogger ([92a423f](https://github.com/ExchangeUnion/xud/commit/92a423ffeb7f24d351116fb0cc58e012a1a459fb))
* **backup:** change log level debug to trace ([2df88c5](https://github.com/ExchangeUnion/xud/commit/2df88c5bd30b9dea5ee984730b592d71f30a8995))
* **backup:** write xud db every 3 minutes max ([#1655](https://github.com/ExchangeUnion/xud/issues/1655)) ([4306fba](https://github.com/ExchangeUnion/xud/commit/4306fba37b65cb903fb15e17b90316a4ea92405e)), closes [#1652](https://github.com/ExchangeUnion/xud/issues/1652) [#1368](https://github.com/ExchangeUnion/xud/issues/1368)
* **config:** enable xud encryption by default ([4f1bc4d](https://github.com/ExchangeUnion/xud/commit/4f1bc4d4386234499d50765177413676862f5795))
* **connext:** log created outgoing hashlock xfers ([84f4d58](https://github.com/ExchangeUnion/xud/commit/84f4d5845f6f31f2ba488957c97c510bb9126a78))
* **connext:** use channel balance as max outgoing ([aea7c2a](https://github.com/ExchangeUnion/xud/commit/aea7c2a1b61413845cc43a355f917f9de1db2fea)), closes [#1609](https://github.com/ExchangeUnion/xud/issues/1609)
* **lnd:** log htlc acceptance ([fa7b13c](https://github.com/ExchangeUnion/xud/commit/fa7b13c9142d64086d0f9edda9eb904e47295ae4))
* **logger:** alert level logging for risk of loss ([a518c3f](https://github.com/ExchangeUnion/xud/commit/a518c3fa82aac625fc46c7a87899796f555ff3e5))
* **swaps:** log when sending payments ([46e2d4e](https://github.com/ExchangeUnion/xud/commit/46e2d4ebf9c54becfe360ff7ff722aff4c05b77e))
* **swaps:** log when we attempt settleInvoice ([90b8d83](https://github.com/ExchangeUnion/xud/commit/90b8d834cfbebb3327cf13add09f5ab03ff328df))
* **swaps:** new PreimageResolved swap phase ([d9d6bb5](https://github.com/ExchangeUnion/xud/commit/d9d6bb5cd743e16197972ff1d2e3e59c477e0c6e)), closes [#1654](https://github.com/ExchangeUnion/xud/issues/1654) [#1659](https://github.com/ExchangeUnion/xud/issues/1659)
* add additional simnet,testnet bootstrap node ([9a03146](https://github.com/ExchangeUnion/xud/commit/9a03146e9deabb43b556648693ee1830feb63046))
* add xud.kilrau.com:8885 mainnet seed ([f249489](https://github.com/ExchangeUnion/xud/commit/f249489c0d07984c211b9be44ce1844c1ee8dc24))
* improve open channel fail logging ([704072e](https://github.com/ExchangeUnion/xud/commit/704072e668f1737479617bad7b1db3478ff6e67f))
* log preimage when revealed from sent payment ([#1664](https://github.com/ExchangeUnion/xud/issues/1664)) ([f3d3b69](https://github.com/ExchangeUnion/xud/commit/f3d3b69c9e0eb3ecdc5ceb8f96920b300ba817cd))
* travis ci badge -> github action badges ([#1682](https://github.com/ExchangeUnion/xud/issues/1682)) ([da1b307](https://github.com/ExchangeUnion/xud/commit/da1b307a5c4739f3c9e86836822a837507f29d4c))
* **rpc/connext:** deposit & openchannel calls ([#1577](https://github.com/ExchangeUnion/xud/issues/1577)) ([ebb715e](https://github.com/ExchangeUnion/xud/commit/ebb715e45aeba8ea42bde26cfd3b7ce54f167912)), closes [#1472](https://github.com/ExchangeUnion/xud/issues/1472) [#1473](https://github.com/ExchangeUnion/xud/issues/1473)
* **swaps:** check payment immediately on recovery ([#1600](https://github.com/ExchangeUnion/xud/issues/1600)) ([6bea4a6](https://github.com/ExchangeUnion/xud/commit/6bea4a61dad128205f184256f1ab1c2460188af3)), closes [#1598](https://github.com/ExchangeUnion/xud/issues/1598)



# [1.0.0-beta.4](https://github.com/ExchangeUnion/xud/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2020-06-09)


### Bug Fixes

* **connext:** set default lookupPayment status as pending ([#1603](https://github.com/ExchangeUnion/xud/issues/1603)) ([141bcc5](https://github.com/ExchangeUnion/xud/commit/141bcc543e3e70dd6a26346bb517832973d78f48))
* **p2p:** change connext_address to connext_identifier ([13157b0](https://github.com/ExchangeUnion/xud/commit/13157b050cd9a79961cdf9feaa69eb9fc1fdce48))
* **swaps:** don't try to accept a failed deal ([d827957](https://github.com/ExchangeUnion/xud/commit/d82795759653505c6a3a5fa54c57cb74a5c58c3a)), closes [#1614](https://github.com/ExchangeUnion/xud/issues/1614)
* **swaps:** go to recovery for all failures ([43f38d2](https://github.com/ExchangeUnion/xud/commit/43f38d2816226f91e75ba023ba609b399a4a2ba0)), closes [#1606](https://github.com/ExchangeUnion/xud/issues/1606)
* format ([e32d33c](https://github.com/ExchangeUnion/xud/commit/e32d33c2ef93ae35d42a4a7ecf847529ff957a1c))
* resolve alias for all known nodes ([3cbd2d8](https://github.com/ExchangeUnion/xud/commit/3cbd2d88bd40014a6ac62c7035900415423be77c))


### Features

* **swaps:** log when sending payments ([46e2d4e](https://github.com/ExchangeUnion/xud/commit/46e2d4ebf9c54becfe360ff7ff722aff4c05b77e))
* add additional simnet,testnet bootstrap node ([9a03146](https://github.com/ExchangeUnion/xud/commit/9a03146e9deabb43b556648693ee1830feb63046))
* add xud.kilrau.com:8885 mainnet seed ([f249489](https://github.com/ExchangeUnion/xud/commit/f249489c0d07984c211b9be44ce1844c1ee8dc24))
* **rpc/connext:** deposit & openchannel calls ([#1577](https://github.com/ExchangeUnion/xud/issues/1577)) ([ebb715e](https://github.com/ExchangeUnion/xud/commit/ebb715e45aeba8ea42bde26cfd3b7ce54f167912)), closes [#1472](https://github.com/ExchangeUnion/xud/issues/1472) [#1473](https://github.com/ExchangeUnion/xud/issues/1473)
* **swaps:** check payment immediately on recovery ([#1600](https://github.com/ExchangeUnion/xud/issues/1600)) ([6bea4a6](https://github.com/ExchangeUnion/xud/commit/6bea4a61dad128205f184256f1ab1c2460188af3)), closes [#1598](https://github.com/ExchangeUnion/xud/issues/1598)


### BREAKING CHANGES

* **p2p:** `connext_address` field in `NodeState` has been renamed
to `connext_identifier`.

Related: https://github.com/opendexnetwork/opendex/issues/28
Closes: https://github.com/ExchangeUnion/xud/issues/1611



# [1.0.0-beta.3](https://github.com/ExchangeUnion/xud/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-06-01)


### Bug Fixes

* **cli:** use localhost when rpc config 0.0.0.0 ([0cdde81](https://github.com/ExchangeUnion/xud/commit/0cdde815be0582a93ddc02bf95c552cf0905ace6))
* **connext:** add 0x prefix to getHashLockStatus ([d470a14](https://github.com/ExchangeUnion/xud/commit/d470a14bcc95a5417a51dc53be5a121bd434afac))
* **connext:** provide preimage for swap recovery ([1724d57](https://github.com/ExchangeUnion/xud/commit/1724d57d5593dc63f1eee7ccf9af73d05da0a8ec))
* **connext:** rebalancer logic for simnet channel opener ([#1540](https://github.com/ExchangeUnion/xud/issues/1540)) ([3896397](https://github.com/ExchangeUnion/xud/commit/389639788c55881c453d818ce3eac7b0952545dd))
* **connext:** unknown send payment error ([c93dfec](https://github.com/ExchangeUnion/xud/commit/c93dfec1caa71d9cb7544e94bc683e98ab5ff7dd))
* **lnd:** relax unhandled openchannel timeout ([b072391](https://github.com/ExchangeUnion/xud/commit/b072391e3553035ee8eed1fed4804e61e8b91f39)), closes [#1405](https://github.com/ExchangeUnion/xud/issues/1405)
* **orderbook:** remainingOrder on retries ([421f0ad](https://github.com/ExchangeUnion/xud/commit/421f0ad821f3c245946ca5780ed14c90e6cf90e5))
* **swaps:** don't cancel invoice on swap timeout ([3c20171](https://github.com/ExchangeUnion/xud/commit/3c201718b4cccaf4530b5d84076c0c186646aa8c)), closes [#1574](https://github.com/ExchangeUnion/xud/issues/1574)
* add `::` to selfaddress detection ([#1489](https://github.com/ExchangeUnion/xud/issues/1489)) ([18aa554](https://github.com/ExchangeUnion/xud/commit/18aa554c8d8092a37d89c8d6bee899f7711587ed))
* add connextUpdate listener when not operational ([3ef792e](https://github.com/ExchangeUnion/xud/commit/3ef792e00484da809d3ceb4a660b4c1fd7432099))
* connectPeerAddresses typo ([#1504](https://github.com/ExchangeUnion/xud/issues/1504)) ([38732ed](https://github.com/ExchangeUnion/xud/commit/38732ed8e7381dba60e7451d39db739b6201afc4))
* ignore npm-shrinkwrap for commit hash ([52689be](https://github.com/ExchangeUnion/xud/commit/52689be0f50abd1fb1bdc13a0fbbdf73386d891b))
* persist node id of peer for swapped order ([7ffa091](https://github.com/ExchangeUnion/xud/commit/7ffa091497632c6a6a3bfbff5d8b2b670bbcf257))
* **swaps:** don't fail payment for complete swap ([#1581](https://github.com/ExchangeUnion/xud/issues/1581)) ([0f9c9ff](https://github.com/ExchangeUnion/xud/commit/0f9c9ff893e4635f78d2c514aa832da5fb64996e)), closes [#1571](https://github.com/ExchangeUnion/xud/issues/1571) [#1569](https://github.com/ExchangeUnion/xud/issues/1569)
* **swaps:** failed payment for completed swap ([274230a](https://github.com/ExchangeUnion/xud/commit/274230adad5c9cb7794a3591b5c7dff823e23fc4)), closes [#1569](https://github.com/ExchangeUnion/xud/issues/1569)
* broadcast invalidation after internal match ([1cc8ec4](https://github.com/ExchangeUnion/xud/commit/1cc8ec4f7b1a34d6f5bede3f77d310bc7f6d91ea)), closes [#1547](https://github.com/ExchangeUnion/xud/issues/1547)
* prevent hang on first updateCapacity call ([#1493](https://github.com/ExchangeUnion/xud/issues/1493)) ([a6b981d](https://github.com/ExchangeUnion/xud/commit/a6b981d130b96d2da483f9a7efd8d9e4c2f98158))
* raiden ([#1552](https://github.com/ExchangeUnion/xud/issues/1552)) ([db3789e](https://github.com/ExchangeUnion/xud/commit/db3789ee9651b2cf3fa159bc7643d39ec9f931bf))
* **cli:** cleaner message if decimal_places NaN ([41d01f9](https://github.com/ExchangeUnion/xud/commit/41d01f9499fb53409e410a58c91db882610f5ccb)), closes [#1539](https://github.com/ExchangeUnion/xud/issues/1539)
* **cli:** handle config file loading error ([824bcd6](https://github.com/ExchangeUnion/xud/commit/824bcd65b5506588c5fde2c6833127cde78890bb))
* **cli:** openchannel push amount ([71b73f8](https://github.com/ExchangeUnion/xud/commit/71b73f846f6c8174c81fa4e231617a567aff5d91))
* **orderbook:** match own orders before peers' ([ca9f26b](https://github.com/ExchangeUnion/xud/commit/ca9f26bfe0fecee2df31a73f5e56dd33f412fbce)), closes [#1206](https://github.com/ExchangeUnion/xud/issues/1206)
* **rpc:** correctly log errors for streaming calls ([55c0c11](https://github.com/ExchangeUnion/xud/commit/55c0c112ee5881de3ad3859dab30f1a393e34fe7))
* **swapclient:** don't initialize if misconfigured ([3168336](https://github.com/ExchangeUnion/xud/commit/3168336c3f9bc4b6c5ca4f194a386aed4188d09e))
* string message grpc error handling ([a1a600d](https://github.com/ExchangeUnion/xud/commit/a1a600d4d0b45e66a7018b3cfb42cb7ae7191555))
* update xud version on every compile ([bc3d4ec](https://github.com/ExchangeUnion/xud/commit/bc3d4ec32e5a74878476b50beeea717df0a3f747)), closes [#1449](https://github.com/ExchangeUnion/xud/issues/1449)


### Features

* **swaps:** use SwapRecovery for maker pay errors ([87dd0d1](https://github.com/ExchangeUnion/xud/commit/87dd0d11b70c495cf861417214679317e95cddbb))
* additional swaps-related logging ([2b385d7](https://github.com/ExchangeUnion/xud/commit/2b385d7da7490bedac8884fcf8b85940dd28f3f1))
* **cli:** automatically determine rpc host/port ([2063fe0](https://github.com/ExchangeUnion/xud/commit/2063fe0dbc2fb5dbd3231638427b030e2f59950b)), closes [#1451](https://github.com/ExchangeUnion/xud/issues/1451)
* **cli:** clarify positional args & add examples ([a0072ee](https://github.com/ExchangeUnion/xud/commit/a0072eec6843f14ae3c7ed97a5db7c44f512d147))
* **cli:** print "successfully" for SwapSuccesses ([de2e6cb](https://github.com/ExchangeUnion/xud/commit/de2e6cb27028e8dd1df19e127f1bd913285f46f0))
* **cli:** print placeorder swapfailure reason ([5355813](https://github.com/ExchangeUnion/xud/commit/5355813075eb762f89824f6179ddb64df6d28b16))
* **cli:** use streaming PlaceOrder by default ([b4e8d9d](https://github.com/ExchangeUnion/xud/commit/b4e8d9db882175236d65b02b344db4e3706e651b))
* **cli:** use ticker format for addpair ([b8b0f9b](https://github.com/ExchangeUnion/xud/commit/b8b0f9b115c32f352e4da7e884c0f61a1e81cb30)), closes [#1521](https://github.com/ExchangeUnion/xud/issues/1521)
* **lnd:** attempt openchannel when connect fails ([d0589ea](https://github.com/ExchangeUnion/xud/commit/d0589ea1e4ed210df67e3957a063a96f693cba6f))
* **p2p:** log reason enum for SwapFailed packet ([f875e1a](https://github.com/ExchangeUnion/xud/commit/f875e1a212cec942e0249bda0f754d68fb6c78c4)), closes [#1499](https://github.com/ExchangeUnion/xud/issues/1499)
* **rpc:** CloseChannel call ([f69fa7c](https://github.com/ExchangeUnion/xud/commit/f69fa7cc16371f345037bfde8612f429916b9c43)), closes [#1471](https://github.com/ExchangeUnion/xud/issues/1471) [#1472](https://github.com/ExchangeUnion/xud/issues/1472) [#1476](https://github.com/ExchangeUnion/xud/issues/1476)
* **rpc:** include aliases in ListOrders ([c865f59](https://github.com/ExchangeUnion/xud/commit/c865f59bca652a70a1ea586d171724e070115e29)), closes [#643](https://github.com/ExchangeUnion/xud/issues/643)
* **rpc:** TradeHistory ([79bed74](https://github.com/ExchangeUnion/xud/commit/79bed74d99f3bb425e8bb36f72390543ca33b901)), closes [#1232](https://github.com/ExchangeUnion/xud/issues/1232)
* **service:** add logger ([8aca0fd](https://github.com/ExchangeUnion/xud/commit/8aca0fdd5033d2d8aa0cd5d8532f35ebc9d0c5ae))
* peer order match events & alias ([fb6ecfd](https://github.com/ExchangeUnion/xud/commit/fb6ecfd584f54120c892af4cdc6fca42db89c384)), closes [#1514](https://github.com/ExchangeUnion/xud/issues/1514)
* testing config option for develoment/tests ([2738b07](https://github.com/ExchangeUnion/xud/commit/2738b075e42f7c374e49bc389ea6b68e934cceb3)), closes [#1496](https://github.com/ExchangeUnion/xud/issues/1496)
* **rpc:** deposit & withdraw calls using lnd ([c306ea3](https://github.com/ExchangeUnion/xud/commit/c306ea32067d2f4f0a7ebfce59c87762c67dddde)), closes [#1062](https://github.com/ExchangeUnion/xud/issues/1062)
* **rpc:** push amount in OpenChannel call ([6bf82f9](https://github.com/ExchangeUnion/xud/commit/6bf82f9ee148388471c42103a73ed061a990801f)), closes [#1464](https://github.com/ExchangeUnion/xud/issues/1464)
* **simnet:** increase ETH channel size ([#1506](https://github.com/ExchangeUnion/xud/issues/1506)) ([1e20723](https://github.com/ExchangeUnion/xud/commit/1e207235ec18ae4ba7932ce09f64b45e3a350e37))
* **swaps:** log full SwapFailureReason name ([0a93f96](https://github.com/ExchangeUnion/xud/commit/0a93f9696c74c07c969bf71d9834cb1dda7155cb)), closes [#1499](https://github.com/ExchangeUnion/xud/issues/1499)



### BREAKING CHANGES

* Remove SwapCompleted phase & packet ([466abf1](https://github.com/ExchangeUnion/xud/commit/466abf1ed3860366703816b86748c5c070246e84))
* `NodeState` packet now contains `connext_address` field

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
