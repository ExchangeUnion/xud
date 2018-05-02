import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.LND;
const errors: any = {};

errors.LND_IS_DISABLED = {
  message: 'lnd is disabled',
  code: codesPrefix.concat('1'),
};

export default errors;
