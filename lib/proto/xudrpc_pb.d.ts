// package: xudrpc
// file: xudrpc.proto

import * as jspb from "google-protobuf";
import * as annotations_pb from "./annotations_pb";

export class AddInvoiceRequest extends jspb.Message {
  getValue(): number;
  setValue(value: number): void;

  getMemo(): string;
  setMemo(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddInvoiceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddInvoiceRequest): AddInvoiceRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddInvoiceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddInvoiceRequest;
  static deserializeBinaryFromReader(message: AddInvoiceRequest, reader: jspb.BinaryReader): AddInvoiceRequest;
}

export namespace AddInvoiceRequest {
  export type AsObject = {
    value: number,
    memo: string,
  }
}

export class AddInvoiceResponse extends jspb.Message {
  getRHash(): Uint8Array | string;
  getRHash_asU8(): Uint8Array;
  getRHash_asB64(): string;
  setRHash(value: Uint8Array | string): void;

  getInvoice(): string;
  setInvoice(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddInvoiceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AddInvoiceResponse): AddInvoiceResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddInvoiceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddInvoiceResponse;
  static deserializeBinaryFromReader(message: AddInvoiceResponse, reader: jspb.BinaryReader): AddInvoiceResponse;
}

export namespace AddInvoiceResponse {
  export type AsObject = {
    rHash: Uint8Array | string,
    invoice: string,
  }
}

export class PayInvoiceRequest extends jspb.Message {
  getInvoice(): string;
  setInvoice(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PayInvoiceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PayInvoiceRequest): PayInvoiceRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PayInvoiceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PayInvoiceRequest;
  static deserializeBinaryFromReader(message: PayInvoiceRequest, reader: jspb.BinaryReader): PayInvoiceRequest;
}

export namespace PayInvoiceRequest {
  export type AsObject = {
    invoice: string,
  }
}

export class PayInvoiceResponse extends jspb.Message {
  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PayInvoiceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PayInvoiceResponse): PayInvoiceResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PayInvoiceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PayInvoiceResponse;
  static deserializeBinaryFromReader(message: PayInvoiceResponse, reader: jspb.BinaryReader): PayInvoiceResponse;
}

export namespace PayInvoiceResponse {
  export type AsObject = {
    error: string,
  }
}

export class SubscribeInvoicesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeInvoicesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeInvoicesRequest): SubscribeInvoicesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeInvoicesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeInvoicesRequest;
  static deserializeBinaryFromReader(message: SubscribeInvoicesRequest, reader: jspb.BinaryReader): SubscribeInvoicesRequest;
}

export namespace SubscribeInvoicesRequest {
  export type AsObject = {
  }
}

export class SubscribeInvoicesResponse extends jspb.Message {
  getRHash(): Uint8Array | string;
  getRHash_asU8(): Uint8Array;
  getRHash_asB64(): string;
  setRHash(value: Uint8Array | string): void;

  getValue(): number;
  setValue(value: number): void;

  getMemo(): string;
  setMemo(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeInvoicesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeInvoicesResponse): SubscribeInvoicesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeInvoicesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeInvoicesResponse;
  static deserializeBinaryFromReader(message: SubscribeInvoicesResponse, reader: jspb.BinaryReader): SubscribeInvoicesResponse;
}

export namespace SubscribeInvoicesResponse {
  export type AsObject = {
    rHash: Uint8Array | string,
    value: number,
    memo: string,
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
  getNumPeers(): number;
  setNumPeers(value: number): void;

  getNumPairs(): number;
  setNumPairs(value: number): void;

  getVersion(): string;
  setVersion(value: string): void;

  hasOrders(): boolean;
  clearOrders(): void;
  getOrders(): OrdersCount | undefined;
  setOrders(value?: OrdersCount): void;

  hasLnd(): boolean;
  clearLnd(): void;
  getLnd(): LndInfo | undefined;
  setLnd(value?: LndInfo): void;

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
    numPeers: number,
    numPairs: number,
    version: string,
    orders?: OrdersCount.AsObject,
    lnd?: LndInfo.AsObject,
    raiden?: RaidenInfo.AsObject,
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

export class Pair extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getBaseCurrency(): string;
  setBaseCurrency(value: string): void;

  getQuoteCurrency(): string;
  setQuoteCurrency(value: string): void;

  getSwapProtocol(): string;
  setSwapProtocol(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Pair.AsObject;
  static toObject(includeInstance: boolean, msg: Pair): Pair.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Pair, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Pair;
  static deserializeBinaryFromReader(message: Pair, reader: jspb.BinaryReader): Pair;
}

export namespace Pair {
  export type AsObject = {
    id: string,
    baseCurrency: string,
    quoteCurrency: string,
    swapProtocol: string,
  }
}

export class GetPairsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPairsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPairsRequest): GetPairsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetPairsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPairsRequest;
  static deserializeBinaryFromReader(message: GetPairsRequest, reader: jspb.BinaryReader): GetPairsRequest;
}

export namespace GetPairsRequest {
  export type AsObject = {
  }
}

export class GetPairsResponse extends jspb.Message {
  clearPairsList(): void;
  getPairsList(): Array<Pair>;
  setPairsList(value: Array<Pair>): void;
  addPairs(value?: Pair, index?: number): Pair;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPairsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPairsResponse): GetPairsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetPairsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPairsResponse;
  static deserializeBinaryFromReader(message: GetPairsResponse, reader: jspb.BinaryReader): GetPairsResponse;
}

export namespace GetPairsResponse {
  export type AsObject = {
    pairsList: Array<Pair.AsObject>,
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
  }
}

export class TokenSwapRequest extends jspb.Message {
  getTargetAddress(): string;
  setTargetAddress(value: string): void;

  getIdentifier(): string;
  setIdentifier(value: string): void;

  hasPayload(): boolean;
  clearPayload(): void;
  getPayload(): SwapPayload | undefined;
  setPayload(value?: SwapPayload): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TokenSwapRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TokenSwapRequest): TokenSwapRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TokenSwapRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TokenSwapRequest;
  static deserializeBinaryFromReader(message: TokenSwapRequest, reader: jspb.BinaryReader): TokenSwapRequest;
}

export namespace TokenSwapRequest {
  export type AsObject = {
    targetAddress: string,
    identifier: string,
    payload?: SwapPayload.AsObject,
  }
}

export class TokenSwapResponse extends jspb.Message {
  getResult(): string;
  setResult(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TokenSwapResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TokenSwapResponse): TokenSwapResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TokenSwapResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TokenSwapResponse;
  static deserializeBinaryFromReader(message: TokenSwapResponse, reader: jspb.BinaryReader): TokenSwapResponse;
}

export namespace TokenSwapResponse {
  export type AsObject = {
    result: string,
  }
}

export class ConnectRequest extends jspb.Message {
  getHost(): string;
  setHost(value: string): void;

  getPort(): number;
  setPort(value: number): void;

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
    host: string,
    port: number,
  }
}

export class ConnectResponse extends jspb.Message {
  getResult(): string;
  setResult(value: string): void;

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
    result: string,
  }
}

export class Order extends jspb.Message {
  getPrice(): number;
  setPrice(value: number): void;

  getQuantity(): number;
  setQuantity(value: number): void;

  getPairId(): string;
  setPairId(value: string): void;

  getPeerId(): number;
  setPeerId(value: number): void;

  getId(): string;
  setId(value: string): void;

  getCreatedAt(): number;
  setCreatedAt(value: number): void;

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
    peerId: number,
    id: string,
    createdAt: number,
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

export class PlaceOrderRequest extends jspb.Message {
  hasOrder(): boolean;
  clearOrder(): void;
  getOrder(): Order | undefined;
  setOrder(value?: Order): void;

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
    order?: Order.AsObject,
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

export class GetOrdersRequest extends jspb.Message {
  getPairId(): string;
  setPairId(value: string): void;

  getMaxResults(): number;
  setMaxResults(value: number): void;

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
    maxResults: number,
  }
}

export class GetOrdersResponse extends jspb.Message {
  clearBuyOrdersList(): void;
  getBuyOrdersList(): Array<Order>;
  setBuyOrdersList(value: Array<Order>): void;
  addBuyOrders(value?: Order, index?: number): Order;

  clearSellOrdersList(): void;
  getSellOrdersList(): Array<Order>;
  setSellOrdersList(value: Array<Order>): void;
  addSellOrders(value?: Order, index?: number): Order;

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
    buyOrdersList: Array<Order.AsObject>,
    sellOrdersList: Array<Order.AsObject>,
  }
}

export class StreamingExampleRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StreamingExampleRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StreamingExampleRequest): StreamingExampleRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StreamingExampleRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StreamingExampleRequest;
  static deserializeBinaryFromReader(message: StreamingExampleRequest, reader: jspb.BinaryReader): StreamingExampleRequest;
}

export namespace StreamingExampleRequest {
  export type AsObject = {
  }
}

export class StreamingExampleResponse extends jspb.Message {
  getDate(): number;
  setDate(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StreamingExampleResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StreamingExampleResponse): StreamingExampleResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StreamingExampleResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StreamingExampleResponse;
  static deserializeBinaryFromReader(message: StreamingExampleResponse, reader: jspb.BinaryReader): StreamingExampleResponse;
}

export namespace StreamingExampleResponse {
  export type AsObject = {
    date: number,
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
  getResult(): string;
  setResult(value: string): void;

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
    result: string,
  }
}

