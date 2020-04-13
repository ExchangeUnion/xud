import { Arguments } from 'yargs';
import { CloseChannelRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

export const command = 'closechannel <node_identifier> <currency> [--force]';

export const describe = 'close any payment channels with a peer';

export const builder = {
  node_identifier: {
    description: 'the node key or alias of the connected peer to close the channel with',
    type: 'string',
  },
  currency: {
    description: 'the ticker symbol for the currency',
    type: 'string',
  },
  force: {
    type: 'boolean',
    description: 'whether to force close if the peer is offline',
  },
};

export const handler = async (argv: Arguments<any>) => {
  const request = new CloseChannelRequest();
  request.setNodeIdentifier(argv.node_identifier);
  request.setCurrency(argv.currency.toUpperCase());
  if (argv.force) {
    request.setForce(argv.force);
  }
  (await loadXudClient(argv)).closeChannel(request, callback(argv));
};
