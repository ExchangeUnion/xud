import { Arguments, Argv } from 'yargs';
import { CloseChannelRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

export const command = 'closechannel <node_identifier> <currency> [--force]';

export const describe = 'close any payment channels with a peer';

export const builder = (argv: Argv) => argv
  .positional('node_identifier', {
    description: 'the node key or alias of the connected peer to close the channel with',
    type: 'string',
  })
  .positional('currency', {
    description: 'the ticker symbol for the currency',
    type: 'string',
  })
  .option('force', {
    type: 'boolean',
    description: 'whether to force close if the peer is offline',
  })
  .example('$0 closechannel 028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0b BTC', 'close BTC channels by node key')
  .example('$0 closechannel CheeseMonkey BTC', 'close BTC channels by alias')
  .example('$0 closechannel CheeseMonkey BTC --force', 'force close BTC channels by alias');

export const handler = async (argv: Arguments<any>) => {
  const request = new CloseChannelRequest();
  request.setNodeIdentifier(argv.node_identifier);
  request.setCurrency(argv.currency.toUpperCase());
  if (argv.force) {
    request.setForce(argv.force);
  }
  (await loadXudClient(argv)).closeChannel(request, callback(argv));
};
