import { callback, loadXudClient } from '../command';
import { ListUnspentRequest } from '../../proto/xudrpc_pb';
import { ListUnspentRequest as LndRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'listunspent';

export const describe = 'list unspent transactions';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
  max_confs: {
    description: 'todo',
    type: 'number',
  },
  mix_confs: {
    description: 'todo',
    type: 'number',
  },
};

export const handeler = (argv: Arguments) => {
  const request = new ListUnspentRequest();
  request.setCurrency(argv.currency);
  const lndRequest = new LndRequest();
  lndRequest.setMaxConfs(argv.max_confs);
  lndRequest.setMinConfs(argv.mix_confs);
  request.setListUnspent(lndRequest);
  loadXudClient(argv).listUnspent(request, callback(argv));
};
