import { Arguments, Argv } from 'yargs';
import { RemoveAllOrdersRequest, RemoveAllOrdersResponse } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

export const command = 'removeallorders';

export const describe = 'removes all orders';

export const builder = (argv: Argv) => argv.example('$0 removeallorders', describe);

const formatOutput = (response: RemoveAllOrdersResponse.AsObject) => {
  if (response.removedOrderIdsList.length <= 0 && response.onHoldOrderIdsList.length <= 0) {
    console.log('No orders found');
    return;
  }

  if (response.removedOrderIdsList.length) {
    response.removedOrderIdsList.forEach((removedOrder) => console.log(`Removed order with id ${removedOrder}`));
  }
  if (response.onHoldOrderIdsList.length) {
    response.onHoldOrderIdsList.forEach((id) =>
      console.log(`Order with id ${id} has a hold for a pending swap and will be removed afterwards`),
    );
  }
};

export const handler = async (argv: Arguments<any>) => {
  (await loadXudClient(argv)).removeAllOrders(new RemoveAllOrdersRequest(), callback(argv, formatOutput));
};
