import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ExecuteSwapRequest } from '../../proto/xudrpc_pb';

export const command = 'executeswap <pair_id> <maker_order_id> <maker_peer_pub_key> <taker_order_id>';

export const describe = 'execute a swap on between a maker peer order and a taker own order (nomatching mode only)';

export const builder = {
  pair_id: {
    type: 'string',
  },
  maker_order_id: {
    type: 'string',
  },
  maker_peer_pub_key: {
    type: 'string',
  },
  taker_order_id: {
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new ExecuteSwapRequest();
  request.setPairId(argv.pair_id);
  request.setMakerOrderId(argv.maker_order_id);
  request.setMakerPeerPubKey(argv.maker_peer_pub_key);
  request.setTakerOrderId(argv.taker_order_id);
  loadXudClient(argv).executeSwap(request, callback);
};
