import { Arguments } from 'yargs';
import { WithdrawRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

export const command = 'withdraw <amount> <currency> <destination> [fee]';

export const describe = 'withdraws on-chain funds from xud';

export const builder = {
  amount: {
    description: 'the amount to withdraw',
    type: 'number',
  },
  currency: {
    description: 'the ticker symbol of the currency to withdraw.',
    type: 'string',
  },
  destination: {
    description: 'the address to send withdrawn funds to',
    type: 'string',
  },
  fee: {
    description: 'the fee in satoshis (or equivalent) per byte',
    type: 'number',
  },
  all: {
    description: 'whether to withdraw all available funds for the specified currency',
    type: 'boolean',
  },
};

export const handler = async (argv: Arguments<any>) => {
  const request = new WithdrawRequest();
  request.setCurrency(argv.currency);
  if (argv.all) {
    request.setAll(argv.all);
  } else {
    request.setAmount(argv.amount);
  }
  request.setDestination(argv.destination);
  request.setFee(argv.fee);

  (await loadXudClient(argv)).withdraw(request, callback(argv));
};
