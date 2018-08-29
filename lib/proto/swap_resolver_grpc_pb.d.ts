// package: swapresolver
// file: swap_resolver.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as swap_resolver_pb from "./swap_resolver_pb";

interface ISwapResolverService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    resolveHash: ISwapResolverService_IResolveHash;
}

interface ISwapResolverService_IResolveHash extends grpc.MethodDefinition<swap_resolver_pb.ResolveRequest, swap_resolver_pb.ResolveResponse> {
    path: string; // "/swapresolver.SwapResolver/ResolveHash"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<swap_resolver_pb.ResolveRequest>;
    requestDeserialize: grpc.deserialize<swap_resolver_pb.ResolveRequest>;
    responseSerialize: grpc.serialize<swap_resolver_pb.ResolveResponse>;
    responseDeserialize: grpc.deserialize<swap_resolver_pb.ResolveResponse>;
}

export const SwapResolverService: ISwapResolverService;

export interface ISwapResolverServer {
    resolveHash: grpc.handleUnaryCall<swap_resolver_pb.ResolveRequest, swap_resolver_pb.ResolveResponse>;
}

export interface ISwapResolverClient {
    resolveHash(request: swap_resolver_pb.ResolveRequest, callback: (error: Error | null, response: swap_resolver_pb.ResolveResponse) => void): grpc.ClientUnaryCall;
    resolveHash(request: swap_resolver_pb.ResolveRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: swap_resolver_pb.ResolveResponse) => void): grpc.ClientUnaryCall;
    resolveHash(request: swap_resolver_pb.ResolveRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: swap_resolver_pb.ResolveResponse) => void): grpc.ClientUnaryCall;
}

export class SwapResolverClient extends grpc.Client implements ISwapResolverClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public resolveHash(request: swap_resolver_pb.ResolveRequest, callback: (error: Error | null, response: swap_resolver_pb.ResolveResponse) => void): grpc.ClientUnaryCall;
    public resolveHash(request: swap_resolver_pb.ResolveRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: swap_resolver_pb.ResolveResponse) => void): grpc.ClientUnaryCall;
    public resolveHash(request: swap_resolver_pb.ResolveRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: swap_resolver_pb.ResolveResponse) => void): grpc.ClientUnaryCall;
}
