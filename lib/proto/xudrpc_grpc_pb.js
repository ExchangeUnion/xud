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
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_AddCurrencyRequest(buffer_arg) {
  return xudrpc_pb.AddCurrencyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_AddCurrencyResponse(arg) {
  if (!(arg instanceof xudrpc_pb.AddCurrencyResponse)) {
    throw new Error('Expected argument of type xudrpc.AddCurrencyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_AddCurrencyResponse(buffer_arg) {
  return xudrpc_pb.AddCurrencyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_AddPairRequest(arg) {
  if (!(arg instanceof xudrpc_pb.AddPairRequest)) {
    throw new Error('Expected argument of type xudrpc.AddPairRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_AddPairRequest(buffer_arg) {
  return xudrpc_pb.AddPairRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_AddPairResponse(arg) {
  if (!(arg instanceof xudrpc_pb.AddPairResponse)) {
    throw new Error('Expected argument of type xudrpc.AddPairResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_AddPairResponse(buffer_arg) {
  return xudrpc_pb.AddPairResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_BanRequest(arg) {
  if (!(arg instanceof xudrpc_pb.BanRequest)) {
    throw new Error('Expected argument of type xudrpc.BanRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_BanRequest(buffer_arg) {
  return xudrpc_pb.BanRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_BanResponse(arg) {
  if (!(arg instanceof xudrpc_pb.BanResponse)) {
    throw new Error('Expected argument of type xudrpc.BanResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_BanResponse(buffer_arg) {
  return xudrpc_pb.BanResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ChannelBalanceRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ChannelBalanceRequest)) {
    throw new Error('Expected argument of type xudrpc.ChannelBalanceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ChannelBalanceRequest(buffer_arg) {
  return xudrpc_pb.ChannelBalanceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ChannelBalanceResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ChannelBalanceResponse)) {
    throw new Error('Expected argument of type xudrpc.ChannelBalanceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ChannelBalanceResponse(buffer_arg) {
  return xudrpc_pb.ChannelBalanceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ConnectRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ConnectRequest)) {
    throw new Error('Expected argument of type xudrpc.ConnectRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ConnectRequest(buffer_arg) {
  return xudrpc_pb.ConnectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ConnectResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ConnectResponse)) {
    throw new Error('Expected argument of type xudrpc.ConnectResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ConnectResponse(buffer_arg) {
  return xudrpc_pb.ConnectResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetInfoRequest(arg) {
  if (!(arg instanceof xudrpc_pb.GetInfoRequest)) {
    throw new Error('Expected argument of type xudrpc.GetInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_GetInfoRequest(buffer_arg) {
  return xudrpc_pb.GetInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetInfoResponse(arg) {
  if (!(arg instanceof xudrpc_pb.GetInfoResponse)) {
    throw new Error('Expected argument of type xudrpc.GetInfoResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_GetInfoResponse(buffer_arg) {
  return xudrpc_pb.GetInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetNodeInfoRequest(arg) {
  if (!(arg instanceof xudrpc_pb.GetNodeInfoRequest)) {
    throw new Error('Expected argument of type xudrpc.GetNodeInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_GetNodeInfoRequest(buffer_arg) {
  return xudrpc_pb.GetNodeInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetNodeInfoResponse(arg) {
  if (!(arg instanceof xudrpc_pb.GetNodeInfoResponse)) {
    throw new Error('Expected argument of type xudrpc.GetNodeInfoResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_GetNodeInfoResponse(buffer_arg) {
  return xudrpc_pb.GetNodeInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetOrdersRequest(arg) {
  if (!(arg instanceof xudrpc_pb.GetOrdersRequest)) {
    throw new Error('Expected argument of type xudrpc.GetOrdersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_GetOrdersRequest(buffer_arg) {
  return xudrpc_pb.GetOrdersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetOrdersResponse(arg) {
  if (!(arg instanceof xudrpc_pb.GetOrdersResponse)) {
    throw new Error('Expected argument of type xudrpc.GetOrdersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_GetOrdersResponse(buffer_arg) {
  return xudrpc_pb.GetOrdersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ListCurrenciesRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ListCurrenciesRequest)) {
    throw new Error('Expected argument of type xudrpc.ListCurrenciesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ListCurrenciesRequest(buffer_arg) {
  return xudrpc_pb.ListCurrenciesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ListCurrenciesResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ListCurrenciesResponse)) {
    throw new Error('Expected argument of type xudrpc.ListCurrenciesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ListCurrenciesResponse(buffer_arg) {
  return xudrpc_pb.ListCurrenciesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ListPairsRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ListPairsRequest)) {
    throw new Error('Expected argument of type xudrpc.ListPairsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ListPairsRequest(buffer_arg) {
  return xudrpc_pb.ListPairsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ListPairsResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ListPairsResponse)) {
    throw new Error('Expected argument of type xudrpc.ListPairsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ListPairsResponse(buffer_arg) {
  return xudrpc_pb.ListPairsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ListPeersRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ListPeersRequest)) {
    throw new Error('Expected argument of type xudrpc.ListPeersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ListPeersRequest(buffer_arg) {
  return xudrpc_pb.ListPeersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ListPeersResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ListPeersResponse)) {
    throw new Error('Expected argument of type xudrpc.ListPeersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ListPeersResponse(buffer_arg) {
  return xudrpc_pb.ListPeersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_Order(arg) {
  if (!(arg instanceof xudrpc_pb.Order)) {
    throw new Error('Expected argument of type xudrpc.Order');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_Order(buffer_arg) {
  return xudrpc_pb.Order.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_OrderRemoval(arg) {
  if (!(arg instanceof xudrpc_pb.OrderRemoval)) {
    throw new Error('Expected argument of type xudrpc.OrderRemoval');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_OrderRemoval(buffer_arg) {
  return xudrpc_pb.OrderRemoval.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_PlaceOrderEvent(arg) {
  if (!(arg instanceof xudrpc_pb.PlaceOrderEvent)) {
    throw new Error('Expected argument of type xudrpc.PlaceOrderEvent');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_PlaceOrderEvent(buffer_arg) {
  return xudrpc_pb.PlaceOrderEvent.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_PlaceOrderRequest(arg) {
  if (!(arg instanceof xudrpc_pb.PlaceOrderRequest)) {
    throw new Error('Expected argument of type xudrpc.PlaceOrderRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_PlaceOrderRequest(buffer_arg) {
  return xudrpc_pb.PlaceOrderRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_PlaceOrderResponse(arg) {
  if (!(arg instanceof xudrpc_pb.PlaceOrderResponse)) {
    throw new Error('Expected argument of type xudrpc.PlaceOrderResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_PlaceOrderResponse(buffer_arg) {
  return xudrpc_pb.PlaceOrderResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_RemoveCurrencyRequest(arg) {
  if (!(arg instanceof xudrpc_pb.RemoveCurrencyRequest)) {
    throw new Error('Expected argument of type xudrpc.RemoveCurrencyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_RemoveCurrencyRequest(buffer_arg) {
  return xudrpc_pb.RemoveCurrencyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_RemoveCurrencyResponse(arg) {
  if (!(arg instanceof xudrpc_pb.RemoveCurrencyResponse)) {
    throw new Error('Expected argument of type xudrpc.RemoveCurrencyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_RemoveCurrencyResponse(buffer_arg) {
  return xudrpc_pb.RemoveCurrencyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_RemoveOrderRequest(arg) {
  if (!(arg instanceof xudrpc_pb.RemoveOrderRequest)) {
    throw new Error('Expected argument of type xudrpc.RemoveOrderRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_RemoveOrderRequest(buffer_arg) {
  return xudrpc_pb.RemoveOrderRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_RemoveOrderResponse(arg) {
  if (!(arg instanceof xudrpc_pb.RemoveOrderResponse)) {
    throw new Error('Expected argument of type xudrpc.RemoveOrderResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_RemoveOrderResponse(buffer_arg) {
  return xudrpc_pb.RemoveOrderResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_RemovePairRequest(arg) {
  if (!(arg instanceof xudrpc_pb.RemovePairRequest)) {
    throw new Error('Expected argument of type xudrpc.RemovePairRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_RemovePairRequest(buffer_arg) {
  return xudrpc_pb.RemovePairRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_RemovePairResponse(arg) {
  if (!(arg instanceof xudrpc_pb.RemovePairResponse)) {
    throw new Error('Expected argument of type xudrpc.RemovePairResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_RemovePairResponse(buffer_arg) {
  return xudrpc_pb.RemovePairResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ShutdownRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ShutdownRequest)) {
    throw new Error('Expected argument of type xudrpc.ShutdownRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ShutdownRequest(buffer_arg) {
  return xudrpc_pb.ShutdownRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ShutdownResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ShutdownResponse)) {
    throw new Error('Expected argument of type xudrpc.ShutdownResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ShutdownResponse(buffer_arg) {
  return xudrpc_pb.ShutdownResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribeAddedOrdersRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeAddedOrdersRequest)) {
    throw new Error('Expected argument of type xudrpc.SubscribeAddedOrdersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeAddedOrdersRequest(buffer_arg) {
  return xudrpc_pb.SubscribeAddedOrdersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribeRemovedOrdersRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeRemovedOrdersRequest)) {
    throw new Error('Expected argument of type xudrpc.SubscribeRemovedOrdersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeRemovedOrdersRequest(buffer_arg) {
  return xudrpc_pb.SubscribeRemovedOrdersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribeSwapsRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeSwapsRequest)) {
    throw new Error('Expected argument of type xudrpc.SubscribeSwapsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeSwapsRequest(buffer_arg) {
  return xudrpc_pb.SubscribeSwapsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SwapResult(arg) {
  if (!(arg instanceof xudrpc_pb.SwapResult)) {
    throw new Error('Expected argument of type xudrpc.SwapResult');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_SwapResult(buffer_arg) {
  return xudrpc_pb.SwapResult.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_UnbanRequest(arg) {
  if (!(arg instanceof xudrpc_pb.UnbanRequest)) {
    throw new Error('Expected argument of type xudrpc.UnbanRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_UnbanRequest(buffer_arg) {
  return xudrpc_pb.UnbanRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_UnbanResponse(arg) {
  if (!(arg instanceof xudrpc_pb.UnbanResponse)) {
    throw new Error('Expected argument of type xudrpc.UnbanResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_UnbanResponse(buffer_arg) {
  return xudrpc_pb.UnbanResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var XudService = exports.XudService = {
  // Adds a currency to the list of supported currencies. Once added, the currency may be used for
  // new trading pairs. 
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
  // Adds a trading pair to the list of supported trading pairs. The newly supported pair is
  // advertised to peers so they may begin sending orders for it. 
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
  // Removes an order from the order book by its local id. This should be called when an order is
  // canceled or filled outside of xud. Removed orders become immediately unavailable for swaps, 
  // and peers are notified that the order is no longer valid. 
  removeOrder: {
    path: '/xudrpc.Xud/RemoveOrder',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.RemoveOrderRequest,
    responseType: xudrpc_pb.RemoveOrderResponse,
    requestSerialize: serialize_xudrpc_RemoveOrderRequest,
    requestDeserialize: deserialize_xudrpc_RemoveOrderRequest,
    responseSerialize: serialize_xudrpc_RemoveOrderResponse,
    responseDeserialize: deserialize_xudrpc_RemoveOrderResponse,
  },
  // Gets the total balance available across all payment channels for one or all currencies. 
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
  // Attempts to connect to a node. Once connected, the node is added to the list of peers and
  // becomes available for swaps and trading. A handshake exchanges information about the peer's
  // supported trading and swap clients. Orders will be shared with the peer upon connection and
  // upon new order placements.
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
  // Bans a node and immediately disconnects from it. This can be used to prevent any connections
  // to a specific node.
  ban: {
    path: '/xudrpc.Xud/Ban',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.BanRequest,
    responseType: xudrpc_pb.BanResponse,
    requestSerialize: serialize_xudrpc_BanRequest,
    requestDeserialize: deserialize_xudrpc_BanRequest,
    responseSerialize: serialize_xudrpc_BanResponse,
    responseDeserialize: deserialize_xudrpc_BanResponse,
  },
  // Removes a ban from a node manually and, optionally, attempts to connect to it. 
  unban: {
    path: '/xudrpc.Xud/Unban',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.UnbanRequest,
    responseType: xudrpc_pb.UnbanResponse,
    requestSerialize: serialize_xudrpc_UnbanRequest,
    requestDeserialize: deserialize_xudrpc_UnbanRequest,
    responseSerialize: serialize_xudrpc_UnbanResponse,
    responseDeserialize: deserialize_xudrpc_UnbanResponse,
  },
  // Gets general information about this node. 
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
  // Gets general information about a node. 
  getNodeInfo: {
    path: '/xudrpc.Xud/GetNodeInfo',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.GetNodeInfoRequest,
    responseType: xudrpc_pb.GetNodeInfoResponse,
    requestSerialize: serialize_xudrpc_GetNodeInfoRequest,
    requestDeserialize: deserialize_xudrpc_GetNodeInfoRequest,
    responseSerialize: serialize_xudrpc_GetNodeInfoResponse,
    responseDeserialize: deserialize_xudrpc_GetNodeInfoResponse,
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
  // Gets a list of this node's supported currencies. 
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
  // Gets a list of this nodes suported trading pairs. 
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
  // Gets a list of connected peers. 
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
  // Adds an order to the order book.
  // If price is zero or unspecified a market order will get added. 
  placeOrder: {
    path: '/xudrpc.Xud/PlaceOrder',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.PlaceOrderRequest,
    responseType: xudrpc_pb.PlaceOrderEvent,
    requestSerialize: serialize_xudrpc_PlaceOrderRequest,
    requestDeserialize: deserialize_xudrpc_PlaceOrderRequest,
    responseSerialize: serialize_xudrpc_PlaceOrderEvent,
    responseDeserialize: deserialize_xudrpc_PlaceOrderEvent,
  },
  // The synchronous non-streaming version of PlaceOrder. 
  placeOrderSync: {
    path: '/xudrpc.Xud/PlaceOrderSync',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.PlaceOrderRequest,
    responseType: xudrpc_pb.PlaceOrderResponse,
    requestSerialize: serialize_xudrpc_PlaceOrderRequest,
    requestDeserialize: deserialize_xudrpc_PlaceOrderRequest,
    responseSerialize: serialize_xudrpc_PlaceOrderResponse,
    responseDeserialize: deserialize_xudrpc_PlaceOrderResponse,
  },
  // Removes a currency from the list of supported currencies. Only currencies that are not in use
  // for any currently supported trading pairs may be removed. Once removed, the currency can no
  // longer be used for any supported trading pairs. 
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
  // Removes a trading pair from the list of currently supported trading pair. This call will
  // effectively cancel any standing orders for that trading pair. Peers are informed when a pair
  // is no longer supported so that they will know to stop sending orders for it. 
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
  // Begin gracefully shutting down xud. 
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
