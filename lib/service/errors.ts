import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.SERVICE;
const errorCodes = {
  INVALID_ARGUMENT: codesPrefix.concat('.1'),
  NOMATCHING_MODE_IS_REQUIRED: codesPrefix.concat('.2'),
  NODE_ALREADY_EXISTS: codesPrefix.concat('.3'),
  PENDING_CALL_CONFLICT: codesPrefix.concat('.4'),
  OPEN_CHANNEL_FAILURE: codesPrefix.concat('.5'),
  NODE_DOES_NOT_EXIST: codesPrefix.concat('.6'),
  ALIAS_CONFLICT: codesPrefix.concat('.7'),
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
  OPEN_CHANNEL_FAILURE: (currency: string, nodePubKey: string, amount: number, message: string) => ({
    message: `failed to open channel with nodePubKey: ${nodePubKey}, currency: ${currency}, amount: ${amount}, message: ${message}`,
    code: errorCodes.OPEN_CHANNEL_FAILURE,
  }),
  NODE_DOES_NOT_EXIST: {
    message: 'xud node cannot be unlocked because it does not exist',
    code: errorCodes.NODE_DOES_NOT_EXIST,
  },
  ALIAS_CONFLICT: (alias: string) => ({
    message: `alias ${alias} refers to more than one node`,
    code: errorCodes.ALIAS_CONFLICT,
  }),
};

export { errorCodes };
export default errors;
