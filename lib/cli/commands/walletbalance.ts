import { callback, loadXudClient } from '../command';
import { WalletBalanceRequest } from '../../proto/xudrpc_pb';
import { WalletBalanceRequest as LndRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'walletbalance <currency>';

export const describe = 'get wallet balance';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new WalletBalanceRequest();
  request.setCurrency(argv.currency);
  const lndRequest = new LndRequest();
  request.setWalletBalance(lndRequest);
  loadXudClient(argv).walletBalance(request, callback(argv));
};
