const command = require('../command');

exports.command = 'placeorder <pairId> <price> <quantity>';

exports.describe = 'place an order';

exports.builder = {
  price: {
    type: 'number',
  },
  quantity: {
    type: 'number',
  },
  pairId: {
    type: 'string',
  },
};

function callHandler(xuClient, argv) {
  const order = {
    price: argv.price,
    quantity: argv.quantity,
    pairId: argv.pairId,
  };
  return xuClient.placeOrder(order);
}

exports.handler = (argv) => {
  command(argv, callHandler);
};
