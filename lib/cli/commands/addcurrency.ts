import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import { AddCurrencyRequest } from '../../proto/xudrpc_pb';
import { SwapClientType } from '../../constants/enums';

export const command = 'addcurrency <currency> <swap_client> [decimal_places] [token_address]';

export const describe = 'add a currency';

export const builder = {
  currency: {
    description: 'The ticker symbol for the currency',
    type: 'string',
  },
  swap_client: {
    description: 'The payment channel network client for swaps',
    type: 'string',
    choices: ['Lnd', 'Raiden'],
  },
  decimal_places: {
    description: 'The places to the right of the decimal point of the smallest subunit (e.g. satoshi)',
    default: 8,
    type: 'number',
  },
  token_address: {
    description: 'The contract address for layered tokens such as ERC20',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new AddCurrencyRequest();
  request.setCurrency(argv.currency.toUpperCase());
  request.setSwapClient(Number(SwapClientType[argv.swap_client]));
  request.setTokenAddress(argv.token_address);
  request.setDecimalPlaces(argv.decimal_places);
  loadXudClient(argv).addCurrency(request, callback(argv));
};
