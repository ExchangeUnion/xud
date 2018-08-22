import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.UTILS;
const errorCodes = {
  INVALID_URI: codesPrefix.concat('.1'),
};

const errors = {
  INVALID_URI: (uri: string) => ({
    message: `uri is invalid: ${uri}`,
    code: errorCodes.INVALID_URI,
  }),
};

export { errorCodes };
export default errors;
