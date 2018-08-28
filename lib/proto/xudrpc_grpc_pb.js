// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var xudrpc_pb = require('./xudrpc_pb.js');
var annotations_pb = require('./annotations_pb.js');

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

function serialize_xudrpc_ChannelBalanceRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ChannelBalanceRequest)) {
    throw new Error('Expected argument of type xudrpc.ChannelBalanceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ChannelBalanceRequest(buffer_arg) {
  return xudrpc_pb.ChannelBalanceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ChannelBalanceResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ChannelBalanceResponse)) {
    throw new Error('Expected argument of type xudrpc.ChannelBalanceResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ChannelBalanceResponse(buffer_arg) {
  return xudrpc_pb.ChannelBalanceResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_ExecuteSwapRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ExecuteSwapRequest)) {
    throw new Error('Expected argument of type xudrpc.ExecuteSwapRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ExecuteSwapRequest(buffer_arg) {
  return xudrpc_pb.ExecuteSwapRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ExecuteSwapResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ExecuteSwapResponse)) {
    throw new Error('Expected argument of type xudrpc.ExecuteSwapResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ExecuteSwapResponse(buffer_arg) {
  return xudrpc_pb.ExecuteSwapResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_ListPeersRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ListPeersRequest)) {
    throw new Error('Expected argument of type xudrpc.ListPeersRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ListPeersRequest(buffer_arg) {
  return xudrpc_pb.ListPeersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ListPeersResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ListPeersResponse)) {
    throw new Error('Expected argument of type xudrpc.ListPeersResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ListPeersResponse(buffer_arg) {
  return xudrpc_pb.ListPeersResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_SubscribePeerOrdersRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribePeerOrdersRequest)) {
    throw new Error('Expected argument of type xudrpc.SubscribePeerOrdersRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribePeerOrdersRequest(buffer_arg) {
  return xudrpc_pb.SubscribePeerOrdersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribePeerOrdersResponse(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribePeerOrdersResponse)) {
    throw new Error('Expected argument of type xudrpc.SubscribePeerOrdersResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribePeerOrdersResponse(buffer_arg) {
  return xudrpc_pb.SubscribePeerOrdersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribeSwapsRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeSwapsRequest)) {
    throw new Error('Expected argument of type xudrpc.SubscribeSwapsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeSwapsRequest(buffer_arg) {
  return xudrpc_pb.SubscribeSwapsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribeSwapsResponse(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeSwapsResponse)) {
    throw new Error('Expected argument of type xudrpc.SubscribeSwapsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeSwapsResponse(buffer_arg) {
  return xudrpc_pb.SubscribeSwapsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var XudService = exports.XudService = {
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
  // Get the total balance available across all channels for a given currency. 
  channelBalance: {
    path: '/xudrpc.Xud/ChannelBalance',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.ChannelBalanceRequest,
    responseType: xudrpc_pb.ChannelBalanceResponse,
    requestSerialize: serialize_xudrpc_ChannelBalanceRequest,
    requestDeserialize: deserialize_xudrpc_ChannelBalanceRequest,
    responseSerialize: serialize_xudrpc_ChannelBalanceResponse,
    responseDeserialize: deserialize_xudrpc_ChannelBalanceResponse,
  },
  // Connect to an XU node. 
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
  // Disconnect from a connected peer XU node. 
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
  // Execute an atomic swap 
  executeSwap: {
    path: '/xudrpc.Xud/ExecuteSwap',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.ExecuteSwapRequest,
    responseType: xudrpc_pb.ExecuteSwapResponse,
    requestSerialize: serialize_xudrpc_ExecuteSwapRequest,
    requestDeserialize: deserialize_xudrpc_ExecuteSwapRequest,
    responseSerialize: serialize_xudrpc_ExecuteSwapResponse,
    responseDeserialize: deserialize_xudrpc_ExecuteSwapResponse,
  },
  // Get general information about this Exchange Union node. 
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
  // Get a list of connected peers. 
  listPeers: {
    path: '/xudrpc.Xud/ListPeers',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.ListPeersRequest,
    responseType: xudrpc_pb.ListPeersResponse,
    requestSerialize: serialize_xudrpc_ListPeersRequest,
    requestDeserialize: deserialize_xudrpc_ListPeersRequest,
    responseSerialize: serialize_xudrpc_ListPeersResponse,
    responseDeserialize: deserialize_xudrpc_ListPeersResponse,
  },
  // Add an order to the order book.
  // If price is zero or unspecified a market order will get added.
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
  // Begin shutting down xud. 
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
  // Subscribe to peer order events. 
  subscribePeerOrders: {
    path: '/xudrpc.Xud/SubscribePeerOrders',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.SubscribePeerOrdersRequest,
    responseType: xudrpc_pb.SubscribePeerOrdersResponse,
    requestSerialize: serialize_xudrpc_SubscribePeerOrdersRequest,
    requestDeserialize: deserialize_xudrpc_SubscribePeerOrdersRequest,
    responseSerialize: serialize_xudrpc_SubscribePeerOrdersResponse,
    responseDeserialize: deserialize_xudrpc_SubscribePeerOrdersResponse,
  },
  // Subscribe executed swaps. 
  subscribeSwaps: {
    path: '/xudrpc.Xud/SubscribeSwaps',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.SubscribeSwapsRequest,
    responseType: xudrpc_pb.SubscribeSwapsResponse,
    requestSerialize: serialize_xudrpc_SubscribeSwapsRequest,
    requestDeserialize: deserialize_xudrpc_SubscribeSwapsRequest,
    responseSerialize: serialize_xudrpc_SubscribeSwapsResponse,
    responseDeserialize: deserialize_xudrpc_SubscribeSwapsResponse,
  },
};

exports.XudClient = grpc.makeGenericClientConstructor(XudService);
