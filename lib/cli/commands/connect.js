const command = require('../command');

exports.command = 'connect <p2p.host> [p2p.port]';

exports.describe = 'connect to an xu node';

exports.builder = {
  'p2p.host': {
    type: 'number',
  },
  'p2p.port': {
    type: 'number',
    default: '8885',
  },
};

function callHandler(xuClient, argv) {
  return xuClient.connect(argv.p2p.host, argv.p2p.port);
}

exports.handler = (argv) => {
  command(argv, callHandler);
};
