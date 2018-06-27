# Xud Protocol Buffers

`Xud` uses [Protocol Buffers](https://developers.google.com/protocol-buffers/) to define its [gRPC](https://grpc.io/) API service layer. This definition can be used to generate `Xud` clients in many popular programming languages.

## Updating the Xud Proto Defintion

Whenever `xudrpc.proto` is updated, the protobuf javascript code and type definitions must be regenerated.

1. Install [Go](https://golang.org/doc/install) and add it to your PATH.
2. Install [protoc 3.4.0](https://github.com/google/protobuf/releases/tag/v3.4.0) and add it to your PATH.
3. Install `protoc-gen-swagger` using the following command:

    ```bash
    go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-swagger
    ```

4. Run `npm run proto`.
