import { Arguments } from 'yargs';
import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';
import { ListPairsRequest, ListPairsResponse } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

const HEADERS = [colors.blue('Trading pair')];

const formatPairs = (pairs: ListPairsResponse.AsObject): string[][] => {
  const formatted: string[][] = [];
  pairs.pairsList.forEach((pair) => {
    const [baseCurrency, quoteCurrency] = pair.split('/');
    formatted.push([`${baseCurrency} / ${quoteCurrency}`]);
  });
  return formatted;
};

const displayPairs = (pairs: ListPairsResponse.AsObject) => {
  const table = new Table({ head: HEADERS }) as HorizontalTable;
  formatPairs(pairs).forEach((pair) => {
    table.push(pair);
  });
  console.log(colors.underline(colors.bold('Trading Pairs:')));
  console.log(table.toString());
};

export const command = 'listpairs';

export const describe = "get order book's available pairs";

export const handler = async (argv: Arguments) => {
  (await loadXudClient(argv)).listPairs(new ListPairsRequest(), callback(argv, displayPairs));
};
