import { Arguments, Argv } from 'yargs';
import { CancelAllOrdersRequest, CancelAllOrdersResponse } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

export const command = 'cancelallorders';

export const describe = 'removes all orders';

export const builder = (argv: Argv) => argv
    .example('$0 cancelallorders', describe);

const formatOutput = (response: CancelAllOrdersResponse.AsObject) => {
  if (response.removedOrderIdsList.length) {
    response.removedOrderIdsList.forEach((removedOrder => console.log(`Cancelled order with id ${removedOrder}`)));
  } else {
    console.log('No orders found');
  }
};

export const handler = async (argv: Arguments<any>) => {
  (await loadXudClient(argv)).cancelAllOrders(new CancelAllOrdersRequest(), callback(argv, formatOutput));
};
