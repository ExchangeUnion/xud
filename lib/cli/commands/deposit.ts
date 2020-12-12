import { Arguments, Argv } from 'yargs';
import { DepositRequest, DepositResponse } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

export const command = 'deposit <currency>';

export const describe = 'gets an address to deposit funds to a channel';

export const builder = (argv: Argv) =>
  argv
    .positional('currency', {
      description: 'the ticker symbol of the currency to deposit.',
      type: 'string',
    })
    .example('$0 deposit ETH', 'get a ETH deposit address');

const openChannelText = (depositAddressResponse: DepositResponse.AsObject) => {
  console.log(`
You will receive your deposit in the connext channel.

Your deposit address is: ${depositAddressResponse.address}
`);
};

export const handler = async (argv: Arguments<any>) => {
  const request = new DepositRequest();
  request.setCurrency(argv.currency.toUpperCase());
  (await loadXudClient(argv)).deposit(request, callback(argv, openChannelText));
};
