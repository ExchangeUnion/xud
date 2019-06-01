import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.RAIDEN;
const errorCodes = {
  RAIDEN_IS_DISABLED: codesPrefix.concat('.1'),
  INSUFFICIENT_BALANCE: codesPrefix.concat('.2'),
  TIMEOUT: codesPrefix.concat('.3'),
  INVALID: codesPrefix.concat('.4'),
  SERVER_ERROR: codesPrefix.concat('.5'),
  UNEXPECTED: codesPrefix.concat('.6'),
  TOKEN_ADDRESS_NOT_FOUND: codesPrefix.concat('.7'),
  INVALID_TOKEN_PAYMENT_RESPONSE: codesPrefix.concat('.8'),
};

const errors = {
  RAIDEN_IS_DISABLED: {
    message: 'raiden is disabled',
    code: errorCodes.RAIDEN_IS_DISABLED,
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
   * For HTTP 409 responses from Raiden. For token payments 409 means "the address
   * or the amount is invalid, or there is no path to the target, or the identifier
   * is already in use for a different payment."
   */
  INVALID: (message: string) => ({
    message,
    code: errorCodes.INVALID,
  }),
  SERVER_ERROR: {
    message: 'raiden server error',
    code: errorCodes.SERVER_ERROR,
  },
  UNEXPECTED: {
    message: 'unexpected error during raiden request',
    code: errorCodes.UNEXPECTED,
  },
  TOKEN_ADDRESS_NOT_FOUND: {
    message: 'raiden token address not found',
    code: errorCodes.TOKEN_ADDRESS_NOT_FOUND,
  },
  INVALID_TOKEN_PAYMENT_RESPONSE: {
    message: 'raiden TokenPaymentResponse is invalid',
    code: errorCodes.INVALID_TOKEN_PAYMENT_RESPONSE,
  },
};

export { errorCodes };
export default errors;
