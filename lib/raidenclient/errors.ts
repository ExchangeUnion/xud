import errorCodesPrefix from 'lib/constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.RAIDEN;
const errors : any = {};

errors.RAIDEN_IS_DISABLED = {
  message: 'raiden is disabled',
  code: codesPrefix.concat('1'),
};

export default errors;
