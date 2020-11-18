// package: lnrpc
// file: lndwalletunlocker.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as lndwalletunlocker_pb from "./lndwalletunlocker_pb";
import * as lndrpc_pb from "./lndrpc_pb";

interface IWalletUnlockerService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    genSeed: IWalletUnlockerService_IGenSeed;
    initWallet: IWalletUnlockerService_IInitWallet;
    unlockWallet: IWalletUnlockerService_IUnlockWallet;
    changePassword: IWalletUnlockerService_IChangePassword;
}

interface IWalletUnlockerService_IGenSeed extends grpc.MethodDefinition<lndwalletunlocker_pb.GenSeedRequest, lndwalletunlocker_pb.GenSeedResponse> {
    path: string; // "/lnrpc.WalletUnlocker/GenSeed"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<lndwalletunlocker_pb.GenSeedRequest>;
    requestDeserialize: grpc.deserialize<lndwalletunlocker_pb.GenSeedRequest>;
    responseSerialize: grpc.serialize<lndwalletunlocker_pb.GenSeedResponse>;
    responseDeserialize: grpc.deserialize<lndwalletunlocker_pb.GenSeedResponse>;
}
interface IWalletUnlockerService_IInitWallet extends grpc.MethodDefinition<lndwalletunlocker_pb.InitWalletRequest, lndwalletunlocker_pb.InitWalletResponse> {
    path: string; // "/lnrpc.WalletUnlocker/InitWallet"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<lndwalletunlocker_pb.InitWalletRequest>;
    requestDeserialize: grpc.deserialize<lndwalletunlocker_pb.InitWalletRequest>;
    responseSerialize: grpc.serialize<lndwalletunlocker_pb.InitWalletResponse>;
    responseDeserialize: grpc.deserialize<lndwalletunlocker_pb.InitWalletResponse>;
}
interface IWalletUnlockerService_IUnlockWallet extends grpc.MethodDefinition<lndwalletunlocker_pb.UnlockWalletRequest, lndwalletunlocker_pb.UnlockWalletResponse> {
    path: string; // "/lnrpc.WalletUnlocker/UnlockWallet"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<lndwalletunlocker_pb.UnlockWalletRequest>;
    requestDeserialize: grpc.deserialize<lndwalletunlocker_pb.UnlockWalletRequest>;
    responseSerialize: grpc.serialize<lndwalletunlocker_pb.UnlockWalletResponse>;
    responseDeserialize: grpc.deserialize<lndwalletunlocker_pb.UnlockWalletResponse>;
}
interface IWalletUnlockerService_IChangePassword extends grpc.MethodDefinition<lndwalletunlocker_pb.ChangePasswordRequest, lndwalletunlocker_pb.ChangePasswordResponse> {
    path: string; // "/lnrpc.WalletUnlocker/ChangePassword"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<lndwalletunlocker_pb.ChangePasswordRequest>;
    requestDeserialize: grpc.deserialize<lndwalletunlocker_pb.ChangePasswordRequest>;
    responseSerialize: grpc.serialize<lndwalletunlocker_pb.ChangePasswordResponse>;
    responseDeserialize: grpc.deserialize<lndwalletunlocker_pb.ChangePasswordResponse>;
}

export const WalletUnlockerService: IWalletUnlockerService;

export interface IWalletUnlockerServer {
    genSeed: grpc.handleUnaryCall<lndwalletunlocker_pb.GenSeedRequest, lndwalletunlocker_pb.GenSeedResponse>;
    initWallet: grpc.handleUnaryCall<lndwalletunlocker_pb.InitWalletRequest, lndwalletunlocker_pb.InitWalletResponse>;
    unlockWallet: grpc.handleUnaryCall<lndwalletunlocker_pb.UnlockWalletRequest, lndwalletunlocker_pb.UnlockWalletResponse>;
    changePassword: grpc.handleUnaryCall<lndwalletunlocker_pb.ChangePasswordRequest, lndwalletunlocker_pb.ChangePasswordResponse>;
}

export interface IWalletUnlockerClient {
    genSeed(request: lndwalletunlocker_pb.GenSeedRequest, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.GenSeedResponse) => void): grpc.ClientUnaryCall;
    genSeed(request: lndwalletunlocker_pb.GenSeedRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.GenSeedResponse) => void): grpc.ClientUnaryCall;
    genSeed(request: lndwalletunlocker_pb.GenSeedRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.GenSeedResponse) => void): grpc.ClientUnaryCall;
    initWallet(request: lndwalletunlocker_pb.InitWalletRequest, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.InitWalletResponse) => void): grpc.ClientUnaryCall;
    initWallet(request: lndwalletunlocker_pb.InitWalletRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.InitWalletResponse) => void): grpc.ClientUnaryCall;
    initWallet(request: lndwalletunlocker_pb.InitWalletRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.InitWalletResponse) => void): grpc.ClientUnaryCall;
    unlockWallet(request: lndwalletunlocker_pb.UnlockWalletRequest, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.UnlockWalletResponse) => void): grpc.ClientUnaryCall;
    unlockWallet(request: lndwalletunlocker_pb.UnlockWalletRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.UnlockWalletResponse) => void): grpc.ClientUnaryCall;
    unlockWallet(request: lndwalletunlocker_pb.UnlockWalletRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.UnlockWalletResponse) => void): grpc.ClientUnaryCall;
    changePassword(request: lndwalletunlocker_pb.ChangePasswordRequest, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    changePassword(request: lndwalletunlocker_pb.ChangePasswordRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    changePassword(request: lndwalletunlocker_pb.ChangePasswordRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
}

export class WalletUnlockerClient extends grpc.Client implements IWalletUnlockerClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public genSeed(request: lndwalletunlocker_pb.GenSeedRequest, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.GenSeedResponse) => void): grpc.ClientUnaryCall;
    public genSeed(request: lndwalletunlocker_pb.GenSeedRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.GenSeedResponse) => void): grpc.ClientUnaryCall;
    public genSeed(request: lndwalletunlocker_pb.GenSeedRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.GenSeedResponse) => void): grpc.ClientUnaryCall;
    public initWallet(request: lndwalletunlocker_pb.InitWalletRequest, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.InitWalletResponse) => void): grpc.ClientUnaryCall;
    public initWallet(request: lndwalletunlocker_pb.InitWalletRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.InitWalletResponse) => void): grpc.ClientUnaryCall;
    public initWallet(request: lndwalletunlocker_pb.InitWalletRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.InitWalletResponse) => void): grpc.ClientUnaryCall;
    public unlockWallet(request: lndwalletunlocker_pb.UnlockWalletRequest, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.UnlockWalletResponse) => void): grpc.ClientUnaryCall;
    public unlockWallet(request: lndwalletunlocker_pb.UnlockWalletRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.UnlockWalletResponse) => void): grpc.ClientUnaryCall;
    public unlockWallet(request: lndwalletunlocker_pb.UnlockWalletRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.UnlockWalletResponse) => void): grpc.ClientUnaryCall;
    public changePassword(request: lndwalletunlocker_pb.ChangePasswordRequest, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    public changePassword(request: lndwalletunlocker_pb.ChangePasswordRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
    public changePassword(request: lndwalletunlocker_pb.ChangePasswordRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndwalletunlocker_pb.ChangePasswordResponse) => void): grpc.ClientUnaryCall;
}
