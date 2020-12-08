import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.CONNEXT;
const errorCodes = {
  CONNEXT_IS_DISABLED: codesPrefix.concat('.1'),
  INSUFFICIENT_BALANCE: codesPrefix.concat('.2'),
  TIMEOUT: codesPrefix.concat('.3'),
  INVALID: codesPrefix.concat('.4'),
  SERVER_ERROR: codesPrefix.concat('.5'),
  UNEXPECTED: codesPrefix.concat('.6'),
  INVALID_TOKEN_PAYMENT_RESPONSE: codesPrefix.concat('.9'),
  CONNEXT_HAS_NO_ACTIVE_CHANNELS: codesPrefix.concat('.11'),
  CONNEXT_CLIENT_NOT_INITIALIZED: codesPrefix.concat('.12'),
  CURRENCY_NOT_FOUND_BY_TOKENADDRESS: codesPrefix.concat('.13'),
  CURRENCY_MISSING: codesPrefix.concat('.14'),
  EXPIRY_MISSING: codesPrefix.concat('.15'),
  MISSING_SEED: codesPrefix.concat('.16'),
  INSUFFICIENT_COLLATERAL: codesPrefix.concat('.17'),
  NOT_FOUND: codesPrefix.concat('.18'),
  WITHDRAW_ADDRESS_MISSING: codesPrefix.concat('.19'),
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
  SERVER_ERROR: (statusCode: number, statusMessage?: string) => ({
    message: `connext server error ${statusCode}: ${statusMessage ?? ''}`,
    code: errorCodes.SERVER_ERROR,
  }),
  UNEXPECTED: (statusCode: number, statusMessage?: string) => ({
    message: `unexpected status from connext request ${statusCode}: ${statusMessage ?? ''}`,
    code: errorCodes.UNEXPECTED,
  }),
  NOT_FOUND: {
    message: 'connext returned not found response',
    code: errorCodes.NOT_FOUND,
  },
  WITHDRAW_ADDRESS_MISSING: {
    message: 'destination account for the withdrawal is missing',
    code: errorCodes.WITHDRAW_ADDRESS_MISSING,
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
  MISSING_SEED: {
    message: 'seed is missing',
    code: errorCodes.MISSING_SEED,
  },
  INSUFFICIENT_COLLATERAL: {
    message: 'channel collateralization in progress, please try again in ~1 minute',
    code: errorCodes.INSUFFICIENT_COLLATERAL,
  },
};

export { errorCodes };
export default errors;
