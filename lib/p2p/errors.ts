import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.P2P;
const errorCodes = {
  ADDRESS_ALREADY_CONNECTED: codesPrefix.concat('.1'),
  NOT_CONNECTED: codesPrefix.concat('.2'),
};

const errors = {
  ADDRESS_ALREADY_CONNECTED: (address: string) => ({
    message: `Address (${address}) already connected`,
    code: errorCodes.ADDRESS_ALREADY_CONNECTED,
  }),
  NOT_CONNECTED: (address: string) => ({
    message: `Address (${address}) is not connected`,
    code: errorCodes.NOT_CONNECTED,
  }),
};

export { errorCodes };
export default errors;
