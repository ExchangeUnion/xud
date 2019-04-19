import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ListSwapsRequest } from '../../proto/xudrpc_pb';

export const command = 'listswaps [limit] [status]';

export const builder = {
  limit: {
    description: 'the maximum number of deals to list',
    type: 'number',
    default: 0,
  },
  status: {
    description: 'list failed deals',
    type: 'boolean',
    default: ListSwapsRequest.RequestedSwapState.BOTH,
  },
};

export const describe = 'list completed or failed swaps';

export const handler = (argv: Arguments) => {
  const request = new ListSwapsRequest();
  request.setLimit(argv.limit);
  request.setRequestedSwapState(argv.status);
  loadXudClient(argv).listSwaps(request, callback(argv));
};
