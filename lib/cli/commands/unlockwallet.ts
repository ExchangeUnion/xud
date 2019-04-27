import { callback, loadXudClient } from '../command';
import { UnlockWalletRequest } from '../../proto/xudrpc_pb';
import { UnlockWalletRequest as LndRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'unlockwallet';

export const describe = 'unlock lnd wallet';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
  recovery_window: {
    description: 'todo',
    type: 'number',
  },
  wallet_password: {
    description: 'password for wallet',
    type: 'string',
  },
};

export const handeler = (argv: Arguments) => {
  const request = new UnlockWalletRequest();
  const lndrequest = new LndRequest();
  request.setCurrency(argv.currency);
  lndrequest.setRecoveryWindow(argv.recovery_window);
  lndrequest.setWalletPassword(argv.wallet_password);
  request.setUnlockWallet(lndrequest);
  loadXudClient(argv).unlockWallet(request, callback(argv));
};
