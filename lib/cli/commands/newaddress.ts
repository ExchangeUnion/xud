import { callback, loadXudClient } from '../command';
import { NewAddressRequest } from '../../proto/xudrpc_pb';
import { NewAddressRequest as LndRequest } from '../../proto/lndrpc_pb';
import { selectAddressType } from '../utils';
import { Arguments } from 'yargs';

export const command = 'newaddress <currency> <address_type>';

export const describe = 'get new address for wallet';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
  address_type: {
    description: 'address type',
    type: 'string',
    choices: ['np2wkh', 'unusednp2wkh', 'unusedp2wkh', 'p2wkh'],
  },
};

export const handler = (argv: Arguments) => {

  const addressType = selectAddressType(argv.address_type);

  const request = new NewAddressRequest();
  request.setCurrency(argv.currency);
  const lndrequest = new LndRequest();
  lndrequest.setType(addressType);
  request.setNewAddress(lndrequest);
  loadXudClient(argv).newAddress(request, callback(argv));
};
