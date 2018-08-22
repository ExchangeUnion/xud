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
