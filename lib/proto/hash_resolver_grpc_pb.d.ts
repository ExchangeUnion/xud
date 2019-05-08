// package: hashresolver
// file: hash_resolver.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as hash_resolver_pb from "./hash_resolver_pb";

interface IHashResolverService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    resolveHash: IHashResolverService_IResolveHash;
}

interface IHashResolverService_IResolveHash extends grpc.MethodDefinition<hash_resolver_pb.ResolveRequest, hash_resolver_pb.ResolveResponse> {
    path: string; // "/hashresolver.HashResolver/ResolveHash"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<hash_resolver_pb.ResolveRequest>;
    requestDeserialize: grpc.deserialize<hash_resolver_pb.ResolveRequest>;
    responseSerialize: grpc.serialize<hash_resolver_pb.ResolveResponse>;
    responseDeserialize: grpc.deserialize<hash_resolver_pb.ResolveResponse>;
}

export const HashResolverService: IHashResolverService;

export interface IHashResolverServer {
    resolveHash: grpc.handleUnaryCall<hash_resolver_pb.ResolveRequest, hash_resolver_pb.ResolveResponse>;
}

export interface IHashResolverClient {
    resolveHash(request: hash_resolver_pb.ResolveRequest, callback: (error: grpc.ServiceError | null, response: hash_resolver_pb.ResolveResponse) => void): grpc.ClientUnaryCall;
    resolveHash(request: hash_resolver_pb.ResolveRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: hash_resolver_pb.ResolveResponse) => void): grpc.ClientUnaryCall;
    resolveHash(request: hash_resolver_pb.ResolveRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: hash_resolver_pb.ResolveResponse) => void): grpc.ClientUnaryCall;
}

export class HashResolverClient extends grpc.Client implements IHashResolverClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public resolveHash(request: hash_resolver_pb.ResolveRequest, callback: (error: grpc.ServiceError | null, response: hash_resolver_pb.ResolveResponse) => void): grpc.ClientUnaryCall;
    public resolveHash(request: hash_resolver_pb.ResolveRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: hash_resolver_pb.ResolveResponse) => void): grpc.ClientUnaryCall;
    public resolveHash(request: hash_resolver_pb.ResolveRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: hash_resolver_pb.ResolveResponse) => void): grpc.ClientUnaryCall;
}
