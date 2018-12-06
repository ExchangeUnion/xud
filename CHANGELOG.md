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



