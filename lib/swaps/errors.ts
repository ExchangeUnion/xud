import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.SWAPS;
const errorCodes = {
  SWAP_CLIENT_NOT_FOUND: codesPrefix.concat('.1'),
  SWAP_CLIENT_NOT_CONFIGURED: codesPrefix.concat('.2'),
  PAYMENT_HASH_NOT_FOUND: codesPrefix.concat('.3'),
  PAYMENT_ERROR: codesPrefix.concat('.4'),
  PAYMENT_REJECTED: codesPrefix.concat('.4'),
};

const errors = {
  SWAP_CLIENT_NOT_FOUND: (currency: string) => ({
    message: `swapClient for currency ${currency} not found`,
    code: errorCodes.SWAP_CLIENT_NOT_FOUND,
  }),
  SWAP_CLIENT_NOT_CONFIGURED: (currency: string) => ({
    message: `swapClient for currency ${currency} is not configured`,
    code: errorCodes.SWAP_CLIENT_NOT_CONFIGURED,
  }),
  PAYMENT_HASH_NOT_FOUND: (rHash: string) => ({
    message: `deal for rHash ${rHash} not found`,
    code: errorCodes.PAYMENT_HASH_NOT_FOUND,
  }),
  PAYMENT_ERROR: (message: string) => ({
    message,
    code: errorCodes.PAYMENT_ERROR,
  }),
  PAYMENT_REJECTED: {
    message: 'the recipient rejected our payment for the swap',
    code: errorCodes.PAYMENT_REJECTED,
  },
};

export { errorCodes, errors };
