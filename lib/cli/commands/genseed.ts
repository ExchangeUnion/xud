import { callback, loadXudClient } from '../command';
import { GenSeedRequest } from '../../proto/xudrpc_pb';
import { GenSeedRequest as LndGenSeedRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'genseed <currency> [aezeed_pass_phrase] [seed_entropy]';

export const describe = 'generate a new aezeed cipher seed given an optional passphrase';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
  aezeed_pass_phrase: {
    description: 'an optional passphrase',
    type: 'string',
  },
  seed_entropy: {
    description: 'optional 16-bytes generated via CSPRNG',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new GenSeedRequest();
  const lndrequest = new LndGenSeedRequest();
  request.setCurrency(argv.currency);
  lndrequest.setAezeedPassphrase(argv.aezeed_pass_phrase);
  lndrequest.setSeedEntropy(argv.seed_entropy);
  request.setGenSeed(lndrequest);
  loadXudClient(argv).genSeed(request, callback(argv));
};
