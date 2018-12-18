import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ExecuteSwapRequest } from '../../proto/xudrpc_pb';

export const command = 'executeswap <pair_id> <order_id> <peer_pub_key> [quantity]';

export const describe = 'execute a swap on a peer order (nomatching mode only)';

export const builder = {
  order_id: {
    type: 'string',
  },
  pair_id: {
    type: 'string',
  },
  peer_pub_key: {
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
  request.setPeerPubKey(argv.peer_pub_key);
  request.setQuantity(argv.quantity);
  loadXudClient(argv).executeSwap(request, callback(argv));
};
