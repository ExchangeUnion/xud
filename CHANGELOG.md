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



