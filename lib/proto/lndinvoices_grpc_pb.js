// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Copyright (C) 2015-2018 The Lightning Network Developers
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
var lndinvoices_pb = require('./lndinvoices_pb.js');
var annotations_pb = require('./annotations_pb.js');
var lndrpc_pb = require('./lndrpc_pb.js');

function serialize_invoicesrpc_AddHoldInvoiceRequest(arg) {
  if (!(arg instanceof lndinvoices_pb.AddHoldInvoiceRequest)) {
    throw new Error('Expected argument of type invoicesrpc.AddHoldInvoiceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_invoicesrpc_AddHoldInvoiceRequest(buffer_arg) {
  return lndinvoices_pb.AddHoldInvoiceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_invoicesrpc_AddHoldInvoiceResp(arg) {
  if (!(arg instanceof lndinvoices_pb.AddHoldInvoiceResp)) {
    throw new Error('Expected argument of type invoicesrpc.AddHoldInvoiceResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_invoicesrpc_AddHoldInvoiceResp(buffer_arg) {
  return lndinvoices_pb.AddHoldInvoiceResp.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_invoicesrpc_CancelInvoiceMsg(arg) {
  if (!(arg instanceof lndinvoices_pb.CancelInvoiceMsg)) {
    throw new Error('Expected argument of type invoicesrpc.CancelInvoiceMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_invoicesrpc_CancelInvoiceMsg(buffer_arg) {
  return lndinvoices_pb.CancelInvoiceMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_invoicesrpc_CancelInvoiceResp(arg) {
  if (!(arg instanceof lndinvoices_pb.CancelInvoiceResp)) {
    throw new Error('Expected argument of type invoicesrpc.CancelInvoiceResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_invoicesrpc_CancelInvoiceResp(buffer_arg) {
  return lndinvoices_pb.CancelInvoiceResp.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_invoicesrpc_SettleInvoiceMsg(arg) {
  if (!(arg instanceof lndinvoices_pb.SettleInvoiceMsg)) {
    throw new Error('Expected argument of type invoicesrpc.SettleInvoiceMsg');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_invoicesrpc_SettleInvoiceMsg(buffer_arg) {
  return lndinvoices_pb.SettleInvoiceMsg.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_invoicesrpc_SettleInvoiceResp(arg) {
  if (!(arg instanceof lndinvoices_pb.SettleInvoiceResp)) {
    throw new Error('Expected argument of type invoicesrpc.SettleInvoiceResp');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_invoicesrpc_SettleInvoiceResp(buffer_arg) {
  return lndinvoices_pb.SettleInvoiceResp.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_invoicesrpc_SubscribeSingleInvoiceRequest(arg) {
  if (!(arg instanceof lndinvoices_pb.SubscribeSingleInvoiceRequest)) {
    throw new Error('Expected argument of type invoicesrpc.SubscribeSingleInvoiceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_invoicesrpc_SubscribeSingleInvoiceRequest(buffer_arg) {
  return lndinvoices_pb.SubscribeSingleInvoiceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_lnrpc_Invoice(arg) {
  if (!(arg instanceof lndrpc_pb.Invoice)) {
    throw new Error('Expected argument of type lnrpc.Invoice');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_lnrpc_Invoice(buffer_arg) {
  return lndrpc_pb.Invoice.deserializeBinary(new Uint8Array(buffer_arg));
}


// Invoices is a service that can be used to create, accept, settle and cancel
// invoices.
var InvoicesService = exports['invoicesrpc.Invoices'] = {
  // *
// SubscribeSingleInvoice returns a uni-directional stream (server -> client)
// to notify the client of state transitions of the specified invoice.
// Initially the current invoice state is always sent out.
subscribeSingleInvoice: {
    path: '/invoicesrpc.Invoices/SubscribeSingleInvoice',
    requestStream: false,
    responseStream: true,
    requestType: lndinvoices_pb.SubscribeSingleInvoiceRequest,
    responseType: lndrpc_pb.Invoice,
    requestSerialize: serialize_invoicesrpc_SubscribeSingleInvoiceRequest,
    requestDeserialize: deserialize_invoicesrpc_SubscribeSingleInvoiceRequest,
    responseSerialize: serialize_lnrpc_Invoice,
    responseDeserialize: deserialize_lnrpc_Invoice,
  },
  // *
// CancelInvoice cancels a currently open invoice. If the invoice is already 
// canceled, this call will succeed. If the invoice is already settled, it will
// fail.
cancelInvoice: {
    path: '/invoicesrpc.Invoices/CancelInvoice',
    requestStream: false,
    responseStream: false,
    requestType: lndinvoices_pb.CancelInvoiceMsg,
    responseType: lndinvoices_pb.CancelInvoiceResp,
    requestSerialize: serialize_invoicesrpc_CancelInvoiceMsg,
    requestDeserialize: deserialize_invoicesrpc_CancelInvoiceMsg,
    responseSerialize: serialize_invoicesrpc_CancelInvoiceResp,
    responseDeserialize: deserialize_invoicesrpc_CancelInvoiceResp,
  },
  // *
// AddHoldInvoice creates a hold invoice. It ties the invoice to the hash
// supplied in the request.
addHoldInvoice: {
    path: '/invoicesrpc.Invoices/AddHoldInvoice',
    requestStream: false,
    responseStream: false,
    requestType: lndinvoices_pb.AddHoldInvoiceRequest,
    responseType: lndinvoices_pb.AddHoldInvoiceResp,
    requestSerialize: serialize_invoicesrpc_AddHoldInvoiceRequest,
    requestDeserialize: deserialize_invoicesrpc_AddHoldInvoiceRequest,
    responseSerialize: serialize_invoicesrpc_AddHoldInvoiceResp,
    responseDeserialize: deserialize_invoicesrpc_AddHoldInvoiceResp,
  },
  // *
// SettleInvoice settles an accepted invoice. If the invoice is already
// settled, this call will succeed.
settleInvoice: {
    path: '/invoicesrpc.Invoices/SettleInvoice',
    requestStream: false,
    responseStream: false,
    requestType: lndinvoices_pb.SettleInvoiceMsg,
    responseType: lndinvoices_pb.SettleInvoiceResp,
    requestSerialize: serialize_invoicesrpc_SettleInvoiceMsg,
    requestDeserialize: deserialize_invoicesrpc_SettleInvoiceMsg,
    responseSerialize: serialize_invoicesrpc_SettleInvoiceResp,
    responseDeserialize: deserialize_invoicesrpc_SettleInvoiceResp,
  },
};

