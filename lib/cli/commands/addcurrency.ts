import { Arguments, Argv } from 'yargs';
import { SwapClientType } from '../../constants/enums';
import { Currency } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

export const command =
  'addcurrency <currency> <swap_client> [decimal_places] [token_address]';

export const describe = 'add a currency';

export const builder = (argv: Argv) =>
  argv
    .positional('currency', {
      description: 'the ticker symbol for the currency',
      type: 'string',
    })
    .positional('swap_client', {
      description: 'the payment channel network client for swaps',
      type: 'string',
      choices: ['Lnd', 'Raiden', 'Connext'],
    })
    .option('decimal_places', {
      description:
        'the places to the right of the decimal point of the smallest subunit (e.g. satoshi)',
      default: 8,
      type: 'number',
    })
    .option('token_address', {
      description: 'the contract address for tokens such as ERC20',
      type: 'string',
    })
    .example('$0 addcurrency BTC Lnd', 'add BTC')
    .example(
      '$0 addcurrency ETH Connext 18 0x0000000000000000000000000000000000000000',
      'add ETH'
    );

export const handler = async (argv: Arguments<any>) => {
  if (
    isNaN(argv.decimal_places) ||
    argv.decimal_places >= 100 ||
    argv.decimal_places < 0
  ) {
    throw 'decimal_places must be a number between 0 and 100';
  }
  const request = new Currency();
  request.setCurrency(argv.currency.toUpperCase());
  request.setSwapClient(Number(SwapClientType[argv.swap_client]));
  request.setTokenAddress(argv.token_address);
  request.setDecimalPlaces(argv.decimal_places);
  (await loadXudClient(argv)).addCurrency(request, callback(argv));
};
