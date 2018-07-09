import grpc from 'grpc';
import Logger from '../Logger';
import Service from '../service/Service';
import { isObject, ms } from '../utils/utils';
import { TokenSwapPayload } from '../raidenclient/RaidenClient';
import { PairInstance } from '../types/db';
import { GetInfoResponse, Invoice } from '../proto/lndrpc_pb';
import { Orders } from 'lib/orderbook/OrderBookRepository';
import { MatchingResult } from '../types/matchingEngine';
import { OwnOrder } from '../types/orders';
import { PayInvoiceResponse, SubscibeInvoicesResponse, StreamingExampleResponse } from '../proto/xudrpc_pb';

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
    service.lndClient.subscribeInvoices();
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
   * Example for a server-side streaming call
   */
  public streamingExample: grpc.handleServerStreamingCall<{}, StreamingExampleResponse> = async (call) => {
    setInterval(() => {
      const date = ms();
      call.write({
        date,
      });
    }, 1000);
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

  /**
   * See [[Service.payInvoice]]
   */
  // TODO: own type for response
  public payInvoice: grpc.handleUnaryCall<{ invoice: string }, PayInvoiceResponse> = async (call, callback) => {
    this.unaryCall(call.request, callback, this.service.payInvoice);
  }

  /**
   * Uni-directional stream (server -> client) containing all settled invoices
   */
  public subscribeInvoices: grpc.handleServerStreamingCall<{}, SubscibeInvoicesResponse> = async (call) => {
    this.service.lndClient.on('invoice.settled', (data) => {
      call.write({
        preimage: data.r_preimage,
        value: data.value,
        memo: data.memo,
      });
    });
  }

  public shutdown: grpc.handleUnaryCall<{}, {}> = async (call, callback) => {
    this.unaryCall(call.request, callback, this.service.shutdown);
  }
}

export default GrpcService;
