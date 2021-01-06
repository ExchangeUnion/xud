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
var xudrpc_pb = require('./xudrpc_pb.js');
var annotations_pb = require('./annotations_pb.js');

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

function serialize_xudrpc_ChangePasswordRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ChangePasswordRequest)) {
    throw new Error('Expected argument of type xudrpc.ChangePasswordRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ChangePasswordRequest(buffer_arg) {
  return xudrpc_pb.ChangePasswordRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ChangePasswordResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ChangePasswordResponse)) {
    throw new Error('Expected argument of type xudrpc.ChangePasswordResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ChangePasswordResponse(buffer_arg) {
  return xudrpc_pb.ChangePasswordResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_CloseChannelRequest(arg) {
  if (!(arg instanceof xudrpc_pb.CloseChannelRequest)) {
    throw new Error('Expected argument of type xudrpc.CloseChannelRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_CloseChannelRequest(buffer_arg) {
  return xudrpc_pb.CloseChannelRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_CloseChannelResponse(arg) {
  if (!(arg instanceof xudrpc_pb.CloseChannelResponse)) {
    throw new Error('Expected argument of type xudrpc.CloseChannelResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_CloseChannelResponse(buffer_arg) {
  return xudrpc_pb.CloseChannelResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_CreateNodeRequest(arg) {
  if (!(arg instanceof xudrpc_pb.CreateNodeRequest)) {
    throw new Error('Expected argument of type xudrpc.CreateNodeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_CreateNodeRequest(buffer_arg) {
  return xudrpc_pb.CreateNodeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_CreateNodeResponse(arg) {
  if (!(arg instanceof xudrpc_pb.CreateNodeResponse)) {
    throw new Error('Expected argument of type xudrpc.CreateNodeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_CreateNodeResponse(buffer_arg) {
  return xudrpc_pb.CreateNodeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_Currency(arg) {
  if (!(arg instanceof xudrpc_pb.Currency)) {
    throw new Error('Expected argument of type xudrpc.Currency');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_Currency(buffer_arg) {
  return xudrpc_pb.Currency.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_DepositRequest(arg) {
  if (!(arg instanceof xudrpc_pb.DepositRequest)) {
    throw new Error('Expected argument of type xudrpc.DepositRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_DepositRequest(buffer_arg) {
  return xudrpc_pb.DepositRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_DepositResponse(arg) {
  if (!(arg instanceof xudrpc_pb.DepositResponse)) {
    throw new Error('Expected argument of type xudrpc.DepositResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_DepositResponse(buffer_arg) {
  return xudrpc_pb.DepositResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_DiscoverNodesRequest(arg) {
  if (!(arg instanceof xudrpc_pb.DiscoverNodesRequest)) {
    throw new Error('Expected argument of type xudrpc.DiscoverNodesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_DiscoverNodesRequest(buffer_arg) {
  return xudrpc_pb.DiscoverNodesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_DiscoverNodesResponse(arg) {
  if (!(arg instanceof xudrpc_pb.DiscoverNodesResponse)) {
    throw new Error('Expected argument of type xudrpc.DiscoverNodesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_DiscoverNodesResponse(buffer_arg) {
  return xudrpc_pb.DiscoverNodesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ExecuteSwapRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ExecuteSwapRequest)) {
    throw new Error('Expected argument of type xudrpc.ExecuteSwapRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ExecuteSwapRequest(buffer_arg) {
  return xudrpc_pb.ExecuteSwapRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetBalanceRequest(arg) {
  if (!(arg instanceof xudrpc_pb.GetBalanceRequest)) {
    throw new Error('Expected argument of type xudrpc.GetBalanceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_GetBalanceRequest(buffer_arg) {
  return xudrpc_pb.GetBalanceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetBalanceResponse(arg) {
  if (!(arg instanceof xudrpc_pb.GetBalanceResponse)) {
    throw new Error('Expected argument of type xudrpc.GetBalanceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_GetBalanceResponse(buffer_arg) {
  return xudrpc_pb.GetBalanceResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_GetMnemonicRequest(arg) {
  if (!(arg instanceof xudrpc_pb.GetMnemonicRequest)) {
    throw new Error('Expected argument of type xudrpc.GetMnemonicRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_GetMnemonicRequest(buffer_arg) {
  return xudrpc_pb.GetMnemonicRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetMnemonicResponse(arg) {
  if (!(arg instanceof xudrpc_pb.GetMnemonicResponse)) {
    throw new Error('Expected argument of type xudrpc.GetMnemonicResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_GetMnemonicResponse(buffer_arg) {
  return xudrpc_pb.GetMnemonicResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_ListOrdersRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ListOrdersRequest)) {
    throw new Error('Expected argument of type xudrpc.ListOrdersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ListOrdersRequest(buffer_arg) {
  return xudrpc_pb.ListOrdersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ListOrdersResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ListOrdersResponse)) {
    throw new Error('Expected argument of type xudrpc.ListOrdersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ListOrdersResponse(buffer_arg) {
  return xudrpc_pb.ListOrdersResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_OpenChannelRequest(arg) {
  if (!(arg instanceof xudrpc_pb.OpenChannelRequest)) {
    throw new Error('Expected argument of type xudrpc.OpenChannelRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_OpenChannelRequest(buffer_arg) {
  return xudrpc_pb.OpenChannelRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_OpenChannelResponse(arg) {
  if (!(arg instanceof xudrpc_pb.OpenChannelResponse)) {
    throw new Error('Expected argument of type xudrpc.OpenChannelResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_OpenChannelResponse(buffer_arg) {
  return xudrpc_pb.OpenChannelResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_OrderBookRequest(arg) {
  if (!(arg instanceof xudrpc_pb.OrderBookRequest)) {
    throw new Error('Expected argument of type xudrpc.OrderBookRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_OrderBookRequest(buffer_arg) {
  return xudrpc_pb.OrderBookRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_OrderBookResponse(arg) {
  if (!(arg instanceof xudrpc_pb.OrderBookResponse)) {
    throw new Error('Expected argument of type xudrpc.OrderBookResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_OrderBookResponse(buffer_arg) {
  return xudrpc_pb.OrderBookResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_OrderUpdate(arg) {
  if (!(arg instanceof xudrpc_pb.OrderUpdate)) {
    throw new Error('Expected argument of type xudrpc.OrderUpdate');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_OrderUpdate(buffer_arg) {
  return xudrpc_pb.OrderUpdate.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_RemoveAllOrdersRequest(arg) {
  if (!(arg instanceof xudrpc_pb.RemoveAllOrdersRequest)) {
    throw new Error('Expected argument of type xudrpc.RemoveAllOrdersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_RemoveAllOrdersRequest(buffer_arg) {
  return xudrpc_pb.RemoveAllOrdersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_RemoveAllOrdersResponse(arg) {
  if (!(arg instanceof xudrpc_pb.RemoveAllOrdersResponse)) {
    throw new Error('Expected argument of type xudrpc.RemoveAllOrdersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_RemoveAllOrdersResponse(buffer_arg) {
  return xudrpc_pb.RemoveAllOrdersResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_RestoreNodeRequest(arg) {
  if (!(arg instanceof xudrpc_pb.RestoreNodeRequest)) {
    throw new Error('Expected argument of type xudrpc.RestoreNodeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_RestoreNodeRequest(buffer_arg) {
  return xudrpc_pb.RestoreNodeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_RestoreNodeResponse(arg) {
  if (!(arg instanceof xudrpc_pb.RestoreNodeResponse)) {
    throw new Error('Expected argument of type xudrpc.RestoreNodeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_RestoreNodeResponse(buffer_arg) {
  return xudrpc_pb.RestoreNodeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SetLogLevelRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SetLogLevelRequest)) {
    throw new Error('Expected argument of type xudrpc.SetLogLevelRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_SetLogLevelRequest(buffer_arg) {
  return xudrpc_pb.SetLogLevelRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SetLogLevelResponse(arg) {
  if (!(arg instanceof xudrpc_pb.SetLogLevelResponse)) {
    throw new Error('Expected argument of type xudrpc.SetLogLevelResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_SetLogLevelResponse(buffer_arg) {
  return xudrpc_pb.SetLogLevelResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_SubscribeOrdersRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeOrdersRequest)) {
    throw new Error('Expected argument of type xudrpc.SubscribeOrdersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeOrdersRequest(buffer_arg) {
  return xudrpc_pb.SubscribeOrdersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribeSwapsAcceptedRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeSwapsAcceptedRequest)) {
    throw new Error('Expected argument of type xudrpc.SubscribeSwapsAcceptedRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeSwapsAcceptedRequest(buffer_arg) {
  return xudrpc_pb.SubscribeSwapsAcceptedRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_SwapAccepted(arg) {
  if (!(arg instanceof xudrpc_pb.SwapAccepted)) {
    throw new Error('Expected argument of type xudrpc.SwapAccepted');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_SwapAccepted(buffer_arg) {
  return xudrpc_pb.SwapAccepted.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SwapFailure(arg) {
  if (!(arg instanceof xudrpc_pb.SwapFailure)) {
    throw new Error('Expected argument of type xudrpc.SwapFailure');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_SwapFailure(buffer_arg) {
  return xudrpc_pb.SwapFailure.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SwapSuccess(arg) {
  if (!(arg instanceof xudrpc_pb.SwapSuccess)) {
    throw new Error('Expected argument of type xudrpc.SwapSuccess');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_SwapSuccess(buffer_arg) {
  return xudrpc_pb.SwapSuccess.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_TradeHistoryRequest(arg) {
  if (!(arg instanceof xudrpc_pb.TradeHistoryRequest)) {
    throw new Error('Expected argument of type xudrpc.TradeHistoryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_TradeHistoryRequest(buffer_arg) {
  return xudrpc_pb.TradeHistoryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_TradeHistoryResponse(arg) {
  if (!(arg instanceof xudrpc_pb.TradeHistoryResponse)) {
    throw new Error('Expected argument of type xudrpc.TradeHistoryResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_TradeHistoryResponse(buffer_arg) {
  return xudrpc_pb.TradeHistoryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_TradingLimitsRequest(arg) {
  if (!(arg instanceof xudrpc_pb.TradingLimitsRequest)) {
    throw new Error('Expected argument of type xudrpc.TradingLimitsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_TradingLimitsRequest(buffer_arg) {
  return xudrpc_pb.TradingLimitsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_TradingLimitsResponse(arg) {
  if (!(arg instanceof xudrpc_pb.TradingLimitsResponse)) {
    throw new Error('Expected argument of type xudrpc.TradingLimitsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_TradingLimitsResponse(buffer_arg) {
  return xudrpc_pb.TradingLimitsResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_UnlockNodeRequest(arg) {
  if (!(arg instanceof xudrpc_pb.UnlockNodeRequest)) {
    throw new Error('Expected argument of type xudrpc.UnlockNodeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_UnlockNodeRequest(buffer_arg) {
  return xudrpc_pb.UnlockNodeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_UnlockNodeResponse(arg) {
  if (!(arg instanceof xudrpc_pb.UnlockNodeResponse)) {
    throw new Error('Expected argument of type xudrpc.UnlockNodeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_UnlockNodeResponse(buffer_arg) {
  return xudrpc_pb.UnlockNodeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_WithdrawRequest(arg) {
  if (!(arg instanceof xudrpc_pb.WithdrawRequest)) {
    throw new Error('Expected argument of type xudrpc.WithdrawRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_WithdrawRequest(buffer_arg) {
  return xudrpc_pb.WithdrawRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_WithdrawResponse(arg) {
  if (!(arg instanceof xudrpc_pb.WithdrawResponse)) {
    throw new Error('Expected argument of type xudrpc.WithdrawResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_WithdrawResponse(buffer_arg) {
  return xudrpc_pb.WithdrawResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// A service for interacting with a locked or uninitalized xud node. 
var XudInitService = exports['xudrpc.XudInit'] = {
  // Creates an xud identity node key and underlying wallets. The node key and
// wallets are derived from a single seed and encrypted using a single
// password provided as a parameter to the call. 
// shell: xucli create 
createNode: {
    path: '/xudrpc.XudInit/CreateNode',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.CreateNodeRequest,
    responseType: xudrpc_pb.CreateNodeResponse,
    requestSerialize: serialize_xudrpc_CreateNodeRequest,
    requestDeserialize: deserialize_xudrpc_CreateNodeRequest,
    responseSerialize: serialize_xudrpc_CreateNodeResponse,
    responseDeserialize: deserialize_xudrpc_CreateNodeResponse,
  },
  // Restores an xud instance and underlying wallets from a seed.
// shell: xucli restore [backup_directory] 
restoreNode: {
    path: '/xudrpc.XudInit/RestoreNode',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.RestoreNodeRequest,
    responseType: xudrpc_pb.RestoreNodeResponse,
    requestSerialize: serialize_xudrpc_RestoreNodeRequest,
    requestDeserialize: deserialize_xudrpc_RestoreNodeRequest,
    responseSerialize: serialize_xudrpc_RestoreNodeResponse,
    responseDeserialize: deserialize_xudrpc_RestoreNodeResponse,
  },
  // Unlocks and decrypts the xud node key and any underlying wallets.
// shell: xucli unlock 
unlockNode: {
    path: '/xudrpc.XudInit/UnlockNode',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.UnlockNodeRequest,
    responseType: xudrpc_pb.UnlockNodeResponse,
    requestSerialize: serialize_xudrpc_UnlockNodeRequest,
    requestDeserialize: deserialize_xudrpc_UnlockNodeRequest,
    responseSerialize: serialize_xudrpc_UnlockNodeResponse,
    responseDeserialize: deserialize_xudrpc_UnlockNodeResponse,
  },
};

// The primary service for interacting with a running xud node. 
var XudService = exports['xudrpc.Xud'] = {
  // Adds a currency to the list of supported currencies. Once added, the currency may be used for
// new trading pairs.
// shell: xucli addcurrency <currency> <swap_client> [decimal_places] [token_address] 
addCurrency: {
    path: '/xudrpc.Xud/AddCurrency',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.Currency,
    responseType: xudrpc_pb.AddCurrencyResponse,
    requestSerialize: serialize_xudrpc_Currency,
    requestDeserialize: deserialize_xudrpc_Currency,
    responseSerialize: serialize_xudrpc_AddCurrencyResponse,
    responseDeserialize: deserialize_xudrpc_AddCurrencyResponse,
  },
  // Adds a trading pair to the list of supported trading pairs. The newly supported pair is
// advertised to peers so they may begin sending orders for it.
// shell: xucli addpair <base_currency> <quote_currency> 
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
  // Bans a node and immediately disconnects from it. This can be used to prevent any connections
// to a specific node.
// shell: xucli ban <node_identifier> 
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
  // Changes the xud master password, including the wallet passwords for any underlying clients.
// shell: xucli changepass
changePassword: {
    path: '/xudrpc.Xud/ChangePassword',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.ChangePasswordRequest,
    responseType: xudrpc_pb.ChangePasswordResponse,
    requestSerialize: serialize_xudrpc_ChangePasswordRequest,
    requestDeserialize: deserialize_xudrpc_ChangePasswordRequest,
    responseSerialize: serialize_xudrpc_ChangePasswordResponse,
    responseDeserialize: deserialize_xudrpc_ChangePasswordResponse,
  },
  // Closes any existing payment channels with a peer for the specified currency.
// shell: xucli closechannel <currency> [node_identifier ] [--force]
closeChannel: {
    path: '/xudrpc.Xud/CloseChannel',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.CloseChannelRequest,
    responseType: xudrpc_pb.CloseChannelResponse,
    requestSerialize: serialize_xudrpc_CloseChannelRequest,
    requestDeserialize: deserialize_xudrpc_CloseChannelRequest,
    responseSerialize: serialize_xudrpc_CloseChannelResponse,
    responseDeserialize: deserialize_xudrpc_CloseChannelResponse,
  },
  // Attempts to connect to a node. Once connected, the node is added to the list of peers and
// becomes available for swaps and trading. A handshake exchanges information about the peer's
// supported trading and swap clients. Orders will be shared with the peer upon connection and
// upon new order placements.
// shell: xucli connect <node_uri> 
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
  // Gets an address to deposit a given currency into the xud wallets.
// shell: xucli walletdeposit <currency> 
walletDeposit: {
    path: '/xudrpc.Xud/WalletDeposit',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.DepositRequest,
    responseType: xudrpc_pb.DepositResponse,
    requestSerialize: serialize_xudrpc_DepositRequest,
    requestDeserialize: deserialize_xudrpc_DepositRequest,
    responseSerialize: serialize_xudrpc_DepositResponse,
    responseDeserialize: deserialize_xudrpc_DepositResponse,
  },
  // Gets an address to deposit a given currency directly into a channel.
// shell: xucli deposit <currency> 
deposit: {
    path: '/xudrpc.Xud/Deposit',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.DepositRequest,
    responseType: xudrpc_pb.DepositResponse,
    requestSerialize: serialize_xudrpc_DepositRequest,
    requestDeserialize: deserialize_xudrpc_DepositRequest,
    responseSerialize: serialize_xudrpc_DepositResponse,
    responseDeserialize: deserialize_xudrpc_DepositResponse,
  },
  // Discover nodes from a specific peer and apply new connections 
discoverNodes: {
    path: '/xudrpc.Xud/DiscoverNodes',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.DiscoverNodesRequest,
    responseType: xudrpc_pb.DiscoverNodesResponse,
    requestSerialize: serialize_xudrpc_DiscoverNodesRequest,
    requestDeserialize: deserialize_xudrpc_DiscoverNodesRequest,
    responseSerialize: serialize_xudrpc_DiscoverNodesResponse,
    responseDeserialize: deserialize_xudrpc_DiscoverNodesResponse,
  },
  // Gets the total balance available across all payment channels and wallets for one or all currencies.
// shell: xucli getbalance [currency] 
getBalance: {
    path: '/xudrpc.Xud/GetBalance',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.GetBalanceRequest,
    responseType: xudrpc_pb.GetBalanceResponse,
    requestSerialize: serialize_xudrpc_GetBalanceRequest,
    requestDeserialize: deserialize_xudrpc_GetBalanceRequest,
    responseSerialize: serialize_xudrpc_GetBalanceResponse,
    responseDeserialize: deserialize_xudrpc_GetBalanceResponse,
  },
  // Gets general information about this node.
// shell: xucli getinfo 
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
  // Gets the master seed mnemonic .
// shell: xucli getnemonic 
getMnemonic: {
    path: '/xudrpc.Xud/GetMnemonic',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.GetMnemonicRequest,
    responseType: xudrpc_pb.GetMnemonicResponse,
    requestSerialize: serialize_xudrpc_GetMnemonicRequest,
    requestDeserialize: deserialize_xudrpc_GetMnemonicRequest,
    responseSerialize: serialize_xudrpc_GetMnemonicResponse,
    responseDeserialize: deserialize_xudrpc_GetMnemonicResponse,
  },
  // Gets general information about a node.
// shell: xucli getnodeinfo <node_identifier> 
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
// shell: xucli listorders [pair_id] [include_own_orders] [limit] 
listOrders: {
    path: '/xudrpc.Xud/ListOrders',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.ListOrdersRequest,
    responseType: xudrpc_pb.ListOrdersResponse,
    requestSerialize: serialize_xudrpc_ListOrdersRequest,
    requestDeserialize: deserialize_xudrpc_ListOrdersRequest,
    responseSerialize: serialize_xudrpc_ListOrdersResponse,
    responseDeserialize: deserialize_xudrpc_ListOrdersResponse,
  },
  // Gets a list of this node's supported currencies.
// shell: xucli listcurrencies 
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
// shell: xucli listpairs 
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
// shell: xucli listpeers 
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
  // Opens a payment channel to a peer for the specified amount and currency.
// shell: xucli openchannel <currency> <amount> [node_identifier] [push_amount] 
openChannel: {
    path: '/xudrpc.Xud/OpenChannel',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.OpenChannelRequest,
    responseType: xudrpc_pb.OpenChannelResponse,
    requestSerialize: serialize_xudrpc_OpenChannelRequest,
    requestDeserialize: deserialize_xudrpc_OpenChannelRequest,
    responseSerialize: serialize_xudrpc_OpenChannelResponse,
    responseDeserialize: deserialize_xudrpc_OpenChannelResponse,
  },
  // Gets an order book depth chart where orders are grouped into "buckets"
// according to their price rounded to a given level of precision.
// shell: xucli orderbook [pair_id] [precision] 
orderBook: {
    path: '/xudrpc.Xud/OrderBook',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.OrderBookRequest,
    responseType: xudrpc_pb.OrderBookResponse,
    requestSerialize: serialize_xudrpc_OrderBookRequest,
    requestDeserialize: deserialize_xudrpc_OrderBookRequest,
    responseSerialize: serialize_xudrpc_OrderBookResponse,
    responseDeserialize: deserialize_xudrpc_OrderBookResponse,
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
  // The synchronous, non-streaming version of PlaceOrder.
// shell: xucli buy <quantity> <pair_id> <price> [order_id] [stream]
// shell: xucli sell <quantity> <pair_id> <price> [order_id] [stream] 
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
  // Executes a swap on a maker peer order. 
executeSwap: {
    path: '/xudrpc.Xud/ExecuteSwap',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.ExecuteSwapRequest,
    responseType: xudrpc_pb.SwapSuccess,
    requestSerialize: serialize_xudrpc_ExecuteSwapRequest,
    requestDeserialize: deserialize_xudrpc_ExecuteSwapRequest,
    responseSerialize: serialize_xudrpc_SwapSuccess,
    responseDeserialize: deserialize_xudrpc_SwapSuccess,
  },
  // Removes a currency from the list of supported currencies. Only currencies that are not in use
// for any currently supported trading pairs may be removed. Once removed, the currency can no
// longer be used for any supported trading pairs.
// shell: xucli removecurrency <currency> 
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
  // Removes an order from the order book by its local id. This should be called when an order is
// canceled or filled outside of xud. Removed orders become immediately unavailable for swaps,
// and peers are notified that the order is no longer valid. Any portion of the order that is
// on hold due to ongoing swaps will not be removed until after the swap attempts complete.
// shell: xucli removeorder <order_id> [quantity] 
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
  // Removes all orders from the order book. Removed orders become immediately unavailable for swaps,
// and peers are notified that the orders are no longer valid. Any portion of the orders that is
// on hold due to ongoing swaps will not be removed until after the swap attempts complete.
// shell: xucli removeallorders 
removeAllOrders: {
    path: '/xudrpc.Xud/RemoveAllOrders',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.RemoveAllOrdersRequest,
    responseType: xudrpc_pb.RemoveAllOrdersResponse,
    requestSerialize: serialize_xudrpc_RemoveAllOrdersRequest,
    requestDeserialize: deserialize_xudrpc_RemoveAllOrdersRequest,
    responseSerialize: serialize_xudrpc_RemoveAllOrdersResponse,
    responseDeserialize: deserialize_xudrpc_RemoveAllOrdersResponse,
  },
  // Removes a trading pair from the list of currently supported trading pair. This call will
// effectively cancel any standing orders for that trading pair. Peers are informed when a pair
// is no longer supported so that they will know to stop sending orders for it.
// shell: xucli removepair <pair_id> 
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
  // Set the logging level.
// shell: xucli loglevel <level> 
setLogLevel: {
    path: '/xudrpc.Xud/SetLogLevel',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.SetLogLevelRequest,
    responseType: xudrpc_pb.SetLogLevelResponse,
    requestSerialize: serialize_xudrpc_SetLogLevelRequest,
    requestDeserialize: deserialize_xudrpc_SetLogLevelRequest,
    responseSerialize: serialize_xudrpc_SetLogLevelResponse,
    responseDeserialize: deserialize_xudrpc_SetLogLevelResponse,
  },
  // Begin gracefully shutting down xud.
// shell: xucli shutdown 
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
  // Subscribes to orders being added to and removed from the order book. This call allows the client
// to maintain an up-to-date view of the order book. For example, an exchange that wants to show
// its users a real time view of the orders available to them would subscribe to this streaming
// call to be alerted as new orders are added and expired orders are removed. 
subscribeOrders: {
    path: '/xudrpc.Xud/SubscribeOrders',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.SubscribeOrdersRequest,
    responseType: xudrpc_pb.OrderUpdate,
    requestSerialize: serialize_xudrpc_SubscribeOrdersRequest,
    requestDeserialize: deserialize_xudrpc_SubscribeOrdersRequest,
    responseSerialize: serialize_xudrpc_OrderUpdate,
    responseDeserialize: deserialize_xudrpc_OrderUpdate,
  },
  // Subscribes to failed swaps. By default, only swaps that are initiated by a remote peer are
// transmitted unless a flag is set to include swaps initiated by the local node. This call allows
// the client to get real-time notifications when swap attempts are failing. It can be used for
// status monitoring, debugging, and testing purposes. 
subscribeSwapFailures: {
    path: '/xudrpc.Xud/SubscribeSwapFailures',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.SubscribeSwapsRequest,
    responseType: xudrpc_pb.SwapFailure,
    requestSerialize: serialize_xudrpc_SubscribeSwapsRequest,
    requestDeserialize: deserialize_xudrpc_SubscribeSwapsRequest,
    responseSerialize: serialize_xudrpc_SwapFailure,
    responseDeserialize: deserialize_xudrpc_SwapFailure,
  },
  // Subscribes to completed swaps. By default, only swaps that are initiated by a remote peer are
// transmitted unless a flag is set to include swaps initiated by the local node. This call allows
// the client to get real-time notifications when its orders are filled by a peer. It can be used
// for tracking order executions, updating balances, and informing a trader when one of their orders
// is settled through the Exchange Union network. 
subscribeSwaps: {
    path: '/xudrpc.Xud/SubscribeSwaps',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.SubscribeSwapsRequest,
    responseType: xudrpc_pb.SwapSuccess,
    requestSerialize: serialize_xudrpc_SubscribeSwapsRequest,
    requestDeserialize: deserialize_xudrpc_SubscribeSwapsRequest,
    responseSerialize: serialize_xudrpc_SwapSuccess,
    responseDeserialize: deserialize_xudrpc_SwapSuccess,
  },
  // Subscribes to accepted swaps. This stream emits a message when the local xud node 
// accepts a swap request from a peer, but before the swap has actually succeeded. 
subscribeSwapsAccepted: {
    path: '/xudrpc.Xud/SubscribeSwapsAccepted',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.SubscribeSwapsAcceptedRequest,
    responseType: xudrpc_pb.SwapAccepted,
    requestSerialize: serialize_xudrpc_SubscribeSwapsAcceptedRequest,
    requestDeserialize: deserialize_xudrpc_SubscribeSwapsAcceptedRequest,
    responseSerialize: serialize_xudrpc_SwapAccepted,
    responseDeserialize: deserialize_xudrpc_SwapAccepted,
  },
  // Gets a list of completed trades.
// shell: xucli tradehistory [limit] 
tradeHistory: {
    path: '/xudrpc.Xud/TradeHistory',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.TradeHistoryRequest,
    responseType: xudrpc_pb.TradeHistoryResponse,
    requestSerialize: serialize_xudrpc_TradeHistoryRequest,
    requestDeserialize: deserialize_xudrpc_TradeHistoryRequest,
    responseSerialize: serialize_xudrpc_TradeHistoryResponse,
    responseDeserialize: deserialize_xudrpc_TradeHistoryResponse,
  },
  // Gets the trading limits for one or all currencies.
// shell: xucli tradinglimits [currency] 
tradingLimits: {
    path: '/xudrpc.Xud/TradingLimits',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.TradingLimitsRequest,
    responseType: xudrpc_pb.TradingLimitsResponse,
    requestSerialize: serialize_xudrpc_TradingLimitsRequest,
    requestDeserialize: deserialize_xudrpc_TradingLimitsRequest,
    responseSerialize: serialize_xudrpc_TradingLimitsResponse,
    responseDeserialize: deserialize_xudrpc_TradingLimitsResponse,
  },
  // Removes a ban from a node manually and, optionally, attempts to connect to it.
// shell: xucli unban <node_identifier> [reconnect] 
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
  // Withdraws a given currency from the xud wallets to a specified address.
// shell: xucli withdraw [amount] [currency] <destination> [fee] 
walletWithdraw: {
    path: '/xudrpc.Xud/WalletWithdraw',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.WithdrawRequest,
    responseType: xudrpc_pb.WithdrawResponse,
    requestSerialize: serialize_xudrpc_WithdrawRequest,
    requestDeserialize: deserialize_xudrpc_WithdrawRequest,
    responseSerialize: serialize_xudrpc_WithdrawResponse,
    responseDeserialize: deserialize_xudrpc_WithdrawResponse,
  },
};

