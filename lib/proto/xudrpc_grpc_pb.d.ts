// package: xudrpc
// file: xudrpc.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as xudrpc_pb from "./xudrpc_pb";
import * as annotations_pb from "./annotations_pb";

interface IXudService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    addCurrency: IXudService_IAddCurrency;
    addPair: IXudService_IAddPair;
    cancelOrder: IXudService_ICancelOrder;
    channelBalance: IXudService_IChannelBalance;
    connect: IXudService_IConnect;
    disconnect: IXudService_IDisconnect;
    getInfo: IXudService_IGetInfo;
    getOrders: IXudService_IGetOrders;
    listCurrencies: IXudService_IListCurrencies;
    listPairs: IXudService_IListPairs;
    listPeers: IXudService_IListPeers;
    placeOrder: IXudService_IPlaceOrder;
    removeCurrency: IXudService_IRemoveCurrency;
    removePair: IXudService_IRemovePair;
    shutdown: IXudService_IShutdown;
    subscribeAddedOrders: IXudService_ISubscribeAddedOrders;
    subscribeRemovedOrders: IXudService_ISubscribeRemovedOrders;
    subscribeSwaps: IXudService_ISubscribeSwaps;
}

interface IXudService_IAddCurrency extends grpc.MethodDefinition<xudrpc_pb.AddCurrencyRequest, xudrpc_pb.AddCurrencyResponse> {
    path: string; // "/xudrpc.Xud/AddCurrency"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.AddCurrencyRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.AddCurrencyRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.AddCurrencyResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.AddCurrencyResponse>;
}
interface IXudService_IAddPair extends grpc.MethodDefinition<xudrpc_pb.AddPairRequest, xudrpc_pb.AddPairResponse> {
    path: string; // "/xudrpc.Xud/AddPair"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.AddPairRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.AddPairRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.AddPairResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.AddPairResponse>;
}
interface IXudService_ICancelOrder extends grpc.MethodDefinition<xudrpc_pb.CancelOrderRequest, xudrpc_pb.CancelOrderResponse> {
    path: string; // "/xudrpc.Xud/CancelOrder"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.CancelOrderRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.CancelOrderRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.CancelOrderResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.CancelOrderResponse>;
}
interface IXudService_IChannelBalance extends grpc.MethodDefinition<xudrpc_pb.ChannelBalanceRequest, xudrpc_pb.ChannelBalanceResponse> {
    path: string; // "/xudrpc.Xud/ChannelBalance"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.ChannelBalanceRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ChannelBalanceRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ChannelBalanceResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ChannelBalanceResponse>;
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
interface IXudService_IDisconnect extends grpc.MethodDefinition<xudrpc_pb.DisconnectRequest, xudrpc_pb.DisconnectResponse> {
    path: string; // "/xudrpc.Xud/Disconnect"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.DisconnectRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.DisconnectRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.DisconnectResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.DisconnectResponse>;
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
interface IXudService_IGetOrders extends grpc.MethodDefinition<xudrpc_pb.GetOrdersRequest, xudrpc_pb.GetOrdersResponse> {
    path: string; // "/xudrpc.Xud/GetOrders"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.GetOrdersRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.GetOrdersRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.GetOrdersResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.GetOrdersResponse>;
}
interface IXudService_IListCurrencies extends grpc.MethodDefinition<xudrpc_pb.ListCurrenciesRequest, xudrpc_pb.ListCurrenciesResponse> {
    path: string; // "/xudrpc.Xud/ListCurrencies"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.ListCurrenciesRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ListCurrenciesRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ListCurrenciesResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ListCurrenciesResponse>;
}
interface IXudService_IListPairs extends grpc.MethodDefinition<xudrpc_pb.ListPairsRequest, xudrpc_pb.ListPairsResponse> {
    path: string; // "/xudrpc.Xud/ListPairs"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.ListPairsRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ListPairsRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ListPairsResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ListPairsResponse>;
}
interface IXudService_IListPeers extends grpc.MethodDefinition<xudrpc_pb.ListPeersRequest, xudrpc_pb.ListPeersResponse> {
    path: string; // "/xudrpc.Xud/ListPeers"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.ListPeersRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ListPeersRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ListPeersResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ListPeersResponse>;
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
interface IXudService_IRemoveCurrency extends grpc.MethodDefinition<xudrpc_pb.RemoveCurrencyRequest, xudrpc_pb.RemoveCurrencyResponse> {
    path: string; // "/xudrpc.Xud/RemoveCurrency"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.RemoveCurrencyRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.RemoveCurrencyRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.RemoveCurrencyResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.RemoveCurrencyResponse>;
}
interface IXudService_IRemovePair extends grpc.MethodDefinition<xudrpc_pb.RemovePairRequest, xudrpc_pb.RemovePairResponse> {
    path: string; // "/xudrpc.Xud/RemovePair"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.RemovePairRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.RemovePairRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.RemovePairResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.RemovePairResponse>;
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
interface IXudService_ISubscribeAddedOrders extends grpc.MethodDefinition<xudrpc_pb.SubscribeAddedOrdersRequest, xudrpc_pb.Order> {
    path: string; // "/xudrpc.Xud/SubscribeAddedOrders"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<xudrpc_pb.SubscribeAddedOrdersRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.SubscribeAddedOrdersRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.Order>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.Order>;
}
interface IXudService_ISubscribeRemovedOrders extends grpc.MethodDefinition<xudrpc_pb.SubscribeRemovedOrdersRequest, xudrpc_pb.OrderRemoval> {
    path: string; // "/xudrpc.Xud/SubscribeRemovedOrders"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<xudrpc_pb.SubscribeRemovedOrdersRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.SubscribeRemovedOrdersRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.OrderRemoval>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.OrderRemoval>;
}
interface IXudService_ISubscribeSwaps extends grpc.MethodDefinition<xudrpc_pb.SubscribeSwapsRequest, xudrpc_pb.SwapResult> {
    path: string; // "/xudrpc.Xud/SubscribeSwaps"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<xudrpc_pb.SubscribeSwapsRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.SubscribeSwapsRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.SwapResult>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.SwapResult>;
}

export const XudService: IXudService;

export interface IXudServer {
    addCurrency: grpc.handleUnaryCall<xudrpc_pb.AddCurrencyRequest, xudrpc_pb.AddCurrencyResponse>;
    addPair: grpc.handleUnaryCall<xudrpc_pb.AddPairRequest, xudrpc_pb.AddPairResponse>;
    cancelOrder: grpc.handleUnaryCall<xudrpc_pb.CancelOrderRequest, xudrpc_pb.CancelOrderResponse>;
    channelBalance: grpc.handleUnaryCall<xudrpc_pb.ChannelBalanceRequest, xudrpc_pb.ChannelBalanceResponse>;
    connect: grpc.handleUnaryCall<xudrpc_pb.ConnectRequest, xudrpc_pb.ConnectResponse>;
    disconnect: grpc.handleUnaryCall<xudrpc_pb.DisconnectRequest, xudrpc_pb.DisconnectResponse>;
    getInfo: grpc.handleUnaryCall<xudrpc_pb.GetInfoRequest, xudrpc_pb.GetInfoResponse>;
    getOrders: grpc.handleUnaryCall<xudrpc_pb.GetOrdersRequest, xudrpc_pb.GetOrdersResponse>;
    listCurrencies: grpc.handleUnaryCall<xudrpc_pb.ListCurrenciesRequest, xudrpc_pb.ListCurrenciesResponse>;
    listPairs: grpc.handleUnaryCall<xudrpc_pb.ListPairsRequest, xudrpc_pb.ListPairsResponse>;
    listPeers: grpc.handleUnaryCall<xudrpc_pb.ListPeersRequest, xudrpc_pb.ListPeersResponse>;
    placeOrder: grpc.handleUnaryCall<xudrpc_pb.PlaceOrderRequest, xudrpc_pb.PlaceOrderResponse>;
    removeCurrency: grpc.handleUnaryCall<xudrpc_pb.RemoveCurrencyRequest, xudrpc_pb.RemoveCurrencyResponse>;
    removePair: grpc.handleUnaryCall<xudrpc_pb.RemovePairRequest, xudrpc_pb.RemovePairResponse>;
    shutdown: grpc.handleUnaryCall<xudrpc_pb.ShutdownRequest, xudrpc_pb.ShutdownResponse>;
    subscribeAddedOrders: grpc.handleServerStreamingCall<xudrpc_pb.SubscribeAddedOrdersRequest, xudrpc_pb.Order>;
    subscribeRemovedOrders: grpc.handleServerStreamingCall<xudrpc_pb.SubscribeRemovedOrdersRequest, xudrpc_pb.OrderRemoval>;
    subscribeSwaps: grpc.handleServerStreamingCall<xudrpc_pb.SubscribeSwapsRequest, xudrpc_pb.SwapResult>;
}

export interface IXudClient {
    addCurrency(request: xudrpc_pb.AddCurrencyRequest, callback: (error: Error | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    addCurrency(request: xudrpc_pb.AddCurrencyRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    addCurrency(request: xudrpc_pb.AddCurrencyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    addPair(request: xudrpc_pb.AddPairRequest, callback: (error: Error | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    addPair(request: xudrpc_pb.AddPairRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    addPair(request: xudrpc_pb.AddPairRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    cancelOrder(request: xudrpc_pb.CancelOrderRequest, callback: (error: Error | null, response: xudrpc_pb.CancelOrderResponse) => void): grpc.ClientUnaryCall;
    cancelOrder(request: xudrpc_pb.CancelOrderRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.CancelOrderResponse) => void): grpc.ClientUnaryCall;
    cancelOrder(request: xudrpc_pb.CancelOrderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.CancelOrderResponse) => void): grpc.ClientUnaryCall;
    channelBalance(request: xudrpc_pb.ChannelBalanceRequest, callback: (error: Error | null, response: xudrpc_pb.ChannelBalanceResponse) => void): grpc.ClientUnaryCall;
    channelBalance(request: xudrpc_pb.ChannelBalanceRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ChannelBalanceResponse) => void): grpc.ClientUnaryCall;
    channelBalance(request: xudrpc_pb.ChannelBalanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ChannelBalanceResponse) => void): grpc.ClientUnaryCall;
    connect(request: xudrpc_pb.ConnectRequest, callback: (error: Error | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    disconnect(request: xudrpc_pb.DisconnectRequest, callback: (error: Error | null, response: xudrpc_pb.DisconnectResponse) => void): grpc.ClientUnaryCall;
    disconnect(request: xudrpc_pb.DisconnectRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.DisconnectResponse) => void): grpc.ClientUnaryCall;
    disconnect(request: xudrpc_pb.DisconnectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.DisconnectResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xudrpc_pb.GetInfoRequest, callback: (error: Error | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getOrders(request: xudrpc_pb.GetOrdersRequest, callback: (error: Error | null, response: xudrpc_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    getOrders(request: xudrpc_pb.GetOrdersRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    getOrders(request: xudrpc_pb.GetOrdersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    listCurrencies(request: xudrpc_pb.ListCurrenciesRequest, callback: (error: Error | null, response: xudrpc_pb.ListCurrenciesResponse) => void): grpc.ClientUnaryCall;
    listCurrencies(request: xudrpc_pb.ListCurrenciesRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ListCurrenciesResponse) => void): grpc.ClientUnaryCall;
    listCurrencies(request: xudrpc_pb.ListCurrenciesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ListCurrenciesResponse) => void): grpc.ClientUnaryCall;
    listPairs(request: xudrpc_pb.ListPairsRequest, callback: (error: Error | null, response: xudrpc_pb.ListPairsResponse) => void): grpc.ClientUnaryCall;
    listPairs(request: xudrpc_pb.ListPairsRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ListPairsResponse) => void): grpc.ClientUnaryCall;
    listPairs(request: xudrpc_pb.ListPairsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ListPairsResponse) => void): grpc.ClientUnaryCall;
    listPeers(request: xudrpc_pb.ListPeersRequest, callback: (error: Error | null, response: xudrpc_pb.ListPeersResponse) => void): grpc.ClientUnaryCall;
    listPeers(request: xudrpc_pb.ListPeersRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ListPeersResponse) => void): grpc.ClientUnaryCall;
    listPeers(request: xudrpc_pb.ListPeersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ListPeersResponse) => void): grpc.ClientUnaryCall;
    placeOrder(request: xudrpc_pb.PlaceOrderRequest, callback: (error: Error | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    placeOrder(request: xudrpc_pb.PlaceOrderRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    placeOrder(request: xudrpc_pb.PlaceOrderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    removeCurrency(request: xudrpc_pb.RemoveCurrencyRequest, callback: (error: Error | null, response: xudrpc_pb.RemoveCurrencyResponse) => void): grpc.ClientUnaryCall;
    removeCurrency(request: xudrpc_pb.RemoveCurrencyRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.RemoveCurrencyResponse) => void): grpc.ClientUnaryCall;
    removeCurrency(request: xudrpc_pb.RemoveCurrencyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.RemoveCurrencyResponse) => void): grpc.ClientUnaryCall;
    removePair(request: xudrpc_pb.RemovePairRequest, callback: (error: Error | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    removePair(request: xudrpc_pb.RemovePairRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    removePair(request: xudrpc_pb.RemovePairRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: xudrpc_pb.ShutdownRequest, callback: (error: Error | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    subscribeAddedOrders(request: xudrpc_pb.SubscribeAddedOrdersRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SubscribeAddedOrdersRequest>;
    subscribeAddedOrders(request: xudrpc_pb.SubscribeAddedOrdersRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SubscribeAddedOrdersRequest>;
    subscribeRemovedOrders(request: xudrpc_pb.SubscribeRemovedOrdersRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SubscribeRemovedOrdersRequest>;
    subscribeRemovedOrders(request: xudrpc_pb.SubscribeRemovedOrdersRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SubscribeRemovedOrdersRequest>;
    subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SubscribeSwapsRequest>;
    subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SubscribeSwapsRequest>;
}

export class XudClient extends grpc.Client implements IXudClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public addCurrency(request: xudrpc_pb.AddCurrencyRequest, callback: (error: Error | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    public addCurrency(request: xudrpc_pb.AddCurrencyRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    public addCurrency(request: xudrpc_pb.AddCurrencyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    public addPair(request: xudrpc_pb.AddPairRequest, callback: (error: Error | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    public addPair(request: xudrpc_pb.AddPairRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    public addPair(request: xudrpc_pb.AddPairRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    public cancelOrder(request: xudrpc_pb.CancelOrderRequest, callback: (error: Error | null, response: xudrpc_pb.CancelOrderResponse) => void): grpc.ClientUnaryCall;
    public cancelOrder(request: xudrpc_pb.CancelOrderRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.CancelOrderResponse) => void): grpc.ClientUnaryCall;
    public cancelOrder(request: xudrpc_pb.CancelOrderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.CancelOrderResponse) => void): grpc.ClientUnaryCall;
    public channelBalance(request: xudrpc_pb.ChannelBalanceRequest, callback: (error: Error | null, response: xudrpc_pb.ChannelBalanceResponse) => void): grpc.ClientUnaryCall;
    public channelBalance(request: xudrpc_pb.ChannelBalanceRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ChannelBalanceResponse) => void): grpc.ClientUnaryCall;
    public channelBalance(request: xudrpc_pb.ChannelBalanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ChannelBalanceResponse) => void): grpc.ClientUnaryCall;
    public connect(request: xudrpc_pb.ConnectRequest, callback: (error: Error | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    public connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    public connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    public disconnect(request: xudrpc_pb.DisconnectRequest, callback: (error: Error | null, response: xudrpc_pb.DisconnectResponse) => void): grpc.ClientUnaryCall;
    public disconnect(request: xudrpc_pb.DisconnectRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.DisconnectResponse) => void): grpc.ClientUnaryCall;
    public disconnect(request: xudrpc_pb.DisconnectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.DisconnectResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xudrpc_pb.GetInfoRequest, callback: (error: Error | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getOrders(request: xudrpc_pb.GetOrdersRequest, callback: (error: Error | null, response: xudrpc_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    public getOrders(request: xudrpc_pb.GetOrdersRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    public getOrders(request: xudrpc_pb.GetOrdersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    public listCurrencies(request: xudrpc_pb.ListCurrenciesRequest, callback: (error: Error | null, response: xudrpc_pb.ListCurrenciesResponse) => void): grpc.ClientUnaryCall;
    public listCurrencies(request: xudrpc_pb.ListCurrenciesRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ListCurrenciesResponse) => void): grpc.ClientUnaryCall;
    public listCurrencies(request: xudrpc_pb.ListCurrenciesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ListCurrenciesResponse) => void): grpc.ClientUnaryCall;
    public listPairs(request: xudrpc_pb.ListPairsRequest, callback: (error: Error | null, response: xudrpc_pb.ListPairsResponse) => void): grpc.ClientUnaryCall;
    public listPairs(request: xudrpc_pb.ListPairsRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ListPairsResponse) => void): grpc.ClientUnaryCall;
    public listPairs(request: xudrpc_pb.ListPairsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ListPairsResponse) => void): grpc.ClientUnaryCall;
    public listPeers(request: xudrpc_pb.ListPeersRequest, callback: (error: Error | null, response: xudrpc_pb.ListPeersResponse) => void): grpc.ClientUnaryCall;
    public listPeers(request: xudrpc_pb.ListPeersRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ListPeersResponse) => void): grpc.ClientUnaryCall;
    public listPeers(request: xudrpc_pb.ListPeersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ListPeersResponse) => void): grpc.ClientUnaryCall;
    public placeOrder(request: xudrpc_pb.PlaceOrderRequest, callback: (error: Error | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    public placeOrder(request: xudrpc_pb.PlaceOrderRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    public placeOrder(request: xudrpc_pb.PlaceOrderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    public removeCurrency(request: xudrpc_pb.RemoveCurrencyRequest, callback: (error: Error | null, response: xudrpc_pb.RemoveCurrencyResponse) => void): grpc.ClientUnaryCall;
    public removeCurrency(request: xudrpc_pb.RemoveCurrencyRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.RemoveCurrencyResponse) => void): grpc.ClientUnaryCall;
    public removeCurrency(request: xudrpc_pb.RemoveCurrencyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.RemoveCurrencyResponse) => void): grpc.ClientUnaryCall;
    public removePair(request: xudrpc_pb.RemovePairRequest, callback: (error: Error | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    public removePair(request: xudrpc_pb.RemovePairRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    public removePair(request: xudrpc_pb.RemovePairRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: xudrpc_pb.ShutdownRequest, callback: (error: Error | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public subscribeAddedOrders(request: xudrpc_pb.SubscribeAddedOrdersRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SubscribeAddedOrdersRequest>;
    public subscribeAddedOrders(request: xudrpc_pb.SubscribeAddedOrdersRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SubscribeAddedOrdersRequest>;
    public subscribeRemovedOrders(request: xudrpc_pb.SubscribeRemovedOrdersRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SubscribeRemovedOrdersRequest>;
    public subscribeRemovedOrders(request: xudrpc_pb.SubscribeRemovedOrdersRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SubscribeRemovedOrdersRequest>;
    public subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SubscribeSwapsRequest>;
    public subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SubscribeSwapsRequest>;
}
