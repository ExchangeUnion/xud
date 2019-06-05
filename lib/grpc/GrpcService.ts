/* tslint:disable no-floating-promises no-null-keyword */
import grpc, { status } from 'grpc';
import Logger from '../Logger';
import Service from '../service/Service';
import * as xudrpc from '../proto/xudrpc_pb';
import { Order, isOwnOrder, OrderPortion, PlaceOrderResult, PlaceOrderEvent, PlaceOrderEventType } from '../orderbook/types';
import { errorCodes as orderErrorCodes } from '../orderbook/errors';
import { errorCodes as serviceErrorCodes } from '../service/errors';
import { errorCodes as p2pErrorCodes } from '../p2p/errors';
import { errorCodes as lndErrorCodes } from '../lndclient/errors';
import { LndInfo } from '../lndclient/types';
import { SwapSuccess, SwapFailure } from '../swaps/types';
import { SwapFailureReason } from '../constants/enums';

/**
 * Creates an xudrpc Order message from an [[Order]].
 */
const createOrder = (order: Order) => {
  const grpcOrder = new xudrpc.Order();
  grpcOrder.setCreatedAt(order.createdAt);
  grpcOrder.setId(order.id);
  if (isOwnOrder(order)) {
    grpcOrder.setHold(order.hold);
    grpcOrder.setLocalId((order).localId);
    grpcOrder.setIsOwnOrder(true);
  } else {
    grpcOrder.setPeerPubKey((order).peerPubKey);
    grpcOrder.setIsOwnOrder(false);
  }
  grpcOrder.setPairId(order.pairId);
  grpcOrder.setPrice(order.price);
  grpcOrder.setQuantity(order.quantity);
  grpcOrder.setSide(order.isBuy ? xudrpc.OrderSide.BUY : xudrpc.OrderSide.SELL);
  return grpcOrder;
};

/**
 * Creates an xudrpc SwapSuccess message from a [[SwapSuccess]].
 */
const createSwapSuccess = (result: SwapSuccess) => {
  const swapSuccess = new xudrpc.SwapSuccess();
  swapSuccess.setOrderId(result.orderId);
  swapSuccess.setLocalId(result.localId);
  swapSuccess.setPairId(result.pairId);
  swapSuccess.setQuantity(result.quantity);
  swapSuccess.setRHash(result.rHash);
  swapSuccess.setPrice(result.price);
  swapSuccess.setRPreimage(result.rPreimage ? result.rPreimage : '');
  swapSuccess.setAmountReceived(result.amountReceived);
  swapSuccess.setAmountSent(result.amountSent);
  swapSuccess.setCurrencyReceived(result.currencyReceived);
  swapSuccess.setCurrencySent(result.currencySent);
  swapSuccess.setPeerPubKey(result.peerPubKey);
  swapSuccess.setRole(result.role as number);
  return swapSuccess;
};

/**
 * Creates an xudrpc SwapFailure message from a [[SwapFailure]].
 */
const createSwapFailure = (swapFailure: SwapFailure) => {
  const grpcSwapFailure = new xudrpc.SwapFailure();
  grpcSwapFailure.setOrderId(swapFailure.orderId);
  grpcSwapFailure.setPairId(swapFailure.pairId);
  grpcSwapFailure.setPeerPubKey(swapFailure.peerPubKey);
  grpcSwapFailure.setQuantity(swapFailure.quantity);
  grpcSwapFailure.setFailureReason(SwapFailureReason[swapFailure.failureReason]);
  return grpcSwapFailure;
};

/**
 * Creates an xudrpc PlaceOrderResponse message from a [[PlaceOrderResult]].
 */
const createPlaceOrderResponse = (result: PlaceOrderResult) => {
  const response = new xudrpc.PlaceOrderResponse();

  const internalMatches = result.internalMatches.map(match => createOrder(match));
  response.setInternalMatchesList(internalMatches);

  const swapSuccesses = result.swapSuccesses.map(swapSuccess => createSwapSuccess(swapSuccess));
  response.setSwapSuccessesList(swapSuccesses);

  const swapFailures = result.swapFailures.map(swapFailure => createSwapFailure(swapFailure));
  response.setSwapFailuresList(swapFailures);

  if (result.remainingOrder) {
    response.setRemainingOrder(createOrder(result.remainingOrder));
  }

  return response;
};

/**
 * Creates an xudrpc PlaceOrderEvent message from a [[PlaceOrderEvent]].
 */
const createPlaceOrderEvent = (e: PlaceOrderEvent) => {
  const placeOrderEvent = new xudrpc.PlaceOrderEvent();
  switch (e.type) {
    case PlaceOrderEventType.InternalMatch:
      placeOrderEvent.setInternalMatch(createOrder(e.payload as Order));
      break;
    case PlaceOrderEventType.SwapSuccess:
      placeOrderEvent.setSwapSuccess(createSwapSuccess(e.payload as SwapSuccess));
      break;
    case PlaceOrderEventType.RemainingOrder:
      placeOrderEvent.setRemainingOrder(createOrder(e.payload as Order));
      break;
    case PlaceOrderEventType.SwapFailure:
      placeOrderEvent.setSwapFailure(createSwapFailure(e.payload as SwapFailure));
      break;
  }
  return placeOrderEvent;
};

/** Class containing the available RPC methods for XUD */
class GrpcService {
  /** The set of active streaming calls. */
  private streams: Set<grpc.ServerWriteableStream<any>> = new Set<grpc.ServerWriteableStream<any>>();

  /** Create an instance of available RPC methods and bind all exposed functions. */
  constructor(private logger: Logger, private service: Service) {}

  /**
   * Convert an internal xud error type into a gRPC error.
   * @param err an error object that should have code and message properties
   * @return a gRPC error with a gRPC status code
   */
  private getGrpcError = (err: any) => {
    // if we recognize this error, use a proper gRPC ServiceError with a descriptive and appropriate code
    let code: grpc.status | undefined;
    switch (err.code) {
      case serviceErrorCodes.INVALID_ARGUMENT:
      case p2pErrorCodes.ATTEMPTED_CONNECTION_TO_SELF:
      case p2pErrorCodes.UNEXPECTED_NODE_PUB_KEY:
      case orderErrorCodes.QUANTITY_DOES_NOT_MATCH:
        code = status.INVALID_ARGUMENT;
        break;
      case orderErrorCodes.PAIR_DOES_NOT_EXIST:
      case p2pErrorCodes.NODE_UNKNOWN:
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
      case lndErrorCodes.LND_IS_DISABLED:
      case orderErrorCodes.CURRENCY_DOES_NOT_EXIST:
      case orderErrorCodes.CURRENCY_CANNOT_BE_REMOVED:
      case orderErrorCodes.MARKET_ORDERS_NOT_ALLOWED:
      case serviceErrorCodes.NOMATCHING_MODE_IS_REQUIRED:
        code = status.FAILED_PRECONDITION;
        break;
      case lndErrorCodes.LND_IS_UNAVAILABLE:
      case p2pErrorCodes.COULD_NOT_CONNECT:
        code = status.UNAVAILABLE;
        break;
      case p2pErrorCodes.POOL_CLOSED:
        code = status.ABORTED;
        break;
    }

    // return a grpc error with the code if we've assigned one, otherwise pass along the caught error as UNKNOWN
    const grpcError: grpc.ServiceError = {
      code: code || status.UNKNOWN,
      message: err.message,
      name: err.name,
    };
    this.logger.error(grpcError);

    return grpcError;
  }

  /** Closes and removes all active streaming calls. */
  public closeStreams = () => {
    this.streams.forEach((stream) => {
      stream.end();
    });
    this.streams.clear();
  }

  /** Adds an active streaming call and adds a listener to remove it if it is cancelled. */
  private addStream = (stream: grpc.ServerWriteableStream<any>) => {
    this.streams.add(stream);
    stream.once('cancelled', () => {
      this.streams.delete(stream);
    });
  }

  /**
   * See [[Service.addCurrency]]
   */
  public addCurrency: grpc.handleUnaryCall<xudrpc.AddCurrencyRequest, xudrpc.AddCurrencyResponse> = async (call, callback) => {
    try {
      await this.service.addCurrency(call.request.toObject());
      const response = new xudrpc.AddCurrencyResponse();

      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.addPair]]
   */
  public addPair: grpc.handleUnaryCall<xudrpc.AddPairRequest, xudrpc.AddPairResponse> = async (call, callback) => {
    try {
      await this.service.addPair(call.request.toObject());
      const response = new xudrpc.AddPairResponse();

      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.removeOrder]]
   */
  public removeOrder: grpc.handleUnaryCall<xudrpc.RemoveOrderRequest, xudrpc.RemoveOrderResponse> = async (call, callback) => {
    try {
      const quantityOnHold = this.service.removeOrder(call.request.toObject());
      const response = new xudrpc.RemoveOrderResponse();
      response.setQuantityOnHold(quantityOnHold);
      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.channelBalance]]
   */
  public channelBalance: grpc.handleUnaryCall<xudrpc.ChannelBalanceRequest, xudrpc.ChannelBalanceResponse> = async (call, callback) => {
    try {
      const channelBalanceResponse = await this.service.channelBalance(call.request.toObject());
      const response = new xudrpc.ChannelBalanceResponse();
      const balancesMap = response.getBalancesMap();
      channelBalanceResponse.forEach((channelBalance, currency) => {
        const balance = new xudrpc.ChannelBalance();
        balance.setBalance(channelBalance.balance);
        balance.setPendingOpenBalance(channelBalance.pendingOpenBalance);
        balancesMap.set(currency, balance);
      });
      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.connect]]
   */
  public connect: grpc.handleUnaryCall<xudrpc.ConnectRequest, xudrpc.ConnectResponse> = async (call, callback) => {
    try {
      const { nodeUri } = call.request.toObject();
      await this.service.connect({ nodeUri, retryConnecting: false });
      const response = new xudrpc.ConnectResponse();
      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.ban]]
   */
  public ban: grpc.handleUnaryCall<xudrpc.BanRequest, xudrpc.BanResponse> = async (call, callback) => {
    try {
      await this.service.ban(call.request.toObject());
      const response = new xudrpc.BanResponse();
      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.unban]]
   */
  public unban: grpc.handleUnaryCall<xudrpc.UnbanRequest, xudrpc.UnbanResponse> = async (call, callback) => {
    try {
      await this.service.unban(call.request.toObject());
      const response = new xudrpc.UnbanResponse();
      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.executeSwap]]
   */
  public executeSwap: grpc.handleUnaryCall<xudrpc.ExecuteSwapRequest, xudrpc.SwapSuccess> = async (call, callback) => {
    try {
      const swapResult = await this.service.executeSwap(call.request.toObject());
      callback(null, createSwapSuccess(swapResult));
    } catch (err) {
      if (typeof err === 'number') {
        // treat the error as a SwapFailureReason enum
        let code: status;
        switch (err) {
          case SwapFailureReason.DealTimedOut:
          case SwapFailureReason.SwapTimedOut:
            code = status.DEADLINE_EXCEEDED;
            break;
          case SwapFailureReason.InvalidSwapRequest:
          case SwapFailureReason.PaymentHashReuse:
            // these cases suggest something went very wrong with our swap request
            code = status.INTERNAL;
            break;
          case SwapFailureReason.NoRouteFound:
          case SwapFailureReason.SendPaymentFailure:
          case SwapFailureReason.SwapClientNotSetup:
          case SwapFailureReason.OrderOnHold:
            code = status.FAILED_PRECONDITION;
            break;
          case SwapFailureReason.UnexpectedClientError:
          case SwapFailureReason.UnknownError:
          default:
            code = status.UNKNOWN;
            break;
        }
        const grpcError: grpc.ServiceError = {
          code,
          name: SwapFailureReason[err],
          message: SwapFailureReason[err],
        };
        this.logger.error(grpcError);
        callback(grpcError, null);
      } else {
        callback(this.getGrpcError(err), null);
      }
    }
  }

  /**
   * See [[Service.getInfo]]
   */
  public getInfo: grpc.handleUnaryCall<xudrpc.GetInfoRequest, xudrpc.GetInfoResponse> = async (_, callback) => {
    try {
      const getInfoResponse = await this.service.getInfo();
      const response = new xudrpc.GetInfoResponse();
      response.setNodePubKey(getInfoResponse.nodePubKey);
      response.setUrisList(getInfoResponse.uris);
      response.setNumPairs(getInfoResponse.numPairs);
      response.setNumPeers(getInfoResponse.numPeers);
      response.setVersion(getInfoResponse.version);

      const getLndInfo = ((lndInfo: LndInfo): xudrpc.LndInfo => {
        const lnd = new xudrpc.LndInfo();
        if (lndInfo.blockheight) lnd.setBlockheight(lndInfo.blockheight);
        if (lndInfo.chains) {
          const chains: xudrpc.Chain[] = lndInfo.chains.map((chain) => {
            const xudChain = new xudrpc.Chain();
            xudChain.setChain(chain.chain);
            xudChain.setNetwork(chain.network);
            return xudChain;
          });
          lnd.setChainsList(chains);
        }
        if (lndInfo.channels) {
          const channels = new xudrpc.LndChannels();
          channels.setActive(lndInfo.channels.active);
          channels.setPending(lndInfo.channels.pending);
          if (lndInfo.channels.inactive) channels.setInactive(lndInfo.channels.inactive);
          lnd.setChannels(channels);
        }
        if (lndInfo.error) lnd.setError(lndInfo.error);
        if (lndInfo.uris) lnd.setUrisList(lndInfo.uris);
        if (lndInfo.version) lnd.setVersion(lndInfo.version);
        if (lndInfo.alias) lnd.setAlias(lndInfo.alias);
        return lnd;
      });
      const lndMap = response.getLndMap();
      for (const currency in getInfoResponse.lnd) {
        lndMap.set(currency, getLndInfo(getInfoResponse.lnd[currency]!));
      }

      if (getInfoResponse.raiden) {
        const raiden = new xudrpc.RaidenInfo();
        if (getInfoResponse.raiden.address) raiden.setAddress(getInfoResponse.raiden.address);
        if (getInfoResponse.raiden.channels) raiden.setChannels(getInfoResponse.raiden.channels);
        if (getInfoResponse.raiden.error) raiden.setError(getInfoResponse.raiden.error);
        if (getInfoResponse.raiden.version) raiden.setVersion(getInfoResponse.raiden.version);
        response.setRaiden(raiden);
      }

      const orders = new xudrpc.OrdersCount;
      orders.setOwn(getInfoResponse.orders.own);
      orders.setPeer(getInfoResponse.orders.peer);
      response.setOrders(orders);

      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.getNodeInfo]]
   */
  public getNodeInfo: grpc.handleUnaryCall<xudrpc.GetNodeInfoRequest, xudrpc.GetNodeInfoResponse> = async (call, callback) => {
    try {
      const { banned, reputationScore } = await this.service.getNodeInfo(call.request.toObject());
      const response = new xudrpc.GetNodeInfoResponse();
      if (banned) {
        response.setBanned(banned);
      }
      response.setReputationscore(reputationScore);
      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.listOrders]]
   */
  public listOrders: grpc.handleUnaryCall<xudrpc.ListOrdersRequest, xudrpc.ListOrdersResponse> = (call, callback) => {
    try {
      const listOrdersResponse = this.service.listOrders(call.request.toObject());
      const response = new xudrpc.ListOrdersResponse();

      const listOrdersList = <T extends Order>(orders: T[]) => {
        const ordersList: xudrpc.Order[] = [];
        orders.forEach(order => ordersList.push(createOrder(<Order>order)));
        return ordersList;
      };

      const ordersMap = response.getOrdersMap();
      listOrdersResponse.forEach((orderArrays, pairId) => {
        const orders = new xudrpc.Orders();
        orders.setBuyOrdersList(listOrdersList(orderArrays.buyArray));
        orders.setSellOrdersList(listOrdersList(orderArrays.sellArray));

        ordersMap.set(pairId, orders);
      });

      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.listCurrencies]]
   */
  public listCurrencies: grpc.handleUnaryCall<xudrpc.ListCurrenciesRequest, xudrpc.ListCurrenciesResponse> = (_, callback) => {
    try {
      const listCurrenciesResponse = this.service.listCurrencies();
      const response = new xudrpc.ListCurrenciesResponse();
      response.setCurrenciesList(listCurrenciesResponse);

      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.listPairs]]
   */
  public listPairs: grpc.handleUnaryCall<xudrpc.ListPairsRequest, xudrpc.ListPairsResponse> = (_, callback) => {
    try {
      const listPairsResponse = this.service.listPairs();
      const response = new xudrpc.ListPairsResponse();
      response.setPairsList(listPairsResponse);

      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.listPeers]]
   */
  public listPeers: grpc.handleUnaryCall<xudrpc.ListPeersRequest, xudrpc.ListPeersResponse> = (_, callback) => {
    try {
      const listPeersResponse = this.service.listPeers();
      const response = new xudrpc.ListPeersResponse();
      const peers: xudrpc.Peer[] = [];
      listPeersResponse.forEach((peer) => {
        const grpcPeer = new xudrpc.Peer();
        grpcPeer.setAddress(peer.address);
        grpcPeer.setInbound(peer.inbound);
        grpcPeer.setNodePubKey(peer.nodePubKey || '');
        if (peer.lndPubKeys) {
          const map = grpcPeer.getLndPubKeysMap();
          for (const key in peer.lndPubKeys) {
            map.set(key, peer.lndPubKeys[key]);
          }
        }
        grpcPeer.setPairsList(peer.pairs || []);
        grpcPeer.setSecondsConnected(peer.secondsConnected);
        grpcPeer.setXudVersion(peer.xudVersion || '');
        grpcPeer.setRaidenAddress(peer.raidenAddress || '');
        peers.push(grpcPeer);
      });
      response.setPeersList(peers);
      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.placeOrder]]
   */
  public placeOrder: grpc.handleServerStreamingCall<xudrpc.PlaceOrderRequest, xudrpc.PlaceOrderResponse> = async (call) => {
    try {
      await this.service.placeOrder(call.request.toObject(), (result: PlaceOrderEvent) => {
        call.write(createPlaceOrderEvent(result));
      });

      call.end();
    } catch (err) {
      call.emit('error', this.getGrpcError(err));
    }
  }

  /**
   * See [[Service.placeOrder]]
   */
  public placeOrderSync: grpc.handleUnaryCall<xudrpc.PlaceOrderRequest, xudrpc.PlaceOrderResponse> = async (call, callback) => {
    try {
      const result = await this.service.placeOrder(call.request.toObject());
      callback(null, createPlaceOrderResponse(result));
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.addCurrency]]
   */
  public removeCurrency: grpc.handleUnaryCall<xudrpc.RemoveCurrencyRequest, xudrpc.RemoveCurrencyResponse> = async (call, callback) => {
    try {
      await this.service.removeCurrency(call.request.toObject());
      const response = new xudrpc.RemoveCurrencyResponse();

      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.addPair]]
   */
  public removePair: grpc.handleUnaryCall<xudrpc.RemovePairRequest, xudrpc.RemovePairResponse> = async (call, callback) => {
    try {
      await this.service.removePair(call.request.toObject());
      const response = new xudrpc.RemovePairResponse();

      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.discoverNodes]]
   */
  public discoverNodes: grpc.handleUnaryCall<xudrpc.DiscoverNodesRequest, xudrpc.DiscoverNodesResponse> = async (call, callback) => {
    try {
      const numNodes = await this.service.discoverNodes(call.request.toObject());

      const response = new xudrpc.DiscoverNodesResponse();
      response.setNumNodes(numNodes);

      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  public shutdown: grpc.handleUnaryCall<xudrpc.ShutdownRequest, xudrpc.ShutdownResponse> = (_, callback) => {
    try {
      this.service.shutdown();
      const response = new xudrpc.ShutdownResponse();
      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /*
   * See [[Service.subscribeOrders]]
   */
  public subscribeOrders: grpc.handleServerStreamingCall<xudrpc.SubscribeOrdersRequest, xudrpc.OrderUpdate> = (call) => {
    this.service.subscribeOrders(call.request.toObject(), (order?: Order, orderRemoval?: OrderPortion) => {
      const orderUpdate = new xudrpc.OrderUpdate();
      if (order) {
        orderUpdate.setOrder(createOrder(order));
      } else if (orderRemoval) {
        const grpcOrderRemoval = new xudrpc.OrderRemoval();
        grpcOrderRemoval.setPairId(orderRemoval.pairId);
        grpcOrderRemoval.setOrderId(orderRemoval.id);
        grpcOrderRemoval.setQuantity(orderRemoval.quantity);
        grpcOrderRemoval.setLocalId(orderRemoval.localId || '');
        grpcOrderRemoval.setIsOwnOrder(orderRemoval.localId !== undefined);
        orderUpdate.setOrderRemoval(grpcOrderRemoval);
      }
      call.write(orderUpdate);
    });
    this.addStream(call);
  }

  /*
   * See [[Service.subscribeSwapFailures]]
   */
  public subscribeSwapFailures: grpc.handleServerStreamingCall<xudrpc.SubscribeSwapsRequest, xudrpc.SwapFailure> = (call) => {
    this.service.subscribeSwapFailures(call.request.toObject(), (result: SwapFailure) => {
      call.write(createSwapFailure(result));
    });
    this.addStream(call);
  }

  /*
   * See [[Service.subscribeSwaps]]
   */
  public subscribeSwaps: grpc.handleServerStreamingCall<xudrpc.SubscribeSwapsRequest, xudrpc.SwapSuccess> = (call) => {
    this.service.subscribeSwaps(call.request.toObject(), (result: SwapSuccess) => {
      call.write(createSwapSuccess(result));
    });
    this.addStream(call);
  }
}

export default GrpcService;
