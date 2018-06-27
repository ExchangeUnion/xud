// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var xudrpc_pb = require('./xudrpc_pb.js');
var annotations_pb = require('./annotations_pb.js');
var lndrpc_pb = require('./lndrpc_pb.js');

function serialize_xudrpc_CancelOrderRequest(arg) {
  if (!(arg instanceof xudrpc_pb.CancelOrderRequest)) {
    throw new Error('Expected argument of type xudrpc.CancelOrderRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_CancelOrderRequest(buffer_arg) {
  return xudrpc_pb.CancelOrderRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_CancelOrderResponse(arg) {
  if (!(arg instanceof xudrpc_pb.CancelOrderResponse)) {
    throw new Error('Expected argument of type xudrpc.CancelOrderResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_CancelOrderResponse(buffer_arg) {
  return xudrpc_pb.CancelOrderResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ConnectRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ConnectRequest)) {
    throw new Error('Expected argument of type xudrpc.ConnectRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ConnectRequest(buffer_arg) {
  return xudrpc_pb.ConnectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ConnectResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ConnectResponse)) {
    throw new Error('Expected argument of type xudrpc.ConnectResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ConnectResponse(buffer_arg) {
  return xudrpc_pb.ConnectResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_DisconnectRequest(arg) {
  if (!(arg instanceof xudrpc_pb.DisconnectRequest)) {
    throw new Error('Expected argument of type xudrpc.DisconnectRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_DisconnectRequest(buffer_arg) {
  return xudrpc_pb.DisconnectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_DisconnectResponse(arg) {
  if (!(arg instanceof xudrpc_pb.DisconnectResponse)) {
    throw new Error('Expected argument of type xudrpc.DisconnectResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_DisconnectResponse(buffer_arg) {
  return xudrpc_pb.DisconnectResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetInfoRequest(arg) {
  if (!(arg instanceof xudrpc_pb.GetInfoRequest)) {
    throw new Error('Expected argument of type xudrpc.GetInfoRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_GetInfoRequest(buffer_arg) {
  return xudrpc_pb.GetInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetInfoResponse(arg) {
  if (!(arg instanceof xudrpc_pb.GetInfoResponse)) {
    throw new Error('Expected argument of type xudrpc.GetInfoResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_GetInfoResponse(buffer_arg) {
  return xudrpc_pb.GetInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetOrdersRequest(arg) {
  if (!(arg instanceof xudrpc_pb.GetOrdersRequest)) {
    throw new Error('Expected argument of type xudrpc.GetOrdersRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_GetOrdersRequest(buffer_arg) {
  return xudrpc_pb.GetOrdersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetOrdersResponse(arg) {
  if (!(arg instanceof xudrpc_pb.GetOrdersResponse)) {
    throw new Error('Expected argument of type xudrpc.GetOrdersResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_GetOrdersResponse(buffer_arg) {
  return xudrpc_pb.GetOrdersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetPairsRequest(arg) {
  if (!(arg instanceof xudrpc_pb.GetPairsRequest)) {
    throw new Error('Expected argument of type xudrpc.GetPairsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_GetPairsRequest(buffer_arg) {
  return xudrpc_pb.GetPairsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetPairsResponse(arg) {
  if (!(arg instanceof xudrpc_pb.GetPairsResponse)) {
    throw new Error('Expected argument of type xudrpc.GetPairsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_GetPairsResponse(buffer_arg) {
  return xudrpc_pb.GetPairsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_PlaceOrderRequest(arg) {
  if (!(arg instanceof xudrpc_pb.PlaceOrderRequest)) {
    throw new Error('Expected argument of type xudrpc.PlaceOrderRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_PlaceOrderRequest(buffer_arg) {
  return xudrpc_pb.PlaceOrderRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_PlaceOrderResponse(arg) {
  if (!(arg instanceof xudrpc_pb.PlaceOrderResponse)) {
    throw new Error('Expected argument of type xudrpc.PlaceOrderResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_PlaceOrderResponse(buffer_arg) {
  return xudrpc_pb.PlaceOrderResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ShutdownRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ShutdownRequest)) {
    throw new Error('Expected argument of type xudrpc.ShutdownRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ShutdownRequest(buffer_arg) {
  return xudrpc_pb.ShutdownRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ShutdownResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ShutdownResponse)) {
    throw new Error('Expected argument of type xudrpc.ShutdownResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ShutdownResponse(buffer_arg) {
  return xudrpc_pb.ShutdownResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_StreamingExampleRequest(arg) {
  if (!(arg instanceof xudrpc_pb.StreamingExampleRequest)) {
    throw new Error('Expected argument of type xudrpc.StreamingExampleRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_StreamingExampleRequest(buffer_arg) {
  return xudrpc_pb.StreamingExampleRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_StreamingExampleResponse(arg) {
  if (!(arg instanceof xudrpc_pb.StreamingExampleResponse)) {
    throw new Error('Expected argument of type xudrpc.StreamingExampleResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_StreamingExampleResponse(buffer_arg) {
  return xudrpc_pb.StreamingExampleResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_TokenSwapRequest(arg) {
  if (!(arg instanceof xudrpc_pb.TokenSwapRequest)) {
    throw new Error('Expected argument of type xudrpc.TokenSwapRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_TokenSwapRequest(buffer_arg) {
  return xudrpc_pb.TokenSwapRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_TokenSwapResponse(arg) {
  if (!(arg instanceof xudrpc_pb.TokenSwapResponse)) {
    throw new Error('Expected argument of type xudrpc.TokenSwapResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_TokenSwapResponse(buffer_arg) {
  return xudrpc_pb.TokenSwapResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var XudService = exports.XudService = {
  // *
  // Placeholder for a method to return general information about an Exchange Union node.
  getInfo: {
    path: '/xudrpc.Xud/GetInfo',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.GetInfoRequest,
    responseType: xudrpc_pb.GetInfoResponse,
    requestSerialize: serialize_xudrpc_GetInfoRequest,
    requestDeserialize: deserialize_xudrpc_GetInfoRequest,
    responseSerialize: serialize_xudrpc_GetInfoResponse,
    responseDeserialize: deserialize_xudrpc_GetInfoResponse,
  },
  // *
  // Get the list of the orderbook's available pairs.
  getPairs: {
    path: '/xudrpc.Xud/GetPairs',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.GetPairsRequest,
    responseType: xudrpc_pb.GetPairsResponse,
    requestSerialize: serialize_xudrpc_GetPairsRequest,
    requestDeserialize: deserialize_xudrpc_GetPairsRequest,
    responseSerialize: serialize_xudrpc_GetPairsResponse,
    responseDeserialize: deserialize_xudrpc_GetPairsResponse,
  },
  // *
  // Get a list of standing orders from the orderbook.
  getOrders: {
    path: '/xudrpc.Xud/GetOrders',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.GetOrdersRequest,
    responseType: xudrpc_pb.GetOrdersResponse,
    requestSerialize: serialize_xudrpc_GetOrdersRequest,
    requestDeserialize: deserialize_xudrpc_GetOrdersRequest,
    responseSerialize: serialize_xudrpc_GetOrdersResponse,
    responseDeserialize: deserialize_xudrpc_GetOrdersResponse,
  },
  // *
  // Example for a server-side streaming call
  streamingExample: {
    path: '/xudrpc.Xud/StreamingExample',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.StreamingExampleRequest,
    responseType: xudrpc_pb.StreamingExampleResponse,
    requestSerialize: serialize_xudrpc_StreamingExampleRequest,
    requestDeserialize: deserialize_xudrpc_StreamingExampleRequest,
    responseSerialize: serialize_xudrpc_StreamingExampleResponse,
    responseDeserialize: deserialize_xudrpc_StreamingExampleResponse,
  },
  // *
  // Add an order to the orderbook.
  placeOrder: {
    path: '/xudrpc.Xud/PlaceOrder',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.PlaceOrderRequest,
    responseType: xudrpc_pb.PlaceOrderResponse,
    requestSerialize: serialize_xudrpc_PlaceOrderRequest,
    requestDeserialize: deserialize_xudrpc_PlaceOrderRequest,
    responseSerialize: serialize_xudrpc_PlaceOrderResponse,
    responseDeserialize: deserialize_xudrpc_PlaceOrderResponse,
  },
  // *
  // Cancel placed order from the orderbook.
  cancelOrder: {
    path: '/xudrpc.Xud/CancelOrder',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.CancelOrderRequest,
    responseType: xudrpc_pb.CancelOrderResponse,
    requestSerialize: serialize_xudrpc_CancelOrderRequest,
    requestDeserialize: deserialize_xudrpc_CancelOrderRequest,
    responseSerialize: serialize_xudrpc_CancelOrderResponse,
    responseDeserialize: deserialize_xudrpc_CancelOrderResponse,
  },
  // *
  // Connect to an XU node on a given host and port.
  connect: {
    path: '/xudrpc.Xud/Connect',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.ConnectRequest,
    responseType: xudrpc_pb.ConnectResponse,
    requestSerialize: serialize_xudrpc_ConnectRequest,
    requestDeserialize: deserialize_xudrpc_ConnectRequest,
    responseSerialize: serialize_xudrpc_ConnectResponse,
    responseDeserialize: deserialize_xudrpc_ConnectResponse,
  },
  // *
  // Disconnect from an connected peer XU node on a given host and port.
  disconnect: {
    path: '/xudrpc.Xud/Disconnect',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.DisconnectRequest,
    responseType: xudrpc_pb.DisconnectResponse,
    requestSerialize: serialize_xudrpc_DisconnectRequest,
    requestDeserialize: deserialize_xudrpc_DisconnectRequest,
    responseSerialize: serialize_xudrpc_DisconnectResponse,
    responseDeserialize: deserialize_xudrpc_DisconnectResponse,
  },
  // *
  // Demo method to execute a Raiden Token Swap through XUD. 
  tokenSwap: {
    path: '/xudrpc.Xud/TokenSwap',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.TokenSwapRequest,
    responseType: xudrpc_pb.TokenSwapResponse,
    requestSerialize: serialize_xudrpc_TokenSwapRequest,
    requestDeserialize: deserialize_xudrpc_TokenSwapRequest,
    responseSerialize: serialize_xudrpc_TokenSwapResponse,
    responseDeserialize: deserialize_xudrpc_TokenSwapResponse,
  },
  shutdown: {
    path: '/xudrpc.Xud/Shutdown',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.ShutdownRequest,
    responseType: xudrpc_pb.ShutdownResponse,
    requestSerialize: serialize_xudrpc_ShutdownRequest,
    requestDeserialize: deserialize_xudrpc_ShutdownRequest,
    responseSerialize: serialize_xudrpc_ShutdownResponse,
    responseDeserialize: deserialize_xudrpc_ShutdownResponse,
  },
};

exports.XudClient = grpc.makeGenericClientConstructor(XudService);
