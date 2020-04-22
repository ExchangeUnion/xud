import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.CONNEXT;
const errorCodes = {
  CONNEXT_IS_DISABLED: codesPrefix.concat('.1'),
  INSUFFICIENT_BALANCE: codesPrefix.concat('.2'),
  TIMEOUT: codesPrefix.concat('.3'),
  INVALID: codesPrefix.concat('.4'),
  SERVER_ERROR: codesPrefix.concat('.5'),
  UNEXPECTED: codesPrefix.concat('.6'),
  TOKEN_ADDRESS_NOT_FOUND: codesPrefix.concat('.7'),
  PAYMENT_NOT_FOUND: codesPrefix.concat('.8'),
  INVALID_TOKEN_PAYMENT_RESPONSE: codesPrefix.concat('.9'),
  CONNEXT_HAS_NO_ACTIVE_CHANNELS: codesPrefix.concat('.11'),
  CONNEXT_CLIENT_NOT_INITIALIZED: codesPrefix.concat('.12'),
  CURRENCY_NOT_FOUND_BY_TOKENADDRESS: codesPrefix.concat('.13'),
  CURRENCY_MISSING: codesPrefix.concat('.14'),
  EXPIRY_MISSING: codesPrefix.concat('.15'),
};

const errors = {
  CONNEXT_IS_DISABLED: {
    message: 'connext is disabled',
    code: errorCodes.CONNEXT_IS_DISABLED,
  },
  CONNEXT_HAS_NO_ACTIVE_CHANNELS: {
    message: 'connext has no active channels',
    code: errorCodes.CONNEXT_HAS_NO_ACTIVE_CHANNELS,
  },
  CONNEXT_CLIENT_NOT_INITIALIZED: {
    message: 'connext client is not initialized',
    code: errorCodes.CONNEXT_CLIENT_NOT_INITIALIZED,
  },
  INSUFFICIENT_BALANCE: {
    message: 'insufficient balance to perform request',
    code: errorCodes.INSUFFICIENT_BALANCE,
  },
  TIMEOUT: {
    message: 'request timed out',
    code: errorCodes.TIMEOUT,
  },
  SERVER_ERROR: {
    message: 'connext server error',
    code: errorCodes.SERVER_ERROR,
  },
  UNEXPECTED: {
    message: 'unexpected error during connext request',
    code: errorCodes.UNEXPECTED,
  },
  TOKEN_ADDRESS_NOT_FOUND: {
    message: 'connext token address not found',
    code: errorCodes.TOKEN_ADDRESS_NOT_FOUND,
  },
  PAYMENT_NOT_FOUND: {
    message: 'connext payment not found',
    code: errorCodes.PAYMENT_NOT_FOUND,
  },
  INVALID_TOKEN_PAYMENT_RESPONSE: {
    message: 'connext TokenPaymentResponse is invalid',
    code: errorCodes.INVALID_TOKEN_PAYMENT_RESPONSE,
  },
  CURRENCY_NOT_FOUND_BY_TOKENADDRESS: (tokenAddress: string) => ({
    message: `could not find currency for tokenAddress ${tokenAddress}`,
    code: errorCodes.CURRENCY_NOT_FOUND_BY_TOKENADDRESS,
  }),
  CURRENCY_MISSING: {
    message: 'currency is missing',
    code: errorCodes.CURRENCY_MISSING,
  },
  EXPIRY_MISSING: {
    message: 'expiry is missing',
    code: errorCodes.EXPIRY_MISSING,
  },
};

export { errorCodes };
export default errors;
