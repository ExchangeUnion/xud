# Xud Protocol Buffers

`Xud` uses [Protocol Buffers](https://developers.google.com/protocol-buffers/) to define its [gRPC](https://grpc.io/) API service layer. This definition can be used to generate `Xud` clients in many popular programming languages.

## Updating the Xud Proto Defintion

Whenever `xudrpc.proto` is updated, the protobuf javascript code and type definitions must be regenerated.

1. Install [Go](https://golang.org/doc/install) and add it to your PATH.

1. Install [protoc-gen-swagger](https://github.com/grpc-ecosystem/grpc-gateway) at v1.8.6.

```bash
git clone https://github.com/grpc-ecosystem/grpc-gateway $GOPATH/src/github.com/grpc-ecosystem/grpc-gateway
cd $GOPATH/src/github.com/grpc-ecosystem/grpc-gateway
git reset --hard v1.8.6
go install ./protoc-gen-swagger
```

1. Install latest [protoc-gen-doc](https://github.com/pseudomuto/protoc-gen-doc):

```bash
go get -u github.com/pseudomuto/protoc-gen-doc/cmd/protoc-gen-doc
```

1. Install `genproto` at commit a8101f21cf983e773d0c1133ebc5424792003214.

```bash
go get google.golang.org/genproto
cd $GOPATH/src/google.golang.org/genproto
git reset --hard a8101f21cf983e773d0c1133ebc5424792003214
```

1. Install `golang/protobuf` v1.3.1.

```bash
git clone https://github.com/golang/protobuf $GOPATH/src/github.com/golang/protobuf
cd $GOPATH/src/github.com/golang/protobuf
git reset --hard v1.3.1
make
```

1. Run `npm run proto`.
