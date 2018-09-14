import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { GetOrdersRequest } from '../../proto/xudrpc_pb';

export const command = 'getorders [pair_id] [max_results]';

export const describe = 'get orders from the order book';

export const builder = {
  pair_id: {
    type: 'string',
  },
  max_results: {
    default: 10,
    description: 'max # of orders to return, 0 = no limit',
    type: 'number',
  },
};

export const handler = (argv: Arguments) => {
  const request = new GetOrdersRequest();
  const pairId = argv.pair_id ? argv.pair_id.toUpperCase() : undefined;
  request.setPairId(pairId);
  request.setMaxResults(argv.max_results);
  request.setIncludeOwnOrders(true);
  loadXudClient(argv).getOrders(request, callback);
};
