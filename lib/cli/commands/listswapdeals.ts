import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ListSwapDealsRequest } from '../../proto/xudrpc_pb';

export const command = 'listswapdeals [all]';

export const builder = {
  all: {
    description: 'list both failed/succeeded deals',
    type: 'boolean',
    default: false,
  },
};

export const describe = 'get completed swap deals';

export const handler = (argv: Arguments) => {
  const request = new ListSwapDealsRequest();
  request.setAll(argv.all);
  loadXudClient(argv).listSwapDeals(request, callback(argv));
};
