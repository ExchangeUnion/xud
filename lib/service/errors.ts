import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.SERVICE;
const errorCodes = {
  INVALID_ARGUMENT: codesPrefix.concat('.1'),
  NOMATCHING_MODE_IS_REQUIRED: codesPrefix.concat('.2'),
  CONNECTION_CLOSED: codesPrefix.concat('.3'),
};

const errors = {
  INVALID_ARGUMENT: (message: string) => ({
    message,
    code: errorCodes.INVALID_ARGUMENT,
  }),
  NOMATCHING_MODE_IS_REQUIRED: () => ({
    message: 'nomatching mode is required',
    code: errorCodes.NOMATCHING_MODE_IS_REQUIRED,
  }),
  CONNECTION_CLOSED: (rejectionMsg: string) => ({
    message: 'connection closed: ' + rejectionMsg,
    code: errorCodes.CONNECTION_CLOSED,
  }),
};

export { errorCodes };
export default errors;
