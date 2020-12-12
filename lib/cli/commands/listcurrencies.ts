import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';
import { Arguments } from 'yargs';
import { SwapClientType } from '../../constants/enums';
import { ListCurrenciesRequest, ListCurrenciesResponse } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

const HEADERS = [
  colors.blue('Ticker'),
  colors.blue('Digits'),
  colors.blue('Token Address'),
  colors.blue('Swap Client'),
];

const formatCurrencies = (currencies: ListCurrenciesResponse.AsObject) => {
  const formatted: any[] = [];
  currencies.currenciesList.forEach((currency) => {
    const element = [];
    element.push(currency.currency, currency.decimalPlaces, currency.tokenAddress, SwapClientType[currency.swapClient]);
    formatted.push(element);
  });
  return formatted;
};

const createTable = () => {
  const table = new Table({ head: HEADERS }) as HorizontalTable;
  return table;
};

const displayTable = (response: ListCurrenciesResponse.AsObject) => {
  const table = createTable();

  formatCurrencies(response).forEach((currency) => {
    table.push(currency);
  });
  console.log(colors.underline(colors.bold('\nCurrencies:')));
  console.log(table.toString());
};

export const command = 'listcurrencies';

export const describe = 'list available currencies';

export const handler = async (argv: Arguments) => {
  (await loadXudClient(argv)).listCurrencies(new ListCurrenciesRequest(), callback(argv, displayTable));
};
