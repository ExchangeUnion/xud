// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var swap_resolver_pb = require('./swap_resolver_pb.js');

function serialize_swapresolver_ResolveRequest(arg) {
  if (!(arg instanceof swap_resolver_pb.ResolveRequest)) {
    throw new Error('Expected argument of type swapresolver.ResolveRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_swapresolver_ResolveRequest(buffer_arg) {
  return swap_resolver_pb.ResolveRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_swapresolver_ResolveResponse(arg) {
  if (!(arg instanceof swap_resolver_pb.ResolveResponse)) {
    throw new Error('Expected argument of type swapresolver.ResolveResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_swapresolver_ResolveResponse(buffer_arg) {
  return swap_resolver_pb.ResolveResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var SwapResolverService = exports.SwapResolverService = {
  // ResolveHash is used by LND to request translation of Rhash to a pre-image.
  // the resolver may return the preimage and error indicating that there is no
  // such hash/deal
  resolveHash: {
    path: '/swapresolver.SwapResolver/ResolveHash',
    requestStream: false,
    responseStream: false,
    requestType: swap_resolver_pb.ResolveRequest,
    responseType: swap_resolver_pb.ResolveResponse,
    requestSerialize: serialize_swapresolver_ResolveRequest,
    requestDeserialize: deserialize_swapresolver_ResolveRequest,
    responseSerialize: serialize_swapresolver_ResolveResponse,
    responseDeserialize: deserialize_swapresolver_ResolveResponse,
  },
};

exports.SwapResolverClient = grpc.makeGenericClientConstructor(SwapResolverService);
