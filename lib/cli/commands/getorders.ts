import command from 'lib/cli/command';

exports.command = 'getorders';

exports.describe = 'get orders from the orderbook';

function callHandler(xuClient) {
  return xuClient.getOrders();
}

exports.handler = (argv) => {
  command(argv, callHandler);
};
