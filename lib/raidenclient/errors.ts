import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.RAIDEN;

export const RAIDEN_IS_DISABLED = {
  message: 'raiden is disabled',
  code: codesPrefix.concat('1'),
};

export const INSUFFICIENT_BALANCE = {
  message: 'insufficient balance to perform request',
  code: codesPrefix.concat('2'),
};

export const TIMEOUT = {
  message: 'request timed out',
  code: codesPrefix.concat('3'),
};

export const INVALID = {
  message: 'request is conflicting or otherwise invalid',
  code: codesPrefix.concat('4'),
};

export const SERVER_ERROR = {
  message: 'raiden server error',
  code: codesPrefix.concat('5'),
};

export const UNEXPECTED = {
  message: 'unexpected error during raiden request',
  code: codesPrefix.concat('6'),
};
