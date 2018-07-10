// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var xudrpc_pb = require('./xudrpc_pb.js');
var annotations_pb = require('./annotations_pb.js');

function serialize_xudrpc_AddInvoiceRequest(arg) {
  if (!(arg instanceof xudrpc_pb.AddInvoiceRequest)) {
    throw new Error('Expected argument of type xudrpc.AddInvoiceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_AddInvoiceRequest(buffer_arg) {
  return xudrpc_pb.AddInvoiceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_AddInvoiceResponse(arg) {
  if (!(arg instanceof xudrpc_pb.AddInvoiceResponse)) {
    throw new Error('Expected argument of type xudrpc.AddInvoiceResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_AddInvoiceResponse(buffer_arg) {
  return xudrpc_pb.AddInvoiceResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_PayInvoiceRequest(arg) {
  if (!(arg instanceof xudrpc_pb.PayInvoiceRequest)) {
    throw new Error('Expected argument of type xudrpc.PayInvoiceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_PayInvoiceRequest(buffer_arg) {
  return xudrpc_pb.PayInvoiceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_PayInvoiceResponse(arg) {
  if (!(arg instanceof xudrpc_pb.PayInvoiceResponse)) {
    throw new Error('Expected argument of type xudrpc.PayInvoiceResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_PayInvoiceResponse(buffer_arg) {
  return xudrpc_pb.PayInvoiceResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_SubscribeInvoicesRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeInvoicesRequest)) {
    throw new Error('Expected argument of type xudrpc.SubscribeInvoicesRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeInvoicesRequest(buffer_arg) {
  return xudrpc_pb.SubscribeInvoicesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribeInvoicesResponse(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeInvoicesResponse)) {
    throw new Error('Expected argument of type xudrpc.SubscribeInvoicesResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeInvoicesResponse(buffer_arg) {
  return xudrpc_pb.SubscribeInvoicesResponse.deserializeBinary(new Uint8Array(buffer_arg));
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
  // Get the list of the order book's available pairs. 
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
  // Get a list of standing orders from the order book. 
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
  // Add an order to the order book. 
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
  // Add a new Lightning invoice 
  addInvoice: {
    path: '/xudrpc.Xud/AddInvoice',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.AddInvoiceRequest,
    responseType: xudrpc_pb.AddInvoiceResponse,
    requestSerialize: serialize_xudrpc_AddInvoiceRequest,
    requestDeserialize: deserialize_xudrpc_AddInvoiceRequest,
    responseSerialize: serialize_xudrpc_AddInvoiceResponse,
    responseDeserialize: deserialize_xudrpc_AddInvoiceResponse,
  },
  // Pay a Lightning invoice. 
  payInvoice: {
    path: '/xudrpc.Xud/PayInvoice',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.PayInvoiceRequest,
    responseType: xudrpc_pb.PayInvoiceResponse,
    requestSerialize: serialize_xudrpc_PayInvoiceRequest,
    requestDeserialize: deserialize_xudrpc_PayInvoiceRequest,
    responseSerialize: serialize_xudrpc_PayInvoiceResponse,
    responseDeserialize: deserialize_xudrpc_PayInvoiceResponse,
  },
  // Uni-directional stream (server -> client) containing all settled invoices 
  subscribeInvoices: {
    path: '/xudrpc.Xud/SubscribeInvoices',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.SubscribeInvoicesRequest,
    responseType: xudrpc_pb.SubscribeInvoicesResponse,
    requestSerialize: serialize_xudrpc_SubscribeInvoicesRequest,
    requestDeserialize: deserialize_xudrpc_SubscribeInvoicesRequest,
    responseSerialize: serialize_xudrpc_SubscribeInvoicesResponse,
    responseDeserialize: deserialize_xudrpc_SubscribeInvoicesResponse,
  },
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
  // Shutdown the xud daemon. 
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
