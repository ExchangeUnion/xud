// package: swapresolver
// file: swap_resolver.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class ResolveReq extends jspb.Message { 
    getHash(): string;
    setHash(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ResolveReq.AsObject;
    static toObject(includeInstance: boolean, msg: ResolveReq): ResolveReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ResolveReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ResolveReq;
    static deserializeBinaryFromReader(message: ResolveReq, reader: jspb.BinaryReader): ResolveReq;
}

export namespace ResolveReq {
    export type AsObject = {
        hash: string,
    }
}

export class ResolveResp extends jspb.Message { 
    getPreimage(): string;
    setPreimage(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ResolveResp.AsObject;
    static toObject(includeInstance: boolean, msg: ResolveResp): ResolveResp.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ResolveResp, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ResolveResp;
    static deserializeBinaryFromReader(message: ResolveResp, reader: jspb.BinaryReader): ResolveResp;
}

export namespace ResolveResp {
    export type AsObject = {
        preimage: string,
    }
}

export class TakeOrderReq extends jspb.Message { 
    getOrderid(): string;
    setOrderid(value: string): void;

    getTakerAmount(): number;
    setTakerAmount(value: number): void;

    getTakerCoin(): CoinType;
    setTakerCoin(value: CoinType): void;

    getMakerAmount(): number;
    setMakerAmount(value: number): void;

    getMakerCoin(): CoinType;
    setMakerCoin(value: CoinType): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TakeOrderReq.AsObject;
    static toObject(includeInstance: boolean, msg: TakeOrderReq): TakeOrderReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TakeOrderReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TakeOrderReq;
    static deserializeBinaryFromReader(message: TakeOrderReq, reader: jspb.BinaryReader): TakeOrderReq;
}

export namespace TakeOrderReq {
    export type AsObject = {
        orderid: string,
        takerAmount: number,
        takerCoin: CoinType,
        makerAmount: number,
        makerCoin: CoinType,
    }
}

export class TakeOrderResp extends jspb.Message { 
    getRPreimage(): Uint8Array | string;
    getRPreimage_asU8(): Uint8Array;
    getRPreimage_asB64(): string;
    setRPreimage(value: Uint8Array | string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TakeOrderResp.AsObject;
    static toObject(includeInstance: boolean, msg: TakeOrderResp): TakeOrderResp.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TakeOrderResp, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TakeOrderResp;
    static deserializeBinaryFromReader(message: TakeOrderResp, reader: jspb.BinaryReader): TakeOrderResp;
}

export namespace TakeOrderResp {
    export type AsObject = {
        rPreimage: Uint8Array | string,
    }
}

export class SuggestDealReq extends jspb.Message { 
    getOrderid(): string;
    setOrderid(value: string): void;

    getTakerDealId(): string;
    setTakerDealId(value: string): void;

    getTakerAmount(): number;
    setTakerAmount(value: number): void;

    getTakerCoin(): CoinType;
    setTakerCoin(value: CoinType): void;

    getMakerAmount(): number;
    setMakerAmount(value: number): void;

    getMakerCoin(): CoinType;
    setMakerCoin(value: CoinType): void;

    getTakerPubkey(): string;
    setTakerPubkey(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SuggestDealReq.AsObject;
    static toObject(includeInstance: boolean, msg: SuggestDealReq): SuggestDealReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SuggestDealReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SuggestDealReq;
    static deserializeBinaryFromReader(message: SuggestDealReq, reader: jspb.BinaryReader): SuggestDealReq;
}

export namespace SuggestDealReq {
    export type AsObject = {
        orderid: string,
        takerDealId: string,
        takerAmount: number,
        takerCoin: CoinType,
        makerAmount: number,
        makerCoin: CoinType,
        takerPubkey: string,
    }
}

export class SuggestDealResp extends jspb.Message { 
    getOrderid(): string;
    setOrderid(value: string): void;

    getRHash(): Uint8Array | string;
    getRHash_asU8(): Uint8Array;
    getRHash_asB64(): string;
    setRHash(value: Uint8Array | string): void;

    getMakerDealId(): string;
    setMakerDealId(value: string): void;

    getMakerPubkey(): string;
    setMakerPubkey(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SuggestDealResp.AsObject;
    static toObject(includeInstance: boolean, msg: SuggestDealResp): SuggestDealResp.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SuggestDealResp, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SuggestDealResp;
    static deserializeBinaryFromReader(message: SuggestDealResp, reader: jspb.BinaryReader): SuggestDealResp;
}

export namespace SuggestDealResp {
    export type AsObject = {
        orderid: string,
        rHash: Uint8Array | string,
        makerDealId: string,
        makerPubkey: string,
    }
}

export class SwapReq extends jspb.Message { 
    getMakerDealId(): string;
    setMakerDealId(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SwapReq.AsObject;
    static toObject(includeInstance: boolean, msg: SwapReq): SwapReq.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SwapReq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SwapReq;
    static deserializeBinaryFromReader(message: SwapReq, reader: jspb.BinaryReader): SwapReq;
}

export namespace SwapReq {
    export type AsObject = {
        makerDealId: string,
    }
}

export class SwapResp extends jspb.Message { 
    getRPreimage(): Uint8Array | string;
    getRPreimage_asU8(): Uint8Array;
    getRPreimage_asB64(): string;
    setRPreimage(value: Uint8Array | string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SwapResp.AsObject;
    static toObject(includeInstance: boolean, msg: SwapResp): SwapResp.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SwapResp, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SwapResp;
    static deserializeBinaryFromReader(message: SwapResp, reader: jspb.BinaryReader): SwapResp;
}

export namespace SwapResp {
    export type AsObject = {
        rPreimage: Uint8Array | string,
    }
}

export enum CoinType {
    BTC = 0,
    LTC = 1,
}
