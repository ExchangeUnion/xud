// package: xudrpc
// file: xudrpc.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import {handleClientStreamingCall} from "@grpc/grpc-js/build/src/server-call";
import * as xudrpc_pb from "./xudrpc_pb";
import * as annotations_pb from "./annotations_pb";

interface IXudInitService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    createNode: IXudInitService_ICreateNode;
    restoreNode: IXudInitService_IRestoreNode;
    unlockNode: IXudInitService_IUnlockNode;
}

interface IXudInitService_ICreateNode extends grpc.MethodDefinition<xudrpc_pb.CreateNodeRequest, xudrpc_pb.CreateNodeResponse> {
    path: "/xudrpc.XudInit/CreateNode";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.CreateNodeRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.CreateNodeRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.CreateNodeResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.CreateNodeResponse>;
}
interface IXudInitService_IRestoreNode extends grpc.MethodDefinition<xudrpc_pb.RestoreNodeRequest, xudrpc_pb.RestoreNodeResponse> {
    path: "/xudrpc.XudInit/RestoreNode";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.RestoreNodeRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.RestoreNodeRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.RestoreNodeResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.RestoreNodeResponse>;
}
interface IXudInitService_IUnlockNode extends grpc.MethodDefinition<xudrpc_pb.UnlockNodeRequest, xudrpc_pb.UnlockNodeResponse> {
    path: "/xudrpc.XudInit/UnlockNode";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.UnlockNodeRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.UnlockNodeRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.UnlockNodeResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.UnlockNodeResponse>;
}

export const XudInitService: IXudInitService;

export interface IXudInitServer extends grpc.UntypedServiceImplementation {
    createNode: grpc.handleUnaryCall<xudrpc_pb.CreateNodeRequest, xudrpc_pb.CreateNodeResponse>;
    restoreNode: grpc.handleUnaryCall<xudrpc_pb.RestoreNodeRequest, xudrpc_pb.RestoreNodeResponse>;
    unlockNode: grpc.handleUnaryCall<xudrpc_pb.UnlockNodeRequest, xudrpc_pb.UnlockNodeResponse>;
}

export interface IXudInitClient {
    createNode(request: xudrpc_pb.CreateNodeRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CreateNodeResponse) => void): grpc.ClientUnaryCall;
    createNode(request: xudrpc_pb.CreateNodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CreateNodeResponse) => void): grpc.ClientUnaryCall;
    createNode(request: xudrpc_pb.CreateNodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CreateNodeResponse) => void): grpc.ClientUnaryCall;
    restoreNode(request: xudrpc_pb.RestoreNodeRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RestoreNodeResponse) => void): grpc.ClientUnaryCall;
    restoreNode(request: xudrpc_pb.RestoreNodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RestoreNodeResponse) => void): grpc.ClientUnaryCall;
    restoreNode(request: xudrpc_pb.RestoreNodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RestoreNodeResponse) => void): grpc.ClientUnaryCall;
    unlockNode(request: xudrpc_pb.UnlockNodeRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnlockNodeResponse) => void): grpc.ClientUnaryCall;
    unlockNode(request: xudrpc_pb.UnlockNodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnlockNodeResponse) => void): grpc.ClientUnaryCall;
    unlockNode(request: xudrpc_pb.UnlockNodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnlockNodeResponse) => void): grpc.ClientUnaryCall;
}

export class XudInitClient extends grpc.Client implements IXudInitClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public createNode(request: xudrpc_pb.CreateNodeRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CreateNodeResponse) => void): grpc.ClientUnaryCall;
    public createNode(request: xudrpc_pb.CreateNodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CreateNodeResponse) => void): grpc.ClientUnaryCall;
    public createNode(request: xudrpc_pb.CreateNodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CreateNodeResponse) => void): grpc.ClientUnaryCall;
    public restoreNode(request: xudrpc_pb.RestoreNodeRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RestoreNodeResponse) => void): grpc.ClientUnaryCall;
    public restoreNode(request: xudrpc_pb.RestoreNodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RestoreNodeResponse) => void): grpc.ClientUnaryCall;
    public restoreNode(request: xudrpc_pb.RestoreNodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RestoreNodeResponse) => void): grpc.ClientUnaryCall;
    public unlockNode(request: xudrpc_pb.UnlockNodeRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnlockNodeResponse) => void): grpc.ClientUnaryCall;
    public unlockNode(request: xudrpc_pb.UnlockNodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnlockNodeResponse) => void): grpc.ClientUnaryCall;
    public unlockNode(request: xudrpc_pb.UnlockNodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnlockNodeResponse) => void): grpc.ClientUnaryCall;
}

interface IXudService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    addCurrency: IXudService_IAddCurrency;
    addPair: IXudService_IAddPair;
    ban: IXudService_IBan;
    changePassword: IXudService_IChangePassword;
    closeChannel: IXudService_ICloseChannel;
    connect: IXudService_IConnect;
    walletDeposit: IXudService_IWalletDeposit;
    deposit: IXudService_IDeposit;
    discoverNodes: IXudService_IDiscoverNodes;
    getBalance: IXudService_IGetBalance;
    getInfo: IXudService_IGetInfo;
    getMnemonic: IXudService_IGetMnemonic;
    getNodeInfo: IXudService_IGetNodeInfo;
    listOrders: IXudService_IListOrders;
    listCurrencies: IXudService_IListCurrencies;
    listPairs: IXudService_IListPairs;
    listPeers: IXudService_IListPeers;
    openChannel: IXudService_IOpenChannel;
    orderBook: IXudService_IOrderBook;
    placeOrder: IXudService_IPlaceOrder;
    placeOrderSync: IXudService_IPlaceOrderSync;
    executeSwap: IXudService_IExecuteSwap;
    removeCurrency: IXudService_IRemoveCurrency;
    removeOrder: IXudService_IRemoveOrder;
    removeAllOrders: IXudService_IRemoveAllOrders;
    removePair: IXudService_IRemovePair;
    setLogLevel: IXudService_ISetLogLevel;
    shutdown: IXudService_IShutdown;
    subscribeOrders: IXudService_ISubscribeOrders;
    subscribeSwapFailures: IXudService_ISubscribeSwapFailures;
    subscribeSwaps: IXudService_ISubscribeSwaps;
    subscribeSwapsAccepted: IXudService_ISubscribeSwapsAccepted;
    tradeHistory: IXudService_ITradeHistory;
    tradingLimits: IXudService_ITradingLimits;
    unban: IXudService_IUnban;
    walletWithdraw: IXudService_IWalletWithdraw;
}

interface IXudService_IAddCurrency extends grpc.MethodDefinition<xudrpc_pb.Currency, xudrpc_pb.AddCurrencyResponse> {
    path: "/xudrpc.Xud/AddCurrency";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.Currency>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.Currency>;
    responseSerialize: grpc.serialize<xudrpc_pb.AddCurrencyResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.AddCurrencyResponse>;
}
interface IXudService_IAddPair extends grpc.MethodDefinition<xudrpc_pb.AddPairRequest, xudrpc_pb.AddPairResponse> {
    path: "/xudrpc.Xud/AddPair";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.AddPairRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.AddPairRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.AddPairResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.AddPairResponse>;
}
interface IXudService_IBan extends grpc.MethodDefinition<xudrpc_pb.BanRequest, xudrpc_pb.BanResponse> {
    path: "/xudrpc.Xud/Ban";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.BanRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.BanRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.BanResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.BanResponse>;
}
interface IXudService_IChangePassword extends grpc.MethodDefinition<xudrpc_pb.ChangePasswordRequest, xudrpc_pb.ChangePasswordResponse> {
    path: "/xudrpc.Xud/ChangePassword";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.ChangePasswordRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ChangePasswordRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ChangePasswordResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ChangePasswordResponse>;
}
interface IXudService_ICloseChannel extends grpc.MethodDefinition<xudrpc_pb.CloseChannelRequest, xudrpc_pb.CloseChannelResponse> {
    path: "/xudrpc.Xud/CloseChannel";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.CloseChannelRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.CloseChannelRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.CloseChannelResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.CloseChannelResponse>;
}
interface IXudService_IConnect extends grpc.MethodDefinition<xudrpc_pb.ConnectRequest, xudrpc_pb.ConnectResponse> {
    path: "/xudrpc.Xud/Connect";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.ConnectRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ConnectRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ConnectResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ConnectResponse>;
}
interface IXudService_IWalletDeposit extends grpc.MethodDefinition<xudrpc_pb.DepositRequest, xudrpc_pb.DepositResponse> {
    path: "/xudrpc.Xud/WalletDeposit";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.DepositRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.DepositRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.DepositResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.DepositResponse>;
}
interface IXudService_IDeposit extends grpc.MethodDefinition<xudrpc_pb.DepositRequest, xudrpc_pb.DepositResponse> {
    path: "/xudrpc.Xud/Deposit";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.DepositRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.DepositRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.DepositResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.DepositResponse>;
}
interface IXudService_IDiscoverNodes extends grpc.MethodDefinition<xudrpc_pb.DiscoverNodesRequest, xudrpc_pb.DiscoverNodesResponse> {
    path: "/xudrpc.Xud/DiscoverNodes";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.DiscoverNodesRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.DiscoverNodesRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.DiscoverNodesResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.DiscoverNodesResponse>;
}
interface IXudService_IGetBalance extends grpc.MethodDefinition<xudrpc_pb.GetBalanceRequest, xudrpc_pb.GetBalanceResponse> {
    path: "/xudrpc.Xud/GetBalance";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.GetBalanceRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.GetBalanceRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.GetBalanceResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.GetBalanceResponse>;
}
interface IXudService_IGetInfo extends grpc.MethodDefinition<xudrpc_pb.GetInfoRequest, xudrpc_pb.GetInfoResponse> {
    path: "/xudrpc.Xud/GetInfo";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.GetInfoRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.GetInfoRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.GetInfoResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.GetInfoResponse>;
}
interface IXudService_IGetMnemonic extends grpc.MethodDefinition<xudrpc_pb.GetMnemonicRequest, xudrpc_pb.GetMnemonicResponse> {
    path: "/xudrpc.Xud/GetMnemonic";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.GetMnemonicRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.GetMnemonicRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.GetMnemonicResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.GetMnemonicResponse>;
}
interface IXudService_IGetNodeInfo extends grpc.MethodDefinition<xudrpc_pb.GetNodeInfoRequest, xudrpc_pb.GetNodeInfoResponse> {
    path: "/xudrpc.Xud/GetNodeInfo";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.GetNodeInfoRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.GetNodeInfoRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.GetNodeInfoResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.GetNodeInfoResponse>;
}
interface IXudService_IListOrders extends grpc.MethodDefinition<xudrpc_pb.ListOrdersRequest, xudrpc_pb.ListOrdersResponse> {
    path: "/xudrpc.Xud/ListOrders";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.ListOrdersRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ListOrdersRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ListOrdersResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ListOrdersResponse>;
}
interface IXudService_IListCurrencies extends grpc.MethodDefinition<xudrpc_pb.ListCurrenciesRequest, xudrpc_pb.ListCurrenciesResponse> {
    path: "/xudrpc.Xud/ListCurrencies";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.ListCurrenciesRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ListCurrenciesRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ListCurrenciesResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ListCurrenciesResponse>;
}
interface IXudService_IListPairs extends grpc.MethodDefinition<xudrpc_pb.ListPairsRequest, xudrpc_pb.ListPairsResponse> {
    path: "/xudrpc.Xud/ListPairs";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.ListPairsRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ListPairsRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ListPairsResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ListPairsResponse>;
}
interface IXudService_IListPeers extends grpc.MethodDefinition<xudrpc_pb.ListPeersRequest, xudrpc_pb.ListPeersResponse> {
    path: "/xudrpc.Xud/ListPeers";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.ListPeersRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ListPeersRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ListPeersResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ListPeersResponse>;
}
interface IXudService_IOpenChannel extends grpc.MethodDefinition<xudrpc_pb.OpenChannelRequest, xudrpc_pb.OpenChannelResponse> {
    path: "/xudrpc.Xud/OpenChannel";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.OpenChannelRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.OpenChannelRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.OpenChannelResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.OpenChannelResponse>;
}
interface IXudService_IOrderBook extends grpc.MethodDefinition<xudrpc_pb.OrderBookRequest, xudrpc_pb.OrderBookResponse> {
    path: "/xudrpc.Xud/OrderBook";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.OrderBookRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.OrderBookRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.OrderBookResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.OrderBookResponse>;
}
interface IXudService_IPlaceOrder extends grpc.MethodDefinition<xudrpc_pb.PlaceOrderRequest, xudrpc_pb.PlaceOrderEvent> {
    path: "/xudrpc.Xud/PlaceOrder";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<xudrpc_pb.PlaceOrderRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.PlaceOrderRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.PlaceOrderEvent>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.PlaceOrderEvent>;
}
interface IXudService_IPlaceOrderSync extends grpc.MethodDefinition<xudrpc_pb.PlaceOrderRequest, xudrpc_pb.PlaceOrderResponse> {
    path: "/xudrpc.Xud/PlaceOrderSync";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.PlaceOrderRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.PlaceOrderRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.PlaceOrderResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.PlaceOrderResponse>;
}
interface IXudService_IExecuteSwap extends grpc.MethodDefinition<xudrpc_pb.ExecuteSwapRequest, xudrpc_pb.SwapSuccess> {
    path: "/xudrpc.Xud/ExecuteSwap";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.ExecuteSwapRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ExecuteSwapRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.SwapSuccess>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.SwapSuccess>;
}
interface IXudService_IRemoveCurrency extends grpc.MethodDefinition<xudrpc_pb.RemoveCurrencyRequest, xudrpc_pb.RemoveCurrencyResponse> {
    path: "/xudrpc.Xud/RemoveCurrency";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.RemoveCurrencyRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.RemoveCurrencyRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.RemoveCurrencyResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.RemoveCurrencyResponse>;
}
interface IXudService_IRemoveOrder extends grpc.MethodDefinition<xudrpc_pb.RemoveOrderRequest, xudrpc_pb.RemoveOrderResponse> {
    path: "/xudrpc.Xud/RemoveOrder";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.RemoveOrderRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.RemoveOrderRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.RemoveOrderResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.RemoveOrderResponse>;
}
interface IXudService_IRemoveAllOrders extends grpc.MethodDefinition<xudrpc_pb.RemoveAllOrdersRequest, xudrpc_pb.RemoveAllOrdersResponse> {
    path: "/xudrpc.Xud/RemoveAllOrders";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.RemoveAllOrdersRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.RemoveAllOrdersRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.RemoveAllOrdersResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.RemoveAllOrdersResponse>;
}
interface IXudService_IRemovePair extends grpc.MethodDefinition<xudrpc_pb.RemovePairRequest, xudrpc_pb.RemovePairResponse> {
    path: "/xudrpc.Xud/RemovePair";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.RemovePairRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.RemovePairRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.RemovePairResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.RemovePairResponse>;
}
interface IXudService_ISetLogLevel extends grpc.MethodDefinition<xudrpc_pb.SetLogLevelRequest, xudrpc_pb.SetLogLevelResponse> {
    path: "/xudrpc.Xud/SetLogLevel";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.SetLogLevelRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.SetLogLevelRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.SetLogLevelResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.SetLogLevelResponse>;
}
interface IXudService_IShutdown extends grpc.MethodDefinition<xudrpc_pb.ShutdownRequest, xudrpc_pb.ShutdownResponse> {
    path: "/xudrpc.Xud/Shutdown";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.ShutdownRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ShutdownRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ShutdownResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ShutdownResponse>;
}
interface IXudService_ISubscribeOrders extends grpc.MethodDefinition<xudrpc_pb.SubscribeOrdersRequest, xudrpc_pb.OrderUpdate> {
    path: "/xudrpc.Xud/SubscribeOrders";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<xudrpc_pb.SubscribeOrdersRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.SubscribeOrdersRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.OrderUpdate>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.OrderUpdate>;
}
interface IXudService_ISubscribeSwapFailures extends grpc.MethodDefinition<xudrpc_pb.SubscribeSwapsRequest, xudrpc_pb.SwapFailure> {
    path: "/xudrpc.Xud/SubscribeSwapFailures";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<xudrpc_pb.SubscribeSwapsRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.SubscribeSwapsRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.SwapFailure>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.SwapFailure>;
}
interface IXudService_ISubscribeSwaps extends grpc.MethodDefinition<xudrpc_pb.SubscribeSwapsRequest, xudrpc_pb.SwapSuccess> {
    path: "/xudrpc.Xud/SubscribeSwaps";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<xudrpc_pb.SubscribeSwapsRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.SubscribeSwapsRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.SwapSuccess>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.SwapSuccess>;
}
interface IXudService_ISubscribeSwapsAccepted extends grpc.MethodDefinition<xudrpc_pb.SubscribeSwapsAcceptedRequest, xudrpc_pb.SwapAccepted> {
    path: "/xudrpc.Xud/SubscribeSwapsAccepted";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<xudrpc_pb.SubscribeSwapsAcceptedRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.SubscribeSwapsAcceptedRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.SwapAccepted>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.SwapAccepted>;
}
interface IXudService_ITradeHistory extends grpc.MethodDefinition<xudrpc_pb.TradeHistoryRequest, xudrpc_pb.TradeHistoryResponse> {
    path: "/xudrpc.Xud/TradeHistory";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.TradeHistoryRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.TradeHistoryRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.TradeHistoryResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.TradeHistoryResponse>;
}
interface IXudService_ITradingLimits extends grpc.MethodDefinition<xudrpc_pb.TradingLimitsRequest, xudrpc_pb.TradingLimitsResponse> {
    path: "/xudrpc.Xud/TradingLimits";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.TradingLimitsRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.TradingLimitsRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.TradingLimitsResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.TradingLimitsResponse>;
}
interface IXudService_IUnban extends grpc.MethodDefinition<xudrpc_pb.UnbanRequest, xudrpc_pb.UnbanResponse> {
    path: "/xudrpc.Xud/Unban";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.UnbanRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.UnbanRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.UnbanResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.UnbanResponse>;
}
interface IXudService_IWalletWithdraw extends grpc.MethodDefinition<xudrpc_pb.WithdrawRequest, xudrpc_pb.WithdrawResponse> {
    path: "/xudrpc.Xud/WalletWithdraw";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<xudrpc_pb.WithdrawRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.WithdrawRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.WithdrawResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.WithdrawResponse>;
}

export const XudService: IXudService;

export interface IXudServer extends grpc.UntypedServiceImplementation {
    addCurrency: grpc.handleUnaryCall<xudrpc_pb.Currency, xudrpc_pb.AddCurrencyResponse>;
    addPair: grpc.handleUnaryCall<xudrpc_pb.AddPairRequest, xudrpc_pb.AddPairResponse>;
    ban: grpc.handleUnaryCall<xudrpc_pb.BanRequest, xudrpc_pb.BanResponse>;
    changePassword: grpc.handleUnaryCall<xudrpc_pb.ChangePasswordRequest, xudrpc_pb.ChangePasswordResponse>;
    closeChannel: grpc.handleUnaryCall<xudrpc_pb.CloseChannelRequest, xudrpc_pb.CloseChannelResponse>;
    connect: grpc.handleUnaryCall<xudrpc_pb.ConnectRequest, xudrpc_pb.ConnectResponse>;
    walletDeposit: grpc.handleUnaryCall<xudrpc_pb.DepositRequest, xudrpc_pb.DepositResponse>;
    deposit: grpc.handleUnaryCall<xudrpc_pb.DepositRequest, xudrpc_pb.DepositResponse>;
    discoverNodes: grpc.handleUnaryCall<xudrpc_pb.DiscoverNodesRequest, xudrpc_pb.DiscoverNodesResponse>;
    getBalance: grpc.handleUnaryCall<xudrpc_pb.GetBalanceRequest, xudrpc_pb.GetBalanceResponse>;
    getInfo: grpc.handleUnaryCall<xudrpc_pb.GetInfoRequest, xudrpc_pb.GetInfoResponse>;
    getMnemonic: grpc.handleUnaryCall<xudrpc_pb.GetMnemonicRequest, xudrpc_pb.GetMnemonicResponse>;
    getNodeInfo: grpc.handleUnaryCall<xudrpc_pb.GetNodeInfoRequest, xudrpc_pb.GetNodeInfoResponse>;
    listOrders: grpc.handleUnaryCall<xudrpc_pb.ListOrdersRequest, xudrpc_pb.ListOrdersResponse>;
    listCurrencies: grpc.handleUnaryCall<xudrpc_pb.ListCurrenciesRequest, xudrpc_pb.ListCurrenciesResponse>;
    listPairs: grpc.handleUnaryCall<xudrpc_pb.ListPairsRequest, xudrpc_pb.ListPairsResponse>;
    listPeers: grpc.handleUnaryCall<xudrpc_pb.ListPeersRequest, xudrpc_pb.ListPeersResponse>;
    openChannel: grpc.handleUnaryCall<xudrpc_pb.OpenChannelRequest, xudrpc_pb.OpenChannelResponse>;
    orderBook: grpc.handleUnaryCall<xudrpc_pb.OrderBookRequest, xudrpc_pb.OrderBookResponse>;
    placeOrder: grpc.handleServerStreamingCall<xudrpc_pb.PlaceOrderRequest, xudrpc_pb.PlaceOrderEvent>;
    placeOrderSync: grpc.handleUnaryCall<xudrpc_pb.PlaceOrderRequest, xudrpc_pb.PlaceOrderResponse>;
    executeSwap: grpc.handleUnaryCall<xudrpc_pb.ExecuteSwapRequest, xudrpc_pb.SwapSuccess>;
    removeCurrency: grpc.handleUnaryCall<xudrpc_pb.RemoveCurrencyRequest, xudrpc_pb.RemoveCurrencyResponse>;
    removeOrder: grpc.handleUnaryCall<xudrpc_pb.RemoveOrderRequest, xudrpc_pb.RemoveOrderResponse>;
    removeAllOrders: grpc.handleUnaryCall<xudrpc_pb.RemoveAllOrdersRequest, xudrpc_pb.RemoveAllOrdersResponse>;
    removePair: grpc.handleUnaryCall<xudrpc_pb.RemovePairRequest, xudrpc_pb.RemovePairResponse>;
    setLogLevel: grpc.handleUnaryCall<xudrpc_pb.SetLogLevelRequest, xudrpc_pb.SetLogLevelResponse>;
    shutdown: grpc.handleUnaryCall<xudrpc_pb.ShutdownRequest, xudrpc_pb.ShutdownResponse>;
    subscribeOrders: grpc.handleServerStreamingCall<xudrpc_pb.SubscribeOrdersRequest, xudrpc_pb.OrderUpdate>;
    subscribeSwapFailures: grpc.handleServerStreamingCall<xudrpc_pb.SubscribeSwapsRequest, xudrpc_pb.SwapFailure>;
    subscribeSwaps: grpc.handleServerStreamingCall<xudrpc_pb.SubscribeSwapsRequest, xudrpc_pb.SwapSuccess>;
    subscribeSwapsAccepted: grpc.handleServerStreamingCall<xudrpc_pb.SubscribeSwapsAcceptedRequest, xudrpc_pb.SwapAccepted>;
    tradeHistory: grpc.handleUnaryCall<xudrpc_pb.TradeHistoryRequest, xudrpc_pb.TradeHistoryResponse>;
    tradingLimits: grpc.handleUnaryCall<xudrpc_pb.TradingLimitsRequest, xudrpc_pb.TradingLimitsResponse>;
    unban: grpc.handleUnaryCall<xudrpc_pb.UnbanRequest, xudrpc_pb.UnbanResponse>;
    walletWithdraw: grpc.handleUnaryCall<xudrpc_pb.WithdrawRequest, xudrpc_pb.WithdrawResponse>;
}

export interface IXudClient {
    addCurrency(request: xudrpc_pb.Currency, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    addCurrency(request: xudrpc_pb.Currency, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    addCurrency(request: xudrpc_pb.Currency, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    addPair(request: xudrpc_pb.AddPairRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    addPair(request: xudrpc_pb.AddPairRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    addPair(request: xudrpc_pb.AddPairRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    ban(request: xudrpc_pb.BanRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.BanResponse) => void): grpc.ClientUnaryCall;
    ban(request: xudrpc_pb.BanRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.BanResponse) => void): grpc.ClientUnaryCall;
    ban(request: xudrpc_pb.BanRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.BanResponse) => void): grpc.ClientUnaryCall;
    changePassword(request: xudrpc_pb.ChangePasswordRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    changePassword(request: xudrpc_pb.ChangePasswordRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    changePassword(request: xudrpc_pb.ChangePasswordRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    closeChannel(request: xudrpc_pb.CloseChannelRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CloseChannelResponse) => void): grpc.ClientUnaryCall;
    closeChannel(request: xudrpc_pb.CloseChannelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CloseChannelResponse) => void): grpc.ClientUnaryCall;
    closeChannel(request: xudrpc_pb.CloseChannelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CloseChannelResponse) => void): grpc.ClientUnaryCall;
    connect(request: xudrpc_pb.ConnectRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    walletDeposit(request: xudrpc_pb.DepositRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DepositResponse) => void): grpc.ClientUnaryCall;
    walletDeposit(request: xudrpc_pb.DepositRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DepositResponse) => void): grpc.ClientUnaryCall;
    walletDeposit(request: xudrpc_pb.DepositRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DepositResponse) => void): grpc.ClientUnaryCall;
    deposit(request: xudrpc_pb.DepositRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DepositResponse) => void): grpc.ClientUnaryCall;
    deposit(request: xudrpc_pb.DepositRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DepositResponse) => void): grpc.ClientUnaryCall;
    deposit(request: xudrpc_pb.DepositRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DepositResponse) => void): grpc.ClientUnaryCall;
    discoverNodes(request: xudrpc_pb.DiscoverNodesRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DiscoverNodesResponse) => void): grpc.ClientUnaryCall;
    discoverNodes(request: xudrpc_pb.DiscoverNodesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DiscoverNodesResponse) => void): grpc.ClientUnaryCall;
    discoverNodes(request: xudrpc_pb.DiscoverNodesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DiscoverNodesResponse) => void): grpc.ClientUnaryCall;
    getBalance(request: xudrpc_pb.GetBalanceRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    getBalance(request: xudrpc_pb.GetBalanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    getBalance(request: xudrpc_pb.GetBalanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xudrpc_pb.GetInfoRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getMnemonic(request: xudrpc_pb.GetMnemonicRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetMnemonicResponse) => void): grpc.ClientUnaryCall;
    getMnemonic(request: xudrpc_pb.GetMnemonicRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetMnemonicResponse) => void): grpc.ClientUnaryCall;
    getMnemonic(request: xudrpc_pb.GetMnemonicRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetMnemonicResponse) => void): grpc.ClientUnaryCall;
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
    openChannel(request: xudrpc_pb.OpenChannelRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OpenChannelResponse) => void): grpc.ClientUnaryCall;
    openChannel(request: xudrpc_pb.OpenChannelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OpenChannelResponse) => void): grpc.ClientUnaryCall;
    openChannel(request: xudrpc_pb.OpenChannelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OpenChannelResponse) => void): grpc.ClientUnaryCall;
    orderBook(request: xudrpc_pb.OrderBookRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OrderBookResponse) => void): grpc.ClientUnaryCall;
    orderBook(request: xudrpc_pb.OrderBookRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OrderBookResponse) => void): grpc.ClientUnaryCall;
    orderBook(request: xudrpc_pb.OrderBookRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OrderBookResponse) => void): grpc.ClientUnaryCall;
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
    removeOrder(request: xudrpc_pb.RemoveOrderRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveOrderResponse) => void): grpc.ClientUnaryCall;
    removeOrder(request: xudrpc_pb.RemoveOrderRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveOrderResponse) => void): grpc.ClientUnaryCall;
    removeOrder(request: xudrpc_pb.RemoveOrderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveOrderResponse) => void): grpc.ClientUnaryCall;
    removeAllOrders(request: xudrpc_pb.RemoveAllOrdersRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveAllOrdersResponse) => void): grpc.ClientUnaryCall;
    removeAllOrders(request: xudrpc_pb.RemoveAllOrdersRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveAllOrdersResponse) => void): grpc.ClientUnaryCall;
    removeAllOrders(request: xudrpc_pb.RemoveAllOrdersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveAllOrdersResponse) => void): grpc.ClientUnaryCall;
    removePair(request: xudrpc_pb.RemovePairRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    removePair(request: xudrpc_pb.RemovePairRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    removePair(request: xudrpc_pb.RemovePairRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    setLogLevel(request: xudrpc_pb.SetLogLevelRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.SetLogLevelResponse) => void): grpc.ClientUnaryCall;
    setLogLevel(request: xudrpc_pb.SetLogLevelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.SetLogLevelResponse) => void): grpc.ClientUnaryCall;
    setLogLevel(request: xudrpc_pb.SetLogLevelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.SetLogLevelResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: xudrpc_pb.ShutdownRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    subscribeOrders(request: xudrpc_pb.SubscribeOrdersRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.OrderUpdate>;
    subscribeOrders(request: xudrpc_pb.SubscribeOrdersRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.OrderUpdate>;
    subscribeSwapFailures(request: xudrpc_pb.SubscribeSwapsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapFailure>;
    subscribeSwapFailures(request: xudrpc_pb.SubscribeSwapsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapFailure>;
    subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapSuccess>;
    subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapSuccess>;
    subscribeSwapsAccepted(request: xudrpc_pb.SubscribeSwapsAcceptedRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapAccepted>;
    subscribeSwapsAccepted(request: xudrpc_pb.SubscribeSwapsAcceptedRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapAccepted>;
    tradeHistory(request: xudrpc_pb.TradeHistoryRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.TradeHistoryResponse) => void): grpc.ClientUnaryCall;
    tradeHistory(request: xudrpc_pb.TradeHistoryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.TradeHistoryResponse) => void): grpc.ClientUnaryCall;
    tradeHistory(request: xudrpc_pb.TradeHistoryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.TradeHistoryResponse) => void): grpc.ClientUnaryCall;
    tradingLimits(request: xudrpc_pb.TradingLimitsRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.TradingLimitsResponse) => void): grpc.ClientUnaryCall;
    tradingLimits(request: xudrpc_pb.TradingLimitsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.TradingLimitsResponse) => void): grpc.ClientUnaryCall;
    tradingLimits(request: xudrpc_pb.TradingLimitsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.TradingLimitsResponse) => void): grpc.ClientUnaryCall;
    unban(request: xudrpc_pb.UnbanRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnbanResponse) => void): grpc.ClientUnaryCall;
    unban(request: xudrpc_pb.UnbanRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnbanResponse) => void): grpc.ClientUnaryCall;
    unban(request: xudrpc_pb.UnbanRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnbanResponse) => void): grpc.ClientUnaryCall;
    walletWithdraw(request: xudrpc_pb.WithdrawRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.WithdrawResponse) => void): grpc.ClientUnaryCall;
    walletWithdraw(request: xudrpc_pb.WithdrawRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.WithdrawResponse) => void): grpc.ClientUnaryCall;
    walletWithdraw(request: xudrpc_pb.WithdrawRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.WithdrawResponse) => void): grpc.ClientUnaryCall;
}

export class XudClient extends grpc.Client implements IXudClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public addCurrency(request: xudrpc_pb.Currency, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    public addCurrency(request: xudrpc_pb.Currency, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    public addCurrency(request: xudrpc_pb.Currency, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddCurrencyResponse) => void): grpc.ClientUnaryCall;
    public addPair(request: xudrpc_pb.AddPairRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    public addPair(request: xudrpc_pb.AddPairRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    public addPair(request: xudrpc_pb.AddPairRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.AddPairResponse) => void): grpc.ClientUnaryCall;
    public ban(request: xudrpc_pb.BanRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.BanResponse) => void): grpc.ClientUnaryCall;
    public ban(request: xudrpc_pb.BanRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.BanResponse) => void): grpc.ClientUnaryCall;
    public ban(request: xudrpc_pb.BanRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.BanResponse) => void): grpc.ClientUnaryCall;
    public changePassword(request: xudrpc_pb.ChangePasswordRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    public changePassword(request: xudrpc_pb.ChangePasswordRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    public changePassword(request: xudrpc_pb.ChangePasswordRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    public closeChannel(request: xudrpc_pb.CloseChannelRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CloseChannelResponse) => void): grpc.ClientUnaryCall;
    public closeChannel(request: xudrpc_pb.CloseChannelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CloseChannelResponse) => void): grpc.ClientUnaryCall;
    public closeChannel(request: xudrpc_pb.CloseChannelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.CloseChannelResponse) => void): grpc.ClientUnaryCall;
    public connect(request: xudrpc_pb.ConnectRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    public connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    public connect(request: xudrpc_pb.ConnectRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ConnectResponse) => void): grpc.ClientUnaryCall;
    public walletDeposit(request: xudrpc_pb.DepositRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DepositResponse) => void): grpc.ClientUnaryCall;
    public walletDeposit(request: xudrpc_pb.DepositRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DepositResponse) => void): grpc.ClientUnaryCall;
    public walletDeposit(request: xudrpc_pb.DepositRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DepositResponse) => void): grpc.ClientUnaryCall;
    public deposit(request: xudrpc_pb.DepositRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DepositResponse) => void): grpc.ClientUnaryCall;
    public deposit(request: xudrpc_pb.DepositRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DepositResponse) => void): grpc.ClientUnaryCall;
    public deposit(request: xudrpc_pb.DepositRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DepositResponse) => void): grpc.ClientUnaryCall;
    public discoverNodes(request: xudrpc_pb.DiscoverNodesRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DiscoverNodesResponse) => void): grpc.ClientUnaryCall;
    public discoverNodes(request: xudrpc_pb.DiscoverNodesRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DiscoverNodesResponse) => void): grpc.ClientUnaryCall;
    public discoverNodes(request: xudrpc_pb.DiscoverNodesRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.DiscoverNodesResponse) => void): grpc.ClientUnaryCall;
    public getBalance(request: xudrpc_pb.GetBalanceRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    public getBalance(request: xudrpc_pb.GetBalanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    public getBalance(request: xudrpc_pb.GetBalanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xudrpc_pb.GetInfoRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xudrpc_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getMnemonic(request: xudrpc_pb.GetMnemonicRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetMnemonicResponse) => void): grpc.ClientUnaryCall;
    public getMnemonic(request: xudrpc_pb.GetMnemonicRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetMnemonicResponse) => void): grpc.ClientUnaryCall;
    public getMnemonic(request: xudrpc_pb.GetMnemonicRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.GetMnemonicResponse) => void): grpc.ClientUnaryCall;
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
    public openChannel(request: xudrpc_pb.OpenChannelRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OpenChannelResponse) => void): grpc.ClientUnaryCall;
    public openChannel(request: xudrpc_pb.OpenChannelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OpenChannelResponse) => void): grpc.ClientUnaryCall;
    public openChannel(request: xudrpc_pb.OpenChannelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OpenChannelResponse) => void): grpc.ClientUnaryCall;
    public orderBook(request: xudrpc_pb.OrderBookRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OrderBookResponse) => void): grpc.ClientUnaryCall;
    public orderBook(request: xudrpc_pb.OrderBookRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OrderBookResponse) => void): grpc.ClientUnaryCall;
    public orderBook(request: xudrpc_pb.OrderBookRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.OrderBookResponse) => void): grpc.ClientUnaryCall;
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
    public removeOrder(request: xudrpc_pb.RemoveOrderRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveOrderResponse) => void): grpc.ClientUnaryCall;
    public removeOrder(request: xudrpc_pb.RemoveOrderRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveOrderResponse) => void): grpc.ClientUnaryCall;
    public removeOrder(request: xudrpc_pb.RemoveOrderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveOrderResponse) => void): grpc.ClientUnaryCall;
    public removeAllOrders(request: xudrpc_pb.RemoveAllOrdersRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveAllOrdersResponse) => void): grpc.ClientUnaryCall;
    public removeAllOrders(request: xudrpc_pb.RemoveAllOrdersRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveAllOrdersResponse) => void): grpc.ClientUnaryCall;
    public removeAllOrders(request: xudrpc_pb.RemoveAllOrdersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemoveAllOrdersResponse) => void): grpc.ClientUnaryCall;
    public removePair(request: xudrpc_pb.RemovePairRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    public removePair(request: xudrpc_pb.RemovePairRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    public removePair(request: xudrpc_pb.RemovePairRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.RemovePairResponse) => void): grpc.ClientUnaryCall;
    public setLogLevel(request: xudrpc_pb.SetLogLevelRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.SetLogLevelResponse) => void): grpc.ClientUnaryCall;
    public setLogLevel(request: xudrpc_pb.SetLogLevelRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.SetLogLevelResponse) => void): grpc.ClientUnaryCall;
    public setLogLevel(request: xudrpc_pb.SetLogLevelRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.SetLogLevelResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: xudrpc_pb.ShutdownRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public subscribeOrders(request: xudrpc_pb.SubscribeOrdersRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.OrderUpdate>;
    public subscribeOrders(request: xudrpc_pb.SubscribeOrdersRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.OrderUpdate>;
    public subscribeSwapFailures(request: xudrpc_pb.SubscribeSwapsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapFailure>;
    public subscribeSwapFailures(request: xudrpc_pb.SubscribeSwapsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapFailure>;
    public subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapSuccess>;
    public subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapSuccess>;
    public subscribeSwapsAccepted(request: xudrpc_pb.SubscribeSwapsAcceptedRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapAccepted>;
    public subscribeSwapsAccepted(request: xudrpc_pb.SubscribeSwapsAcceptedRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapAccepted>;
    public tradeHistory(request: xudrpc_pb.TradeHistoryRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.TradeHistoryResponse) => void): grpc.ClientUnaryCall;
    public tradeHistory(request: xudrpc_pb.TradeHistoryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.TradeHistoryResponse) => void): grpc.ClientUnaryCall;
    public tradeHistory(request: xudrpc_pb.TradeHistoryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.TradeHistoryResponse) => void): grpc.ClientUnaryCall;
    public tradingLimits(request: xudrpc_pb.TradingLimitsRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.TradingLimitsResponse) => void): grpc.ClientUnaryCall;
    public tradingLimits(request: xudrpc_pb.TradingLimitsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.TradingLimitsResponse) => void): grpc.ClientUnaryCall;
    public tradingLimits(request: xudrpc_pb.TradingLimitsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.TradingLimitsResponse) => void): grpc.ClientUnaryCall;
    public unban(request: xudrpc_pb.UnbanRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnbanResponse) => void): grpc.ClientUnaryCall;
    public unban(request: xudrpc_pb.UnbanRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnbanResponse) => void): grpc.ClientUnaryCall;
    public unban(request: xudrpc_pb.UnbanRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.UnbanResponse) => void): grpc.ClientUnaryCall;
    public walletWithdraw(request: xudrpc_pb.WithdrawRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.WithdrawResponse) => void): grpc.ClientUnaryCall;
    public walletWithdraw(request: xudrpc_pb.WithdrawRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.WithdrawResponse) => void): grpc.ClientUnaryCall;
    public walletWithdraw(request: xudrpc_pb.WithdrawRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.WithdrawResponse) => void): grpc.ClientUnaryCall;
}
