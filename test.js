var quantile = require("distributions-poisson-quantile")

const x = Date.now();
const ltcMins = quantile(.9999, {lambda: 576}) * 2.5;
console.log(ltcMins);
const btcBlocks = quantile(.9999, {lambda: ltcMins / 10});
console.log(btcBlocks);
console.log(btcBlocks - 144);
console.log(Date.now() - x);