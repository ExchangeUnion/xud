/* tslint:disable no-floating-promises no-null-keyword */
import grpc, { status } from 'grpc';
import { SwapFailureReason } from '../constants/enums';
import { CurrencyInstance, OrderInstance, TradeInstance } from '../db/types';
import { LndInfo } from '../lndclient/types';
import { isOwnOrder, Order, OrderPortion, PlaceOrderEvent, PlaceOrderEventType, PlaceOrderResult } from '../orderbook/types';
import * as xudrpc from '../proto/xudrpc_pb';
import Service from '../service/Service';
import { SwapFailure, SwapSuccess } from '../swaps/types';
import getGrpcError from './getGrpcError';

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
 * Creates an xudrpc Order from OrderInstance.
 */
const getGrpcOrderFromOrderInstance = (order: OrderInstance) => {
  const grpcOrder = new xudrpc.Order();
  grpcOrder.setCreatedAt(order.createdAt);
  grpcOrder.setId(order.id);
  grpcOrder.setIsOwnOrder(order.nodeId === undefined);
  if (order.localId) {
    grpcOrder.setLocalId(order.localId);
  }
  grpcOrder.setPairId(order.pairId);
  // TODO: set peer pub key if order.nodeId has a value
  if (order.price) {
    grpcOrder.setPrice(order.price);
  }
  grpcOrder.setSide(order.isBuy ? xudrpc.OrderSide.BUY : xudrpc.OrderSide.SELL);
  return grpcOrder;
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
  public locked = false;
  private service?: Service;
  /** The set of active streaming calls. */
  private streams: Set<grpc.ServerWriteableStream<any>> = new Set<grpc.ServerWriteableStream<any>>();

  /** Create an instance of available RPC methods and bind all exposed functions. */
  constructor() {}

  public setService(service: Service) {
    this.service = service;
    this.locked = false;
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
   * Checks whether this service is ready to handle calls and sends an error to the client
   * caller if not ready.
   * @returns `true` if the service is ready, otherwise `false`
   */
  private isReady = (service: Service | undefined, callbackOrCall: grpc.sendUnaryData<any> | grpc.ServerWriteableStream<any>): service is Service => {
    if (!service) {
      const err = this.locked ?
      { code: status.UNIMPLEMENTED, message: 'xud is locked', name: 'LockedError' } :
        { code: status.UNAVAILABLE, message: 'xud is starting', name: 'NotReadyError' };
      if (typeof callbackOrCall === 'function') {
        const callback = callbackOrCall;
        callback(err, null);
      } else {
        const call = callbackOrCall;
        call.emit('error', err);
      }
      return false;
    }
    return true;
  }

  /**
   * See [[Service.addCurrency]]
   */
  public addCurrency: grpc.handleUnaryCall<xudrpc.Currency, xudrpc.AddCurrencyResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      await this.service.addCurrency(call.request.toObject());
      const response = new xudrpc.AddCurrencyResponse();

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.addPair]]
   */
  public addPair: grpc.handleUnaryCall<xudrpc.AddPairRequest, xudrpc.AddPairResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      await this.service.addPair(call.request.toObject());
      const response = new xudrpc.AddPairResponse();

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.removeOrder]]
   */
  public removeOrder: grpc.handleUnaryCall<xudrpc.RemoveOrderRequest, xudrpc.RemoveOrderResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const quantityOnHold = this.service.removeOrder(call.request.toObject());
      const response = new xudrpc.RemoveOrderResponse();
      response.setQuantityOnHold(quantityOnHold);
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.getBalance]]
   */
  public getBalance: grpc.handleUnaryCall<xudrpc.GetBalanceRequest, xudrpc.GetBalanceResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const balanceResponse = await this.service.getBalance(call.request.toObject());
      const response = new xudrpc.GetBalanceResponse();
      const balancesMap = response.getBalancesMap();
      balanceResponse.forEach((balanceObj, currency) => {
        const balance = new xudrpc.Balance();
        balance.setTotalBalance(balanceObj.totalBalance);
        balance.setChannelBalance(balanceObj.channelBalance);
        balance.setPendingChannelBalance(balanceObj.pendingChannelBalance);
        balance.setInactiveChannelBalance(balanceObj.inactiveChannelBalance);
        balance.setWalletBalance(balanceObj.walletBalance);
        balance.setUnconfirmedWalletBalance(balanceObj.unconfirmedWalletBalance);
        balancesMap.set(currency, balance);
      });
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.tradingLimits]]
   */
  public tradingLimits: grpc.handleUnaryCall<xudrpc.TradingLimitsRequest, xudrpc.TradingLimitsResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const tradingLimitsResponse = await this.service.tradingLimits(call.request.toObject());
      const response = new xudrpc.TradingLimitsResponse();
      const limitsMap = response.getLimitsMap();
      tradingLimitsResponse.forEach((tradingLimitsObj, currency) => {
        const tradingLimits = new xudrpc.TradingLimits();
        tradingLimits.setMaxsell(tradingLimitsObj.maxSell);
        tradingLimits.setMaxbuy(tradingLimitsObj.maxBuy);
        limitsMap.set(currency, tradingLimits);
      });
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.openChannel]]
   */
  public openChannel: grpc.handleUnaryCall<xudrpc.OpenChannelRequest, xudrpc.OpenChannelResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      await this.service.openChannel(call.request.toObject());
      const response = new xudrpc.OpenChannelResponse();
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.connect]]
   */
  public connect: grpc.handleUnaryCall<xudrpc.ConnectRequest, xudrpc.ConnectResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const { nodeUri } = call.request.toObject();
      await this.service.connect({ nodeUri, retryConnecting: false });
      const response = new xudrpc.ConnectResponse();
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.ban]]
   */
  public ban: grpc.handleUnaryCall<xudrpc.BanRequest, xudrpc.BanResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      await this.service.ban(call.request.toObject());
      const response = new xudrpc.BanResponse();
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.unban]]
   */
  public unban: grpc.handleUnaryCall<xudrpc.UnbanRequest, xudrpc.UnbanResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      await this.service.unban(call.request.toObject());
      const response = new xudrpc.UnbanResponse();
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.executeSwap]]
   */
  public executeSwap: grpc.handleUnaryCall<xudrpc.ExecuteSwapRequest, xudrpc.SwapSuccess> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const swapSuccess = await this.service.executeSwap(call.request.toObject());
      callback(null, createSwapSuccess(swapSuccess));
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
        callback(grpcError, null);
      } else {
        callback(getGrpcError(err), null);
      }
    }
  }

  /**
   * See [[Service.getInfo]]
   */
  public getInfo: grpc.handleUnaryCall<xudrpc.GetInfoRequest, xudrpc.GetInfoResponse> = async (_, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const getInfoResponse = await this.service.getInfo();
      const response = new xudrpc.GetInfoResponse();
      response.setNodePubKey(getInfoResponse.nodePubKey);
      response.setUrisList(getInfoResponse.uris);
      response.setNumPairs(getInfoResponse.numPairs);
      response.setNumPeers(getInfoResponse.numPeers);
      response.setVersion(getInfoResponse.version);
      response.setAlias(getInfoResponse.alias);
      response.setNetwork(getInfoResponse.network);

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
          const channels = new xudrpc.Channels();
          channels.setActive(lndInfo.channels.active);
          channels.setPending(lndInfo.channels.pending);
          channels.setClosed(lndInfo.channels.closed);
          if (lndInfo.channels.inactive) channels.setInactive(lndInfo.channels.inactive);
          lnd.setChannels(channels);
        }
        lnd.setStatus(lndInfo.status);
        if (lndInfo.uris) lnd.setUrisList(lndInfo.uris);
        if (lndInfo.version) lnd.setVersion(lndInfo.version);
        if (lndInfo.alias) lnd.setAlias(lndInfo.alias);
        return lnd;
      });
      const lndMap = response.getLndMap();
      getInfoResponse.lnd.forEach((lndInfo, currency) => {
        lndMap.set(currency, getLndInfo(lndInfo));
      });

      if (getInfoResponse.raiden) {
        const raiden = new xudrpc.RaidenInfo();
        raiden.setStatus(getInfoResponse.raiden.status);
        if (getInfoResponse.raiden.address) raiden.setAddress(getInfoResponse.raiden.address);
        if (getInfoResponse.raiden.channels) {
          const channels = new xudrpc.Channels();
          channels.setActive(getInfoResponse.raiden.channels.active);
          // channels.setSettled(getInfoResponse.raiden.channels.settled);
          channels.setClosed(getInfoResponse.raiden.channels.closed);
          raiden.setChannels(channels);
        }
        if (getInfoResponse.raiden.version) raiden.setVersion(getInfoResponse.raiden.version);
        if (getInfoResponse.raiden.chain) raiden.setChain(getInfoResponse.raiden.chain);
        response.setRaiden(raiden);
      }

      const orders = new xudrpc.OrdersCount;
      orders.setOwn(getInfoResponse.orders.own);
      orders.setPeer(getInfoResponse.orders.peer);
      response.setOrders(orders);

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.getNodeInfo]]
   */
  public getNodeInfo: grpc.handleUnaryCall<xudrpc.GetNodeInfoRequest, xudrpc.GetNodeInfoResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const { banned, reputationScore } = await this.service.getNodeInfo(call.request.toObject());
      const response = new xudrpc.GetNodeInfoResponse();
      if (banned) {
        response.setBanned(banned);
      }
      response.setReputationscore(reputationScore);
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.listOrders]]
   */
  public listOrders: grpc.handleUnaryCall<xudrpc.ListOrdersRequest, xudrpc.ListOrdersResponse> = (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
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
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.listCurrencies]]
   */
  public listCurrencies: grpc.handleUnaryCall<xudrpc.ListCurrenciesRequest, xudrpc.ListCurrenciesResponse> = (_, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const currencies = this.service.listCurrencies();
      const response = new xudrpc.ListCurrenciesResponse();

      currencies.forEach((currency: CurrencyInstance) => {
        const resultCurrency = new xudrpc.Currency();
        resultCurrency.setDecimalPlaces(currency.decimalPlaces);
        resultCurrency.setCurrency(currency.id);
        resultCurrency.setTokenAddress(currency.tokenAddress);
        resultCurrency.setSwapClient(currency.swapClient as number);
        response.getCurrenciesList().push(resultCurrency);
      });

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.listPairs]]
   */
  public listPairs: grpc.handleUnaryCall<xudrpc.ListPairsRequest, xudrpc.ListPairsResponse> = (_, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const listPairsResponse = this.service.listPairs();
      const response = new xudrpc.ListPairsResponse();
      response.setPairsList(listPairsResponse);

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.listTrades]]
   */
  public listTrades: grpc.handleUnaryCall<xudrpc.ListTradesRequest, xudrpc.ListTradesResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const trades = await this.service.listTrades(call.request.toObject());
      const response = new xudrpc.ListTradesResponse();
      const tradesList: xudrpc.Trade[] = [];
      await Promise.all(trades.map(async (trade: TradeInstance) => {
        const grpcTrade = new xudrpc.Trade();
        const makerOrder = await trade.getMakerOrder();
        const takerOrder = await trade.getTakerOrder();
        grpcTrade.setQuantity(trade.quantity);
        grpcTrade.setRHash(trade.rHash ? trade.rHash : '');
        grpcTrade.setMakerOrder(getGrpcOrderFromOrderInstance(makerOrder!));
        grpcTrade.setTakerOrder(takerOrder ? getGrpcOrderFromOrderInstance(takerOrder) : undefined);
        grpcTrade.setPairId(makerOrder!.pairId);
        tradesList.push(grpcTrade);
      }));

      response.setTradesList(tradesList);
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.listPeers]]
   */
  public listPeers: grpc.handleUnaryCall<xudrpc.ListPeersRequest, xudrpc.ListPeersResponse> = (_, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const listPeersResponse = this.service.listPeers();
      const response = new xudrpc.ListPeersResponse();
      const peers: xudrpc.Peer[] = [];
      listPeersResponse.forEach((peer) => {
        const grpcPeer = new xudrpc.Peer();
        grpcPeer.setAddress(peer.address);
        grpcPeer.setInbound(peer.inbound);
        grpcPeer.setNodePubKey(peer.nodePubKey || '');
        grpcPeer.setAlias(peer.alias || '');
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
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.placeOrder]]
   */
  public placeOrder: grpc.handleServerStreamingCall<xudrpc.PlaceOrderRequest, xudrpc.PlaceOrderResponse> = async (call) => {
    if (!this.service) {
      call.emit('error', { code: status.UNAVAILABLE, message: 'xud is starting', name: 'NotReadyError' });
      return;
    }
    try {
      await this.service.placeOrder(call.request.toObject(), (result: PlaceOrderEvent) => {
        call.write(createPlaceOrderEvent(result));
      });

      call.end();
    } catch (err) {
      call.emit('error', getGrpcError(err));
    }
  }

  /**
   * See [[Service.placeOrder]]
   */
  public placeOrderSync: grpc.handleUnaryCall<xudrpc.PlaceOrderRequest, xudrpc.PlaceOrderResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const result = await this.service.placeOrder(call.request.toObject());
      callback(null, createPlaceOrderResponse(result));
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.addCurrency]]
   */
  public removeCurrency: grpc.handleUnaryCall<xudrpc.RemoveCurrencyRequest, xudrpc.RemoveCurrencyResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      await this.service.removeCurrency(call.request.toObject());
      const response = new xudrpc.RemoveCurrencyResponse();

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.addPair]]
   */
  public removePair: grpc.handleUnaryCall<xudrpc.RemovePairRequest, xudrpc.RemovePairResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      await this.service.removePair(call.request.toObject());
      const response = new xudrpc.RemovePairResponse();

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /**
   * See [[Service.discoverNodes]]
   */
  public discoverNodes: grpc.handleUnaryCall<xudrpc.DiscoverNodesRequest, xudrpc.DiscoverNodesResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const numNodes = await this.service.discoverNodes(call.request.toObject());

      const response = new xudrpc.DiscoverNodesResponse();
      response.setNumNodes(numNodes);

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  public shutdown: grpc.handleUnaryCall<xudrpc.ShutdownRequest, xudrpc.ShutdownResponse> = (_, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      this.service.shutdown();
      const response = new xudrpc.ShutdownResponse();
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  }

  /*
   * See [[Service.subscribeOrders]]
   */
  public subscribeOrders: grpc.handleServerStreamingCall<xudrpc.SubscribeOrdersRequest, xudrpc.OrderUpdate> = (call) => {
    if (!this.service) {
      call.emit('error', { code: status.UNAVAILABLE, message: 'xud is starting', name: 'NotReadyError' });
      return;
    }
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
    if (!this.service) {
      call.emit('error', { code: status.UNAVAILABLE, message: 'xud is starting', name: 'NotReadyError' });
      return;
    }
    this.service.subscribeSwapFailures(call.request.toObject(), (result: SwapFailure) => {
      call.write(createSwapFailure(result));
    });
    this.addStream(call);
  }

  /*
   * See [[Service.subscribeSwaps]]
   */
  public subscribeSwaps: grpc.handleServerStreamingCall<xudrpc.SubscribeSwapsRequest, xudrpc.SwapSuccess> = (call) => {
    if (!this.service) {
      call.emit('error', { code: status.UNAVAILABLE, message: 'xud is starting', name: 'NotReadyError' });
      return;
    }
    this.service.subscribeSwaps(call.request.toObject(), (result: SwapSuccess) => {
      call.write(createSwapSuccess(result));
    });
    this.addStream(call);
  }
}

export default GrpcService;
