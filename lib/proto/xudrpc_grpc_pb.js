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
var lndrpc_pb = require('./lndrpc_pb.js');

function serialize_lnrpc_ChangePasswordResponse(arg) {
  if (!(arg instanceof lndrpc_pb.ChangePasswordResponse)) {
    throw new Error('Expected argument of type lnrpc.ChangePasswordResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ChangePasswordResponse(buffer_arg) {
  return lndrpc_pb.ChangePasswordResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_EstimateFeeResponse(arg) {
  if (!(arg instanceof lndrpc_pb.EstimateFeeResponse)) {
    throw new Error('Expected argument of type lnrpc.EstimateFeeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_EstimateFeeResponse(buffer_arg) {
  return lndrpc_pb.EstimateFeeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_GenSeedResponse(arg) {
  if (!(arg instanceof lndrpc_pb.GenSeedResponse)) {
    throw new Error('Expected argument of type lnrpc.GenSeedResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_GenSeedResponse(buffer_arg) {
  return lndrpc_pb.GenSeedResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_InitWalletResponse(arg) {
  if (!(arg instanceof lndrpc_pb.InitWalletResponse)) {
    throw new Error('Expected argument of type lnrpc.InitWalletResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_InitWalletResponse(buffer_arg) {
  return lndrpc_pb.InitWalletResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_ListUnspentResponse(arg) {
  if (!(arg instanceof lndrpc_pb.ListUnspentResponse)) {
    throw new Error('Expected argument of type lnrpc.ListUnspentResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_ListUnspentResponse(buffer_arg) {
  return lndrpc_pb.ListUnspentResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_NewAddressResponse(arg) {
  if (!(arg instanceof lndrpc_pb.NewAddressResponse)) {
    throw new Error('Expected argument of type lnrpc.NewAddressResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_NewAddressResponse(buffer_arg) {
  return lndrpc_pb.NewAddressResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_SendCoinsResponse(arg) {
  if (!(arg instanceof lndrpc_pb.SendCoinsResponse)) {
    throw new Error('Expected argument of type lnrpc.SendCoinsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_SendCoinsResponse(buffer_arg) {
  return lndrpc_pb.SendCoinsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_SendManyResponse(arg) {
  if (!(arg instanceof lndrpc_pb.SendManyResponse)) {
    throw new Error('Expected argument of type lnrpc.SendManyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_SendManyResponse(buffer_arg) {
  return lndrpc_pb.SendManyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_Transaction(arg) {
  if (!(arg instanceof lndrpc_pb.Transaction)) {
    throw new Error('Expected argument of type lnrpc.Transaction');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_Transaction(buffer_arg) {
  return lndrpc_pb.Transaction.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_TransactionDetails(arg) {
  if (!(arg instanceof lndrpc_pb.TransactionDetails)) {
    throw new Error('Expected argument of type lnrpc.TransactionDetails');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_TransactionDetails(buffer_arg) {
  return lndrpc_pb.TransactionDetails.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_UnlockWalletResponse(arg) {
  if (!(arg instanceof lndrpc_pb.UnlockWalletResponse)) {
    throw new Error('Expected argument of type lnrpc.UnlockWalletResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_UnlockWalletResponse(buffer_arg) {
  return lndrpc_pb.UnlockWalletResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_WalletBalanceResponse(arg) {
  if (!(arg instanceof lndrpc_pb.WalletBalanceResponse)) {
    throw new Error('Expected argument of type lnrpc.WalletBalanceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_WalletBalanceResponse(buffer_arg) {
  return lndrpc_pb.WalletBalanceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

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

function serialize_xudrpc_ChangePasswordRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ChangePasswordRequest)) {
    throw new Error('Expected argument of type xudrpc.ChangePasswordRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ChangePasswordRequest(buffer_arg) {
  return xudrpc_pb.ChangePasswordRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_EstimateFeeRequest(arg) {
  if (!(arg instanceof xudrpc_pb.EstimateFeeRequest)) {
    throw new Error('Expected argument of type xudrpc.EstimateFeeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_EstimateFeeRequest(buffer_arg) {
  return xudrpc_pb.EstimateFeeRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_GenSeedRequest(arg) {
  if (!(arg instanceof xudrpc_pb.GenSeedRequest)) {
    throw new Error('Expected argument of type xudrpc.GenSeedRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_GenSeedRequest(buffer_arg) {
  return xudrpc_pb.GenSeedRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_GetTransactionsRequest(arg) {
  if (!(arg instanceof xudrpc_pb.GetTransactionsRequest)) {
    throw new Error('Expected argument of type xudrpc.GetTransactionsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_GetTransactionsRequest(buffer_arg) {
  return xudrpc_pb.GetTransactionsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_InitWalletRequest(arg) {
  if (!(arg instanceof xudrpc_pb.InitWalletRequest)) {
    throw new Error('Expected argument of type xudrpc.InitWalletRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_InitWalletRequest(buffer_arg) {
  return xudrpc_pb.InitWalletRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_ListUnspentRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ListUnspentRequest)) {
    throw new Error('Expected argument of type xudrpc.ListUnspentRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_ListUnspentRequest(buffer_arg) {
  return xudrpc_pb.ListUnspentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_NewAddressRequest(arg) {
  if (!(arg instanceof xudrpc_pb.NewAddressRequest)) {
    throw new Error('Expected argument of type xudrpc.NewAddressRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_NewAddressRequest(buffer_arg) {
  return xudrpc_pb.NewAddressRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_SendCoinsRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SendCoinsRequest)) {
    throw new Error('Expected argument of type xudrpc.SendCoinsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_SendCoinsRequest(buffer_arg) {
  return xudrpc_pb.SendCoinsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SendManyRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SendManyRequest)) {
    throw new Error('Expected argument of type xudrpc.SendManyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_SendManyRequest(buffer_arg) {
  return xudrpc_pb.SendManyRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_SubscribeSwapsRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeSwapsRequest)) {
    throw new Error('Expected argument of type xudrpc.SubscribeSwapsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeSwapsRequest(buffer_arg) {
  return xudrpc_pb.SubscribeSwapsRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_xudrpc_UnlockWalletRequest(arg) {
  if (!(arg instanceof xudrpc_pb.UnlockWalletRequest)) {
    throw new Error('Expected argument of type xudrpc.UnlockWalletRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_UnlockWalletRequest(buffer_arg) {
  return xudrpc_pb.UnlockWalletRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_WalletBalanceRequest(arg) {
  if (!(arg instanceof xudrpc_pb.WalletBalanceRequest)) {
    throw new Error('Expected argument of type xudrpc.WalletBalanceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xudrpc_WalletBalanceRequest(buffer_arg) {
  return xudrpc_pb.WalletBalanceRequest.deserializeBinary(new Uint8Array(buffer_arg));
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
  // and peers are notified that the order is no longer valid. Any portion of the order that is
  // on hold due to ongoing swaps will not be removed until after the swap attempts complete. 
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
  // Execute a swap on a maker peer order 
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
  genSeed: {
    path: '/xudrpc.Xud/GenSeed',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.GenSeedRequest,
    responseType: lndrpc_pb.GenSeedResponse,
    requestSerialize: serialize_xudrpc_GenSeedRequest,
    requestDeserialize: deserialize_xudrpc_GenSeedRequest,
    responseSerialize: serialize_lnrpc_GenSeedResponse,
    responseDeserialize: deserialize_lnrpc_GenSeedResponse,
  },
  initWallet: {
    path: '/xudrpc.Xud/InitWallet',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.InitWalletRequest,
    responseType: lndrpc_pb.InitWalletResponse,
    requestSerialize: serialize_xudrpc_InitWalletRequest,
    requestDeserialize: deserialize_xudrpc_InitWalletRequest,
    responseSerialize: serialize_lnrpc_InitWalletResponse,
    responseDeserialize: deserialize_lnrpc_InitWalletResponse,
  },
  unlockWallet: {
    path: '/xudrpc.Xud/UnlockWallet',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.UnlockWalletRequest,
    responseType: lndrpc_pb.UnlockWalletResponse,
    requestSerialize: serialize_xudrpc_UnlockWalletRequest,
    requestDeserialize: deserialize_xudrpc_UnlockWalletRequest,
    responseSerialize: serialize_lnrpc_UnlockWalletResponse,
    responseDeserialize: deserialize_lnrpc_UnlockWalletResponse,
  },
  changePassword: {
    path: '/xudrpc.Xud/ChangePassword',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.ChangePasswordRequest,
    responseType: lndrpc_pb.ChangePasswordResponse,
    requestSerialize: serialize_xudrpc_ChangePasswordRequest,
    requestDeserialize: deserialize_xudrpc_ChangePasswordRequest,
    responseSerialize: serialize_lnrpc_ChangePasswordResponse,
    responseDeserialize: deserialize_lnrpc_ChangePasswordResponse,
  },
  walletBalance: {
    path: '/xudrpc.Xud/WalletBalance',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.WalletBalanceRequest,
    responseType: lndrpc_pb.WalletBalanceResponse,
    requestSerialize: serialize_xudrpc_WalletBalanceRequest,
    requestDeserialize: deserialize_xudrpc_WalletBalanceRequest,
    responseSerialize: serialize_lnrpc_WalletBalanceResponse,
    responseDeserialize: deserialize_lnrpc_WalletBalanceResponse,
  },
  getTransactions: {
    path: '/xudrpc.Xud/GetTransactions',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.GetTransactionsRequest,
    responseType: lndrpc_pb.TransactionDetails,
    requestSerialize: serialize_xudrpc_GetTransactionsRequest,
    requestDeserialize: deserialize_xudrpc_GetTransactionsRequest,
    responseSerialize: serialize_lnrpc_TransactionDetails,
    responseDeserialize: deserialize_lnrpc_TransactionDetails,
  },
  estimateFee: {
    path: '/xudrpc.Xud/EstimateFee',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.EstimateFeeRequest,
    responseType: lndrpc_pb.EstimateFeeResponse,
    requestSerialize: serialize_xudrpc_EstimateFeeRequest,
    requestDeserialize: deserialize_xudrpc_EstimateFeeRequest,
    responseSerialize: serialize_lnrpc_EstimateFeeResponse,
    responseDeserialize: deserialize_lnrpc_EstimateFeeResponse,
  },
  listUnspent: {
    path: '/xudrpc.Xud/ListUnspent',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.ListUnspentRequest,
    responseType: lndrpc_pb.ListUnspentResponse,
    requestSerialize: serialize_xudrpc_ListUnspentRequest,
    requestDeserialize: deserialize_xudrpc_ListUnspentRequest,
    responseSerialize: serialize_lnrpc_ListUnspentResponse,
    responseDeserialize: deserialize_lnrpc_ListUnspentResponse,
  },
  sendCoins: {
    path: '/xudrpc.Xud/SendCoins',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.SendCoinsRequest,
    responseType: lndrpc_pb.SendCoinsResponse,
    requestSerialize: serialize_xudrpc_SendCoinsRequest,
    requestDeserialize: deserialize_xudrpc_SendCoinsRequest,
    responseSerialize: serialize_lnrpc_SendCoinsResponse,
    responseDeserialize: deserialize_lnrpc_SendCoinsResponse,
  },
  sendMany: {
    path: '/xudrpc.Xud/SendMany',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.SendManyRequest,
    responseType: lndrpc_pb.SendManyResponse,
    requestSerialize: serialize_xudrpc_SendManyRequest,
    requestDeserialize: deserialize_xudrpc_SendManyRequest,
    responseSerialize: serialize_lnrpc_SendManyResponse,
    responseDeserialize: deserialize_lnrpc_SendManyResponse,
  },
  newAddress: {
    path: '/xudrpc.Xud/NewAddress',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.NewAddressRequest,
    responseType: lndrpc_pb.NewAddressResponse,
    requestSerialize: serialize_xudrpc_NewAddressRequest,
    requestDeserialize: deserialize_xudrpc_NewAddressRequest,
    responseSerialize: serialize_lnrpc_NewAddressResponse,
    responseDeserialize: deserialize_lnrpc_NewAddressResponse,
  },
  subscribeTransactions: {
    path: '/xudrpc.Xud/SubscribeTransactions',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.GetTransactionsRequest,
    responseType: lndrpc_pb.Transaction,
    requestSerialize: serialize_xudrpc_GetTransactionsRequest,
    requestDeserialize: deserialize_xudrpc_GetTransactionsRequest,
    responseSerialize: serialize_lnrpc_Transaction,
    responseDeserialize: deserialize_lnrpc_Transaction,
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
};

exports.XudClient = grpc.makeGenericClientConstructor(XudService);
