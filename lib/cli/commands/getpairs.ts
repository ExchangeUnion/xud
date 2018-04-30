import command from 'lib/cli/command';

exports.command = 'getpairs';

exports.describe = 'get orderbook\'s available pairs';

function callHandler(xuClient) {
  return xuClient.getPairs();
}

exports.handler = (argv) => {
  command(argv, callHandler);
};
