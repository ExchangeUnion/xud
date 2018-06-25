/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var annotations_pb = require('./annotations_pb.js');
goog.exportSymbol('proto.lnrpc.AddInvoiceResponse', null, global);
goog.exportSymbol('proto.lnrpc.ChanInfoRequest', null, global);
goog.exportSymbol('proto.lnrpc.Channel', null, global);
goog.exportSymbol('proto.lnrpc.ChannelBalanceRequest', null, global);
goog.exportSymbol('proto.lnrpc.ChannelBalanceResponse', null, global);
goog.exportSymbol('proto.lnrpc.ChannelCloseUpdate', null, global);
goog.exportSymbol('proto.lnrpc.ChannelEdge', null, global);
goog.exportSymbol('proto.lnrpc.ChannelEdgeUpdate', null, global);
goog.exportSymbol('proto.lnrpc.ChannelFeeReport', null, global);
goog.exportSymbol('proto.lnrpc.ChannelGraph', null, global);
goog.exportSymbol('proto.lnrpc.ChannelGraphRequest', null, global);
goog.exportSymbol('proto.lnrpc.ChannelOpenUpdate', null, global);
goog.exportSymbol('proto.lnrpc.ChannelPoint', null, global);
goog.exportSymbol('proto.lnrpc.CloseChannelRequest', null, global);
goog.exportSymbol('proto.lnrpc.CloseStatusUpdate', null, global);
goog.exportSymbol('proto.lnrpc.ClosedChannelUpdate', null, global);
goog.exportSymbol('proto.lnrpc.ConfirmationUpdate', null, global);
goog.exportSymbol('proto.lnrpc.ConnectPeerRequest', null, global);
goog.exportSymbol('proto.lnrpc.ConnectPeerResponse', null, global);
goog.exportSymbol('proto.lnrpc.DebugLevelRequest', null, global);
goog.exportSymbol('proto.lnrpc.DebugLevelResponse', null, global);
goog.exportSymbol('proto.lnrpc.DeleteAllPaymentsRequest', null, global);
goog.exportSymbol('proto.lnrpc.DeleteAllPaymentsResponse', null, global);
goog.exportSymbol('proto.lnrpc.DisconnectPeerRequest', null, global);
goog.exportSymbol('proto.lnrpc.DisconnectPeerResponse', null, global);
goog.exportSymbol('proto.lnrpc.FeeReportRequest', null, global);
goog.exportSymbol('proto.lnrpc.FeeReportResponse', null, global);
goog.exportSymbol('proto.lnrpc.ForwardingEvent', null, global);
goog.exportSymbol('proto.lnrpc.ForwardingHistoryRequest', null, global);
goog.exportSymbol('proto.lnrpc.ForwardingHistoryResponse', null, global);
goog.exportSymbol('proto.lnrpc.GenSeedRequest', null, global);
goog.exportSymbol('proto.lnrpc.GenSeedResponse', null, global);
goog.exportSymbol('proto.lnrpc.GetInfoRequest', null, global);
goog.exportSymbol('proto.lnrpc.GetInfoResponse', null, global);
goog.exportSymbol('proto.lnrpc.GetTransactionsRequest', null, global);
goog.exportSymbol('proto.lnrpc.GraphTopologySubscription', null, global);
goog.exportSymbol('proto.lnrpc.GraphTopologyUpdate', null, global);
goog.exportSymbol('proto.lnrpc.HTLC', null, global);
goog.exportSymbol('proto.lnrpc.Hop', null, global);
goog.exportSymbol('proto.lnrpc.HopHint', null, global);
goog.exportSymbol('proto.lnrpc.InitWalletRequest', null, global);
goog.exportSymbol('proto.lnrpc.InitWalletResponse', null, global);
goog.exportSymbol('proto.lnrpc.Invoice', null, global);
goog.exportSymbol('proto.lnrpc.InvoiceSubscription', null, global);
goog.exportSymbol('proto.lnrpc.LightningAddress', null, global);
goog.exportSymbol('proto.lnrpc.LightningNode', null, global);
goog.exportSymbol('proto.lnrpc.ListChannelsRequest', null, global);
goog.exportSymbol('proto.lnrpc.ListChannelsResponse', null, global);
goog.exportSymbol('proto.lnrpc.ListInvoiceRequest', null, global);
goog.exportSymbol('proto.lnrpc.ListInvoiceResponse', null, global);
goog.exportSymbol('proto.lnrpc.ListPaymentsRequest', null, global);
goog.exportSymbol('proto.lnrpc.ListPaymentsResponse', null, global);
goog.exportSymbol('proto.lnrpc.ListPeersRequest', null, global);
goog.exportSymbol('proto.lnrpc.ListPeersResponse', null, global);
goog.exportSymbol('proto.lnrpc.NetworkInfo', null, global);
goog.exportSymbol('proto.lnrpc.NetworkInfoRequest', null, global);
goog.exportSymbol('proto.lnrpc.NewAddressRequest', null, global);
goog.exportSymbol('proto.lnrpc.NewAddressRequest.AddressType', null, global);
goog.exportSymbol('proto.lnrpc.NewAddressResponse', null, global);
goog.exportSymbol('proto.lnrpc.NewWitnessAddressRequest', null, global);
goog.exportSymbol('proto.lnrpc.NodeAddress', null, global);
goog.exportSymbol('proto.lnrpc.NodeInfo', null, global);
goog.exportSymbol('proto.lnrpc.NodeInfoRequest', null, global);
goog.exportSymbol('proto.lnrpc.NodeUpdate', null, global);
goog.exportSymbol('proto.lnrpc.OpenChannelRequest', null, global);
goog.exportSymbol('proto.lnrpc.OpenStatusUpdate', null, global);
goog.exportSymbol('proto.lnrpc.PayReq', null, global);
goog.exportSymbol('proto.lnrpc.PayReqString', null, global);
goog.exportSymbol('proto.lnrpc.Payment', null, global);
goog.exportSymbol('proto.lnrpc.PaymentHash', null, global);
goog.exportSymbol('proto.lnrpc.Peer', null, global);
goog.exportSymbol('proto.lnrpc.PendingChannelsRequest', null, global);
goog.exportSymbol('proto.lnrpc.PendingChannelsResponse', null, global);
goog.exportSymbol('proto.lnrpc.PendingChannelsResponse.ClosedChannel', null, global);
goog.exportSymbol('proto.lnrpc.PendingChannelsResponse.ForceClosedChannel', null, global);
goog.exportSymbol('proto.lnrpc.PendingChannelsResponse.PendingChannel', null, global);
goog.exportSymbol('proto.lnrpc.PendingChannelsResponse.PendingOpenChannel', null, global);
goog.exportSymbol('proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel', null, global);
goog.exportSymbol('proto.lnrpc.PendingHTLC', null, global);
goog.exportSymbol('proto.lnrpc.PendingUpdate', null, global);
goog.exportSymbol('proto.lnrpc.PolicyUpdateRequest', null, global);
goog.exportSymbol('proto.lnrpc.PolicyUpdateResponse', null, global);
goog.exportSymbol('proto.lnrpc.QueryRoutesRequest', null, global);
goog.exportSymbol('proto.lnrpc.QueryRoutesResponse', null, global);
goog.exportSymbol('proto.lnrpc.Route', null, global);
goog.exportSymbol('proto.lnrpc.RouteHint', null, global);
goog.exportSymbol('proto.lnrpc.RoutingPolicy', null, global);
goog.exportSymbol('proto.lnrpc.SendCoinsRequest', null, global);
goog.exportSymbol('proto.lnrpc.SendCoinsResponse', null, global);
goog.exportSymbol('proto.lnrpc.SendManyRequest', null, global);
goog.exportSymbol('proto.lnrpc.SendManyResponse', null, global);
goog.exportSymbol('proto.lnrpc.SendRequest', null, global);
goog.exportSymbol('proto.lnrpc.SendResponse', null, global);
goog.exportSymbol('proto.lnrpc.SignMessageRequest', null, global);
goog.exportSymbol('proto.lnrpc.SignMessageResponse', null, global);
goog.exportSymbol('proto.lnrpc.StopRequest', null, global);
goog.exportSymbol('proto.lnrpc.StopResponse', null, global);
goog.exportSymbol('proto.lnrpc.Transaction', null, global);
goog.exportSymbol('proto.lnrpc.TransactionDetails', null, global);
goog.exportSymbol('proto.lnrpc.UnlockWalletRequest', null, global);
goog.exportSymbol('proto.lnrpc.UnlockWalletResponse', null, global);
goog.exportSymbol('proto.lnrpc.VerifyMessageRequest', null, global);
goog.exportSymbol('proto.lnrpc.VerifyMessageResponse', null, global);
goog.exportSymbol('proto.lnrpc.WalletBalanceRequest', null, global);
goog.exportSymbol('proto.lnrpc.WalletBalanceResponse', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.GenSeedRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.GenSeedRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.GenSeedRequest.displayName = 'proto.lnrpc.GenSeedRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.GenSeedRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.GenSeedRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.GenSeedRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.GenSeedRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    aezeedPassphrase: msg.getAezeedPassphrase_asB64(),
    seedEntropy: msg.getSeedEntropy_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.GenSeedRequest}
 */
proto.lnrpc.GenSeedRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.GenSeedRequest;
  return proto.lnrpc.GenSeedRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.GenSeedRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.GenSeedRequest}
 */
proto.lnrpc.GenSeedRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setAezeedPassphrase(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setSeedEntropy(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.GenSeedRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.GenSeedRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.GenSeedRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.GenSeedRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getAezeedPassphrase_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = this.getSeedEntropy_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.GenSeedRequest} The clone.
 */
proto.lnrpc.GenSeedRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.GenSeedRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bytes aezeed_passphrase = 1;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.GenSeedRequest.prototype.getAezeedPassphrase = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/**
 * optional bytes aezeed_passphrase = 1;
 * This is a type-conversion wrapper around `getAezeedPassphrase()`
 * @return {string}
 */
proto.lnrpc.GenSeedRequest.prototype.getAezeedPassphrase_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getAezeedPassphrase()));
};


/**
 * optional bytes aezeed_passphrase = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAezeedPassphrase()`
 * @return {!Uint8Array}
 */
proto.lnrpc.GenSeedRequest.prototype.getAezeedPassphrase_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getAezeedPassphrase()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.GenSeedRequest.prototype.setAezeedPassphrase = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional bytes seed_entropy = 2;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.GenSeedRequest.prototype.getSeedEntropy = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/**
 * optional bytes seed_entropy = 2;
 * This is a type-conversion wrapper around `getSeedEntropy()`
 * @return {string}
 */
proto.lnrpc.GenSeedRequest.prototype.getSeedEntropy_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getSeedEntropy()));
};


/**
 * optional bytes seed_entropy = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSeedEntropy()`
 * @return {!Uint8Array}
 */
proto.lnrpc.GenSeedRequest.prototype.getSeedEntropy_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getSeedEntropy()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.GenSeedRequest.prototype.setSeedEntropy = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.GenSeedResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.GenSeedResponse.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.GenSeedResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.GenSeedResponse.displayName = 'proto.lnrpc.GenSeedResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.GenSeedResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.GenSeedResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.GenSeedResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.GenSeedResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.GenSeedResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    cipherSeedMnemonicList: jspb.Message.getField(msg, 1),
    encipheredSeed: msg.getEncipheredSeed_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.GenSeedResponse}
 */
proto.lnrpc.GenSeedResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.GenSeedResponse;
  return proto.lnrpc.GenSeedResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.GenSeedResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.GenSeedResponse}
 */
proto.lnrpc.GenSeedResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.getCipherSeedMnemonicList().push(value);
      msg.setCipherSeedMnemonicList(msg.getCipherSeedMnemonicList());
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setEncipheredSeed(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.GenSeedResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.GenSeedResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.GenSeedResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.GenSeedResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getCipherSeedMnemonicList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
  f = this.getEncipheredSeed_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.GenSeedResponse} The clone.
 */
proto.lnrpc.GenSeedResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.GenSeedResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * repeated string cipher_seed_mnemonic = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<string>}
 */
proto.lnrpc.GenSeedResponse.prototype.getCipherSeedMnemonicList = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.getField(this, 1));
};


/** @param {Array.<string>} value  */
proto.lnrpc.GenSeedResponse.prototype.setCipherSeedMnemonicList = function(value) {
  jspb.Message.setField(this, 1, value || []);
};


proto.lnrpc.GenSeedResponse.prototype.clearCipherSeedMnemonicList = function() {
  jspb.Message.setField(this, 1, []);
};


/**
 * optional bytes enciphered_seed = 2;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.GenSeedResponse.prototype.getEncipheredSeed = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/**
 * optional bytes enciphered_seed = 2;
 * This is a type-conversion wrapper around `getEncipheredSeed()`
 * @return {string}
 */
proto.lnrpc.GenSeedResponse.prototype.getEncipheredSeed_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getEncipheredSeed()));
};


/**
 * optional bytes enciphered_seed = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getEncipheredSeed()`
 * @return {!Uint8Array}
 */
proto.lnrpc.GenSeedResponse.prototype.getEncipheredSeed_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getEncipheredSeed()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.GenSeedResponse.prototype.setEncipheredSeed = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.InitWalletRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.InitWalletRequest.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.InitWalletRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.InitWalletRequest.displayName = 'proto.lnrpc.InitWalletRequest';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.InitWalletRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.InitWalletRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.InitWalletRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.InitWalletRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.InitWalletRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    walletPassword: msg.getWalletPassword_asB64(),
    cipherSeedMnemonicList: jspb.Message.getField(msg, 2),
    aezeedPassphrase: msg.getAezeedPassphrase_asB64(),
    recoveryWindow: msg.getRecoveryWindow()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.InitWalletRequest}
 */
proto.lnrpc.InitWalletRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.InitWalletRequest;
  return proto.lnrpc.InitWalletRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.InitWalletRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.InitWalletRequest}
 */
proto.lnrpc.InitWalletRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setWalletPassword(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.getCipherSeedMnemonicList().push(value);
      msg.setCipherSeedMnemonicList(msg.getCipherSeedMnemonicList());
      break;
    case 3:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setAezeedPassphrase(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setRecoveryWindow(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.InitWalletRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.InitWalletRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.InitWalletRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.InitWalletRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getWalletPassword_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = this.getCipherSeedMnemonicList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      2,
      f
    );
  }
  f = this.getAezeedPassphrase_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      3,
      f
    );
  }
  f = this.getRecoveryWindow();
  if (f !== 0) {
    writer.writeInt32(
      4,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.InitWalletRequest} The clone.
 */
proto.lnrpc.InitWalletRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.InitWalletRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bytes wallet_password = 1;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.InitWalletRequest.prototype.getWalletPassword = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/**
 * optional bytes wallet_password = 1;
 * This is a type-conversion wrapper around `getWalletPassword()`
 * @return {string}
 */
proto.lnrpc.InitWalletRequest.prototype.getWalletPassword_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getWalletPassword()));
};


/**
 * optional bytes wallet_password = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getWalletPassword()`
 * @return {!Uint8Array}
 */
proto.lnrpc.InitWalletRequest.prototype.getWalletPassword_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getWalletPassword()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.InitWalletRequest.prototype.setWalletPassword = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * repeated string cipher_seed_mnemonic = 2;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<string>}
 */
proto.lnrpc.InitWalletRequest.prototype.getCipherSeedMnemonicList = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.getField(this, 2));
};


/** @param {Array.<string>} value  */
proto.lnrpc.InitWalletRequest.prototype.setCipherSeedMnemonicList = function(value) {
  jspb.Message.setField(this, 2, value || []);
};


proto.lnrpc.InitWalletRequest.prototype.clearCipherSeedMnemonicList = function() {
  jspb.Message.setField(this, 2, []);
};


/**
 * optional bytes aezeed_passphrase = 3;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.InitWalletRequest.prototype.getAezeedPassphrase = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 3, ""));
};


/**
 * optional bytes aezeed_passphrase = 3;
 * This is a type-conversion wrapper around `getAezeedPassphrase()`
 * @return {string}
 */
proto.lnrpc.InitWalletRequest.prototype.getAezeedPassphrase_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getAezeedPassphrase()));
};


/**
 * optional bytes aezeed_passphrase = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAezeedPassphrase()`
 * @return {!Uint8Array}
 */
proto.lnrpc.InitWalletRequest.prototype.getAezeedPassphrase_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getAezeedPassphrase()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.InitWalletRequest.prototype.setAezeedPassphrase = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional int32 recovery_window = 4;
 * @return {number}
 */
proto.lnrpc.InitWalletRequest.prototype.getRecoveryWindow = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.InitWalletRequest.prototype.setRecoveryWindow = function(value) {
  jspb.Message.setField(this, 4, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.InitWalletResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.InitWalletResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.InitWalletResponse.displayName = 'proto.lnrpc.InitWalletResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.InitWalletResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.InitWalletResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.InitWalletResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.InitWalletResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.InitWalletResponse}
 */
proto.lnrpc.InitWalletResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.InitWalletResponse;
  return proto.lnrpc.InitWalletResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.InitWalletResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.InitWalletResponse}
 */
proto.lnrpc.InitWalletResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.InitWalletResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.InitWalletResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.InitWalletResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.InitWalletResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.InitWalletResponse} The clone.
 */
proto.lnrpc.InitWalletResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.InitWalletResponse} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.UnlockWalletRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.UnlockWalletRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.UnlockWalletRequest.displayName = 'proto.lnrpc.UnlockWalletRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.UnlockWalletRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.UnlockWalletRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.UnlockWalletRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.UnlockWalletRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    walletPassword: msg.getWalletPassword_asB64(),
    recoveryWindow: msg.getRecoveryWindow()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.UnlockWalletRequest}
 */
proto.lnrpc.UnlockWalletRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.UnlockWalletRequest;
  return proto.lnrpc.UnlockWalletRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.UnlockWalletRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.UnlockWalletRequest}
 */
proto.lnrpc.UnlockWalletRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setWalletPassword(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setRecoveryWindow(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.UnlockWalletRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.UnlockWalletRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.UnlockWalletRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.UnlockWalletRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getWalletPassword_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = this.getRecoveryWindow();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.UnlockWalletRequest} The clone.
 */
proto.lnrpc.UnlockWalletRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.UnlockWalletRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bytes wallet_password = 1;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.UnlockWalletRequest.prototype.getWalletPassword = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/**
 * optional bytes wallet_password = 1;
 * This is a type-conversion wrapper around `getWalletPassword()`
 * @return {string}
 */
proto.lnrpc.UnlockWalletRequest.prototype.getWalletPassword_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getWalletPassword()));
};


/**
 * optional bytes wallet_password = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getWalletPassword()`
 * @return {!Uint8Array}
 */
proto.lnrpc.UnlockWalletRequest.prototype.getWalletPassword_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getWalletPassword()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.UnlockWalletRequest.prototype.setWalletPassword = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int32 recovery_window = 2;
 * @return {number}
 */
proto.lnrpc.UnlockWalletRequest.prototype.getRecoveryWindow = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.UnlockWalletRequest.prototype.setRecoveryWindow = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.UnlockWalletResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.UnlockWalletResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.UnlockWalletResponse.displayName = 'proto.lnrpc.UnlockWalletResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.UnlockWalletResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.UnlockWalletResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.UnlockWalletResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.UnlockWalletResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.UnlockWalletResponse}
 */
proto.lnrpc.UnlockWalletResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.UnlockWalletResponse;
  return proto.lnrpc.UnlockWalletResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.UnlockWalletResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.UnlockWalletResponse}
 */
proto.lnrpc.UnlockWalletResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.UnlockWalletResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.UnlockWalletResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.UnlockWalletResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.UnlockWalletResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.UnlockWalletResponse} The clone.
 */
proto.lnrpc.UnlockWalletResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.UnlockWalletResponse} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.Transaction = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.Transaction.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.Transaction, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.Transaction.displayName = 'proto.lnrpc.Transaction';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.Transaction.repeatedFields_ = [8];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.Transaction.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.Transaction.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.Transaction} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.Transaction.toObject = function(includeInstance, msg) {
  var f, obj = {
    txHash: msg.getTxHash(),
    amount: msg.getAmount(),
    numConfirmations: msg.getNumConfirmations(),
    blockHash: msg.getBlockHash(),
    blockHeight: msg.getBlockHeight(),
    timeStamp: msg.getTimeStamp(),
    totalFees: msg.getTotalFees(),
    destAddressesList: jspb.Message.getField(msg, 8)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.Transaction}
 */
proto.lnrpc.Transaction.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.Transaction;
  return proto.lnrpc.Transaction.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.Transaction} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.Transaction}
 */
proto.lnrpc.Transaction.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTxHash(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setAmount(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setNumConfirmations(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setBlockHash(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setBlockHeight(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTimeStamp(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotalFees(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.getDestAddressesList().push(value);
      msg.setDestAddressesList(msg.getDestAddressesList());
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.Transaction} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.Transaction.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.Transaction.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.Transaction.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getTxHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = this.getAmount();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = this.getNumConfirmations();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = this.getBlockHash();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = this.getBlockHeight();
  if (f !== 0) {
    writer.writeInt32(
      5,
      f
    );
  }
  f = this.getTimeStamp();
  if (f !== 0) {
    writer.writeInt64(
      6,
      f
    );
  }
  f = this.getTotalFees();
  if (f !== 0) {
    writer.writeInt64(
      7,
      f
    );
  }
  f = this.getDestAddressesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      8,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.Transaction} The clone.
 */
proto.lnrpc.Transaction.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.Transaction} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string tx_hash = 1;
 * @return {string}
 */
proto.lnrpc.Transaction.prototype.getTxHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.Transaction.prototype.setTxHash = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int64 amount = 2;
 * @return {number}
 */
proto.lnrpc.Transaction.prototype.getAmount = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.Transaction.prototype.setAmount = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int32 num_confirmations = 3;
 * @return {number}
 */
proto.lnrpc.Transaction.prototype.getNumConfirmations = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.Transaction.prototype.setNumConfirmations = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional string block_hash = 4;
 * @return {string}
 */
proto.lnrpc.Transaction.prototype.getBlockHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 4, ""));
};


/** @param {string} value  */
proto.lnrpc.Transaction.prototype.setBlockHash = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional int32 block_height = 5;
 * @return {number}
 */
proto.lnrpc.Transaction.prototype.getBlockHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.Transaction.prototype.setBlockHeight = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional int64 time_stamp = 6;
 * @return {number}
 */
proto.lnrpc.Transaction.prototype.getTimeStamp = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 6, 0));
};


/** @param {number} value  */
proto.lnrpc.Transaction.prototype.setTimeStamp = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional int64 total_fees = 7;
 * @return {number}
 */
proto.lnrpc.Transaction.prototype.getTotalFees = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 7, 0));
};


/** @param {number} value  */
proto.lnrpc.Transaction.prototype.setTotalFees = function(value) {
  jspb.Message.setField(this, 7, value);
};


/**
 * repeated string dest_addresses = 8;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<string>}
 */
proto.lnrpc.Transaction.prototype.getDestAddressesList = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.getField(this, 8));
};


/** @param {Array.<string>} value  */
proto.lnrpc.Transaction.prototype.setDestAddressesList = function(value) {
  jspb.Message.setField(this, 8, value || []);
};


proto.lnrpc.Transaction.prototype.clearDestAddressesList = function() {
  jspb.Message.setField(this, 8, []);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.GetTransactionsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.GetTransactionsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.GetTransactionsRequest.displayName = 'proto.lnrpc.GetTransactionsRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.GetTransactionsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.GetTransactionsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.GetTransactionsRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.GetTransactionsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.GetTransactionsRequest}
 */
proto.lnrpc.GetTransactionsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.GetTransactionsRequest;
  return proto.lnrpc.GetTransactionsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.GetTransactionsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.GetTransactionsRequest}
 */
proto.lnrpc.GetTransactionsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.GetTransactionsRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.GetTransactionsRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.GetTransactionsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.GetTransactionsRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.GetTransactionsRequest} The clone.
 */
proto.lnrpc.GetTransactionsRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.GetTransactionsRequest} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.TransactionDetails = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.TransactionDetails.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.TransactionDetails, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.TransactionDetails.displayName = 'proto.lnrpc.TransactionDetails';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.TransactionDetails.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.TransactionDetails.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.TransactionDetails.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.TransactionDetails} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.TransactionDetails.toObject = function(includeInstance, msg) {
  var f, obj = {
    transactionsList: jspb.Message.toObjectList(msg.getTransactionsList(),
    proto.lnrpc.Transaction.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.TransactionDetails}
 */
proto.lnrpc.TransactionDetails.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.TransactionDetails;
  return proto.lnrpc.TransactionDetails.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.TransactionDetails} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.TransactionDetails}
 */
proto.lnrpc.TransactionDetails.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.Transaction;
      reader.readMessage(value,proto.lnrpc.Transaction.deserializeBinaryFromReader);
      msg.getTransactionsList().push(value);
      msg.setTransactionsList(msg.getTransactionsList());
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.TransactionDetails} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.TransactionDetails.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.TransactionDetails.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.TransactionDetails.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getTransactionsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.lnrpc.Transaction.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.TransactionDetails} The clone.
 */
proto.lnrpc.TransactionDetails.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.TransactionDetails} */ (jspb.Message.cloneMessage(this));
};


/**
 * repeated Transaction transactions = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.Transaction>}
 */
proto.lnrpc.TransactionDetails.prototype.getTransactionsList = function() {
  return /** @type{!Array.<!proto.lnrpc.Transaction>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.Transaction, 1));
};


/** @param {Array.<!proto.lnrpc.Transaction>} value  */
proto.lnrpc.TransactionDetails.prototype.setTransactionsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


proto.lnrpc.TransactionDetails.prototype.clearTransactionsList = function() {
  this.setTransactionsList([]);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.SendRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.SendRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.SendRequest.displayName = 'proto.lnrpc.SendRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.SendRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.SendRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.SendRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.SendRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    dest: msg.getDest_asB64(),
    destString: msg.getDestString(),
    amt: msg.getAmt(),
    paymentHash: msg.getPaymentHash_asB64(),
    paymentHashString: msg.getPaymentHashString(),
    paymentRequest: msg.getPaymentRequest(),
    finalCltvDelta: msg.getFinalCltvDelta()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.SendRequest}
 */
proto.lnrpc.SendRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.SendRequest;
  return proto.lnrpc.SendRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.SendRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.SendRequest}
 */
proto.lnrpc.SendRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setDest(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDestString(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setAmt(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setPaymentHash(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setPaymentHashString(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setPaymentRequest(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setFinalCltvDelta(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.SendRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SendRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.SendRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SendRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getDest_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = this.getDestString();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = this.getAmt();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = this.getPaymentHash_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      4,
      f
    );
  }
  f = this.getPaymentHashString();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = this.getPaymentRequest();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = this.getFinalCltvDelta();
  if (f !== 0) {
    writer.writeInt32(
      7,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.SendRequest} The clone.
 */
proto.lnrpc.SendRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.SendRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bytes dest = 1;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.SendRequest.prototype.getDest = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/**
 * optional bytes dest = 1;
 * This is a type-conversion wrapper around `getDest()`
 * @return {string}
 */
proto.lnrpc.SendRequest.prototype.getDest_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getDest()));
};


/**
 * optional bytes dest = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getDest()`
 * @return {!Uint8Array}
 */
proto.lnrpc.SendRequest.prototype.getDest_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getDest()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.SendRequest.prototype.setDest = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string dest_string = 2;
 * @return {string}
 */
proto.lnrpc.SendRequest.prototype.getDestString = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.SendRequest.prototype.setDestString = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int64 amt = 3;
 * @return {number}
 */
proto.lnrpc.SendRequest.prototype.getAmt = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.SendRequest.prototype.setAmt = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional bytes payment_hash = 4;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.SendRequest.prototype.getPaymentHash = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 4, ""));
};


/**
 * optional bytes payment_hash = 4;
 * This is a type-conversion wrapper around `getPaymentHash()`
 * @return {string}
 */
proto.lnrpc.SendRequest.prototype.getPaymentHash_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getPaymentHash()));
};


/**
 * optional bytes payment_hash = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPaymentHash()`
 * @return {!Uint8Array}
 */
proto.lnrpc.SendRequest.prototype.getPaymentHash_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getPaymentHash()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.SendRequest.prototype.setPaymentHash = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional string payment_hash_string = 5;
 * @return {string}
 */
proto.lnrpc.SendRequest.prototype.getPaymentHashString = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 5, ""));
};


/** @param {string} value  */
proto.lnrpc.SendRequest.prototype.setPaymentHashString = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional string payment_request = 6;
 * @return {string}
 */
proto.lnrpc.SendRequest.prototype.getPaymentRequest = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 6, ""));
};


/** @param {string} value  */
proto.lnrpc.SendRequest.prototype.setPaymentRequest = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional int32 final_cltv_delta = 7;
 * @return {number}
 */
proto.lnrpc.SendRequest.prototype.getFinalCltvDelta = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 7, 0));
};


/** @param {number} value  */
proto.lnrpc.SendRequest.prototype.setFinalCltvDelta = function(value) {
  jspb.Message.setField(this, 7, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.SendResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.SendResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.SendResponse.displayName = 'proto.lnrpc.SendResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.SendResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.SendResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.SendResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.SendResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    paymentError: msg.getPaymentError(),
    paymentPreimage: msg.getPaymentPreimage_asB64(),
    paymentRoute: (f = msg.getPaymentRoute()) && proto.lnrpc.Route.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.SendResponse}
 */
proto.lnrpc.SendResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.SendResponse;
  return proto.lnrpc.SendResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.SendResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.SendResponse}
 */
proto.lnrpc.SendResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPaymentError(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setPaymentPreimage(value);
      break;
    case 3:
      var value = new proto.lnrpc.Route;
      reader.readMessage(value,proto.lnrpc.Route.deserializeBinaryFromReader);
      msg.setPaymentRoute(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.SendResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SendResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.SendResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SendResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getPaymentError();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = this.getPaymentPreimage_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = this.getPaymentRoute();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.lnrpc.Route.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.SendResponse} The clone.
 */
proto.lnrpc.SendResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.SendResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string payment_error = 1;
 * @return {string}
 */
proto.lnrpc.SendResponse.prototype.getPaymentError = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.SendResponse.prototype.setPaymentError = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional bytes payment_preimage = 2;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.SendResponse.prototype.getPaymentPreimage = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/**
 * optional bytes payment_preimage = 2;
 * This is a type-conversion wrapper around `getPaymentPreimage()`
 * @return {string}
 */
proto.lnrpc.SendResponse.prototype.getPaymentPreimage_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getPaymentPreimage()));
};


/**
 * optional bytes payment_preimage = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPaymentPreimage()`
 * @return {!Uint8Array}
 */
proto.lnrpc.SendResponse.prototype.getPaymentPreimage_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getPaymentPreimage()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.SendResponse.prototype.setPaymentPreimage = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional Route payment_route = 3;
 * @return {proto.lnrpc.Route}
 */
proto.lnrpc.SendResponse.prototype.getPaymentRoute = function() {
  return /** @type{proto.lnrpc.Route} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.Route, 3));
};


/** @param {proto.lnrpc.Route|undefined} value  */
proto.lnrpc.SendResponse.prototype.setPaymentRoute = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.lnrpc.SendResponse.prototype.clearPaymentRoute = function() {
  this.setPaymentRoute(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.SendResponse.prototype.hasPaymentRoute = function() {
  return jspb.Message.getField(this, 3) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ChannelPoint = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.lnrpc.ChannelPoint.oneofGroups_);
};
goog.inherits(proto.lnrpc.ChannelPoint, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ChannelPoint.displayName = 'proto.lnrpc.ChannelPoint';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.lnrpc.ChannelPoint.oneofGroups_ = [[1,2]];

/**
 * @enum {number}
 */
proto.lnrpc.ChannelPoint.FundingTxidCase = {
  FUNDING_TXID_NOT_SET: 0,
  FUNDING_TXID_BYTES: 1,
  FUNDING_TXID_STR: 2
};

/**
 * @return {proto.lnrpc.ChannelPoint.FundingTxidCase}
 */
proto.lnrpc.ChannelPoint.prototype.getFundingTxidCase = function() {
  return /** @type {proto.lnrpc.ChannelPoint.FundingTxidCase} */(jspb.Message.computeOneofCase(this, proto.lnrpc.ChannelPoint.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ChannelPoint.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ChannelPoint.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ChannelPoint} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ChannelPoint.toObject = function(includeInstance, msg) {
  var f, obj = {
    fundingTxidBytes: msg.getFundingTxidBytes_asB64(),
    fundingTxidStr: jspb.Message.getField(msg, 2),
    outputIndex: msg.getOutputIndex()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ChannelPoint}
 */
proto.lnrpc.ChannelPoint.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ChannelPoint;
  return proto.lnrpc.ChannelPoint.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ChannelPoint} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ChannelPoint}
 */
proto.lnrpc.ChannelPoint.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setFundingTxidBytes(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setFundingTxidStr(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setOutputIndex(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ChannelPoint} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelPoint.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ChannelPoint.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelPoint.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = jspb.Message.getField(this, 1);
  if (f != null) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = jspb.Message.getField(this, 2);
  if (f != null) {
    writer.writeString(
      2,
      f
    );
  }
  f = this.getOutputIndex();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ChannelPoint} The clone.
 */
proto.lnrpc.ChannelPoint.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ChannelPoint} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bytes funding_txid_bytes = 1;
 * @return {(string|Uint8Array)}
 */
proto.lnrpc.ChannelPoint.prototype.getFundingTxidBytes = function() {
  return /** @type {(string|Uint8Array)} */ (!this.hasFundingTxidBytes() ? "" : jspb.Message.getField(this, 1));
};


/**
 * optional bytes funding_txid_bytes = 1;
 * This is a type-conversion wrapper around `getFundingTxidBytes()`
 * @return {string}
 */
proto.lnrpc.ChannelPoint.prototype.getFundingTxidBytes_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getFundingTxidBytes()));
};


/**
 * optional bytes funding_txid_bytes = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getFundingTxidBytes()`
 * @return {Uint8Array}
 */
proto.lnrpc.ChannelPoint.prototype.getFundingTxidBytes_asU8 = function() {
  return /** @type {Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getFundingTxidBytes()));
};


/** @param {(string|Uint8Array)|undefined} value  */
proto.lnrpc.ChannelPoint.prototype.setFundingTxidBytes = function(value) {
  jspb.Message.setOneofField(this, 1, proto.lnrpc.ChannelPoint.oneofGroups_[0], value);
};


proto.lnrpc.ChannelPoint.prototype.clearFundingTxidBytes = function() {
  jspb.Message.setOneofField(this, 1, proto.lnrpc.ChannelPoint.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.ChannelPoint.prototype.hasFundingTxidBytes = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string funding_txid_str = 2;
 * @return {string}
 */
proto.lnrpc.ChannelPoint.prototype.getFundingTxidStr = function() {
  return /** @type {string} */ (!this.hasFundingTxidStr() ? "" : jspb.Message.getField(this, 2));
};


/** @param {string?|undefined} value  */
proto.lnrpc.ChannelPoint.prototype.setFundingTxidStr = function(value) {
  jspb.Message.setOneofField(this, 2, proto.lnrpc.ChannelPoint.oneofGroups_[0], value);
};


proto.lnrpc.ChannelPoint.prototype.clearFundingTxidStr = function() {
  jspb.Message.setOneofField(this, 2, proto.lnrpc.ChannelPoint.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.ChannelPoint.prototype.hasFundingTxidStr = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional uint32 output_index = 3;
 * @return {number}
 */
proto.lnrpc.ChannelPoint.prototype.getOutputIndex = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.ChannelPoint.prototype.setOutputIndex = function(value) {
  jspb.Message.setField(this, 3, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.LightningAddress = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.LightningAddress, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.LightningAddress.displayName = 'proto.lnrpc.LightningAddress';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.LightningAddress.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.LightningAddress.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.LightningAddress} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.LightningAddress.toObject = function(includeInstance, msg) {
  var f, obj = {
    pubkey: msg.getPubkey(),
    host: msg.getHost()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.LightningAddress}
 */
proto.lnrpc.LightningAddress.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.LightningAddress;
  return proto.lnrpc.LightningAddress.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.LightningAddress} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.LightningAddress}
 */
proto.lnrpc.LightningAddress.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPubkey(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setHost(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.LightningAddress} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.LightningAddress.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.LightningAddress.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.LightningAddress.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getPubkey();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = this.getHost();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.LightningAddress} The clone.
 */
proto.lnrpc.LightningAddress.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.LightningAddress} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string pubkey = 1;
 * @return {string}
 */
proto.lnrpc.LightningAddress.prototype.getPubkey = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.LightningAddress.prototype.setPubkey = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string host = 2;
 * @return {string}
 */
proto.lnrpc.LightningAddress.prototype.getHost = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.LightningAddress.prototype.setHost = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.SendManyRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.SendManyRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.SendManyRequest.displayName = 'proto.lnrpc.SendManyRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.SendManyRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.SendManyRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.SendManyRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.SendManyRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    addrtoamountMap: (f = msg.getAddrtoamountMap(true)) ? f.toArray() : [],
    targetConf: msg.getTargetConf(),
    satPerByte: msg.getSatPerByte()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.SendManyRequest}
 */
proto.lnrpc.SendManyRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.SendManyRequest;
  return proto.lnrpc.SendManyRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.SendManyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.SendManyRequest}
 */
proto.lnrpc.SendManyRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = msg.getAddrtoamountMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readInt64);
         });
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTargetConf(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setSatPerByte(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.SendManyRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SendManyRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.SendManyRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SendManyRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getAddrtoamountMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(1, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeInt64);
  }
  f = this.getTargetConf();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = this.getSatPerByte();
  if (f !== 0) {
    writer.writeInt64(
      5,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.SendManyRequest} The clone.
 */
proto.lnrpc.SendManyRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.SendManyRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * map<string, int64> AddrToAmount = 1;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,number>}
 */
proto.lnrpc.SendManyRequest.prototype.getAddrtoamountMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,number>} */ (
      jspb.Message.getMapField(this, 1, opt_noLazyCreate,
      null));
};


/**
 * optional int32 target_conf = 3;
 * @return {number}
 */
proto.lnrpc.SendManyRequest.prototype.getTargetConf = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.SendManyRequest.prototype.setTargetConf = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional int64 sat_per_byte = 5;
 * @return {number}
 */
proto.lnrpc.SendManyRequest.prototype.getSatPerByte = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.SendManyRequest.prototype.setSatPerByte = function(value) {
  jspb.Message.setField(this, 5, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.SendManyResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.SendManyResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.SendManyResponse.displayName = 'proto.lnrpc.SendManyResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.SendManyResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.SendManyResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.SendManyResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.SendManyResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    txid: msg.getTxid()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.SendManyResponse}
 */
proto.lnrpc.SendManyResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.SendManyResponse;
  return proto.lnrpc.SendManyResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.SendManyResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.SendManyResponse}
 */
proto.lnrpc.SendManyResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTxid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.SendManyResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SendManyResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.SendManyResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SendManyResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getTxid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.SendManyResponse} The clone.
 */
proto.lnrpc.SendManyResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.SendManyResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string txid = 1;
 * @return {string}
 */
proto.lnrpc.SendManyResponse.prototype.getTxid = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.SendManyResponse.prototype.setTxid = function(value) {
  jspb.Message.setField(this, 1, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.SendCoinsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.SendCoinsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.SendCoinsRequest.displayName = 'proto.lnrpc.SendCoinsRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.SendCoinsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.SendCoinsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.SendCoinsRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.SendCoinsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    addr: msg.getAddr(),
    amount: msg.getAmount(),
    targetConf: msg.getTargetConf(),
    satPerByte: msg.getSatPerByte()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.SendCoinsRequest}
 */
proto.lnrpc.SendCoinsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.SendCoinsRequest;
  return proto.lnrpc.SendCoinsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.SendCoinsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.SendCoinsRequest}
 */
proto.lnrpc.SendCoinsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setAmount(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTargetConf(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setSatPerByte(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.SendCoinsRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SendCoinsRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.SendCoinsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SendCoinsRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getAddr();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = this.getAmount();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = this.getTargetConf();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = this.getSatPerByte();
  if (f !== 0) {
    writer.writeInt64(
      5,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.SendCoinsRequest} The clone.
 */
proto.lnrpc.SendCoinsRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.SendCoinsRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string addr = 1;
 * @return {string}
 */
proto.lnrpc.SendCoinsRequest.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.SendCoinsRequest.prototype.setAddr = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int64 amount = 2;
 * @return {number}
 */
proto.lnrpc.SendCoinsRequest.prototype.getAmount = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.SendCoinsRequest.prototype.setAmount = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int32 target_conf = 3;
 * @return {number}
 */
proto.lnrpc.SendCoinsRequest.prototype.getTargetConf = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.SendCoinsRequest.prototype.setTargetConf = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional int64 sat_per_byte = 5;
 * @return {number}
 */
proto.lnrpc.SendCoinsRequest.prototype.getSatPerByte = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.SendCoinsRequest.prototype.setSatPerByte = function(value) {
  jspb.Message.setField(this, 5, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.SendCoinsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.SendCoinsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.SendCoinsResponse.displayName = 'proto.lnrpc.SendCoinsResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.SendCoinsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.SendCoinsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.SendCoinsResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.SendCoinsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    txid: msg.getTxid()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.SendCoinsResponse}
 */
proto.lnrpc.SendCoinsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.SendCoinsResponse;
  return proto.lnrpc.SendCoinsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.SendCoinsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.SendCoinsResponse}
 */
proto.lnrpc.SendCoinsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTxid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.SendCoinsResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SendCoinsResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.SendCoinsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SendCoinsResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getTxid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.SendCoinsResponse} The clone.
 */
proto.lnrpc.SendCoinsResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.SendCoinsResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string txid = 1;
 * @return {string}
 */
proto.lnrpc.SendCoinsResponse.prototype.getTxid = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.SendCoinsResponse.prototype.setTxid = function(value) {
  jspb.Message.setField(this, 1, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.NewAddressRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.NewAddressRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.NewAddressRequest.displayName = 'proto.lnrpc.NewAddressRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.NewAddressRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.NewAddressRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.NewAddressRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.NewAddressRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    type: msg.getType()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.NewAddressRequest}
 */
proto.lnrpc.NewAddressRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.NewAddressRequest;
  return proto.lnrpc.NewAddressRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.NewAddressRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.NewAddressRequest}
 */
proto.lnrpc.NewAddressRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.lnrpc.NewAddressRequest.AddressType} */ (reader.readEnum());
      msg.setType(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.NewAddressRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NewAddressRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.NewAddressRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NewAddressRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getType();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.NewAddressRequest} The clone.
 */
proto.lnrpc.NewAddressRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.NewAddressRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional AddressType type = 1;
 * @return {!proto.lnrpc.NewAddressRequest.AddressType}
 */
proto.lnrpc.NewAddressRequest.prototype.getType = function() {
  return /** @type {!proto.lnrpc.NewAddressRequest.AddressType} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {!proto.lnrpc.NewAddressRequest.AddressType} value  */
proto.lnrpc.NewAddressRequest.prototype.setType = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * @enum {number}
 */
proto.lnrpc.NewAddressRequest.AddressType = {
  WITNESS_PUBKEY_HASH: 0,
  NESTED_PUBKEY_HASH: 1
};


/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.NewWitnessAddressRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.NewWitnessAddressRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.NewWitnessAddressRequest.displayName = 'proto.lnrpc.NewWitnessAddressRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.NewWitnessAddressRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.NewWitnessAddressRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.NewWitnessAddressRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.NewWitnessAddressRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.NewWitnessAddressRequest}
 */
proto.lnrpc.NewWitnessAddressRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.NewWitnessAddressRequest;
  return proto.lnrpc.NewWitnessAddressRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.NewWitnessAddressRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.NewWitnessAddressRequest}
 */
proto.lnrpc.NewWitnessAddressRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.NewWitnessAddressRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NewWitnessAddressRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.NewWitnessAddressRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NewWitnessAddressRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.NewWitnessAddressRequest} The clone.
 */
proto.lnrpc.NewWitnessAddressRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.NewWitnessAddressRequest} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.NewAddressResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.NewAddressResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.NewAddressResponse.displayName = 'proto.lnrpc.NewAddressResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.NewAddressResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.NewAddressResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.NewAddressResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.NewAddressResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    address: msg.getAddress()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.NewAddressResponse}
 */
proto.lnrpc.NewAddressResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.NewAddressResponse;
  return proto.lnrpc.NewAddressResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.NewAddressResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.NewAddressResponse}
 */
proto.lnrpc.NewAddressResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddress(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.NewAddressResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NewAddressResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.NewAddressResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NewAddressResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getAddress();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.NewAddressResponse} The clone.
 */
proto.lnrpc.NewAddressResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.NewAddressResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string address = 1;
 * @return {string}
 */
proto.lnrpc.NewAddressResponse.prototype.getAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.NewAddressResponse.prototype.setAddress = function(value) {
  jspb.Message.setField(this, 1, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.SignMessageRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.SignMessageRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.SignMessageRequest.displayName = 'proto.lnrpc.SignMessageRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.SignMessageRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.SignMessageRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.SignMessageRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.SignMessageRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    msg: msg.getMsg_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.SignMessageRequest}
 */
proto.lnrpc.SignMessageRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.SignMessageRequest;
  return proto.lnrpc.SignMessageRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.SignMessageRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.SignMessageRequest}
 */
proto.lnrpc.SignMessageRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setMsg(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.SignMessageRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SignMessageRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.SignMessageRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SignMessageRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getMsg_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.SignMessageRequest} The clone.
 */
proto.lnrpc.SignMessageRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.SignMessageRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bytes msg = 1;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.SignMessageRequest.prototype.getMsg = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/**
 * optional bytes msg = 1;
 * This is a type-conversion wrapper around `getMsg()`
 * @return {string}
 */
proto.lnrpc.SignMessageRequest.prototype.getMsg_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getMsg()));
};


/**
 * optional bytes msg = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getMsg()`
 * @return {!Uint8Array}
 */
proto.lnrpc.SignMessageRequest.prototype.getMsg_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getMsg()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.SignMessageRequest.prototype.setMsg = function(value) {
  jspb.Message.setField(this, 1, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.SignMessageResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.SignMessageResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.SignMessageResponse.displayName = 'proto.lnrpc.SignMessageResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.SignMessageResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.SignMessageResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.SignMessageResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.SignMessageResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    signature: msg.getSignature()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.SignMessageResponse}
 */
proto.lnrpc.SignMessageResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.SignMessageResponse;
  return proto.lnrpc.SignMessageResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.SignMessageResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.SignMessageResponse}
 */
proto.lnrpc.SignMessageResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setSignature(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.SignMessageResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SignMessageResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.SignMessageResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.SignMessageResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getSignature();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.SignMessageResponse} The clone.
 */
proto.lnrpc.SignMessageResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.SignMessageResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string signature = 1;
 * @return {string}
 */
proto.lnrpc.SignMessageResponse.prototype.getSignature = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.SignMessageResponse.prototype.setSignature = function(value) {
  jspb.Message.setField(this, 1, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.VerifyMessageRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.VerifyMessageRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.VerifyMessageRequest.displayName = 'proto.lnrpc.VerifyMessageRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.VerifyMessageRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.VerifyMessageRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.VerifyMessageRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.VerifyMessageRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    msg: msg.getMsg_asB64(),
    signature: msg.getSignature()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.VerifyMessageRequest}
 */
proto.lnrpc.VerifyMessageRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.VerifyMessageRequest;
  return proto.lnrpc.VerifyMessageRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.VerifyMessageRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.VerifyMessageRequest}
 */
proto.lnrpc.VerifyMessageRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setMsg(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSignature(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.VerifyMessageRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.VerifyMessageRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.VerifyMessageRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.VerifyMessageRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getMsg_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = this.getSignature();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.VerifyMessageRequest} The clone.
 */
proto.lnrpc.VerifyMessageRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.VerifyMessageRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bytes msg = 1;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.VerifyMessageRequest.prototype.getMsg = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/**
 * optional bytes msg = 1;
 * This is a type-conversion wrapper around `getMsg()`
 * @return {string}
 */
proto.lnrpc.VerifyMessageRequest.prototype.getMsg_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getMsg()));
};


/**
 * optional bytes msg = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getMsg()`
 * @return {!Uint8Array}
 */
proto.lnrpc.VerifyMessageRequest.prototype.getMsg_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getMsg()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.VerifyMessageRequest.prototype.setMsg = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string signature = 2;
 * @return {string}
 */
proto.lnrpc.VerifyMessageRequest.prototype.getSignature = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.VerifyMessageRequest.prototype.setSignature = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.VerifyMessageResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.VerifyMessageResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.VerifyMessageResponse.displayName = 'proto.lnrpc.VerifyMessageResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.VerifyMessageResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.VerifyMessageResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.VerifyMessageResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.VerifyMessageResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    valid: msg.getValid(),
    pubkey: msg.getPubkey()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.VerifyMessageResponse}
 */
proto.lnrpc.VerifyMessageResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.VerifyMessageResponse;
  return proto.lnrpc.VerifyMessageResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.VerifyMessageResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.VerifyMessageResponse}
 */
proto.lnrpc.VerifyMessageResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setValid(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setPubkey(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.VerifyMessageResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.VerifyMessageResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.VerifyMessageResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.VerifyMessageResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getValid();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = this.getPubkey();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.VerifyMessageResponse} The clone.
 */
proto.lnrpc.VerifyMessageResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.VerifyMessageResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bool valid = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.VerifyMessageResponse.prototype.getValid = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 1, false));
};


/** @param {boolean} value  */
proto.lnrpc.VerifyMessageResponse.prototype.setValid = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string pubkey = 2;
 * @return {string}
 */
proto.lnrpc.VerifyMessageResponse.prototype.getPubkey = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.VerifyMessageResponse.prototype.setPubkey = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ConnectPeerRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ConnectPeerRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ConnectPeerRequest.displayName = 'proto.lnrpc.ConnectPeerRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ConnectPeerRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ConnectPeerRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ConnectPeerRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ConnectPeerRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    addr: (f = msg.getAddr()) && proto.lnrpc.LightningAddress.toObject(includeInstance, f),
    perm: msg.getPerm()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ConnectPeerRequest}
 */
proto.lnrpc.ConnectPeerRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ConnectPeerRequest;
  return proto.lnrpc.ConnectPeerRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ConnectPeerRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ConnectPeerRequest}
 */
proto.lnrpc.ConnectPeerRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.LightningAddress;
      reader.readMessage(value,proto.lnrpc.LightningAddress.deserializeBinaryFromReader);
      msg.setAddr(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setPerm(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ConnectPeerRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ConnectPeerRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ConnectPeerRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ConnectPeerRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getAddr();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.lnrpc.LightningAddress.serializeBinaryToWriter
    );
  }
  f = this.getPerm();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ConnectPeerRequest} The clone.
 */
proto.lnrpc.ConnectPeerRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ConnectPeerRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional LightningAddress addr = 1;
 * @return {proto.lnrpc.LightningAddress}
 */
proto.lnrpc.ConnectPeerRequest.prototype.getAddr = function() {
  return /** @type{proto.lnrpc.LightningAddress} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.LightningAddress, 1));
};


/** @param {proto.lnrpc.LightningAddress|undefined} value  */
proto.lnrpc.ConnectPeerRequest.prototype.setAddr = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.lnrpc.ConnectPeerRequest.prototype.clearAddr = function() {
  this.setAddr(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.ConnectPeerRequest.prototype.hasAddr = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional bool perm = 2;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.ConnectPeerRequest.prototype.getPerm = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 2, false));
};


/** @param {boolean} value  */
proto.lnrpc.ConnectPeerRequest.prototype.setPerm = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ConnectPeerResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ConnectPeerResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ConnectPeerResponse.displayName = 'proto.lnrpc.ConnectPeerResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ConnectPeerResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ConnectPeerResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ConnectPeerResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ConnectPeerResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ConnectPeerResponse}
 */
proto.lnrpc.ConnectPeerResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ConnectPeerResponse;
  return proto.lnrpc.ConnectPeerResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ConnectPeerResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ConnectPeerResponse}
 */
proto.lnrpc.ConnectPeerResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ConnectPeerResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ConnectPeerResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ConnectPeerResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ConnectPeerResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ConnectPeerResponse} The clone.
 */
proto.lnrpc.ConnectPeerResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ConnectPeerResponse} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.DisconnectPeerRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.DisconnectPeerRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.DisconnectPeerRequest.displayName = 'proto.lnrpc.DisconnectPeerRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.DisconnectPeerRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.DisconnectPeerRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.DisconnectPeerRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.DisconnectPeerRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    pubKey: msg.getPubKey()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.DisconnectPeerRequest}
 */
proto.lnrpc.DisconnectPeerRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.DisconnectPeerRequest;
  return proto.lnrpc.DisconnectPeerRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.DisconnectPeerRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.DisconnectPeerRequest}
 */
proto.lnrpc.DisconnectPeerRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPubKey(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.DisconnectPeerRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.DisconnectPeerRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.DisconnectPeerRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.DisconnectPeerRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getPubKey();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.DisconnectPeerRequest} The clone.
 */
proto.lnrpc.DisconnectPeerRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.DisconnectPeerRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string pub_key = 1;
 * @return {string}
 */
proto.lnrpc.DisconnectPeerRequest.prototype.getPubKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.DisconnectPeerRequest.prototype.setPubKey = function(value) {
  jspb.Message.setField(this, 1, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.DisconnectPeerResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.DisconnectPeerResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.DisconnectPeerResponse.displayName = 'proto.lnrpc.DisconnectPeerResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.DisconnectPeerResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.DisconnectPeerResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.DisconnectPeerResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.DisconnectPeerResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.DisconnectPeerResponse}
 */
proto.lnrpc.DisconnectPeerResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.DisconnectPeerResponse;
  return proto.lnrpc.DisconnectPeerResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.DisconnectPeerResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.DisconnectPeerResponse}
 */
proto.lnrpc.DisconnectPeerResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.DisconnectPeerResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.DisconnectPeerResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.DisconnectPeerResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.DisconnectPeerResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.DisconnectPeerResponse} The clone.
 */
proto.lnrpc.DisconnectPeerResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.DisconnectPeerResponse} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.HTLC = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.HTLC, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.HTLC.displayName = 'proto.lnrpc.HTLC';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.HTLC.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.HTLC.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.HTLC} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.HTLC.toObject = function(includeInstance, msg) {
  var f, obj = {
    incoming: msg.getIncoming(),
    amount: msg.getAmount(),
    hashLock: msg.getHashLock_asB64(),
    expirationHeight: msg.getExpirationHeight()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.HTLC}
 */
proto.lnrpc.HTLC.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.HTLC;
  return proto.lnrpc.HTLC.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.HTLC} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.HTLC}
 */
proto.lnrpc.HTLC.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIncoming(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setAmount(value);
      break;
    case 3:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setHashLock(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setExpirationHeight(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.HTLC} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.HTLC.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.HTLC.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.HTLC.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getIncoming();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = this.getAmount();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = this.getHashLock_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      3,
      f
    );
  }
  f = this.getExpirationHeight();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.HTLC} The clone.
 */
proto.lnrpc.HTLC.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.HTLC} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bool incoming = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.HTLC.prototype.getIncoming = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 1, false));
};


/** @param {boolean} value  */
proto.lnrpc.HTLC.prototype.setIncoming = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int64 amount = 2;
 * @return {number}
 */
proto.lnrpc.HTLC.prototype.getAmount = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.HTLC.prototype.setAmount = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional bytes hash_lock = 3;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.HTLC.prototype.getHashLock = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 3, ""));
};


/**
 * optional bytes hash_lock = 3;
 * This is a type-conversion wrapper around `getHashLock()`
 * @return {string}
 */
proto.lnrpc.HTLC.prototype.getHashLock_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getHashLock()));
};


/**
 * optional bytes hash_lock = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getHashLock()`
 * @return {!Uint8Array}
 */
proto.lnrpc.HTLC.prototype.getHashLock_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getHashLock()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.HTLC.prototype.setHashLock = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional uint32 expiration_height = 4;
 * @return {number}
 */
proto.lnrpc.HTLC.prototype.getExpirationHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.HTLC.prototype.setExpirationHeight = function(value) {
  jspb.Message.setField(this, 4, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.Channel = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.Channel.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.Channel, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.Channel.displayName = 'proto.lnrpc.Channel';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.Channel.repeatedFields_ = [15];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.Channel.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.Channel.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.Channel} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.Channel.toObject = function(includeInstance, msg) {
  var f, obj = {
    active: msg.getActive(),
    remotePubkey: msg.getRemotePubkey(),
    channelPoint: msg.getChannelPoint(),
    chanId: msg.getChanId(),
    capacity: msg.getCapacity(),
    localBalance: msg.getLocalBalance(),
    remoteBalance: msg.getRemoteBalance(),
    commitFee: msg.getCommitFee(),
    commitWeight: msg.getCommitWeight(),
    feePerKw: msg.getFeePerKw(),
    unsettledBalance: msg.getUnsettledBalance(),
    totalSatoshisSent: msg.getTotalSatoshisSent(),
    totalSatoshisReceived: msg.getTotalSatoshisReceived(),
    numUpdates: msg.getNumUpdates(),
    pendingHtlcsList: jspb.Message.toObjectList(msg.getPendingHtlcsList(),
    proto.lnrpc.HTLC.toObject, includeInstance),
    csvDelay: msg.getCsvDelay(),
    pb_private: msg.getPrivate()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.Channel}
 */
proto.lnrpc.Channel.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.Channel;
  return proto.lnrpc.Channel.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.Channel} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.Channel}
 */
proto.lnrpc.Channel.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setActive(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setRemotePubkey(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setChannelPoint(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setChanId(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCapacity(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setLocalBalance(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setRemoteBalance(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCommitFee(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCommitWeight(value);
      break;
    case 10:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setFeePerKw(value);
      break;
    case 11:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setUnsettledBalance(value);
      break;
    case 12:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotalSatoshisSent(value);
      break;
    case 13:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotalSatoshisReceived(value);
      break;
    case 14:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setNumUpdates(value);
      break;
    case 15:
      var value = new proto.lnrpc.HTLC;
      reader.readMessage(value,proto.lnrpc.HTLC.deserializeBinaryFromReader);
      msg.getPendingHtlcsList().push(value);
      msg.setPendingHtlcsList(msg.getPendingHtlcsList());
      break;
    case 16:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setCsvDelay(value);
      break;
    case 17:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setPrivate(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.Channel} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.Channel.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.Channel.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.Channel.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getActive();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = this.getRemotePubkey();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = this.getChannelPoint();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = this.getChanId();
  if (f !== 0) {
    writer.writeUint64(
      4,
      f
    );
  }
  f = this.getCapacity();
  if (f !== 0) {
    writer.writeInt64(
      5,
      f
    );
  }
  f = this.getLocalBalance();
  if (f !== 0) {
    writer.writeInt64(
      6,
      f
    );
  }
  f = this.getRemoteBalance();
  if (f !== 0) {
    writer.writeInt64(
      7,
      f
    );
  }
  f = this.getCommitFee();
  if (f !== 0) {
    writer.writeInt64(
      8,
      f
    );
  }
  f = this.getCommitWeight();
  if (f !== 0) {
    writer.writeInt64(
      9,
      f
    );
  }
  f = this.getFeePerKw();
  if (f !== 0) {
    writer.writeInt64(
      10,
      f
    );
  }
  f = this.getUnsettledBalance();
  if (f !== 0) {
    writer.writeInt64(
      11,
      f
    );
  }
  f = this.getTotalSatoshisSent();
  if (f !== 0) {
    writer.writeInt64(
      12,
      f
    );
  }
  f = this.getTotalSatoshisReceived();
  if (f !== 0) {
    writer.writeInt64(
      13,
      f
    );
  }
  f = this.getNumUpdates();
  if (f !== 0) {
    writer.writeUint64(
      14,
      f
    );
  }
  f = this.getPendingHtlcsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      15,
      f,
      proto.lnrpc.HTLC.serializeBinaryToWriter
    );
  }
  f = this.getCsvDelay();
  if (f !== 0) {
    writer.writeUint32(
      16,
      f
    );
  }
  f = this.getPrivate();
  if (f) {
    writer.writeBool(
      17,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.Channel} The clone.
 */
proto.lnrpc.Channel.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.Channel} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bool active = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.Channel.prototype.getActive = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 1, false));
};


/** @param {boolean} value  */
proto.lnrpc.Channel.prototype.setActive = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string remote_pubkey = 2;
 * @return {string}
 */
proto.lnrpc.Channel.prototype.getRemotePubkey = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.Channel.prototype.setRemotePubkey = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string channel_point = 3;
 * @return {string}
 */
proto.lnrpc.Channel.prototype.getChannelPoint = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 3, ""));
};


/** @param {string} value  */
proto.lnrpc.Channel.prototype.setChannelPoint = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional uint64 chan_id = 4;
 * @return {number}
 */
proto.lnrpc.Channel.prototype.getChanId = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.Channel.prototype.setChanId = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional int64 capacity = 5;
 * @return {number}
 */
proto.lnrpc.Channel.prototype.getCapacity = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.Channel.prototype.setCapacity = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional int64 local_balance = 6;
 * @return {number}
 */
proto.lnrpc.Channel.prototype.getLocalBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 6, 0));
};


/** @param {number} value  */
proto.lnrpc.Channel.prototype.setLocalBalance = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional int64 remote_balance = 7;
 * @return {number}
 */
proto.lnrpc.Channel.prototype.getRemoteBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 7, 0));
};


/** @param {number} value  */
proto.lnrpc.Channel.prototype.setRemoteBalance = function(value) {
  jspb.Message.setField(this, 7, value);
};


/**
 * optional int64 commit_fee = 8;
 * @return {number}
 */
proto.lnrpc.Channel.prototype.getCommitFee = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 8, 0));
};


/** @param {number} value  */
proto.lnrpc.Channel.prototype.setCommitFee = function(value) {
  jspb.Message.setField(this, 8, value);
};


/**
 * optional int64 commit_weight = 9;
 * @return {number}
 */
proto.lnrpc.Channel.prototype.getCommitWeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 9, 0));
};


/** @param {number} value  */
proto.lnrpc.Channel.prototype.setCommitWeight = function(value) {
  jspb.Message.setField(this, 9, value);
};


/**
 * optional int64 fee_per_kw = 10;
 * @return {number}
 */
proto.lnrpc.Channel.prototype.getFeePerKw = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 10, 0));
};


/** @param {number} value  */
proto.lnrpc.Channel.prototype.setFeePerKw = function(value) {
  jspb.Message.setField(this, 10, value);
};


/**
 * optional int64 unsettled_balance = 11;
 * @return {number}
 */
proto.lnrpc.Channel.prototype.getUnsettledBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 11, 0));
};


/** @param {number} value  */
proto.lnrpc.Channel.prototype.setUnsettledBalance = function(value) {
  jspb.Message.setField(this, 11, value);
};


/**
 * optional int64 total_satoshis_sent = 12;
 * @return {number}
 */
proto.lnrpc.Channel.prototype.getTotalSatoshisSent = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 12, 0));
};


/** @param {number} value  */
proto.lnrpc.Channel.prototype.setTotalSatoshisSent = function(value) {
  jspb.Message.setField(this, 12, value);
};


/**
 * optional int64 total_satoshis_received = 13;
 * @return {number}
 */
proto.lnrpc.Channel.prototype.getTotalSatoshisReceived = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 13, 0));
};


/** @param {number} value  */
proto.lnrpc.Channel.prototype.setTotalSatoshisReceived = function(value) {
  jspb.Message.setField(this, 13, value);
};


/**
 * optional uint64 num_updates = 14;
 * @return {number}
 */
proto.lnrpc.Channel.prototype.getNumUpdates = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 14, 0));
};


/** @param {number} value  */
proto.lnrpc.Channel.prototype.setNumUpdates = function(value) {
  jspb.Message.setField(this, 14, value);
};


/**
 * repeated HTLC pending_htlcs = 15;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.HTLC>}
 */
proto.lnrpc.Channel.prototype.getPendingHtlcsList = function() {
  return /** @type{!Array.<!proto.lnrpc.HTLC>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.HTLC, 15));
};


/** @param {Array.<!proto.lnrpc.HTLC>} value  */
proto.lnrpc.Channel.prototype.setPendingHtlcsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 15, value);
};


proto.lnrpc.Channel.prototype.clearPendingHtlcsList = function() {
  this.setPendingHtlcsList([]);
};


/**
 * optional uint32 csv_delay = 16;
 * @return {number}
 */
proto.lnrpc.Channel.prototype.getCsvDelay = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 16, 0));
};


/** @param {number} value  */
proto.lnrpc.Channel.prototype.setCsvDelay = function(value) {
  jspb.Message.setField(this, 16, value);
};


/**
 * optional bool private = 17;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.Channel.prototype.getPrivate = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 17, false));
};


/** @param {boolean} value  */
proto.lnrpc.Channel.prototype.setPrivate = function(value) {
  jspb.Message.setField(this, 17, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ListChannelsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ListChannelsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ListChannelsRequest.displayName = 'proto.lnrpc.ListChannelsRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ListChannelsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ListChannelsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ListChannelsRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ListChannelsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    activeOnly: msg.getActiveOnly(),
    inactiveOnly: msg.getInactiveOnly(),
    publicOnly: msg.getPublicOnly(),
    privateOnly: msg.getPrivateOnly()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ListChannelsRequest}
 */
proto.lnrpc.ListChannelsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ListChannelsRequest;
  return proto.lnrpc.ListChannelsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ListChannelsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ListChannelsRequest}
 */
proto.lnrpc.ListChannelsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setActiveOnly(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setInactiveOnly(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setPublicOnly(value);
      break;
    case 4:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setPrivateOnly(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ListChannelsRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListChannelsRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ListChannelsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListChannelsRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getActiveOnly();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = this.getInactiveOnly();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
  f = this.getPublicOnly();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
  f = this.getPrivateOnly();
  if (f) {
    writer.writeBool(
      4,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ListChannelsRequest} The clone.
 */
proto.lnrpc.ListChannelsRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ListChannelsRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bool active_only = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.ListChannelsRequest.prototype.getActiveOnly = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 1, false));
};


/** @param {boolean} value  */
proto.lnrpc.ListChannelsRequest.prototype.setActiveOnly = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional bool inactive_only = 2;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.ListChannelsRequest.prototype.getInactiveOnly = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 2, false));
};


/** @param {boolean} value  */
proto.lnrpc.ListChannelsRequest.prototype.setInactiveOnly = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional bool public_only = 3;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.ListChannelsRequest.prototype.getPublicOnly = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 3, false));
};


/** @param {boolean} value  */
proto.lnrpc.ListChannelsRequest.prototype.setPublicOnly = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional bool private_only = 4;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.ListChannelsRequest.prototype.getPrivateOnly = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 4, false));
};


/** @param {boolean} value  */
proto.lnrpc.ListChannelsRequest.prototype.setPrivateOnly = function(value) {
  jspb.Message.setField(this, 4, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ListChannelsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.ListChannelsResponse.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.ListChannelsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ListChannelsResponse.displayName = 'proto.lnrpc.ListChannelsResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.ListChannelsResponse.repeatedFields_ = [11];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ListChannelsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ListChannelsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ListChannelsResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ListChannelsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    channelsList: jspb.Message.toObjectList(msg.getChannelsList(),
    proto.lnrpc.Channel.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ListChannelsResponse}
 */
proto.lnrpc.ListChannelsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ListChannelsResponse;
  return proto.lnrpc.ListChannelsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ListChannelsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ListChannelsResponse}
 */
proto.lnrpc.ListChannelsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 11:
      var value = new proto.lnrpc.Channel;
      reader.readMessage(value,proto.lnrpc.Channel.deserializeBinaryFromReader);
      msg.getChannelsList().push(value);
      msg.setChannelsList(msg.getChannelsList());
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ListChannelsResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListChannelsResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ListChannelsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListChannelsResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getChannelsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      11,
      f,
      proto.lnrpc.Channel.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ListChannelsResponse} The clone.
 */
proto.lnrpc.ListChannelsResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ListChannelsResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * repeated Channel channels = 11;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.Channel>}
 */
proto.lnrpc.ListChannelsResponse.prototype.getChannelsList = function() {
  return /** @type{!Array.<!proto.lnrpc.Channel>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.Channel, 11));
};


/** @param {Array.<!proto.lnrpc.Channel>} value  */
proto.lnrpc.ListChannelsResponse.prototype.setChannelsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 11, value);
};


proto.lnrpc.ListChannelsResponse.prototype.clearChannelsList = function() {
  this.setChannelsList([]);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.Peer = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.Peer, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.Peer.displayName = 'proto.lnrpc.Peer';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.Peer.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.Peer.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.Peer} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.Peer.toObject = function(includeInstance, msg) {
  var f, obj = {
    pubKey: msg.getPubKey(),
    address: msg.getAddress(),
    bytesSent: msg.getBytesSent(),
    bytesRecv: msg.getBytesRecv(),
    satSent: msg.getSatSent(),
    satRecv: msg.getSatRecv(),
    inbound: msg.getInbound(),
    pingTime: msg.getPingTime()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.Peer}
 */
proto.lnrpc.Peer.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.Peer;
  return proto.lnrpc.Peer.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.Peer} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.Peer}
 */
proto.lnrpc.Peer.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPubKey(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddress(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setBytesSent(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setBytesRecv(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setSatSent(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setSatRecv(value);
      break;
    case 8:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setInbound(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setPingTime(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.Peer} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.Peer.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.Peer.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.Peer.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getPubKey();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = this.getAddress();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = this.getBytesSent();
  if (f !== 0) {
    writer.writeUint64(
      4,
      f
    );
  }
  f = this.getBytesRecv();
  if (f !== 0) {
    writer.writeUint64(
      5,
      f
    );
  }
  f = this.getSatSent();
  if (f !== 0) {
    writer.writeInt64(
      6,
      f
    );
  }
  f = this.getSatRecv();
  if (f !== 0) {
    writer.writeInt64(
      7,
      f
    );
  }
  f = this.getInbound();
  if (f) {
    writer.writeBool(
      8,
      f
    );
  }
  f = this.getPingTime();
  if (f !== 0) {
    writer.writeInt64(
      9,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.Peer} The clone.
 */
proto.lnrpc.Peer.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.Peer} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string pub_key = 1;
 * @return {string}
 */
proto.lnrpc.Peer.prototype.getPubKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.Peer.prototype.setPubKey = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string address = 3;
 * @return {string}
 */
proto.lnrpc.Peer.prototype.getAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 3, ""));
};


/** @param {string} value  */
proto.lnrpc.Peer.prototype.setAddress = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional uint64 bytes_sent = 4;
 * @return {number}
 */
proto.lnrpc.Peer.prototype.getBytesSent = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.Peer.prototype.setBytesSent = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional uint64 bytes_recv = 5;
 * @return {number}
 */
proto.lnrpc.Peer.prototype.getBytesRecv = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.Peer.prototype.setBytesRecv = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional int64 sat_sent = 6;
 * @return {number}
 */
proto.lnrpc.Peer.prototype.getSatSent = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 6, 0));
};


/** @param {number} value  */
proto.lnrpc.Peer.prototype.setSatSent = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional int64 sat_recv = 7;
 * @return {number}
 */
proto.lnrpc.Peer.prototype.getSatRecv = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 7, 0));
};


/** @param {number} value  */
proto.lnrpc.Peer.prototype.setSatRecv = function(value) {
  jspb.Message.setField(this, 7, value);
};


/**
 * optional bool inbound = 8;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.Peer.prototype.getInbound = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 8, false));
};


/** @param {boolean} value  */
proto.lnrpc.Peer.prototype.setInbound = function(value) {
  jspb.Message.setField(this, 8, value);
};


/**
 * optional int64 ping_time = 9;
 * @return {number}
 */
proto.lnrpc.Peer.prototype.getPingTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 9, 0));
};


/** @param {number} value  */
proto.lnrpc.Peer.prototype.setPingTime = function(value) {
  jspb.Message.setField(this, 9, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ListPeersRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ListPeersRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ListPeersRequest.displayName = 'proto.lnrpc.ListPeersRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ListPeersRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ListPeersRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ListPeersRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ListPeersRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ListPeersRequest}
 */
proto.lnrpc.ListPeersRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ListPeersRequest;
  return proto.lnrpc.ListPeersRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ListPeersRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ListPeersRequest}
 */
proto.lnrpc.ListPeersRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ListPeersRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListPeersRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ListPeersRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListPeersRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ListPeersRequest} The clone.
 */
proto.lnrpc.ListPeersRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ListPeersRequest} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ListPeersResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.ListPeersResponse.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.ListPeersResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ListPeersResponse.displayName = 'proto.lnrpc.ListPeersResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.ListPeersResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ListPeersResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ListPeersResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ListPeersResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ListPeersResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    peersList: jspb.Message.toObjectList(msg.getPeersList(),
    proto.lnrpc.Peer.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ListPeersResponse}
 */
proto.lnrpc.ListPeersResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ListPeersResponse;
  return proto.lnrpc.ListPeersResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ListPeersResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ListPeersResponse}
 */
proto.lnrpc.ListPeersResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.Peer;
      reader.readMessage(value,proto.lnrpc.Peer.deserializeBinaryFromReader);
      msg.getPeersList().push(value);
      msg.setPeersList(msg.getPeersList());
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ListPeersResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListPeersResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ListPeersResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListPeersResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getPeersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.lnrpc.Peer.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ListPeersResponse} The clone.
 */
proto.lnrpc.ListPeersResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ListPeersResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * repeated Peer peers = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.Peer>}
 */
proto.lnrpc.ListPeersResponse.prototype.getPeersList = function() {
  return /** @type{!Array.<!proto.lnrpc.Peer>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.Peer, 1));
};


/** @param {Array.<!proto.lnrpc.Peer>} value  */
proto.lnrpc.ListPeersResponse.prototype.setPeersList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


proto.lnrpc.ListPeersResponse.prototype.clearPeersList = function() {
  this.setPeersList([]);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.GetInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.GetInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.GetInfoRequest.displayName = 'proto.lnrpc.GetInfoRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.GetInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.GetInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.GetInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.GetInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.GetInfoRequest}
 */
proto.lnrpc.GetInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.GetInfoRequest;
  return proto.lnrpc.GetInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.GetInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.GetInfoRequest}
 */
proto.lnrpc.GetInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.GetInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.GetInfoRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.GetInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.GetInfoRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.GetInfoRequest} The clone.
 */
proto.lnrpc.GetInfoRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.GetInfoRequest} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.GetInfoResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.GetInfoResponse.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.GetInfoResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.GetInfoResponse.displayName = 'proto.lnrpc.GetInfoResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.GetInfoResponse.repeatedFields_ = [11,12];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.GetInfoResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.GetInfoResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.GetInfoResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.GetInfoResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    identityPubkey: msg.getIdentityPubkey(),
    alias: msg.getAlias(),
    numPendingChannels: msg.getNumPendingChannels(),
    numActiveChannels: msg.getNumActiveChannels(),
    numPeers: msg.getNumPeers(),
    blockHeight: msg.getBlockHeight(),
    blockHash: msg.getBlockHash(),
    syncedToChain: msg.getSyncedToChain(),
    testnet: msg.getTestnet(),
    chainsList: jspb.Message.getField(msg, 11),
    urisList: jspb.Message.getField(msg, 12),
    bestHeaderTimestamp: msg.getBestHeaderTimestamp(),
    version: msg.getVersion()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.GetInfoResponse}
 */
proto.lnrpc.GetInfoResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.GetInfoResponse;
  return proto.lnrpc.GetInfoResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.GetInfoResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.GetInfoResponse}
 */
proto.lnrpc.GetInfoResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setIdentityPubkey(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setAlias(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setNumPendingChannels(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setNumActiveChannels(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setNumPeers(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setBlockHeight(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setBlockHash(value);
      break;
    case 9:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSyncedToChain(value);
      break;
    case 10:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setTestnet(value);
      break;
    case 11:
      var value = /** @type {string} */ (reader.readString());
      msg.getChainsList().push(value);
      msg.setChainsList(msg.getChainsList());
      break;
    case 12:
      var value = /** @type {string} */ (reader.readString());
      msg.getUrisList().push(value);
      msg.setUrisList(msg.getUrisList());
      break;
    case 13:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setBestHeaderTimestamp(value);
      break;
    case 14:
      var value = /** @type {string} */ (reader.readString());
      msg.setVersion(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.GetInfoResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.GetInfoResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.GetInfoResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.GetInfoResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getIdentityPubkey();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = this.getAlias();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = this.getNumPendingChannels();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = this.getNumActiveChannels();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
  f = this.getNumPeers();
  if (f !== 0) {
    writer.writeUint32(
      5,
      f
    );
  }
  f = this.getBlockHeight();
  if (f !== 0) {
    writer.writeUint32(
      6,
      f
    );
  }
  f = this.getBlockHash();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = this.getSyncedToChain();
  if (f) {
    writer.writeBool(
      9,
      f
    );
  }
  f = this.getTestnet();
  if (f) {
    writer.writeBool(
      10,
      f
    );
  }
  f = this.getChainsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      11,
      f
    );
  }
  f = this.getUrisList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      12,
      f
    );
  }
  f = this.getBestHeaderTimestamp();
  if (f !== 0) {
    writer.writeInt64(
      13,
      f
    );
  }
  f = this.getVersion();
  if (f.length > 0) {
    writer.writeString(
      14,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.GetInfoResponse} The clone.
 */
proto.lnrpc.GetInfoResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.GetInfoResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string identity_pubkey = 1;
 * @return {string}
 */
proto.lnrpc.GetInfoResponse.prototype.getIdentityPubkey = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.GetInfoResponse.prototype.setIdentityPubkey = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string alias = 2;
 * @return {string}
 */
proto.lnrpc.GetInfoResponse.prototype.getAlias = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.GetInfoResponse.prototype.setAlias = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional uint32 num_pending_channels = 3;
 * @return {number}
 */
proto.lnrpc.GetInfoResponse.prototype.getNumPendingChannels = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.GetInfoResponse.prototype.setNumPendingChannels = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional uint32 num_active_channels = 4;
 * @return {number}
 */
proto.lnrpc.GetInfoResponse.prototype.getNumActiveChannels = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.GetInfoResponse.prototype.setNumActiveChannels = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional uint32 num_peers = 5;
 * @return {number}
 */
proto.lnrpc.GetInfoResponse.prototype.getNumPeers = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.GetInfoResponse.prototype.setNumPeers = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional uint32 block_height = 6;
 * @return {number}
 */
proto.lnrpc.GetInfoResponse.prototype.getBlockHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 6, 0));
};


/** @param {number} value  */
proto.lnrpc.GetInfoResponse.prototype.setBlockHeight = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional string block_hash = 8;
 * @return {string}
 */
proto.lnrpc.GetInfoResponse.prototype.getBlockHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 8, ""));
};


/** @param {string} value  */
proto.lnrpc.GetInfoResponse.prototype.setBlockHash = function(value) {
  jspb.Message.setField(this, 8, value);
};


/**
 * optional bool synced_to_chain = 9;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.GetInfoResponse.prototype.getSyncedToChain = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 9, false));
};


/** @param {boolean} value  */
proto.lnrpc.GetInfoResponse.prototype.setSyncedToChain = function(value) {
  jspb.Message.setField(this, 9, value);
};


/**
 * optional bool testnet = 10;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.GetInfoResponse.prototype.getTestnet = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 10, false));
};


/** @param {boolean} value  */
proto.lnrpc.GetInfoResponse.prototype.setTestnet = function(value) {
  jspb.Message.setField(this, 10, value);
};


/**
 * repeated string chains = 11;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<string>}
 */
proto.lnrpc.GetInfoResponse.prototype.getChainsList = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.getField(this, 11));
};


/** @param {Array.<string>} value  */
proto.lnrpc.GetInfoResponse.prototype.setChainsList = function(value) {
  jspb.Message.setField(this, 11, value || []);
};


proto.lnrpc.GetInfoResponse.prototype.clearChainsList = function() {
  jspb.Message.setField(this, 11, []);
};


/**
 * repeated string uris = 12;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<string>}
 */
proto.lnrpc.GetInfoResponse.prototype.getUrisList = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.getField(this, 12));
};


/** @param {Array.<string>} value  */
proto.lnrpc.GetInfoResponse.prototype.setUrisList = function(value) {
  jspb.Message.setField(this, 12, value || []);
};


proto.lnrpc.GetInfoResponse.prototype.clearUrisList = function() {
  jspb.Message.setField(this, 12, []);
};


/**
 * optional int64 best_header_timestamp = 13;
 * @return {number}
 */
proto.lnrpc.GetInfoResponse.prototype.getBestHeaderTimestamp = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 13, 0));
};


/** @param {number} value  */
proto.lnrpc.GetInfoResponse.prototype.setBestHeaderTimestamp = function(value) {
  jspb.Message.setField(this, 13, value);
};


/**
 * optional string version = 14;
 * @return {string}
 */
proto.lnrpc.GetInfoResponse.prototype.getVersion = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 14, ""));
};


/** @param {string} value  */
proto.lnrpc.GetInfoResponse.prototype.setVersion = function(value) {
  jspb.Message.setField(this, 14, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ConfirmationUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ConfirmationUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ConfirmationUpdate.displayName = 'proto.lnrpc.ConfirmationUpdate';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ConfirmationUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ConfirmationUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ConfirmationUpdate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ConfirmationUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    blockSha: msg.getBlockSha_asB64(),
    blockHeight: msg.getBlockHeight(),
    numConfsLeft: msg.getNumConfsLeft()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ConfirmationUpdate}
 */
proto.lnrpc.ConfirmationUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ConfirmationUpdate;
  return proto.lnrpc.ConfirmationUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ConfirmationUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ConfirmationUpdate}
 */
proto.lnrpc.ConfirmationUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBlockSha(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setBlockHeight(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setNumConfsLeft(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ConfirmationUpdate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ConfirmationUpdate.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ConfirmationUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ConfirmationUpdate.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getBlockSha_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = this.getBlockHeight();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = this.getNumConfsLeft();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ConfirmationUpdate} The clone.
 */
proto.lnrpc.ConfirmationUpdate.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ConfirmationUpdate} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bytes block_sha = 1;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.ConfirmationUpdate.prototype.getBlockSha = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/**
 * optional bytes block_sha = 1;
 * This is a type-conversion wrapper around `getBlockSha()`
 * @return {string}
 */
proto.lnrpc.ConfirmationUpdate.prototype.getBlockSha_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBlockSha()));
};


/**
 * optional bytes block_sha = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBlockSha()`
 * @return {!Uint8Array}
 */
proto.lnrpc.ConfirmationUpdate.prototype.getBlockSha_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBlockSha()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.ConfirmationUpdate.prototype.setBlockSha = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int32 block_height = 2;
 * @return {number}
 */
proto.lnrpc.ConfirmationUpdate.prototype.getBlockHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.ConfirmationUpdate.prototype.setBlockHeight = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional uint32 num_confs_left = 3;
 * @return {number}
 */
proto.lnrpc.ConfirmationUpdate.prototype.getNumConfsLeft = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.ConfirmationUpdate.prototype.setNumConfsLeft = function(value) {
  jspb.Message.setField(this, 3, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ChannelOpenUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ChannelOpenUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ChannelOpenUpdate.displayName = 'proto.lnrpc.ChannelOpenUpdate';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ChannelOpenUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ChannelOpenUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ChannelOpenUpdate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ChannelOpenUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    channelPoint: (f = msg.getChannelPoint()) && proto.lnrpc.ChannelPoint.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ChannelOpenUpdate}
 */
proto.lnrpc.ChannelOpenUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ChannelOpenUpdate;
  return proto.lnrpc.ChannelOpenUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ChannelOpenUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ChannelOpenUpdate}
 */
proto.lnrpc.ChannelOpenUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.ChannelPoint;
      reader.readMessage(value,proto.lnrpc.ChannelPoint.deserializeBinaryFromReader);
      msg.setChannelPoint(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ChannelOpenUpdate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelOpenUpdate.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ChannelOpenUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelOpenUpdate.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getChannelPoint();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.lnrpc.ChannelPoint.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ChannelOpenUpdate} The clone.
 */
proto.lnrpc.ChannelOpenUpdate.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ChannelOpenUpdate} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional ChannelPoint channel_point = 1;
 * @return {proto.lnrpc.ChannelPoint}
 */
proto.lnrpc.ChannelOpenUpdate.prototype.getChannelPoint = function() {
  return /** @type{proto.lnrpc.ChannelPoint} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.ChannelPoint, 1));
};


/** @param {proto.lnrpc.ChannelPoint|undefined} value  */
proto.lnrpc.ChannelOpenUpdate.prototype.setChannelPoint = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.lnrpc.ChannelOpenUpdate.prototype.clearChannelPoint = function() {
  this.setChannelPoint(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.ChannelOpenUpdate.prototype.hasChannelPoint = function() {
  return jspb.Message.getField(this, 1) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ChannelCloseUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ChannelCloseUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ChannelCloseUpdate.displayName = 'proto.lnrpc.ChannelCloseUpdate';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ChannelCloseUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ChannelCloseUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ChannelCloseUpdate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ChannelCloseUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    closingTxid: msg.getClosingTxid_asB64(),
    success: msg.getSuccess()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ChannelCloseUpdate}
 */
proto.lnrpc.ChannelCloseUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ChannelCloseUpdate;
  return proto.lnrpc.ChannelCloseUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ChannelCloseUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ChannelCloseUpdate}
 */
proto.lnrpc.ChannelCloseUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setClosingTxid(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSuccess(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ChannelCloseUpdate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelCloseUpdate.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ChannelCloseUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelCloseUpdate.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getClosingTxid_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = this.getSuccess();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ChannelCloseUpdate} The clone.
 */
proto.lnrpc.ChannelCloseUpdate.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ChannelCloseUpdate} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bytes closing_txid = 1;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.ChannelCloseUpdate.prototype.getClosingTxid = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/**
 * optional bytes closing_txid = 1;
 * This is a type-conversion wrapper around `getClosingTxid()`
 * @return {string}
 */
proto.lnrpc.ChannelCloseUpdate.prototype.getClosingTxid_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getClosingTxid()));
};


/**
 * optional bytes closing_txid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getClosingTxid()`
 * @return {!Uint8Array}
 */
proto.lnrpc.ChannelCloseUpdate.prototype.getClosingTxid_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getClosingTxid()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.ChannelCloseUpdate.prototype.setClosingTxid = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional bool success = 2;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.ChannelCloseUpdate.prototype.getSuccess = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 2, false));
};


/** @param {boolean} value  */
proto.lnrpc.ChannelCloseUpdate.prototype.setSuccess = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.CloseChannelRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.CloseChannelRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.CloseChannelRequest.displayName = 'proto.lnrpc.CloseChannelRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.CloseChannelRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.CloseChannelRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.CloseChannelRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.CloseChannelRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    channelPoint: (f = msg.getChannelPoint()) && proto.lnrpc.ChannelPoint.toObject(includeInstance, f),
    force: msg.getForce(),
    targetConf: msg.getTargetConf(),
    satPerByte: msg.getSatPerByte()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.CloseChannelRequest}
 */
proto.lnrpc.CloseChannelRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.CloseChannelRequest;
  return proto.lnrpc.CloseChannelRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.CloseChannelRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.CloseChannelRequest}
 */
proto.lnrpc.CloseChannelRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.ChannelPoint;
      reader.readMessage(value,proto.lnrpc.ChannelPoint.deserializeBinaryFromReader);
      msg.setChannelPoint(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setForce(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTargetConf(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setSatPerByte(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.CloseChannelRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.CloseChannelRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.CloseChannelRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.CloseChannelRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getChannelPoint();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.lnrpc.ChannelPoint.serializeBinaryToWriter
    );
  }
  f = this.getForce();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
  f = this.getTargetConf();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = this.getSatPerByte();
  if (f !== 0) {
    writer.writeInt64(
      4,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.CloseChannelRequest} The clone.
 */
proto.lnrpc.CloseChannelRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.CloseChannelRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional ChannelPoint channel_point = 1;
 * @return {proto.lnrpc.ChannelPoint}
 */
proto.lnrpc.CloseChannelRequest.prototype.getChannelPoint = function() {
  return /** @type{proto.lnrpc.ChannelPoint} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.ChannelPoint, 1));
};


/** @param {proto.lnrpc.ChannelPoint|undefined} value  */
proto.lnrpc.CloseChannelRequest.prototype.setChannelPoint = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.lnrpc.CloseChannelRequest.prototype.clearChannelPoint = function() {
  this.setChannelPoint(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.CloseChannelRequest.prototype.hasChannelPoint = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional bool force = 2;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.CloseChannelRequest.prototype.getForce = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 2, false));
};


/** @param {boolean} value  */
proto.lnrpc.CloseChannelRequest.prototype.setForce = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int32 target_conf = 3;
 * @return {number}
 */
proto.lnrpc.CloseChannelRequest.prototype.getTargetConf = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.CloseChannelRequest.prototype.setTargetConf = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional int64 sat_per_byte = 4;
 * @return {number}
 */
proto.lnrpc.CloseChannelRequest.prototype.getSatPerByte = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.CloseChannelRequest.prototype.setSatPerByte = function(value) {
  jspb.Message.setField(this, 4, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.CloseStatusUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.lnrpc.CloseStatusUpdate.oneofGroups_);
};
goog.inherits(proto.lnrpc.CloseStatusUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.CloseStatusUpdate.displayName = 'proto.lnrpc.CloseStatusUpdate';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.lnrpc.CloseStatusUpdate.oneofGroups_ = [[1,2,3]];

/**
 * @enum {number}
 */
proto.lnrpc.CloseStatusUpdate.UpdateCase = {
  UPDATE_NOT_SET: 0,
  CLOSE_PENDING: 1,
  CONFIRMATION: 2,
  CHAN_CLOSE: 3
};

/**
 * @return {proto.lnrpc.CloseStatusUpdate.UpdateCase}
 */
proto.lnrpc.CloseStatusUpdate.prototype.getUpdateCase = function() {
  return /** @type {proto.lnrpc.CloseStatusUpdate.UpdateCase} */(jspb.Message.computeOneofCase(this, proto.lnrpc.CloseStatusUpdate.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.CloseStatusUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.CloseStatusUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.CloseStatusUpdate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.CloseStatusUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    closePending: (f = msg.getClosePending()) && proto.lnrpc.PendingUpdate.toObject(includeInstance, f),
    confirmation: (f = msg.getConfirmation()) && proto.lnrpc.ConfirmationUpdate.toObject(includeInstance, f),
    chanClose: (f = msg.getChanClose()) && proto.lnrpc.ChannelCloseUpdate.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.CloseStatusUpdate}
 */
proto.lnrpc.CloseStatusUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.CloseStatusUpdate;
  return proto.lnrpc.CloseStatusUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.CloseStatusUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.CloseStatusUpdate}
 */
proto.lnrpc.CloseStatusUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.PendingUpdate;
      reader.readMessage(value,proto.lnrpc.PendingUpdate.deserializeBinaryFromReader);
      msg.setClosePending(value);
      break;
    case 2:
      var value = new proto.lnrpc.ConfirmationUpdate;
      reader.readMessage(value,proto.lnrpc.ConfirmationUpdate.deserializeBinaryFromReader);
      msg.setConfirmation(value);
      break;
    case 3:
      var value = new proto.lnrpc.ChannelCloseUpdate;
      reader.readMessage(value,proto.lnrpc.ChannelCloseUpdate.deserializeBinaryFromReader);
      msg.setChanClose(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.CloseStatusUpdate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.CloseStatusUpdate.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.CloseStatusUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.CloseStatusUpdate.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getClosePending();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.lnrpc.PendingUpdate.serializeBinaryToWriter
    );
  }
  f = this.getConfirmation();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.lnrpc.ConfirmationUpdate.serializeBinaryToWriter
    );
  }
  f = this.getChanClose();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.lnrpc.ChannelCloseUpdate.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.CloseStatusUpdate} The clone.
 */
proto.lnrpc.CloseStatusUpdate.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.CloseStatusUpdate} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional PendingUpdate close_pending = 1;
 * @return {proto.lnrpc.PendingUpdate}
 */
proto.lnrpc.CloseStatusUpdate.prototype.getClosePending = function() {
  return /** @type{proto.lnrpc.PendingUpdate} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.PendingUpdate, 1));
};


/** @param {proto.lnrpc.PendingUpdate|undefined} value  */
proto.lnrpc.CloseStatusUpdate.prototype.setClosePending = function(value) {
  jspb.Message.setOneofWrapperField(this, 1, proto.lnrpc.CloseStatusUpdate.oneofGroups_[0], value);
};


proto.lnrpc.CloseStatusUpdate.prototype.clearClosePending = function() {
  this.setClosePending(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.CloseStatusUpdate.prototype.hasClosePending = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional ConfirmationUpdate confirmation = 2;
 * @return {proto.lnrpc.ConfirmationUpdate}
 */
proto.lnrpc.CloseStatusUpdate.prototype.getConfirmation = function() {
  return /** @type{proto.lnrpc.ConfirmationUpdate} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.ConfirmationUpdate, 2));
};


/** @param {proto.lnrpc.ConfirmationUpdate|undefined} value  */
proto.lnrpc.CloseStatusUpdate.prototype.setConfirmation = function(value) {
  jspb.Message.setOneofWrapperField(this, 2, proto.lnrpc.CloseStatusUpdate.oneofGroups_[0], value);
};


proto.lnrpc.CloseStatusUpdate.prototype.clearConfirmation = function() {
  this.setConfirmation(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.CloseStatusUpdate.prototype.hasConfirmation = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional ChannelCloseUpdate chan_close = 3;
 * @return {proto.lnrpc.ChannelCloseUpdate}
 */
proto.lnrpc.CloseStatusUpdate.prototype.getChanClose = function() {
  return /** @type{proto.lnrpc.ChannelCloseUpdate} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.ChannelCloseUpdate, 3));
};


/** @param {proto.lnrpc.ChannelCloseUpdate|undefined} value  */
proto.lnrpc.CloseStatusUpdate.prototype.setChanClose = function(value) {
  jspb.Message.setOneofWrapperField(this, 3, proto.lnrpc.CloseStatusUpdate.oneofGroups_[0], value);
};


proto.lnrpc.CloseStatusUpdate.prototype.clearChanClose = function() {
  this.setChanClose(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.CloseStatusUpdate.prototype.hasChanClose = function() {
  return jspb.Message.getField(this, 3) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.PendingUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.PendingUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.PendingUpdate.displayName = 'proto.lnrpc.PendingUpdate';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.PendingUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.PendingUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.PendingUpdate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.PendingUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    txid: msg.getTxid_asB64(),
    outputIndex: msg.getOutputIndex()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.PendingUpdate}
 */
proto.lnrpc.PendingUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.PendingUpdate;
  return proto.lnrpc.PendingUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.PendingUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.PendingUpdate}
 */
proto.lnrpc.PendingUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setTxid(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setOutputIndex(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.PendingUpdate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingUpdate.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.PendingUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingUpdate.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getTxid_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = this.getOutputIndex();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.PendingUpdate} The clone.
 */
proto.lnrpc.PendingUpdate.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.PendingUpdate} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bytes txid = 1;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.PendingUpdate.prototype.getTxid = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/**
 * optional bytes txid = 1;
 * This is a type-conversion wrapper around `getTxid()`
 * @return {string}
 */
proto.lnrpc.PendingUpdate.prototype.getTxid_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getTxid()));
};


/**
 * optional bytes txid = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTxid()`
 * @return {!Uint8Array}
 */
proto.lnrpc.PendingUpdate.prototype.getTxid_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getTxid()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.PendingUpdate.prototype.setTxid = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional uint32 output_index = 2;
 * @return {number}
 */
proto.lnrpc.PendingUpdate.prototype.getOutputIndex = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingUpdate.prototype.setOutputIndex = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.OpenChannelRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.OpenChannelRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.OpenChannelRequest.displayName = 'proto.lnrpc.OpenChannelRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.OpenChannelRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.OpenChannelRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.OpenChannelRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.OpenChannelRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    nodePubkey: msg.getNodePubkey_asB64(),
    nodePubkeyString: msg.getNodePubkeyString(),
    localFundingAmount: msg.getLocalFundingAmount(),
    pushSat: msg.getPushSat(),
    targetConf: msg.getTargetConf(),
    satPerByte: msg.getSatPerByte(),
    pb_private: msg.getPrivate(),
    minHtlcMsat: msg.getMinHtlcMsat(),
    remoteCsvDelay: msg.getRemoteCsvDelay()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.OpenChannelRequest}
 */
proto.lnrpc.OpenChannelRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.OpenChannelRequest;
  return proto.lnrpc.OpenChannelRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.OpenChannelRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.OpenChannelRequest}
 */
proto.lnrpc.OpenChannelRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setNodePubkey(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setNodePubkeyString(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setLocalFundingAmount(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setPushSat(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTargetConf(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setSatPerByte(value);
      break;
    case 8:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setPrivate(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setMinHtlcMsat(value);
      break;
    case 10:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setRemoteCsvDelay(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.OpenChannelRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.OpenChannelRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.OpenChannelRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.OpenChannelRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getNodePubkey_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = this.getNodePubkeyString();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = this.getLocalFundingAmount();
  if (f !== 0) {
    writer.writeInt64(
      4,
      f
    );
  }
  f = this.getPushSat();
  if (f !== 0) {
    writer.writeInt64(
      5,
      f
    );
  }
  f = this.getTargetConf();
  if (f !== 0) {
    writer.writeInt32(
      6,
      f
    );
  }
  f = this.getSatPerByte();
  if (f !== 0) {
    writer.writeInt64(
      7,
      f
    );
  }
  f = this.getPrivate();
  if (f) {
    writer.writeBool(
      8,
      f
    );
  }
  f = this.getMinHtlcMsat();
  if (f !== 0) {
    writer.writeInt64(
      9,
      f
    );
  }
  f = this.getRemoteCsvDelay();
  if (f !== 0) {
    writer.writeUint32(
      10,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.OpenChannelRequest} The clone.
 */
proto.lnrpc.OpenChannelRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.OpenChannelRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bytes node_pubkey = 2;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.OpenChannelRequest.prototype.getNodePubkey = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/**
 * optional bytes node_pubkey = 2;
 * This is a type-conversion wrapper around `getNodePubkey()`
 * @return {string}
 */
proto.lnrpc.OpenChannelRequest.prototype.getNodePubkey_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getNodePubkey()));
};


/**
 * optional bytes node_pubkey = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getNodePubkey()`
 * @return {!Uint8Array}
 */
proto.lnrpc.OpenChannelRequest.prototype.getNodePubkey_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getNodePubkey()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.OpenChannelRequest.prototype.setNodePubkey = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string node_pubkey_string = 3;
 * @return {string}
 */
proto.lnrpc.OpenChannelRequest.prototype.getNodePubkeyString = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 3, ""));
};


/** @param {string} value  */
proto.lnrpc.OpenChannelRequest.prototype.setNodePubkeyString = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional int64 local_funding_amount = 4;
 * @return {number}
 */
proto.lnrpc.OpenChannelRequest.prototype.getLocalFundingAmount = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.OpenChannelRequest.prototype.setLocalFundingAmount = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional int64 push_sat = 5;
 * @return {number}
 */
proto.lnrpc.OpenChannelRequest.prototype.getPushSat = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.OpenChannelRequest.prototype.setPushSat = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional int32 target_conf = 6;
 * @return {number}
 */
proto.lnrpc.OpenChannelRequest.prototype.getTargetConf = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 6, 0));
};


/** @param {number} value  */
proto.lnrpc.OpenChannelRequest.prototype.setTargetConf = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional int64 sat_per_byte = 7;
 * @return {number}
 */
proto.lnrpc.OpenChannelRequest.prototype.getSatPerByte = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 7, 0));
};


/** @param {number} value  */
proto.lnrpc.OpenChannelRequest.prototype.setSatPerByte = function(value) {
  jspb.Message.setField(this, 7, value);
};


/**
 * optional bool private = 8;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.OpenChannelRequest.prototype.getPrivate = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 8, false));
};


/** @param {boolean} value  */
proto.lnrpc.OpenChannelRequest.prototype.setPrivate = function(value) {
  jspb.Message.setField(this, 8, value);
};


/**
 * optional int64 min_htlc_msat = 9;
 * @return {number}
 */
proto.lnrpc.OpenChannelRequest.prototype.getMinHtlcMsat = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 9, 0));
};


/** @param {number} value  */
proto.lnrpc.OpenChannelRequest.prototype.setMinHtlcMsat = function(value) {
  jspb.Message.setField(this, 9, value);
};


/**
 * optional uint32 remote_csv_delay = 10;
 * @return {number}
 */
proto.lnrpc.OpenChannelRequest.prototype.getRemoteCsvDelay = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 10, 0));
};


/** @param {number} value  */
proto.lnrpc.OpenChannelRequest.prototype.setRemoteCsvDelay = function(value) {
  jspb.Message.setField(this, 10, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.OpenStatusUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.lnrpc.OpenStatusUpdate.oneofGroups_);
};
goog.inherits(proto.lnrpc.OpenStatusUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.OpenStatusUpdate.displayName = 'proto.lnrpc.OpenStatusUpdate';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.lnrpc.OpenStatusUpdate.oneofGroups_ = [[1,2,3]];

/**
 * @enum {number}
 */
proto.lnrpc.OpenStatusUpdate.UpdateCase = {
  UPDATE_NOT_SET: 0,
  CHAN_PENDING: 1,
  CONFIRMATION: 2,
  CHAN_OPEN: 3
};

/**
 * @return {proto.lnrpc.OpenStatusUpdate.UpdateCase}
 */
proto.lnrpc.OpenStatusUpdate.prototype.getUpdateCase = function() {
  return /** @type {proto.lnrpc.OpenStatusUpdate.UpdateCase} */(jspb.Message.computeOneofCase(this, proto.lnrpc.OpenStatusUpdate.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.OpenStatusUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.OpenStatusUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.OpenStatusUpdate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.OpenStatusUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    chanPending: (f = msg.getChanPending()) && proto.lnrpc.PendingUpdate.toObject(includeInstance, f),
    confirmation: (f = msg.getConfirmation()) && proto.lnrpc.ConfirmationUpdate.toObject(includeInstance, f),
    chanOpen: (f = msg.getChanOpen()) && proto.lnrpc.ChannelOpenUpdate.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.OpenStatusUpdate}
 */
proto.lnrpc.OpenStatusUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.OpenStatusUpdate;
  return proto.lnrpc.OpenStatusUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.OpenStatusUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.OpenStatusUpdate}
 */
proto.lnrpc.OpenStatusUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.PendingUpdate;
      reader.readMessage(value,proto.lnrpc.PendingUpdate.deserializeBinaryFromReader);
      msg.setChanPending(value);
      break;
    case 2:
      var value = new proto.lnrpc.ConfirmationUpdate;
      reader.readMessage(value,proto.lnrpc.ConfirmationUpdate.deserializeBinaryFromReader);
      msg.setConfirmation(value);
      break;
    case 3:
      var value = new proto.lnrpc.ChannelOpenUpdate;
      reader.readMessage(value,proto.lnrpc.ChannelOpenUpdate.deserializeBinaryFromReader);
      msg.setChanOpen(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.OpenStatusUpdate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.OpenStatusUpdate.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.OpenStatusUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.OpenStatusUpdate.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getChanPending();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.lnrpc.PendingUpdate.serializeBinaryToWriter
    );
  }
  f = this.getConfirmation();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.lnrpc.ConfirmationUpdate.serializeBinaryToWriter
    );
  }
  f = this.getChanOpen();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.lnrpc.ChannelOpenUpdate.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.OpenStatusUpdate} The clone.
 */
proto.lnrpc.OpenStatusUpdate.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.OpenStatusUpdate} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional PendingUpdate chan_pending = 1;
 * @return {proto.lnrpc.PendingUpdate}
 */
proto.lnrpc.OpenStatusUpdate.prototype.getChanPending = function() {
  return /** @type{proto.lnrpc.PendingUpdate} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.PendingUpdate, 1));
};


/** @param {proto.lnrpc.PendingUpdate|undefined} value  */
proto.lnrpc.OpenStatusUpdate.prototype.setChanPending = function(value) {
  jspb.Message.setOneofWrapperField(this, 1, proto.lnrpc.OpenStatusUpdate.oneofGroups_[0], value);
};


proto.lnrpc.OpenStatusUpdate.prototype.clearChanPending = function() {
  this.setChanPending(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.OpenStatusUpdate.prototype.hasChanPending = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional ConfirmationUpdate confirmation = 2;
 * @return {proto.lnrpc.ConfirmationUpdate}
 */
proto.lnrpc.OpenStatusUpdate.prototype.getConfirmation = function() {
  return /** @type{proto.lnrpc.ConfirmationUpdate} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.ConfirmationUpdate, 2));
};


/** @param {proto.lnrpc.ConfirmationUpdate|undefined} value  */
proto.lnrpc.OpenStatusUpdate.prototype.setConfirmation = function(value) {
  jspb.Message.setOneofWrapperField(this, 2, proto.lnrpc.OpenStatusUpdate.oneofGroups_[0], value);
};


proto.lnrpc.OpenStatusUpdate.prototype.clearConfirmation = function() {
  this.setConfirmation(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.OpenStatusUpdate.prototype.hasConfirmation = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional ChannelOpenUpdate chan_open = 3;
 * @return {proto.lnrpc.ChannelOpenUpdate}
 */
proto.lnrpc.OpenStatusUpdate.prototype.getChanOpen = function() {
  return /** @type{proto.lnrpc.ChannelOpenUpdate} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.ChannelOpenUpdate, 3));
};


/** @param {proto.lnrpc.ChannelOpenUpdate|undefined} value  */
proto.lnrpc.OpenStatusUpdate.prototype.setChanOpen = function(value) {
  jspb.Message.setOneofWrapperField(this, 3, proto.lnrpc.OpenStatusUpdate.oneofGroups_[0], value);
};


proto.lnrpc.OpenStatusUpdate.prototype.clearChanOpen = function() {
  this.setChanOpen(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.OpenStatusUpdate.prototype.hasChanOpen = function() {
  return jspb.Message.getField(this, 3) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.PendingHTLC = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.PendingHTLC, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.PendingHTLC.displayName = 'proto.lnrpc.PendingHTLC';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.PendingHTLC.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.PendingHTLC.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.PendingHTLC} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.PendingHTLC.toObject = function(includeInstance, msg) {
  var f, obj = {
    incoming: msg.getIncoming(),
    amount: msg.getAmount(),
    outpoint: msg.getOutpoint(),
    maturityHeight: msg.getMaturityHeight(),
    blocksTilMaturity: msg.getBlocksTilMaturity(),
    stage: msg.getStage()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.PendingHTLC}
 */
proto.lnrpc.PendingHTLC.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.PendingHTLC;
  return proto.lnrpc.PendingHTLC.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.PendingHTLC} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.PendingHTLC}
 */
proto.lnrpc.PendingHTLC.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIncoming(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setAmount(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setOutpoint(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setMaturityHeight(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setBlocksTilMaturity(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setStage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.PendingHTLC} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingHTLC.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.PendingHTLC.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingHTLC.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getIncoming();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = this.getAmount();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = this.getOutpoint();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = this.getMaturityHeight();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
  f = this.getBlocksTilMaturity();
  if (f !== 0) {
    writer.writeInt32(
      5,
      f
    );
  }
  f = this.getStage();
  if (f !== 0) {
    writer.writeUint32(
      6,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.PendingHTLC} The clone.
 */
proto.lnrpc.PendingHTLC.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.PendingHTLC} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bool incoming = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.PendingHTLC.prototype.getIncoming = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 1, false));
};


/** @param {boolean} value  */
proto.lnrpc.PendingHTLC.prototype.setIncoming = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int64 amount = 2;
 * @return {number}
 */
proto.lnrpc.PendingHTLC.prototype.getAmount = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingHTLC.prototype.setAmount = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string outpoint = 3;
 * @return {string}
 */
proto.lnrpc.PendingHTLC.prototype.getOutpoint = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 3, ""));
};


/** @param {string} value  */
proto.lnrpc.PendingHTLC.prototype.setOutpoint = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional uint32 maturity_height = 4;
 * @return {number}
 */
proto.lnrpc.PendingHTLC.prototype.getMaturityHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingHTLC.prototype.setMaturityHeight = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional int32 blocks_til_maturity = 5;
 * @return {number}
 */
proto.lnrpc.PendingHTLC.prototype.getBlocksTilMaturity = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingHTLC.prototype.setBlocksTilMaturity = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional uint32 stage = 6;
 * @return {number}
 */
proto.lnrpc.PendingHTLC.prototype.getStage = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 6, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingHTLC.prototype.setStage = function(value) {
  jspb.Message.setField(this, 6, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.PendingChannelsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.PendingChannelsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.PendingChannelsRequest.displayName = 'proto.lnrpc.PendingChannelsRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.PendingChannelsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.PendingChannelsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.PendingChannelsRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.PendingChannelsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.PendingChannelsRequest}
 */
proto.lnrpc.PendingChannelsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.PendingChannelsRequest;
  return proto.lnrpc.PendingChannelsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.PendingChannelsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.PendingChannelsRequest}
 */
proto.lnrpc.PendingChannelsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.PendingChannelsRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingChannelsRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.PendingChannelsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingChannelsRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.PendingChannelsRequest} The clone.
 */
proto.lnrpc.PendingChannelsRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.PendingChannelsRequest} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.PendingChannelsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.PendingChannelsResponse.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.PendingChannelsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.PendingChannelsResponse.displayName = 'proto.lnrpc.PendingChannelsResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.PendingChannelsResponse.repeatedFields_ = [2,3,4,5];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.PendingChannelsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.PendingChannelsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.PendingChannelsResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.PendingChannelsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    totalLimboBalance: msg.getTotalLimboBalance(),
    pendingOpenChannelsList: jspb.Message.toObjectList(msg.getPendingOpenChannelsList(),
    proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.toObject, includeInstance),
    pendingClosingChannelsList: jspb.Message.toObjectList(msg.getPendingClosingChannelsList(),
    proto.lnrpc.PendingChannelsResponse.ClosedChannel.toObject, includeInstance),
    pendingForceClosingChannelsList: jspb.Message.toObjectList(msg.getPendingForceClosingChannelsList(),
    proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.toObject, includeInstance),
    waitingCloseChannelsList: jspb.Message.toObjectList(msg.getWaitingCloseChannelsList(),
    proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.PendingChannelsResponse}
 */
proto.lnrpc.PendingChannelsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.PendingChannelsResponse;
  return proto.lnrpc.PendingChannelsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.PendingChannelsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.PendingChannelsResponse}
 */
proto.lnrpc.PendingChannelsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotalLimboBalance(value);
      break;
    case 2:
      var value = new proto.lnrpc.PendingChannelsResponse.PendingOpenChannel;
      reader.readMessage(value,proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.deserializeBinaryFromReader);
      msg.getPendingOpenChannelsList().push(value);
      msg.setPendingOpenChannelsList(msg.getPendingOpenChannelsList());
      break;
    case 3:
      var value = new proto.lnrpc.PendingChannelsResponse.ClosedChannel;
      reader.readMessage(value,proto.lnrpc.PendingChannelsResponse.ClosedChannel.deserializeBinaryFromReader);
      msg.getPendingClosingChannelsList().push(value);
      msg.setPendingClosingChannelsList(msg.getPendingClosingChannelsList());
      break;
    case 4:
      var value = new proto.lnrpc.PendingChannelsResponse.ForceClosedChannel;
      reader.readMessage(value,proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.deserializeBinaryFromReader);
      msg.getPendingForceClosingChannelsList().push(value);
      msg.setPendingForceClosingChannelsList(msg.getPendingForceClosingChannelsList());
      break;
    case 5:
      var value = new proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel;
      reader.readMessage(value,proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.deserializeBinaryFromReader);
      msg.getWaitingCloseChannelsList().push(value);
      msg.setWaitingCloseChannelsList(msg.getWaitingCloseChannelsList());
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.PendingChannelsResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingChannelsResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.PendingChannelsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingChannelsResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getTotalLimboBalance();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = this.getPendingOpenChannelsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.serializeBinaryToWriter
    );
  }
  f = this.getPendingClosingChannelsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.lnrpc.PendingChannelsResponse.ClosedChannel.serializeBinaryToWriter
    );
  }
  f = this.getPendingForceClosingChannelsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.serializeBinaryToWriter
    );
  }
  f = this.getWaitingCloseChannelsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      5,
      f,
      proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.PendingChannelsResponse} The clone.
 */
proto.lnrpc.PendingChannelsResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.PendingChannelsResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional int64 total_limbo_balance = 1;
 * @return {number}
 */
proto.lnrpc.PendingChannelsResponse.prototype.getTotalLimboBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingChannelsResponse.prototype.setTotalLimboBalance = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * repeated PendingOpenChannel pending_open_channels = 2;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.PendingChannelsResponse.PendingOpenChannel>}
 */
proto.lnrpc.PendingChannelsResponse.prototype.getPendingOpenChannelsList = function() {
  return /** @type{!Array.<!proto.lnrpc.PendingChannelsResponse.PendingOpenChannel>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.PendingChannelsResponse.PendingOpenChannel, 2));
};


/** @param {Array.<!proto.lnrpc.PendingChannelsResponse.PendingOpenChannel>} value  */
proto.lnrpc.PendingChannelsResponse.prototype.setPendingOpenChannelsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value);
};


proto.lnrpc.PendingChannelsResponse.prototype.clearPendingOpenChannelsList = function() {
  this.setPendingOpenChannelsList([]);
};


/**
 * repeated ClosedChannel pending_closing_channels = 3;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.PendingChannelsResponse.ClosedChannel>}
 */
proto.lnrpc.PendingChannelsResponse.prototype.getPendingClosingChannelsList = function() {
  return /** @type{!Array.<!proto.lnrpc.PendingChannelsResponse.ClosedChannel>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.PendingChannelsResponse.ClosedChannel, 3));
};


/** @param {Array.<!proto.lnrpc.PendingChannelsResponse.ClosedChannel>} value  */
proto.lnrpc.PendingChannelsResponse.prototype.setPendingClosingChannelsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 3, value);
};


proto.lnrpc.PendingChannelsResponse.prototype.clearPendingClosingChannelsList = function() {
  this.setPendingClosingChannelsList([]);
};


/**
 * repeated ForceClosedChannel pending_force_closing_channels = 4;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.PendingChannelsResponse.ForceClosedChannel>}
 */
proto.lnrpc.PendingChannelsResponse.prototype.getPendingForceClosingChannelsList = function() {
  return /** @type{!Array.<!proto.lnrpc.PendingChannelsResponse.ForceClosedChannel>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.PendingChannelsResponse.ForceClosedChannel, 4));
};


/** @param {Array.<!proto.lnrpc.PendingChannelsResponse.ForceClosedChannel>} value  */
proto.lnrpc.PendingChannelsResponse.prototype.setPendingForceClosingChannelsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 4, value);
};


proto.lnrpc.PendingChannelsResponse.prototype.clearPendingForceClosingChannelsList = function() {
  this.setPendingForceClosingChannelsList([]);
};


/**
 * repeated WaitingCloseChannel waiting_close_channels = 5;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel>}
 */
proto.lnrpc.PendingChannelsResponse.prototype.getWaitingCloseChannelsList = function() {
  return /** @type{!Array.<!proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel, 5));
};


/** @param {Array.<!proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel>} value  */
proto.lnrpc.PendingChannelsResponse.prototype.setWaitingCloseChannelsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 5, value);
};


proto.lnrpc.PendingChannelsResponse.prototype.clearWaitingCloseChannelsList = function() {
  this.setWaitingCloseChannelsList([]);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.PendingChannelsResponse.PendingChannel = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.PendingChannelsResponse.PendingChannel, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.PendingChannelsResponse.PendingChannel.displayName = 'proto.lnrpc.PendingChannelsResponse.PendingChannel';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.PendingChannelsResponse.PendingChannel.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.PendingChannelsResponse.PendingChannel.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.PendingChannelsResponse.PendingChannel} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.PendingChannelsResponse.PendingChannel.toObject = function(includeInstance, msg) {
  var f, obj = {
    remoteNodePub: msg.getRemoteNodePub(),
    channelPoint: msg.getChannelPoint(),
    capacity: msg.getCapacity(),
    localBalance: msg.getLocalBalance(),
    remoteBalance: msg.getRemoteBalance()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.PendingChannelsResponse.PendingChannel}
 */
proto.lnrpc.PendingChannelsResponse.PendingChannel.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.PendingChannelsResponse.PendingChannel;
  return proto.lnrpc.PendingChannelsResponse.PendingChannel.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.PendingChannelsResponse.PendingChannel} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.PendingChannelsResponse.PendingChannel}
 */
proto.lnrpc.PendingChannelsResponse.PendingChannel.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setRemoteNodePub(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setChannelPoint(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCapacity(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setLocalBalance(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setRemoteBalance(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.PendingChannelsResponse.PendingChannel} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingChannelsResponse.PendingChannel.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.PendingChannelsResponse.PendingChannel.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingChannelsResponse.PendingChannel.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getRemoteNodePub();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = this.getChannelPoint();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = this.getCapacity();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = this.getLocalBalance();
  if (f !== 0) {
    writer.writeInt64(
      4,
      f
    );
  }
  f = this.getRemoteBalance();
  if (f !== 0) {
    writer.writeInt64(
      5,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.PendingChannelsResponse.PendingChannel} The clone.
 */
proto.lnrpc.PendingChannelsResponse.PendingChannel.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.PendingChannelsResponse.PendingChannel} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string remote_node_pub = 1;
 * @return {string}
 */
proto.lnrpc.PendingChannelsResponse.PendingChannel.prototype.getRemoteNodePub = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.PendingChannelsResponse.PendingChannel.prototype.setRemoteNodePub = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string channel_point = 2;
 * @return {string}
 */
proto.lnrpc.PendingChannelsResponse.PendingChannel.prototype.getChannelPoint = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.PendingChannelsResponse.PendingChannel.prototype.setChannelPoint = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int64 capacity = 3;
 * @return {number}
 */
proto.lnrpc.PendingChannelsResponse.PendingChannel.prototype.getCapacity = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingChannelsResponse.PendingChannel.prototype.setCapacity = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional int64 local_balance = 4;
 * @return {number}
 */
proto.lnrpc.PendingChannelsResponse.PendingChannel.prototype.getLocalBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingChannelsResponse.PendingChannel.prototype.setLocalBalance = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional int64 remote_balance = 5;
 * @return {number}
 */
proto.lnrpc.PendingChannelsResponse.PendingChannel.prototype.getRemoteBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingChannelsResponse.PendingChannel.prototype.setRemoteBalance = function(value) {
  jspb.Message.setField(this, 5, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.PendingChannelsResponse.PendingOpenChannel, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.displayName = 'proto.lnrpc.PendingChannelsResponse.PendingOpenChannel';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.PendingChannelsResponse.PendingOpenChannel} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.toObject = function(includeInstance, msg) {
  var f, obj = {
    channel: (f = msg.getChannel()) && proto.lnrpc.PendingChannelsResponse.PendingChannel.toObject(includeInstance, f),
    confirmationHeight: msg.getConfirmationHeight(),
    commitFee: msg.getCommitFee(),
    commitWeight: msg.getCommitWeight(),
    feePerKw: msg.getFeePerKw()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.PendingChannelsResponse.PendingOpenChannel}
 */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.PendingChannelsResponse.PendingOpenChannel;
  return proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.PendingChannelsResponse.PendingOpenChannel} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.PendingChannelsResponse.PendingOpenChannel}
 */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.PendingChannelsResponse.PendingChannel;
      reader.readMessage(value,proto.lnrpc.PendingChannelsResponse.PendingChannel.deserializeBinaryFromReader);
      msg.setChannel(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setConfirmationHeight(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCommitFee(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCommitWeight(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setFeePerKw(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.PendingChannelsResponse.PendingOpenChannel} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getChannel();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.lnrpc.PendingChannelsResponse.PendingChannel.serializeBinaryToWriter
    );
  }
  f = this.getConfirmationHeight();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
  f = this.getCommitFee();
  if (f !== 0) {
    writer.writeInt64(
      4,
      f
    );
  }
  f = this.getCommitWeight();
  if (f !== 0) {
    writer.writeInt64(
      5,
      f
    );
  }
  f = this.getFeePerKw();
  if (f !== 0) {
    writer.writeInt64(
      6,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.PendingChannelsResponse.PendingOpenChannel} The clone.
 */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.PendingChannelsResponse.PendingOpenChannel} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional PendingChannel channel = 1;
 * @return {proto.lnrpc.PendingChannelsResponse.PendingChannel}
 */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.getChannel = function() {
  return /** @type{proto.lnrpc.PendingChannelsResponse.PendingChannel} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.PendingChannelsResponse.PendingChannel, 1));
};


/** @param {proto.lnrpc.PendingChannelsResponse.PendingChannel|undefined} value  */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.setChannel = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.clearChannel = function() {
  this.setChannel(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.hasChannel = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional uint32 confirmation_height = 2;
 * @return {number}
 */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.getConfirmationHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.setConfirmationHeight = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int64 commit_fee = 4;
 * @return {number}
 */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.getCommitFee = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.setCommitFee = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional int64 commit_weight = 5;
 * @return {number}
 */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.getCommitWeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.setCommitWeight = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional int64 fee_per_kw = 6;
 * @return {number}
 */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.getFeePerKw = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 6, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingChannelsResponse.PendingOpenChannel.prototype.setFeePerKw = function(value) {
  jspb.Message.setField(this, 6, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.displayName = 'proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.toObject = function(includeInstance, msg) {
  var f, obj = {
    channel: (f = msg.getChannel()) && proto.lnrpc.PendingChannelsResponse.PendingChannel.toObject(includeInstance, f),
    limboBalance: msg.getLimboBalance()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel}
 */
proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel;
  return proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel}
 */
proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.PendingChannelsResponse.PendingChannel;
      reader.readMessage(value,proto.lnrpc.PendingChannelsResponse.PendingChannel.deserializeBinaryFromReader);
      msg.setChannel(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setLimboBalance(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getChannel();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.lnrpc.PendingChannelsResponse.PendingChannel.serializeBinaryToWriter
    );
  }
  f = this.getLimboBalance();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel} The clone.
 */
proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional PendingChannel channel = 1;
 * @return {proto.lnrpc.PendingChannelsResponse.PendingChannel}
 */
proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.prototype.getChannel = function() {
  return /** @type{proto.lnrpc.PendingChannelsResponse.PendingChannel} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.PendingChannelsResponse.PendingChannel, 1));
};


/** @param {proto.lnrpc.PendingChannelsResponse.PendingChannel|undefined} value  */
proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.prototype.setChannel = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.prototype.clearChannel = function() {
  this.setChannel(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.prototype.hasChannel = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional int64 limbo_balance = 2;
 * @return {number}
 */
proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.prototype.getLimboBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingChannelsResponse.WaitingCloseChannel.prototype.setLimboBalance = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.PendingChannelsResponse.ClosedChannel = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.PendingChannelsResponse.ClosedChannel, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.PendingChannelsResponse.ClosedChannel.displayName = 'proto.lnrpc.PendingChannelsResponse.ClosedChannel';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.PendingChannelsResponse.ClosedChannel.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.PendingChannelsResponse.ClosedChannel.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.PendingChannelsResponse.ClosedChannel} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.PendingChannelsResponse.ClosedChannel.toObject = function(includeInstance, msg) {
  var f, obj = {
    channel: (f = msg.getChannel()) && proto.lnrpc.PendingChannelsResponse.PendingChannel.toObject(includeInstance, f),
    closingTxid: msg.getClosingTxid()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.PendingChannelsResponse.ClosedChannel}
 */
proto.lnrpc.PendingChannelsResponse.ClosedChannel.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.PendingChannelsResponse.ClosedChannel;
  return proto.lnrpc.PendingChannelsResponse.ClosedChannel.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.PendingChannelsResponse.ClosedChannel} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.PendingChannelsResponse.ClosedChannel}
 */
proto.lnrpc.PendingChannelsResponse.ClosedChannel.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.PendingChannelsResponse.PendingChannel;
      reader.readMessage(value,proto.lnrpc.PendingChannelsResponse.PendingChannel.deserializeBinaryFromReader);
      msg.setChannel(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setClosingTxid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.PendingChannelsResponse.ClosedChannel} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingChannelsResponse.ClosedChannel.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.PendingChannelsResponse.ClosedChannel.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingChannelsResponse.ClosedChannel.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getChannel();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.lnrpc.PendingChannelsResponse.PendingChannel.serializeBinaryToWriter
    );
  }
  f = this.getClosingTxid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.PendingChannelsResponse.ClosedChannel} The clone.
 */
proto.lnrpc.PendingChannelsResponse.ClosedChannel.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.PendingChannelsResponse.ClosedChannel} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional PendingChannel channel = 1;
 * @return {proto.lnrpc.PendingChannelsResponse.PendingChannel}
 */
proto.lnrpc.PendingChannelsResponse.ClosedChannel.prototype.getChannel = function() {
  return /** @type{proto.lnrpc.PendingChannelsResponse.PendingChannel} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.PendingChannelsResponse.PendingChannel, 1));
};


/** @param {proto.lnrpc.PendingChannelsResponse.PendingChannel|undefined} value  */
proto.lnrpc.PendingChannelsResponse.ClosedChannel.prototype.setChannel = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.lnrpc.PendingChannelsResponse.ClosedChannel.prototype.clearChannel = function() {
  this.setChannel(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.PendingChannelsResponse.ClosedChannel.prototype.hasChannel = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string closing_txid = 2;
 * @return {string}
 */
proto.lnrpc.PendingChannelsResponse.ClosedChannel.prototype.getClosingTxid = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.PendingChannelsResponse.ClosedChannel.prototype.setClosingTxid = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.PendingChannelsResponse.ForceClosedChannel, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.displayName = 'proto.lnrpc.PendingChannelsResponse.ForceClosedChannel';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.repeatedFields_ = [8];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.PendingChannelsResponse.ForceClosedChannel} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.toObject = function(includeInstance, msg) {
  var f, obj = {
    channel: (f = msg.getChannel()) && proto.lnrpc.PendingChannelsResponse.PendingChannel.toObject(includeInstance, f),
    closingTxid: msg.getClosingTxid(),
    limboBalance: msg.getLimboBalance(),
    maturityHeight: msg.getMaturityHeight(),
    blocksTilMaturity: msg.getBlocksTilMaturity(),
    recoveredBalance: msg.getRecoveredBalance(),
    pendingHtlcsList: jspb.Message.toObjectList(msg.getPendingHtlcsList(),
    proto.lnrpc.PendingHTLC.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.PendingChannelsResponse.ForceClosedChannel}
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.PendingChannelsResponse.ForceClosedChannel;
  return proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.PendingChannelsResponse.ForceClosedChannel} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.PendingChannelsResponse.ForceClosedChannel}
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.PendingChannelsResponse.PendingChannel;
      reader.readMessage(value,proto.lnrpc.PendingChannelsResponse.PendingChannel.deserializeBinaryFromReader);
      msg.setChannel(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setClosingTxid(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setLimboBalance(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setMaturityHeight(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setBlocksTilMaturity(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setRecoveredBalance(value);
      break;
    case 8:
      var value = new proto.lnrpc.PendingHTLC;
      reader.readMessage(value,proto.lnrpc.PendingHTLC.deserializeBinaryFromReader);
      msg.getPendingHtlcsList().push(value);
      msg.setPendingHtlcsList(msg.getPendingHtlcsList());
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.PendingChannelsResponse.ForceClosedChannel} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getChannel();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.lnrpc.PendingChannelsResponse.PendingChannel.serializeBinaryToWriter
    );
  }
  f = this.getClosingTxid();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = this.getLimboBalance();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = this.getMaturityHeight();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
  f = this.getBlocksTilMaturity();
  if (f !== 0) {
    writer.writeInt32(
      5,
      f
    );
  }
  f = this.getRecoveredBalance();
  if (f !== 0) {
    writer.writeInt64(
      6,
      f
    );
  }
  f = this.getPendingHtlcsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      8,
      f,
      proto.lnrpc.PendingHTLC.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.PendingChannelsResponse.ForceClosedChannel} The clone.
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.PendingChannelsResponse.ForceClosedChannel} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional PendingChannel channel = 1;
 * @return {proto.lnrpc.PendingChannelsResponse.PendingChannel}
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.getChannel = function() {
  return /** @type{proto.lnrpc.PendingChannelsResponse.PendingChannel} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.PendingChannelsResponse.PendingChannel, 1));
};


/** @param {proto.lnrpc.PendingChannelsResponse.PendingChannel|undefined} value  */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.setChannel = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.clearChannel = function() {
  this.setChannel(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.hasChannel = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string closing_txid = 2;
 * @return {string}
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.getClosingTxid = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.setClosingTxid = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int64 limbo_balance = 3;
 * @return {number}
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.getLimboBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.setLimboBalance = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional uint32 maturity_height = 4;
 * @return {number}
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.getMaturityHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.setMaturityHeight = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional int32 blocks_til_maturity = 5;
 * @return {number}
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.getBlocksTilMaturity = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.setBlocksTilMaturity = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional int64 recovered_balance = 6;
 * @return {number}
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.getRecoveredBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 6, 0));
};


/** @param {number} value  */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.setRecoveredBalance = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * repeated PendingHTLC pending_htlcs = 8;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.PendingHTLC>}
 */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.getPendingHtlcsList = function() {
  return /** @type{!Array.<!proto.lnrpc.PendingHTLC>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.PendingHTLC, 8));
};


/** @param {Array.<!proto.lnrpc.PendingHTLC>} value  */
proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.setPendingHtlcsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 8, value);
};


proto.lnrpc.PendingChannelsResponse.ForceClosedChannel.prototype.clearPendingHtlcsList = function() {
  this.setPendingHtlcsList([]);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.WalletBalanceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.WalletBalanceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.WalletBalanceRequest.displayName = 'proto.lnrpc.WalletBalanceRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.WalletBalanceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.WalletBalanceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.WalletBalanceRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.WalletBalanceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.WalletBalanceRequest}
 */
proto.lnrpc.WalletBalanceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.WalletBalanceRequest;
  return proto.lnrpc.WalletBalanceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.WalletBalanceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.WalletBalanceRequest}
 */
proto.lnrpc.WalletBalanceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.WalletBalanceRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.WalletBalanceRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.WalletBalanceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.WalletBalanceRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.WalletBalanceRequest} The clone.
 */
proto.lnrpc.WalletBalanceRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.WalletBalanceRequest} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.WalletBalanceResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.WalletBalanceResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.WalletBalanceResponse.displayName = 'proto.lnrpc.WalletBalanceResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.WalletBalanceResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.WalletBalanceResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.WalletBalanceResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.WalletBalanceResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    totalBalance: msg.getTotalBalance(),
    confirmedBalance: msg.getConfirmedBalance(),
    unconfirmedBalance: msg.getUnconfirmedBalance()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.WalletBalanceResponse}
 */
proto.lnrpc.WalletBalanceResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.WalletBalanceResponse;
  return proto.lnrpc.WalletBalanceResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.WalletBalanceResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.WalletBalanceResponse}
 */
proto.lnrpc.WalletBalanceResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotalBalance(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setConfirmedBalance(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setUnconfirmedBalance(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.WalletBalanceResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.WalletBalanceResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.WalletBalanceResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.WalletBalanceResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getTotalBalance();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = this.getConfirmedBalance();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = this.getUnconfirmedBalance();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.WalletBalanceResponse} The clone.
 */
proto.lnrpc.WalletBalanceResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.WalletBalanceResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional int64 total_balance = 1;
 * @return {number}
 */
proto.lnrpc.WalletBalanceResponse.prototype.getTotalBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.lnrpc.WalletBalanceResponse.prototype.setTotalBalance = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int64 confirmed_balance = 2;
 * @return {number}
 */
proto.lnrpc.WalletBalanceResponse.prototype.getConfirmedBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.WalletBalanceResponse.prototype.setConfirmedBalance = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int64 unconfirmed_balance = 3;
 * @return {number}
 */
proto.lnrpc.WalletBalanceResponse.prototype.getUnconfirmedBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.WalletBalanceResponse.prototype.setUnconfirmedBalance = function(value) {
  jspb.Message.setField(this, 3, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ChannelBalanceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ChannelBalanceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ChannelBalanceRequest.displayName = 'proto.lnrpc.ChannelBalanceRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ChannelBalanceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ChannelBalanceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ChannelBalanceRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ChannelBalanceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ChannelBalanceRequest}
 */
proto.lnrpc.ChannelBalanceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ChannelBalanceRequest;
  return proto.lnrpc.ChannelBalanceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ChannelBalanceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ChannelBalanceRequest}
 */
proto.lnrpc.ChannelBalanceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ChannelBalanceRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelBalanceRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ChannelBalanceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelBalanceRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ChannelBalanceRequest} The clone.
 */
proto.lnrpc.ChannelBalanceRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ChannelBalanceRequest} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ChannelBalanceResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ChannelBalanceResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ChannelBalanceResponse.displayName = 'proto.lnrpc.ChannelBalanceResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ChannelBalanceResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ChannelBalanceResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ChannelBalanceResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ChannelBalanceResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    balance: msg.getBalance(),
    pendingOpenBalance: msg.getPendingOpenBalance()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ChannelBalanceResponse}
 */
proto.lnrpc.ChannelBalanceResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ChannelBalanceResponse;
  return proto.lnrpc.ChannelBalanceResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ChannelBalanceResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ChannelBalanceResponse}
 */
proto.lnrpc.ChannelBalanceResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setBalance(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setPendingOpenBalance(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ChannelBalanceResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelBalanceResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ChannelBalanceResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelBalanceResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getBalance();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
  f = this.getPendingOpenBalance();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ChannelBalanceResponse} The clone.
 */
proto.lnrpc.ChannelBalanceResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ChannelBalanceResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional int64 balance = 1;
 * @return {number}
 */
proto.lnrpc.ChannelBalanceResponse.prototype.getBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.lnrpc.ChannelBalanceResponse.prototype.setBalance = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int64 pending_open_balance = 2;
 * @return {number}
 */
proto.lnrpc.ChannelBalanceResponse.prototype.getPendingOpenBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.ChannelBalanceResponse.prototype.setPendingOpenBalance = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.QueryRoutesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.QueryRoutesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.QueryRoutesRequest.displayName = 'proto.lnrpc.QueryRoutesRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.QueryRoutesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.QueryRoutesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.QueryRoutesRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.QueryRoutesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    pubKey: msg.getPubKey(),
    amt: msg.getAmt(),
    numRoutes: msg.getNumRoutes()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.QueryRoutesRequest}
 */
proto.lnrpc.QueryRoutesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.QueryRoutesRequest;
  return proto.lnrpc.QueryRoutesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.QueryRoutesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.QueryRoutesRequest}
 */
proto.lnrpc.QueryRoutesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPubKey(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setAmt(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setNumRoutes(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.QueryRoutesRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.QueryRoutesRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.QueryRoutesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.QueryRoutesRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getPubKey();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = this.getAmt();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = this.getNumRoutes();
  if (f !== 0) {
    writer.writeInt32(
      3,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.QueryRoutesRequest} The clone.
 */
proto.lnrpc.QueryRoutesRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.QueryRoutesRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string pub_key = 1;
 * @return {string}
 */
proto.lnrpc.QueryRoutesRequest.prototype.getPubKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.QueryRoutesRequest.prototype.setPubKey = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int64 amt = 2;
 * @return {number}
 */
proto.lnrpc.QueryRoutesRequest.prototype.getAmt = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.QueryRoutesRequest.prototype.setAmt = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int32 num_routes = 3;
 * @return {number}
 */
proto.lnrpc.QueryRoutesRequest.prototype.getNumRoutes = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.QueryRoutesRequest.prototype.setNumRoutes = function(value) {
  jspb.Message.setField(this, 3, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.QueryRoutesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.QueryRoutesResponse.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.QueryRoutesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.QueryRoutesResponse.displayName = 'proto.lnrpc.QueryRoutesResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.QueryRoutesResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.QueryRoutesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.QueryRoutesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.QueryRoutesResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.QueryRoutesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    routesList: jspb.Message.toObjectList(msg.getRoutesList(),
    proto.lnrpc.Route.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.QueryRoutesResponse}
 */
proto.lnrpc.QueryRoutesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.QueryRoutesResponse;
  return proto.lnrpc.QueryRoutesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.QueryRoutesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.QueryRoutesResponse}
 */
proto.lnrpc.QueryRoutesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.Route;
      reader.readMessage(value,proto.lnrpc.Route.deserializeBinaryFromReader);
      msg.getRoutesList().push(value);
      msg.setRoutesList(msg.getRoutesList());
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.QueryRoutesResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.QueryRoutesResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.QueryRoutesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.QueryRoutesResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getRoutesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.lnrpc.Route.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.QueryRoutesResponse} The clone.
 */
proto.lnrpc.QueryRoutesResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.QueryRoutesResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * repeated Route routes = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.Route>}
 */
proto.lnrpc.QueryRoutesResponse.prototype.getRoutesList = function() {
  return /** @type{!Array.<!proto.lnrpc.Route>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.Route, 1));
};


/** @param {Array.<!proto.lnrpc.Route>} value  */
proto.lnrpc.QueryRoutesResponse.prototype.setRoutesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


proto.lnrpc.QueryRoutesResponse.prototype.clearRoutesList = function() {
  this.setRoutesList([]);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.Hop = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.Hop, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.Hop.displayName = 'proto.lnrpc.Hop';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.Hop.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.Hop.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.Hop} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.Hop.toObject = function(includeInstance, msg) {
  var f, obj = {
    chanId: msg.getChanId(),
    chanCapacity: msg.getChanCapacity(),
    amtToForward: msg.getAmtToForward(),
    fee: msg.getFee(),
    expiry: msg.getExpiry(),
    amtToForwardMsat: msg.getAmtToForwardMsat(),
    feeMsat: msg.getFeeMsat()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.Hop}
 */
proto.lnrpc.Hop.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.Hop;
  return proto.lnrpc.Hop.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.Hop} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.Hop}
 */
proto.lnrpc.Hop.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setChanId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setChanCapacity(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setAmtToForward(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setFee(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setExpiry(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setAmtToForwardMsat(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setFeeMsat(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.Hop} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.Hop.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.Hop.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.Hop.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getChanId();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = this.getChanCapacity();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = this.getAmtToForward();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = this.getFee();
  if (f !== 0) {
    writer.writeInt64(
      4,
      f
    );
  }
  f = this.getExpiry();
  if (f !== 0) {
    writer.writeUint32(
      5,
      f
    );
  }
  f = this.getAmtToForwardMsat();
  if (f !== 0) {
    writer.writeInt64(
      6,
      f
    );
  }
  f = this.getFeeMsat();
  if (f !== 0) {
    writer.writeInt64(
      7,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.Hop} The clone.
 */
proto.lnrpc.Hop.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.Hop} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional uint64 chan_id = 1;
 * @return {number}
 */
proto.lnrpc.Hop.prototype.getChanId = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.lnrpc.Hop.prototype.setChanId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int64 chan_capacity = 2;
 * @return {number}
 */
proto.lnrpc.Hop.prototype.getChanCapacity = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.Hop.prototype.setChanCapacity = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int64 amt_to_forward = 3;
 * @return {number}
 */
proto.lnrpc.Hop.prototype.getAmtToForward = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.Hop.prototype.setAmtToForward = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional int64 fee = 4;
 * @return {number}
 */
proto.lnrpc.Hop.prototype.getFee = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.Hop.prototype.setFee = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional uint32 expiry = 5;
 * @return {number}
 */
proto.lnrpc.Hop.prototype.getExpiry = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.Hop.prototype.setExpiry = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional int64 amt_to_forward_msat = 6;
 * @return {number}
 */
proto.lnrpc.Hop.prototype.getAmtToForwardMsat = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 6, 0));
};


/** @param {number} value  */
proto.lnrpc.Hop.prototype.setAmtToForwardMsat = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional int64 fee_msat = 7;
 * @return {number}
 */
proto.lnrpc.Hop.prototype.getFeeMsat = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 7, 0));
};


/** @param {number} value  */
proto.lnrpc.Hop.prototype.setFeeMsat = function(value) {
  jspb.Message.setField(this, 7, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.Route = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.Route.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.Route, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.Route.displayName = 'proto.lnrpc.Route';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.Route.repeatedFields_ = [4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.Route.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.Route.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.Route} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.Route.toObject = function(includeInstance, msg) {
  var f, obj = {
    totalTimeLock: msg.getTotalTimeLock(),
    totalFees: msg.getTotalFees(),
    totalAmt: msg.getTotalAmt(),
    hopsList: jspb.Message.toObjectList(msg.getHopsList(),
    proto.lnrpc.Hop.toObject, includeInstance),
    totalFeesMsat: msg.getTotalFeesMsat(),
    totalAmtMsat: msg.getTotalAmtMsat()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.Route}
 */
proto.lnrpc.Route.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.Route;
  return proto.lnrpc.Route.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.Route} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.Route}
 */
proto.lnrpc.Route.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setTotalTimeLock(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotalFees(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotalAmt(value);
      break;
    case 4:
      var value = new proto.lnrpc.Hop;
      reader.readMessage(value,proto.lnrpc.Hop.deserializeBinaryFromReader);
      msg.getHopsList().push(value);
      msg.setHopsList(msg.getHopsList());
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotalFeesMsat(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotalAmtMsat(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.Route} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.Route.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.Route.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.Route.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getTotalTimeLock();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = this.getTotalFees();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = this.getTotalAmt();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = this.getHopsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto.lnrpc.Hop.serializeBinaryToWriter
    );
  }
  f = this.getTotalFeesMsat();
  if (f !== 0) {
    writer.writeInt64(
      5,
      f
    );
  }
  f = this.getTotalAmtMsat();
  if (f !== 0) {
    writer.writeInt64(
      6,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.Route} The clone.
 */
proto.lnrpc.Route.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.Route} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional uint32 total_time_lock = 1;
 * @return {number}
 */
proto.lnrpc.Route.prototype.getTotalTimeLock = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.lnrpc.Route.prototype.setTotalTimeLock = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int64 total_fees = 2;
 * @return {number}
 */
proto.lnrpc.Route.prototype.getTotalFees = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.Route.prototype.setTotalFees = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int64 total_amt = 3;
 * @return {number}
 */
proto.lnrpc.Route.prototype.getTotalAmt = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.Route.prototype.setTotalAmt = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * repeated Hop hops = 4;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.Hop>}
 */
proto.lnrpc.Route.prototype.getHopsList = function() {
  return /** @type{!Array.<!proto.lnrpc.Hop>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.Hop, 4));
};


/** @param {Array.<!proto.lnrpc.Hop>} value  */
proto.lnrpc.Route.prototype.setHopsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 4, value);
};


proto.lnrpc.Route.prototype.clearHopsList = function() {
  this.setHopsList([]);
};


/**
 * optional int64 total_fees_msat = 5;
 * @return {number}
 */
proto.lnrpc.Route.prototype.getTotalFeesMsat = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.Route.prototype.setTotalFeesMsat = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional int64 total_amt_msat = 6;
 * @return {number}
 */
proto.lnrpc.Route.prototype.getTotalAmtMsat = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 6, 0));
};


/** @param {number} value  */
proto.lnrpc.Route.prototype.setTotalAmtMsat = function(value) {
  jspb.Message.setField(this, 6, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.NodeInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.NodeInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.NodeInfoRequest.displayName = 'proto.lnrpc.NodeInfoRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.NodeInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.NodeInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.NodeInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.NodeInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    pubKey: msg.getPubKey()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.NodeInfoRequest}
 */
proto.lnrpc.NodeInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.NodeInfoRequest;
  return proto.lnrpc.NodeInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.NodeInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.NodeInfoRequest}
 */
proto.lnrpc.NodeInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPubKey(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.NodeInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NodeInfoRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.NodeInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NodeInfoRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getPubKey();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.NodeInfoRequest} The clone.
 */
proto.lnrpc.NodeInfoRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.NodeInfoRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string pub_key = 1;
 * @return {string}
 */
proto.lnrpc.NodeInfoRequest.prototype.getPubKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.NodeInfoRequest.prototype.setPubKey = function(value) {
  jspb.Message.setField(this, 1, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.NodeInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.NodeInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.NodeInfo.displayName = 'proto.lnrpc.NodeInfo';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.NodeInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.NodeInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.NodeInfo} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.NodeInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    node: (f = msg.getNode()) && proto.lnrpc.LightningNode.toObject(includeInstance, f),
    numChannels: msg.getNumChannels(),
    totalCapacity: msg.getTotalCapacity()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.NodeInfo}
 */
proto.lnrpc.NodeInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.NodeInfo;
  return proto.lnrpc.NodeInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.NodeInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.NodeInfo}
 */
proto.lnrpc.NodeInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.LightningNode;
      reader.readMessage(value,proto.lnrpc.LightningNode.deserializeBinaryFromReader);
      msg.setNode(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setNumChannels(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotalCapacity(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.NodeInfo} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NodeInfo.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.NodeInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NodeInfo.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getNode();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.lnrpc.LightningNode.serializeBinaryToWriter
    );
  }
  f = this.getNumChannels();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
  f = this.getTotalCapacity();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.NodeInfo} The clone.
 */
proto.lnrpc.NodeInfo.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.NodeInfo} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional LightningNode node = 1;
 * @return {proto.lnrpc.LightningNode}
 */
proto.lnrpc.NodeInfo.prototype.getNode = function() {
  return /** @type{proto.lnrpc.LightningNode} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.LightningNode, 1));
};


/** @param {proto.lnrpc.LightningNode|undefined} value  */
proto.lnrpc.NodeInfo.prototype.setNode = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.lnrpc.NodeInfo.prototype.clearNode = function() {
  this.setNode(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.NodeInfo.prototype.hasNode = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional uint32 num_channels = 2;
 * @return {number}
 */
proto.lnrpc.NodeInfo.prototype.getNumChannels = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.NodeInfo.prototype.setNumChannels = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int64 total_capacity = 3;
 * @return {number}
 */
proto.lnrpc.NodeInfo.prototype.getTotalCapacity = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.NodeInfo.prototype.setTotalCapacity = function(value) {
  jspb.Message.setField(this, 3, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.LightningNode = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.LightningNode.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.LightningNode, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.LightningNode.displayName = 'proto.lnrpc.LightningNode';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.LightningNode.repeatedFields_ = [4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.LightningNode.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.LightningNode.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.LightningNode} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.LightningNode.toObject = function(includeInstance, msg) {
  var f, obj = {
    lastUpdate: msg.getLastUpdate(),
    pubKey: msg.getPubKey(),
    alias: msg.getAlias(),
    addressesList: jspb.Message.toObjectList(msg.getAddressesList(),
    proto.lnrpc.NodeAddress.toObject, includeInstance),
    color: msg.getColor()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.LightningNode}
 */
proto.lnrpc.LightningNode.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.LightningNode;
  return proto.lnrpc.LightningNode.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.LightningNode} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.LightningNode}
 */
proto.lnrpc.LightningNode.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setLastUpdate(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setPubKey(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAlias(value);
      break;
    case 4:
      var value = new proto.lnrpc.NodeAddress;
      reader.readMessage(value,proto.lnrpc.NodeAddress.deserializeBinaryFromReader);
      msg.getAddressesList().push(value);
      msg.setAddressesList(msg.getAddressesList());
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setColor(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.LightningNode} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.LightningNode.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.LightningNode.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.LightningNode.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getLastUpdate();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = this.getPubKey();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = this.getAlias();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = this.getAddressesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto.lnrpc.NodeAddress.serializeBinaryToWriter
    );
  }
  f = this.getColor();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.LightningNode} The clone.
 */
proto.lnrpc.LightningNode.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.LightningNode} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional uint32 last_update = 1;
 * @return {number}
 */
proto.lnrpc.LightningNode.prototype.getLastUpdate = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.lnrpc.LightningNode.prototype.setLastUpdate = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string pub_key = 2;
 * @return {string}
 */
proto.lnrpc.LightningNode.prototype.getPubKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.LightningNode.prototype.setPubKey = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional string alias = 3;
 * @return {string}
 */
proto.lnrpc.LightningNode.prototype.getAlias = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 3, ""));
};


/** @param {string} value  */
proto.lnrpc.LightningNode.prototype.setAlias = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * repeated NodeAddress addresses = 4;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.NodeAddress>}
 */
proto.lnrpc.LightningNode.prototype.getAddressesList = function() {
  return /** @type{!Array.<!proto.lnrpc.NodeAddress>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.NodeAddress, 4));
};


/** @param {Array.<!proto.lnrpc.NodeAddress>} value  */
proto.lnrpc.LightningNode.prototype.setAddressesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 4, value);
};


proto.lnrpc.LightningNode.prototype.clearAddressesList = function() {
  this.setAddressesList([]);
};


/**
 * optional string color = 5;
 * @return {string}
 */
proto.lnrpc.LightningNode.prototype.getColor = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 5, ""));
};


/** @param {string} value  */
proto.lnrpc.LightningNode.prototype.setColor = function(value) {
  jspb.Message.setField(this, 5, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.NodeAddress = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.NodeAddress, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.NodeAddress.displayName = 'proto.lnrpc.NodeAddress';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.NodeAddress.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.NodeAddress.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.NodeAddress} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.NodeAddress.toObject = function(includeInstance, msg) {
  var f, obj = {
    network: msg.getNetwork(),
    addr: msg.getAddr()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.NodeAddress}
 */
proto.lnrpc.NodeAddress.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.NodeAddress;
  return proto.lnrpc.NodeAddress.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.NodeAddress} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.NodeAddress}
 */
proto.lnrpc.NodeAddress.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setNetwork(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddr(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.NodeAddress} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NodeAddress.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.NodeAddress.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NodeAddress.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getNetwork();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = this.getAddr();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.NodeAddress} The clone.
 */
proto.lnrpc.NodeAddress.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.NodeAddress} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string network = 1;
 * @return {string}
 */
proto.lnrpc.NodeAddress.prototype.getNetwork = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.NodeAddress.prototype.setNetwork = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string addr = 2;
 * @return {string}
 */
proto.lnrpc.NodeAddress.prototype.getAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.NodeAddress.prototype.setAddr = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.RoutingPolicy = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.RoutingPolicy, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.RoutingPolicy.displayName = 'proto.lnrpc.RoutingPolicy';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.RoutingPolicy.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.RoutingPolicy.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.RoutingPolicy} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.RoutingPolicy.toObject = function(includeInstance, msg) {
  var f, obj = {
    timeLockDelta: msg.getTimeLockDelta(),
    minHtlc: msg.getMinHtlc(),
    feeBaseMsat: msg.getFeeBaseMsat(),
    feeRateMilliMsat: msg.getFeeRateMilliMsat()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.RoutingPolicy}
 */
proto.lnrpc.RoutingPolicy.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.RoutingPolicy;
  return proto.lnrpc.RoutingPolicy.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.RoutingPolicy} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.RoutingPolicy}
 */
proto.lnrpc.RoutingPolicy.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setTimeLockDelta(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setMinHtlc(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setFeeBaseMsat(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setFeeRateMilliMsat(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.RoutingPolicy} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.RoutingPolicy.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.RoutingPolicy.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.RoutingPolicy.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getTimeLockDelta();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = this.getMinHtlc();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = this.getFeeBaseMsat();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = this.getFeeRateMilliMsat();
  if (f !== 0) {
    writer.writeInt64(
      4,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.RoutingPolicy} The clone.
 */
proto.lnrpc.RoutingPolicy.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.RoutingPolicy} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional uint32 time_lock_delta = 1;
 * @return {number}
 */
proto.lnrpc.RoutingPolicy.prototype.getTimeLockDelta = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.lnrpc.RoutingPolicy.prototype.setTimeLockDelta = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int64 min_htlc = 2;
 * @return {number}
 */
proto.lnrpc.RoutingPolicy.prototype.getMinHtlc = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.RoutingPolicy.prototype.setMinHtlc = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int64 fee_base_msat = 3;
 * @return {number}
 */
proto.lnrpc.RoutingPolicy.prototype.getFeeBaseMsat = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.RoutingPolicy.prototype.setFeeBaseMsat = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional int64 fee_rate_milli_msat = 4;
 * @return {number}
 */
proto.lnrpc.RoutingPolicy.prototype.getFeeRateMilliMsat = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.RoutingPolicy.prototype.setFeeRateMilliMsat = function(value) {
  jspb.Message.setField(this, 4, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ChannelEdge = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ChannelEdge, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ChannelEdge.displayName = 'proto.lnrpc.ChannelEdge';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ChannelEdge.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ChannelEdge.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ChannelEdge} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ChannelEdge.toObject = function(includeInstance, msg) {
  var f, obj = {
    channelId: msg.getChannelId(),
    chanPoint: msg.getChanPoint(),
    lastUpdate: msg.getLastUpdate(),
    node1Pub: msg.getNode1Pub(),
    node2Pub: msg.getNode2Pub(),
    capacity: msg.getCapacity(),
    node1Policy: (f = msg.getNode1Policy()) && proto.lnrpc.RoutingPolicy.toObject(includeInstance, f),
    node2Policy: (f = msg.getNode2Policy()) && proto.lnrpc.RoutingPolicy.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ChannelEdge}
 */
proto.lnrpc.ChannelEdge.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ChannelEdge;
  return proto.lnrpc.ChannelEdge.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ChannelEdge} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ChannelEdge}
 */
proto.lnrpc.ChannelEdge.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setChannelId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setChanPoint(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setLastUpdate(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setNode1Pub(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setNode2Pub(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCapacity(value);
      break;
    case 7:
      var value = new proto.lnrpc.RoutingPolicy;
      reader.readMessage(value,proto.lnrpc.RoutingPolicy.deserializeBinaryFromReader);
      msg.setNode1Policy(value);
      break;
    case 8:
      var value = new proto.lnrpc.RoutingPolicy;
      reader.readMessage(value,proto.lnrpc.RoutingPolicy.deserializeBinaryFromReader);
      msg.setNode2Policy(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ChannelEdge} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelEdge.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ChannelEdge.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelEdge.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getChannelId();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = this.getChanPoint();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = this.getLastUpdate();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = this.getNode1Pub();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = this.getNode2Pub();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = this.getCapacity();
  if (f !== 0) {
    writer.writeInt64(
      6,
      f
    );
  }
  f = this.getNode1Policy();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.lnrpc.RoutingPolicy.serializeBinaryToWriter
    );
  }
  f = this.getNode2Policy();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      proto.lnrpc.RoutingPolicy.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ChannelEdge} The clone.
 */
proto.lnrpc.ChannelEdge.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ChannelEdge} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional uint64 channel_id = 1;
 * @return {number}
 */
proto.lnrpc.ChannelEdge.prototype.getChannelId = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.lnrpc.ChannelEdge.prototype.setChannelId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string chan_point = 2;
 * @return {string}
 */
proto.lnrpc.ChannelEdge.prototype.getChanPoint = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.ChannelEdge.prototype.setChanPoint = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional uint32 last_update = 3;
 * @return {number}
 */
proto.lnrpc.ChannelEdge.prototype.getLastUpdate = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.ChannelEdge.prototype.setLastUpdate = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional string node1_pub = 4;
 * @return {string}
 */
proto.lnrpc.ChannelEdge.prototype.getNode1Pub = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 4, ""));
};


/** @param {string} value  */
proto.lnrpc.ChannelEdge.prototype.setNode1Pub = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional string node2_pub = 5;
 * @return {string}
 */
proto.lnrpc.ChannelEdge.prototype.getNode2Pub = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 5, ""));
};


/** @param {string} value  */
proto.lnrpc.ChannelEdge.prototype.setNode2Pub = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional int64 capacity = 6;
 * @return {number}
 */
proto.lnrpc.ChannelEdge.prototype.getCapacity = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 6, 0));
};


/** @param {number} value  */
proto.lnrpc.ChannelEdge.prototype.setCapacity = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional RoutingPolicy node1_policy = 7;
 * @return {proto.lnrpc.RoutingPolicy}
 */
proto.lnrpc.ChannelEdge.prototype.getNode1Policy = function() {
  return /** @type{proto.lnrpc.RoutingPolicy} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.RoutingPolicy, 7));
};


/** @param {proto.lnrpc.RoutingPolicy|undefined} value  */
proto.lnrpc.ChannelEdge.prototype.setNode1Policy = function(value) {
  jspb.Message.setWrapperField(this, 7, value);
};


proto.lnrpc.ChannelEdge.prototype.clearNode1Policy = function() {
  this.setNode1Policy(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.ChannelEdge.prototype.hasNode1Policy = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional RoutingPolicy node2_policy = 8;
 * @return {proto.lnrpc.RoutingPolicy}
 */
proto.lnrpc.ChannelEdge.prototype.getNode2Policy = function() {
  return /** @type{proto.lnrpc.RoutingPolicy} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.RoutingPolicy, 8));
};


/** @param {proto.lnrpc.RoutingPolicy|undefined} value  */
proto.lnrpc.ChannelEdge.prototype.setNode2Policy = function(value) {
  jspb.Message.setWrapperField(this, 8, value);
};


proto.lnrpc.ChannelEdge.prototype.clearNode2Policy = function() {
  this.setNode2Policy(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.ChannelEdge.prototype.hasNode2Policy = function() {
  return jspb.Message.getField(this, 8) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ChannelGraphRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ChannelGraphRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ChannelGraphRequest.displayName = 'proto.lnrpc.ChannelGraphRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ChannelGraphRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ChannelGraphRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ChannelGraphRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ChannelGraphRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ChannelGraphRequest}
 */
proto.lnrpc.ChannelGraphRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ChannelGraphRequest;
  return proto.lnrpc.ChannelGraphRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ChannelGraphRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ChannelGraphRequest}
 */
proto.lnrpc.ChannelGraphRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ChannelGraphRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelGraphRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ChannelGraphRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelGraphRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ChannelGraphRequest} The clone.
 */
proto.lnrpc.ChannelGraphRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ChannelGraphRequest} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ChannelGraph = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.ChannelGraph.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.ChannelGraph, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ChannelGraph.displayName = 'proto.lnrpc.ChannelGraph';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.ChannelGraph.repeatedFields_ = [1,2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ChannelGraph.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ChannelGraph.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ChannelGraph} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ChannelGraph.toObject = function(includeInstance, msg) {
  var f, obj = {
    nodesList: jspb.Message.toObjectList(msg.getNodesList(),
    proto.lnrpc.LightningNode.toObject, includeInstance),
    edgesList: jspb.Message.toObjectList(msg.getEdgesList(),
    proto.lnrpc.ChannelEdge.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ChannelGraph}
 */
proto.lnrpc.ChannelGraph.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ChannelGraph;
  return proto.lnrpc.ChannelGraph.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ChannelGraph} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ChannelGraph}
 */
proto.lnrpc.ChannelGraph.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.LightningNode;
      reader.readMessage(value,proto.lnrpc.LightningNode.deserializeBinaryFromReader);
      msg.getNodesList().push(value);
      msg.setNodesList(msg.getNodesList());
      break;
    case 2:
      var value = new proto.lnrpc.ChannelEdge;
      reader.readMessage(value,proto.lnrpc.ChannelEdge.deserializeBinaryFromReader);
      msg.getEdgesList().push(value);
      msg.setEdgesList(msg.getEdgesList());
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ChannelGraph} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelGraph.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ChannelGraph.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelGraph.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getNodesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.lnrpc.LightningNode.serializeBinaryToWriter
    );
  }
  f = this.getEdgesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.lnrpc.ChannelEdge.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ChannelGraph} The clone.
 */
proto.lnrpc.ChannelGraph.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ChannelGraph} */ (jspb.Message.cloneMessage(this));
};


/**
 * repeated LightningNode nodes = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.LightningNode>}
 */
proto.lnrpc.ChannelGraph.prototype.getNodesList = function() {
  return /** @type{!Array.<!proto.lnrpc.LightningNode>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.LightningNode, 1));
};


/** @param {Array.<!proto.lnrpc.LightningNode>} value  */
proto.lnrpc.ChannelGraph.prototype.setNodesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


proto.lnrpc.ChannelGraph.prototype.clearNodesList = function() {
  this.setNodesList([]);
};


/**
 * repeated ChannelEdge edges = 2;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.ChannelEdge>}
 */
proto.lnrpc.ChannelGraph.prototype.getEdgesList = function() {
  return /** @type{!Array.<!proto.lnrpc.ChannelEdge>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.ChannelEdge, 2));
};


/** @param {Array.<!proto.lnrpc.ChannelEdge>} value  */
proto.lnrpc.ChannelGraph.prototype.setEdgesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value);
};


proto.lnrpc.ChannelGraph.prototype.clearEdgesList = function() {
  this.setEdgesList([]);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ChanInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ChanInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ChanInfoRequest.displayName = 'proto.lnrpc.ChanInfoRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ChanInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ChanInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ChanInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ChanInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    chanId: msg.getChanId()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ChanInfoRequest}
 */
proto.lnrpc.ChanInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ChanInfoRequest;
  return proto.lnrpc.ChanInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ChanInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ChanInfoRequest}
 */
proto.lnrpc.ChanInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setChanId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ChanInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChanInfoRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ChanInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChanInfoRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getChanId();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ChanInfoRequest} The clone.
 */
proto.lnrpc.ChanInfoRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ChanInfoRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional uint64 chan_id = 1;
 * @return {number}
 */
proto.lnrpc.ChanInfoRequest.prototype.getChanId = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.lnrpc.ChanInfoRequest.prototype.setChanId = function(value) {
  jspb.Message.setField(this, 1, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.NetworkInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.NetworkInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.NetworkInfoRequest.displayName = 'proto.lnrpc.NetworkInfoRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.NetworkInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.NetworkInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.NetworkInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.NetworkInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.NetworkInfoRequest}
 */
proto.lnrpc.NetworkInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.NetworkInfoRequest;
  return proto.lnrpc.NetworkInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.NetworkInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.NetworkInfoRequest}
 */
proto.lnrpc.NetworkInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.NetworkInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NetworkInfoRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.NetworkInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NetworkInfoRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.NetworkInfoRequest} The clone.
 */
proto.lnrpc.NetworkInfoRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.NetworkInfoRequest} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.NetworkInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.NetworkInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.NetworkInfo.displayName = 'proto.lnrpc.NetworkInfo';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.NetworkInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.NetworkInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.NetworkInfo} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.NetworkInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    graphDiameter: msg.getGraphDiameter(),
    avgOutDegree: msg.getAvgOutDegree(),
    maxOutDegree: msg.getMaxOutDegree(),
    numNodes: msg.getNumNodes(),
    numChannels: msg.getNumChannels(),
    totalNetworkCapacity: msg.getTotalNetworkCapacity(),
    avgChannelSize: msg.getAvgChannelSize(),
    minChannelSize: msg.getMinChannelSize(),
    maxChannelSize: msg.getMaxChannelSize()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.NetworkInfo}
 */
proto.lnrpc.NetworkInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.NetworkInfo;
  return proto.lnrpc.NetworkInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.NetworkInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.NetworkInfo}
 */
proto.lnrpc.NetworkInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setGraphDiameter(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setAvgOutDegree(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setMaxOutDegree(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setNumNodes(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setNumChannels(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTotalNetworkCapacity(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setAvgChannelSize(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setMinChannelSize(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setMaxChannelSize(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.NetworkInfo} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NetworkInfo.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.NetworkInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NetworkInfo.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getGraphDiameter();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = this.getAvgOutDegree();
  if (f !== 0.0) {
    writer.writeDouble(
      2,
      f
    );
  }
  f = this.getMaxOutDegree();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = this.getNumNodes();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
  f = this.getNumChannels();
  if (f !== 0) {
    writer.writeUint32(
      5,
      f
    );
  }
  f = this.getTotalNetworkCapacity();
  if (f !== 0) {
    writer.writeInt64(
      6,
      f
    );
  }
  f = this.getAvgChannelSize();
  if (f !== 0.0) {
    writer.writeDouble(
      7,
      f
    );
  }
  f = this.getMinChannelSize();
  if (f !== 0) {
    writer.writeInt64(
      8,
      f
    );
  }
  f = this.getMaxChannelSize();
  if (f !== 0) {
    writer.writeInt64(
      9,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.NetworkInfo} The clone.
 */
proto.lnrpc.NetworkInfo.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.NetworkInfo} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional uint32 graph_diameter = 1;
 * @return {number}
 */
proto.lnrpc.NetworkInfo.prototype.getGraphDiameter = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.lnrpc.NetworkInfo.prototype.setGraphDiameter = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional double avg_out_degree = 2;
 * @return {number}
 */
proto.lnrpc.NetworkInfo.prototype.getAvgOutDegree = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.NetworkInfo.prototype.setAvgOutDegree = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional uint32 max_out_degree = 3;
 * @return {number}
 */
proto.lnrpc.NetworkInfo.prototype.getMaxOutDegree = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.NetworkInfo.prototype.setMaxOutDegree = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional uint32 num_nodes = 4;
 * @return {number}
 */
proto.lnrpc.NetworkInfo.prototype.getNumNodes = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.NetworkInfo.prototype.setNumNodes = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional uint32 num_channels = 5;
 * @return {number}
 */
proto.lnrpc.NetworkInfo.prototype.getNumChannels = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.NetworkInfo.prototype.setNumChannels = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional int64 total_network_capacity = 6;
 * @return {number}
 */
proto.lnrpc.NetworkInfo.prototype.getTotalNetworkCapacity = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 6, 0));
};


/** @param {number} value  */
proto.lnrpc.NetworkInfo.prototype.setTotalNetworkCapacity = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional double avg_channel_size = 7;
 * @return {number}
 */
proto.lnrpc.NetworkInfo.prototype.getAvgChannelSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 7, 0));
};


/** @param {number} value  */
proto.lnrpc.NetworkInfo.prototype.setAvgChannelSize = function(value) {
  jspb.Message.setField(this, 7, value);
};


/**
 * optional int64 min_channel_size = 8;
 * @return {number}
 */
proto.lnrpc.NetworkInfo.prototype.getMinChannelSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 8, 0));
};


/** @param {number} value  */
proto.lnrpc.NetworkInfo.prototype.setMinChannelSize = function(value) {
  jspb.Message.setField(this, 8, value);
};


/**
 * optional int64 max_channel_size = 9;
 * @return {number}
 */
proto.lnrpc.NetworkInfo.prototype.getMaxChannelSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 9, 0));
};


/** @param {number} value  */
proto.lnrpc.NetworkInfo.prototype.setMaxChannelSize = function(value) {
  jspb.Message.setField(this, 9, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.StopRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.StopRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.StopRequest.displayName = 'proto.lnrpc.StopRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.StopRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.StopRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.StopRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.StopRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.StopRequest}
 */
proto.lnrpc.StopRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.StopRequest;
  return proto.lnrpc.StopRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.StopRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.StopRequest}
 */
proto.lnrpc.StopRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.StopRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.StopRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.StopRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.StopRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.StopRequest} The clone.
 */
proto.lnrpc.StopRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.StopRequest} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.StopResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.StopResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.StopResponse.displayName = 'proto.lnrpc.StopResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.StopResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.StopResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.StopResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.StopResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.StopResponse}
 */
proto.lnrpc.StopResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.StopResponse;
  return proto.lnrpc.StopResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.StopResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.StopResponse}
 */
proto.lnrpc.StopResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.StopResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.StopResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.StopResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.StopResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.StopResponse} The clone.
 */
proto.lnrpc.StopResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.StopResponse} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.GraphTopologySubscription = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.GraphTopologySubscription, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.GraphTopologySubscription.displayName = 'proto.lnrpc.GraphTopologySubscription';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.GraphTopologySubscription.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.GraphTopologySubscription.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.GraphTopologySubscription} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.GraphTopologySubscription.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.GraphTopologySubscription}
 */
proto.lnrpc.GraphTopologySubscription.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.GraphTopologySubscription;
  return proto.lnrpc.GraphTopologySubscription.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.GraphTopologySubscription} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.GraphTopologySubscription}
 */
proto.lnrpc.GraphTopologySubscription.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.GraphTopologySubscription} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.GraphTopologySubscription.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.GraphTopologySubscription.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.GraphTopologySubscription.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.GraphTopologySubscription} The clone.
 */
proto.lnrpc.GraphTopologySubscription.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.GraphTopologySubscription} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.GraphTopologyUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.GraphTopologyUpdate.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.GraphTopologyUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.GraphTopologyUpdate.displayName = 'proto.lnrpc.GraphTopologyUpdate';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.GraphTopologyUpdate.repeatedFields_ = [1,2,3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.GraphTopologyUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.GraphTopologyUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.GraphTopologyUpdate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.GraphTopologyUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    nodeUpdatesList: jspb.Message.toObjectList(msg.getNodeUpdatesList(),
    proto.lnrpc.NodeUpdate.toObject, includeInstance),
    channelUpdatesList: jspb.Message.toObjectList(msg.getChannelUpdatesList(),
    proto.lnrpc.ChannelEdgeUpdate.toObject, includeInstance),
    closedChansList: jspb.Message.toObjectList(msg.getClosedChansList(),
    proto.lnrpc.ClosedChannelUpdate.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.GraphTopologyUpdate}
 */
proto.lnrpc.GraphTopologyUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.GraphTopologyUpdate;
  return proto.lnrpc.GraphTopologyUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.GraphTopologyUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.GraphTopologyUpdate}
 */
proto.lnrpc.GraphTopologyUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.NodeUpdate;
      reader.readMessage(value,proto.lnrpc.NodeUpdate.deserializeBinaryFromReader);
      msg.getNodeUpdatesList().push(value);
      msg.setNodeUpdatesList(msg.getNodeUpdatesList());
      break;
    case 2:
      var value = new proto.lnrpc.ChannelEdgeUpdate;
      reader.readMessage(value,proto.lnrpc.ChannelEdgeUpdate.deserializeBinaryFromReader);
      msg.getChannelUpdatesList().push(value);
      msg.setChannelUpdatesList(msg.getChannelUpdatesList());
      break;
    case 3:
      var value = new proto.lnrpc.ClosedChannelUpdate;
      reader.readMessage(value,proto.lnrpc.ClosedChannelUpdate.deserializeBinaryFromReader);
      msg.getClosedChansList().push(value);
      msg.setClosedChansList(msg.getClosedChansList());
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.GraphTopologyUpdate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.GraphTopologyUpdate.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.GraphTopologyUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.GraphTopologyUpdate.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getNodeUpdatesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.lnrpc.NodeUpdate.serializeBinaryToWriter
    );
  }
  f = this.getChannelUpdatesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.lnrpc.ChannelEdgeUpdate.serializeBinaryToWriter
    );
  }
  f = this.getClosedChansList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.lnrpc.ClosedChannelUpdate.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.GraphTopologyUpdate} The clone.
 */
proto.lnrpc.GraphTopologyUpdate.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.GraphTopologyUpdate} */ (jspb.Message.cloneMessage(this));
};


/**
 * repeated NodeUpdate node_updates = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.NodeUpdate>}
 */
proto.lnrpc.GraphTopologyUpdate.prototype.getNodeUpdatesList = function() {
  return /** @type{!Array.<!proto.lnrpc.NodeUpdate>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.NodeUpdate, 1));
};


/** @param {Array.<!proto.lnrpc.NodeUpdate>} value  */
proto.lnrpc.GraphTopologyUpdate.prototype.setNodeUpdatesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


proto.lnrpc.GraphTopologyUpdate.prototype.clearNodeUpdatesList = function() {
  this.setNodeUpdatesList([]);
};


/**
 * repeated ChannelEdgeUpdate channel_updates = 2;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.ChannelEdgeUpdate>}
 */
proto.lnrpc.GraphTopologyUpdate.prototype.getChannelUpdatesList = function() {
  return /** @type{!Array.<!proto.lnrpc.ChannelEdgeUpdate>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.ChannelEdgeUpdate, 2));
};


/** @param {Array.<!proto.lnrpc.ChannelEdgeUpdate>} value  */
proto.lnrpc.GraphTopologyUpdate.prototype.setChannelUpdatesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value);
};


proto.lnrpc.GraphTopologyUpdate.prototype.clearChannelUpdatesList = function() {
  this.setChannelUpdatesList([]);
};


/**
 * repeated ClosedChannelUpdate closed_chans = 3;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.ClosedChannelUpdate>}
 */
proto.lnrpc.GraphTopologyUpdate.prototype.getClosedChansList = function() {
  return /** @type{!Array.<!proto.lnrpc.ClosedChannelUpdate>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.ClosedChannelUpdate, 3));
};


/** @param {Array.<!proto.lnrpc.ClosedChannelUpdate>} value  */
proto.lnrpc.GraphTopologyUpdate.prototype.setClosedChansList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 3, value);
};


proto.lnrpc.GraphTopologyUpdate.prototype.clearClosedChansList = function() {
  this.setClosedChansList([]);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.NodeUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.NodeUpdate.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.NodeUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.NodeUpdate.displayName = 'proto.lnrpc.NodeUpdate';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.NodeUpdate.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.NodeUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.NodeUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.NodeUpdate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.NodeUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    addressesList: jspb.Message.getField(msg, 1),
    identityKey: msg.getIdentityKey(),
    globalFeatures: msg.getGlobalFeatures_asB64(),
    alias: msg.getAlias()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.NodeUpdate}
 */
proto.lnrpc.NodeUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.NodeUpdate;
  return proto.lnrpc.NodeUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.NodeUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.NodeUpdate}
 */
proto.lnrpc.NodeUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.getAddressesList().push(value);
      msg.setAddressesList(msg.getAddressesList());
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setIdentityKey(value);
      break;
    case 3:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setGlobalFeatures(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setAlias(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.NodeUpdate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NodeUpdate.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.NodeUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.NodeUpdate.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getAddressesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
  f = this.getIdentityKey();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = this.getGlobalFeatures_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      3,
      f
    );
  }
  f = this.getAlias();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.NodeUpdate} The clone.
 */
proto.lnrpc.NodeUpdate.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.NodeUpdate} */ (jspb.Message.cloneMessage(this));
};


/**
 * repeated string addresses = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<string>}
 */
proto.lnrpc.NodeUpdate.prototype.getAddressesList = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.getField(this, 1));
};


/** @param {Array.<string>} value  */
proto.lnrpc.NodeUpdate.prototype.setAddressesList = function(value) {
  jspb.Message.setField(this, 1, value || []);
};


proto.lnrpc.NodeUpdate.prototype.clearAddressesList = function() {
  jspb.Message.setField(this, 1, []);
};


/**
 * optional string identity_key = 2;
 * @return {string}
 */
proto.lnrpc.NodeUpdate.prototype.getIdentityKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.NodeUpdate.prototype.setIdentityKey = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional bytes global_features = 3;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.NodeUpdate.prototype.getGlobalFeatures = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 3, ""));
};


/**
 * optional bytes global_features = 3;
 * This is a type-conversion wrapper around `getGlobalFeatures()`
 * @return {string}
 */
proto.lnrpc.NodeUpdate.prototype.getGlobalFeatures_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getGlobalFeatures()));
};


/**
 * optional bytes global_features = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getGlobalFeatures()`
 * @return {!Uint8Array}
 */
proto.lnrpc.NodeUpdate.prototype.getGlobalFeatures_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getGlobalFeatures()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.NodeUpdate.prototype.setGlobalFeatures = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional string alias = 4;
 * @return {string}
 */
proto.lnrpc.NodeUpdate.prototype.getAlias = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 4, ""));
};


/** @param {string} value  */
proto.lnrpc.NodeUpdate.prototype.setAlias = function(value) {
  jspb.Message.setField(this, 4, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ChannelEdgeUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ChannelEdgeUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ChannelEdgeUpdate.displayName = 'proto.lnrpc.ChannelEdgeUpdate';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ChannelEdgeUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ChannelEdgeUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ChannelEdgeUpdate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ChannelEdgeUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    chanId: msg.getChanId(),
    chanPoint: (f = msg.getChanPoint()) && proto.lnrpc.ChannelPoint.toObject(includeInstance, f),
    capacity: msg.getCapacity(),
    routingPolicy: (f = msg.getRoutingPolicy()) && proto.lnrpc.RoutingPolicy.toObject(includeInstance, f),
    advertisingNode: msg.getAdvertisingNode(),
    connectingNode: msg.getConnectingNode()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ChannelEdgeUpdate}
 */
proto.lnrpc.ChannelEdgeUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ChannelEdgeUpdate;
  return proto.lnrpc.ChannelEdgeUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ChannelEdgeUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ChannelEdgeUpdate}
 */
proto.lnrpc.ChannelEdgeUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setChanId(value);
      break;
    case 2:
      var value = new proto.lnrpc.ChannelPoint;
      reader.readMessage(value,proto.lnrpc.ChannelPoint.deserializeBinaryFromReader);
      msg.setChanPoint(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCapacity(value);
      break;
    case 4:
      var value = new proto.lnrpc.RoutingPolicy;
      reader.readMessage(value,proto.lnrpc.RoutingPolicy.deserializeBinaryFromReader);
      msg.setRoutingPolicy(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setAdvertisingNode(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setConnectingNode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ChannelEdgeUpdate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelEdgeUpdate.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ChannelEdgeUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelEdgeUpdate.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getChanId();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = this.getChanPoint();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.lnrpc.ChannelPoint.serializeBinaryToWriter
    );
  }
  f = this.getCapacity();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = this.getRoutingPolicy();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.lnrpc.RoutingPolicy.serializeBinaryToWriter
    );
  }
  f = this.getAdvertisingNode();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = this.getConnectingNode();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ChannelEdgeUpdate} The clone.
 */
proto.lnrpc.ChannelEdgeUpdate.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ChannelEdgeUpdate} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional uint64 chan_id = 1;
 * @return {number}
 */
proto.lnrpc.ChannelEdgeUpdate.prototype.getChanId = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.lnrpc.ChannelEdgeUpdate.prototype.setChanId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional ChannelPoint chan_point = 2;
 * @return {proto.lnrpc.ChannelPoint}
 */
proto.lnrpc.ChannelEdgeUpdate.prototype.getChanPoint = function() {
  return /** @type{proto.lnrpc.ChannelPoint} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.ChannelPoint, 2));
};


/** @param {proto.lnrpc.ChannelPoint|undefined} value  */
proto.lnrpc.ChannelEdgeUpdate.prototype.setChanPoint = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.lnrpc.ChannelEdgeUpdate.prototype.clearChanPoint = function() {
  this.setChanPoint(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.ChannelEdgeUpdate.prototype.hasChanPoint = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional int64 capacity = 3;
 * @return {number}
 */
proto.lnrpc.ChannelEdgeUpdate.prototype.getCapacity = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.ChannelEdgeUpdate.prototype.setCapacity = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional RoutingPolicy routing_policy = 4;
 * @return {proto.lnrpc.RoutingPolicy}
 */
proto.lnrpc.ChannelEdgeUpdate.prototype.getRoutingPolicy = function() {
  return /** @type{proto.lnrpc.RoutingPolicy} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.RoutingPolicy, 4));
};


/** @param {proto.lnrpc.RoutingPolicy|undefined} value  */
proto.lnrpc.ChannelEdgeUpdate.prototype.setRoutingPolicy = function(value) {
  jspb.Message.setWrapperField(this, 4, value);
};


proto.lnrpc.ChannelEdgeUpdate.prototype.clearRoutingPolicy = function() {
  this.setRoutingPolicy(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.ChannelEdgeUpdate.prototype.hasRoutingPolicy = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional string advertising_node = 5;
 * @return {string}
 */
proto.lnrpc.ChannelEdgeUpdate.prototype.getAdvertisingNode = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 5, ""));
};


/** @param {string} value  */
proto.lnrpc.ChannelEdgeUpdate.prototype.setAdvertisingNode = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional string connecting_node = 6;
 * @return {string}
 */
proto.lnrpc.ChannelEdgeUpdate.prototype.getConnectingNode = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 6, ""));
};


/** @param {string} value  */
proto.lnrpc.ChannelEdgeUpdate.prototype.setConnectingNode = function(value) {
  jspb.Message.setField(this, 6, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ClosedChannelUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ClosedChannelUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ClosedChannelUpdate.displayName = 'proto.lnrpc.ClosedChannelUpdate';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ClosedChannelUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ClosedChannelUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ClosedChannelUpdate} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ClosedChannelUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    chanId: msg.getChanId(),
    capacity: msg.getCapacity(),
    closedHeight: msg.getClosedHeight(),
    chanPoint: (f = msg.getChanPoint()) && proto.lnrpc.ChannelPoint.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ClosedChannelUpdate}
 */
proto.lnrpc.ClosedChannelUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ClosedChannelUpdate;
  return proto.lnrpc.ClosedChannelUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ClosedChannelUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ClosedChannelUpdate}
 */
proto.lnrpc.ClosedChannelUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setChanId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCapacity(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setClosedHeight(value);
      break;
    case 4:
      var value = new proto.lnrpc.ChannelPoint;
      reader.readMessage(value,proto.lnrpc.ChannelPoint.deserializeBinaryFromReader);
      msg.setChanPoint(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ClosedChannelUpdate} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ClosedChannelUpdate.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ClosedChannelUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ClosedChannelUpdate.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getChanId();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = this.getCapacity();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = this.getClosedHeight();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = this.getChanPoint();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.lnrpc.ChannelPoint.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ClosedChannelUpdate} The clone.
 */
proto.lnrpc.ClosedChannelUpdate.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ClosedChannelUpdate} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional uint64 chan_id = 1;
 * @return {number}
 */
proto.lnrpc.ClosedChannelUpdate.prototype.getChanId = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.lnrpc.ClosedChannelUpdate.prototype.setChanId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int64 capacity = 2;
 * @return {number}
 */
proto.lnrpc.ClosedChannelUpdate.prototype.getCapacity = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.ClosedChannelUpdate.prototype.setCapacity = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional uint32 closed_height = 3;
 * @return {number}
 */
proto.lnrpc.ClosedChannelUpdate.prototype.getClosedHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.ClosedChannelUpdate.prototype.setClosedHeight = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional ChannelPoint chan_point = 4;
 * @return {proto.lnrpc.ChannelPoint}
 */
proto.lnrpc.ClosedChannelUpdate.prototype.getChanPoint = function() {
  return /** @type{proto.lnrpc.ChannelPoint} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.ChannelPoint, 4));
};


/** @param {proto.lnrpc.ChannelPoint|undefined} value  */
proto.lnrpc.ClosedChannelUpdate.prototype.setChanPoint = function(value) {
  jspb.Message.setWrapperField(this, 4, value);
};


proto.lnrpc.ClosedChannelUpdate.prototype.clearChanPoint = function() {
  this.setChanPoint(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.ClosedChannelUpdate.prototype.hasChanPoint = function() {
  return jspb.Message.getField(this, 4) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.HopHint = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.HopHint, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.HopHint.displayName = 'proto.lnrpc.HopHint';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.HopHint.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.HopHint.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.HopHint} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.HopHint.toObject = function(includeInstance, msg) {
  var f, obj = {
    nodeId: msg.getNodeId(),
    chanId: msg.getChanId(),
    feeBaseMsat: msg.getFeeBaseMsat(),
    feeProportionalMillionths: msg.getFeeProportionalMillionths(),
    cltvExpiryDelta: msg.getCltvExpiryDelta()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.HopHint}
 */
proto.lnrpc.HopHint.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.HopHint;
  return proto.lnrpc.HopHint.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.HopHint} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.HopHint}
 */
proto.lnrpc.HopHint.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setNodeId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setChanId(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setFeeBaseMsat(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setFeeProportionalMillionths(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setCltvExpiryDelta(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.HopHint} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.HopHint.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.HopHint.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.HopHint.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getNodeId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = this.getChanId();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = this.getFeeBaseMsat();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = this.getFeeProportionalMillionths();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
  f = this.getCltvExpiryDelta();
  if (f !== 0) {
    writer.writeUint32(
      5,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.HopHint} The clone.
 */
proto.lnrpc.HopHint.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.HopHint} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string node_id = 1;
 * @return {string}
 */
proto.lnrpc.HopHint.prototype.getNodeId = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.HopHint.prototype.setNodeId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional uint64 chan_id = 2;
 * @return {number}
 */
proto.lnrpc.HopHint.prototype.getChanId = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.HopHint.prototype.setChanId = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional uint32 fee_base_msat = 3;
 * @return {number}
 */
proto.lnrpc.HopHint.prototype.getFeeBaseMsat = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.HopHint.prototype.setFeeBaseMsat = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional uint32 fee_proportional_millionths = 4;
 * @return {number}
 */
proto.lnrpc.HopHint.prototype.getFeeProportionalMillionths = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.HopHint.prototype.setFeeProportionalMillionths = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional uint32 cltv_expiry_delta = 5;
 * @return {number}
 */
proto.lnrpc.HopHint.prototype.getCltvExpiryDelta = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.HopHint.prototype.setCltvExpiryDelta = function(value) {
  jspb.Message.setField(this, 5, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.RouteHint = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.RouteHint.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.RouteHint, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.RouteHint.displayName = 'proto.lnrpc.RouteHint';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.RouteHint.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.RouteHint.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.RouteHint.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.RouteHint} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.RouteHint.toObject = function(includeInstance, msg) {
  var f, obj = {
    hopHintsList: jspb.Message.toObjectList(msg.getHopHintsList(),
    proto.lnrpc.HopHint.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.RouteHint}
 */
proto.lnrpc.RouteHint.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.RouteHint;
  return proto.lnrpc.RouteHint.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.RouteHint} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.RouteHint}
 */
proto.lnrpc.RouteHint.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.HopHint;
      reader.readMessage(value,proto.lnrpc.HopHint.deserializeBinaryFromReader);
      msg.getHopHintsList().push(value);
      msg.setHopHintsList(msg.getHopHintsList());
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.RouteHint} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.RouteHint.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.RouteHint.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.RouteHint.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getHopHintsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.lnrpc.HopHint.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.RouteHint} The clone.
 */
proto.lnrpc.RouteHint.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.RouteHint} */ (jspb.Message.cloneMessage(this));
};


/**
 * repeated HopHint hop_hints = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.HopHint>}
 */
proto.lnrpc.RouteHint.prototype.getHopHintsList = function() {
  return /** @type{!Array.<!proto.lnrpc.HopHint>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.HopHint, 1));
};


/** @param {Array.<!proto.lnrpc.HopHint>} value  */
proto.lnrpc.RouteHint.prototype.setHopHintsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


proto.lnrpc.RouteHint.prototype.clearHopHintsList = function() {
  this.setHopHintsList([]);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.Invoice = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.Invoice.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.Invoice, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.Invoice.displayName = 'proto.lnrpc.Invoice';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.Invoice.repeatedFields_ = [14];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.Invoice.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.Invoice.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.Invoice} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.Invoice.toObject = function(includeInstance, msg) {
  var f, obj = {
    memo: msg.getMemo(),
    receipt: msg.getReceipt_asB64(),
    rPreimage: msg.getRPreimage_asB64(),
    rHash: msg.getRHash_asB64(),
    value: msg.getValue(),
    settled: msg.getSettled(),
    creationDate: msg.getCreationDate(),
    settleDate: msg.getSettleDate(),
    paymentRequest: msg.getPaymentRequest(),
    descriptionHash: msg.getDescriptionHash_asB64(),
    expiry: msg.getExpiry(),
    fallbackAddr: msg.getFallbackAddr(),
    cltvExpiry: msg.getCltvExpiry(),
    routeHintsList: jspb.Message.toObjectList(msg.getRouteHintsList(),
    proto.lnrpc.RouteHint.toObject, includeInstance),
    pb_private: msg.getPrivate()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.Invoice}
 */
proto.lnrpc.Invoice.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.Invoice;
  return proto.lnrpc.Invoice.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.Invoice} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.Invoice}
 */
proto.lnrpc.Invoice.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setMemo(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setReceipt(value);
      break;
    case 3:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setRPreimage(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setRHash(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setValue(value);
      break;
    case 6:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSettled(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCreationDate(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setSettleDate(value);
      break;
    case 9:
      var value = /** @type {string} */ (reader.readString());
      msg.setPaymentRequest(value);
      break;
    case 10:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setDescriptionHash(value);
      break;
    case 11:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setExpiry(value);
      break;
    case 12:
      var value = /** @type {string} */ (reader.readString());
      msg.setFallbackAddr(value);
      break;
    case 13:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setCltvExpiry(value);
      break;
    case 14:
      var value = new proto.lnrpc.RouteHint;
      reader.readMessage(value,proto.lnrpc.RouteHint.deserializeBinaryFromReader);
      msg.getRouteHintsList().push(value);
      msg.setRouteHintsList(msg.getRouteHintsList());
      break;
    case 15:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setPrivate(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.Invoice} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.Invoice.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.Invoice.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.Invoice.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getMemo();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = this.getReceipt_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = this.getRPreimage_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      3,
      f
    );
  }
  f = this.getRHash_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      4,
      f
    );
  }
  f = this.getValue();
  if (f !== 0) {
    writer.writeInt64(
      5,
      f
    );
  }
  f = this.getSettled();
  if (f) {
    writer.writeBool(
      6,
      f
    );
  }
  f = this.getCreationDate();
  if (f !== 0) {
    writer.writeInt64(
      7,
      f
    );
  }
  f = this.getSettleDate();
  if (f !== 0) {
    writer.writeInt64(
      8,
      f
    );
  }
  f = this.getPaymentRequest();
  if (f.length > 0) {
    writer.writeString(
      9,
      f
    );
  }
  f = this.getDescriptionHash_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      10,
      f
    );
  }
  f = this.getExpiry();
  if (f !== 0) {
    writer.writeInt64(
      11,
      f
    );
  }
  f = this.getFallbackAddr();
  if (f.length > 0) {
    writer.writeString(
      12,
      f
    );
  }
  f = this.getCltvExpiry();
  if (f !== 0) {
    writer.writeUint64(
      13,
      f
    );
  }
  f = this.getRouteHintsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      14,
      f,
      proto.lnrpc.RouteHint.serializeBinaryToWriter
    );
  }
  f = this.getPrivate();
  if (f) {
    writer.writeBool(
      15,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.Invoice} The clone.
 */
proto.lnrpc.Invoice.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.Invoice} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string memo = 1;
 * @return {string}
 */
proto.lnrpc.Invoice.prototype.getMemo = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.Invoice.prototype.setMemo = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional bytes receipt = 2;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.Invoice.prototype.getReceipt = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/**
 * optional bytes receipt = 2;
 * This is a type-conversion wrapper around `getReceipt()`
 * @return {string}
 */
proto.lnrpc.Invoice.prototype.getReceipt_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getReceipt()));
};


/**
 * optional bytes receipt = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getReceipt()`
 * @return {!Uint8Array}
 */
proto.lnrpc.Invoice.prototype.getReceipt_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getReceipt()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.Invoice.prototype.setReceipt = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional bytes r_preimage = 3;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.Invoice.prototype.getRPreimage = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 3, ""));
};


/**
 * optional bytes r_preimage = 3;
 * This is a type-conversion wrapper around `getRPreimage()`
 * @return {string}
 */
proto.lnrpc.Invoice.prototype.getRPreimage_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getRPreimage()));
};


/**
 * optional bytes r_preimage = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getRPreimage()`
 * @return {!Uint8Array}
 */
proto.lnrpc.Invoice.prototype.getRPreimage_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getRPreimage()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.Invoice.prototype.setRPreimage = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional bytes r_hash = 4;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.Invoice.prototype.getRHash = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 4, ""));
};


/**
 * optional bytes r_hash = 4;
 * This is a type-conversion wrapper around `getRHash()`
 * @return {string}
 */
proto.lnrpc.Invoice.prototype.getRHash_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getRHash()));
};


/**
 * optional bytes r_hash = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getRHash()`
 * @return {!Uint8Array}
 */
proto.lnrpc.Invoice.prototype.getRHash_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getRHash()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.Invoice.prototype.setRHash = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional int64 value = 5;
 * @return {number}
 */
proto.lnrpc.Invoice.prototype.getValue = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.Invoice.prototype.setValue = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional bool settled = 6;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.Invoice.prototype.getSettled = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 6, false));
};


/** @param {boolean} value  */
proto.lnrpc.Invoice.prototype.setSettled = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional int64 creation_date = 7;
 * @return {number}
 */
proto.lnrpc.Invoice.prototype.getCreationDate = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 7, 0));
};


/** @param {number} value  */
proto.lnrpc.Invoice.prototype.setCreationDate = function(value) {
  jspb.Message.setField(this, 7, value);
};


/**
 * optional int64 settle_date = 8;
 * @return {number}
 */
proto.lnrpc.Invoice.prototype.getSettleDate = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 8, 0));
};


/** @param {number} value  */
proto.lnrpc.Invoice.prototype.setSettleDate = function(value) {
  jspb.Message.setField(this, 8, value);
};


/**
 * optional string payment_request = 9;
 * @return {string}
 */
proto.lnrpc.Invoice.prototype.getPaymentRequest = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 9, ""));
};


/** @param {string} value  */
proto.lnrpc.Invoice.prototype.setPaymentRequest = function(value) {
  jspb.Message.setField(this, 9, value);
};


/**
 * optional bytes description_hash = 10;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.Invoice.prototype.getDescriptionHash = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 10, ""));
};


/**
 * optional bytes description_hash = 10;
 * This is a type-conversion wrapper around `getDescriptionHash()`
 * @return {string}
 */
proto.lnrpc.Invoice.prototype.getDescriptionHash_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getDescriptionHash()));
};


/**
 * optional bytes description_hash = 10;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getDescriptionHash()`
 * @return {!Uint8Array}
 */
proto.lnrpc.Invoice.prototype.getDescriptionHash_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getDescriptionHash()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.Invoice.prototype.setDescriptionHash = function(value) {
  jspb.Message.setField(this, 10, value);
};


/**
 * optional int64 expiry = 11;
 * @return {number}
 */
proto.lnrpc.Invoice.prototype.getExpiry = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 11, 0));
};


/** @param {number} value  */
proto.lnrpc.Invoice.prototype.setExpiry = function(value) {
  jspb.Message.setField(this, 11, value);
};


/**
 * optional string fallback_addr = 12;
 * @return {string}
 */
proto.lnrpc.Invoice.prototype.getFallbackAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 12, ""));
};


/** @param {string} value  */
proto.lnrpc.Invoice.prototype.setFallbackAddr = function(value) {
  jspb.Message.setField(this, 12, value);
};


/**
 * optional uint64 cltv_expiry = 13;
 * @return {number}
 */
proto.lnrpc.Invoice.prototype.getCltvExpiry = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 13, 0));
};


/** @param {number} value  */
proto.lnrpc.Invoice.prototype.setCltvExpiry = function(value) {
  jspb.Message.setField(this, 13, value);
};


/**
 * repeated RouteHint route_hints = 14;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.RouteHint>}
 */
proto.lnrpc.Invoice.prototype.getRouteHintsList = function() {
  return /** @type{!Array.<!proto.lnrpc.RouteHint>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.RouteHint, 14));
};


/** @param {Array.<!proto.lnrpc.RouteHint>} value  */
proto.lnrpc.Invoice.prototype.setRouteHintsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 14, value);
};


proto.lnrpc.Invoice.prototype.clearRouteHintsList = function() {
  this.setRouteHintsList([]);
};


/**
 * optional bool private = 15;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.Invoice.prototype.getPrivate = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 15, false));
};


/** @param {boolean} value  */
proto.lnrpc.Invoice.prototype.setPrivate = function(value) {
  jspb.Message.setField(this, 15, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.AddInvoiceResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.AddInvoiceResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.AddInvoiceResponse.displayName = 'proto.lnrpc.AddInvoiceResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.AddInvoiceResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.AddInvoiceResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.AddInvoiceResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.AddInvoiceResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    rHash: msg.getRHash_asB64(),
    paymentRequest: msg.getPaymentRequest()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.AddInvoiceResponse}
 */
proto.lnrpc.AddInvoiceResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.AddInvoiceResponse;
  return proto.lnrpc.AddInvoiceResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.AddInvoiceResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.AddInvoiceResponse}
 */
proto.lnrpc.AddInvoiceResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setRHash(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setPaymentRequest(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.AddInvoiceResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.AddInvoiceResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.AddInvoiceResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.AddInvoiceResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getRHash_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = this.getPaymentRequest();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.AddInvoiceResponse} The clone.
 */
proto.lnrpc.AddInvoiceResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.AddInvoiceResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bytes r_hash = 1;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.AddInvoiceResponse.prototype.getRHash = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/**
 * optional bytes r_hash = 1;
 * This is a type-conversion wrapper around `getRHash()`
 * @return {string}
 */
proto.lnrpc.AddInvoiceResponse.prototype.getRHash_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getRHash()));
};


/**
 * optional bytes r_hash = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getRHash()`
 * @return {!Uint8Array}
 */
proto.lnrpc.AddInvoiceResponse.prototype.getRHash_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getRHash()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.AddInvoiceResponse.prototype.setRHash = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string payment_request = 2;
 * @return {string}
 */
proto.lnrpc.AddInvoiceResponse.prototype.getPaymentRequest = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.AddInvoiceResponse.prototype.setPaymentRequest = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.PaymentHash = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.PaymentHash, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.PaymentHash.displayName = 'proto.lnrpc.PaymentHash';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.PaymentHash.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.PaymentHash.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.PaymentHash} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.PaymentHash.toObject = function(includeInstance, msg) {
  var f, obj = {
    rHashStr: msg.getRHashStr(),
    rHash: msg.getRHash_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.PaymentHash}
 */
proto.lnrpc.PaymentHash.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.PaymentHash;
  return proto.lnrpc.PaymentHash.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.PaymentHash} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.PaymentHash}
 */
proto.lnrpc.PaymentHash.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setRHashStr(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setRHash(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.PaymentHash} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PaymentHash.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.PaymentHash.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PaymentHash.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getRHashStr();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = this.getRHash_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.PaymentHash} The clone.
 */
proto.lnrpc.PaymentHash.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.PaymentHash} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string r_hash_str = 1;
 * @return {string}
 */
proto.lnrpc.PaymentHash.prototype.getRHashStr = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.PaymentHash.prototype.setRHashStr = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional bytes r_hash = 2;
 * @return {!(string|Uint8Array)}
 */
proto.lnrpc.PaymentHash.prototype.getRHash = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/**
 * optional bytes r_hash = 2;
 * This is a type-conversion wrapper around `getRHash()`
 * @return {string}
 */
proto.lnrpc.PaymentHash.prototype.getRHash_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getRHash()));
};


/**
 * optional bytes r_hash = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getRHash()`
 * @return {!Uint8Array}
 */
proto.lnrpc.PaymentHash.prototype.getRHash_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getRHash()));
};


/** @param {!(string|Uint8Array)} value  */
proto.lnrpc.PaymentHash.prototype.setRHash = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ListInvoiceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ListInvoiceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ListInvoiceRequest.displayName = 'proto.lnrpc.ListInvoiceRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ListInvoiceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ListInvoiceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ListInvoiceRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ListInvoiceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    pendingOnly: msg.getPendingOnly()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ListInvoiceRequest}
 */
proto.lnrpc.ListInvoiceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ListInvoiceRequest;
  return proto.lnrpc.ListInvoiceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ListInvoiceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ListInvoiceRequest}
 */
proto.lnrpc.ListInvoiceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setPendingOnly(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ListInvoiceRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListInvoiceRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ListInvoiceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListInvoiceRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getPendingOnly();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ListInvoiceRequest} The clone.
 */
proto.lnrpc.ListInvoiceRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ListInvoiceRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bool pending_only = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.ListInvoiceRequest.prototype.getPendingOnly = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 1, false));
};


/** @param {boolean} value  */
proto.lnrpc.ListInvoiceRequest.prototype.setPendingOnly = function(value) {
  jspb.Message.setField(this, 1, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ListInvoiceResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.ListInvoiceResponse.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.ListInvoiceResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ListInvoiceResponse.displayName = 'proto.lnrpc.ListInvoiceResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.ListInvoiceResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ListInvoiceResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ListInvoiceResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ListInvoiceResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ListInvoiceResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    invoicesList: jspb.Message.toObjectList(msg.getInvoicesList(),
    proto.lnrpc.Invoice.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ListInvoiceResponse}
 */
proto.lnrpc.ListInvoiceResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ListInvoiceResponse;
  return proto.lnrpc.ListInvoiceResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ListInvoiceResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ListInvoiceResponse}
 */
proto.lnrpc.ListInvoiceResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.Invoice;
      reader.readMessage(value,proto.lnrpc.Invoice.deserializeBinaryFromReader);
      msg.getInvoicesList().push(value);
      msg.setInvoicesList(msg.getInvoicesList());
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ListInvoiceResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListInvoiceResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ListInvoiceResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListInvoiceResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getInvoicesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.lnrpc.Invoice.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ListInvoiceResponse} The clone.
 */
proto.lnrpc.ListInvoiceResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ListInvoiceResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * repeated Invoice invoices = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.Invoice>}
 */
proto.lnrpc.ListInvoiceResponse.prototype.getInvoicesList = function() {
  return /** @type{!Array.<!proto.lnrpc.Invoice>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.Invoice, 1));
};


/** @param {Array.<!proto.lnrpc.Invoice>} value  */
proto.lnrpc.ListInvoiceResponse.prototype.setInvoicesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


proto.lnrpc.ListInvoiceResponse.prototype.clearInvoicesList = function() {
  this.setInvoicesList([]);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.InvoiceSubscription = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.InvoiceSubscription, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.InvoiceSubscription.displayName = 'proto.lnrpc.InvoiceSubscription';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.InvoiceSubscription.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.InvoiceSubscription.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.InvoiceSubscription} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.InvoiceSubscription.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.InvoiceSubscription}
 */
proto.lnrpc.InvoiceSubscription.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.InvoiceSubscription;
  return proto.lnrpc.InvoiceSubscription.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.InvoiceSubscription} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.InvoiceSubscription}
 */
proto.lnrpc.InvoiceSubscription.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.InvoiceSubscription} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.InvoiceSubscription.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.InvoiceSubscription.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.InvoiceSubscription.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.InvoiceSubscription} The clone.
 */
proto.lnrpc.InvoiceSubscription.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.InvoiceSubscription} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.Payment = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.Payment.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.Payment, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.Payment.displayName = 'proto.lnrpc.Payment';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.Payment.repeatedFields_ = [4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.Payment.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.Payment.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.Payment} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.Payment.toObject = function(includeInstance, msg) {
  var f, obj = {
    paymentHash: msg.getPaymentHash(),
    value: msg.getValue(),
    creationDate: msg.getCreationDate(),
    pathList: jspb.Message.getField(msg, 4),
    fee: msg.getFee(),
    paymentPreimage: msg.getPaymentPreimage()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.Payment}
 */
proto.lnrpc.Payment.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.Payment;
  return proto.lnrpc.Payment.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.Payment} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.Payment}
 */
proto.lnrpc.Payment.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPaymentHash(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setValue(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCreationDate(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.getPathList().push(value);
      msg.setPathList(msg.getPathList());
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setFee(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setPaymentPreimage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.Payment} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.Payment.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.Payment.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.Payment.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getPaymentHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = this.getValue();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = this.getCreationDate();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = this.getPathList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      4,
      f
    );
  }
  f = this.getFee();
  if (f !== 0) {
    writer.writeInt64(
      5,
      f
    );
  }
  f = this.getPaymentPreimage();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.Payment} The clone.
 */
proto.lnrpc.Payment.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.Payment} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string payment_hash = 1;
 * @return {string}
 */
proto.lnrpc.Payment.prototype.getPaymentHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.Payment.prototype.setPaymentHash = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int64 value = 2;
 * @return {number}
 */
proto.lnrpc.Payment.prototype.getValue = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.Payment.prototype.setValue = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int64 creation_date = 3;
 * @return {number}
 */
proto.lnrpc.Payment.prototype.getCreationDate = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.Payment.prototype.setCreationDate = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * repeated string path = 4;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<string>}
 */
proto.lnrpc.Payment.prototype.getPathList = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.getField(this, 4));
};


/** @param {Array.<string>} value  */
proto.lnrpc.Payment.prototype.setPathList = function(value) {
  jspb.Message.setField(this, 4, value || []);
};


proto.lnrpc.Payment.prototype.clearPathList = function() {
  jspb.Message.setField(this, 4, []);
};


/**
 * optional int64 fee = 5;
 * @return {number}
 */
proto.lnrpc.Payment.prototype.getFee = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.Payment.prototype.setFee = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional string payment_preimage = 6;
 * @return {string}
 */
proto.lnrpc.Payment.prototype.getPaymentPreimage = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 6, ""));
};


/** @param {string} value  */
proto.lnrpc.Payment.prototype.setPaymentPreimage = function(value) {
  jspb.Message.setField(this, 6, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ListPaymentsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ListPaymentsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ListPaymentsRequest.displayName = 'proto.lnrpc.ListPaymentsRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ListPaymentsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ListPaymentsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ListPaymentsRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ListPaymentsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ListPaymentsRequest}
 */
proto.lnrpc.ListPaymentsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ListPaymentsRequest;
  return proto.lnrpc.ListPaymentsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ListPaymentsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ListPaymentsRequest}
 */
proto.lnrpc.ListPaymentsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ListPaymentsRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListPaymentsRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ListPaymentsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListPaymentsRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ListPaymentsRequest} The clone.
 */
proto.lnrpc.ListPaymentsRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ListPaymentsRequest} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ListPaymentsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.ListPaymentsResponse.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.ListPaymentsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ListPaymentsResponse.displayName = 'proto.lnrpc.ListPaymentsResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.ListPaymentsResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ListPaymentsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ListPaymentsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ListPaymentsResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ListPaymentsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    paymentsList: jspb.Message.toObjectList(msg.getPaymentsList(),
    proto.lnrpc.Payment.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ListPaymentsResponse}
 */
proto.lnrpc.ListPaymentsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ListPaymentsResponse;
  return proto.lnrpc.ListPaymentsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ListPaymentsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ListPaymentsResponse}
 */
proto.lnrpc.ListPaymentsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.Payment;
      reader.readMessage(value,proto.lnrpc.Payment.deserializeBinaryFromReader);
      msg.getPaymentsList().push(value);
      msg.setPaymentsList(msg.getPaymentsList());
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ListPaymentsResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListPaymentsResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ListPaymentsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ListPaymentsResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getPaymentsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.lnrpc.Payment.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ListPaymentsResponse} The clone.
 */
proto.lnrpc.ListPaymentsResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ListPaymentsResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * repeated Payment payments = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.Payment>}
 */
proto.lnrpc.ListPaymentsResponse.prototype.getPaymentsList = function() {
  return /** @type{!Array.<!proto.lnrpc.Payment>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.Payment, 1));
};


/** @param {Array.<!proto.lnrpc.Payment>} value  */
proto.lnrpc.ListPaymentsResponse.prototype.setPaymentsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


proto.lnrpc.ListPaymentsResponse.prototype.clearPaymentsList = function() {
  this.setPaymentsList([]);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.DeleteAllPaymentsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.DeleteAllPaymentsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.DeleteAllPaymentsRequest.displayName = 'proto.lnrpc.DeleteAllPaymentsRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.DeleteAllPaymentsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.DeleteAllPaymentsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.DeleteAllPaymentsRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.DeleteAllPaymentsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.DeleteAllPaymentsRequest}
 */
proto.lnrpc.DeleteAllPaymentsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.DeleteAllPaymentsRequest;
  return proto.lnrpc.DeleteAllPaymentsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.DeleteAllPaymentsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.DeleteAllPaymentsRequest}
 */
proto.lnrpc.DeleteAllPaymentsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.DeleteAllPaymentsRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.DeleteAllPaymentsRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.DeleteAllPaymentsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.DeleteAllPaymentsRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.DeleteAllPaymentsRequest} The clone.
 */
proto.lnrpc.DeleteAllPaymentsRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.DeleteAllPaymentsRequest} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.DeleteAllPaymentsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.DeleteAllPaymentsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.DeleteAllPaymentsResponse.displayName = 'proto.lnrpc.DeleteAllPaymentsResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.DeleteAllPaymentsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.DeleteAllPaymentsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.DeleteAllPaymentsResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.DeleteAllPaymentsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.DeleteAllPaymentsResponse}
 */
proto.lnrpc.DeleteAllPaymentsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.DeleteAllPaymentsResponse;
  return proto.lnrpc.DeleteAllPaymentsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.DeleteAllPaymentsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.DeleteAllPaymentsResponse}
 */
proto.lnrpc.DeleteAllPaymentsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.DeleteAllPaymentsResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.DeleteAllPaymentsResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.DeleteAllPaymentsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.DeleteAllPaymentsResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.DeleteAllPaymentsResponse} The clone.
 */
proto.lnrpc.DeleteAllPaymentsResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.DeleteAllPaymentsResponse} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.DebugLevelRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.DebugLevelRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.DebugLevelRequest.displayName = 'proto.lnrpc.DebugLevelRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.DebugLevelRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.DebugLevelRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.DebugLevelRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.DebugLevelRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    show: msg.getShow(),
    levelSpec: msg.getLevelSpec()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.DebugLevelRequest}
 */
proto.lnrpc.DebugLevelRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.DebugLevelRequest;
  return proto.lnrpc.DebugLevelRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.DebugLevelRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.DebugLevelRequest}
 */
proto.lnrpc.DebugLevelRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setShow(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setLevelSpec(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.DebugLevelRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.DebugLevelRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.DebugLevelRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.DebugLevelRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getShow();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = this.getLevelSpec();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.DebugLevelRequest} The clone.
 */
proto.lnrpc.DebugLevelRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.DebugLevelRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bool show = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.DebugLevelRequest.prototype.getShow = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldProto3(this, 1, false));
};


/** @param {boolean} value  */
proto.lnrpc.DebugLevelRequest.prototype.setShow = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string level_spec = 2;
 * @return {string}
 */
proto.lnrpc.DebugLevelRequest.prototype.getLevelSpec = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.DebugLevelRequest.prototype.setLevelSpec = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.DebugLevelResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.DebugLevelResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.DebugLevelResponse.displayName = 'proto.lnrpc.DebugLevelResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.DebugLevelResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.DebugLevelResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.DebugLevelResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.DebugLevelResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    subSystems: msg.getSubSystems()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.DebugLevelResponse}
 */
proto.lnrpc.DebugLevelResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.DebugLevelResponse;
  return proto.lnrpc.DebugLevelResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.DebugLevelResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.DebugLevelResponse}
 */
proto.lnrpc.DebugLevelResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setSubSystems(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.DebugLevelResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.DebugLevelResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.DebugLevelResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.DebugLevelResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getSubSystems();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.DebugLevelResponse} The clone.
 */
proto.lnrpc.DebugLevelResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.DebugLevelResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string sub_systems = 1;
 * @return {string}
 */
proto.lnrpc.DebugLevelResponse.prototype.getSubSystems = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.DebugLevelResponse.prototype.setSubSystems = function(value) {
  jspb.Message.setField(this, 1, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.PayReqString = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.PayReqString, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.PayReqString.displayName = 'proto.lnrpc.PayReqString';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.PayReqString.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.PayReqString.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.PayReqString} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.PayReqString.toObject = function(includeInstance, msg) {
  var f, obj = {
    payReq: msg.getPayReq()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.PayReqString}
 */
proto.lnrpc.PayReqString.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.PayReqString;
  return proto.lnrpc.PayReqString.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.PayReqString} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.PayReqString}
 */
proto.lnrpc.PayReqString.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPayReq(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.PayReqString} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PayReqString.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.PayReqString.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PayReqString.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getPayReq();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.PayReqString} The clone.
 */
proto.lnrpc.PayReqString.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.PayReqString} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string pay_req = 1;
 * @return {string}
 */
proto.lnrpc.PayReqString.prototype.getPayReq = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.PayReqString.prototype.setPayReq = function(value) {
  jspb.Message.setField(this, 1, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.PayReq = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.PayReq.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.PayReq, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.PayReq.displayName = 'proto.lnrpc.PayReq';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.PayReq.repeatedFields_ = [10];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.PayReq.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.PayReq.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.PayReq} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.PayReq.toObject = function(includeInstance, msg) {
  var f, obj = {
    destination: msg.getDestination(),
    paymentHash: msg.getPaymentHash(),
    numSatoshis: msg.getNumSatoshis(),
    timestamp: msg.getTimestamp(),
    expiry: msg.getExpiry(),
    description: msg.getDescription(),
    descriptionHash: msg.getDescriptionHash(),
    fallbackAddr: msg.getFallbackAddr(),
    cltvExpiry: msg.getCltvExpiry(),
    routeHintsList: jspb.Message.toObjectList(msg.getRouteHintsList(),
    proto.lnrpc.RouteHint.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.PayReq}
 */
proto.lnrpc.PayReq.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.PayReq;
  return proto.lnrpc.PayReq.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.PayReq} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.PayReq}
 */
proto.lnrpc.PayReq.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setDestination(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setPaymentHash(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setNumSatoshis(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setTimestamp(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setExpiry(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setDescription(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setDescriptionHash(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setFallbackAddr(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setCltvExpiry(value);
      break;
    case 10:
      var value = new proto.lnrpc.RouteHint;
      reader.readMessage(value,proto.lnrpc.RouteHint.deserializeBinaryFromReader);
      msg.getRouteHintsList().push(value);
      msg.setRouteHintsList(msg.getRouteHintsList());
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.PayReq} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PayReq.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.PayReq.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PayReq.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getDestination();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = this.getPaymentHash();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = this.getNumSatoshis();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = this.getTimestamp();
  if (f !== 0) {
    writer.writeInt64(
      4,
      f
    );
  }
  f = this.getExpiry();
  if (f !== 0) {
    writer.writeInt64(
      5,
      f
    );
  }
  f = this.getDescription();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = this.getDescriptionHash();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
  f = this.getFallbackAddr();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = this.getCltvExpiry();
  if (f !== 0) {
    writer.writeInt64(
      9,
      f
    );
  }
  f = this.getRouteHintsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      10,
      f,
      proto.lnrpc.RouteHint.serializeBinaryToWriter
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.PayReq} The clone.
 */
proto.lnrpc.PayReq.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.PayReq} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string destination = 1;
 * @return {string}
 */
proto.lnrpc.PayReq.prototype.getDestination = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.PayReq.prototype.setDestination = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string payment_hash = 2;
 * @return {string}
 */
proto.lnrpc.PayReq.prototype.getPaymentHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.lnrpc.PayReq.prototype.setPaymentHash = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int64 num_satoshis = 3;
 * @return {number}
 */
proto.lnrpc.PayReq.prototype.getNumSatoshis = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.PayReq.prototype.setNumSatoshis = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional int64 timestamp = 4;
 * @return {number}
 */
proto.lnrpc.PayReq.prototype.getTimestamp = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.PayReq.prototype.setTimestamp = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional int64 expiry = 5;
 * @return {number}
 */
proto.lnrpc.PayReq.prototype.getExpiry = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.PayReq.prototype.setExpiry = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional string description = 6;
 * @return {string}
 */
proto.lnrpc.PayReq.prototype.getDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 6, ""));
};


/** @param {string} value  */
proto.lnrpc.PayReq.prototype.setDescription = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional string description_hash = 7;
 * @return {string}
 */
proto.lnrpc.PayReq.prototype.getDescriptionHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 7, ""));
};


/** @param {string} value  */
proto.lnrpc.PayReq.prototype.setDescriptionHash = function(value) {
  jspb.Message.setField(this, 7, value);
};


/**
 * optional string fallback_addr = 8;
 * @return {string}
 */
proto.lnrpc.PayReq.prototype.getFallbackAddr = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 8, ""));
};


/** @param {string} value  */
proto.lnrpc.PayReq.prototype.setFallbackAddr = function(value) {
  jspb.Message.setField(this, 8, value);
};


/**
 * optional int64 cltv_expiry = 9;
 * @return {number}
 */
proto.lnrpc.PayReq.prototype.getCltvExpiry = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 9, 0));
};


/** @param {number} value  */
proto.lnrpc.PayReq.prototype.setCltvExpiry = function(value) {
  jspb.Message.setField(this, 9, value);
};


/**
 * repeated RouteHint route_hints = 10;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.RouteHint>}
 */
proto.lnrpc.PayReq.prototype.getRouteHintsList = function() {
  return /** @type{!Array.<!proto.lnrpc.RouteHint>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.RouteHint, 10));
};


/** @param {Array.<!proto.lnrpc.RouteHint>} value  */
proto.lnrpc.PayReq.prototype.setRouteHintsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 10, value);
};


proto.lnrpc.PayReq.prototype.clearRouteHintsList = function() {
  this.setRouteHintsList([]);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.FeeReportRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.FeeReportRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.FeeReportRequest.displayName = 'proto.lnrpc.FeeReportRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.FeeReportRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.FeeReportRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.FeeReportRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.FeeReportRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.FeeReportRequest}
 */
proto.lnrpc.FeeReportRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.FeeReportRequest;
  return proto.lnrpc.FeeReportRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.FeeReportRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.FeeReportRequest}
 */
proto.lnrpc.FeeReportRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.FeeReportRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.FeeReportRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.FeeReportRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.FeeReportRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.FeeReportRequest} The clone.
 */
proto.lnrpc.FeeReportRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.FeeReportRequest} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ChannelFeeReport = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ChannelFeeReport, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ChannelFeeReport.displayName = 'proto.lnrpc.ChannelFeeReport';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ChannelFeeReport.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ChannelFeeReport.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ChannelFeeReport} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ChannelFeeReport.toObject = function(includeInstance, msg) {
  var f, obj = {
    chanPoint: msg.getChanPoint(),
    baseFeeMsat: msg.getBaseFeeMsat(),
    feePerMil: msg.getFeePerMil(),
    feeRate: msg.getFeeRate()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ChannelFeeReport}
 */
proto.lnrpc.ChannelFeeReport.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ChannelFeeReport;
  return proto.lnrpc.ChannelFeeReport.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ChannelFeeReport} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ChannelFeeReport}
 */
proto.lnrpc.ChannelFeeReport.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setChanPoint(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setBaseFeeMsat(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setFeePerMil(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setFeeRate(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ChannelFeeReport} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelFeeReport.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ChannelFeeReport.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ChannelFeeReport.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getChanPoint();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = this.getBaseFeeMsat();
  if (f !== 0) {
    writer.writeInt64(
      2,
      f
    );
  }
  f = this.getFeePerMil();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = this.getFeeRate();
  if (f !== 0.0) {
    writer.writeDouble(
      4,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ChannelFeeReport} The clone.
 */
proto.lnrpc.ChannelFeeReport.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ChannelFeeReport} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string chan_point = 1;
 * @return {string}
 */
proto.lnrpc.ChannelFeeReport.prototype.getChanPoint = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.lnrpc.ChannelFeeReport.prototype.setChanPoint = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional int64 base_fee_msat = 2;
 * @return {number}
 */
proto.lnrpc.ChannelFeeReport.prototype.getBaseFeeMsat = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.ChannelFeeReport.prototype.setBaseFeeMsat = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional int64 fee_per_mil = 3;
 * @return {number}
 */
proto.lnrpc.ChannelFeeReport.prototype.getFeePerMil = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.ChannelFeeReport.prototype.setFeePerMil = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional double fee_rate = 4;
 * @return {number}
 */
proto.lnrpc.ChannelFeeReport.prototype.getFeeRate = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.ChannelFeeReport.prototype.setFeeRate = function(value) {
  jspb.Message.setField(this, 4, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.FeeReportResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.FeeReportResponse.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.FeeReportResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.FeeReportResponse.displayName = 'proto.lnrpc.FeeReportResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.FeeReportResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.FeeReportResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.FeeReportResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.FeeReportResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.FeeReportResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    channelFeesList: jspb.Message.toObjectList(msg.getChannelFeesList(),
    proto.lnrpc.ChannelFeeReport.toObject, includeInstance),
    dayFeeSum: msg.getDayFeeSum(),
    weekFeeSum: msg.getWeekFeeSum(),
    monthFeeSum: msg.getMonthFeeSum()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.FeeReportResponse}
 */
proto.lnrpc.FeeReportResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.FeeReportResponse;
  return proto.lnrpc.FeeReportResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.FeeReportResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.FeeReportResponse}
 */
proto.lnrpc.FeeReportResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.ChannelFeeReport;
      reader.readMessage(value,proto.lnrpc.ChannelFeeReport.deserializeBinaryFromReader);
      msg.getChannelFeesList().push(value);
      msg.setChannelFeesList(msg.getChannelFeesList());
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setDayFeeSum(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setWeekFeeSum(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setMonthFeeSum(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.FeeReportResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.FeeReportResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.FeeReportResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.FeeReportResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getChannelFeesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.lnrpc.ChannelFeeReport.serializeBinaryToWriter
    );
  }
  f = this.getDayFeeSum();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = this.getWeekFeeSum();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = this.getMonthFeeSum();
  if (f !== 0) {
    writer.writeUint64(
      4,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.FeeReportResponse} The clone.
 */
proto.lnrpc.FeeReportResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.FeeReportResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * repeated ChannelFeeReport channel_fees = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.ChannelFeeReport>}
 */
proto.lnrpc.FeeReportResponse.prototype.getChannelFeesList = function() {
  return /** @type{!Array.<!proto.lnrpc.ChannelFeeReport>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.ChannelFeeReport, 1));
};


/** @param {Array.<!proto.lnrpc.ChannelFeeReport>} value  */
proto.lnrpc.FeeReportResponse.prototype.setChannelFeesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


proto.lnrpc.FeeReportResponse.prototype.clearChannelFeesList = function() {
  this.setChannelFeesList([]);
};


/**
 * optional uint64 day_fee_sum = 2;
 * @return {number}
 */
proto.lnrpc.FeeReportResponse.prototype.getDayFeeSum = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.FeeReportResponse.prototype.setDayFeeSum = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional uint64 week_fee_sum = 3;
 * @return {number}
 */
proto.lnrpc.FeeReportResponse.prototype.getWeekFeeSum = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.FeeReportResponse.prototype.setWeekFeeSum = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional uint64 month_fee_sum = 4;
 * @return {number}
 */
proto.lnrpc.FeeReportResponse.prototype.getMonthFeeSum = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.FeeReportResponse.prototype.setMonthFeeSum = function(value) {
  jspb.Message.setField(this, 4, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.PolicyUpdateRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.lnrpc.PolicyUpdateRequest.oneofGroups_);
};
goog.inherits(proto.lnrpc.PolicyUpdateRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.PolicyUpdateRequest.displayName = 'proto.lnrpc.PolicyUpdateRequest';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.lnrpc.PolicyUpdateRequest.oneofGroups_ = [[1,2]];

/**
 * @enum {number}
 */
proto.lnrpc.PolicyUpdateRequest.ScopeCase = {
  SCOPE_NOT_SET: 0,
  GLOBAL: 1,
  CHAN_POINT: 2
};

/**
 * @return {proto.lnrpc.PolicyUpdateRequest.ScopeCase}
 */
proto.lnrpc.PolicyUpdateRequest.prototype.getScopeCase = function() {
  return /** @type {proto.lnrpc.PolicyUpdateRequest.ScopeCase} */(jspb.Message.computeOneofCase(this, proto.lnrpc.PolicyUpdateRequest.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.PolicyUpdateRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.PolicyUpdateRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.PolicyUpdateRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.PolicyUpdateRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    global: jspb.Message.getField(msg, 1),
    chanPoint: (f = msg.getChanPoint()) && proto.lnrpc.ChannelPoint.toObject(includeInstance, f),
    baseFeeMsat: msg.getBaseFeeMsat(),
    feeRate: msg.getFeeRate(),
    timeLockDelta: msg.getTimeLockDelta()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.PolicyUpdateRequest}
 */
proto.lnrpc.PolicyUpdateRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.PolicyUpdateRequest;
  return proto.lnrpc.PolicyUpdateRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.PolicyUpdateRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.PolicyUpdateRequest}
 */
proto.lnrpc.PolicyUpdateRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setGlobal(value);
      break;
    case 2:
      var value = new proto.lnrpc.ChannelPoint;
      reader.readMessage(value,proto.lnrpc.ChannelPoint.deserializeBinaryFromReader);
      msg.setChanPoint(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setBaseFeeMsat(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setFeeRate(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setTimeLockDelta(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.PolicyUpdateRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PolicyUpdateRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.PolicyUpdateRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PolicyUpdateRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = jspb.Message.getField(this, 1);
  if (f != null) {
    writer.writeBool(
      1,
      f
    );
  }
  f = this.getChanPoint();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.lnrpc.ChannelPoint.serializeBinaryToWriter
    );
  }
  f = this.getBaseFeeMsat();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
  f = this.getFeeRate();
  if (f !== 0.0) {
    writer.writeDouble(
      4,
      f
    );
  }
  f = this.getTimeLockDelta();
  if (f !== 0) {
    writer.writeUint32(
      5,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.PolicyUpdateRequest} The clone.
 */
proto.lnrpc.PolicyUpdateRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.PolicyUpdateRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional bool global = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.lnrpc.PolicyUpdateRequest.prototype.getGlobal = function() {
  return /** @type {boolean} */ (!this.hasGlobal() ? false : jspb.Message.getField(this, 1));
};


/** @param {boolean?|undefined} value  */
proto.lnrpc.PolicyUpdateRequest.prototype.setGlobal = function(value) {
  jspb.Message.setOneofField(this, 1, proto.lnrpc.PolicyUpdateRequest.oneofGroups_[0], value);
};


proto.lnrpc.PolicyUpdateRequest.prototype.clearGlobal = function() {
  jspb.Message.setOneofField(this, 1, proto.lnrpc.PolicyUpdateRequest.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.PolicyUpdateRequest.prototype.hasGlobal = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional ChannelPoint chan_point = 2;
 * @return {proto.lnrpc.ChannelPoint}
 */
proto.lnrpc.PolicyUpdateRequest.prototype.getChanPoint = function() {
  return /** @type{proto.lnrpc.ChannelPoint} */ (
    jspb.Message.getWrapperField(this, proto.lnrpc.ChannelPoint, 2));
};


/** @param {proto.lnrpc.ChannelPoint|undefined} value  */
proto.lnrpc.PolicyUpdateRequest.prototype.setChanPoint = function(value) {
  jspb.Message.setOneofWrapperField(this, 2, proto.lnrpc.PolicyUpdateRequest.oneofGroups_[0], value);
};


proto.lnrpc.PolicyUpdateRequest.prototype.clearChanPoint = function() {
  this.setChanPoint(undefined);
};


/**
 * Returns whether this field is set.
 * @return{!boolean}
 */
proto.lnrpc.PolicyUpdateRequest.prototype.hasChanPoint = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional int64 base_fee_msat = 3;
 * @return {number}
 */
proto.lnrpc.PolicyUpdateRequest.prototype.getBaseFeeMsat = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.PolicyUpdateRequest.prototype.setBaseFeeMsat = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional double fee_rate = 4;
 * @return {number}
 */
proto.lnrpc.PolicyUpdateRequest.prototype.getFeeRate = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.PolicyUpdateRequest.prototype.setFeeRate = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional uint32 time_lock_delta = 5;
 * @return {number}
 */
proto.lnrpc.PolicyUpdateRequest.prototype.getTimeLockDelta = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.PolicyUpdateRequest.prototype.setTimeLockDelta = function(value) {
  jspb.Message.setField(this, 5, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.PolicyUpdateResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.PolicyUpdateResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.PolicyUpdateResponse.displayName = 'proto.lnrpc.PolicyUpdateResponse';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.PolicyUpdateResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.PolicyUpdateResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.PolicyUpdateResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.PolicyUpdateResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.PolicyUpdateResponse}
 */
proto.lnrpc.PolicyUpdateResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.PolicyUpdateResponse;
  return proto.lnrpc.PolicyUpdateResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.PolicyUpdateResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.PolicyUpdateResponse}
 */
proto.lnrpc.PolicyUpdateResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.PolicyUpdateResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PolicyUpdateResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.PolicyUpdateResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.PolicyUpdateResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.PolicyUpdateResponse} The clone.
 */
proto.lnrpc.PolicyUpdateResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.PolicyUpdateResponse} */ (jspb.Message.cloneMessage(this));
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ForwardingHistoryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ForwardingHistoryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ForwardingHistoryRequest.displayName = 'proto.lnrpc.ForwardingHistoryRequest';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ForwardingHistoryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ForwardingHistoryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ForwardingHistoryRequest} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ForwardingHistoryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    startTime: msg.getStartTime(),
    endTime: msg.getEndTime(),
    indexOffset: msg.getIndexOffset(),
    numMaxEvents: msg.getNumMaxEvents()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ForwardingHistoryRequest}
 */
proto.lnrpc.ForwardingHistoryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ForwardingHistoryRequest;
  return proto.lnrpc.ForwardingHistoryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ForwardingHistoryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ForwardingHistoryRequest}
 */
proto.lnrpc.ForwardingHistoryRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setStartTime(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEndTime(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setIndexOffset(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setNumMaxEvents(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ForwardingHistoryRequest} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ForwardingHistoryRequest.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ForwardingHistoryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ForwardingHistoryRequest.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getStartTime();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = this.getEndTime();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = this.getIndexOffset();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = this.getNumMaxEvents();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ForwardingHistoryRequest} The clone.
 */
proto.lnrpc.ForwardingHistoryRequest.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ForwardingHistoryRequest} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional uint64 start_time = 1;
 * @return {number}
 */
proto.lnrpc.ForwardingHistoryRequest.prototype.getStartTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.lnrpc.ForwardingHistoryRequest.prototype.setStartTime = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional uint64 end_time = 2;
 * @return {number}
 */
proto.lnrpc.ForwardingHistoryRequest.prototype.getEndTime = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.ForwardingHistoryRequest.prototype.setEndTime = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional uint32 index_offset = 3;
 * @return {number}
 */
proto.lnrpc.ForwardingHistoryRequest.prototype.getIndexOffset = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 3, 0));
};


/** @param {number} value  */
proto.lnrpc.ForwardingHistoryRequest.prototype.setIndexOffset = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional uint32 num_max_events = 4;
 * @return {number}
 */
proto.lnrpc.ForwardingHistoryRequest.prototype.getNumMaxEvents = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.ForwardingHistoryRequest.prototype.setNumMaxEvents = function(value) {
  jspb.Message.setField(this, 4, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ForwardingEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.lnrpc.ForwardingEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ForwardingEvent.displayName = 'proto.lnrpc.ForwardingEvent';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ForwardingEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ForwardingEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ForwardingEvent} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ForwardingEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    timestamp: msg.getTimestamp(),
    chanIdIn: msg.getChanIdIn(),
    chanIdOut: msg.getChanIdOut(),
    amtIn: msg.getAmtIn(),
    amtOut: msg.getAmtOut(),
    fee: msg.getFee()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ForwardingEvent}
 */
proto.lnrpc.ForwardingEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ForwardingEvent;
  return proto.lnrpc.ForwardingEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ForwardingEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ForwardingEvent}
 */
proto.lnrpc.ForwardingEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setTimestamp(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setChanIdIn(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setChanIdOut(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setAmtIn(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setAmtOut(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setFee(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ForwardingEvent} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ForwardingEvent.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ForwardingEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ForwardingEvent.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getTimestamp();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = this.getChanIdIn();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = this.getChanIdOut();
  if (f !== 0) {
    writer.writeUint64(
      4,
      f
    );
  }
  f = this.getAmtIn();
  if (f !== 0) {
    writer.writeUint64(
      5,
      f
    );
  }
  f = this.getAmtOut();
  if (f !== 0) {
    writer.writeUint64(
      6,
      f
    );
  }
  f = this.getFee();
  if (f !== 0) {
    writer.writeUint64(
      7,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ForwardingEvent} The clone.
 */
proto.lnrpc.ForwardingEvent.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ForwardingEvent} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional uint64 timestamp = 1;
 * @return {number}
 */
proto.lnrpc.ForwardingEvent.prototype.getTimestamp = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.lnrpc.ForwardingEvent.prototype.setTimestamp = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional uint64 chan_id_in = 2;
 * @return {number}
 */
proto.lnrpc.ForwardingEvent.prototype.getChanIdIn = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.ForwardingEvent.prototype.setChanIdIn = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional uint64 chan_id_out = 4;
 * @return {number}
 */
proto.lnrpc.ForwardingEvent.prototype.getChanIdOut = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 4, 0));
};


/** @param {number} value  */
proto.lnrpc.ForwardingEvent.prototype.setChanIdOut = function(value) {
  jspb.Message.setField(this, 4, value);
};


/**
 * optional uint64 amt_in = 5;
 * @return {number}
 */
proto.lnrpc.ForwardingEvent.prototype.getAmtIn = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 5, 0));
};


/** @param {number} value  */
proto.lnrpc.ForwardingEvent.prototype.setAmtIn = function(value) {
  jspb.Message.setField(this, 5, value);
};


/**
 * optional uint64 amt_out = 6;
 * @return {number}
 */
proto.lnrpc.ForwardingEvent.prototype.getAmtOut = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 6, 0));
};


/** @param {number} value  */
proto.lnrpc.ForwardingEvent.prototype.setAmtOut = function(value) {
  jspb.Message.setField(this, 6, value);
};


/**
 * optional uint64 fee = 7;
 * @return {number}
 */
proto.lnrpc.ForwardingEvent.prototype.getFee = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 7, 0));
};


/** @param {number} value  */
proto.lnrpc.ForwardingEvent.prototype.setFee = function(value) {
  jspb.Message.setField(this, 7, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.lnrpc.ForwardingHistoryResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.lnrpc.ForwardingHistoryResponse.repeatedFields_, null);
};
goog.inherits(proto.lnrpc.ForwardingHistoryResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.lnrpc.ForwardingHistoryResponse.displayName = 'proto.lnrpc.ForwardingHistoryResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.lnrpc.ForwardingHistoryResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.lnrpc.ForwardingHistoryResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.lnrpc.ForwardingHistoryResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.lnrpc.ForwardingHistoryResponse} msg The msg instance to transform.
 * @return {!Object}
 */
proto.lnrpc.ForwardingHistoryResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    forwardingEventsList: jspb.Message.toObjectList(msg.getForwardingEventsList(),
    proto.lnrpc.ForwardingEvent.toObject, includeInstance),
    lastOffsetIndex: msg.getLastOffsetIndex()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.lnrpc.ForwardingHistoryResponse}
 */
proto.lnrpc.ForwardingHistoryResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.lnrpc.ForwardingHistoryResponse;
  return proto.lnrpc.ForwardingHistoryResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.lnrpc.ForwardingHistoryResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.lnrpc.ForwardingHistoryResponse}
 */
proto.lnrpc.ForwardingHistoryResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.lnrpc.ForwardingEvent;
      reader.readMessage(value,proto.lnrpc.ForwardingEvent.deserializeBinaryFromReader);
      msg.getForwardingEventsList().push(value);
      msg.setForwardingEventsList(msg.getForwardingEventsList());
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setLastOffsetIndex(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Class method variant: serializes the given message to binary data
 * (in protobuf wire format), writing to the given BinaryWriter.
 * @param {!proto.lnrpc.ForwardingHistoryResponse} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ForwardingHistoryResponse.serializeBinaryToWriter = function(message, writer) {
  message.serializeBinaryToWriter(writer);
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.lnrpc.ForwardingHistoryResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  this.serializeBinaryToWriter(writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the message to binary data (in protobuf wire format),
 * writing to the given BinaryWriter.
 * @param {!jspb.BinaryWriter} writer
 */
proto.lnrpc.ForwardingHistoryResponse.prototype.serializeBinaryToWriter = function (writer) {
  var f = undefined;
  f = this.getForwardingEventsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.lnrpc.ForwardingEvent.serializeBinaryToWriter
    );
  }
  f = this.getLastOffsetIndex();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
};


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.lnrpc.ForwardingHistoryResponse} The clone.
 */
proto.lnrpc.ForwardingHistoryResponse.prototype.cloneMessage = function() {
  return /** @type {!proto.lnrpc.ForwardingHistoryResponse} */ (jspb.Message.cloneMessage(this));
};


/**
 * repeated ForwardingEvent forwarding_events = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.lnrpc.ForwardingEvent>}
 */
proto.lnrpc.ForwardingHistoryResponse.prototype.getForwardingEventsList = function() {
  return /** @type{!Array.<!proto.lnrpc.ForwardingEvent>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.lnrpc.ForwardingEvent, 1));
};


/** @param {Array.<!proto.lnrpc.ForwardingEvent>} value  */
proto.lnrpc.ForwardingHistoryResponse.prototype.setForwardingEventsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


proto.lnrpc.ForwardingHistoryResponse.prototype.clearForwardingEventsList = function() {
  this.setForwardingEventsList([]);
};


/**
 * optional uint32 last_offset_index = 2;
 * @return {number}
 */
proto.lnrpc.ForwardingHistoryResponse.prototype.getLastOffsetIndex = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 2, 0));
};


/** @param {number} value  */
proto.lnrpc.ForwardingHistoryResponse.prototype.setLastOffsetIndex = function(value) {
  jspb.Message.setField(this, 2, value);
};


goog.object.extend(exports, proto.lnrpc);
