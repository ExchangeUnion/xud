import { callback, loadXudClient } from '../command';
import { SendCoinsRequest } from '../../proto/xudrpc_pb';
import { SendCoinsRequest as LndRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'sendcoins <currency> <addr> <amount> <sat_per_byte> <target_conf> [send_all]';

export const describe = 'executes a request to send coins to a particular address';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
  addr: {
    description: 'the address to send coins to',
    type: 'string',
  },
  amount: {
    description: 'amount in satoshis to send',
    type: 'number',
  },
  sat_per_byte: {
    description: 'satoshis per byte',
    type: 'number',
  },
  send_all: {
    description: 'send all wallet balance',
    type: 'boolean',
    default: false,
  },
  target_conf: {
    description: 'target number of blocks that this transaction should be confirmed by',
    type: 'number',
  },
};

export const handler = (argv: Arguments) => {
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
