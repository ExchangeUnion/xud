import grpc, { status } from 'grpc';
import { errorCodes as lndErrorCodes } from '../lndclient/errors';
import { errorCodes as orderErrorCodes } from '../orderbook/errors';
import { errorCodes as p2pErrorCodes } from '../p2p/errors';
import { errorCodes as serviceErrorCodes } from '../service/errors';
import { errorCodes as swapErrorCodes } from '../swaps/errors';

/**
 * Convert an internal xud error type into a gRPC error.
 * @param err an error object that should have code and message properties
 * @return a gRPC error with a gRPC status code
 */
const getGrpcError = (err: any) => {
  // if we recognize this error, use a proper gRPC ServiceError with a descriptive and appropriate code
  let code: grpc.status | undefined;
  switch (err.code) {
    case serviceErrorCodes.INVALID_ARGUMENT:
    case p2pErrorCodes.ATTEMPTED_CONNECTION_TO_SELF:
    case p2pErrorCodes.UNEXPECTED_NODE_PUB_KEY:
    case p2pErrorCodes.NODE_TOR_ADDRESS:
    case orderErrorCodes.MIN_QUANTITY_VIOLATED:
    case orderErrorCodes.QUANTITY_DOES_NOT_MATCH:
    case orderErrorCodes.EXCEEDING_LIMIT:
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
    case p2pErrorCodes.NOT_CONNECTED:
    case p2pErrorCodes.NODE_NOT_BANNED:
    case p2pErrorCodes.NODE_IS_BANNED:
    case lndErrorCodes.DISABLED:
    case orderErrorCodes.CURRENCY_DOES_NOT_EXIST:
    case orderErrorCodes.CURRENCY_CANNOT_BE_REMOVED:
    case orderErrorCodes.MARKET_ORDERS_NOT_ALLOWED:
    case serviceErrorCodes.NOMATCHING_MODE_IS_REQUIRED:
    case orderErrorCodes.INSUFFICIENT_OUTBOUND_BALANCE:
    case swapErrorCodes.SWAP_CLIENT_NOT_FOUND:
    case swapErrorCodes.SWAP_CLIENT_MISCONFIGURED:
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
  }

  // return a grpc error with the code if we've assigned one, otherwise pass along the caught error as UNKNOWN
  const grpcError: grpc.ServiceError = {
    code: code || status.UNKNOWN,
    message: err.message,
    name: err.name,
  };

  return grpcError;
};

export default getGrpcError;
