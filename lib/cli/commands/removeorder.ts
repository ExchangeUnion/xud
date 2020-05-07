import { Arguments, Argv } from 'yargs';
import { RemoveOrderRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';
import { coinsToSats } from '../utils';

export const command = 'removeorder <order_id> [quantity]';

export const describe = 'remove an order';

export const builder = (argv: Argv) => argv
  .positional('order_id', {
    type: 'string',
  })
  .option('quantity', {
    type: 'number',
    describe: 'quantity to remove; if unspecified the entire order is removed',
  })
  .example('$0 removeorder 79d2cd30-8a26-11ea-90cf-439fb244cf44', 'remove an order by id')
  .example('$0 removeorder 79d2cd30-8a26-11ea-90cf-439fb244cf44 0.1', 'remove 0.1 quantity from an order by id');

export const handler = async (argv: Arguments<any>) => {
  const request = new RemoveOrderRequest();
  request.setOrderId(argv.order_id);
  if (argv.quantity) {
    request.setQuantity(coinsToSats(argv.quantity));
  }
  (await loadXudClient(argv)).removeOrder(request, callback(argv));
};
