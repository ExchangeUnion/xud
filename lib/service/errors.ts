import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.SERVICE;
const errorCodes = {
  INVALID_ARGUMENT: codesPrefix.concat('.1'),
  NOMATCHING_MODE_IS_REQUIRED: codesPrefix.concat('.2'),
  UNIMPLEMENTED: codesPrefix.concat('.3'),
  PENDING_CALL_CONFLICT: codesPrefix.concat('.4'),
  OPEN_CHANNEL_FAILURE: codesPrefix.concat('.5'),
};

const errors = {
  INVALID_ARGUMENT: (message: string) => ({
    message,
    code: errorCodes.INVALID_ARGUMENT,
  }),
  NOMATCHING_MODE_IS_REQUIRED: () => ({
    message: 'nomatching mode is required',
    code: errorCodes.NOMATCHING_MODE_IS_REQUIRED,
  }),
  UNIMPLEMENTED: {
    message: 'call is not supported by the current state of xud',
    code: errorCodes.UNIMPLEMENTED,
  },
  PENDING_CALL_CONFLICT: {
    message: 'a pending call is ongoing that conflicts with this call',
    code: errorCodes.PENDING_CALL_CONFLICT,
  },
  OPEN_CHANNEL_FAILURE: (currency: string, nodePubKey: string, amount: number, message: string) => ({
    message: `failed to open channel with nodePubKey: ${nodePubKey}, currency: ${currency}, amount: ${amount}, message: ${message}`,
    code: errorCodes.OPEN_CHANNEL_FAILURE,
  }),
};

export { errorCodes };
export default errors;
