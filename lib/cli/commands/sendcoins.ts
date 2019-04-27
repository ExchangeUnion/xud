import { callback, loadXudClient } from '../command';
import { SendCoinsRequest } from '../../proto/xudrpc_pb';
import { SendCoinsRequest as LndRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'sendcoins';

export const describe = 'send coins';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
  addr: {
    description: 'address to send to',
    type: 'string',
  },
  amount: {
    description: 'amount to send',
    type: 'number',
  },
  sat_per_byte: {
    description: 'satosihs per byte',
    type: 'number',
  },
  send_all: {
    description: 'send all wallet balance',
    type: 'boolean',
    default: false,
  },
  target_conf: {
      description: 'todo',
      type: 'number',
  }
};

export const handeler = (argv: Arguments) => {
  const request = new SendCoinsRequest();
  const lndrequest = new LndRequest();
  request.setCurrency(argv.currency);
  lndrequest.setAddr(argv.addr);
  lndrequest.setAmount(argv.amount);
  lndrequest.setSatPerByte(argv.sat_per_byte);
  lndrequest.setSendAll(argv.send_all);
  lndrequest.setTargetConf(argv.target_conf);
  request.setSendCoins(lndrequest);
  loadXudClient(argv).sendCoins(request, callback(argv));
};
