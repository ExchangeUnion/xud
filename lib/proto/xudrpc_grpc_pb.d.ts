// package: xudrpc
// file: xudrpc.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as xudrpc_pb from "./xudrpc_pb";
import * as annotations_pb from "./annotations_pb";

interface IXudInitService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    createNode: IXudInitService_ICreateNode;
    unlockNode: IXudInitService_IUnlockNode;
}

interface IXudInitService_ICreateNode extends grpc.MethodDefinition<xudrpc_pb.CreateNodeRequest, xudrpc_pb.CreateNodeResponse> {
    path: string; // "/xudrpc.XudInit/CreateNode"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.CreateNodeRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.CreateNodeRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.CreateNodeResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.CreateNodeResponse>;
}
interface IXudInitService_IUnlockNode extends grpc.MethodDefinition<xudrpc_pb.UnlockNodeRequest, xudrpc_pb.UnlockNodeResponse> {
    path: string; // "/xudrpc.XudInit/UnlockNode"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.UnlockNodeRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.UnlockNodeRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.UnlockNodeResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.UnlockNodeResponse>;
}

export const XudInitService: IXudInitService;

export interface IXudInitServer {
    createNode: grpc.handleUnaryCall<xudrpc_pb.CreateNodeRequest, xudrpc_pb.CreateNodeResponse>;
    unlockNode: grpc.handleUnaryCall<xudrpc_pb.UnlockNodeRequest, xudrpc_pb.UnlockNodeResponse>;
}

export interface IXudInitClient {
    createNode(request: xudrpc_pb.CreateNodeRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CreateNodeResponse) => void): grpc.ClientUnaryCall;
    createNode(request: xudrpc_pb.CreateNodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CreateNodeResponse) => void): grpc.ClientUnaryCall;
    createNode(request: xudrpc_pb.CreateNodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CreateNodeResponse) => void): grpc.ClientUnaryCall;
    unlockNode(request: xudrpc_pb.UnlockNodeRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnlockNodeResponse) => void): grpc.ClientUnaryCall;
    unlockNode(request: xudrpc_pb.UnlockNodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnlockNodeResponse) => void): grpc.ClientUnaryCall;
    unlockNode(request: xudrpc_pb.UnlockNodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnlockNodeResponse) => void): grpc.ClientUnaryCall;
}

export class XudInitClient extends grpc.Client implements IXudInitClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public createNode(request: xudrpc_pb.CreateNodeRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CreateNodeResponse) => void): grpc.ClientUnaryCall;
    public createNode(request: xudrpc_pb.CreateNodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CreateNodeResponse) => void): grpc.ClientUnaryCall;
    public createNode(request: xudrpc_pb.CreateNodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CreateNodeResponse) => void): grpc.ClientUnaryCall;
    public unlockNode(request: xudrpc_pb.UnlockNodeRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnlockNodeResponse) => void): grpc.ClientUnaryCall;
    public unlockNode(request: xudrpc_pb.UnlockNodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnlockNodeResponse) => void): grpc.ClientUnaryCall;
    public unlockNode(request: xudrpc_pb.UnlockNodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnlockNodeResponse) => void): grpc.ClientUnaryCall;
}

interface IXudService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    addCurrency: IXudService_IAddCurrency;
    addPair: IXudService_IAddPair;
    removeOrder: IXudService_IRemoveOrder;
    channelBalance: IXudService_IChannelBalance;
    openChannel: IXudService_IOpenChannel;
    connect: IXudService_IConnect;
    ban: IXudService_IBan;
    unban: IXudService_IUnban;
    getInfo: IXudService_IGetInfo;
    getNodeInfo: IXudService_IGetNodeInfo;
    listOrders: IXudService_IListOrders;
    listCurrencies: IXudService_IListCurrencies;
    listPairs: IXudService_IListPairs;
    listPeers: IXudService_IListPeers;
    placeOrder: IXudService_IPlaceOrder;
    placeOrderSync: IXudService_IPlaceOrderSync;
    executeSwap: IXudService_IExecuteSwap;
    removeCurrency: IXudService_IRemoveCurrency;
    removePair: IXudService_IRemovePair;
    discoverNodes: IXudService_IDiscoverNodes;
    shutdown: IXudService_IShutdown;
    subscribeOrders: IXudService_ISubscribeOrders;
    subscribeSwaps: IXudService_ISubscribeSwaps;
    subscribeSwapFailures: IXudService_ISubscribeSwapFailures;
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
interface IXudService_IRemoveOrder extends grpc.MethodDefinition<xudrpc_pb.RemoveOrderRequest, xudrpc_pb.RemoveOrderResponse> {
    path: string; // "/xudrpc.Xud/RemoveOrder"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.RemoveOrderRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.RemoveOrderRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.RemoveOrderResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.RemoveOrderResponse>;
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
interface IXudService_IOpenChannel extends grpc.MethodDefinition<xudrpc_pb.OpenChannelRequest, xudrpc_pb.OpenChannelResponse> {
    path: string; // "/xudrpc.Xud/OpenChannel"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.OpenChannelRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.OpenChannelRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.OpenChannelResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.OpenChannelResponse>;
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
interface IXudService_IBan extends grpc.MethodDefinition<xudrpc_pb.BanRequest, xudrpc_pb.BanResponse> {
    path: string; // "/xudrpc.Xud/Ban"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.BanRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.BanRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.BanResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.BanResponse>;
}
interface IXudService_IUnban extends grpc.MethodDefinition<xudrpc_pb.UnbanRequest, xudrpc_pb.UnbanResponse> {
    path: string; // "/xudrpc.Xud/Unban"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.UnbanRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.UnbanRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.UnbanResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.UnbanResponse>;
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
interface IXudService_IGetNodeInfo extends grpc.MethodDefinition<xudrpc_pb.GetNodeInfoRequest, xudrpc_pb.GetNodeInfoResponse> {
    path: string; // "/xudrpc.Xud/GetNodeInfo"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.GetNodeInfoRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.GetNodeInfoRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.GetNodeInfoResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.GetNodeInfoResponse>;
}
interface IXudService_IListOrders extends grpc.MethodDefinition<xudrpc_pb.ListOrdersRequest, xudrpc_pb.ListOrdersResponse> {
    path: string; // "/xudrpc.Xud/ListOrders"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.ListOrdersRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ListOrdersRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ListOrdersResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ListOrdersResponse>;
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
interface IXudService_IPlaceOrder extends grpc.MethodDefinition<xudrpc_pb.PlaceOrderRequest, xudrpc_pb.PlaceOrderEvent> {
    path: string; // "/xudrpc.Xud/PlaceOrder"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<xudrpc_pb.PlaceOrderRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.PlaceOrderRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.PlaceOrderEvent>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.PlaceOrderEvent>;
}
interface IXudService_IPlaceOrderSync extends grpc.MethodDefinition<xudrpc_pb.PlaceOrderRequest, xudrpc_pb.PlaceOrderResponse> {
    path: string; // "/xudrpc.Xud/PlaceOrderSync"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.PlaceOrderRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.PlaceOrderRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.PlaceOrderResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.PlaceOrderResponse>;
}
interface IXudService_IExecuteSwap extends grpc.MethodDefinition<xudrpc_pb.ExecuteSwapRequest, xudrpc_pb.SwapSuccess> {
    path: string; // "/xudrpc.Xud/ExecuteSwap"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.ExecuteSwapRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ExecuteSwapRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.SwapSuccess>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.SwapSuccess>;
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
interface IXudService_IDiscoverNodes extends grpc.MethodDefinition<xudrpc_pb.DiscoverNodesRequest, xudrpc_pb.DiscoverNodesResponse> {
    path: string; // "/xudrpc.Xud/DiscoverNodes"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.DiscoverNodesRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.DiscoverNodesRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.DiscoverNodesResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.DiscoverNodesResponse>;
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
interface IXudService_ISubscribeOrders extends grpc.MethodDefinition<xudrpc_pb.SubscribeOrdersRequest, xudrpc_pb.OrderUpdate> {
    path: string; // "/xudrpc.Xud/SubscribeOrders"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<xudrpc_pb.SubscribeOrdersRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.SubscribeOrdersRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.OrderUpdate>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.OrderUpdate>;
}
interface IXudService_ISubscribeSwaps extends grpc.MethodDefinition<xudrpc_pb.SubscribeSwapsRequest, xudrpc_pb.SwapSuccess> {
    path: string; // "/xudrpc.Xud/SubscribeSwaps"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<xudrpc_pb.SubscribeSwapsRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.SubscribeSwapsRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.SwapSuccess>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.SwapSuccess>;
}
interface IXudService_ISubscribeSwapFailures extends grpc.MethodDefinition<xudrpc_pb.SubscribeSwapsRequest, xudrpc_pb.SwapFailure> {
    path: string; // "/xudrpc.Xud/SubscribeSwapFailures"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<xudrpc_pb.SubscribeSwapsRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.SubscribeSwapsRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.SwapFailure>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.SwapFailure>;
}

export const XudService: IXudService;

export interface IXudServer {
    addCurrency: grpc.handleUnaryCall<xudrpc_pb.AddCurrencyRequest, xudrpc_pb.AddCurrencyResponse>;
    addPair: grpc.handleUnaryCall<xudrpc_pb.AddPairRequest, xudrpc_pb.AddPairResponse>;
    removeOrder: grpc.handleUnaryCall<xudrpc_pb.RemoveOrderRequest, xudrpc_pb.RemoveOrderResponse>;
    channelBalance: grpc.handleUnaryCall<xudrpc_pb.ChannelBalanceRequest, xudrpc_pb.ChannelBalanceResponse>;
    openChannel: grpc.handleUnaryCall<xudrpc_pb.OpenChannelRequest, xudrpc_pb.OpenChannelResponse>;
    connect: grpc.handleUnaryCall<xudrpc_pb.ConnectRequest, xudrpc_pb.ConnectResponse>;
    ban: grpc.handleUnaryCall<xudrpc_pb.BanRequest, xudrpc_pb.BanResponse>;
    unban: grpc.handleUnaryCall<xudrpc_pb.UnbanRequest, xudrpc_pb.UnbanResponse>;
    getInfo: grpc.handleUnaryCall<xudrpc_pb.GetInfoRequest, xudrpc_pb.GetInfoResponse>;
    getNodeInfo: grpc.handleUnaryCall<xudrpc_pb.GetNodeInfoRequest, xudrpc_pb.GetNodeInfoResponse>;
    listOrders: grpc.handleUnaryCall<xudrpc_pb.ListOrdersRequest, xudrpc_pb.ListOrdersResponse>;
    listCurrencies: grpc.handleUnaryCall<xudrpc_pb.ListCurrenciesRequest, xudrpc_pb.ListCurrenciesResponse>;
    listPairs: grpc.handleUnaryCall<xudrpc_pb.ListPairsRequest, xudrpc_pb.ListPairsResponse>;
    listPeers: grpc.handleUnaryCall<xudrpc_pb.ListPeersRequest, xudrpc_pb.ListPeersResponse>;
    placeOrder: grpc.handleServerStreamingCall<xudrpc_pb.PlaceOrderRequest, xudrpc_pb.PlaceOrderEvent>;
    placeOrderSync: grpc.handleUnaryCall<xudrpc_pb.PlaceOrderRequest, xudrpc_pb.PlaceOrderResponse>;
    executeSwap: grpc.handleUnaryCall<xudrpc_pb.ExecuteSwapRequest, xudrpc_pb.SwapSuccess>;
    removeCurrency: grpc.handleUnaryCall<xudrpc_pb.RemoveCurrencyRequest, xudrpc_pb.RemoveCurrencyResponse>;
    removePair: grpc.handleUnaryCall<xudrpc_pb.RemovePairRequest, xudrpc_pb.RemovePairResponse>;
    discoverNodes: grpc.handleUnaryCall<xudrpc_pb.DiscoverNodesRequest, xudrpc_pb.DiscoverNodesResponse>;
    shutdown: grpc.handleUnaryCall<xudrpc_pb.ShutdownRequest, xudrpc_pb.ShutdownResponse>;
    subscribeOrders: grpc.handleServerStreamingCall<xudrpc_pb.SubscribeOrdersRequest, xudrpc_pb.OrderUpdate>;
    subscribeSwaps: grpc.handleServerStreamingCall<xudrpc_pb.SubscribeSwapsRequest, xudrpc_pb.SwapSuccess>;
    subscribeSwapFailures: grpc.handleServerStreamingCall<xudrpc_pb.SubscribeSwapsRequest, xudrpc_pb.SwapFailure>;
}

export interface IXudClient {
    addCurrency(request: xudrpc_pb.AddCurrencyRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    addCurrency(request: xudrpc_pb.AddCurrencyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    addCurrency(request: xudrpc_pb.AddCurrencyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    addPair(request: xudrpc_pb.AddPairRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    addPair(request: xudrpc_pb.AddPairRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    addPair(request: xudrpc_pb.AddPairRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    removeOrder(request: xudrpc_pb.RemoveOrderRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveOrderResponse) => void): grpc.ClientUnaryCall;
    removeOrder(request: xudrpc_pb.RemoveOrderRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveOrderResponse) => void): grpc.ClientUnaryCall;
    removeOrder(request: xudrpc_pb.RemoveOrderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveOrderResponse) => void): grpc.ClientUnaryCall;
    channelBalance(request: xudrpc_pb.ChannelBalanceRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ChannelBalanceResponse) => void): grpc.ClientUnaryCall;
    channelBalance(request: xudrpc_pb.ChannelBalanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ChannelBalanceResponse) => void): grpc.ClientUnaryCall;
    channelBalance(request: xudrpc_pb.ChannelBalanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ChannelBalanceResponse) => void): grpc.ClientUnaryCall;
    openChannel(request: xudrpc_pb.OpenChannelRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OpenChannelResponse) => void): grpc.ClientUnaryCall;
    openChannel(request: xudrpc_pb.OpenChannelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OpenChannelResponse) => void): grpc.ClientUnaryCall;
    openChannel(request: xudrpc_pb.OpenChannelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OpenChannelResponse) => void): grpc.ClientUnaryCall;
    connect(request: xudrpc_pb.ConnectRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    ban(request: xudrpc_pb.BanRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.BanResponse) => void): grpc.ClientUnaryCall;
    ban(request: xudrpc_pb.BanRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.BanResponse) => void): grpc.ClientUnaryCall;
    ban(request: xudrpc_pb.BanRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.BanResponse) => void): grpc.ClientUnaryCall;
    unban(request: xudrpc_pb.UnbanRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnbanResponse) => void): grpc.ClientUnaryCall;
    unban(request: xudrpc_pb.UnbanRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnbanResponse) => void): grpc.ClientUnaryCall;
    unban(request: xudrpc_pb.UnbanRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnbanResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xudrpc_pb.GetInfoRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getNodeInfo(request: xudrpc_pb.GetNodeInfoRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetNodeInfoResponse) => void): grpc.ClientUnaryCall;
    getNodeInfo(request: xudrpc_pb.GetNodeInfoRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetNodeInfoResponse) => void): grpc.ClientUnaryCall;
    getNodeInfo(request: xudrpc_pb.GetNodeInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetNodeInfoResponse) => void): grpc.ClientUnaryCall;
    listOrders(request: xudrpc_pb.ListOrdersRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListOrdersResponse) => void): grpc.ClientUnaryCall;
    listOrders(request: xudrpc_pb.ListOrdersRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListOrdersResponse) => void): grpc.ClientUnaryCall;
    listOrders(request: xudrpc_pb.ListOrdersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListOrdersResponse) => void): grpc.ClientUnaryCall;
    listCurrencies(request: xudrpc_pb.ListCurrenciesRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListCurrenciesResponse) => void): grpc.ClientUnaryCall;
    listCurrencies(request: xudrpc_pb.ListCurrenciesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListCurrenciesResponse) => void): grpc.ClientUnaryCall;
    listCurrencies(request: xudrpc_pb.ListCurrenciesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListCurrenciesResponse) => void): grpc.ClientUnaryCall;
    listPairs(request: xudrpc_pb.ListPairsRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListPairsResponse) => void): grpc.ClientUnaryCall;
    listPairs(request: xudrpc_pb.ListPairsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListPairsResponse) => void): grpc.ClientUnaryCall;
    listPairs(request: xudrpc_pb.ListPairsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListPairsResponse) => void): grpc.ClientUnaryCall;
    listPeers(request: xudrpc_pb.ListPeersRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListPeersResponse) => void): grpc.ClientUnaryCall;
    listPeers(request: xudrpc_pb.ListPeersRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListPeersResponse) => void): grpc.ClientUnaryCall;
    listPeers(request: xudrpc_pb.ListPeersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListPeersResponse) => void): grpc.ClientUnaryCall;
    placeOrder(request: xudrpc_pb.PlaceOrderRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.PlaceOrderEvent>;
    placeOrder(request: xudrpc_pb.PlaceOrderRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.PlaceOrderEvent>;
    placeOrderSync(request: xudrpc_pb.PlaceOrderRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    placeOrderSync(request: xudrpc_pb.PlaceOrderRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    placeOrderSync(request: xudrpc_pb.PlaceOrderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    executeSwap(request: xudrpc_pb.ExecuteSwapRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.SwapSuccess) => void): grpc.ClientUnaryCall;
    executeSwap(request: xudrpc_pb.ExecuteSwapRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.SwapSuccess) => void): grpc.ClientUnaryCall;
    executeSwap(request: xudrpc_pb.ExecuteSwapRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.SwapSuccess) => void): grpc.ClientUnaryCall;
    removeCurrency(request: xudrpc_pb.RemoveCurrencyRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveCurrencyResponse) => void): grpc.ClientUnaryCall;
    removeCurrency(request: xudrpc_pb.RemoveCurrencyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveCurrencyResponse) => void): grpc.ClientUnaryCall;
    removeCurrency(request: xudrpc_pb.RemoveCurrencyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveCurrencyResponse) => void): grpc.ClientUnaryCall;
    removePair(request: xudrpc_pb.RemovePairRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    removePair(request: xudrpc_pb.RemovePairRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    removePair(request: xudrpc_pb.RemovePairRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    discoverNodes(request: xudrpc_pb.DiscoverNodesRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DiscoverNodesResponse) => void): grpc.ClientUnaryCall;
    discoverNodes(request: xudrpc_pb.DiscoverNodesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DiscoverNodesResponse) => void): grpc.ClientUnaryCall;
    discoverNodes(request: xudrpc_pb.DiscoverNodesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DiscoverNodesResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: xudrpc_pb.ShutdownRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    subscribeOrders(request: xudrpc_pb.SubscribeOrdersRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.OrderUpdate>;
    subscribeOrders(request: xudrpc_pb.SubscribeOrdersRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.OrderUpdate>;
    subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapSuccess>;
    subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapSuccess>;
    subscribeSwapFailures(request: xudrpc_pb.SubscribeSwapsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapFailure>;
    subscribeSwapFailures(request: xudrpc_pb.SubscribeSwapsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapFailure>;
}

export class XudClient extends grpc.Client implements IXudClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public addCurrency(request: xudrpc_pb.AddCurrencyRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    public addCurrency(request: xudrpc_pb.AddCurrencyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    public addCurrency(request: xudrpc_pb.AddCurrencyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    public addPair(request: xudrpc_pb.AddPairRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    public addPair(request: xudrpc_pb.AddPairRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    public addPair(request: xudrpc_pb.AddPairRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    public removeOrder(request: xudrpc_pb.RemoveOrderRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveOrderResponse) => void): grpc.ClientUnaryCall;
    public removeOrder(request: xudrpc_pb.RemoveOrderRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveOrderResponse) => void): grpc.ClientUnaryCall;
    public removeOrder(request: xudrpc_pb.RemoveOrderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveOrderResponse) => void): grpc.ClientUnaryCall;
    public channelBalance(request: xudrpc_pb.ChannelBalanceRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ChannelBalanceResponse) => void): grpc.ClientUnaryCall;
    public channelBalance(request: xudrpc_pb.ChannelBalanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ChannelBalanceResponse) => void): grpc.ClientUnaryCall;
    public channelBalance(request: xudrpc_pb.ChannelBalanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ChannelBalanceResponse) => void): grpc.ClientUnaryCall;
    public openChannel(request: xudrpc_pb.OpenChannelRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OpenChannelResponse) => void): grpc.ClientUnaryCall;
    public openChannel(request: xudrpc_pb.OpenChannelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OpenChannelResponse) => void): grpc.ClientUnaryCall;
    public openChannel(request: xudrpc_pb.OpenChannelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OpenChannelResponse) => void): grpc.ClientUnaryCall;
    public connect(request: xudrpc_pb.ConnectRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    public connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    public connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    public ban(request: xudrpc_pb.BanRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.BanResponse) => void): grpc.ClientUnaryCall;
    public ban(request: xudrpc_pb.BanRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.BanResponse) => void): grpc.ClientUnaryCall;
    public ban(request: xudrpc_pb.BanRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.BanResponse) => void): grpc.ClientUnaryCall;
    public unban(request: xudrpc_pb.UnbanRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnbanResponse) => void): grpc.ClientUnaryCall;
    public unban(request: xudrpc_pb.UnbanRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnbanResponse) => void): grpc.ClientUnaryCall;
    public unban(request: xudrpc_pb.UnbanRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnbanResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xudrpc_pb.GetInfoRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getNodeInfo(request: xudrpc_pb.GetNodeInfoRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetNodeInfoResponse) => void): grpc.ClientUnaryCall;
    public getNodeInfo(request: xudrpc_pb.GetNodeInfoRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetNodeInfoResponse) => void): grpc.ClientUnaryCall;
    public getNodeInfo(request: xudrpc_pb.GetNodeInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetNodeInfoResponse) => void): grpc.ClientUnaryCall;
    public listOrders(request: xudrpc_pb.ListOrdersRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListOrdersResponse) => void): grpc.ClientUnaryCall;
    public listOrders(request: xudrpc_pb.ListOrdersRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListOrdersResponse) => void): grpc.ClientUnaryCall;
    public listOrders(request: xudrpc_pb.ListOrdersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListOrdersResponse) => void): grpc.ClientUnaryCall;
    public listCurrencies(request: xudrpc_pb.ListCurrenciesRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListCurrenciesResponse) => void): grpc.ClientUnaryCall;
    public listCurrencies(request: xudrpc_pb.ListCurrenciesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListCurrenciesResponse) => void): grpc.ClientUnaryCall;
    public listCurrencies(request: xudrpc_pb.ListCurrenciesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListCurrenciesResponse) => void): grpc.ClientUnaryCall;
    public listPairs(request: xudrpc_pb.ListPairsRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListPairsResponse) => void): grpc.ClientUnaryCall;
    public listPairs(request: xudrpc_pb.ListPairsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListPairsResponse) => void): grpc.ClientUnaryCall;
    public listPairs(request: xudrpc_pb.ListPairsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListPairsResponse) => void): grpc.ClientUnaryCall;
    public listPeers(request: xudrpc_pb.ListPeersRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListPeersResponse) => void): grpc.ClientUnaryCall;
    public listPeers(request: xudrpc_pb.ListPeersRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListPeersResponse) => void): grpc.ClientUnaryCall;
    public listPeers(request: xudrpc_pb.ListPeersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ListPeersResponse) => void): grpc.ClientUnaryCall;
    public placeOrder(request: xudrpc_pb.PlaceOrderRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.PlaceOrderEvent>;
    public placeOrder(request: xudrpc_pb.PlaceOrderRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.PlaceOrderEvent>;
    public placeOrderSync(request: xudrpc_pb.PlaceOrderRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    public placeOrderSync(request: xudrpc_pb.PlaceOrderRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    public placeOrderSync(request: xudrpc_pb.PlaceOrderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.PlaceOrderResponse) => void): grpc.ClientUnaryCall;
    public executeSwap(request: xudrpc_pb.ExecuteSwapRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.SwapSuccess) => void): grpc.ClientUnaryCall;
    public executeSwap(request: xudrpc_pb.ExecuteSwapRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.SwapSuccess) => void): grpc.ClientUnaryCall;
    public executeSwap(request: xudrpc_pb.ExecuteSwapRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.SwapSuccess) => void): grpc.ClientUnaryCall;
    public removeCurrency(request: xudrpc_pb.RemoveCurrencyRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveCurrencyResponse) => void): grpc.ClientUnaryCall;
    public removeCurrency(request: xudrpc_pb.RemoveCurrencyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveCurrencyResponse) => void): grpc.ClientUnaryCall;
    public removeCurrency(request: xudrpc_pb.RemoveCurrencyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveCurrencyResponse) => void): grpc.ClientUnaryCall;
    public removePair(request: xudrpc_pb.RemovePairRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    public removePair(request: xudrpc_pb.RemovePairRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    public removePair(request: xudrpc_pb.RemovePairRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    public discoverNodes(request: xudrpc_pb.DiscoverNodesRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DiscoverNodesResponse) => void): grpc.ClientUnaryCall;
    public discoverNodes(request: xudrpc_pb.DiscoverNodesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DiscoverNodesResponse) => void): grpc.ClientUnaryCall;
    public discoverNodes(request: xudrpc_pb.DiscoverNodesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DiscoverNodesResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: xudrpc_pb.ShutdownRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public subscribeOrders(request: xudrpc_pb.SubscribeOrdersRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.OrderUpdate>;
    public subscribeOrders(request: xudrpc_pb.SubscribeOrdersRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.OrderUpdate>;
    public subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapSuccess>;
    public subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapSuccess>;
    public subscribeSwapFailures(request: xudrpc_pb.SubscribeSwapsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapFailure>;
    public subscribeSwapFailures(request: xudrpc_pb.SubscribeSwapsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapFailure>;
}
