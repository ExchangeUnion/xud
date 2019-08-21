import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ExecuteSwapRequest, SwapSuccess } from '../../proto/xudrpc_pb';
import { coinsToSats } from '../utils';
import Table, { VerticalTable } from 'cli-table3';
import colors from 'colors/safe';

const displaySwapSuccess = (swap: SwapSuccess.AsObject) => {
  const table = new Table() as VerticalTable;
  const obj: any = swap;
  Object.keys(obj).forEach((key: any) => {
    table.push({ [key]: obj[key] });
  });
  console.log(colors.underline(colors.bold('\nSwap success result:')));
  console.log(table.toString());
};

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
  loadXudClient(argv).executeSwap(request, callback(argv, displaySwapSuccess));
};
