import grpc from 'grpc';
import Logger from '../Logger';
import Service from '../service/Service';
import { isObject } from '../utils/utils';
import { TokenSwapPayload } from '../raidenclient/RaidenClient';
import { PairInstance } from '../types/db';
import { GetInfoResponse } from '../proto/lndrpc_pb';
import { Orders } from 'lib/orderbook/OrderBookRepository';
import { MatchingResult } from '../types/matchingEngine';
import { OwnOrder } from '../types/orders';

function serializeDateProperties(response) {
  Object.keys(response).forEach((key) => {
    if (response[key] instanceof Date) {
      response[key] = response[key].getTime();
    } else if (isObject(response[key])) {
      response[key] = serializeDateProperties(response[key]);
    }
  });

  return response;
}

/** Class containing the available RPC methods for XUD */
class GrpcService {
  private logger: Logger;

  /** Create an instance of available RPC methods and bind all exposed functions. */
  constructor(private service: Service) {
    this.logger = Logger.rpc;
  }

  private unaryCall = async <T, U>(call: T, callback: grpc.sendUnaryData<U>, serviceMethod: Function) => {
    try {
      const rawResponse: U = await serviceMethod(call);
      const response = serializeDateProperties(rawResponse);
      callback(null, response);
    } catch (err) {
      this.logger.error(err);
      callback(err, null);
    }
  }

  /**
   * See [[Service.getInfo]]
   */
  public getInfo: grpc.handleUnaryCall<{}, {lnd: GetInfoResponse}> = (call, callback) => {
    this.unaryCall(call.request, callback, this.service.getInfo);
  }

  /**
   * See [[Service.getPairs]]
   */
  public getPairs: grpc.handleUnaryCall<{}, PairInstance[]> = async (call, callback) => {
    this.unaryCall(call.request, callback, this.service.getPairs);
  }

  /**
   * See [[Service.getOrders]]
   */
  public getOrders: grpc.handleUnaryCall<{ pairId: string, maxResults: number }, Orders> = async (call, callback) => {
    this.unaryCall(call.request, callback, this.service.getOrders);
  }

  /**
   * See [[Service.placeOrder]]
   */
  public placeOrder: grpc.handleUnaryCall<{ order: OwnOrder }, MatchingResult> = async (call, callback) => {
    this.unaryCall(call.request.order, callback, this.service.placeOrder);
  }

  /**
   * See [[Service.cancelOrder]]
   */
  public cancelOrder: grpc.handleUnaryCall<{ id: string }, string> = async (call, callback) => {
    this.unaryCall(call.request.id, callback, this.service.cancelOrder);
  }

  /**
   * See [[Service.connect]]
   */
  public connect: grpc.handleUnaryCall<{ host: string, port: number }, Orders> = async (call, callback) => {
    this.unaryCall(call.request, callback, this.service.connect);
  }

  /**
   * See [[Service.disconnect]]
   */
  public disconnect: grpc.handleUnaryCall<{ host: string, port: number }, Orders> = async (call, callback) => {
    this.unaryCall(call.request, callback, this.service.disconnect);
  }

  /**
   * See [[Service.tokenSwap]]
   */
  public tokenSwap: grpc.handleUnaryCall<{ target_address: string, payload: TokenSwapPayload, identifier: string }, {}> = async (call, callback) => {
    this.unaryCall(call.request, callback, this.service.tokenSwap);
  }

  public shutdown: grpc.handleUnaryCall<{}, {}> = async (call, callback) => {
    this.unaryCall(call.request, callback, this.service.shutdown);
  }
}

export default GrpcService;
