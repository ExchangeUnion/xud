import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ListSwapsRequest } from '../../proto/xudrpc_pb';

export const command = 'listswaps [limit] [failed] [all]';

export const builder = {
  limit: {
    description: 'the maximum number of deals to display',
    type: 'number',
    default: 0,
  },
  all: {
    description: 'display list deals',
    type: 'boolean',
    default: false,
  },
  failed: {
    description: 'display list failed deals',
    type: 'boolean',
    default: false,
  },
};

export const describe = 'get completed swap deals';

export const handler = (argv: Arguments) => {
  const request = new ListSwapsRequest();
  request.setLimit(argv.limit);
  request.setFailed(argv.failed);
  request.setAll(argv.all);
  loadXudClient(argv).listSwaps(request, callback(argv));
};
