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
var xudrpc_pb = require('./xudrpc_pb.js');
var annotations_pb = require('./annotations_pb.js');

function serialize_xudrpc_AddCurrencyRequest(arg) {
  if (!(arg instanceof xudrpc_pb.AddCurrencyRequest)) {
    throw new Error('Expected argument of type xudrpc.AddCurrencyRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_AddCurrencyRequest(buffer_arg) {
  return xudrpc_pb.AddCurrencyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_AddCurrencyResponse(arg) {
  if (!(arg instanceof xudrpc_pb.AddCurrencyResponse)) {
    throw new Error('Expected argument of type xudrpc.AddCurrencyResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_AddCurrencyResponse(buffer_arg) {
  return xudrpc_pb.AddCurrencyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_AddPairRequest(arg) {
  if (!(arg instanceof xudrpc_pb.AddPairRequest)) {
    throw new Error('Expected argument of type xudrpc.AddPairRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_AddPairRequest(buffer_arg) {
  return xudrpc_pb.AddPairRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_AddPairResponse(arg) {
  if (!(arg instanceof xudrpc_pb.AddPairResponse)) {
    throw new Error('Expected argument of type xudrpc.AddPairResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_AddPairResponse(buffer_arg) {
  return xudrpc_pb.AddPairResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

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

function serialize_xudrpc_ListCurrenciesRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ListCurrenciesRequest)) {
    throw new Error('Expected argument of type xudrpc.ListCurrenciesRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ListCurrenciesRequest(buffer_arg) {
  return xudrpc_pb.ListCurrenciesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ListCurrenciesResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ListCurrenciesResponse)) {
    throw new Error('Expected argument of type xudrpc.ListCurrenciesResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ListCurrenciesResponse(buffer_arg) {
  return xudrpc_pb.ListCurrenciesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ListPairsRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ListPairsRequest)) {
    throw new Error('Expected argument of type xudrpc.ListPairsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ListPairsRequest(buffer_arg) {
  return xudrpc_pb.ListPairsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ListPairsResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ListPairsResponse)) {
    throw new Error('Expected argument of type xudrpc.ListPairsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ListPairsResponse(buffer_arg) {
  return xudrpc_pb.ListPairsResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_Order(arg) {
  if (!(arg instanceof xudrpc_pb.Order)) {
    throw new Error('Expected argument of type xudrpc.Order');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_Order(buffer_arg) {
  return xudrpc_pb.Order.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_OrderRemoval(arg) {
  if (!(arg instanceof xudrpc_pb.OrderRemoval)) {
    throw new Error('Expected argument of type xudrpc.OrderRemoval');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_OrderRemoval(buffer_arg) {
  return xudrpc_pb.OrderRemoval.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_RemoveCurrencyRequest(arg) {
  if (!(arg instanceof xudrpc_pb.RemoveCurrencyRequest)) {
    throw new Error('Expected argument of type xudrpc.RemoveCurrencyRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_RemoveCurrencyRequest(buffer_arg) {
  return xudrpc_pb.RemoveCurrencyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_RemoveCurrencyResponse(arg) {
  if (!(arg instanceof xudrpc_pb.RemoveCurrencyResponse)) {
    throw new Error('Expected argument of type xudrpc.RemoveCurrencyResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_RemoveCurrencyResponse(buffer_arg) {
  return xudrpc_pb.RemoveCurrencyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_RemovePairRequest(arg) {
  if (!(arg instanceof xudrpc_pb.RemovePairRequest)) {
    throw new Error('Expected argument of type xudrpc.RemovePairRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_RemovePairRequest(buffer_arg) {
  return xudrpc_pb.RemovePairRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_RemovePairResponse(arg) {
  if (!(arg instanceof xudrpc_pb.RemovePairResponse)) {
    throw new Error('Expected argument of type xudrpc.RemovePairResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_RemovePairResponse(buffer_arg) {
  return xudrpc_pb.RemovePairResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_SubscribeAddedOrdersRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeAddedOrdersRequest)) {
    throw new Error('Expected argument of type xudrpc.SubscribeAddedOrdersRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeAddedOrdersRequest(buffer_arg) {
  return xudrpc_pb.SubscribeAddedOrdersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribeRemovedOrdersRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeRemovedOrdersRequest)) {
    throw new Error('Expected argument of type xudrpc.SubscribeRemovedOrdersRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeRemovedOrdersRequest(buffer_arg) {
  return xudrpc_pb.SubscribeRemovedOrdersRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_SwapResult(arg) {
  if (!(arg instanceof xudrpc_pb.SwapResult)) {
    throw new Error('Expected argument of type xudrpc.SwapResult');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SwapResult(buffer_arg) {
  return xudrpc_pb.SwapResult.deserializeBinary(new Uint8Array(buffer_arg));
}


var XudService = exports.XudService = {
  // Add a currency to the list of supported currencies. 
  addCurrency: {
    path: '/xudrpc.Xud/AddCurrency',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.AddCurrencyRequest,
    responseType: xudrpc_pb.AddCurrencyResponse,
    requestSerialize: serialize_xudrpc_AddCurrencyRequest,
    requestDeserialize: deserialize_xudrpc_AddCurrencyRequest,
    responseSerialize: serialize_xudrpc_AddCurrencyResponse,
    responseDeserialize: deserialize_xudrpc_AddCurrencyResponse,
  },
  // Add a trading pair to the list of supported trading pairs. 
  addPair: {
    path: '/xudrpc.Xud/AddPair',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.AddPairRequest,
    responseType: xudrpc_pb.AddPairResponse,
    requestSerialize: serialize_xudrpc_AddPairRequest,
    requestDeserialize: deserialize_xudrpc_AddPairRequest,
    responseSerialize: serialize_xudrpc_AddPairResponse,
    responseDeserialize: deserialize_xudrpc_AddPairResponse,
  },
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
  // Gets orders from the order book. This call returns the state of the order book at a given point
  // in time, although it is not guaranteed to still be vaild by the time a response is received
  // and processed by a client. It accepts an optional trading pair id parameter. If specified, only
  // orders for that particular trading pair are returned. Otherwise, all orders are returned. Orders
  // are separated into buys and sells for each trading pair, but unsorted. 
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
  // Get the list of the order book's supported currencies. 
  listCurrencies: {
    path: '/xudrpc.Xud/ListCurrencies',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.ListCurrenciesRequest,
    responseType: xudrpc_pb.ListCurrenciesResponse,
    requestSerialize: serialize_xudrpc_ListCurrenciesRequest,
    requestDeserialize: deserialize_xudrpc_ListCurrenciesRequest,
    responseSerialize: serialize_xudrpc_ListCurrenciesResponse,
    responseDeserialize: deserialize_xudrpc_ListCurrenciesResponse,
  },
  // Get the list of the order book's suported trading pairs. 
  listPairs: {
    path: '/xudrpc.Xud/ListPairs',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.ListPairsRequest,
    responseType: xudrpc_pb.ListPairsResponse,
    requestSerialize: serialize_xudrpc_ListPairsRequest,
    requestDeserialize: deserialize_xudrpc_ListPairsRequest,
    responseSerialize: serialize_xudrpc_ListPairsResponse,
    responseDeserialize: deserialize_xudrpc_ListPairsResponse,
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
  // Remove a currency. 
  removeCurrency: {
    path: '/xudrpc.Xud/RemoveCurrency',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.RemoveCurrencyRequest,
    responseType: xudrpc_pb.RemoveCurrencyResponse,
    requestSerialize: serialize_xudrpc_RemoveCurrencyRequest,
    requestDeserialize: deserialize_xudrpc_RemoveCurrencyRequest,
    responseSerialize: serialize_xudrpc_RemoveCurrencyResponse,
    responseDeserialize: deserialize_xudrpc_RemoveCurrencyResponse,
  },
  // Remove a trading pair. 
  removePair: {
    path: '/xudrpc.Xud/RemovePair',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.RemovePairRequest,
    responseType: xudrpc_pb.RemovePairResponse,
    requestSerialize: serialize_xudrpc_RemovePairRequest,
    requestDeserialize: deserialize_xudrpc_RemovePairRequest,
    responseSerialize: serialize_xudrpc_RemovePairResponse,
    responseDeserialize: deserialize_xudrpc_RemovePairResponse,
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
  // Subscribes to orders being added to the order book. This call, together with SubscribeRemovedOrders,
  // allows the client to maintain an up-to-date view of the order book. For example, an exchange that
  // wants to show its users a real time list of the orders available to them would subscribe to this
  // streaming call to be alerted of new orders as they become available for trading. 
  subscribeAddedOrders: {
    path: '/xudrpc.Xud/SubscribeAddedOrders',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.SubscribeAddedOrdersRequest,
    responseType: xudrpc_pb.Order,
    requestSerialize: serialize_xudrpc_SubscribeAddedOrdersRequest,
    requestDeserialize: deserialize_xudrpc_SubscribeAddedOrdersRequest,
    responseSerialize: serialize_xudrpc_Order,
    responseDeserialize: deserialize_xudrpc_Order,
  },
  // Subscribes to orders being removed - either in full or in part - from the order book. This call,
  // together with SubscribeAddedOrders, allows the client to maintain an up-to-date view of the order
  // book. For example, an exchange that wants to show its users a real time list of the orders available
  // to them would subscribe to this streaming call to be alerted when part or all of an existing order
  // is no longer available for trading. 
  subscribeRemovedOrders: {
    path: '/xudrpc.Xud/SubscribeRemovedOrders',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.SubscribeRemovedOrdersRequest,
    responseType: xudrpc_pb.OrderRemoval,
    requestSerialize: serialize_xudrpc_SubscribeRemovedOrdersRequest,
    requestDeserialize: deserialize_xudrpc_SubscribeRemovedOrdersRequest,
    responseSerialize: serialize_xudrpc_OrderRemoval,
    responseDeserialize: deserialize_xudrpc_OrderRemoval,
  },
  // Subscribes to completed swaps that are initiated by a remote peer. This call allows the client to
  // get real-time notifications when its orders are filled by a remote taker. It can be used for
  // tracking order executions, updating balances, and informing a trader when one of their orders
  // is settled through Exchange Union network. 
  subscribeSwaps: {
    path: '/xudrpc.Xud/SubscribeSwaps',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.SubscribeSwapsRequest,
    responseType: xudrpc_pb.SwapResult,
    requestSerialize: serialize_xudrpc_SubscribeSwapsRequest,
    requestDeserialize: deserialize_xudrpc_SubscribeSwapsRequest,
    responseSerialize: serialize_xudrpc_SwapResult,
    responseDeserialize: deserialize_xudrpc_SwapResult,
  },
};

exports.XudClient = grpc.makeGenericClientConstructor(XudService);
