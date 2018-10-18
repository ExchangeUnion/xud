// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Copyright 2018 The Exchange Union Developers
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
'use strict';
var grpc = require('grpc');
var hash_resolver_pb = require('./hash_resolver_pb.js');

function serialize_hashresolver_ResolveRequest(arg) {
  if (!(arg instanceof hash_resolver_pb.ResolveRequest)) {
    throw new Error('Expected argument of type hashresolver.ResolveRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_hashresolver_ResolveRequest(buffer_arg) {
  return hash_resolver_pb.ResolveRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hashresolver_ResolveResponse(arg) {
  if (!(arg instanceof hash_resolver_pb.ResolveResponse)) {
    throw new Error('Expected argument of type hashresolver.ResolveResponse');
  }
  return Buffer.from(arg.serializeBinary());
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
