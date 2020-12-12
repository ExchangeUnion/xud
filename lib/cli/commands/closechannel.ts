import { Arguments, Argv } from 'yargs';
import { CloseChannelRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';
import { coinsToSats } from '../utils';

export const command = 'closechannel <currency> [node_identifier] [--force] [fee]';

export const describe = 'close any payment channels with a peer';

export const builder = (argv: Argv) =>
  argv
    .positional('currency', {
      description: 'the ticker symbol for the currency',
      type: 'string',
    })
    .option('node_identifier', {
      description: 'the node key or alias of the connected peer to close the channel with',
      type: 'string',
    })
    .option('force', {
      type: 'boolean',
      description: 'whether to force close if the peer is offline',
    })
    .option('destination', {
      type: 'string',
      description: 'the on-chain address to send funds extracted from the channel',
    })
    .option('amount', {
      type: 'number',
      description: 'for Connext only - the amount to extract from the channel',
    })
    .option('fee', {
      type: 'number',
      description:
        'the manual fee rate set in sat/byte that should be used when crafting the closure transaction in the channel',
      default: 0,
    })
    .example(
      '$0 closechannel BTC 028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0b',
      'close BTC channels by node key',
    )
    .example('$0 closechannel BTC CheeseMonkey', 'close BTC channels by alias')
    .example('$0 closechannel BTC CheeseMonkey --force', 'force close BTC channels by alias')
    .example('$0 closechannel BTC CheeseMonkey --fee 25', 'close BTC channels by alias with 25 sat/byte fee')
    .example(
      '$0 closechannel ETH --amount 0.1 --destination 0x7d3447e35c73903C971761AF3DBa76cDB1Cd07e2',
      'remove 0.1 ETH from a Connext channel',
    );

export const handler = async (argv: Arguments<any>) => {
  const request = new CloseChannelRequest();
  if (argv.node_identifier) {
    request.setNodeIdentifier(argv.node_identifier);
  }
  request.setCurrency(argv.currency.toUpperCase());
  if (argv.destination) {
    request.setDestination(argv.destination);
  }
  if (argv.amount) {
    request.setAmount(coinsToSats(argv.amount));
  }
  if (argv.force) {
    request.setForce(argv.force);
  }
  request.setFee(argv.fee);
  (await loadXudClient(argv)).closeChannel(request, callback(argv));
};
