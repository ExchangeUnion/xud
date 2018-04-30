import command from 'lib/cli/command';

exports.command = 'tokenswap <identifier> <role> <sending_amount> <sending_token> <receiving_amount> <receiving_token>';

exports.describe = 'perform a raiden token swap';

exports.builder = {
  sending_amount: {
    type: 'number',
  },
  receiving_amount: {
    type: 'number',
  },
};

function callHandler(xuClient, argv) {
  const payload = {
    role: argv.role,
    sending_amount: argv.sending_amount,
    sending_token: argv.sending_token,
    receiving_amount: argv.receiving_amount,
    receiving_token: argv.receiving_token,
  };
  return xuClient.tokenSwap(argv.target_address, payload, argv.identifier);
}

exports.handler = (argv) => {
  command(argv, callHandler);
};
