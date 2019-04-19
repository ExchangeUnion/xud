import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ListOrderHistoryRequest } from '../../proto/xudrpc_pb';

export const command = 'listorderhistory <order_id>';

export const describe = 'list all events related to the order since entered until fully removed from the orderbook';

export const builder = {
  order_id: {
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new ListOrderHistoryRequest();
  request.setOrderId(argv.order_id);
  loadXudClient(argv).listOrderHistory(request);
};
