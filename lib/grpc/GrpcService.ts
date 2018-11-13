/* tslint:disable no-floating-promises no-null-keyword */
import grpc, { status } from 'grpc';
import Logger from '../Logger';
import Service from '../service/Service';
import * as xudrpc from '../proto/xudrpc_pb';
import { ResolveRequest, ResolveResponse } from '../proto/lndrpc_pb';
import { Order, isOwnOrder, OrderPortion } from '../types/orders';
import { errorCodes as orderErrorCodes } from '../orderbook/errors';
import { errorCodes as serviceErrorCodes } from '../service/errors';
import { errorCodes as p2pErrorCodes } from '../p2p/errors';
import { errorCodes as lndErrorCodes } from '../lndclient/errors';
import { LndInfo } from '../lndclient/LndClient';
import { PlaceOrderResult, PlaceOrderEvent, PlaceOrderEventCase } from '../types/orderBook';
import { SwapResult } from 'lib/swaps/types';

/**
 * Creates an xudrpc Order message from a [[StampedOrder]].
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
 * Creates an xudrpc SwapResult message from a [[SwapResult]].
 */
const createSwapResult = (result: SwapResult) => {
  const swapResult = new xudrpc.SwapResult();
  swapResult.setOrderId(result.orderId);
  swapResult.setLocalId(result.localId);
  swapResult.setPairId(result.pairId);
  swapResult.setQuantity(result.quantity);
  swapResult.setRHash(result.rHash);
  swapResult.setAmountReceived(result.amountReceived);
  swapResult.setAmountSent(result.amountSent);
  swapResult.setPeerPubKey(result.peerPubKey);
  swapResult.setRole(result.role as number);
  return swapResult;
};

/**
 * Creates an xudrpc PlaceOrderResponse message from a [[PlaceOrderResult]].
 */
const createPlaceOrderResponse = (result: PlaceOrderResult) => {
  const response = new xudrpc.PlaceOrderResponse();

  const internalMatches = result.internalMatches.map(match => createOrder(match));
  response.setInternalMatchesList(internalMatches);

  const swapResults = result.swapResults.map(swapResult => createSwapResult(swapResult));
  response.setSwapResultsList(swapResults);

  if (result.remainingOrder) {
    response.setRemainingOrder(createOrder(result.remainingOrder));
  }

  return response;
};

/**
 * Creates an xudrpc PlaceOrderEvent message from a [[PlaceOrderEvent]].
 */
const createPlaceOrderEvent = (e: PlaceOrderEvent) => {
  const response = new xudrpc.PlaceOrderEvent();
  switch (e.case) {
    case PlaceOrderEventCase.InternalMatch:
      response.setInternalMatch(createOrder(e.payload as Order));
      break;
    case PlaceOrderEventCase.SwapResult:
      response.setSwapResult(createSwapResult(e.payload as SwapResult));
      break;
    case PlaceOrderEventCase.RemainingOrder:
      response.setRemainingOrder(createOrder(e.payload as Order));
      break;
  }
  return response;
};

/** Class containing the available RPC methods for XUD */
class GrpcService {
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
      await this.service.removeOrder(call.request.toObject());
      const response = new xudrpc.RemoveOrderResponse();
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
      await this.service.connect(call.request.toObject());
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
  public executeSwap: grpc.handleUnaryCall<xudrpc.ExecuteSwapRequest, xudrpc.SwapResult> = async (call, callback) => {
    try {
      const result = await this.service.executeSwap(call.request.toObject());
      callback(null, createSwapResult(result));
    } catch (err) {
      callback(this.getGrpcError(err), null);
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
        if (lndInfo.chains) lnd.setChainsList(lndInfo.chains);
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
      if (getInfoResponse.lndbtc) response.setLndbtc(getLndInfo(getInfoResponse.lndbtc));
      if (getInfoResponse.lndltc) response.setLndltc(getLndInfo(getInfoResponse.lndltc));

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
      response.setBanned(banned);
      response.setReputationscore(reputationScore);
      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.getOrders]]
   */
  public getOrders: grpc.handleUnaryCall<xudrpc.GetOrdersRequest, xudrpc.GetOrdersResponse> = (call, callback) => {
    try {
      const getOrdersResponse = this.service.getOrders(call.request.toObject());
      const response = new xudrpc.GetOrdersResponse();

      const getOrdersList = <T extends Order>(orders: T[]) => {
        const ordersList: xudrpc.Order[] = [];
        orders.forEach(order => ordersList.push(createOrder(<Order>order)));
        return ordersList;
      };

      const ordersMap = response.getOrdersMap();
      getOrdersResponse.forEach((orderArrays, pairId) => {
        const orders = new xudrpc.Orders();
        orders.setBuyOrdersList(getOrdersList(orderArrays.buy));
        orders.setSellOrdersList(getOrdersList(orderArrays.sell));

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
        grpcPeer.setLndBtcPubKey(peer.lndbtcPubKey || '');
        grpcPeer.setLndLtcPubKey(peer.lndltcPubKey || '');
        grpcPeer.setPairsList(peer.pairs || []);
        grpcPeer.setSecondsConnected(peer.secondsConnected);
        grpcPeer.setXudVersion(peer.xudVersion || '');
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

  /*
   * Resolving LND hash. See [[Service.resolveHash]]
   */
  public resolveHash: grpc.handleUnaryCall<ResolveRequest, ResolveResponse> = async (call, callback) => {
    try {
      const resolveResponse = await this.service.resolveHash(call.request);
      const response = new ResolveResponse();
      if (resolveResponse) {
        response.setPreimage(resolveResponse);
      }
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
   * See [[Service.subscribeAddedOrders]]
   */
  public subscribeAddedOrders: grpc.handleServerStreamingCall<xudrpc.SubscribeAddedOrdersRequest, xudrpc.Order> = (call) => {
    this.service.subscribeAddedOrders((order: Order) => {
      call.write(createOrder(order));
    });
  }

  /*
   * See [[Service.subscribeRemovedOrders]]
   */
  public subscribeRemovedOrders: grpc.handleServerStreamingCall<xudrpc.SubscribeRemovedOrdersRequest, xudrpc.OrderRemoval> = (call) => {
    this.service.subscribeRemovedOrders((order: OrderPortion) => {
      const orderRemoval = new xudrpc.OrderRemoval();
      orderRemoval.setPairId(order.pairId);
      orderRemoval.setOrderId(order.id);
      orderRemoval.setQuantity(order.quantity);
      orderRemoval.setLocalId(order.localId || '');
      orderRemoval.setIsOwnOrder(order.localId !== undefined);
      call.write(orderRemoval);
    });
  }

  /*
   * See [[Service.subscribeSwaps]]
   */
  public subscribeSwaps: grpc.handleServerStreamingCall<xudrpc.SubscribeSwapsRequest, xudrpc.SwapResult> = (call) => {
    this.service.subscribeSwaps((result: SwapResult) => {
      call.write(createSwapResult(result));
    });
  }
}

export default GrpcService;
