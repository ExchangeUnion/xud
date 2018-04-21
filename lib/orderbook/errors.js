const codesPrefix = require('../constants/errorCodesPrefix').ORDERBOOK;

const errors = exports;

errors.INVALID_PAIR_ID = pairId => ({
  message: `invalid pairId: ${pairId}`,
  code: codesPrefix.concat(1),
});
