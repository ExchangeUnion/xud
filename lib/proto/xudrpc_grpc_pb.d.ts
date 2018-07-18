// package: xudrpc
// file: xudrpc.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as xudrpc_pb from "./xudrpc_pb";
import * as annotations_pb from "./annotations_pb";

interface IXudService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getInfo: IXudService_IGetInfo;
    getPairs: IXudService_IGetPairs;
    getOrders: IXudService_IGetOrders;
    placeOrder: IXudService_IPlaceOrder;
    connect: IXudService_IConnect;
    executeSwap: IXudService_IExecuteSwap;
    shutdown: IXudService_IShutdown;
    streamingExample: IXudService_IStreamingExample;
    subscribePeerOrders: IXudService_ISubscribePeerOrders;
    subscribeSwaps: IXudService_ISubscribeSwaps;
}

interface IXudService_IGetInfo extends grpc.MethodDefinition<xudrpc_pb.GetInfoRequest, xudrpc_pb.GetInfoResponse> {
    path: string; // "/xudrpc.Xud/GetInfo"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.GetInfoRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.GetInfoRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.GetInfoResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.GetInfoResponse>;
}
interface IXudService_IGetPairs extends grpc.MethodDefinition<xudrpc_pb.GetPairsRequest, xudrpc_pb.GetPairsResponse> {
    path: string; // "/xudrpc.Xud/GetPairs"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.GetPairsRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.GetPairsRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.GetPairsResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.GetPairsResponse>;
}
interface IXudService_IGetOrders extends grpc.MethodDefinition<xudrpc_pb.GetOrdersRequest, xudrpc_pb.GetOrdersResponse> {
    path: string; // "/xudrpc.Xud/GetOrders"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.GetOrdersRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.GetOrdersRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.GetOrdersResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.GetOrdersResponse>;
}
interface IXudService_IPlaceOrder extends grpc.MethodDefinition<xudrpc_pb.PlaceOrderRequest, xudrpc_pb.PlaceOrderResponse> {
    path: string; // "/xudrpc.Xud/PlaceOrder"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.PlaceOrderRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.PlaceOrderRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.PlaceOrderResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.PlaceOrderResponse>;
}
interface IXudService_IConnect extends grpc.MethodDefinition<xudrpc_pb.ConnectRequest, xudrpc_pb.ConnectResponse> {
    path: string; // "/xudrpc.Xud/Connect"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.ConnectRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ConnectRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ConnectResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ConnectResponse>;
}
interface IXudService_IExecuteSwap extends grpc.MethodDefinition<xudrpc_pb.ExecuteSwapRequest, xudrpc_pb.ExecuteSwapResponse> {
    path: string; // "/xudrpc.Xud/ExecuteSwap"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.ExecuteSwapRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ExecuteSwapRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ExecuteSwapResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ExecuteSwapResponse>;
}
interface IXudService_IShutdown extends grpc.MethodDefinition<xudrpc_pb.ShutdownRequest, xudrpc_pb.ShutdownResponse> {
    path: string; // "/xudrpc.Xud/Shutdown"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.ShutdownRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ShutdownRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ShutdownResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ShutdownResponse>;
}
interface IXudService_IStreamingExample extends grpc.MethodDefinition<xudrpc_pb.StreamingExampleRequest, xudrpc_pb.StreamingExampleResponse> {
    path: string; // "/xudrpc.Xud/StreamingExample"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<xudrpc_pb.StreamingExampleRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.StreamingExampleRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.StreamingExampleResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.StreamingExampleResponse>;
}
interface IXudService_ISubscribePeerOrders extends grpc.MethodDefinition<xudrpc_pb.SubscribePeerOrdersRequest, xudrpc_pb.SubscribePeerOrdersResponse> {
    path: string; // "/xudrpc.Xud/SubscribePeerOrders"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.SubscribePeerOrdersRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.SubscribePeerOrdersRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.SubscribePeerOrdersResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.SubscribePeerOrdersResponse>;
}
interface IXudService_ISubscribeSwaps extends grpc.MethodDefinition<xudrpc_pb.SubscribeSwapsRequest, xudrpc_pb.SubscribeSwapsResponse> {
    path: string; // "/xudrpc.Xud/SubscribeSwaps"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.SubscribeSwapsRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.SubscribeSwapsRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.SubscribeSwapsResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.SubscribeSwapsResponse>;
}

export const XudService: IXudService;

export interface IXudServer {
    getInfo: grpc.handleUnaryCall<xudrpc_pb.GetInfoRequest, xudrpc_pb.GetInfoResponse>;
    getPairs: grpc.handleUnaryCall<xudrpc_pb.GetPairsRequest, xudrpc_pb.GetPairsResponse>;
    getOrders: grpc.handleUnaryCall<xudrpc_pb.GetOrdersRequest, xudrpc_pb.GetOrdersResponse>;
    placeOrder: grpc.handleUnaryCall<xudrpc_pb.PlaceOrderRequest, xudrpc_pb.PlaceOrderResponse>;
    connect: grpc.handleUnaryCall<xudrpc_pb.ConnectRequest, xudrpc_pb.ConnectResponse>;
    executeSwap: grpc.handleUnaryCall<xudrpc_pb.ExecuteSwapRequest, xudrpc_pb.ExecuteSwapResponse>;
    shutdown: grpc.handleUnaryCall<xudrpc_pb.ShutdownRequest, xudrpc_pb.ShutdownResponse>;
    streamingExample: grpc.handleServerStreamingCall<xudrpc_pb.StreamingExampleRequest, xudrpc_pb.StreamingExampleResponse>;
    subscribePeerOrders: grpc.handleUnaryCall<xudrpc_pb.SubscribePeerOrdersRequest, xudrpc_pb.SubscribePeerOrdersResponse>;
    subscribeSwaps: grpc.handleUnaryCall<xudrpc_pb.SubscribeSwapsRequest, xudrpc_pb.SubscribeSwapsResponse>;
}

export interface IXudClient {
    getInfo(request: xudrpc_pb.GetInfoRequest, callback: (error: Error | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getPairs(request: xudrpc_pb.GetPairsRequest, callback: (error: Error | null, response: xudrpc_pb.GetPairsResponse) => void): grpc.ClientUnaryCall;
    getPairs(request: xudrpc_pb.GetPairsRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.GetPairsResponse) => void): grpc.ClientUnaryCall;
    getPairs(request: xudrpc_pb.GetPairsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.GetPairsResponse) => void): grpc.ClientUnaryCall;
    getOrders(request: xudrpc_pb.GetOrdersRequest, callback: (error: Error | null, response: xudrpc_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    getOrders(request: xudrpc_pb.GetOrdersRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    getOrders(request: xudrpc_pb.GetOrdersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    placeOrder(request: xudrpc_pb.PlaceOrderRequest, callback: (error: Error | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    placeOrder(request: xudrpc_pb.PlaceOrderRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    placeOrder(request: xudrpc_pb.PlaceOrderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    connect(request: xudrpc_pb.ConnectRequest, callback: (error: Error | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    executeSwap(request: xudrpc_pb.ExecuteSwapRequest, callback: (error: Error | null, response: xudrpc_pb.ExecuteSwapResponse) => void): grpc.ClientUnaryCall;
    executeSwap(request: xudrpc_pb.ExecuteSwapRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ExecuteSwapResponse) => void): grpc.ClientUnaryCall;
    executeSwap(request: xudrpc_pb.ExecuteSwapRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ExecuteSwapResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: xudrpc_pb.ShutdownRequest, callback: (error: Error | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    streamingExample(request: xudrpc_pb.StreamingExampleRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.StreamingExampleRequest>;
    streamingExample(request: xudrpc_pb.StreamingExampleRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.StreamingExampleRequest>;
    subscribePeerOrders(request: xudrpc_pb.SubscribePeerOrdersRequest, callback: (error: Error | null, response: xudrpc_pb.SubscribePeerOrdersResponse) => void): grpc.ClientUnaryCall;
    subscribePeerOrders(request: xudrpc_pb.SubscribePeerOrdersRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.SubscribePeerOrdersResponse) => void): grpc.ClientUnaryCall;
    subscribePeerOrders(request: xudrpc_pb.SubscribePeerOrdersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.SubscribePeerOrdersResponse) => void): grpc.ClientUnaryCall;
    subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, callback: (error: Error | null, response: xudrpc_pb.SubscribeSwapsResponse) => void): grpc.ClientUnaryCall;
    subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.SubscribeSwapsResponse) => void): grpc.ClientUnaryCall;
    subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.SubscribeSwapsResponse) => void): grpc.ClientUnaryCall;
}

export class XudClient extends grpc.Client implements IXudClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getInfo(request: xudrpc_pb.GetInfoRequest, callback: (error: Error | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getPairs(request: xudrpc_pb.GetPairsRequest, callback: (error: Error | null, response: xudrpc_pb.GetPairsResponse) => void): grpc.ClientUnaryCall;
    public getPairs(request: xudrpc_pb.GetPairsRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.GetPairsResponse) => void): grpc.ClientUnaryCall;
    public getPairs(request: xudrpc_pb.GetPairsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.GetPairsResponse) => void): grpc.ClientUnaryCall;
    public getOrders(request: xudrpc_pb.GetOrdersRequest, callback: (error: Error | null, response: xudrpc_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    public getOrders(request: xudrpc_pb.GetOrdersRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    public getOrders(request: xudrpc_pb.GetOrdersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    public placeOrder(request: xudrpc_pb.PlaceOrderRequest, callback: (error: Error | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    public placeOrder(request: xudrpc_pb.PlaceOrderRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    public placeOrder(request: xudrpc_pb.PlaceOrderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    public connect(request: xudrpc_pb.ConnectRequest, callback: (error: Error | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    public connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    public connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    public executeSwap(request: xudrpc_pb.ExecuteSwapRequest, callback: (error: Error | null, response: xudrpc_pb.ExecuteSwapResponse) => void): grpc.ClientUnaryCall;
    public executeSwap(request: xudrpc_pb.ExecuteSwapRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ExecuteSwapResponse) => void): grpc.ClientUnaryCall;
    public executeSwap(request: xudrpc_pb.ExecuteSwapRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ExecuteSwapResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: xudrpc_pb.ShutdownRequest, callback: (error: Error | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public streamingExample(request: xudrpc_pb.StreamingExampleRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.StreamingExampleRequest>;
    public streamingExample(request: xudrpc_pb.StreamingExampleRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.StreamingExampleRequest>;
    public subscribePeerOrders(request: xudrpc_pb.SubscribePeerOrdersRequest, callback: (error: Error | null, response: xudrpc_pb.SubscribePeerOrdersResponse) => void): grpc.ClientUnaryCall;
    public subscribePeerOrders(request: xudrpc_pb.SubscribePeerOrdersRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.SubscribePeerOrdersResponse) => void): grpc.ClientUnaryCall;
    public subscribePeerOrders(request: xudrpc_pb.SubscribePeerOrdersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.SubscribePeerOrdersResponse) => void): grpc.ClientUnaryCall;
    public subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, callback: (error: Error | null, response: xudrpc_pb.SubscribeSwapsResponse) => void): grpc.ClientUnaryCall;
    public subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.SubscribeSwapsResponse) => void): grpc.ClientUnaryCall;
    public subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.SubscribeSwapsResponse) => void): grpc.ClientUnaryCall;
}
