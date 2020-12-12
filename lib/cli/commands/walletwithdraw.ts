import { Arguments, Argv } from 'yargs';
import { WithdrawRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';
import { coinsToSats } from '../utils';

export const command = 'walletwithdraw <amount> <currency> <destination> [fee]';

export const describe = 'withdraws on-chain funds from xud';

export const builder = (argv: Argv) =>
  argv
    .positional('amount', {
      description: 'the amount to withdraw, `all` withdraws everything',
      type: 'string',
    })
    .positional('currency', {
      description: 'the ticker symbol of the currency to withdraw.',
      type: 'string',
    })
    .positional('destination', {
      description: 'the address to send withdrawn funds to',
      type: 'string',
    })
    .option('fee', {
      description: 'the fee in satoshis (or equivalent) per byte',
      type: 'number',
    })
    .example('$0 walletwithdraw 0.1 BTC 1BitcoinEaterAddressDontSendf59kuE', 'withdraws 0.1 BTC')
    .example('$0 walletwithdraw 0.1 BTC 1BitcoinEaterAddressDontSendf59kuE 20', 'withdraws 0.1 BTC using 20 sats/byte')
    .example('$0 walletwithdraw all BTC 1BitcoinEaterAddressDontSendf59kuE', 'withdraws all BTC');

export const handler = async (argv: Arguments<any>) => {
  const request = new WithdrawRequest();
  request.setCurrency(argv.currency.toUpperCase());
  if (argv.amount === 'all') {
    request.setAll(true);
  } else {
    if (isNaN(argv.amount)) {
      console.error('amount is not a valid number');
      process.exit(1);
    }
    request.setAmount(coinsToSats(parseFloat(argv.amount)));
  }
  request.setDestination(argv.destination);
  request.setFee(argv.fee);

  (await loadXudClient(argv)).walletWithdraw(request, callback(argv));
};
