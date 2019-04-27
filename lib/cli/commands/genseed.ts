import { callback, loadXudClient } from '../command';
import { GenSeedRequest } from '../../proto/xudrpc_pb';
import { GenSeedRequest as LndGenSeedRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'genseed';

export const describe = 'todo';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
  aezeed_pass_phrase: {
    description: 'todo',
    type: 'string',
  },
  seed_entropy: {
      description: 'todo',
      type: 'string',
  }
};

export const handeler = (argv: Arguments) => {
  const request = new GenSeedRequest();
  const lndrequest = new LndGenSeedRequest();
  request.setCurrency(argv.currency);
  lndrequest.setAezeedPassphrase(argv.aezeed_pass_phrase);
  lndrequest.setSeedEntropy(argv.seed_entropy);
  request.setGenSeed(lndrequest);
  loadXudClient(argv).genSeed(request, callback(argv));
};
