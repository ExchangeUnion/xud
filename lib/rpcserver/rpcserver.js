const jsonrpc = require('http-jsonrpc-server');
const orderbook = require('../orderbook/orderbook');
const lndclient = require('../lndclient/lndclient');

const PORT = 8885;

async function getInfo() {
  await lndclient.getInfo();
}

async function getOrderbook() {
  return orderbook.getOrderbook();
}

async function placeOrder(params) {
  return orderbook.placeOrder(params.order);
}

function start() {
  jsonrpc.listen(PORT);
}

jsonrpc.setMethod('getInfo', getInfo);
jsonrpc.setMethod('getOrderbook', getOrderbook);
jsonrpc.setMethod('placeOrder', placeOrder);

exports.start = start;
