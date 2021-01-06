/* tslint:disable no-floating-promises no-null-keyword */
import grpc, { ServerWritableStream, status } from '@grpc/grpc-js';
import { fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';
import { SwapFailureReason } from '../constants/enums';
import { LndInfo } from '../lndclient/types';
import { isOwnOrder, Order, OrderPortion, PlaceOrderEventType, PlaceOrderResult } from '../orderbook/types';
import * as xudrpc from '../proto/xudrpc_pb';
import Service from '../service/Service';
import { ServiceOrder, ServicePlaceOrderEvent } from '../service/types';
import { SwapAccepted, SwapFailure, SwapSuccess } from '../swaps/types';
import getGrpcError from './getGrpcError';

/**
 * Creates an xudrpc Order message from an [[Order]].
 */
const createServiceOrder = (order: ServiceOrder) => {
  const grpcOrder = new xudrpc.Order();
  grpcOrder.setCreatedAt(order.createdAt);
  grpcOrder.setId(order.id);
  if (order.hold) {
    grpcOrder.setHold(order.hold);
  }
  if (order.localId) {
    grpcOrder.setLocalId(order.localId);
  }
  grpcOrder.setIsOwnOrder(order.isOwnOrder);
  const nodeIdentifier = new xudrpc.NodeIdentifier();
  nodeIdentifier.setNodePubKey(order.nodeIdentifier.nodePubKey);
  if (order.nodeIdentifier.alias) {
    nodeIdentifier.setAlias(order.nodeIdentifier.alias);
  }
  grpcOrder.setNodeIdentifier(nodeIdentifier);
  grpcOrder.setPairId(order.pairId);
  if (order.price) {
    grpcOrder.setPrice(order.price);
  }
  if (order.quantity) {
    grpcOrder.setQuantity(order.quantity);
  }
  grpcOrder.setSide(order.side as number);
  return grpcOrder;
};

const createOrder = (order: Order) => {
  const grpcOrder = new xudrpc.Order();
  grpcOrder.setCreatedAt(order.createdAt);
  grpcOrder.setId(order.id);
  if (isOwnOrder(order)) {
    grpcOrder.setHold(order.hold);
    grpcOrder.setLocalId(order.localId);
    grpcOrder.setIsOwnOrder(true);
  } else {
    const nodeIdentifier = new xudrpc.NodeIdentifier();
    nodeIdentifier.setNodePubKey(order.peerPubKey);
    grpcOrder.setNodeIdentifier(nodeIdentifier);
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
 * Creates an xudrpc SwapAccepted message from a [[SwapAccepted]].
 */
const createSwapAccepted = (swapAccepted: SwapAccepted) => {
  const grpcSwapAccepted = new xudrpc.SwapAccepted();
  grpcSwapAccepted.setOrderId(swapAccepted.orderId);
  grpcSwapAccepted.setLocalId(swapAccepted.localId);
  grpcSwapAccepted.setQuantity(swapAccepted.quantity);
  grpcSwapAccepted.setRHash(swapAccepted.rHash);
  grpcSwapAccepted.setPrice(swapAccepted.price);
  grpcSwapAccepted.setAmountReceiving(swapAccepted.amountReceiving);
  grpcSwapAccepted.setAmountSending(swapAccepted.amountSending);
  grpcSwapAccepted.setCurrencyReceiving(swapAccepted.currencyReceiving);
  grpcSwapAccepted.setCurrencySending(swapAccepted.currencySending);
  grpcSwapAccepted.setPeerPubKey(swapAccepted.peerPubKey);
  grpcSwapAccepted.setPairId(swapAccepted.pairId);
  return grpcSwapAccepted;
};

/**
 * Creates an xudrpc PlaceOrderResponse message from a [[PlaceOrderResult]].
 */
const createPlaceOrderResponse = (result: PlaceOrderResult) => {
  const response = new xudrpc.PlaceOrderResponse();

  const internalMatches = result.internalMatches.map((match) => createOrder(match));
  response.setInternalMatchesList(internalMatches);

  const swapSuccesses = result.swapSuccesses.map((swapSuccess) => createSwapSuccess(swapSuccess));
  response.setSwapSuccessesList(swapSuccesses);

  const swapFailures = result.swapFailures.map((swapFailure) => createSwapFailure(swapFailure));
  response.setSwapFailuresList(swapFailures);

  if (result.remainingOrder) {
    response.setRemainingOrder(createOrder(result.remainingOrder));
  }

  return response;
};

/**
 * Creates an xudrpc PlaceOrderEvent message from a [[PlaceOrderEvent]].
 */
const createPlaceOrderEvent = (e: ServicePlaceOrderEvent) => {
  const placeOrderEvent = new xudrpc.PlaceOrderEvent();
  switch (e.type) {
    case PlaceOrderEventType.Match:
      placeOrderEvent.setMatch(createServiceOrder(e.order!));
      break;
    case PlaceOrderEventType.SwapSuccess:
      placeOrderEvent.setSwapSuccess(createSwapSuccess(e.swapSuccess!));
      break;
    case PlaceOrderEventType.RemainingOrder:
      placeOrderEvent.setRemainingOrder(createServiceOrder(e.order!));
      break;
    case PlaceOrderEventType.SwapFailure:
      placeOrderEvent.setSwapFailure(createSwapFailure(e.swapFailure!));
      break;
    default:
      throw new Error('unrecognized PlaceOrderEventType');
  }
  return placeOrderEvent;
};

const getCancelled$ = (call: ServerWritableStream<any, any>) => {
  return fromEvent<void>(call, 'cancelled').pipe(take(1));
};

/** Class containing the available RPC methods for XUD */
class GrpcService implements grpc.UntypedServiceImplementation {
  [name: string]: any;
  public locked = false;
  private service?: Service;
  /** The set of active streaming calls. */
  private streams: Set<grpc.ServerWritableStream<any, any>> = new Set<grpc.ServerWritableStream<any, any>>();

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
  };

  /** Adds an active streaming call and adds a listener to remove it if it is cancelled. */
  private addStream = (stream: grpc.ServerWritableStream<any, any>) => {
    this.streams.add(stream);
    stream.once('cancelled', () => {
      this.streams.delete(stream);
    });
  };

  /**
   * Checks whether this service is ready to handle calls and sends an error to the client
   * caller if not ready.
   * @returns `true` if the service is ready, otherwise `false`
   */
  private isReady = (
    service: Service | undefined,
    callbackOrCall: grpc.sendUnaryData<any> | grpc.ServerWritableStream<any, any>,
  ): service is Service => {
    if (!service) {
      const err = this.locked
        ? { code: status.UNIMPLEMENTED, message: 'xud is locked', name: 'LockedError' }
        : { code: status.UNAVAILABLE, message: 'xud is starting', name: 'NotReadyError' };
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
  };

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
  };

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
  };

  /**
   * See [[Service.closeChannel]]
   */
  public closeChannel: grpc.handleUnaryCall<xudrpc.CloseChannelRequest, xudrpc.CloseChannelResponse> = async (
    call,
    callback,
  ) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const txIds = await this.service.closeChannel(call.request.toObject());
      const response = new xudrpc.CloseChannelResponse();
      response.setTransactionIdsList(txIds);

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

  /**
   * See [[Service.removeOrder]]
   */
  public removeOrder: grpc.handleUnaryCall<xudrpc.RemoveOrderRequest, xudrpc.RemoveOrderResponse> = async (
    call,
    callback,
  ) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const { removedQuantity, remainingQuantity, onHoldQuantity, pairId } = this.service.removeOrder(
        call.request.toObject(),
      );
      const response = new xudrpc.RemoveOrderResponse();
      response.setQuantityOnHold(onHoldQuantity);
      response.setRemainingQuantity(remainingQuantity);
      response.setRemovedQuantity(removedQuantity);
      response.setPairId(pairId);
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

  /**
   * See [[Service.removeAllOrders]]
   */
  public removeAllOrders: grpc.handleUnaryCall<xudrpc.RemoveAllOrdersRequest, xudrpc.RemoveAllOrdersResponse> = async (
    _,
    callback,
  ) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const { removedOrderLocalIds, onHoldOrderLocalIds } = await this.service.removeAllOrders();

      const response = new xudrpc.RemoveAllOrdersResponse();
      response.setRemovedOrderIdsList(removedOrderLocalIds);
      response.setOnHoldOrderIdsList(onHoldOrderLocalIds);

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

  /**
   * See [[Service.getBalance]]
   */
  public getBalance: grpc.handleUnaryCall<xudrpc.GetBalanceRequest, xudrpc.GetBalanceResponse> = async (
    call,
    callback,
  ) => {
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
  };

  /**
   * See [[Service.tradingLimits]]
   */
  public tradingLimits: grpc.handleUnaryCall<xudrpc.TradingLimitsRequest, xudrpc.TradingLimitsResponse> = async (
    call,
    callback,
  ) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const tradingLimitsResponse = await this.service.tradingLimits(call.request.toObject());
      const response = new xudrpc.TradingLimitsResponse();
      const limitsMap = response.getLimitsMap();
      tradingLimitsResponse.forEach((tradingLimitsObj, currency) => {
        const tradingLimits = new xudrpc.TradingLimits();
        tradingLimits.setMaxSell(tradingLimitsObj.maxSell);
        tradingLimits.setMaxBuy(tradingLimitsObj.maxBuy);
        tradingLimits.setReservedSell(tradingLimitsObj.reservedSell);
        tradingLimits.setReservedBuy(tradingLimitsObj.reservedBuy);
        limitsMap.set(currency, tradingLimits);
      });
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

  /**
   * See [[Service.openChannel]]
   */
  public openChannel: grpc.handleUnaryCall<xudrpc.OpenChannelRequest, xudrpc.OpenChannelResponse> = async (
    call,
    callback,
  ) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const txId = await this.service.openChannel(call.request.toObject());
      const response = new xudrpc.OpenChannelResponse();
      response.setTransactionId(txId);

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

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
  };

  /**
   * See [[Service.walletDeposit]]
   */
  public walletDeposit: grpc.handleUnaryCall<xudrpc.DepositRequest, xudrpc.DepositResponse> = async (
    call,
    callback,
  ) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const address = await this.service.walletDeposit(call.request.toObject());
      const response = new xudrpc.DepositResponse();
      response.setAddress(address);
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

  /**
   * See [[Service.deposit]]
   */
  public deposit: grpc.handleUnaryCall<xudrpc.DepositRequest, xudrpc.DepositResponse> = async (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const address = await this.service.deposit(call.request.toObject());
      const response = new xudrpc.DepositResponse();
      response.setAddress(address);
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

  /**
   * See [[Service.walletWithdraw]]
   */
  public walletWithdraw: grpc.handleUnaryCall<xudrpc.WithdrawRequest, xudrpc.WithdrawResponse> = async (
    call,
    callback,
  ) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const txId = await this.service.walletWithdraw(call.request.toObject());
      const response = new xudrpc.WithdrawResponse();
      response.setTransactionId(txId);
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

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
  };

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
  };

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
        let code: grpc.status;
        switch (err) {
          case SwapFailureReason.DealTimedOut:
          case SwapFailureReason.SwapTimedOut:
            code = grpc.status.DEADLINE_EXCEEDED;
            break;
          case SwapFailureReason.InvalidSwapRequest:
          case SwapFailureReason.PaymentHashReuse:
            // these cases suggest something went very wrong with our swap request
            code = grpc.status.INTERNAL;
            break;
          case SwapFailureReason.InsufficientBalance:
          case SwapFailureReason.NoRouteFound:
          case SwapFailureReason.SendPaymentFailure:
          case SwapFailureReason.SwapClientNotSetup:
          case SwapFailureReason.OrderOnHold:
            code = grpc.status.FAILED_PRECONDITION;
            break;
          case SwapFailureReason.UnexpectedClientError:
          case SwapFailureReason.UnknownError:
          default:
            code = grpc.status.UNKNOWN;
            break;
        }
        const grpcError: grpc.ServiceError = {
          code,
          name: SwapFailureReason[err],
          message: SwapFailureReason[err],
          details: SwapFailureReason[err],
          metadata: new grpc.Metadata(),
        };
        callback(grpcError, null);
      } else {
        callback(getGrpcError(err), null);
      }
    }
  };

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

      const getLndInfo = (lndInfo: LndInfo): xudrpc.LndInfo => {
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
      };
      const lndMap = response.getLndMap();
      getInfoResponse.lnd.forEach((lndInfo, currency) => {
        lndMap.set(currency, getLndInfo(lndInfo));
      });

      if (getInfoResponse.connext) {
        const connext = new xudrpc.ConnextInfo();
        connext.setStatus(getInfoResponse.connext.status);
        if (getInfoResponse.connext.address) connext.setAddress(getInfoResponse.connext.address);
        if (getInfoResponse.connext.version) connext.setVersion(getInfoResponse.connext.version);
        if (getInfoResponse.connext.chain) connext.setChain(getInfoResponse.connext.chain);
        response.setConnext(connext);
      }

      const orders = new xudrpc.OrdersCount();
      orders.setOwn(getInfoResponse.orders.own);
      orders.setPeer(getInfoResponse.orders.peer);
      response.setOrders(orders);

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

  /**
   * See [[Service.getMnemonic]]
   */
  public getMnemonic: grpc.handleUnaryCall<xudrpc.GetMnemonicRequest, xudrpc.GetMnemonicResponse> = async (
    _,
    callback,
  ) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const mnemonic = await this.service.getMnemonic();
      const response = new xudrpc.GetMnemonicResponse();
      response.setSeedMnemonicList(mnemonic);
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

  /**
   * See [[Service.getNodeInfo]]
   */
  public getNodeInfo: grpc.handleUnaryCall<xudrpc.GetNodeInfoRequest, xudrpc.GetNodeInfoResponse> = async (
    call,
    callback,
  ) => {
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
  };

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

      const listOrdersList = <T extends ServiceOrder>(orders: T[]) => {
        const ordersList: xudrpc.Order[] = [];
        orders.forEach((order) => ordersList.push(createServiceOrder(order)));
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
  };

  /**
   * See [[Service.listCurrencies]]
   */
  public listCurrencies: grpc.handleUnaryCall<xudrpc.ListCurrenciesRequest, xudrpc.ListCurrenciesResponse> = (
    _,
    callback,
  ) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const currencies = this.service.listCurrencies();
      const response = new xudrpc.ListCurrenciesResponse();

      currencies.forEach((currency) => {
        const resultCurrency = new xudrpc.Currency();
        resultCurrency.setDecimalPlaces(currency.decimalPlaces);
        resultCurrency.setCurrency(currency.id);
        if (currency.tokenAddress) {
          resultCurrency.setTokenAddress(currency.tokenAddress);
        }
        resultCurrency.setSwapClient(currency.swapClient as number);
        response.getCurrenciesList().push(resultCurrency);
      });

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

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
  };

  /**
   * See [[Service.tradeHistory]]
   */
  public tradeHistory: grpc.handleUnaryCall<xudrpc.TradeHistoryRequest, xudrpc.TradeHistoryResponse> = async (
    call,
    callback,
  ) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const trades = await this.service.tradeHistory(call.request.toObject());
      const response = new xudrpc.TradeHistoryResponse();
      const tradesList: xudrpc.Trade[] = trades.map((trade) => {
        const grpcTrade = new xudrpc.Trade();
        grpcTrade.setMakerOrder(createServiceOrder(trade.makerOrder));
        if (trade.takerOrder) {
          grpcTrade.setTakerOrder(createServiceOrder(trade.takerOrder));
        }
        grpcTrade.setPairId(trade.pairId);
        grpcTrade.setQuantity(trade.quantity);
        if (trade.rHash) {
          grpcTrade.setRHash(trade.rHash);
        }
        grpcTrade.setPrice(trade.price);
        grpcTrade.setSide(trade.side as number);
        grpcTrade.setRole(trade.role as number);
        grpcTrade.setExecutedAt(trade.executedAt);
        if (trade.counterparty) {
          const counterparty = new xudrpc.NodeIdentifier();
          counterparty.setNodePubKey(trade.counterparty.nodePubKey);
          if (trade.counterparty.alias) {
            counterparty.setAlias(trade.counterparty.alias);
          }
          grpcTrade.setCounterparty(counterparty);
        }

        return grpcTrade;
      });

      response.setTradesList(tradesList);
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

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
        grpcPeer.setConnextIdentifier(peer.connextIdentifier || '');
        if (peer.lndPubKeys) {
          const map = grpcPeer.getLndPubKeysMap();
          for (const key of Object.keys(peer.lndPubKeys)) {
            map.set(key, peer.lndPubKeys[key]);
          }
        }
        if (peer.lndUris) {
          for (const key of Object.keys(peer.lndUris)) {
            const grpcUri = new xudrpc.Peer.LndUris();
            grpcUri.setCurrency(key);
            grpcUri.getUriList().push(...(peer.lndUris[key] || []));
            grpcPeer.getLndUrisList().push(grpcUri);
          }
        }
        grpcPeer.setPairsList(peer.pairs || []);
        grpcPeer.setSecondsConnected(peer.secondsConnected);
        grpcPeer.setXudVersion(peer.xudVersion || '');
        peers.push(grpcPeer);
      });
      response.setPeersList(peers);
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

  public orderBook: grpc.handleUnaryCall<xudrpc.OrderBookRequest, xudrpc.OrderBookResponse> = (call, callback) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const orderBookResponse = this.service.orderbook(call.request.toObject());
      const response = new xudrpc.OrderBookResponse();

      const createBucket = (bucket: { price: number; quantity: number }) => {
        const grpcBucket = new xudrpc.OrderBookResponse.Bucket();
        grpcBucket.setPrice(bucket.price);
        grpcBucket.setQuantity(bucket.quantity);
        return grpcBucket;
      };

      orderBookResponse.forEach((orderBookBuckets, currency) => {
        const buckets = new xudrpc.OrderBookResponse.Buckets();
        const buyBuckets = orderBookBuckets.buyBuckets.map(createBucket);
        const sellBuckets = orderBookBuckets.sellBuckets.map(createBucket);
        buckets.setBuyBucketsList(buyBuckets);
        buckets.setSellBucketsList(sellBuckets);
        response.getBucketsMap().set(currency, buckets);
      });

      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

  /**
   * See [[Service.placeOrder]]
   */
  public placeOrder: grpc.handleServerStreamingCall<xudrpc.PlaceOrderRequest, xudrpc.PlaceOrderEvent> = async (
    call,
  ) => {
    if (!this.service) {
      call.emit('error', {
        code: grpc.status.UNAVAILABLE,
        message: 'xud is starting',
        name: 'NotReadyError',
      });
      return;
    }
    try {
      await this.service.placeOrder(call.request.toObject(), (result: ServicePlaceOrderEvent) => {
        call.write(createPlaceOrderEvent(result));
      });

      call.end();
    } catch (err) {
      call.emit('error', getGrpcError(err));
    }
  };

  /**
   * See [[Service.placeOrder]]
   */
  public placeOrderSync: grpc.handleUnaryCall<xudrpc.PlaceOrderRequest, xudrpc.PlaceOrderResponse> = async (
    call,
    callback,
  ) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      const result = await this.service.placeOrder(call.request.toObject());
      callback(null, createPlaceOrderResponse(result));
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

  /**
   * See [[Service.addCurrency]]
   */
  public removeCurrency: grpc.handleUnaryCall<xudrpc.RemoveCurrencyRequest, xudrpc.RemoveCurrencyResponse> = async (
    call,
    callback,
  ) => {
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
  };

  /**
   * See [[Service.addPair]]
   */
  public removePair: grpc.handleUnaryCall<xudrpc.RemovePairRequest, xudrpc.RemovePairResponse> = async (
    call,
    callback,
  ) => {
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
  };

  /**
   * See [[Service.discoverNodes]]
   */
  public discoverNodes: grpc.handleUnaryCall<xudrpc.DiscoverNodesRequest, xudrpc.DiscoverNodesResponse> = async (
    call,
    callback,
  ) => {
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
  };

  public setLogLevel: grpc.handleUnaryCall<xudrpc.SetLogLevelRequest, xudrpc.SetLogLevelResponse> = async (
    call,
    callback,
  ) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      await this.service.setLogLevel(call.request.toObject());

      const response = new xudrpc.SetLogLevelResponse();
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

  public changePassword: grpc.handleUnaryCall<xudrpc.ChangePasswordRequest, xudrpc.ChangePasswordResponse> = async (
    call,
    callback,
  ) => {
    if (!this.isReady(this.service, callback)) {
      return;
    }
    try {
      await this.service.changePassword(call.request.toObject());

      const response = new xudrpc.ChangePasswordResponse();
      callback(null, response);
    } catch (err) {
      callback(getGrpcError(err), null);
    }
  };

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
  };

  /*
   * See [[Service.subscribeOrders]]
   */
  public subscribeOrders: grpc.handleServerStreamingCall<xudrpc.SubscribeOrdersRequest, xudrpc.OrderUpdate> = (
    call,
  ) => {
    if (!this.service) {
      call.emit('error', { code: grpc.status.UNAVAILABLE, message: 'xud is starting', name: 'NotReadyError' });
      return;
    }
    const cancelled$ = getCancelled$(call);
    this.service.subscribeOrders(
      call.request.toObject(),
      (order?: ServiceOrder, orderRemoval?: OrderPortion) => {
        const orderUpdate = new xudrpc.OrderUpdate();
        if (order) {
          orderUpdate.setOrder(createServiceOrder(order));
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
      },
      cancelled$,
    );
  };

  /*
   * See [[Service.subscribeSwapFailures]]
   */
  public subscribeSwapFailures: grpc.handleServerStreamingCall<xudrpc.SubscribeSwapsRequest, xudrpc.SwapFailure> = (
    call,
  ) => {
    if (!this.service) {
      call.emit('error', { code: grpc.status.UNAVAILABLE, message: 'xud is starting', name: 'NotReadyError' });
      return;
    }
    const cancelled$ = getCancelled$(call);
    this.service.subscribeSwapFailures(
      call.request.toObject(),
      (result: SwapFailure) => {
        call.write(createSwapFailure(result));
      },
      cancelled$,
    );
    this.addStream(call);
  };

  /*
   * See [[Service.subscribeSwaps]]
   */
  public subscribeSwaps: grpc.handleServerStreamingCall<xudrpc.SubscribeSwapsRequest, xudrpc.SwapSuccess> = (call) => {
    if (!this.service) {
      call.emit('error', { code: grpc.status.UNAVAILABLE, message: 'xud is starting', name: 'NotReadyError' });
      return;
    }
    const cancelled$ = getCancelled$(call);
    this.service.subscribeSwaps(
      call.request.toObject(),
      (result: SwapSuccess) => {
        call.write(createSwapSuccess(result));
      },
      cancelled$,
    );
    this.addStream(call);
  };

  /*
   * See [[Service.subscribeSwapFailures]]
   */
  public subscribeSwapsAccepted: grpc.handleServerStreamingCall<
    xudrpc.SubscribeSwapsAcceptedRequest,
    xudrpc.SwapAccepted
  > = (call) => {
    if (!this.service) {
      call.emit('error', { code: grpc.status.UNAVAILABLE, message: 'xud is starting', name: 'NotReadyError' });
      return;
    }

    const cancelled$ = getCancelled$(call);
    this.service.subscribeSwapsAccepted(
      call.request.toObject(),
      (result: SwapAccepted) => {
        call.write(createSwapAccepted(result));
      },
      cancelled$,
    );
    this.addStream(call);
  };
}

export default GrpcService;
