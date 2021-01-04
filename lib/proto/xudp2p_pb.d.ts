// package: xudp2p
// file: xudp2p.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Address extends jspb.Message { 
    getHost(): string;
    setHost(value: string): Address;

    getPort(): number;
    setPort(value: number): Address;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Address.AsObject;
    static toObject(includeInstance: boolean, msg: Address): Address.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Address, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Address;
    static deserializeBinaryFromReader(message: Address, reader: jspb.BinaryReader): Address;
}

export namespace Address {
    export type AsObject = {
        host: string,
        port: number,
    }
}

export class Order extends jspb.Message { 
    getId(): string;
    setId(value: string): Order;

    getPairId(): string;
    setPairId(value: string): Order;

    getPrice(): number;
    setPrice(value: number): Order;

    getQuantity(): number;
    setQuantity(value: number): Order;

    getIsBuy(): boolean;
    setIsBuy(value: boolean): Order;

    getReplaceOrderId(): string;
    setReplaceOrderId(value: string): Order;


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
        id: string,
        pairId: string,
        price: number,
        quantity: number,
        isBuy: boolean,
        replaceOrderId: string,
    }
}

export class Node extends jspb.Message { 
    getNodePubKey(): string;
    setNodePubKey(value: string): Node;

    clearAddressesList(): void;
    getAddressesList(): Array<Address>;
    setAddressesList(value: Array<Address>): Node;
    addAddresses(value?: Address, index?: number): Address;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Node.AsObject;
    static toObject(includeInstance: boolean, msg: Node): Node.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Node, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Node;
    static deserializeBinaryFromReader(message: Node, reader: jspb.BinaryReader): Node;
}

export namespace Node {
    export type AsObject = {
        nodePubKey: string,
        addressesList: Array<Address.AsObject>,
    }
}

export class LndUris extends jspb.Message { 
    clearLndUriList(): void;
    getLndUriList(): Array<string>;
    setLndUriList(value: Array<string>): LndUris;
    addLndUri(value: string, index?: number): string;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LndUris.AsObject;
    static toObject(includeInstance: boolean, msg: LndUris): LndUris.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LndUris, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LndUris;
    static deserializeBinaryFromReader(message: LndUris, reader: jspb.BinaryReader): LndUris;
}

export namespace LndUris {
    export type AsObject = {
        lndUriList: Array<string>,
    }
}

export class NodeState extends jspb.Message { 
    clearAddressesList(): void;
    getAddressesList(): Array<Address>;
    setAddressesList(value: Array<Address>): NodeState;
    addAddresses(value?: Address, index?: number): Address;

    clearPairsList(): void;
    getPairsList(): Array<string>;
    setPairsList(value: Array<string>): NodeState;
    addPairs(value: string, index?: number): string;


    getLndPubKeysMap(): jspb.Map<string, string>;
    clearLndPubKeysMap(): void;


    getTokenIdentifiersMap(): jspb.Map<string, string>;
    clearTokenIdentifiersMap(): void;


    getLndUrisMap(): jspb.Map<string, LndUris>;
    clearLndUrisMap(): void;

    getConnextIdentifier(): string;
    setConnextIdentifier(value: string): NodeState;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NodeState.AsObject;
    static toObject(includeInstance: boolean, msg: NodeState): NodeState.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: NodeState, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NodeState;
    static deserializeBinaryFromReader(message: NodeState, reader: jspb.BinaryReader): NodeState;
}

export namespace NodeState {
    export type AsObject = {
        addressesList: Array<Address.AsObject>,
        pairsList: Array<string>,

        lndPubKeysMap: Array<[string, string]>,

        tokenIdentifiersMap: Array<[string, string]>,

        lndUrisMap: Array<[string, LndUris.AsObject]>,
        connextIdentifier: string,
    }
}

export class PingPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): PingPacket;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PingPacket.AsObject;
    static toObject(includeInstance: boolean, msg: PingPacket): PingPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PingPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PingPacket;
    static deserializeBinaryFromReader(message: PingPacket, reader: jspb.BinaryReader): PingPacket;
}

export namespace PingPacket {
    export type AsObject = {
        id: string,
    }
}

export class PongPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): PongPacket;

    getReqId(): string;
    setReqId(value: string): PongPacket;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PongPacket.AsObject;
    static toObject(includeInstance: boolean, msg: PongPacket): PongPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PongPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PongPacket;
    static deserializeBinaryFromReader(message: PongPacket, reader: jspb.BinaryReader): PongPacket;
}

export namespace PongPacket {
    export type AsObject = {
        id: string,
        reqId: string,
    }
}

export class OrderPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): OrderPacket;


    hasOrder(): boolean;
    clearOrder(): void;
    getOrder(): Order | undefined;
    setOrder(value?: Order): OrderPacket;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrderPacket.AsObject;
    static toObject(includeInstance: boolean, msg: OrderPacket): OrderPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OrderPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrderPacket;
    static deserializeBinaryFromReader(message: OrderPacket, reader: jspb.BinaryReader): OrderPacket;
}

export namespace OrderPacket {
    export type AsObject = {
        id: string,
        order?: Order.AsObject,
    }
}

export class OrderInvalidationPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): OrderInvalidationPacket;

    getOrderId(): string;
    setOrderId(value: string): OrderInvalidationPacket;

    getPairId(): string;
    setPairId(value: string): OrderInvalidationPacket;

    getQuantity(): number;
    setQuantity(value: number): OrderInvalidationPacket;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrderInvalidationPacket.AsObject;
    static toObject(includeInstance: boolean, msg: OrderInvalidationPacket): OrderInvalidationPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OrderInvalidationPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrderInvalidationPacket;
    static deserializeBinaryFromReader(message: OrderInvalidationPacket, reader: jspb.BinaryReader): OrderInvalidationPacket;
}

export namespace OrderInvalidationPacket {
    export type AsObject = {
        id: string,
        orderId: string,
        pairId: string,
        quantity: number,
    }
}

export class GetOrdersPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): GetOrdersPacket;

    clearPairIdsList(): void;
    getPairIdsList(): Array<string>;
    setPairIdsList(value: Array<string>): GetOrdersPacket;
    addPairIds(value: string, index?: number): string;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetOrdersPacket.AsObject;
    static toObject(includeInstance: boolean, msg: GetOrdersPacket): GetOrdersPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetOrdersPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetOrdersPacket;
    static deserializeBinaryFromReader(message: GetOrdersPacket, reader: jspb.BinaryReader): GetOrdersPacket;
}

export namespace GetOrdersPacket {
    export type AsObject = {
        id: string,
        pairIdsList: Array<string>,
    }
}

export class OrdersPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): OrdersPacket;

    getReqId(): string;
    setReqId(value: string): OrdersPacket;

    clearOrdersList(): void;
    getOrdersList(): Array<Order>;
    setOrdersList(value: Array<Order>): OrdersPacket;
    addOrders(value?: Order, index?: number): Order;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrdersPacket.AsObject;
    static toObject(includeInstance: boolean, msg: OrdersPacket): OrdersPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OrdersPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrdersPacket;
    static deserializeBinaryFromReader(message: OrdersPacket, reader: jspb.BinaryReader): OrdersPacket;
}

export namespace OrdersPacket {
    export type AsObject = {
        id: string,
        reqId: string,
        ordersList: Array<Order.AsObject>,
    }
}

export class NodeStateUpdatePacket extends jspb.Message { 
    getId(): string;
    setId(value: string): NodeStateUpdatePacket;


    hasNodeState(): boolean;
    clearNodeState(): void;
    getNodeState(): NodeState | undefined;
    setNodeState(value?: NodeState): NodeStateUpdatePacket;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NodeStateUpdatePacket.AsObject;
    static toObject(includeInstance: boolean, msg: NodeStateUpdatePacket): NodeStateUpdatePacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: NodeStateUpdatePacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NodeStateUpdatePacket;
    static deserializeBinaryFromReader(message: NodeStateUpdatePacket, reader: jspb.BinaryReader): NodeStateUpdatePacket;
}

export namespace NodeStateUpdatePacket {
    export type AsObject = {
        id: string,
        nodeState?: NodeState.AsObject,
    }
}

export class SessionInitPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): SessionInitPacket;

    getSign(): string;
    setSign(value: string): SessionInitPacket;

    getPeerPubKey(): string;
    setPeerPubKey(value: string): SessionInitPacket;

    getEphemeralPubKey(): string;
    setEphemeralPubKey(value: string): SessionInitPacket;


    hasNodeState(): boolean;
    clearNodeState(): void;
    getNodeState(): NodeState | undefined;
    setNodeState(value?: NodeState): SessionInitPacket;

    getVersion(): string;
    setVersion(value: string): SessionInitPacket;

    getNodePubKey(): string;
    setNodePubKey(value: string): SessionInitPacket;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SessionInitPacket.AsObject;
    static toObject(includeInstance: boolean, msg: SessionInitPacket): SessionInitPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SessionInitPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SessionInitPacket;
    static deserializeBinaryFromReader(message: SessionInitPacket, reader: jspb.BinaryReader): SessionInitPacket;
}

export namespace SessionInitPacket {
    export type AsObject = {
        id: string,
        sign: string,
        peerPubKey: string,
        ephemeralPubKey: string,
        nodeState?: NodeState.AsObject,
        version: string,
        nodePubKey: string,
    }
}

export class SessionAckPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): SessionAckPacket;

    getReqId(): string;
    setReqId(value: string): SessionAckPacket;

    getEphemeralPubKey(): string;
    setEphemeralPubKey(value: string): SessionAckPacket;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SessionAckPacket.AsObject;
    static toObject(includeInstance: boolean, msg: SessionAckPacket): SessionAckPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SessionAckPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SessionAckPacket;
    static deserializeBinaryFromReader(message: SessionAckPacket, reader: jspb.BinaryReader): SessionAckPacket;
}

export namespace SessionAckPacket {
    export type AsObject = {
        id: string,
        reqId: string,
        ephemeralPubKey: string,
    }
}

export class DisconnectingPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): DisconnectingPacket;

    getReason(): number;
    setReason(value: number): DisconnectingPacket;

    getPayload(): string;
    setPayload(value: string): DisconnectingPacket;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DisconnectingPacket.AsObject;
    static toObject(includeInstance: boolean, msg: DisconnectingPacket): DisconnectingPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DisconnectingPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DisconnectingPacket;
    static deserializeBinaryFromReader(message: DisconnectingPacket, reader: jspb.BinaryReader): DisconnectingPacket;
}

export namespace DisconnectingPacket {
    export type AsObject = {
        id: string,
        reason: number,
        payload: string,
    }
}

export class GetNodesPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): GetNodesPacket;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetNodesPacket.AsObject;
    static toObject(includeInstance: boolean, msg: GetNodesPacket): GetNodesPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetNodesPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetNodesPacket;
    static deserializeBinaryFromReader(message: GetNodesPacket, reader: jspb.BinaryReader): GetNodesPacket;
}

export namespace GetNodesPacket {
    export type AsObject = {
        id: string,
    }
}

export class NodesPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): NodesPacket;

    getReqId(): string;
    setReqId(value: string): NodesPacket;

    clearNodesList(): void;
    getNodesList(): Array<Node>;
    setNodesList(value: Array<Node>): NodesPacket;
    addNodes(value?: Node, index?: number): Node;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): NodesPacket.AsObject;
    static toObject(includeInstance: boolean, msg: NodesPacket): NodesPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: NodesPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): NodesPacket;
    static deserializeBinaryFromReader(message: NodesPacket, reader: jspb.BinaryReader): NodesPacket;
}

export namespace NodesPacket {
    export type AsObject = {
        id: string,
        reqId: string,
        nodesList: Array<Node.AsObject>,
    }
}

export class SanitySwapInitPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): SanitySwapInitPacket;

    getCurrency(): string;
    setCurrency(value: string): SanitySwapInitPacket;

    getRHash(): string;
    setRHash(value: string): SanitySwapInitPacket;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SanitySwapInitPacket.AsObject;
    static toObject(includeInstance: boolean, msg: SanitySwapInitPacket): SanitySwapInitPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SanitySwapInitPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SanitySwapInitPacket;
    static deserializeBinaryFromReader(message: SanitySwapInitPacket, reader: jspb.BinaryReader): SanitySwapInitPacket;
}

export namespace SanitySwapInitPacket {
    export type AsObject = {
        id: string,
        currency: string,
        rHash: string,
    }
}

export class SanitySwapAckPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): SanitySwapAckPacket;

    getReqId(): string;
    setReqId(value: string): SanitySwapAckPacket;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SanitySwapAckPacket.AsObject;
    static toObject(includeInstance: boolean, msg: SanitySwapAckPacket): SanitySwapAckPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SanitySwapAckPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SanitySwapAckPacket;
    static deserializeBinaryFromReader(message: SanitySwapAckPacket, reader: jspb.BinaryReader): SanitySwapAckPacket;
}

export namespace SanitySwapAckPacket {
    export type AsObject = {
        id: string,
        reqId: string,
    }
}

export class SwapRequestPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): SwapRequestPacket;

    getProposedQuantity(): number;
    setProposedQuantity(value: number): SwapRequestPacket;

    getPairId(): string;
    setPairId(value: string): SwapRequestPacket;

    getOrderId(): string;
    setOrderId(value: string): SwapRequestPacket;

    getRHash(): string;
    setRHash(value: string): SwapRequestPacket;

    getTakerCltvDelta(): number;
    setTakerCltvDelta(value: number): SwapRequestPacket;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SwapRequestPacket.AsObject;
    static toObject(includeInstance: boolean, msg: SwapRequestPacket): SwapRequestPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SwapRequestPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SwapRequestPacket;
    static deserializeBinaryFromReader(message: SwapRequestPacket, reader: jspb.BinaryReader): SwapRequestPacket;
}

export namespace SwapRequestPacket {
    export type AsObject = {
        id: string,
        proposedQuantity: number,
        pairId: string,
        orderId: string,
        rHash: string,
        takerCltvDelta: number,
    }
}

export class SwapAcceptedPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): SwapAcceptedPacket;

    getReqId(): string;
    setReqId(value: string): SwapAcceptedPacket;

    getRHash(): string;
    setRHash(value: string): SwapAcceptedPacket;

    getQuantity(): number;
    setQuantity(value: number): SwapAcceptedPacket;

    getMakerCltvDelta(): number;
    setMakerCltvDelta(value: number): SwapAcceptedPacket;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SwapAcceptedPacket.AsObject;
    static toObject(includeInstance: boolean, msg: SwapAcceptedPacket): SwapAcceptedPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SwapAcceptedPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SwapAcceptedPacket;
    static deserializeBinaryFromReader(message: SwapAcceptedPacket, reader: jspb.BinaryReader): SwapAcceptedPacket;
}

export namespace SwapAcceptedPacket {
    export type AsObject = {
        id: string,
        reqId: string,
        rHash: string,
        quantity: number,
        makerCltvDelta: number,
    }
}

export class SwapFailedPacket extends jspb.Message { 
    getId(): string;
    setId(value: string): SwapFailedPacket;

    getReqId(): string;
    setReqId(value: string): SwapFailedPacket;

    getRHash(): string;
    setRHash(value: string): SwapFailedPacket;

    getErrorMessage(): string;
    setErrorMessage(value: string): SwapFailedPacket;

    getFailureReason(): number;
    setFailureReason(value: number): SwapFailedPacket;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SwapFailedPacket.AsObject;
    static toObject(includeInstance: boolean, msg: SwapFailedPacket): SwapFailedPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SwapFailedPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SwapFailedPacket;
    static deserializeBinaryFromReader(message: SwapFailedPacket, reader: jspb.BinaryReader): SwapFailedPacket;
}

export namespace SwapFailedPacket {
    export type AsObject = {
        id: string,
        reqId: string,
        rHash: string,
        errorMessage: string,
        failureReason: number,
    }
}
