import { callback, loadXudClient } from '../command';
import { InitWalletRequest } from '../../proto/xudrpc_pb';
import { InitWalletRequest as LndRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'initwallet <currency> <wallet_password> <cipher_seed_mnemonic_list> [aezeed_pass_phrase] [recovery_window]';

export const describe = 'create new wallet';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
  aezeed_pass_phrase: {
    description: 'an optional passphrase',
    type: 'string',
  },
  cipher_seed_mnemonic_list: {
    description: '24-word mnemonic that encodes a prior aezeed cipher seed obtained by the user',
    type: 'string',
  },
  recovery_window: {
    description: 'specify the address lookahead when restoring a wallet seed. ',
    type: 'number',
  },
  wallet_password: {
    description: 'passphrase to encrypt the wallet',
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
