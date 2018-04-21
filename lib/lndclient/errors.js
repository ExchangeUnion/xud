const codesPrefix = require('../constants/errorCodesPrefix').LND;

const errors = exports;

errors.LND_IS_DISABLED = {
  message: 'lnd is disabled',
  code: codesPrefix.concat(1),
};
