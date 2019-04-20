import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.SERVICE;
const errorCodes = {
  INVALID_ARGUMENT: codesPrefix.concat('.1'),
  NOMATCHING_MODE_IS_REQUIRED: codesPrefix.concat('.2'),
  PAIRID_NON_EXISTENT: codesPrefix.concat('.3'),
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
  PAIRID_NON_EXISTENT: () => ({
    message: 'pairId provided dosent exsist',
    code: errorCodes.PAIRID_NON_EXISTENT,
  }),
};

export { errorCodes };
export default errors;
