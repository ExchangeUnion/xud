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
    getBalance(): number;
    setBalance(value: number): void;

    getPendingOpenBalance(): number;
    setPendingOpenBalance(value: number): void;


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
        balance: number,
        pendingOpenBalance: number,
    }
}

export class CancelOrderRequest extends jspb.Message { 
    getOrderId(): string;
    setOrderId(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CancelOrderRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CancelOrderRequest): CancelOrderRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CancelOrderRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CancelOrderRequest;
    static deserializeBinaryFromReader(message: CancelOrderRequest, reader: jspb.BinaryReader): CancelOrderRequest;
}

export namespace CancelOrderRequest {
    export type AsObject = {
        orderId: string,
    }
}

export class CancelOrderResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CancelOrderResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CancelOrderResponse): CancelOrderResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CancelOrderResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CancelOrderResponse;
    static deserializeBinaryFromReader(message: CancelOrderResponse, reader: jspb.BinaryReader): CancelOrderResponse;
}

export namespace CancelOrderResponse {
    export type AsObject = {
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

export class DisconnectRequest extends jspb.Message { 
    getNodePubKey(): string;
    setNodePubKey(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DisconnectRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DisconnectRequest): DisconnectRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DisconnectRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DisconnectRequest;
    static deserializeBinaryFromReader(message: DisconnectRequest, reader: jspb.BinaryReader): DisconnectRequest;
}

export namespace DisconnectRequest {
    export type AsObject = {
        nodePubKey: string,
    }
}

export class DisconnectResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DisconnectResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DisconnectResponse): DisconnectResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DisconnectResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DisconnectResponse;
    static deserializeBinaryFromReader(message: DisconnectResponse, reader: jspb.BinaryReader): DisconnectResponse;
}

export namespace DisconnectResponse {
    export type AsObject = {
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


    hasLndbtc(): boolean;
    clearLndbtc(): void;
    getLndbtc(): LndInfo | undefined;
    setLndbtc(value?: LndInfo): void;


    hasLndltc(): boolean;
    clearLndltc(): void;
    getLndltc(): LndInfo | undefined;
    setLndltc(value?: LndInfo): void;


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
        lndbtc?: LndInfo.AsObject,
        lndltc?: LndInfo.AsObject,
        raiden?: RaidenInfo.AsObject,
    }
}

export class GetOrdersRequest extends jspb.Message { 
    getPairId(): string;
    setPairId(value: string): void;

    getIncludeOwnOrders(): boolean;
    setIncludeOwnOrders(value: boolean): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetOrdersRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetOrdersRequest): GetOrdersRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetOrdersRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetOrdersRequest;
    static deserializeBinaryFromReader(message: GetOrdersRequest, reader: jspb.BinaryReader): GetOrdersRequest;
}

export namespace GetOrdersRequest {
    export type AsObject = {
        pairId: string,
        includeOwnOrders: boolean,
    }
}

export class GetOrdersResponse extends jspb.Message { 

    getOrdersMap(): jspb.Map<string, Orders>;
    clearOrdersMap(): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetOrdersResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetOrdersResponse): GetOrdersResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetOrdersResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetOrdersResponse;
    static deserializeBinaryFromReader(message: GetOrdersResponse, reader: jspb.BinaryReader): GetOrdersResponse;
}

export namespace GetOrdersResponse {
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
    getChainsList(): Array<string>;
    setChainsList(value: Array<string>): void;
    addChains(value: string, index?: number): string;

    getBlockheight(): number;
    setBlockheight(value: number): void;

    clearUrisList(): void;
    getUrisList(): Array<string>;
    setUrisList(value: Array<string>): void;
    addUris(value: string, index?: number): string;

    getVersion(): string;
    setVersion(value: string): void;


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
        chainsList: Array<string>,
        blockheight: number,
        urisList: Array<string>,
        version: string,
    }
}

export class Order extends jspb.Message { 
    getPrice(): number;
    setPrice(value: number): void;

    getQuantity(): number;
    setQuantity(value: number): void;

    getPairId(): string;
    setPairId(value: string): void;

    getPeerPubKey(): string;
    setPeerPubKey(value: string): void;

    getId(): string;
    setId(value: string): void;

    getLocalId(): string;
    setLocalId(value: string): void;

    getCreatedAt(): number;
    setCreatedAt(value: number): void;

    getInvoice(): string;
    setInvoice(value: string): void;

    getCanceled(): boolean;
    setCanceled(value: boolean): void;


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
        peerPubKey: string,
        id: string,
        localId: string,
        createdAt: number,
        invoice: string,
        canceled: boolean,
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

export class OrderMatch extends jspb.Message { 

    hasMaker(): boolean;
    clearMaker(): void;
    getMaker(): Order | undefined;
    setMaker(value?: Order): void;


    hasTaker(): boolean;
    clearTaker(): void;
    getTaker(): Order | undefined;
    setTaker(value?: Order): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrderMatch.AsObject;
    static toObject(includeInstance: boolean, msg: OrderMatch): OrderMatch.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OrderMatch, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrderMatch;
    static deserializeBinaryFromReader(message: OrderMatch, reader: jspb.BinaryReader): OrderMatch;
}

export namespace OrderMatch {
    export type AsObject = {
        maker?: Order.AsObject,
        taker?: Order.AsObject,
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
        inbound: boolean,
        pairsList: Array<string>,
        xudVersion: string,
        secondsConnected: number,
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
    }
}

export class PlaceOrderResponse extends jspb.Message { 
    clearMatchesList(): void;
    getMatchesList(): Array<OrderMatch>;
    setMatchesList(value: Array<OrderMatch>): void;
    addMatches(value?: OrderMatch, index?: number): OrderMatch;


    hasRemainingOrder(): boolean;
    clearRemainingOrder(): void;
    getRemainingOrder(): Order | undefined;
    setRemainingOrder(value?: Order): void;


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
        matchesList: Array<OrderMatch.AsObject>,
        remainingOrder?: Order.AsObject,
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

export class SwapPayload extends jspb.Message { 
    getRole(): string;
    setRole(value: string): void;

    getSendingAmount(): number;
    setSendingAmount(value: number): void;

    getSendingToken(): string;
    setSendingToken(value: string): void;

    getReceivingAmount(): number;
    setReceivingAmount(value: number): void;

    getReceivingToken(): string;
    setReceivingToken(value: string): void;

    getNodePubKey(): string;
    setNodePubKey(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SwapPayload.AsObject;
    static toObject(includeInstance: boolean, msg: SwapPayload): SwapPayload.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SwapPayload, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SwapPayload;
    static deserializeBinaryFromReader(message: SwapPayload, reader: jspb.BinaryReader): SwapPayload;
}

export namespace SwapPayload {
    export type AsObject = {
        role: string,
        sendingAmount: number,
        sendingToken: string,
        receivingAmount: number,
        receivingToken: string,
        nodePubKey: string,
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

export class SubscribePeerOrdersRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribePeerOrdersRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribePeerOrdersRequest): SubscribePeerOrdersRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribePeerOrdersRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribePeerOrdersRequest;
    static deserializeBinaryFromReader(message: SubscribePeerOrdersRequest, reader: jspb.BinaryReader): SubscribePeerOrdersRequest;
}

export namespace SubscribePeerOrdersRequest {
    export type AsObject = {
    }
}

export class SubscribePeerOrdersResponse extends jspb.Message { 

    hasOrder(): boolean;
    clearOrder(): void;
    getOrder(): Order | undefined;
    setOrder(value?: Order): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribePeerOrdersResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribePeerOrdersResponse): SubscribePeerOrdersResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribePeerOrdersResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribePeerOrdersResponse;
    static deserializeBinaryFromReader(message: SubscribePeerOrdersResponse, reader: jspb.BinaryReader): SubscribePeerOrdersResponse;
}

export namespace SubscribePeerOrdersResponse {
    export type AsObject = {
        order?: Order.AsObject,
    }
}

export class SubscribeSwapsRequest extends jspb.Message { 

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
    }
}

export class SubscribeSwapsResponse extends jspb.Message { 
    getOrder(): string;
    setOrder(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscribeSwapsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SubscribeSwapsResponse): SubscribeSwapsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscribeSwapsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscribeSwapsResponse;
    static deserializeBinaryFromReader(message: SubscribeSwapsResponse, reader: jspb.BinaryReader): SubscribeSwapsResponse;
}

export namespace SubscribeSwapsResponse {
    export type AsObject = {
        order: string,
    }
}
