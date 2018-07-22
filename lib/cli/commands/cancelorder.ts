import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { CancelOrderRequest } from '../../proto/xudrpc_pb';

export const command = 'cancelorder <id> <pair_id>';

export const describe = 'cancel an order';

export const builder = {
  id: {
    type: 'string',
  },
  pairId: {
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new CancelOrderRequest();
  request.setId(argv.id);
  request.setPairId(argv.pairId);
  loadXudClient(argv).cancelOrder(request, callback);
};
