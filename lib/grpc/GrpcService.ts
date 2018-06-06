import grpc from 'grpc';
import Logger from '../Logger';
import Service from '../service/Service';
import { TokenSwapPayload } from '../raidenclient/RaidenClient';
import { PairInstance } from '../types/db';
import { GetInfoResponse } from '../proto/lndrpc_pb';
import { Orders } from 'lib/orderbook/OrderBookRepository';
import { MatchingResult } from '../types/matchingEngine';
import { OwnOrder } from '../types/orders';

/** Class containing the available RPC methods for XUD */
class GrpcService {
  private logger: Logger;

  /** Create an instance of available RPC methods and bind all exposed functions. */
  constructor(private service: Service) {
    this.logger = Logger.rpc;
  }

  private unaryCall = async <T, U>(call: T, callback: grpc.sendUnaryData<U>, serviceMethod: Function) => {
    try {
      const response: U = await serviceMethod(call);
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
   * See [[Service.connect]]
   */
  public connect: grpc.handleUnaryCall<{ host: string, port: number }, Orders> = async (call, callback) => {
    this.unaryCall(call.request, callback, this.service.connect);
  }

  /**
   * See [[Service.tokenSwap]]
   */
  public tokenSwap: grpc.handleUnaryCall<{ target_address: string, payload: TokenSwapPayload, identifier: string }, {}> = async (call, callback) => {
    this.unaryCall(call.request, callback, this.service.tokenSwap);
  }
}

export default GrpcService;
