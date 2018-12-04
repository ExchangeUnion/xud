// package: xudp2p
// file: xudp2p.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class Header extends jspb.Message { 
    getId(): string;
    setId(value: string): void;

    getReqid(): string;
    setReqid(value: string): void;

    getHash(): string;
    setHash(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Header.AsObject;
    static toObject(includeInstance: boolean, msg: Header): Header.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Header, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Header;
    static deserializeBinaryFromReader(message: Header, reader: jspb.BinaryReader): Header;
}

export namespace Header {
    export type AsObject = {
        id: string,
        reqid: string,
        hash: string,
    }
}

export class Address extends jspb.Message { 
    getHost(): string;
    setHost(value: string): void;

    getPort(): number;
    setPort(value: number): void;


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
    setId(value: string): void;

    getPairid(): string;
    setPairid(value: string): void;

    getPrice(): number;
    setPrice(value: number): void;

    getQuantity(): number;
    setQuantity(value: number): void;

    getIsbuy(): boolean;
    setIsbuy(value: boolean): void;


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
        pairid: string,
        price: number,
        quantity: number,
        isbuy: boolean,
    }
}

export class Node extends jspb.Message { 
    getNodepubkey(): string;
    setNodepubkey(value: string): void;

    clearAddressesList(): void;
    getAddressesList(): Array<Address>;
    setAddressesList(value: Array<Address>): void;
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
        nodepubkey: string,
        addressesList: Array<Address.AsObject>,
    }
}

export class PingPacket extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): void;


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
        header?: Header.AsObject,
    }
}

export class PongPacket extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): void;


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
        header?: Header.AsObject,
    }
}

export class OrderPacket extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): void;

    getId(): string;
    setId(value: string): void;

    getPairid(): string;
    setPairid(value: string): void;

    getPrice(): number;
    setPrice(value: number): void;

    getQuantity(): number;
    setQuantity(value: number): void;

    getIsbuy(): boolean;
    setIsbuy(value: boolean): void;


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
        header?: Header.AsObject,
        id: string,
        pairid: string,
        price: number,
        quantity: number,
        isbuy: boolean,
    }
}

export class OrderInvalidationPacket extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): void;

    getId(): string;
    setId(value: string): void;

    getPairid(): string;
    setPairid(value: string): void;

    getQuantity(): number;
    setQuantity(value: number): void;


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
        header?: Header.AsObject,
        id: string,
        pairid: string,
        quantity: number,
    }
}

export class GetOrdersPacket extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): void;

    clearPairidsList(): void;
    getPairidsList(): Array<string>;
    setPairidsList(value: Array<string>): void;
    addPairids(value: string, index?: number): string;


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
        header?: Header.AsObject,
        pairidsList: Array<string>,
    }
}

export class OrdersPacket extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): void;

    clearOrdersList(): void;
    getOrdersList(): Array<Order>;
    setOrdersList(value: Array<Order>): void;
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
        header?: Header.AsObject,
        ordersList: Array<Order.AsObject>,
    }
}

export class HelloPacket extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): void;

    getVersion(): string;
    setVersion(value: string): void;

    getNodepubkey(): string;
    setNodepubkey(value: string): void;

    clearAddressesList(): void;
    getAddressesList(): Array<Address>;
    setAddressesList(value: Array<Address>): void;
    addAddresses(value?: Address, index?: number): Address;

    clearPairsList(): void;
    getPairsList(): Array<string>;
    setPairsList(value: Array<string>): void;
    addPairs(value: string, index?: number): string;

    getRaidenaddress(): string;
    setRaidenaddress(value: string): void;

    getLndbtcpubkey(): string;
    setLndbtcpubkey(value: string): void;

    getLndltcpubkey(): string;
    setLndltcpubkey(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): HelloPacket.AsObject;
    static toObject(includeInstance: boolean, msg: HelloPacket): HelloPacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: HelloPacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): HelloPacket;
    static deserializeBinaryFromReader(message: HelloPacket, reader: jspb.BinaryReader): HelloPacket;
}

export namespace HelloPacket {
    export type AsObject = {
        header?: Header.AsObject,
        version: string,
        nodepubkey: string,
        addressesList: Array<Address.AsObject>,
        pairsList: Array<string>,
        raidenaddress: string,
        lndbtcpubkey: string,
        lndltcpubkey: string,
    }
}

export class DisconnectingPacket extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): void;

    getReason(): number;
    setReason(value: number): void;

    getPayload(): string;
    setPayload(value: string): void;


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
        header?: Header.AsObject,
        reason: number,
        payload: string,
    }
}

export class GetNodesPacket extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): void;


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
        header?: Header.AsObject,
    }
}

export class NodesPacket extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): void;

    clearNodesList(): void;
    getNodesList(): Array<Node>;
    setNodesList(value: Array<Node>): void;
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
        header?: Header.AsObject,
        nodesList: Array<Node.AsObject>,
    }
}

export class SwapRequestPacket extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): void;

    getProposedquantity(): number;
    setProposedquantity(value: number): void;

    getPairid(): string;
    setPairid(value: string): void;

    getOrderid(): string;
    setOrderid(value: string): void;

    getRhash(): string;
    setRhash(value: string): void;

    getTakercltvdelta(): number;
    setTakercltvdelta(value: number): void;


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
        header?: Header.AsObject,
        proposedquantity: number,
        pairid: string,
        orderid: string,
        rhash: string,
        takercltvdelta: number,
    }
}

export class SwapAcceptedPacket extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): void;

    getRhash(): string;
    setRhash(value: string): void;

    getQuantity(): number;
    setQuantity(value: number): void;

    getMakercltvdelta(): number;
    setMakercltvdelta(value: number): void;


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
        header?: Header.AsObject,
        rhash: string,
        quantity: number,
        makercltvdelta: number,
    }
}

export class SwapCompletePacket extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): void;

    getRhash(): string;
    setRhash(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SwapCompletePacket.AsObject;
    static toObject(includeInstance: boolean, msg: SwapCompletePacket): SwapCompletePacket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SwapCompletePacket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SwapCompletePacket;
    static deserializeBinaryFromReader(message: SwapCompletePacket, reader: jspb.BinaryReader): SwapCompletePacket;
}

export namespace SwapCompletePacket {
    export type AsObject = {
        header?: Header.AsObject,
        rhash: string,
    }
}

export class SwapFailedPacket extends jspb.Message { 

    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): void;

    getRhash(): string;
    setRhash(value: string): void;

    getErrormessage(): string;
    setErrormessage(value: string): void;


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
        header?: Header.AsObject,
        rhash: string,
        errormessage: string,
    }
}
