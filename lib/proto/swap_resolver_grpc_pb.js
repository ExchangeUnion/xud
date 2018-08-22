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

function serialize_swapresolver_SuggestDealReq(arg) {
  if (!(arg instanceof swap_resolver_pb.SuggestDealReq)) {
    throw new Error('Expected argument of type swapresolver.SuggestDealReq');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_swapresolver_SuggestDealReq(buffer_arg) {
  return swap_resolver_pb.SuggestDealReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_swapresolver_SuggestDealResp(arg) {
  if (!(arg instanceof swap_resolver_pb.SuggestDealResp)) {
    throw new Error('Expected argument of type swapresolver.SuggestDealResp');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_swapresolver_SuggestDealResp(buffer_arg) {
  return swap_resolver_pb.SuggestDealResp.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_swapresolver_SwapReq(arg) {
  if (!(arg instanceof swap_resolver_pb.SwapReq)) {
    throw new Error('Expected argument of type swapresolver.SwapReq');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_swapresolver_SwapReq(buffer_arg) {
  return swap_resolver_pb.SwapReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_swapresolver_SwapResp(arg) {
  if (!(arg instanceof swap_resolver_pb.SwapResp)) {
    throw new Error('Expected argument of type swapresolver.SwapResp');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_swapresolver_SwapResp(buffer_arg) {
  return swap_resolver_pb.SwapResp.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_swapresolver_TakeOrderReq(arg) {
  if (!(arg instanceof swap_resolver_pb.TakeOrderReq)) {
    throw new Error('Expected argument of type swapresolver.TakeOrderReq');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_swapresolver_TakeOrderReq(buffer_arg) {
  return swap_resolver_pb.TakeOrderReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_swapresolver_TakeOrderResp(arg) {
  if (!(arg instanceof swap_resolver_pb.TakeOrderResp)) {
    throw new Error('Expected argument of type swapresolver.TakeOrderResp');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_swapresolver_TakeOrderResp(buffer_arg) {
  return swap_resolver_pb.TakeOrderResp.deserializeBinary(new Uint8Array(buffer_arg));
}


// Interface exported by the server.
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
// Todo: this should be in a different proto file to keep the concep of resolver clean
var P2PService = exports.P2PService = {
  // TakeOrder is called to initiate a swap between maker and taker
  // it is a temporary service needed until the integration with XUD
  // intended to be called from CLI to simulate order taking by taker
  takeOrder: {
    path: '/swapresolver.P2P/TakeOrder',
    requestStream: false,
    responseStream: false,
    requestType: swap_resolver_pb.TakeOrderReq,
    responseType: swap_resolver_pb.TakeOrderResp,
    requestSerialize: serialize_swapresolver_TakeOrderReq,
    requestDeserialize: deserialize_swapresolver_TakeOrderReq,
    responseSerialize: serialize_swapresolver_TakeOrderResp,
    responseDeserialize: deserialize_swapresolver_TakeOrderResp,
  },
  // SuggestDeal is called by the taker to inform the maker that he
  // would like to execute a swap. The maker may reject the request
  // for now, the maker can only accept/reject and can't rediscuss the
  // deal or suggest partial amount. If accepted the maker should respond
  // with a hash that would be used for teh swap.
  suggestDeal: {
    path: '/swapresolver.P2P/SuggestDeal',
    requestStream: false,
    responseStream: false,
    requestType: swap_resolver_pb.SuggestDealReq,
    responseType: swap_resolver_pb.SuggestDealResp,
    requestSerialize: serialize_swapresolver_SuggestDealReq,
    requestDeserialize: deserialize_swapresolver_SuggestDealReq,
    responseSerialize: serialize_swapresolver_SuggestDealResp,
    responseDeserialize: deserialize_swapresolver_SuggestDealResp,
  },
  // Swap initiates the swap. It is called by the taker to confirm that
  // he has the hash and confirm the deal.
  swap: {
    path: '/swapresolver.P2P/Swap',
    requestStream: false,
    responseStream: false,
    requestType: swap_resolver_pb.SwapReq,
    responseType: swap_resolver_pb.SwapResp,
    requestSerialize: serialize_swapresolver_SwapReq,
    requestDeserialize: deserialize_swapresolver_SwapReq,
    responseSerialize: serialize_swapresolver_SwapResp,
    responseDeserialize: deserialize_swapresolver_SwapResp,
  },
};

exports.P2PClient = grpc.makeGenericClientConstructor(P2PService);
