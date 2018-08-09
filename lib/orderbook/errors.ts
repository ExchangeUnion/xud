import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.ORDERBOOK;
const errorCodes = {
  INVALID_PAIR_ID: codesPrefix.concat('.1'),
  DUPLICATE_ORDER: codesPrefix.concat('.2'),
  ORDER_NOT_FOUND: codesPrefix.concat('.3'),
};

const errors = {
  INVALID_PAIR_ID: (pairId: string) => ({
    message: `invalid pairId: ${pairId}`,
    code: errorCodes.INVALID_PAIR_ID,
  }),
  DUPLICATE_ORDER: (localId: string) => ({
    message: `order with localId ${localId} already exists`,
    code: errorCodes.DUPLICATE_ORDER,
  }),
  ORDER_NOT_FOUND: (orderId: string) => ({
    message: `order with id ${orderId} could not be found`,
    code: errorCodes.ORDER_NOT_FOUND,
  }),
};

export { errorCodes };
export default errors;
