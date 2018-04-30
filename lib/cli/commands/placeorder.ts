import command from 'lib/cli/command';

exports.command = 'placeorder <pair_id> <price> <quantity>';

exports.describe = 'place an order';

exports.builder = {
  price: {
    type: 'number',
  },
  quantity: {
    type: 'number',
  },
  pair_id: {
    type: 'string',
  },
};

function callHandler(xuClient, argv) {
  const order = {
    price: argv.price,
    quantity: argv.quantity,
    pairId: argv.pair_id,
  };
  return xuClient.placeOrder(order);
}

exports.handler = (argv) => {
  command(argv, callHandler);
};
