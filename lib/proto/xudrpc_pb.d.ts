// package: xudrpc
// file: xudrpc.proto

/* tslint:disable */

import * as jspb from "google-protobuf";
import * as annotations_pb from "./annotations_pb";

export class AddCurrencyRequest extends jspb.Message { 
    getCurrency(): string;
    setCurrency(value: string): void;

    getSwapClient(): AddCurrencyRequest.SwapClient;
    setSwapClient(value: AddCurrencyRequest.SwapClient): void;

    getTokenAddress(): string;
    setTokenAddress(value: string): void;

    getDecimalPlaces(): number;
    setDecimalPlaces(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AddCurrencyRequest.AsObject;
    static toObject(includeInstance: boolean, msg: AddCurrencyRequest): AddCurrencyRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AddCurrencyRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AddCurrencyRequest;
    static deserializeBinaryFromReader(message: AddCurrencyRequest, reader: jspb.BinaryReader): AddCurrencyRequest;
}

export namespace AddCurrencyRequest {
    export type AsObject = {
        currency: string,
        swapClient: AddCurrencyRequest.SwapClient,
        tokenAddress: string,
        decimalPlaces: number,
    }

    export enum SwapClient {
    LND = 0,
    RAIDEN = 1,
    }

}

export class AddCurrencyResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AddCurrencyResponse.AsObject;
    static toObject(includeInstance: boolean, msg: AddCurrencyResponse): AddCurrencyResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AddCurrencyResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AddCurrencyResponse;
    static deserializeBinaryFromReader(message: AddCurrencyResponse, reader: jspb.BinaryReader): AddCurrencyResponse;
}

export namespace AddCurrencyResponse {
    export type AsObject = {
    }
}

export class AddPairRequest extends jspb.Message { 
    getBaseCurrency(): string;
    setBaseCurrency(value: string): void;

    getQuoteCurrency(): string;
    setQuoteCurrency(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AddPairRequest.AsObject;
    static toObject(includeInstance: boolean, msg: AddPairRequest): AddPairRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AddPairRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AddPairRequest;
    static deserializeBinaryFromReader(message: AddPairRequest, reader: jspb.BinaryReader): AddPairRequest;
}

export namespace AddPairRequest {
    export type AsObject = {
        baseCurrency: string,
        quoteCurrency: string,
    }
}

export class AddPairResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AddPairResponse.AsObject;
    static toObject(includeInstance: boolean, msg: AddPairResponse): AddPairResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AddPairResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AddPairResponse;
    static deserializeBinaryFromReader(message: AddPairResponse, reader: jspb.BinaryReader): AddPairResponse;
}

export namespace AddPairResponse {
    export type AsObject = {
    }
}

export class BanRequest extends jspb.Message { 
    getNodePubKey(): string;
    setNodePubKey(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BanRequest.AsObject;
    static toObject(includeInstance: boolean, msg: BanRequest): BanRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BanRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BanRequest;
    static deserializeBinaryFromReader(message: BanRequest, reader: jspb.BinaryReader): BanRequest;
}

export namespace BanRequest {
    export type AsObject = {
        nodePubKey: string,
    }
}

export class BanResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BanResponse.AsObject;
    static toObject(includeInstance: boolean, msg: BanResponse): BanResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BanResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BanResponse;
    static deserializeBinaryFromReader(message: BanResponse, reader: jspb.BinaryReader): BanResponse;
}

export namespace BanResponse {
    export type AsObject = {
    }
}

export class Chain extends jspb.Message { 
    getChain(): string;
    setChain(value: string): void;

    getNetwork(): string;
    setNetwork(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Chain.AsObject;
    static toObject(includeInstance: boolean, msg: Chain): Chain.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Chain, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Chain;
    static deserializeBinaryFromReader(message: Chain, reader: jspb.BinaryReader): Chain;
}

export namespace Chain {
    export type AsObject = {
        chain: string,
        network: string,
    }
}

export class ChannelBalance extends jspb.Message { 
    getBalance(): number;
    setBalance(value: number): void;

    getPendingOpenBalance(): number;
    setPendingOpenBalance(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ChannelBalance.AsObject;
    static toObject(includeInstance: boolean, msg: ChannelBalance): ChannelBalance.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ChannelBalance, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ChannelBalance;
    static deserializeBinaryFromReader(message: ChannelBalance, reader: jspb.BinaryReader): ChannelBalance;
}

export namespace ChannelBalance {
    export type AsObject = {
        balance: number,
        pendingOpenBalance: number,
    }
}

export class ChannelBalanceRequest extends jspb.Message { 
    getCurrency(): string;
    setCurrency(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ChannelBalanceRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ChannelBalanceRequest): ChannelBalanceRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ChannelBalanceRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ChannelBalanceRequest;
    static deserializeBinaryFromReader(message: ChannelBalanceRequest, reader: jspb.BinaryReader): ChannelBalanceRequest;
}

export namespace ChannelBalanceRequest {
    export type AsObject = {
        currency: string,
    }
}

export class ChannelBalanceResponse extends jspb.Message { 

    getBalancesMap(): jspb.Map<string, ChannelBalance>;
    clearBalancesMap(): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ChannelBalanceResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ChannelBalanceResponse): ChannelBalanceResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ChannelBalanceResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ChannelBalanceResponse;
    static deserializeBinaryFromReader(message: ChannelBalanceResponse, reader: jspb.BinaryReader): ChannelBalanceResponse;
}

export namespace ChannelBalanceResponse {
    export type AsObject = {

        balancesMap: Array<[string, ChannelBalance.AsObject]>,
    }
}

export class ConnectRequest extends jspb.Message { 
    getNodeUri(): string;
    setNodeUri(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConnectRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ConnectRequest): ConnectRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConnectRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConnectRequest;
    static deserializeBinaryFromReader(message: ConnectRequest, reader: jspb.BinaryReader): ConnectRequest;
}

export namespace ConnectRequest {
    export type AsObject = {
        nodeUri: string,
    }
}

export class ConnectResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ConnectResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ConnectResponse): ConnectResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ConnectResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ConnectResponse;
    static deserializeBinaryFromReader(message: ConnectResponse, reader: jspb.BinaryReader): ConnectResponse;
}

export namespace ConnectResponse {
    export type AsObject = {
    }
}

export class ExecuteSwapRequest extends jspb.Message { 
    getOrderId(): string;
    setOrderId(value: string): void;

    getPairId(): string;
    setPairId(value: string): void;

    getPeerPubKey(): string;
    setPeerPubKey(value: string): void;

    getQuantity(): number;
    setQuantity(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ExecuteSwapRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ExecuteSwapRequest): ExecuteSwapRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ExecuteSwapRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ExecuteSwapRequest;
    static deserializeBinaryFromReader(message: ExecuteSwapRequest, reader: jspb.BinaryReader): ExecuteSwapRequest;
}

export namespace ExecuteSwapRequest {
    export type AsObject = {
        orderId: string,
        pairId: string,
        peerPubKey: string,
        quantity: number,
    }
}

export class SwapFailure extends jspb.Message { 
    getOrderId(): string;
    setOrderId(value: string): void;

    getPairId(): string;
    setPairId(value: string): void;

    getQuantity(): number;
    setQuantity(value: number): void;

    getPeerPubKey(): string;
    setPeerPubKey(value: string): void;

    getFailureReason(): string;
    setFailureReason(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SwapFailure.AsObject;
    static toObject(includeInstance: boolean, msg: SwapFailure): SwapFailure.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SwapFailure, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SwapFailure;
    static deserializeBinaryFromReader(message: SwapFailure, reader: jspb.BinaryReader): SwapFailure;
}

export namespace SwapFailure {
    export type AsObject = {
        orderId: string,
        pairId: string,
        quantity: number,
        peerPubKey: string,
        failureReason: string,
    }
}

export class GetInfoRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetInfoRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetInfoRequest): GetInfoRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetInfoRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetInfoRequest;
    static deserializeBinaryFromReader(message: GetInfoRequest, reader: jspb.BinaryReader): GetInfoRequest;
}

export namespace GetInfoRequest {
    export type AsObject = {
    }
}

export class GetInfoResponse extends jspb.Message { 
    getVersion(): string;
    setVersion(value: string): void;

    getNodePubKey(): string;
    setNodePubKey(value: string): void;

    clearUrisList(): void;
    getUrisList(): Array<string>;
    setUrisList(value: Array<string>): void;
    addUris(value: string, index?: number): string;

    getNumPeers(): number;
    setNumPeers(value: number): void;

    getNumPairs(): number;
    setNumPairs(value: number): void;


    hasOrders(): boolean;
    clearOrders(): void;
    getOrders(): OrdersCount | undefined;
    setOrders(value?: OrdersCount): void;


    getLndMap(): jspb.Map<string, LndInfo>;
    clearLndMap(): void;


    hasRaiden(): boolean;
    clearRaiden(): void;
    getRaiden(): RaidenInfo | undefined;
    setRaiden(value?: RaidenInfo): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetInfoResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetInfoResponse): GetInfoResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetInfoResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetInfoResponse;
    static deserializeBinaryFromReader(message: GetInfoResponse, reader: jspb.BinaryReader): GetInfoResponse;
}

export namespace GetInfoResponse {
    export type AsObject = {
        version: string,
        nodePubKey: string,
        urisList: Array<string>,
        numPeers: number,
        numPairs: number,
        orders?: OrdersCount.AsObject,

        lndMap: Array<[string, LndInfo.AsObject]>,
        raiden?: RaidenInfo.AsObject,
    }
}

export class GetNodeInfoRequest extends jspb.Message { 
    getNodePubKey(): string;
    setNodePubKey(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetNodeInfoRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetNodeInfoRequest): GetNodeInfoRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetNodeInfoRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetNodeInfoRequest;
    static deserializeBinaryFromReader(message: GetNodeInfoRequest, reader: jspb.BinaryReader): GetNodeInfoRequest;
}

export namespace GetNodeInfoRequest {
    export type AsObject = {
        nodePubKey: string,
    }
}

export class GetNodeInfoResponse extends jspb.Message { 
    getReputationscore(): number;
    setReputationscore(value: number): void;

    getBanned(): boolean;
    setBanned(value: boolean): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetNodeInfoResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetNodeInfoResponse): GetNodeInfoResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetNodeInfoResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetNodeInfoResponse;
    static deserializeBinaryFromReader(message: GetNodeInfoResponse, reader: jspb.BinaryReader): GetNodeInfoResponse;
}

export namespace GetNodeInfoResponse {
    export type AsObject = {
        reputationscore: number,
        banned: boolean,
    }
}

export class ListOrdersRequest extends jspb.Message { 
    getPairId(): string;
    setPairId(value: string): void;

    getIncludeOwnOrders(): boolean;
    setIncludeOwnOrders(value: boolean): void;

    getLimit(): number;
    setLimit(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListOrdersRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListOrdersRequest): ListOrdersRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListOrdersRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListOrdersRequest;
    static deserializeBinaryFromReader(message: ListOrdersRequest, reader: jspb.BinaryReader): ListOrdersRequest;
}

export namespace ListOrdersRequest {
    export type AsObject = {
        pairId: string,
        includeOwnOrders: boolean,
        limit: number,
    }
}

export class ListOrdersResponse extends jspb.Message { 

    getOrdersMap(): jspb.Map<string, Orders>;
    clearOrdersMap(): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListOrdersResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListOrdersResponse): ListOrdersResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListOrdersResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListOrdersResponse;
    static deserializeBinaryFromReader(message: ListOrdersResponse, reader: jspb.BinaryReader): ListOrdersResponse;
}

export namespace ListOrdersResponse {
    export type AsObject = {

        ordersMap: Array<[string, Orders.AsObject]>,
    }
}

export class ListCurrenciesRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListCurrenciesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListCurrenciesRequest): ListCurrenciesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListCurrenciesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListCurrenciesRequest;
    static deserializeBinaryFromReader(message: ListCurrenciesRequest, reader: jspb.BinaryReader): ListCurrenciesRequest;
}

export namespace ListCurrenciesRequest {
    export type AsObject = {
    }
}

export class ListCurrenciesResponse extends jspb.Message { 
    clearCurrenciesList(): void;
    getCurrenciesList(): Array<string>;
    setCurrenciesList(value: Array<string>): void;
    addCurrencies(value: string, index?: number): string;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListCurrenciesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListCurrenciesResponse): ListCurrenciesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListCurrenciesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListCurrenciesResponse;
    static deserializeBinaryFromReader(message: ListCurrenciesResponse, reader: jspb.BinaryReader): ListCurrenciesResponse;
}

export namespace ListCurrenciesResponse {
    export type AsObject = {
        currenciesList: Array<string>,
    }
}

export class ListPairsRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListPairsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListPairsRequest): ListPairsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListPairsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListPairsRequest;
    static deserializeBinaryFromReader(message: ListPairsRequest, reader: jspb.BinaryReader): ListPairsRequest;
}

export namespace ListPairsRequest {
    export type AsObject = {
    }
}

export class ListPairsResponse extends jspb.Message { 
    clearPairsList(): void;
    getPairsList(): Array<string>;
    setPairsList(value: Array<string>): void;
    addPairs(value: string, index?: number): string;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListPairsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListPairsResponse): ListPairsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListPairsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListPairsResponse;
    static deserializeBinaryFromReader(message: ListPairsResponse, reader: jspb.BinaryReader): ListPairsResponse;
}

export namespace ListPairsResponse {
    export type AsObject = {
        pairsList: Array<string>,
    }
}

export class ListPeersRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListPeersRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListPeersRequest): ListPeersRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListPeersRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListPeersRequest;
    static deserializeBinaryFromReader(message: ListPeersRequest, reader: jspb.BinaryReader): ListPeersRequest;
}

export namespace ListPeersRequest {
    export type AsObject = {
    }
}

export class ListPeersResponse extends jspb.Message { 
    clearPeersList(): void;
    getPeersList(): Array<Peer>;
    setPeersList(value: Array<Peer>): void;
    addPeers(value?: Peer, index?: number): Peer;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListPeersResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListPeersResponse): ListPeersResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListPeersResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListPeersResponse;
    static deserializeBinaryFromReader(message: ListPeersResponse, reader: jspb.BinaryReader): ListPeersResponse;
}

export namespace ListPeersResponse {
    export type AsObject = {
        peersList: Array<Peer.AsObject>,
    }
}

export class LndChannels extends jspb.Message { 
    getActive(): number;
    setActive(value: number): void;

    getInactive(): number;
    setInactive(value: number): void;

    getPending(): number;
    setPending(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LndChannels.AsObject;
    static toObject(includeInstance: boolean, msg: LndChannels): LndChannels.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LndChannels, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LndChannels;
    static deserializeBinaryFromReader(message: LndChannels, reader: jspb.BinaryReader): LndChannels;
}

export namespace LndChannels {
    export type AsObject = {
        active: number,
        inactive: number,
        pending: number,
    }
}

export class LndInfo extends jspb.Message { 
    getError(): string;
    setError(value: string): void;


    hasChannels(): boolean;
    clearChannels(): void;
    getChannels(): LndChannels | undefined;
    setChannels(value?: LndChannels): void;

    clearChainsList(): void;
    getChainsList(): Array<Chain>;
    setChainsList(value: Array<Chain>): void;
    addChains(value?: Chain, index?: number): Chain;

    getBlockheight(): number;
    setBlockheight(value: number): void;

    clearUrisList(): void;
    getUrisList(): Array<string>;
    setUrisList(value: Array<string>): void;
    addUris(value: string, index?: number): string;

    getVersion(): string;
    setVersion(value: string): void;

    getAlias(): string;
    setAlias(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LndInfo.AsObject;
    static toObject(includeInstance: boolean, msg: LndInfo): LndInfo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LndInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LndInfo;
    static deserializeBinaryFromReader(message: LndInfo, reader: jspb.BinaryReader): LndInfo;
}

export namespace LndInfo {
    export type AsObject = {
        error: string,
        channels?: LndChannels.AsObject,
        chainsList: Array<Chain.AsObject>,
        blockheight: number,
        urisList: Array<string>,
        version: string,
        alias: string,
    }
}

export class Order extends jspb.Message { 
    getPrice(): number;
    setPrice(value: number): void;

    getQuantity(): number;
    setQuantity(value: number): void;

    getPairId(): string;
    setPairId(value: string): void;

    getId(): string;
    setId(value: string): void;


    hasPeerPubKey(): boolean;
    clearPeerPubKey(): void;
    getPeerPubKey(): string;
    setPeerPubKey(value: string): void;


    hasLocalId(): boolean;
    clearLocalId(): void;
    getLocalId(): string;
    setLocalId(value: string): void;

    getCreatedAt(): number;
    setCreatedAt(value: number): void;

    getSide(): OrderSide;
    setSide(value: OrderSide): void;

    getIsOwnOrder(): boolean;
    setIsOwnOrder(value: boolean): void;

    getHold(): number;
    setHold(value: number): void;


    getOwnOrPeerCase(): Order.OwnOrPeerCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Order.AsObject;
    static toObject(includeInstance: boolean, msg: Order): Order.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Order, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Order;
    static deserializeBinaryFromReader(message: Order, reader: jspb.BinaryReader): Order;
}

export namespace Order {
    export type AsObject = {
        price: number,
        quantity: number,
        pairId: string,
        id: string,
        peerPubKey: string,
        localId: string,
        createdAt: number,
        side: OrderSide,
        isOwnOrder: boolean,
        hold: number,
    }

    export enum OwnOrPeerCase {
        OWNORPEER_NOT_SET = 0,
    
    PEER_PUB_KEY = 5,

    LOCAL_ID = 6,

    }

}

export class OrderUpdate extends jspb.Message { 

    hasOrder(): boolean;
    clearOrder(): void;
    getOrder(): Order | undefined;
    setOrder(value?: Order): void;


    hasOrderRemoval(): boolean;
    clearOrderRemoval(): void;
    getOrderRemoval(): OrderRemoval | undefined;
    setOrderRemoval(value?: OrderRemoval): void;


    getOrderUpdateCase(): OrderUpdate.OrderUpdateCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrderUpdate.AsObject;
    static toObject(includeInstance: boolean, msg: OrderUpdate): OrderUpdate.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OrderUpdate, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrderUpdate;
    static deserializeBinaryFromReader(message: OrderUpdate, reader: jspb.BinaryReader): OrderUpdate;
}

export namespace OrderUpdate {
    export type AsObject = {
        order?: Order.AsObject,
        orderRemoval?: OrderRemoval.AsObject,
    }

    export enum OrderUpdateCase {
        ORDERUPDATE_NOT_SET = 0,
    
    ORDER = 1,

    ORDER_REMOVAL = 2,

    }

}

export class OrderRemoval extends jspb.Message { 
    getQuantity(): number;
    setQuantity(value: number): void;

    getPairId(): string;
    setPairId(value: string): void;

    getOrderId(): string;
    setOrderId(value: string): void;

    getLocalId(): string;
    setLocalId(value: string): void;

    getIsOwnOrder(): boolean;
    setIsOwnOrder(value: boolean): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrderRemoval.AsObject;
    static toObject(includeInstance: boolean, msg: OrderRemoval): OrderRemoval.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OrderRemoval, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrderRemoval;
    static deserializeBinaryFromReader(message: OrderRemoval, reader: jspb.BinaryReader): OrderRemoval;
}

export namespace OrderRemoval {
    export type AsObject = {
        quantity: number,
        pairId: string,
        orderId: string,
        localId: string,
        isOwnOrder: boolean,
    }
}

export class Orders extends jspb.Message { 
    clearBuyOrdersList(): void;
    getBuyOrdersList(): Array<Order>;
    setBuyOrdersList(value: Array<Order>): void;
    addBuyOrders(value?: Order, index?: number): Order;

    clearSellOrdersList(): void;
    getSellOrdersList(): Array<Order>;
    setSellOrdersList(value: Array<Order>): void;
    addSellOrders(value?: Order, index?: number): Order;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Orders.AsObject;
    static toObject(includeInstance: boolean, msg: Orders): Orders.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Orders, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Orders;
    static deserializeBinaryFromReader(message: Orders, reader: jspb.BinaryReader): Orders;
}

export namespace Orders {
    export type AsObject = {
        buyOrdersList: Array<Order.AsObject>,
        sellOrdersList: Array<Order.AsObject>,
    }
}

export class OrdersCount extends jspb.Message { 
    getPeer(): number;
    setPeer(value: number): void;

    getOwn(): number;
    setOwn(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrdersCount.AsObject;
    static toObject(includeInstance: boolean, msg: OrdersCount): OrdersCount.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OrdersCount, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrdersCount;
    static deserializeBinaryFromReader(message: OrdersCount, reader: jspb.BinaryReader): OrdersCount;
}

export namespace OrdersCount {
    export type AsObject = {
        peer: number,
        own: number,
    }
}

export class Peer extends jspb.Message { 
    getAddress(): string;
    setAddress(value: string): void;

    getNodePubKey(): string;
    setNodePubKey(value: string): void;


    getLndPubKeysMap(): jspb.Map<string, string>;
    clearLndPubKeysMap(): void;

    getInbound(): boolean;
    setInbound(value: boolean): void;

    clearPairsList(): void;
    getPairsList(): Array<string>;
    setPairsList(value: Array<string>): void;
    addPairs(value: string, index?: number): string;

    getXudVersion(): string;
    setXudVersion(value: string): void;

    getSecondsConnected(): number;
    setSecondsConnected(value: number): void;

    getRaidenAddress(): string;
    setRaidenAddress(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Peer.AsObject;
    static toObject(includeInstance: boolean, msg: Peer): Peer.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Peer, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Peer;
    static deserializeBinaryFromReader(message: Peer, reader: jspb.BinaryReader): Peer;
}

export namespace Peer {
    export type AsObject = {
        address: string,
        nodePubKey: string,

        lndPubKeysMap: Array<[string, string]>,
        inbound: boolean,
        pairsList: Array<string>,
        xudVersion: string,
        secondsConnected: number,
        raidenAddress: string,
    }
}

export class PlaceOrderRequest extends jspb.Message { 
    getPrice(): number;
    setPrice(value: number): void;

    getQuantity(): number;
    setQuantity(value: number): void;

    getPairId(): string;
    setPairId(value: string): void;

    getOrderId(): string;
    setOrderId(value: string): void;

    getSide(): OrderSide;
    setSide(value: OrderSide): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PlaceOrderRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PlaceOrderRequest): PlaceOrderRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PlaceOrderRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PlaceOrderRequest;
    static deserializeBinaryFromReader(message: PlaceOrderRequest, reader: jspb.BinaryReader): PlaceOrderRequest;
}

export namespace PlaceOrderRequest {
    export type AsObject = {
        price: number,
        quantity: number,
        pairId: string,
        orderId: string,
        side: OrderSide,
    }
}

export class PlaceOrderResponse extends jspb.Message { 
    clearInternalMatchesList(): void;
    getInternalMatchesList(): Array<Order>;
    setInternalMatchesList(value: Array<Order>): void;
    addInternalMatches(value?: Order, index?: number): Order;

    clearSwapSuccessesList(): void;
    getSwapSuccessesList(): Array<SwapSuccess>;
    setSwapSuccessesList(value: Array<SwapSuccess>): void;
    addSwapSuccesses(value?: SwapSuccess, index?: number): SwapSuccess;


    hasRemainingOrder(): boolean;
    clearRemainingOrder(): void;
    getRemainingOrder(): Order | undefined;
    setRemainingOrder(value?: Order): void;

    clearSwapFailuresList(): void;
    getSwapFailuresList(): Array<SwapFailure>;
    setSwapFailuresList(value: Array<SwapFailure>): void;
    addSwapFailures(value?: SwapFailure, index?: number): SwapFailure;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PlaceOrderResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PlaceOrderResponse): PlaceOrderResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PlaceOrderResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PlaceOrderResponse;
    static deserializeBinaryFromReader(message: PlaceOrderResponse, reader: jspb.BinaryReader): PlaceOrderResponse;
}

export namespace PlaceOrderResponse {
    export type AsObject = {
        internalMatchesList: Array<Order.AsObject>,
        swapSuccessesList: Array<SwapSuccess.AsObject>,
        remainingOrder?: Order.AsObject,
        swapFailuresList: Array<SwapFailure.AsObject>,
    }
}

export class PlaceOrderEvent extends jspb.Message { 

    hasInternalMatch(): boolean;
    clearInternalMatch(): void;
    getInternalMatch(): Order | undefined;
    setInternalMatch(value?: Order): void;


    hasSwapSuccess(): boolean;
    clearSwapSuccess(): void;
    getSwapSuccess(): SwapSuccess | undefined;
    setSwapSuccess(value?: SwapSuccess): void;


    hasRemainingOrder(): boolean;
    clearRemainingOrder(): void;
    getRemainingOrder(): Order | undefined;
    setRemainingOrder(value?: Order): void;


    hasSwapFailure(): boolean;
    clearSwapFailure(): void;
    getSwapFailure(): SwapFailure | undefined;
    setSwapFailure(value?: SwapFailure): void;


    getEventCase(): PlaceOrderEvent.EventCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PlaceOrderEvent.AsObject;
    static toObject(includeInstance: boolean, msg: PlaceOrderEvent): PlaceOrderEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PlaceOrderEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PlaceOrderEvent;
    static deserializeBinaryFromReader(message: PlaceOrderEvent, reader: jspb.BinaryReader): PlaceOrderEvent;
}

export namespace PlaceOrderEvent {
    export type AsObject = {
        internalMatch?: Order.AsObject,
        swapSuccess?: SwapSuccess.AsObject,
        remainingOrder?: Order.AsObject,
        swapFailure?: SwapFailure.AsObject,
    }

    export enum EventCase {
        EVENT_NOT_SET = 0,
    
    INTERNAL_MATCH = 1,

    SWAP_SUCCESS = 2,

    REMAINING_ORDER = 3,

    SWAP_FAILURE = 4,

    }

}

export class RaidenInfo extends jspb.Message { 
    getError(): string;
    setError(value: string): void;

    getAddress(): string;
    setAddress(value: string): void;

    getChannels(): number;
    setChannels(value: number): void;

    getVersion(): string;
    setVersion(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RaidenInfo.AsObject;
    static toObject(includeInstance: boolean, msg: RaidenInfo): RaidenInfo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RaidenInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RaidenInfo;
    static deserializeBinaryFromReader(message: RaidenInfo, reader: jspb.BinaryReader): RaidenInfo;
}

export namespace RaidenInfo {
    export type AsObject = {
        error: string,
        address: string,
        channels: number,
        version: string,
    }
}

export class RemoveCurrencyRequest extends jspb.Message { 
    getCurrency(): string;
    setCurrency(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RemoveCurrencyRequest.AsObject;
    static toObject(includeInstance: boolean, msg: RemoveCurrencyRequest): RemoveCurrencyRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RemoveCurrencyRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RemoveCurrencyRequest;
    static deserializeBinaryFromReader(message: RemoveCurrencyRequest, reader: jspb.BinaryReader): RemoveCurrencyRequest;
}

export namespace RemoveCurrencyRequest {
    export type AsObject = {
        currency: string,
    }
}

export class RemoveCurrencyResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RemoveCurrencyResponse.AsObject;
    static toObject(includeInstance: boolean, msg: RemoveCurrencyResponse): RemoveCurrencyResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RemoveCurrencyResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RemoveCurrencyResponse;
    static deserializeBinaryFromReader(message: RemoveCurrencyResponse, reader: jspb.BinaryReader): RemoveCurrencyResponse;
}

export namespace RemoveCurrencyResponse {
    export type AsObject = {
    }
}

export class RemoveOrderRequest extends jspb.Message { 
    getOrderId(): string;
    setOrderId(value: string): void;

    getQuantity(): number;
    setQuantity(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RemoveOrderRequest.AsObject;
    static toObject(includeInstance: boolean, msg: RemoveOrderRequest): RemoveOrderRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RemoveOrderRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RemoveOrderRequest;
    static deserializeBinaryFromReader(message: RemoveOrderRequest, reader: jspb.BinaryReader): RemoveOrderRequest;
}

export namespace RemoveOrderRequest {
    export type AsObject = {
        orderId: string,
        quantity: number,
    }
}

export class RemoveOrderResponse extends jspb.Message { 
    getQuantityOnHold(): number;
    setQuantityOnHold(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RemoveOrderResponse.AsObject;
    static toObject(includeInstance: boolean, msg: RemoveOrderResponse): RemoveOrderResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RemoveOrderResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RemoveOrderResponse;
    static deserializeBinaryFromReader(message: RemoveOrderResponse, reader: jspb.BinaryReader): RemoveOrderResponse;
}

export namespace RemoveOrderResponse {
    export type AsObject = {
        quantityOnHold: number,
    }
}

export class RemovePairRequest extends jspb.Message { 
    getPairId(): string;
    setPairId(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RemovePairRequest.AsObject;
    static toObject(includeInstance: boolean, msg: RemovePairRequest): RemovePairRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RemovePairRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RemovePairRequest;
    static deserializeBinaryFromReader(message: RemovePairRequest, reader: jspb.BinaryReader): RemovePairRequest;
}

export namespace RemovePairRequest {
    export type AsObject = {
        pairId: string,
    }
}

export class RemovePairResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RemovePairResponse.AsObject;
    static toObject(includeInstance: boolean, msg: RemovePairResponse): RemovePairResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RemovePairResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RemovePairResponse;
    static deserializeBinaryFromReader(message: RemovePairResponse, reader: jspb.BinaryReader): RemovePairResponse;
}

export namespace RemovePairResponse {
    export type AsObject = {
    }
}

export class ShutdownRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ShutdownRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ShutdownRequest): ShutdownRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ShutdownRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ShutdownRequest;
    static deserializeBinaryFromReader(message: ShutdownRequest, reader: jspb.BinaryReader): ShutdownRequest;
}

export namespace ShutdownRequest {
    export type AsObject = {
    }
}

export class ShutdownResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ShutdownResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ShutdownResponse): ShutdownResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ShutdownResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ShutdownResponse;
    static deserializeBinaryFromReader(message: ShutdownResponse, reader: jspb.BinaryReader): ShutdownResponse;
}

export namespace ShutdownResponse {
    export type AsObject = {
    }
}

export class SubscribeOrdersRequest extends jspb.Message { 
    getExisting(): boolean;
    setExisting(value: boolean): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribeOrdersRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribeOrdersRequest): SubscribeOrdersRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribeOrdersRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribeOrdersRequest;
    static deserializeBinaryFromReader(message: SubscribeOrdersRequest, reader: jspb.BinaryReader): SubscribeOrdersRequest;
}

export namespace SubscribeOrdersRequest {
    export type AsObject = {
        existing: boolean,
    }
}

export class SubscribeSwapsRequest extends jspb.Message { 
    getIncludeTaker(): boolean;
    setIncludeTaker(value: boolean): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribeSwapsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribeSwapsRequest): SubscribeSwapsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribeSwapsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribeSwapsRequest;
    static deserializeBinaryFromReader(message: SubscribeSwapsRequest, reader: jspb.BinaryReader): SubscribeSwapsRequest;
}

export namespace SubscribeSwapsRequest {
    export type AsObject = {
        includeTaker: boolean,
    }
}

export class SwapSuccess extends jspb.Message { 
    getOrderId(): string;
    setOrderId(value: string): void;

    getLocalId(): string;
    setLocalId(value: string): void;

    getPairId(): string;
    setPairId(value: string): void;

    getQuantity(): number;
    setQuantity(value: number): void;

    getRHash(): string;
    setRHash(value: string): void;

    getAmountReceived(): number;
    setAmountReceived(value: number): void;

    getAmountSent(): number;
    setAmountSent(value: number): void;

    getPeerPubKey(): string;
    setPeerPubKey(value: string): void;

    getRole(): SwapSuccess.Role;
    setRole(value: SwapSuccess.Role): void;

    getCurrencyReceived(): string;
    setCurrencyReceived(value: string): void;

    getCurrencySent(): string;
    setCurrencySent(value: string): void;

    getRPreimage(): string;
    setRPreimage(value: string): void;

    getPrice(): number;
    setPrice(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SwapSuccess.AsObject;
    static toObject(includeInstance: boolean, msg: SwapSuccess): SwapSuccess.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SwapSuccess, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SwapSuccess;
    static deserializeBinaryFromReader(message: SwapSuccess, reader: jspb.BinaryReader): SwapSuccess;
}

export namespace SwapSuccess {
    export type AsObject = {
        orderId: string,
        localId: string,
        pairId: string,
        quantity: number,
        rHash: string,
        amountReceived: number,
        amountSent: number,
        peerPubKey: string,
        role: SwapSuccess.Role,
        currencyReceived: string,
        currencySent: string,
        rPreimage: string,
        price: number,
    }

    export enum Role {
    TAKER = 0,
    MAKER = 1,
    }

}

export class UnbanRequest extends jspb.Message { 
    getNodePubKey(): string;
    setNodePubKey(value: string): void;

    getReconnect(): boolean;
    setReconnect(value: boolean): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UnbanRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UnbanRequest): UnbanRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UnbanRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UnbanRequest;
    static deserializeBinaryFromReader(message: UnbanRequest, reader: jspb.BinaryReader): UnbanRequest;
}

export namespace UnbanRequest {
    export type AsObject = {
        nodePubKey: string,
        reconnect: boolean,
    }
}

export class UnbanResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UnbanResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UnbanResponse): UnbanResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UnbanResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UnbanResponse;
    static deserializeBinaryFromReader(message: UnbanResponse, reader: jspb.BinaryReader): UnbanResponse;
}

export namespace UnbanResponse {
    export type AsObject = {
    }
}

export enum OrderSide {
    BUY = 0,
    SELL = 1,
}
