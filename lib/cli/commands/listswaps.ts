import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ListSwapsRequest } from '../../proto/xudrpc_pb';

export const command = 'listswaps [limit] [failed]';

export const builder = {
  limit: {
    description: 'the maximum number of deals to display',
    type: 'number',
    default: 0,
  },
  status: {
    description: 'display list failed deals',
    type: 'boolean',
    default: ListSwapsRequest.Status.BOTH,
  },
};

export const describe = 'get completed swap deals';

export const handler = (argv: Arguments) => {
  const request = new ListSwapsRequest();
  request.setLimit(argv.limit);
  request.setStatus(argv.status);
  loadXudClient(argv).listSwaps(request, callback(argv));
};
