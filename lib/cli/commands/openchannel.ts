import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { OpenChannelRequest } from '../../proto/xudrpc_pb';
import { coinsToSats } from '../utils';

export const command = 'openchannel <node_identifier> <currency> <amount>';

export const describe = 'open a payment channel with a peer';

export const builder = {
  node_identifier: {
    description: 'the node key or alias of the connected peer to open the channel with',
    type: 'string',
  },
  currency: {
    description: 'the ticker symbol for the currency',
    type: 'string',
  },
  amount: {
    type: 'number',
    description: 'the amount to be deposited into the channel',
  },
};

export const handler = (argv: Arguments<any>) => {
  const request = new OpenChannelRequest();
  request.setNodeIdentifier(argv.node_identifier);
  request.setCurrency(argv.currency.toUpperCase());
  request.setAmount(coinsToSats(argv.amount));
  loadXudClient(argv).openChannel(request, callback(argv));
};
