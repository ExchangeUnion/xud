import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.SERVICE;
const errorCodes = {
  INVALID_ARGUMENT: codesPrefix.concat('.1'),
  NOMATCHING_MODE_IS_REQUIRED: codesPrefix.concat('.2'),
  NODE_ALREADY_EXISTS: codesPrefix.concat('.3'),
  PENDING_CALL_CONFLICT: codesPrefix.concat('.4'),
  OPEN_CHANNEL_FAILURE: codesPrefix.concat('.5'),
  NODE_DOES_NOT_EXIST: codesPrefix.concat('.6'),
  INVALID_REQUEST: codesPrefix.concat('.7'),
  NO_CHANNELS_TO_CLOSE: codesPrefix.concat('.8'),
  NO_ENCRYPT_MODE_ENABLED: codesPrefix.concat('.9'),
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
  NODE_ALREADY_EXISTS: {
    message: 'xud node cannot be created because it already exists',
    code: errorCodes.NODE_ALREADY_EXISTS,
  },
  PENDING_CALL_CONFLICT: {
    message: 'a pending call is ongoing that conflicts with this call',
    code: errorCodes.PENDING_CALL_CONFLICT,
  },
  OPEN_CHANNEL_FAILURE: (currency: string, amount: number, errorMessage: string, nodeIdentifier?: string) => {
    let message = `failed to open ${currency} channel for ${amount}`;
    if (nodeIdentifier) {
      message += ` with ${nodeIdentifier}`;
    }
    message += `: ${errorMessage}`;
    return {
      message,
      code: errorCodes.OPEN_CHANNEL_FAILURE,
    };
  },
  NODE_DOES_NOT_EXIST: {
    message: 'xud node cannot be unlocked because it does not exist',
    code: errorCodes.NODE_DOES_NOT_EXIST,
  },
  INVALID_REQUEST: {
    message: 'invalid request',
    code: errorCodes.INVALID_REQUEST,
  },
  NO_CHANNELS_TO_CLOSE: (remoteIdentifier: string) => ({
    message: `no channels found to close for ${remoteIdentifier}`,
    code: errorCodes.NO_CHANNELS_TO_CLOSE,
  }),
  NO_ENCRYPT_MODE_ENABLED: {
    message: 'xud is not encrypted with a password',
    code: errorCodes.NO_ENCRYPT_MODE_ENABLED,
  },
};

export { errorCodes };
export default errors;
