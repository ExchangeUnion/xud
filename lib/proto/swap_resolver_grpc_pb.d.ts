// package: swapresolver
// file: swap_resolver.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as swap_resolver_pb from "./swap_resolver_pb";

interface ISwapResolverService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    resolveHash: ISwapResolverService_IResolveHash;
}

interface ISwapResolverService_IResolveHash extends grpc.MethodDefinition<swap_resolver_pb.ResolveReq, swap_resolver_pb.ResolveResp> {
    path: string; // "/swapresolver.SwapResolver/ResolveHash"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<swap_resolver_pb.ResolveReq>;
    requestDeserialize: grpc.deserialize<swap_resolver_pb.ResolveReq>;
    responseSerialize: grpc.serialize<swap_resolver_pb.ResolveResp>;
    responseDeserialize: grpc.deserialize<swap_resolver_pb.ResolveResp>;
}

export const SwapResolverService: ISwapResolverService;

export interface ISwapResolverServer {
    resolveHash: grpc.handleUnaryCall<swap_resolver_pb.ResolveReq, swap_resolver_pb.ResolveResp>;
}

export interface ISwapResolverClient {
    resolveHash(request: swap_resolver_pb.ResolveReq, callback: (error: Error | null, response: swap_resolver_pb.ResolveResp) => void): grpc.ClientUnaryCall;
    resolveHash(request: swap_resolver_pb.ResolveReq, metadata: grpc.Metadata, callback: (error: Error | null, response: swap_resolver_pb.ResolveResp) => void): grpc.ClientUnaryCall;
    resolveHash(request: swap_resolver_pb.ResolveReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: swap_resolver_pb.ResolveResp) => void): grpc.ClientUnaryCall;
}

export class SwapResolverClient extends grpc.Client implements ISwapResolverClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public resolveHash(request: swap_resolver_pb.ResolveReq, callback: (error: Error | null, response: swap_resolver_pb.ResolveResp) => void): grpc.ClientUnaryCall;
    public resolveHash(request: swap_resolver_pb.ResolveReq, metadata: grpc.Metadata, callback: (error: Error | null, response: swap_resolver_pb.ResolveResp) => void): grpc.ClientUnaryCall;
    public resolveHash(request: swap_resolver_pb.ResolveReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: swap_resolver_pb.ResolveResp) => void): grpc.ClientUnaryCall;
}

interface IP2PService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    takeOrder: IP2PService_ITakeOrder;
    suggestDeal: IP2PService_ISuggestDeal;
    swap: IP2PService_ISwap;
}

interface IP2PService_ITakeOrder extends grpc.MethodDefinition<swap_resolver_pb.TakeOrderReq, swap_resolver_pb.TakeOrderResp> {
    path: string; // "/swapresolver.P2P/TakeOrder"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<swap_resolver_pb.TakeOrderReq>;
    requestDeserialize: grpc.deserialize<swap_resolver_pb.TakeOrderReq>;
    responseSerialize: grpc.serialize<swap_resolver_pb.TakeOrderResp>;
    responseDeserialize: grpc.deserialize<swap_resolver_pb.TakeOrderResp>;
}
interface IP2PService_ISuggestDeal extends grpc.MethodDefinition<swap_resolver_pb.SuggestDealReq, swap_resolver_pb.SuggestDealResp> {
    path: string; // "/swapresolver.P2P/SuggestDeal"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<swap_resolver_pb.SuggestDealReq>;
    requestDeserialize: grpc.deserialize<swap_resolver_pb.SuggestDealReq>;
    responseSerialize: grpc.serialize<swap_resolver_pb.SuggestDealResp>;
    responseDeserialize: grpc.deserialize<swap_resolver_pb.SuggestDealResp>;
}
interface IP2PService_ISwap extends grpc.MethodDefinition<swap_resolver_pb.SwapReq, swap_resolver_pb.SwapResp> {
    path: string; // "/swapresolver.P2P/Swap"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<swap_resolver_pb.SwapReq>;
    requestDeserialize: grpc.deserialize<swap_resolver_pb.SwapReq>;
    responseSerialize: grpc.serialize<swap_resolver_pb.SwapResp>;
    responseDeserialize: grpc.deserialize<swap_resolver_pb.SwapResp>;
}

export const P2PService: IP2PService;

export interface IP2PServer {
    takeOrder: grpc.handleUnaryCall<swap_resolver_pb.TakeOrderReq, swap_resolver_pb.TakeOrderResp>;
    suggestDeal: grpc.handleUnaryCall<swap_resolver_pb.SuggestDealReq, swap_resolver_pb.SuggestDealResp>;
    swap: grpc.handleUnaryCall<swap_resolver_pb.SwapReq, swap_resolver_pb.SwapResp>;
}

export interface IP2PClient {
    takeOrder(request: swap_resolver_pb.TakeOrderReq, callback: (error: Error | null, response: swap_resolver_pb.TakeOrderResp) => void): grpc.ClientUnaryCall;
    takeOrder(request: swap_resolver_pb.TakeOrderReq, metadata: grpc.Metadata, callback: (error: Error | null, response: swap_resolver_pb.TakeOrderResp) => void): grpc.ClientUnaryCall;
    takeOrder(request: swap_resolver_pb.TakeOrderReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: swap_resolver_pb.TakeOrderResp) => void): grpc.ClientUnaryCall;
    suggestDeal(request: swap_resolver_pb.SuggestDealReq, callback: (error: Error | null, response: swap_resolver_pb.SuggestDealResp) => void): grpc.ClientUnaryCall;
    suggestDeal(request: swap_resolver_pb.SuggestDealReq, metadata: grpc.Metadata, callback: (error: Error | null, response: swap_resolver_pb.SuggestDealResp) => void): grpc.ClientUnaryCall;
    suggestDeal(request: swap_resolver_pb.SuggestDealReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: swap_resolver_pb.SuggestDealResp) => void): grpc.ClientUnaryCall;
    swap(request: swap_resolver_pb.SwapReq, callback: (error: Error | null, response: swap_resolver_pb.SwapResp) => void): grpc.ClientUnaryCall;
    swap(request: swap_resolver_pb.SwapReq, metadata: grpc.Metadata, callback: (error: Error | null, response: swap_resolver_pb.SwapResp) => void): grpc.ClientUnaryCall;
    swap(request: swap_resolver_pb.SwapReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: swap_resolver_pb.SwapResp) => void): grpc.ClientUnaryCall;
}

export class P2PClient extends grpc.Client implements IP2PClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public takeOrder(request: swap_resolver_pb.TakeOrderReq, callback: (error: Error | null, response: swap_resolver_pb.TakeOrderResp) => void): grpc.ClientUnaryCall;
    public takeOrder(request: swap_resolver_pb.TakeOrderReq, metadata: grpc.Metadata, callback: (error: Error | null, response: swap_resolver_pb.TakeOrderResp) => void): grpc.ClientUnaryCall;
    public takeOrder(request: swap_resolver_pb.TakeOrderReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: swap_resolver_pb.TakeOrderResp) => void): grpc.ClientUnaryCall;
    public suggestDeal(request: swap_resolver_pb.SuggestDealReq, callback: (error: Error | null, response: swap_resolver_pb.SuggestDealResp) => void): grpc.ClientUnaryCall;
    public suggestDeal(request: swap_resolver_pb.SuggestDealReq, metadata: grpc.Metadata, callback: (error: Error | null, response: swap_resolver_pb.SuggestDealResp) => void): grpc.ClientUnaryCall;
    public suggestDeal(request: swap_resolver_pb.SuggestDealReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: swap_resolver_pb.SuggestDealResp) => void): grpc.ClientUnaryCall;
    public swap(request: swap_resolver_pb.SwapReq, callback: (error: Error | null, response: swap_resolver_pb.SwapResp) => void): grpc.ClientUnaryCall;
    public swap(request: swap_resolver_pb.SwapReq, metadata: grpc.Metadata, callback: (error: Error | null, response: swap_resolver_pb.SwapResp) => void): grpc.ClientUnaryCall;
    public swap(request: swap_resolver_pb.SwapReq, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: swap_resolver_pb.SwapResp) => void): grpc.ClientUnaryCall;
}
