import { Arguments, Argv } from 'yargs';
import { RemovePairRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

export const command = 'removepair <pair_id>';

export const describe = 'remove a trading pair';

export const builder = (argv: Argv) =>
  argv
    .positional('pair_id', {
      description: 'the trading pair ticker to remove',
      type: 'string',
    })
    .example('$0 removepair LTC/BTC', 'remove the LTC/BTC trading pair');

export const handler = async (argv: Arguments<any>) => {
  const request = new RemovePairRequest();
  request.setPairId(argv.pair_id.toUpperCase());
  (await loadXudClient(argv)).removePair(request, callback(argv));
};
