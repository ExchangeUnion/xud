# Generate protobuf definitions

1. Install `golang/protobuf` at commit `ab9f9a6dab164b7d1246e0e688b0ab7b94d8553e`

```bash
git clone https://github.com/golang/protobuf $GOPATH/src/github.com/golang/protobuf
cd $GOPATH/src/github.com/golang/protobuf
git reset --hard ab9f9a6dab164b7d1246e0e688b0ab7b94d8553e
make
```

1. Install `genproto`.

```bash
git clone https://github.com/google/go-genproto $GOPATH/src/google.golang.org/genproto
cd $GOPATH/src/google.golang.org/genproto
git reset --hard 40b7550fd0ba4b8f7e9d70ed40fcd4f3375db1de
```

1. Install `grpc-ecosystem/grpc-gateway` at commit `f2862b476edcef83412c7af8687c9cd8e4097c0f`

```bash
git clone https://github.com/grpc-ecosystem/grpc-gateway $GOPATH/src/github.com/grpc-ecosystem/grpc-gateway
cd $GOPATH/src/github.com/grpc-ecosystem/grpc-gateway
git reset --hard f2862b476edcef83412c7af8687c9cd8e4097c0f
go install ./protoc-gen-grpc-gateway ./protoc-gen-swagger
```

1. Run [`gen_protos.sh`](https://github.com/ExchangeUnion/xud/blob/master/test/simulation/xudrpc/gen_protos.sh) to generate new protobuf definitions
