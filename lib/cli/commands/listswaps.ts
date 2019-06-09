import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ListSwapsRequest, ListSwapsResponse, SwapSuccess } from '../../proto/xudrpc_pb';
import Table , { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';

const FAILED_HEADERS = [
  colors.blue('peer public key'),
  colors.blue('order id'),
  colors.blue('trading pair'),
  colors.blue('quantity'),
  colors.blue('failure reason'),
];
// TODO: create a function that generates these tables
const SUCCESS_HEADERS = [
  colors.blue('peer public key'),
  colors.blue('order id'),
  colors.blue('local id'),
  colors.blue('trading pair'),
  colors.blue('quantity'),
  colors.blue('price'),
  colors.blue('amount sent'),
  colors.blue('amount received'),
  colors.blue('currency received'),
  colors.blue('currency send'),
  colors.blue('role'),
  colors.blue('rhash'),
  colors.blue('rpreimage'),
];

const displaySwaps = (swaps: ListSwapsResponse.AsObject) => {
  const failedTable = new Table({ head: FAILED_HEADERS }) as HorizontalTable;
  const successTable = new Table({ head: SUCCESS_HEADERS }) as HorizontalTable;

  swaps.swapsList.forEach((swap) => {
    if (swap.swapFailure) {
      const fail = swap.swapFailure;
      failedTable.push([
        fail.peerPubKey,
        fail.orderId,
        fail.pairId,
        fail.quantity,
        fail.failureReason,
      ]);
    } else {
      const success = swap.swapSuccess!;
      successTable.push([
        success.peerPubKey,
        success.orderId,
        success.localId,
        success.pairId,
        success.quantity,
        success.price,
        success.amountSent,
        success.amountReceived,
        success.currencyReceived,
        success.currencySent,
        success.role,
        success.rHash,
        success.rPreimage,
      ]);
    }
  });

  console.log(colors.underline(colors.bold('\Failed Swaps:')));
  console.log(failedTable.toString());
  console.log(colors.underline(colors.bold('\Successful Swaps:')));
  console.log(successTable.toString());
};

export const command = 'listswaps [limit] [status]';

export const builder = {
  limit: {
    description: 'the maximum number of deals to list',
    type: 'number',
    default: 0,
  },
  status: {
    description: 'list failed deals',
    type: 'number',
    default: 0,
  },
};

export const describe = 'list completed or failed swaps';

export const handler = (argv: Arguments) => {
  const request = new ListSwapsRequest();
  request.setLimit(argv.limit);
  request.setRequestedSwapState(argv.status);
  loadXudClient(argv).listSwaps(request, callback(argv, displaySwaps));
};
