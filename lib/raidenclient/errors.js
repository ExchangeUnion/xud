const codesPrefix = require('../constants/errorCodesPrefix').RAIDEN;

const errors = exports;

errors.RAIDEN_IS_DISABLED = {
  message: 'raiden is disabled',
  code: codesPrefix.concat(1),
};
