import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ListPairsRequest, ListPairsResponse } from '../../proto/xudrpc_pb';
import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';
import { getPairId } from '../../utils/utils';

const HEADERS = [
  colors.red('PairId'),
  colors.green('Base'),
  colors.red('Quote'),
];

const formatPairs = (pairs: ListPairsResponse.AsObject): string[][] => {
  const formatted: string[][] = [];
  pairs.pairsList.forEach((pair) => {
    const pairString = getPairId(pair);
    formatted.push([pair, pairString.baseCurrency, pairString.quoteCurrency]);
  });
  return formatted;
};

const displayPairs = (pairs: ListPairsResponse.AsObject) => {
  const table = new Table({ head: HEADERS, colWidths: [10, 20] }) as HorizontalTable;
  formatPairs(pairs).forEach((pair) => {
    table.push(pair);
  });
  console.log(colors.underline(colors.bold('\nPair IDs:')));
  console.log(table.toString());
};

export const command = 'listpairs';

export const describe = 'get order book\'s available pairs';

export const handler = (argv: Arguments) => {
  loadXudClient(argv).listPairs(new ListPairsRequest(), callback(argv, displayPairs));
};
