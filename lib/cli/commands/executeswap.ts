import Table, { VerticalTable } from 'cli-table3';
import colors from 'colors/safe';
import { Arguments, Argv } from 'yargs';
import { ExecuteSwapRequest, SwapSuccess } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';
import { coinsToSats } from '../utils';

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

// export const describe = 'execute a swap on a peer order (nomatching mode only)';
export const describe = undefined;

export const builder = (argv: Argv) =>
  argv.positional('order_id', { type: 'string' }).positional('pair_id', { type: 'string' }).option('quantity', {
    type: 'number',
    description: 'the quantity to swap; the whole order will be swapped if unspecified',
  });

export const handler = async (argv: Arguments<any>) => {
  const request = new ExecuteSwapRequest();
  request.setOrderId(argv.order_id);
  request.setPairId(argv.pair_id);
  if (argv.quantity) {
    request.setQuantity(coinsToSats(argv.quantity));
  }
  (await loadXudClient(argv)).executeSwap(request, callback(argv, displaySwapSuccess));
};
