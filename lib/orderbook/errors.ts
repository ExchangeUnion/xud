import errorCodesPrefix from '../constants/errorCodesPrefix';

const codesPrefix = errorCodesPrefix.ORDERBOOK;
const errorCodes = {
  PAIR_DOES_NOT_EXIST: codesPrefix.concat('.1'),
  DUPLICATE_ORDER: codesPrefix.concat('.2'),
  ORDER_NOT_FOUND: codesPrefix.concat('.3'),
  CURRENCY_DOES_NOT_EXIST: codesPrefix.concat('.4'),
  CURRENCY_CANNOT_BE_REMOVED: codesPrefix.concat('.5'),
  CURRENCY_ALREADY_EXISTS: codesPrefix.concat('.6'),
  PAIR_ALREADY_EXISTS: codesPrefix.concat('.7'),
  MARKET_ORDERS_NOT_ALLOWED: codesPrefix.concat('.8'),
  LOCAL_ID_DOES_NOT_EXIST: codesPrefix.concat('.9'),
  QUANTITY_DOES_NOT_MATCH: codesPrefix.concat('.10'),
};

const errors = {
  PAIR_DOES_NOT_EXIST: (pairId: string) => ({
    message: `trading pair ${pairId} does not exist`,
    code: errorCodes.PAIR_DOES_NOT_EXIST,
  }),
  DUPLICATE_ORDER: (localId: string) => ({
    message: `order with local id ${localId} already exists`,
    code: errorCodes.DUPLICATE_ORDER,
  }),
  ORDER_NOT_FOUND: (orderId: string, peerPubKey?: string) => ({
    message: `order with id ${orderId}${peerPubKey ? ' for peer ' + peerPubKey : ''} could not be found`,
    code: errorCodes.ORDER_NOT_FOUND,
  }),
  CURRENCY_DOES_NOT_EXIST: (currency: string) => ({
    message: `currency ${currency} does not exist`,
    code: errorCodes.CURRENCY_DOES_NOT_EXIST,
  }),
  CURRENCY_CANNOT_BE_REMOVED: (currency: string, pairId: string) => ({
    message: `currency ${currency} cannot be removed because it is used for ${pairId}`,
    code: errorCodes.CURRENCY_CANNOT_BE_REMOVED,
  }),
  CURRENCY_ALREADY_EXISTS: (currency: string) => ({
    message: `currency ${currency} already exists`,
    code: errorCodes.CURRENCY_ALREADY_EXISTS,
  }),
  PAIR_ALREADY_EXISTS: (pairId: string) => ({
    message: `trading pair ${pairId} already exists`,
    code: errorCodes.PAIR_ALREADY_EXISTS,
  }),
  MARKET_ORDERS_NOT_ALLOWED: () => ({
    message: `market orders are not allowed on nomatching mode`,
    code: errorCodes.MARKET_ORDERS_NOT_ALLOWED,
  }),
  LOCAL_ID_DOES_NOT_EXIST: (localId: string) => ({
    message: `order with local id ${localId} does not exist`,
    code: errorCodes.LOCAL_ID_DOES_NOT_EXIST,
  }),
  QUANTITY_DOES_NOT_MATCH: (requestedQuantity: number, orderQuantity: number) => ({
    message: `requestedQuantity: ${requestedQuantity} is higher than order quantity: ${orderQuantity}`,
    code: errorCodes.QUANTITY_DOES_NOT_MATCH,
  }),

};

export { errorCodes };
export default errors;
