// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var hash_resolver_pb = require('./hash_resolver_pb.js');

function serialize_hashresolver_ResolveRequest(arg) {
  if (!(arg instanceof hash_resolver_pb.ResolveRequest)) {
    throw new Error('Expected argument of type hashresolver.ResolveRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_hashresolver_ResolveRequest(buffer_arg) {
  return hash_resolver_pb.ResolveRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hashresolver_ResolveResponse(arg) {
  if (!(arg instanceof hash_resolver_pb.ResolveResponse)) {
    throw new Error('Expected argument of type hashresolver.ResolveResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_hashresolver_ResolveResponse(buffer_arg) {
  return hash_resolver_pb.ResolveResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var HashResolverService = exports.HashResolverService = {
  // ResolveHash is used by LND to request translation of Rhash to a pre-image.
  // the resolver may return the preimage and error indicating that there is no
  // such hash/deal
  resolveHash: {
    path: '/hashresolver.HashResolver/ResolveHash',
    requestStream: false,
    responseStream: false,
    requestType: hash_resolver_pb.ResolveRequest,
    responseType: hash_resolver_pb.ResolveResponse,
    requestSerialize: serialize_hashresolver_ResolveRequest,
    requestDeserialize: deserialize_hashresolver_ResolveRequest,
    responseSerialize: serialize_hashresolver_ResolveResponse,
    responseDeserialize: deserialize_hashresolver_ResolveResponse,
  },
};

exports.HashResolverClient = grpc.makeGenericClientConstructor(HashResolverService);
