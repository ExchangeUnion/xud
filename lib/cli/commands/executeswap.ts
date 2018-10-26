import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ExecuteSwapRequest } from '../../proto/xudrpc_pb';

export const command = 'executeswap <pair_id> <maker_order_id> <maker_peer_pub_key> <taker_order_id>';

export const describe = 'execute a swap on between a maker peer order and a taker own order (nomatching mode only)';

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
    default: undefined
  },
};

export const handler = (argv: Arguments) => {
  const request = new ExecuteSwapRequest();
  request.setOrderId(argv.maker_order_id);
  request.setPairId(argv.pair_id);
  request.setPeerPubKey(argv.maker_peer_pub_key);
  request.setQuantity(argv.quantity)
  loadXudClient(argv).executeSwap(request, callback);
};
