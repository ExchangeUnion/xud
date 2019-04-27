import { callback, loadXudClient } from '../command';
import { EstimateFeeRequest } from '../../proto/xudrpc_pb';
import { EstimateFeeRequest as LndRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'estimatefee <currency> <target_conf>';

export const describe = 'estimate the fee rate and total fees for a transaction';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
  // addrtoamount
  target_conf: {
    description: 'The target number of blocks that this transaction should be confirmed by',
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
