// package: lnrpc
// file: lndwalletunlocker.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as lndrpc_pb from "./lndrpc_pb";

export class GenSeedRequest extends jspb.Message { 
    getAezeedPassphrase(): Uint8Array | string;
    getAezeedPassphrase_asU8(): Uint8Array;
    getAezeedPassphrase_asB64(): string;
    setAezeedPassphrase(value: Uint8Array | string): GenSeedRequest;

    getSeedEntropy(): Uint8Array | string;
    getSeedEntropy_asU8(): Uint8Array;
    getSeedEntropy_asB64(): string;
    setSeedEntropy(value: Uint8Array | string): GenSeedRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GenSeedRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GenSeedRequest): GenSeedRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GenSeedRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GenSeedRequest;
    static deserializeBinaryFromReader(message: GenSeedRequest, reader: jspb.BinaryReader): GenSeedRequest;
}

export namespace GenSeedRequest {
    export type AsObject = {
        aezeedPassphrase: Uint8Array | string,
        seedEntropy: Uint8Array | string,
    }
}

export class GenSeedResponse extends jspb.Message { 
    clearCipherSeedMnemonicList(): void;
    getCipherSeedMnemonicList(): Array<string>;
    setCipherSeedMnemonicList(value: Array<string>): GenSeedResponse;
    addCipherSeedMnemonic(value: string, index?: number): string;

    getEncipheredSeed(): Uint8Array | string;
    getEncipheredSeed_asU8(): Uint8Array;
    getEncipheredSeed_asB64(): string;
    setEncipheredSeed(value: Uint8Array | string): GenSeedResponse;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GenSeedResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GenSeedResponse): GenSeedResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GenSeedResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GenSeedResponse;
    static deserializeBinaryFromReader(message: GenSeedResponse, reader: jspb.BinaryReader): GenSeedResponse;
}

export namespace GenSeedResponse {
    export type AsObject = {
        cipherSeedMnemonicList: Array<string>,
        encipheredSeed: Uint8Array | string,
    }
}

export class InitWalletRequest extends jspb.Message { 
    getWalletPassword(): Uint8Array | string;
    getWalletPassword_asU8(): Uint8Array;
    getWalletPassword_asB64(): string;
    setWalletPassword(value: Uint8Array | string): InitWalletRequest;

    clearCipherSeedMnemonicList(): void;
    getCipherSeedMnemonicList(): Array<string>;
    setCipherSeedMnemonicList(value: Array<string>): InitWalletRequest;
    addCipherSeedMnemonic(value: string, index?: number): string;

    getAezeedPassphrase(): Uint8Array | string;
    getAezeedPassphrase_asU8(): Uint8Array;
    getAezeedPassphrase_asB64(): string;
    setAezeedPassphrase(value: Uint8Array | string): InitWalletRequest;

    getRecoveryWindow(): number;
    setRecoveryWindow(value: number): InitWalletRequest;


    hasChannelBackups(): boolean;
    clearChannelBackups(): void;
    getChannelBackups(): lndrpc_pb.ChanBackupSnapshot | undefined;
    setChannelBackups(value?: lndrpc_pb.ChanBackupSnapshot): InitWalletRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InitWalletRequest.AsObject;
    static toObject(includeInstance: boolean, msg: InitWalletRequest): InitWalletRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InitWalletRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InitWalletRequest;
    static deserializeBinaryFromReader(message: InitWalletRequest, reader: jspb.BinaryReader): InitWalletRequest;
}

export namespace InitWalletRequest {
    export type AsObject = {
        walletPassword: Uint8Array | string,
        cipherSeedMnemonicList: Array<string>,
        aezeedPassphrase: Uint8Array | string,
        recoveryWindow: number,
        channelBackups?: lndrpc_pb.ChanBackupSnapshot.AsObject,
    }
}

export class InitWalletResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InitWalletResponse.AsObject;
    static toObject(includeInstance: boolean, msg: InitWalletResponse): InitWalletResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InitWalletResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InitWalletResponse;
    static deserializeBinaryFromReader(message: InitWalletResponse, reader: jspb.BinaryReader): InitWalletResponse;
}

export namespace InitWalletResponse {
    export type AsObject = {
    }
}

export class UnlockWalletRequest extends jspb.Message { 
    getWalletPassword(): Uint8Array | string;
    getWalletPassword_asU8(): Uint8Array;
    getWalletPassword_asB64(): string;
    setWalletPassword(value: Uint8Array | string): UnlockWalletRequest;

    getRecoveryWindow(): number;
    setRecoveryWindow(value: number): UnlockWalletRequest;


    hasChannelBackups(): boolean;
    clearChannelBackups(): void;
    getChannelBackups(): lndrpc_pb.ChanBackupSnapshot | undefined;
    setChannelBackups(value?: lndrpc_pb.ChanBackupSnapshot): UnlockWalletRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UnlockWalletRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UnlockWalletRequest): UnlockWalletRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UnlockWalletRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UnlockWalletRequest;
    static deserializeBinaryFromReader(message: UnlockWalletRequest, reader: jspb.BinaryReader): UnlockWalletRequest;
}

export namespace UnlockWalletRequest {
    export type AsObject = {
        walletPassword: Uint8Array | string,
        recoveryWindow: number,
        channelBackups?: lndrpc_pb.ChanBackupSnapshot.AsObject,
    }
}

export class UnlockWalletResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UnlockWalletResponse.AsObject;
    static toObject(includeInstance: boolean, msg: UnlockWalletResponse): UnlockWalletResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UnlockWalletResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UnlockWalletResponse;
    static deserializeBinaryFromReader(message: UnlockWalletResponse, reader: jspb.BinaryReader): UnlockWalletResponse;
}

export namespace UnlockWalletResponse {
    export type AsObject = {
    }
}

export class ChangePasswordRequest extends jspb.Message { 
    getCurrentPassword(): Uint8Array | string;
    getCurrentPassword_asU8(): Uint8Array;
    getCurrentPassword_asB64(): string;
    setCurrentPassword(value: Uint8Array | string): ChangePasswordRequest;

    getNewPassword(): Uint8Array | string;
    getNewPassword_asU8(): Uint8Array;
    getNewPassword_asB64(): string;
    setNewPassword(value: Uint8Array | string): ChangePasswordRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ChangePasswordRequest.AsObject;
    static toObject(includeInstance: boolean, msg: ChangePasswordRequest): ChangePasswordRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ChangePasswordRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ChangePasswordRequest;
    static deserializeBinaryFromReader(message: ChangePasswordRequest, reader: jspb.BinaryReader): ChangePasswordRequest;
}

export namespace ChangePasswordRequest {
    export type AsObject = {
        currentPassword: Uint8Array | string,
        newPassword: Uint8Array | string,
    }
}

export class ChangePasswordResponse extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ChangePasswordResponse.AsObject;
    static toObject(includeInstance: boolean, msg: ChangePasswordResponse): ChangePasswordResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ChangePasswordResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ChangePasswordResponse;
    static deserializeBinaryFromReader(message: ChangePasswordResponse, reader: jspb.BinaryReader): ChangePasswordResponse;
}

export namespace ChangePasswordResponse {
    export type AsObject = {
    }
}
