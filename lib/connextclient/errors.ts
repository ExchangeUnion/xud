import errorCodesPrefix from '../constants/errorCodesPrefix';
import { ClientStatus } from '../swaps/SwapClient';

const codesPrefix = errorCodesPrefix.CONNEXT;
const errorCodes = {
  CONNEXT_IS_DISABLED: codesPrefix.concat('.1'),
  INSUFFICIENT_BALANCE: codesPrefix.concat('.2'),
  TIMEOUT: codesPrefix.concat('.3'),
  INVALID: codesPrefix.concat('.4'),
  SERVER_ERROR: codesPrefix.concat('.5'),
  UNEXPECTED: codesPrefix.concat('.6'),
  TOKEN_ADDRESS_NOT_FOUND: codesPrefix.concat('.7'),
  INVALID_TOKEN_PAYMENT_RESPONSE: codesPrefix.concat('.8'),
  CONNEXT_IS_UNAVAILABLE: codesPrefix.concat('.9'),
  CONNEXT_HAS_NO_ACTIVE_CHANNELS: codesPrefix.concat('.10'),
  CONNEXT_CHANNEL_NOT_INITIATED: codesPrefix.concat('.11'),
  CONNEXT_WALLET_NOT_INITIATED: codesPrefix.concat('.12'),
};

const errors = {
  CONNEXT_IS_DISABLED: {
    message: 'connext is disabled',
    code: errorCodes.CONNEXT_IS_DISABLED,
  },
  CONNEXT_IS_UNAVAILABLE: (status: ClientStatus) => ({
    message: `connext is ${ClientStatus[status]}`,
    code: errorCodes.CONNEXT_IS_UNAVAILABLE,
  }),
  CONNEXT_HAS_NO_ACTIVE_CHANNELS: () => ({
    message: 'connext has no active channels',
    code: errorCodes.CONNEXT_HAS_NO_ACTIVE_CHANNELS,
  }),
  CONNEXT_CHANNEL_NOT_INITIATED: {
    message: 'connext channel is not initiated',
    code: errorCodes.CONNEXT_CHANNEL_NOT_INITIATED,
  },
  CONNEXT_WALLET_NOT_INITIATED: {
    message: 'connext wallet is not initiated',
    code: errorCodes.CONNEXT_WALLET_NOT_INITIATED,
  },
  INSUFFICIENT_BALANCE: {
    message: 'insufficient balance to perform request',
    code: errorCodes.INSUFFICIENT_BALANCE,
  },
  TIMEOUT: {
    message: 'request timed out',
    code: errorCodes.TIMEOUT,
  },
  /**
   * For HTTP 409 responses from Connext. For token payments 409 means "the address
   * or the amount is invalid, or there is no path to the target, or the identifier
   * is already in use for a different payment."
   */
  INVALID: (message: string) => ({
    message,
    code: errorCodes.INVALID,
  }),
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
  INVALID_TOKEN_PAYMENT_RESPONSE: {
    message: 'connext TokenPaymentResponse is invalid',
    code: errorCodes.INVALID_TOKEN_PAYMENT_RESPONSE,
  },
};

export { errorCodes };
export default errors;
