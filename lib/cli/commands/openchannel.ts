import { Arguments, Argv } from 'yargs';
import { OpenChannelRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';
import { coinsToSats } from '../utils';

export const command = 'openchannel <currency> <amount> [node_identifier] [push_amount] [fee]';

export const describe = 'open a payment channel with a peer';

export const builder = (argv: Argv) =>
  argv
    .positional('currency', {
      description: 'the ticker symbol for the currency',
      type: 'string',
    })
    .positional('amount', {
      type: 'number',
      description: 'the amount to be deposited into the channel',
    })
    .option('node_identifier', {
      description: 'the node key or alias of the connected peer to open the channel with',
      type: 'string',
    })
    .option('push_amount', {
      type: 'number',
      description: 'the amount to be pushed to the remote side of the channel',
      default: 0,
    })
    .option('fee', {
      type: 'number',
      description:
        'the manual fee rate set in sat/byte that should be used when crafting the funding transaction in the channel',
      default: 0,
    })
    .example(
      '$0 openchannel BTC 0.1 028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0b',
      'open an 0.1 BTC channel by node key',
    )
    .example('$0 openchannel BTC 0.1 CheeseMonkey', 'open an 0.1 BTC channel by alias')
    .example(
      '$0 openchannel BTC 0.1 CheeseMonkey 0.05',
      'open an 0.1 BTC channel by alias and push 0.05 to remote side',
    )
    .example(
      '$0 openchannel BTC 0.1 CheeseMonkey 0.05 1',
      'open an 0.1 BTC channel by alias, push 0.05 to remote side with 1 sat per byte',
    )
    .example('$0 openchannel ETH 0.5', 'deposit 0.5 into an ETH Connext channel without specifying a remote node');

export const handler = async (argv: Arguments<any>) => {
  if (isNaN(argv.amount)) {
    throw 'amount must be a number';
  }

  const request = new OpenChannelRequest();
  if (argv.node_identifier) {
    request.setNodeIdentifier(argv.node_identifier);
  }
  request.setCurrency(argv.currency.toUpperCase());
  request.setAmount(coinsToSats(argv.amount));
  request.setPushAmount(coinsToSats(argv.push_amount));
  request.setFee(argv.fee);

  (await loadXudClient(argv)).openChannel(request, callback(argv));
};
