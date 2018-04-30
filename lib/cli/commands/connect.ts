import command from 'lib/cli/command';

exports.command = 'connect <host> [port]';

exports.describe = 'connect to an xu node';

exports.builder = {
  host: {
    description: 'target p2p server host',
    type: 'string',
  },
  port: {
    description: 'target p2p server port',
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
