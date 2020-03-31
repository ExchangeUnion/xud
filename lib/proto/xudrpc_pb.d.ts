// package: xudrpc
// file: xudrpc.proto

/* tslint:disable */

import * as jspb from "google-protobuf";
import * as annotations_pb from "./annotations_pb";

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

export class Balance extends jspb.Message { 
    getTotalBalance(): number;
    setTotalBalance(value: number): void;

    getChannelBalance(): number;
    setChannelBalance(value: number): void;

    getPendingChannelBalance(): number;
    setPendingChannelBalance(value: number): void;

    getInactiveChannelBalance(): number;
    setInactiveChannelBalance(value: number): void;

    getWalletBalance(): number;
    setWalletBalance(value: number): void;

    getUnconfirmedWalletBalance(): number;
    setUnconfirmedWalletBalance(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Balance.AsObject;
    static toObject(includeInstance: boolean, msg: Balance): Balance.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Balance, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Balance;
    static deserializeBinaryFromReader(message: Balance, reader: jspb.BinaryReader): Balance;
}

export namespace Balance {
    export type AsObject = {
        totalBalance: number,
        channelBalance: number,
        pendingChannelBalance: number,
        inactiveChannelBalance: number,
        walletBalance: number,
        unconfirmedWalletBalance: number,
    }
}

export class BanRequest extends jspb.Message { 
    getNodeIdentifier(): string;
    setNodeIdentifier(value: string): void;


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
        nodeIdentifier: string,
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

export class Channels extends jspb.Message { 
    getActive(): number;
    setActive(value: number): void;

    getInactive(): number;
    setInactive(value: number): void;

    getPending(): number;
    setPending(value: number): void;

    getClosed(): number;
    setClosed(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Channels.AsObject;
    static toObject(includeInstance: boolean, msg: Channels): Channels.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Channels, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Channels;
    static deserializeBinaryFromReader(message: Channels, reader: jspb.BinaryReader): Channels;
}

export namespace Channels {
    export type AsObject = {
        active: number,
        inactive: number,
        pending: number,
        closed: number,
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

export class CreateNodeRequest extends jspb.Message { 
    getPassword(): string;
    setPassword(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateNodeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateNodeRequest): CreateNodeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateNodeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateNodeRequest;
    static deserializeBinaryFromReader(message: CreateNodeRequest, reader: jspb.BinaryReader): CreateNodeRequest;
}

export namespace CreateNodeRequest {
    export type AsObject = {
        password: string,
    }
}

export class CreateNodeResponse extends jspb.Message { 
    clearSeedMnemonicList(): void;
    getSeedMnemonicList(): Array<string>;
    setSeedMnemonicList(value: Array<string>): void;
    addSeedMnemonic(value: string, index?: number): string;

    clearInitializedLndsList(): void;
    getInitializedLndsList(): Array<string>;
    setInitializedLndsList(value: Array<string>): void;
    addInitializedLnds(value: string, index?: number): string;

    getInitializedRaiden(): boolean;
    setInitializedRaiden(value: boolean): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateNodeResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CreateNodeResponse): CreateNodeResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateNodeResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateNodeResponse;
    static deserializeBinaryFromReader(message: CreateNodeResponse, reader: jspb.BinaryReader): CreateNodeResponse;
}

export namespace CreateNodeResponse {
    export type AsObject = {
        seedMnemonicList: Array<string>,
        initializedLndsList: Array<string>,
        initializedRaiden: boolean,
    }
}

export class Currency extends jspb.Message { 
    getCurrency(): string;
    setCurrency(value: string): void;

    getSwapClient(): Currency.SwapClient;
    setSwapClient(value: Currency.SwapClient): void;

    getTokenAddress(): string;
    setTokenAddress(value: string): void;

    getDecimalPlaces(): number;
    setDecimalPlaces(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Currency.AsObject;
    static toObject(includeInstance: boolean, msg: Currency): Currency.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Currency, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Currency;
    static deserializeBinaryFromReader(message: Currency, reader: jspb.BinaryReader): Currency;
}

export namespace Currency {
    export type AsObject = {
        currency: string,
        swapClient: Currency.SwapClient,
        tokenAddress: string,
        decimalPlaces: number,
    }

    export enum SwapClient {
    LND = 0,
    RAIDEN = 1,
    }

}

export class DiscoverNodesRequest extends jspb.Message { 
    getNodeIdentifier(): string;
    setNodeIdentifier(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DiscoverNodesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DiscoverNodesRequest): DiscoverNodesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DiscoverNodesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DiscoverNodesRequest;
    static deserializeBinaryFromReader(message: DiscoverNodesRequest, reader: jspb.BinaryReader): DiscoverNodesRequest;
}

export namespace DiscoverNodesRequest {
    export type AsObject = {
        nodeIdentifier: string,
    }
}

export class DiscoverNodesResponse extends jspb.Message { 
    getNumNodes(): number;
    setNumNodes(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DiscoverNodesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DiscoverNodesResponse): DiscoverNodesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DiscoverNodesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DiscoverNodesResponse;
    static deserializeBinaryFromReader(message: DiscoverNodesResponse, reader: jspb.BinaryReader): DiscoverNodesResponse;
}

export namespace DiscoverNodesResponse {
    export type AsObject = {
        numNodes: number,
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

export class GetBalanceRequest extends jspb.Message { 
    getCurrency(): string;
    setCurrency(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBalanceRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetBalanceRequest): GetBalanceRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBalanceRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBalanceRequest;
    static deserializeBinaryFromReader(message: GetBalanceRequest, reader: jspb.BinaryReader): GetBalanceRequest;
}

export namespace GetBalanceRequest {
    export type AsObject = {
        currency: string,
    }
}

export class GetBalanceResponse extends jspb.Message { 

    getBalancesMap(): jspb.Map<string, Balance>;
    clearBalancesMap(): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetBalanceResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetBalanceResponse): GetBalanceResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetBalanceResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetBalanceResponse;
    static deserializeBinaryFromReader(message: GetBalanceResponse, reader: jspb.BinaryReader): GetBalanceResponse;
}

export namespace GetBalanceResponse {
    export type AsObject = {

        balancesMap: Array<[string, Balance.AsObject]>,
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

    getAlias(): string;
    setAlias(value: string): void;

    getNetwork(): string;
    setNetwork(value: string): void;

    clearPendingSwapHashesList(): void;
    getPendingSwapHashesList(): Array<string>;
    setPendingSwapHashesList(value: Array<string>): void;
    addPendingSwapHashes(value: string, index?: number): string;


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
        alias: string,
        network: string,
        pendingSwapHashesList: Array<string>,
    }
}

export class GetNodeInfoRequest extends jspb.Message { 
    getNodeIdentifier(): string;
    setNodeIdentifier(value: string): void;


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
        nodeIdentifier: string,
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
    getCurrenciesList(): Array<Currency>;
    setCurrenciesList(value: Array<Currency>): void;
    addCurrencies(value?: Currency, index?: number): Currency;


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
        currenciesList: Array<Currency.AsObject>,
    }
}

export class ListOrdersRequest extends jspb.Message { 
    getPairId(): string;
    setPairId(value: string): void;

    getOwner(): ListOrdersRequest.Owner;
    setOwner(value: ListOrdersRequest.Owner): void;

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
        owner: ListOrdersRequest.Owner,
        limit: number,
    }

    export enum Owner {
    BOTH = 0,
    OWN = 1,
    PEER = 2,
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

export class ListTradesRequest extends jspb.Message { 
    getLimit(): number;
    setLimit(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListTradesRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ListTradesRequest): ListTradesRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListTradesRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListTradesRequest;
    static deserializeBinaryFromReader(message: ListTradesRequest, reader: jspb.BinaryReader): ListTradesRequest;
}

export namespace ListTradesRequest {
    export type AsObject = {
        limit: number,
    }
}

export class ListTradesResponse extends jspb.Message { 
    clearTradesList(): void;
    getTradesList(): Array<Trade>;
    setTradesList(value: Array<Trade>): void;
    addTrades(value?: Trade, index?: number): Trade;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ListTradesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ListTradesResponse): ListTradesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ListTradesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ListTradesResponse;
    static deserializeBinaryFromReader(message: ListTradesResponse, reader: jspb.BinaryReader): ListTradesResponse;
}

export namespace ListTradesResponse {
    export type AsObject = {
        tradesList: Array<Trade.AsObject>,
    }
}

export class LndInfo extends jspb.Message { 
    getStatus(): string;
    setStatus(value: string): void;


    hasChannels(): boolean;
    clearChannels(): void;
    getChannels(): Channels | undefined;
    setChannels(value?: Channels): void;

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
        status: string,
        channels?: Channels.AsObject,
        chainsList: Array<Chain.AsObject>,
        blockheight: number,
        urisList: Array<string>,
        version: string,
        alias: string,
    }
}

export class OpenChannelRequest extends jspb.Message { 
    getNodeIdentifier(): string;
    setNodeIdentifier(value: string): void;

    getCurrency(): string;
    setCurrency(value: string): void;

    getAmount(): number;
    setAmount(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OpenChannelRequest.AsObject;
    static toObject(includeInstance: boolean, msg: OpenChannelRequest): OpenChannelRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OpenChannelRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OpenChannelRequest;
    static deserializeBinaryFromReader(message: OpenChannelRequest, reader: jspb.BinaryReader): OpenChannelRequest;
}

export namespace OpenChannelRequest {
    export type AsObject = {
        nodeIdentifier: string,
        currency: string,
        amount: number,
    }
}

export class OpenChannelResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OpenChannelResponse.AsObject;
    static toObject(includeInstance: boolean, msg: OpenChannelResponse): OpenChannelResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OpenChannelResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OpenChannelResponse;
    static deserializeBinaryFromReader(message: OpenChannelResponse, reader: jspb.BinaryReader): OpenChannelResponse;
}

export namespace OpenChannelResponse {
    export type AsObject = {
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

    getAlias(): string;
    setAlias(value: string): void;


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
        alias: string,
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

    getReplaceOrderId(): string;
    setReplaceOrderId(value: string): void;

    getImmediateOrCancel(): boolean;
    setImmediateOrCancel(value: boolean): void;


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
        replaceOrderId: string,
        immediateOrCancel: boolean,
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
    getStatus(): string;
    setStatus(value: string): void;

    getAddress(): string;
    setAddress(value: string): void;


    hasChannels(): boolean;
    clearChannels(): void;
    getChannels(): Channels | undefined;
    setChannels(value?: Channels): void;

    getVersion(): string;
    setVersion(value: string): void;

    getChain(): string;
    setChain(value: string): void;


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
        status: string,
        address: string,
        channels?: Channels.AsObject,
        version: string,
        chain: string,
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

export class RestoreNodeRequest extends jspb.Message { 
    clearSeedMnemonicList(): void;
    getSeedMnemonicList(): Array<string>;
    setSeedMnemonicList(value: Array<string>): void;
    addSeedMnemonic(value: string, index?: number): string;

    getPassword(): string;
    setPassword(value: string): void;


    getLndBackupsMap(): jspb.Map<string, Uint8Array | string>;
    clearLndBackupsMap(): void;

    getRaidenDatabase(): Uint8Array | string;
    getRaidenDatabase_asU8(): Uint8Array;
    getRaidenDatabase_asB64(): string;
    setRaidenDatabase(value: Uint8Array | string): void;

    getRaidenDatabasePath(): string;
    setRaidenDatabasePath(value: string): void;

    getXudDatabase(): Uint8Array | string;
    getXudDatabase_asU8(): Uint8Array;
    getXudDatabase_asB64(): string;
    setXudDatabase(value: Uint8Array | string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RestoreNodeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: RestoreNodeRequest): RestoreNodeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RestoreNodeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RestoreNodeRequest;
    static deserializeBinaryFromReader(message: RestoreNodeRequest, reader: jspb.BinaryReader): RestoreNodeRequest;
}

export namespace RestoreNodeRequest {
    export type AsObject = {
        seedMnemonicList: Array<string>,
        password: string,

        lndBackupsMap: Array<[string, Uint8Array | string]>,
        raidenDatabase: Uint8Array | string,
        raidenDatabasePath: string,
        xudDatabase: Uint8Array | string,
    }
}

export class RestoreNodeResponse extends jspb.Message { 
    clearRestoredLndsList(): void;
    getRestoredLndsList(): Array<string>;
    setRestoredLndsList(value: Array<string>): void;
    addRestoredLnds(value: string, index?: number): string;

    getRestoredRaiden(): boolean;
    setRestoredRaiden(value: boolean): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RestoreNodeResponse.AsObject;
    static toObject(includeInstance: boolean, msg: RestoreNodeResponse): RestoreNodeResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RestoreNodeResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RestoreNodeResponse;
    static deserializeBinaryFromReader(message: RestoreNodeResponse, reader: jspb.BinaryReader): RestoreNodeResponse;
}

export namespace RestoreNodeResponse {
    export type AsObject = {
        restoredLndsList: Array<string>,
        restoredRaiden: boolean,
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

export class TradingLimits extends jspb.Message { 
    getMaxsell(): number;
    setMaxsell(value: number): void;

    getMaxbuy(): number;
    setMaxbuy(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TradingLimits.AsObject;
    static toObject(includeInstance: boolean, msg: TradingLimits): TradingLimits.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TradingLimits, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TradingLimits;
    static deserializeBinaryFromReader(message: TradingLimits, reader: jspb.BinaryReader): TradingLimits;
}

export namespace TradingLimits {
    export type AsObject = {
        maxsell: number,
        maxbuy: number,
    }
}

export class Trade extends jspb.Message { 

    hasMakerOrder(): boolean;
    clearMakerOrder(): void;
    getMakerOrder(): Order | undefined;
    setMakerOrder(value?: Order): void;


    hasTakerOrder(): boolean;
    clearTakerOrder(): void;
    getTakerOrder(): Order | undefined;
    setTakerOrder(value?: Order): void;

    getRHash(): string;
    setRHash(value: string): void;

    getQuantity(): number;
    setQuantity(value: number): void;

    getPairId(): string;
    setPairId(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Trade.AsObject;
    static toObject(includeInstance: boolean, msg: Trade): Trade.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Trade, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Trade;
    static deserializeBinaryFromReader(message: Trade, reader: jspb.BinaryReader): Trade;
}

export namespace Trade {
    export type AsObject = {
        makerOrder?: Order.AsObject,
        takerOrder?: Order.AsObject,
        rHash: string,
        quantity: number,
        pairId: string,
    }
}

export class TradingLimitsRequest extends jspb.Message { 
    getCurrency(): string;
    setCurrency(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TradingLimitsRequest.AsObject;
    static toObject(includeInstance: boolean, msg: TradingLimitsRequest): TradingLimitsRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TradingLimitsRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TradingLimitsRequest;
    static deserializeBinaryFromReader(message: TradingLimitsRequest, reader: jspb.BinaryReader): TradingLimitsRequest;
}

export namespace TradingLimitsRequest {
    export type AsObject = {
        currency: string,
    }
}

export class TradingLimitsResponse extends jspb.Message { 

    getLimitsMap(): jspb.Map<string, TradingLimits>;
    clearLimitsMap(): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TradingLimitsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: TradingLimitsResponse): TradingLimitsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TradingLimitsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TradingLimitsResponse;
    static deserializeBinaryFromReader(message: TradingLimitsResponse, reader: jspb.BinaryReader): TradingLimitsResponse;
}

export namespace TradingLimitsResponse {
    export type AsObject = {

        limitsMap: Array<[string, TradingLimits.AsObject]>,
    }
}

export class UnbanRequest extends jspb.Message { 
    getNodeIdentifier(): string;
    setNodeIdentifier(value: string): void;

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
        nodeIdentifier: string,
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

export class UnlockNodeRequest extends jspb.Message { 
    getPassword(): string;
    setPassword(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UnlockNodeRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UnlockNodeRequest): UnlockNodeRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UnlockNodeRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UnlockNodeRequest;
    static deserializeBinaryFromReader(message: UnlockNodeRequest, reader: jspb.BinaryReader): UnlockNodeRequest;
}

export namespace UnlockNodeRequest {
    export type AsObject = {
        password: string,
    }
}

export class UnlockNodeResponse extends jspb.Message { 
    clearUnlockedLndsList(): void;
    getUnlockedLndsList(): Array<string>;
    setUnlockedLndsList(value: Array<string>): void;
    addUnlockedLnds(value: string, index?: number): string;

    getUnlockedRaiden(): boolean;
    setUnlockedRaiden(value: boolean): void;

    clearLockedLndsList(): void;
    getLockedLndsList(): Array<string>;
    setLockedLndsList(value: Array<string>): void;
    addLockedLnds(value: string, index?: number): string;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UnlockNodeResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UnlockNodeResponse): UnlockNodeResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UnlockNodeResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UnlockNodeResponse;
    static deserializeBinaryFromReader(message: UnlockNodeResponse, reader: jspb.BinaryReader): UnlockNodeResponse;
}

export namespace UnlockNodeResponse {
    export type AsObject = {
        unlockedLndsList: Array<string>,
        unlockedRaiden: boolean,
        lockedLndsList: Array<string>,
    }
}

export enum OrderSide {
    BUY = 0,
    SELL = 1,
}
