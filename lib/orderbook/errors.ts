import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.ORDERBOOK;
const errorCodes = {
  INVALID_PAIR_ID: codesPrefix.concat('.1'),
  DUPLICATED_ORDER: codesPrefix.concat('.2'),
};

const errors = {
  INVALID_PAIR_ID: pairId => ({
    message: `invalid pairId: ${pairId}`,
    code: errorCodes.INVALID_PAIR_ID,
  }),
  DUPLICATED_ORDER: localId => ({
    message: `duplicated localId: ${localId}`,
    code: codesPrefix.concat('.2'),
  }),
};

export { errorCodes };
export default errors;
