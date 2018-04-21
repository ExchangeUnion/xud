const command = require('../command');

exports.command = 'connect <host> [port]';

exports.describe = 'connect to an xu node';

exports.builder = {
  host: {
    type: 'number',
  },
  port: {
    type: 'number',
    default: '8885',
  },
};

function callHandler(xuClient, argv) {
  return xuClient.connect(argv.host, argv.port);
}

exports.handler = (argv) => {
  command(argv, callHandler);
};
