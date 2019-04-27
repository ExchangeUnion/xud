import { callback, loadXudClient } from '../command';
import { SendManyRequest } from '../../proto/xudrpc_pb';
import { SendManyRequest as LndRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'sendmany <currency> <sat_per_byte> <target_conf>';

export const describe = 'transaction that creates multiple specified outputs in parallel';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
  sat_per_byte: {
    description: 'satoshis per byte',
    type: 'number',
  },
  // AddrToAmount
  target_conf: {
    description: 'target number of blocks that this transaction should be confirmed by',
    type: 'number',
  },
};

export const handeler = (argv: Arguments) => {
  const request = new SendManyRequest();
  request.setCurrency(argv.currency);

  const lndrequest = new LndRequest();
  lndrequest.setSatPerByte(argv.sat_per_byte);
  lndrequest.setTargetConf(argv.target_conf);
  loadXudClient(argv).sendMany(request, callback(argv));
};
