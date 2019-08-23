import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ListSwapsRequest, ListSwapsResponse } from '../../proto/xudrpc_pb';
import Table , { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';

const FAILED_HEADERS = [
  colors.blue('Peer Public key'),
  colors.blue('Failure Reason'),
];
// TODO: create a function that generates these tables
const SUCCESS_HEADERS = [
  colors.blue('Peer Public Key'),
  colors.blue('Local Id'),
  colors.blue('Amount Sent'),
  colors.blue('Amount Received'),
  colors.blue('Currency Received'),
  colors.blue('Currency Send'),
  colors.blue('Role'),
  colors.blue('Swap Hash'),
];

const displaySwaps = (swaps: ListSwapsResponse.AsObject) => {
  const failedTable = new Table({ head: FAILED_HEADERS }) as HorizontalTable;
  const successTable = new Table({ head: SUCCESS_HEADERS }) as HorizontalTable;

  swaps.swapsList.forEach((swap) => {
    if (swap.swapFailure) {
      const fail = swap.swapFailure;
      failedTable.push([
        fail.peerPubKey,
        fail.failureReason,
      ]);
    } else {
      const success = swap.swapSuccess!;
      successTable.push([
        success.peerPubKey,
        success.localId,
        success.amountSent,
        success.amountReceived,
        success.currencyReceived,
        success.currencySent,
        success.role,
        success.rHash,
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
    description: '0=all, 1=completed, 2=failed',
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
