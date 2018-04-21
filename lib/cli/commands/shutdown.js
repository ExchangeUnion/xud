const command = require('../command');

exports.command = 'shutdown';

exports.describe = 'gracefully shutdown the xud node';

function callHandler(xuClient) {
  return xuClient.shutdown();
}

exports.handler = (argv) => {
  command(argv, callHandler);
};
