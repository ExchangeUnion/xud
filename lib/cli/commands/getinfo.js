const command = require('../command');

exports.command = 'getinfo';

exports.describe = 'get general info from the xud node';

function callHandler(xuClient) {
  return xuClient.getInfo();
}

exports.handler = (argv) => {
  command(argv, callHandler);
};
