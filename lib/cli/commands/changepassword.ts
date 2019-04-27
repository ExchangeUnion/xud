import { callback, loadXudClient } from '../command';
import { ChangePasswordRequest } from '../../proto/xudrpc_pb';
import { ChangePasswordRequest as LndRequest } from '../../proto/lndrpc_pb';
import { Arguments } from 'yargs';

export const command = 'changepassword';

export const describe = 'change password for lnd wallet';

export const builder = {
  currency: {
    description: 'select witch client to use',
    type: 'string',
  },
  current_password: {
    description: 'current password used for lnd wallet',
    type: 'string',
  },
  new_password: {
    description: 'new password',
    type: 'string',
  },
};

export const handeler = (argv: Arguments) => {
  const request = new ChangePasswordRequest();
  const lndrequest = new LndRequest();
  request.setCurrency(argv.currency);
  lndrequest.setCurrentPassword(argv.current_password);
  lndrequest.setNewPassword(argv.new_password);
  request.setChangePassword(lndrequest);
  loadXudClient(argv).changePassword(request, callback(argv));
};
