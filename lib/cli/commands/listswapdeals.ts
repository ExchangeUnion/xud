import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ListSwapDealsRequest } from '../../proto/xudrpc_pb';

export const command = 'listswapdeals';

export const describe = 'get completed swap deals';

export const handler = (argv: Arguments) => {
  loadXudClient(argv).listSwapDeals(new ListSwapDealsRequest(), callback);
};
