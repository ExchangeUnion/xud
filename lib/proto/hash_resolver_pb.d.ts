// package: hashresolver
// file: hash_resolver.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class ResolveRequest extends jspb.Message { 
    getHash(): string;
    setHash(value: string): void;

    getTimeout(): number;
    setTimeout(value: number): void;

    getHeightNow(): number;
    setHeightNow(value: number): void;

    getAmount(): number;
    setAmount(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ResolveRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ResolveRequest): ResolveRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ResolveRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ResolveRequest;
    static deserializeBinaryFromReader(message: ResolveRequest, reader: jspb.BinaryReader): ResolveRequest;
}

export namespace ResolveRequest {
    export type AsObject = {
        hash: string,
        timeout: number,
        heightNow: number,
        amount: number,
    }
}

export class ResolveResponse extends jspb.Message { 
    getPreimage(): string;
    setPreimage(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ResolveResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ResolveResponse): ResolveResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ResolveResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ResolveResponse;
    static deserializeBinaryFromReader(message: ResolveResponse, reader: jspb.BinaryReader): ResolveResponse;
}

export namespace ResolveResponse {
    export type AsObject = {
        preimage: string,
    }
}
