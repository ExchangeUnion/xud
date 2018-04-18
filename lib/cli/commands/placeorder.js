const command = require('../command');

exports.command = 'placeorder <pair> <price> <quantity>';

exports.describe = 'place an order';

exports.builder = {
  price: {
    type: 'number',
  },
  quantity: {
    type: 'number',
  },
};

function callHandler(xuClient, argv) {
  const order = {
    price: argv.price,
    quantity: argv.quantity,
    pairId: argv.pair,
  };
  return xuClient.placeOrder(order);
}

exports.handler = (argv) => {
  command(argv, callHandler);
};
