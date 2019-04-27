import { callback, loadXudClient } from '../command';
import { InitWalletRequest } from '../../proto/xudrpc_pb';
import { InitWalletRequest as LndRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'initwallet';

export const describe = 'create new wallet';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
  aezeed_pass_phrase: {
    description: 'todo',
    type: 'string',
  },
  cipher_seed_mnemonic_list: {
    description: 'todo',
    type: 'string',
  },
  recovery_window: {
    description: 'todo',
    type: 'number',
  },
  wallet_password: {
    description: 'todo',
    type: 'string',
  },
};

export const handeler = (argv: Arguments) => {
  const request = new InitWalletRequest();
  const lndrequest = new LndRequest();
  request.setCurrency(argv.currency);
  lndrequest.setAezeedPassphrase(argv.aezeed_pass_phrase);
  lndrequest.setCipherSeedMnemonicList(argv.cipher_seed_mnemonic_list);
  lndrequest.setRecoveryWindow(argv.recovery_window);
  lndrequest.setWalletPassword(argv.wallet_password);
  request.setInitWallet(lndrequest);
  loadXudClient(argv).initWallet(request, callback(argv));
};
