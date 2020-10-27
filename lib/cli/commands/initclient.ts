import { Arguments, Argv } from 'yargs';
import { SwapClientType } from '../../constants/enums';
import { InitSwapClientRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

export const command = 'initclient <swap_client> [currency]';

export const describe = 'initialize a swap client with the xud master key & password';

export const builder = (argv: Argv) => argv
  .positional('swap_client', {
    description: 'the swap client to initialize',
    type: 'string',
    choices: ['Lnd', 'Connext'],
    coerce: (swapClientStr: string) => {
      const swapClientLower = swapClientStr.toLowerCase();
      return swapClientLower.charAt(0).toUpperCase() + swapClientLower.slice(1);
    },
  })
  .option('currency', {
    description: 'the currency for the swap client, if applicable',
    type: 'string',
  })
  .example('$0 initclient Lnd LTC', 'initialize an Lnd client for LTC')
  .example('$0 initclient Connext', 'initialize a Connext client');

export const handler = async (argv: Arguments<any>) => {
  const request = new InitSwapClientRequest();
  request.setSwapClient(Number(SwapClientType[argv.swap_client]));
  request.setCurrency(argv.currency.toUpperCase());
  (await loadXudClient(argv)).initSwapClient(request, callback(argv));
};
