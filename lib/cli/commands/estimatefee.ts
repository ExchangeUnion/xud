import { callback, loadXudClient } from '../command';
import { EstimateFeeRequest } from '../../proto/xudrpc_pb';
import { EstimateFeeRequest as LndRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'estimatefee';

export const describe = 'estimate fee';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
  target_conf: {
    description: 'todo',
    type: 'number',
  },
};

export const handeler = (argv: Arguments) => {
  const request = new EstimateFeeRequest();
  const lndrequest = new LndRequest();
  request.setCurrency(argv.currency);
  lndrequest.setTargetConf(argv.target_conf);
  request.setEstimateFee(lndrequest);
  loadXudClient(argv).estimateFee(request, callback(argv));
};
