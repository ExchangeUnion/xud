import { callback, loadXudClient } from '../command';
import { ListUnspentRequest } from '../../proto/xudrpc_pb';
import { ListUnspentRequest as LndRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'listunspent <currency> <max_confs> <min_confs>';

export const describe = 'get a list of all utxos spendable by the wallet with a number of confirmations between the specified minimum and maximum';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
  max_confs: {
    description: 'The minimum number of confirmations to be included',
    type: 'number',
  },
  min_confs: {
    description: 'The maximum number of confirmations to be included',
    type: 'number',
  },
};

export const handler = (argv: Arguments) => {
  const request = new ListUnspentRequest();
  request.setCurrency(argv.currency);
  const lndRequest = new LndRequest();
  lndRequest.setMaxConfs(argv.max_confs);
  lndRequest.setMinConfs(argv.min_confs);
  request.setListUnspent(lndRequest);
  loadXudClient(argv).listUnspent(request, callback(argv));
};
