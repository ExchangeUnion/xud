import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ExecuteSwapRequest } from '../../proto/xudrpc_pb';
import { coinsToSats } from '../utils';

export const command = 'executeswap <pair_id> <order_id> [quantity]';

export const describe = 'execute a swap on a peer order (nomatching mode only)';

export const builder = {
  order_id: {
    type: 'string',
  },
  pair_id: {
    type: 'string',
  },
  quantity: {
    type: 'number',
    description: 'the quantity to swap. the whole order will be swapped if unspecified',
  },
};

export const handler = (argv: Arguments) => {
  const request = new ExecuteSwapRequest();
  request.setOrderId(argv.order_id);
  request.setPairId(argv.pair_id);
  request.setQuantity(coinsToSats(argv.quantity));
  loadXudClient(argv).executeSwap(request, callback(argv));
};
