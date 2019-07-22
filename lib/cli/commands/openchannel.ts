import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { OpenChannelRequest } from '../../proto/xudrpc_pb';
import { coinsToSats } from '../utils';

export const command = 'openchannel <nodePubKey> <currency> <amount>';

export const describe = 'open a payment channel';

export const builder = {
  nodePubKey: {
    description: 'The node pub key of the peer to open the channel with',
    type: 'string',
  },
  currency: {
    description: 'The ticker symbol for the currency',
    type: 'string',
  },
  amount: {
    type: 'number',
    description: 'The amount of the channel',
  },
};

export const handler = (argv: Arguments) => {
  const request = new OpenChannelRequest();
  request.setNodePubKey(argv.nodePubKey);
  request.setCurrency(argv.currency.toUpperCase());
  request.setAmount(coinsToSats(argv.amount));
  loadXudClient(argv).openChannel(request, callback(argv));
};
