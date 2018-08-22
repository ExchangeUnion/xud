/* tslint:disable no-floating-promises no-null-keyword */
import grpc, { status } from 'grpc';
import Logger from '../Logger';
import Service from '../service/Service';
import * as xudrpc from '../proto/xudrpc_pb';
import { StampedPeerOrder, StampedOrder, StampedOwnOrder } from '../types/orders';
import { errorCodes as orderErrorCodes } from '../orderbook/errors';
import { errorCodes as serviceErrorCodes } from '../service/errors';
import { errorCodes as p2pErrorCodes } from '../p2p/errors';
import { LndInfo } from '../lndclient/LndClient';
import { OrderArrays } from '../orderbook/OrderBook';

/**
 * Convert a [[StampedOrder]] to an xudrpc Order message.
 */
const getOrder = (order: StampedOrder) => {
  const grpcOrder = new xudrpc.Order();
  grpcOrder.setCanceled(false);
  grpcOrder.setCreatedAt(order.createdAt);
  grpcOrder.setId(order.id);
  grpcOrder.setLocalId((order as StampedOwnOrder).localId);
  grpcOrder.setPairId(order.pairId);
  grpcOrder.setPeerPubKey((order as StampedPeerOrder).peerPubKey);
  grpcOrder.setPrice(order.price);
  grpcOrder.setQuantity(order.quantity);
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
        code = status.INVALID_ARGUMENT;
        break;
      case orderErrorCodes.INVALID_PAIR_ID:
        code = status.NOT_FOUND;
        break;
      case orderErrorCodes.DUPLICATE_ORDER:
      case p2pErrorCodes.NODE_ALREADY_CONNECTED:
        code = status.ALREADY_EXISTS;
        break;
      case p2pErrorCodes.NOT_CONNECTED:
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
   * See [[Service.cancelOrder]]
   */
  public cancelOrder: grpc.handleUnaryCall<xudrpc.CancelOrderRequest, xudrpc.CancelOrderResponse> = async (call, callback) => {
    try {
      const cancelOrderResponse = await this.service.cancelOrder(call.request.toObject());
      const response = new xudrpc.CancelOrderResponse();
      response.setCanceled(cancelOrderResponse.canceled);
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
      response.setResult(connectResponse);
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
      const disconnectResponse = await this.service.disconnect(call.request.toObject());
      const response = new xudrpc.DisconnectResponse();
      response.setResult(disconnectResponse);
      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.executeSwap]]
   */
  public executeSwap: grpc.handleUnaryCall<xudrpc.ExecuteSwapRequest, xudrpc.ExecuteSwapResponse> = (call, callback) => {
    try {
      const executeSwapResponse = this.service.executeSwap(call.request.toObject());
      const response = new xudrpc.ExecuteSwapResponse();
      response.setResult(executeSwapResponse);
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

      const getOrdersList = (orders: StampedOrder[]) => {
        const ordersList: xudrpc.Order[] = [];
        orders.forEach(order => ordersList.push(getOrder(order)));
        return ordersList;
      };

      const getOrders = (orderArrays: OrderArrays) => {
        const orders = new xudrpc.Orders();
        orders.setBuyOrdersList(getOrdersList(orderArrays.buyOrders));
        orders.setSellOrdersList(getOrdersList(orderArrays.sellOrders));
        return orders;
      };

      response.setOwnOrders(getOrders(getOrdersResponse.ownOrders));
      response.setPeerOrders(getOrders(getOrdersResponse.peerOrders));

      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.getPairs]]
   */
  public getPairs: grpc.handleUnaryCall<xudrpc.GetPairsRequest, xudrpc.GetPairsResponse> = (_, callback) => {
    try {
      const getPairsResponse = this.service.getPairs();
      const response = new xudrpc.GetPairsResponse();

      const pairs: xudrpc.Pair[] = [];
      getPairsResponse.forEach((pairInstance) => {
        const pair = new xudrpc.Pair();
        pair.setBaseCurrency(pairInstance.baseCurrency);
        pair.setId(pairInstance.id);
        pair.setQuoteCurrency(pairInstance.quoteCurrency);
        pair.setSwapProtocol(pairInstance.swapProtocol);
        pairs.push(pair);
      });
      response.setPairsList(pairs);
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
        orderMatch.setMaker(getOrder(match.maker));
        orderMatch.setTaker(getOrder(match.taker));
        matchesList.push(orderMatch);
      });
      response.setMatchesList(matchesList);

      if (placeOrderResponse.remainingOrder) {
        response.setRemainingOrder(getOrder(placeOrderResponse.remainingOrder));
      }
      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  public shutdown: grpc.handleUnaryCall<xudrpc.ShutdownRequest, xudrpc.ShutdownResponse> = (_, callback) => {
    try {
      const shutdownResponse = this.service.shutdown();
      const response = new xudrpc.ShutdownResponse();
      response.setResult(shutdownResponse);
      callback(null, response);
    } catch (err) {
      callback(this.getGrpcError(err), null);
    }
  }

  /*
   * See [[Service.subscribePeerOrders]]
   */
  public subscribePeerOrders: grpc.handleServerStreamingCall<xudrpc.SubscribePeerOrdersRequest, xudrpc.SubscribePeerOrdersResponse> = (call) => {
    this.service.subscribePeerOrders((order: StampedPeerOrder) => call.write({ order }));
  }

  /*
   * See [[Service.subscribeSwaps]]
   */
  public subscribeSwaps: grpc.handleServerStreamingCall<xudrpc.SubscribeSwapsRequest, xudrpc.SubscribeSwapsResponse> = (call) => {
    this.service.subscribeSwaps((order: StampedOrder) => call.write({ order }));
  }
}

export default GrpcService;
