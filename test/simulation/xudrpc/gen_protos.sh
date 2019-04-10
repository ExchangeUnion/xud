#!/bin/sh

# Generate the protos.
../../../node_modules/grpc-tools/bin/protoc -I/usr/local/include -I../../../proto/ \
       -I$GOPATH/src \
       -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
       --go_out=plugins=grpc:. \
       xudrpc.proto
