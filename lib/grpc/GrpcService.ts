/* tslint:disable no-floating-promises no-null-keyword */
import grpc, { status } from 'grpc';
import Logger from '../Logger';
import Service from '../service/Service';
import * as xudrpc from '../proto/xudrpc_pb';
import { ResolveRequest, ResolveResponse } from '../proto/lndrpc_pb';
import { StampedOrder, isOwnOrder, OrderPortion, SwapResult } from '../types/orders';
import { errorCodes as orderErrorCodes } from '../orderbook/errors';
import { errorCodes as serviceErrorCodes } from '../service/errors';
import { errorCodes as p2pErrorCodes } from '../p2p/errors';
import { errorCodes as lndErrorCodes } from '../lndclient/errors';
import { LndInfo } from '../lndclient/LndClient';

/**
 * Creates an xudrpc Order message from a [[StampedOrder]].
 */
const createOrder = (order: StampedOrder) => {
  const grpcOrder = new xudrpc.Order();
  grpcOrder.setCreatedAt(order.createdAt);
  grpcOrder.setId(order.id);
  if (isOwnOrder(order)) {
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
      case p2pErrorCodes.COULD_NOT_CONNECT:
      case orderErrorCodes.PAIR_DOES_NOT_EXIST:
        code = status.NOT_FOUND;
        break;
      case orderErrorCodes.DUPLICATE_ORDER:
      case p2pErrorCodes.NODE_ALREADY_CONNECTED:
      case orderErrorCodes.CURRENCY_ALREADY_EXISTS:
      case orderErrorCodes.PAIR_ALREADY_EXISTS:
        code = status.ALREADY_EXISTS;
        break;
      case p2pErrorCodes.NOT_CONNECTED:
      case lndErrorCodes.LND_IS_DISABLED:
      case lndErrorCodes.LND_IS_DISCONNECTED:
      case orderErrorCodes.CURRENCY_DOES_NOT_EXIST:
      case orderErrorCodes.CURRENCY_CANNOT_BE_REMOVED:
        code = status.FAILED_PRECONDITION;
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
      const removeOrderResponse = await this.service.removeOrder(call.request.toObject());
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
      const connectResponse = await this.service.connect(call.request.toObject());
      const response = new xudrpc.ConnectResponse();
      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.disconnect]]
   */
  public disconnect: grpc.handleUnaryCall<xudrpc.DisconnectRequest, xudrpc.DisconnectResponse> = async (call, callback) => {
    try {
      await this.service.disconnect(call.request.toObject());
      const response = new xudrpc.DisconnectResponse();
      callback(null, response);
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
   * See [[Service.getOrders]]
   */
  public getOrders: grpc.handleUnaryCall<xudrpc.GetOrdersRequest, xudrpc.GetOrdersResponse> = (call, callback) => {
    try {
      const getOrdersResponse = this.service.getOrders(call.request.toObject());
      const response = new xudrpc.GetOrdersResponse();

      const getOrdersList = <T extends StampedOrder>(orders: T[]) => {
        const ordersList: xudrpc.Order[] = [];
        orders.forEach(order => ordersList.push(createOrder(<StampedOrder>order)));
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
  public placeOrder: grpc.handleUnaryCall<xudrpc.PlaceOrderRequest, xudrpc.PlaceOrderResponse> = async (call, callback) => {
    try {
      const placeOrderResponse = await this.service.placeOrder(call.request.toObject());
      const response = new xudrpc.PlaceOrderResponse();
      const matchesList: xudrpc.OrderMatch[] = [];
      placeOrderResponse.matches.forEach((match) => {
        const orderMatch = new xudrpc.OrderMatch();
        orderMatch.setMaker(createOrder(match.maker));
        orderMatch.setTaker(createOrder(match.taker));
        matchesList.push(orderMatch);
      });
      response.setMatchesList(matchesList);

      if (placeOrderResponse.remainingOrder) {
        response.setRemainingOrder(createOrder(placeOrderResponse.remainingOrder));
      }
      callback(null, response);
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
    this.service.subscribeAddedOrders((order: StampedOrder) => {
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
      orderRemoval.setOrderId(order.orderId);
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
    this.service.subscribeSwaps((swapResult: SwapResult) => {
      const swap = new xudrpc.SwapResult();
      swap.setAmountReceived(swapResult.amountReceived);
      swap.setAmountSent(swapResult.amountSent);
      swap.setLocalId(swapResult.localId);
      swap.setPairId(swapResult.pairId);
      swap.setPeerPubKey(swapResult.peerPubKey);
      swap.setRHash(swapResult.r_hash);
      swap.setOrderId(swapResult.orderId);
      swap.setRole(swapResult.role as number);
      call.write(swap);
    });
  }
}

export default GrpcService;
