const command = require('../command');

exports.command = 'connect <p2p_host> [p2p_port]';

exports.describe = 'connect to an xu node';

exports.builder = {
  p2p_host: {
    type: 'string',
  },
  p2p_port: {
    type: 'number',
    default: '8885',
  },
};

function callHandler(xuClient, argv) {
  return xuClient.connect(argv.p2p_host, argv.p2p_port);
}

exports.handler = (argv) => {
  command(argv, callHandler);
};
