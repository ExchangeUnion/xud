import { status, ServiceError, Metadata } from '@grpc/grpc-js';
import { errorCodes as lndErrorCodes } from '../lndclient/errors';
import { errorCodes as orderErrorCodes } from '../orderbook/errors';
import { errorCodes as p2pErrorCodes } from '../p2p/errors';
import { errorCodes as serviceErrorCodes } from '../service/errors';
import { errorCodes as swapErrorCodes } from '../swaps/errors';
import { errorCodes as connextErrorCodes } from '../connextclient/errors';

/**
 * Convert an internal xud error type into a gRPC error.
 * @param err an error object that should have code and message properties
 * @return a gRPC error with a gRPC status code
 */
const getGrpcError = (err: any) => {
  // if we recognize this error, use a proper gRPC ServiceError with a descriptive and appropriate code
  let code: status | undefined;
  switch (err.code) {
    case serviceErrorCodes.INVALID_ARGUMENT:
    case p2pErrorCodes.ATTEMPTED_CONNECTION_TO_SELF:
    case p2pErrorCodes.UNEXPECTED_NODE_PUB_KEY:
    case p2pErrorCodes.NODE_TOR_ADDRESS:
    case orderErrorCodes.MIN_QUANTITY_VIOLATED:
    case orderErrorCodes.QUANTITY_DOES_NOT_MATCH:
    case swapErrorCodes.REMOTE_IDENTIFIER_MISSING:
    case orderErrorCodes.DUPLICATE_PAIR_CURRENCIES:
    case connextErrorCodes.WITHDRAW_ADDRESS_MISSING:
      code = status.INVALID_ARGUMENT;
      break;
    case orderErrorCodes.PAIR_DOES_NOT_EXIST:
    case p2pErrorCodes.NODE_UNKNOWN:
    case p2pErrorCodes.UNKNOWN_ALIAS:
    case orderErrorCodes.LOCAL_ID_DOES_NOT_EXIST:
    case orderErrorCodes.ORDER_NOT_FOUND:
      code = status.NOT_FOUND;
      break;
    case orderErrorCodes.DUPLICATE_ORDER:
    case p2pErrorCodes.NODE_ALREADY_CONNECTED:
    case p2pErrorCodes.NODE_ALREADY_BANNED:
    case p2pErrorCodes.ALREADY_CONNECTING:
    case orderErrorCodes.CURRENCY_ALREADY_EXISTS:
    case orderErrorCodes.PAIR_ALREADY_EXISTS:
      code = status.ALREADY_EXISTS;
      break;
    case connextErrorCodes.INSUFFICIENT_BALANCE:
    case connextErrorCodes.INSUFFICIENT_COLLATERAL:
    case p2pErrorCodes.NOT_CONNECTED:
    case p2pErrorCodes.NODE_NOT_BANNED:
    case p2pErrorCodes.NODE_IS_BANNED:
    case lndErrorCodes.DISABLED:
    case orderErrorCodes.CURRENCY_DOES_NOT_EXIST:
    case orderErrorCodes.CURRENCY_CANNOT_BE_REMOVED:
    case orderErrorCodes.MARKET_ORDERS_NOT_ALLOWED:
    case serviceErrorCodes.NOMATCHING_MODE_IS_REQUIRED:
    case swapErrorCodes.INSUFFICIENT_OUTBOUND_CAPACITY:
    case swapErrorCodes.INSUFFICIENT_INBOUND_CAPACITY:
    case orderErrorCodes.QUANTITY_ON_HOLD:
    case swapErrorCodes.SWAP_CLIENT_NOT_FOUND:
    case swapErrorCodes.SWAP_CLIENT_MISCONFIGURED:
    case serviceErrorCodes.NO_CHANNELS_TO_CLOSE:
      code = status.FAILED_PRECONDITION;
      break;
    case lndErrorCodes.UNAVAILABLE:
    case p2pErrorCodes.COULD_NOT_CONNECT:
      code = status.UNAVAILABLE;
      break;
    case serviceErrorCodes.PENDING_CALL_CONFLICT:
      code = status.RESOURCE_EXHAUSTED;
      break;
    case serviceErrorCodes.NODE_ALREADY_EXISTS:
    case serviceErrorCodes.NODE_DOES_NOT_EXIST:
    case serviceErrorCodes.NO_ENCRYPT_MODE_ENABLED:
      code = status.UNIMPLEMENTED;
      break;
    case p2pErrorCodes.POOL_CLOSED:
      code = status.ABORTED;
      break;
    case p2pErrorCodes.RESPONSE_TIMEOUT:
      code = status.DEADLINE_EXCEEDED;
      break;
    case swapErrorCodes.SWAP_CLIENT_WALLET_NOT_CREATED:
      code = status.INTERNAL;
      break;
    default:
      code = status.UNKNOWN;
      break;
  }

  const message = err.message ?? (typeof err === 'string' ? err : '');
  // return a grpc error with the code if we've assigned one, otherwise pass along the caught error as UNKNOWN
  const grpcError: ServiceError = {
    message,
    code,
    details: message,
    name: err.name ?? 'UnknownError',
    metadata: new Metadata(),
  };

  return grpcError;
};

export default getGrpcError;
