// package: xudrpc
// file: xudrpc.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as xudrpc_pb from "./xudrpc_pb";
import * as annotations_pb from "./annotations_pb";
import * as lndrpc_pb from "./lndrpc_pb";

interface IXudService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    addCurrency: IXudService_IAddCurrency;
    addPair: IXudService_IAddPair;
    removeOrder: IXudService_IRemoveOrder;
    channelBalance: IXudService_IChannelBalance;
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
    shutdown: IXudService_IShutdown;
    genSeed: IXudService_IGenSeed;
    initWallet: IXudService_IInitWallet;
    unlockWallet: IXudService_IUnlockWallet;
    changePassword: IXudService_IChangePassword;
    walletBalance: IXudService_IWalletBalance;
    getTransactions: IXudService_IGetTransactions;
    estimateFee: IXudService_IEstimateFee;
    listUnspent: IXudService_IListUnspent;
    sendCoins: IXudService_ISendCoins;
    sendMany: IXudService_ISendMany;
    newAddress: IXudService_INewAddress;
    subscribeTransactions: IXudService_ISubscribeTransactions;
    subscribeAddedOrders: IXudService_ISubscribeAddedOrders;
    subscribeRemovedOrders: IXudService_ISubscribeRemovedOrders;
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
interface IXudService_IShutdown extends grpc.MethodDefinition<xudrpc_pb.ShutdownRequest, xudrpc_pb.ShutdownResponse> {
    path: string; // "/xudrpc.Xud/Shutdown"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.ShutdownRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ShutdownRequest>;
    responseSerialize: grpc.serialize<xudrpc_pb.ShutdownResponse>;
    responseDeserialize: grpc.deserialize<xudrpc_pb.ShutdownResponse>;
}
interface IXudService_IGenSeed extends grpc.MethodDefinition<xudrpc_pb.GenSeedRequest, lndrpc_pb.GenSeedResponse> {
    path: string; // "/xudrpc.Xud/GenSeed"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.GenSeedRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.GenSeedRequest>;
    responseSerialize: grpc.serialize<lndrpc_pb.GenSeedResponse>;
    responseDeserialize: grpc.deserialize<lndrpc_pb.GenSeedResponse>;
}
interface IXudService_IInitWallet extends grpc.MethodDefinition<xudrpc_pb.InitWalletRequest, lndrpc_pb.InitWalletResponse> {
    path: string; // "/xudrpc.Xud/InitWallet"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.InitWalletRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.InitWalletRequest>;
    responseSerialize: grpc.serialize<lndrpc_pb.InitWalletResponse>;
    responseDeserialize: grpc.deserialize<lndrpc_pb.InitWalletResponse>;
}
interface IXudService_IUnlockWallet extends grpc.MethodDefinition<lndrpc_pb.UnlockWalletRequest, lndrpc_pb.UnlockWalletResponse> {
    path: string; // "/xudrpc.Xud/UnlockWallet"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<lndrpc_pb.UnlockWalletRequest>;
    requestDeserialize: grpc.deserialize<lndrpc_pb.UnlockWalletRequest>;
    responseSerialize: grpc.serialize<lndrpc_pb.UnlockWalletResponse>;
    responseDeserialize: grpc.deserialize<lndrpc_pb.UnlockWalletResponse>;
}
interface IXudService_IChangePassword extends grpc.MethodDefinition<xudrpc_pb.ChangePasswordRequest, lndrpc_pb.ChangePasswordResponse> {
    path: string; // "/xudrpc.Xud/ChangePassword"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.ChangePasswordRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ChangePasswordRequest>;
    responseSerialize: grpc.serialize<lndrpc_pb.ChangePasswordResponse>;
    responseDeserialize: grpc.deserialize<lndrpc_pb.ChangePasswordResponse>;
}
interface IXudService_IWalletBalance extends grpc.MethodDefinition<xudrpc_pb.WalletBalanceRequest, lndrpc_pb.WalletBalanceResponse> {
    path: string; // "/xudrpc.Xud/WalletBalance"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.WalletBalanceRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.WalletBalanceRequest>;
    responseSerialize: grpc.serialize<lndrpc_pb.WalletBalanceResponse>;
    responseDeserialize: grpc.deserialize<lndrpc_pb.WalletBalanceResponse>;
}
interface IXudService_IGetTransactions extends grpc.MethodDefinition<xudrpc_pb.GetTransactionsRequest, lndrpc_pb.TransactionDetails> {
    path: string; // "/xudrpc.Xud/GetTransactions"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.GetTransactionsRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.GetTransactionsRequest>;
    responseSerialize: grpc.serialize<lndrpc_pb.TransactionDetails>;
    responseDeserialize: grpc.deserialize<lndrpc_pb.TransactionDetails>;
}
interface IXudService_IEstimateFee extends grpc.MethodDefinition<xudrpc_pb.EstimateFeeRequest, lndrpc_pb.EstimateFeeResponse> {
    path: string; // "/xudrpc.Xud/EstimateFee"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.EstimateFeeRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.EstimateFeeRequest>;
    responseSerialize: grpc.serialize<lndrpc_pb.EstimateFeeResponse>;
    responseDeserialize: grpc.deserialize<lndrpc_pb.EstimateFeeResponse>;
}
interface IXudService_IListUnspent extends grpc.MethodDefinition<xudrpc_pb.ListUnspentRequest, lndrpc_pb.ListUnspentResponse> {
    path: string; // "/xudrpc.Xud/ListUnspent"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.ListUnspentRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.ListUnspentRequest>;
    responseSerialize: grpc.serialize<lndrpc_pb.ListUnspentResponse>;
    responseDeserialize: grpc.deserialize<lndrpc_pb.ListUnspentResponse>;
}
interface IXudService_ISendCoins extends grpc.MethodDefinition<xudrpc_pb.SendCoinsRequest, lndrpc_pb.SendCoinsResponse> {
    path: string; // "/xudrpc.Xud/SendCoins"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.SendCoinsRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.SendCoinsRequest>;
    responseSerialize: grpc.serialize<lndrpc_pb.SendCoinsResponse>;
    responseDeserialize: grpc.deserialize<lndrpc_pb.SendCoinsResponse>;
}
interface IXudService_ISendMany extends grpc.MethodDefinition<xudrpc_pb.SendManyRequest, lndrpc_pb.SendManyResponse> {
    path: string; // "/xudrpc.Xud/SendMany"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.SendManyRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.SendManyRequest>;
    responseSerialize: grpc.serialize<lndrpc_pb.SendManyResponse>;
    responseDeserialize: grpc.deserialize<lndrpc_pb.SendManyResponse>;
}
interface IXudService_INewAddress extends grpc.MethodDefinition<xudrpc_pb.NewAddressRequest, lndrpc_pb.NewAddressResponse> {
    path: string; // "/xudrpc.Xud/NewAddress"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xudrpc_pb.NewAddressRequest>;
    requestDeserialize: grpc.deserialize<xudrpc_pb.NewAddressRequest>;
    responseSerialize: grpc.serialize<lndrpc_pb.NewAddressResponse>;
    responseDeserialize: grpc.deserialize<lndrpc_pb.NewAddressResponse>;
}
interface IXudService_ISubscribeTransactions extends grpc.MethodDefinition<lndrpc_pb.GetTransactionsRequest, lndrpc_pb.Transaction> {
    path: string; // "/xudrpc.Xud/SubscribeTransactions"
    requestStream: boolean; // false
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<lndrpc_pb.GetTransactionsRequest>;
    requestDeserialize: grpc.deserialize<lndrpc_pb.GetTransactionsRequest>;
    responseSerialize: grpc.serialize<lndrpc_pb.Transaction>;
    responseDeserialize: grpc.deserialize<lndrpc_pb.Transaction>;
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
    shutdown: grpc.handleUnaryCall<xudrpc_pb.ShutdownRequest, xudrpc_pb.ShutdownResponse>;
    genSeed: grpc.handleUnaryCall<xudrpc_pb.GenSeedRequest, lndrpc_pb.GenSeedResponse>;
    initWallet: grpc.handleUnaryCall<xudrpc_pb.InitWalletRequest, lndrpc_pb.InitWalletResponse>;
    unlockWallet: grpc.handleUnaryCall<lndrpc_pb.UnlockWalletRequest, lndrpc_pb.UnlockWalletResponse>;
    changePassword: grpc.handleUnaryCall<xudrpc_pb.ChangePasswordRequest, lndrpc_pb.ChangePasswordResponse>;
    walletBalance: grpc.handleUnaryCall<xudrpc_pb.WalletBalanceRequest, lndrpc_pb.WalletBalanceResponse>;
    getTransactions: grpc.handleUnaryCall<xudrpc_pb.GetTransactionsRequest, lndrpc_pb.TransactionDetails>;
    estimateFee: grpc.handleUnaryCall<xudrpc_pb.EstimateFeeRequest, lndrpc_pb.EstimateFeeResponse>;
    listUnspent: grpc.handleUnaryCall<xudrpc_pb.ListUnspentRequest, lndrpc_pb.ListUnspentResponse>;
    sendCoins: grpc.handleUnaryCall<xudrpc_pb.SendCoinsRequest, lndrpc_pb.SendCoinsResponse>;
    sendMany: grpc.handleUnaryCall<xudrpc_pb.SendManyRequest, lndrpc_pb.SendManyResponse>;
    newAddress: grpc.handleUnaryCall<xudrpc_pb.NewAddressRequest, lndrpc_pb.NewAddressResponse>;
    subscribeTransactions: grpc.handleServerStreamingCall<lndrpc_pb.GetTransactionsRequest, lndrpc_pb.Transaction>;
    subscribeAddedOrders: grpc.handleServerStreamingCall<xudrpc_pb.SubscribeAddedOrdersRequest, xudrpc_pb.Order>;
    subscribeRemovedOrders: grpc.handleServerStreamingCall<xudrpc_pb.SubscribeRemovedOrdersRequest, xudrpc_pb.OrderRemoval>;
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
    shutdown(request: xudrpc_pb.ShutdownRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    genSeed(request: xudrpc_pb.GenSeedRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.GenSeedResponse) => void): grpc.ClientUnaryCall;
    genSeed(request: xudrpc_pb.GenSeedRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.GenSeedResponse) => void): grpc.ClientUnaryCall;
    genSeed(request: xudrpc_pb.GenSeedRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.GenSeedResponse) => void): grpc.ClientUnaryCall;
    initWallet(request: xudrpc_pb.InitWalletRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.InitWalletResponse) => void): grpc.ClientUnaryCall;
    initWallet(request: xudrpc_pb.InitWalletRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.InitWalletResponse) => void): grpc.ClientUnaryCall;
    initWallet(request: xudrpc_pb.InitWalletRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.InitWalletResponse) => void): grpc.ClientUnaryCall;
    unlockWallet(request: lndrpc_pb.UnlockWalletRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.UnlockWalletResponse) => void): grpc.ClientUnaryCall;
    unlockWallet(request: lndrpc_pb.UnlockWalletRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.UnlockWalletResponse) => void): grpc.ClientUnaryCall;
    unlockWallet(request: lndrpc_pb.UnlockWalletRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.UnlockWalletResponse) => void): grpc.ClientUnaryCall;
    changePassword(request: xudrpc_pb.ChangePasswordRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    changePassword(request: xudrpc_pb.ChangePasswordRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    changePassword(request: xudrpc_pb.ChangePasswordRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    walletBalance(request: xudrpc_pb.WalletBalanceRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.WalletBalanceResponse) => void): grpc.ClientUnaryCall;
    walletBalance(request: xudrpc_pb.WalletBalanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.WalletBalanceResponse) => void): grpc.ClientUnaryCall;
    walletBalance(request: xudrpc_pb.WalletBalanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.WalletBalanceResponse) => void): grpc.ClientUnaryCall;
    getTransactions(request: xudrpc_pb.GetTransactionsRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.TransactionDetails) => void): grpc.ClientUnaryCall;
    getTransactions(request: xudrpc_pb.GetTransactionsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.TransactionDetails) => void): grpc.ClientUnaryCall;
    getTransactions(request: xudrpc_pb.GetTransactionsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.TransactionDetails) => void): grpc.ClientUnaryCall;
    estimateFee(request: xudrpc_pb.EstimateFeeRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.EstimateFeeResponse) => void): grpc.ClientUnaryCall;
    estimateFee(request: xudrpc_pb.EstimateFeeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.EstimateFeeResponse) => void): grpc.ClientUnaryCall;
    estimateFee(request: xudrpc_pb.EstimateFeeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.EstimateFeeResponse) => void): grpc.ClientUnaryCall;
    listUnspent(request: xudrpc_pb.ListUnspentRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.ListUnspentResponse) => void): grpc.ClientUnaryCall;
    listUnspent(request: xudrpc_pb.ListUnspentRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.ListUnspentResponse) => void): grpc.ClientUnaryCall;
    listUnspent(request: xudrpc_pb.ListUnspentRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.ListUnspentResponse) => void): grpc.ClientUnaryCall;
    sendCoins(request: xudrpc_pb.SendCoinsRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.SendCoinsResponse) => void): grpc.ClientUnaryCall;
    sendCoins(request: xudrpc_pb.SendCoinsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.SendCoinsResponse) => void): grpc.ClientUnaryCall;
    sendCoins(request: xudrpc_pb.SendCoinsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.SendCoinsResponse) => void): grpc.ClientUnaryCall;
    sendMany(request: xudrpc_pb.SendManyRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.SendManyResponse) => void): grpc.ClientUnaryCall;
    sendMany(request: xudrpc_pb.SendManyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.SendManyResponse) => void): grpc.ClientUnaryCall;
    sendMany(request: xudrpc_pb.SendManyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.SendManyResponse) => void): grpc.ClientUnaryCall;
    newAddress(request: xudrpc_pb.NewAddressRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.NewAddressResponse) => void): grpc.ClientUnaryCall;
    newAddress(request: xudrpc_pb.NewAddressRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.NewAddressResponse) => void): grpc.ClientUnaryCall;
    newAddress(request: xudrpc_pb.NewAddressRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.NewAddressResponse) => void): grpc.ClientUnaryCall;
    subscribeTransactions(request: lndrpc_pb.GetTransactionsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrpc_pb.Transaction>;
    subscribeTransactions(request: lndrpc_pb.GetTransactionsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrpc_pb.Transaction>;
    subscribeAddedOrders(request: xudrpc_pb.SubscribeAddedOrdersRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.Order>;
    subscribeAddedOrders(request: xudrpc_pb.SubscribeAddedOrdersRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.Order>;
    subscribeRemovedOrders(request: xudrpc_pb.SubscribeRemovedOrdersRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.OrderRemoval>;
    subscribeRemovedOrders(request: xudrpc_pb.SubscribeRemovedOrdersRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.OrderRemoval>;
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
    public shutdown(request: xudrpc_pb.ShutdownRequest, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public shutdown(request: xudrpc_pb.ShutdownRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: xudrpc_pb.ShutdownResponse) => void): grpc.ClientUnaryCall;
    public genSeed(request: xudrpc_pb.GenSeedRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.GenSeedResponse) => void): grpc.ClientUnaryCall;
    public genSeed(request: xudrpc_pb.GenSeedRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.GenSeedResponse) => void): grpc.ClientUnaryCall;
    public genSeed(request: xudrpc_pb.GenSeedRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.GenSeedResponse) => void): grpc.ClientUnaryCall;
    public initWallet(request: xudrpc_pb.InitWalletRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.InitWalletResponse) => void): grpc.ClientUnaryCall;
    public initWallet(request: xudrpc_pb.InitWalletRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.InitWalletResponse) => void): grpc.ClientUnaryCall;
    public initWallet(request: xudrpc_pb.InitWalletRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.InitWalletResponse) => void): grpc.ClientUnaryCall;
    public unlockWallet(request: lndrpc_pb.UnlockWalletRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.UnlockWalletResponse) => void): grpc.ClientUnaryCall;
    public unlockWallet(request: lndrpc_pb.UnlockWalletRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.UnlockWalletResponse) => void): grpc.ClientUnaryCall;
    public unlockWallet(request: lndrpc_pb.UnlockWalletRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.UnlockWalletResponse) => void): grpc.ClientUnaryCall;
    public changePassword(request: xudrpc_pb.ChangePasswordRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    public changePassword(request: xudrpc_pb.ChangePasswordRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    public changePassword(request: xudrpc_pb.ChangePasswordRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    public walletBalance(request: xudrpc_pb.WalletBalanceRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.WalletBalanceResponse) => void): grpc.ClientUnaryCall;
    public walletBalance(request: xudrpc_pb.WalletBalanceRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.WalletBalanceResponse) => void): grpc.ClientUnaryCall;
    public walletBalance(request: xudrpc_pb.WalletBalanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.WalletBalanceResponse) => void): grpc.ClientUnaryCall;
    public getTransactions(request: xudrpc_pb.GetTransactionsRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.TransactionDetails) => void): grpc.ClientUnaryCall;
    public getTransactions(request: xudrpc_pb.GetTransactionsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.TransactionDetails) => void): grpc.ClientUnaryCall;
    public getTransactions(request: xudrpc_pb.GetTransactionsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.TransactionDetails) => void): grpc.ClientUnaryCall;
    public estimateFee(request: xudrpc_pb.EstimateFeeRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.EstimateFeeResponse) => void): grpc.ClientUnaryCall;
    public estimateFee(request: xudrpc_pb.EstimateFeeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.EstimateFeeResponse) => void): grpc.ClientUnaryCall;
    public estimateFee(request: xudrpc_pb.EstimateFeeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.EstimateFeeResponse) => void): grpc.ClientUnaryCall;
    public listUnspent(request: xudrpc_pb.ListUnspentRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.ListUnspentResponse) => void): grpc.ClientUnaryCall;
    public listUnspent(request: xudrpc_pb.ListUnspentRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.ListUnspentResponse) => void): grpc.ClientUnaryCall;
    public listUnspent(request: xudrpc_pb.ListUnspentRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.ListUnspentResponse) => void): grpc.ClientUnaryCall;
    public sendCoins(request: xudrpc_pb.SendCoinsRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.SendCoinsResponse) => void): grpc.ClientUnaryCall;
    public sendCoins(request: xudrpc_pb.SendCoinsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.SendCoinsResponse) => void): grpc.ClientUnaryCall;
    public sendCoins(request: xudrpc_pb.SendCoinsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.SendCoinsResponse) => void): grpc.ClientUnaryCall;
    public sendMany(request: xudrpc_pb.SendManyRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.SendManyResponse) => void): grpc.ClientUnaryCall;
    public sendMany(request: xudrpc_pb.SendManyRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.SendManyResponse) => void): grpc.ClientUnaryCall;
    public sendMany(request: xudrpc_pb.SendManyRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.SendManyResponse) => void): grpc.ClientUnaryCall;
    public newAddress(request: xudrpc_pb.NewAddressRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.NewAddressResponse) => void): grpc.ClientUnaryCall;
    public newAddress(request: xudrpc_pb.NewAddressRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.NewAddressResponse) => void): grpc.ClientUnaryCall;
    public newAddress(request: xudrpc_pb.NewAddressRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.NewAddressResponse) => void): grpc.ClientUnaryCall;
    public subscribeTransactions(request: lndrpc_pb.GetTransactionsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrpc_pb.Transaction>;
    public subscribeTransactions(request: lndrpc_pb.GetTransactionsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrpc_pb.Transaction>;
    public subscribeAddedOrders(request: xudrpc_pb.SubscribeAddedOrdersRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.Order>;
    public subscribeAddedOrders(request: xudrpc_pb.SubscribeAddedOrdersRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.Order>;
    public subscribeRemovedOrders(request: xudrpc_pb.SubscribeRemovedOrdersRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.OrderRemoval>;
    public subscribeRemovedOrders(request: xudrpc_pb.SubscribeRemovedOrdersRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.OrderRemoval>;
    public subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapSuccess>;
    public subscribeSwaps(request: xudrpc_pb.SubscribeSwapsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapSuccess>;
    public subscribeSwapFailures(request: xudrpc_pb.SubscribeSwapsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapFailure>;
    public subscribeSwapFailures(request: xudrpc_pb.SubscribeSwapsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<xudrpc_pb.SwapFailure>;
}
