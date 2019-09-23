import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ListSwapsRequest, ListSwapsResponse } from '../../proto/xudrpc_pb';
import Table , { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';
import { SwapRole } from '../../constants/enums';

const SUCCESS_HEADERS = [
  colors.blue('Peer Public Key'),
  colors.blue('Local Id'),
  colors.blue('Amount Sent'),
  colors.blue('Amount Received'),
  colors.blue('Currency Received'),
  colors.blue('Currency Sent'),
  colors.blue('Role'),
  colors.blue('Swap Hash'),
];
const FAILED_HEADERS = [
  ...SUCCESS_HEADERS,
  colors.blue('Failure Reason'),
];

const trimPubKey = (key: string) => {
  if (key.length <= 0) {
    return '';
  }
  if (key.length <= 10) return key;

  return `${key.slice(0, 10)}...${key.slice(key.length - 10)}`;
};

const displaySwaps = (swaps: ListSwapsResponse.AsObject) => {
  const failedTable = new Table({ head: FAILED_HEADERS }) as HorizontalTable;
  const successTable = new Table({ head: SUCCESS_HEADERS }) as HorizontalTable;

  swaps.swapsList.forEach((swap) => {
    const element = [
      trimPubKey(swap.peerPubKey),
      swap.localId,
      swap.amountSent,
      swap.amountReceived,
      swap.currencyReceived,
      swap.currencySent,
      SwapRole[swap.role],
      trimPubKey(swap.rHash),
    ];

    if (swap.failureReason) {
      element.push(swap.failureReason);
      failedTable.push(element);
    } else {
      successTable.push(element);
    }
  });

  if (successTable.length > 0) {
    console.log(colors.underline(colors.bold('\Successful Swaps:')));
    console.log(successTable.toString());
  }

  if (failedTable.length > 0) {
    console.log(colors.underline(colors.bold('\Failed Swaps:')));
    console.log(failedTable.toString());
  }
};

export const command = 'listswaps [limit] [status]';

export const builder = {
  limit: {
    description: 'the maximum number of deals to list',
    type: 'number',
    default: 10,
  },
  status: {
    description: '0=all, 1=failed',
    type: 'number',
  },
};

export const describe = 'list completed or failed swaps';

export const handler = (argv: Arguments) => {
  const request = new ListSwapsRequest();
  request.setLimit(argv.limit);
  request.setRequestedSwapState(argv.status);
  loadXudClient(argv).listSwaps(request, callback(argv, displaySwaps));
};
