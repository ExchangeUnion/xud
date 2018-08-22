// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var swap_resolver_pb = require('./swap_resolver_pb.js');

function serialize_swapresolver_ResolveReq(arg) {
  if (!(arg instanceof swap_resolver_pb.ResolveReq)) {
    throw new Error('Expected argument of type swapresolver.ResolveReq');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_swapresolver_ResolveReq(buffer_arg) {
  return swap_resolver_pb.ResolveReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_swapresolver_ResolveResp(arg) {
  if (!(arg instanceof swap_resolver_pb.ResolveResp)) {
    throw new Error('Expected argument of type swapresolver.ResolveResp');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_swapresolver_ResolveResp(buffer_arg) {
  return swap_resolver_pb.ResolveResp.deserializeBinary(new Uint8Array(buffer_arg));
}


var SwapResolverService = exports.SwapResolverService = {
  // ResolveHash is used by LND to request translation of Rhash to a pre-image.
  // the resolver may return the preimage and error indicating that there is no
  // such hash/deal
  resolveHash: {
    path: '/swapresolver.SwapResolver/ResolveHash',
    requestStream: false,
    responseStream: false,
    requestType: swap_resolver_pb.ResolveReq,
    responseType: swap_resolver_pb.ResolveResp,
    requestSerialize: serialize_swapresolver_ResolveReq,
    requestDeserialize: deserialize_swapresolver_ResolveReq,
    responseSerialize: serialize_swapresolver_ResolveResp,
    responseDeserialize: deserialize_swapresolver_ResolveResp,
  },
};

exports.SwapResolverClient = grpc.makeGenericClientConstructor(SwapResolverService);
