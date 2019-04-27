import { callback, loadXudClient } from '../command';
import { NewAddressRequest } from '../../proto/xudrpc_pb';
import { NewAddressRequest as LndRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'newaddress <type>';

export const describe = 'get new address for wallet';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
  type: {
    description: 'address type',
    type: 'number',
  },
};

export const handeler = (argv: Arguments) => {
  const request = new NewAddressRequest();
  request.setCurrency(argv.currency);
  const lndrequest = new LndRequest();
  lndrequest.setType(argv.type);
  request.setNewAddress(lndrequest);
  loadXudClient(argv).newAddress(request, callback(argv));
};
