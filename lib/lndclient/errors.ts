import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.LND;
const errorCodes = {
  LND_IS_DISABLED: codesPrefix.concat('.1'),
};

const errors = {
  LND_IS_DISABLED: {
    message: 'lnd is disabled',
    code: errorCodes.LND_IS_DISABLED,
  },
};

export { errorCodes };
export default errors;
