import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { RemovePairRequest } from '../../proto/xudrpc_pb';

export const command = 'removepair <pair_id>';

export const describe = 'remove a trading pair';

export const builder = {
  pair_id: {
    description: 'The trading pair ticker to remove',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new RemovePairRequest();
  request.setPairId(argv.pair_id.toUpperCase());
  loadXudClient(argv).removePair(request, callback(argv));
};
