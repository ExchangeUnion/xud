import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.ORDERBOOK;
const errors: any = {};

errors.INVALID_PAIR_ID = pairId => ({
  message: `invalid pairId: ${pairId}`,
  code: codesPrefix.concat('1'),
});

errors.DUPLICATED_ORDER = localId => ({
  message: `duplicated localId: ${localId}`,
  code: codesPrefix.concat('2'),
});

export default errors;
