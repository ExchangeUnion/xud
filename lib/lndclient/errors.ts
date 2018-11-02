import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.LND;
const errorCodes = {
  LND_IS_DISABLED: codesPrefix.concat('.1'),
  LND_IS_UNAVAILABLE: codesPrefix.concat('.2'),
};

const errors = {
  LND_IS_DISABLED: {
    message: 'lnd is disabled',
    code: errorCodes.LND_IS_DISABLED,
  },
  LND_IS_UNAVAILABLE: {
    message: 'lnd is not available',
    code: errorCodes.LND_IS_UNAVAILABLE,
  },
};

export { errorCodes };
export default errors;
