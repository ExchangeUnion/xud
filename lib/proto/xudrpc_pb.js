/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var annotations_pb = require('./annotations_pb.js');
goog.object.extend(proto, annotations_pb);
goog.exportSymbol('proto.xudrpc.AddCurrencyResponse', null, global);
goog.exportSymbol('proto.xudrpc.AddPairRequest', null, global);
goog.exportSymbol('proto.xudrpc.AddPairResponse', null, global);
goog.exportSymbol('proto.xudrpc.Balance', null, global);
goog.exportSymbol('proto.xudrpc.BanRequest', null, global);
goog.exportSymbol('proto.xudrpc.BanResponse', null, global);
goog.exportSymbol('proto.xudrpc.Chain', null, global);
goog.exportSymbol('proto.xudrpc.Channels', null, global);
goog.exportSymbol('proto.xudrpc.ConnectRequest', null, global);
goog.exportSymbol('proto.xudrpc.ConnectResponse', null, global);
goog.exportSymbol('proto.xudrpc.CreateNodeRequest', null, global);
goog.exportSymbol('proto.xudrpc.CreateNodeResponse', null, global);
goog.exportSymbol('proto.xudrpc.Currency', null, global);
goog.exportSymbol('proto.xudrpc.Currency.SwapClient', null, global);
goog.exportSymbol('proto.xudrpc.DiscoverNodesRequest', null, global);
goog.exportSymbol('proto.xudrpc.DiscoverNodesResponse', null, global);
goog.exportSymbol('proto.xudrpc.ExecuteSwapRequest', null, global);
goog.exportSymbol('proto.xudrpc.GetBalanceRequest', null, global);
goog.exportSymbol('proto.xudrpc.GetBalanceResponse', null, global);
goog.exportSymbol('proto.xudrpc.GetInfoRequest', null, global);
goog.exportSymbol('proto.xudrpc.GetInfoResponse', null, global);
goog.exportSymbol('proto.xudrpc.GetNodeInfoRequest', null, global);
goog.exportSymbol('proto.xudrpc.GetNodeInfoResponse', null, global);
goog.exportSymbol('proto.xudrpc.ListCurrenciesRequest', null, global);
goog.exportSymbol('proto.xudrpc.ListCurrenciesResponse', null, global);
goog.exportSymbol('proto.xudrpc.ListOrdersRequest', null, global);
goog.exportSymbol('proto.xudrpc.ListOrdersRequest.Owner', null, global);
goog.exportSymbol('proto.xudrpc.ListOrdersResponse', null, global);
goog.exportSymbol('proto.xudrpc.ListPairsRequest', null, global);
goog.exportSymbol('proto.xudrpc.ListPairsResponse', null, global);
goog.exportSymbol('proto.xudrpc.ListPeersRequest', null, global);
goog.exportSymbol('proto.xudrpc.ListPeersResponse', null, global);
goog.exportSymbol('proto.xudrpc.ListTradesRequest', null, global);
goog.exportSymbol('proto.xudrpc.ListTradesResponse', null, global);
goog.exportSymbol('proto.xudrpc.LndInfo', null, global);
goog.exportSymbol('proto.xudrpc.OpenChannelRequest', null, global);
goog.exportSymbol('proto.xudrpc.OpenChannelResponse', null, global);
goog.exportSymbol('proto.xudrpc.Order', null, global);
goog.exportSymbol('proto.xudrpc.OrderRemoval', null, global);
goog.exportSymbol('proto.xudrpc.OrderSide', null, global);
goog.exportSymbol('proto.xudrpc.OrderUpdate', null, global);
goog.exportSymbol('proto.xudrpc.Orders', null, global);
goog.exportSymbol('proto.xudrpc.OrdersCount', null, global);
goog.exportSymbol('proto.xudrpc.Peer', null, global);
goog.exportSymbol('proto.xudrpc.PlaceOrderEvent', null, global);
goog.exportSymbol('proto.xudrpc.PlaceOrderRequest', null, global);
goog.exportSymbol('proto.xudrpc.PlaceOrderResponse', null, global);
goog.exportSymbol('proto.xudrpc.RaidenInfo', null, global);
goog.exportSymbol('proto.xudrpc.RemoveCurrencyRequest', null, global);
goog.exportSymbol('proto.xudrpc.RemoveCurrencyResponse', null, global);
goog.exportSymbol('proto.xudrpc.RemoveOrderRequest', null, global);
goog.exportSymbol('proto.xudrpc.RemoveOrderResponse', null, global);
goog.exportSymbol('proto.xudrpc.RemovePairRequest', null, global);
goog.exportSymbol('proto.xudrpc.RemovePairResponse', null, global);
goog.exportSymbol('proto.xudrpc.RestoreNodeRequest', null, global);
goog.exportSymbol('proto.xudrpc.RestoreNodeResponse', null, global);
goog.exportSymbol('proto.xudrpc.ShutdownRequest', null, global);
goog.exportSymbol('proto.xudrpc.ShutdownResponse', null, global);
goog.exportSymbol('proto.xudrpc.SubscribeOrdersRequest', null, global);
goog.exportSymbol('proto.xudrpc.SubscribeSwapsRequest', null, global);
goog.exportSymbol('proto.xudrpc.SwapFailure', null, global);
goog.exportSymbol('proto.xudrpc.SwapSuccess', null, global);
goog.exportSymbol('proto.xudrpc.SwapSuccess.Role', null, global);
goog.exportSymbol('proto.xudrpc.Trade', null, global);
goog.exportSymbol('proto.xudrpc.TradingLimits', null, global);
goog.exportSymbol('proto.xudrpc.TradingLimitsRequest', null, global);
goog.exportSymbol('proto.xudrpc.TradingLimitsResponse', null, global);
goog.exportSymbol('proto.xudrpc.UnbanRequest', null, global);
goog.exportSymbol('proto.xudrpc.UnbanResponse', null, global);
goog.exportSymbol('proto.xudrpc.UnlockNodeRequest', null, global);
goog.exportSymbol('proto.xudrpc.UnlockNodeResponse', null, global);

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
proto.xudrpc.AddCurrencyResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.AddCurrencyResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.AddCurrencyResponse.displayName = 'proto.xudrpc.AddCurrencyResponse';
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
proto.xudrpc.AddCurrencyResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.AddCurrencyResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.AddCurrencyResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.AddCurrencyResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.xudrpc.AddCurrencyResponse}
 */
proto.xudrpc.AddCurrencyResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.AddCurrencyResponse;
  return proto.xudrpc.AddCurrencyResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.AddCurrencyResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.AddCurrencyResponse}
 */
proto.xudrpc.AddCurrencyResponse.deserializeBinaryFromReader = function(msg, reader) {
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.AddCurrencyResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.AddCurrencyResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.AddCurrencyResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.AddCurrencyResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.xudrpc.AddPairRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.AddPairRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.AddPairRequest.displayName = 'proto.xudrpc.AddPairRequest';
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
proto.xudrpc.AddPairRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.AddPairRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.AddPairRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.AddPairRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    baseCurrency: jspb.Message.getFieldWithDefault(msg, 1, ""),
    quoteCurrency: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.xudrpc.AddPairRequest}
 */
proto.xudrpc.AddPairRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.AddPairRequest;
  return proto.xudrpc.AddPairRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.AddPairRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.AddPairRequest}
 */
proto.xudrpc.AddPairRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setBaseCurrency(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setQuoteCurrency(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.AddPairRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.AddPairRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.AddPairRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.AddPairRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBaseCurrency();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getQuoteCurrency();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string base_currency = 1;
 * @return {string}
 */
proto.xudrpc.AddPairRequest.prototype.getBaseCurrency = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.AddPairRequest.prototype.setBaseCurrency = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string quote_currency = 2;
 * @return {string}
 */
proto.xudrpc.AddPairRequest.prototype.getQuoteCurrency = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.xudrpc.AddPairRequest.prototype.setQuoteCurrency = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
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
proto.xudrpc.AddPairResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.AddPairResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.AddPairResponse.displayName = 'proto.xudrpc.AddPairResponse';
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
proto.xudrpc.AddPairResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.AddPairResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.AddPairResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.AddPairResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.xudrpc.AddPairResponse}
 */
proto.xudrpc.AddPairResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.AddPairResponse;
  return proto.xudrpc.AddPairResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.AddPairResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.AddPairResponse}
 */
proto.xudrpc.AddPairResponse.deserializeBinaryFromReader = function(msg, reader) {
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.AddPairResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.AddPairResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.AddPairResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.AddPairResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.xudrpc.Balance = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.Balance, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.Balance.displayName = 'proto.xudrpc.Balance';
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
proto.xudrpc.Balance.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.Balance.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.Balance} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Balance.toObject = function(includeInstance, msg) {
  var f, obj = {
    totalBalance: jspb.Message.getFieldWithDefault(msg, 1, 0),
    channelBalance: jspb.Message.getFieldWithDefault(msg, 2, 0),
    pendingChannelBalance: jspb.Message.getFieldWithDefault(msg, 3, 0),
    inactiveChannelBalance: jspb.Message.getFieldWithDefault(msg, 4, 0),
    walletBalance: jspb.Message.getFieldWithDefault(msg, 5, 0),
    unconfirmedWalletBalance: jspb.Message.getFieldWithDefault(msg, 6, 0)
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
 * @return {!proto.xudrpc.Balance}
 */
proto.xudrpc.Balance.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.Balance;
  return proto.xudrpc.Balance.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.Balance} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.Balance}
 */
proto.xudrpc.Balance.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setTotalBalance(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setChannelBalance(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setPendingChannelBalance(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setInactiveChannelBalance(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setWalletBalance(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setUnconfirmedWalletBalance(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.Balance.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.Balance.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.Balance} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Balance.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTotalBalance();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getChannelBalance();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getPendingChannelBalance();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = message.getInactiveChannelBalance();
  if (f !== 0) {
    writer.writeUint64(
      4,
      f
    );
  }
  f = message.getWalletBalance();
  if (f !== 0) {
    writer.writeUint64(
      5,
      f
    );
  }
  f = message.getUnconfirmedWalletBalance();
  if (f !== 0) {
    writer.writeUint64(
      6,
      f
    );
  }
};


/**
 * optional uint64 total_balance = 1;
 * @return {number}
 */
proto.xudrpc.Balance.prototype.getTotalBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.xudrpc.Balance.prototype.setTotalBalance = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional uint64 channel_balance = 2;
 * @return {number}
 */
proto.xudrpc.Balance.prototype.getChannelBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.xudrpc.Balance.prototype.setChannelBalance = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint64 pending_channel_balance = 3;
 * @return {number}
 */
proto.xudrpc.Balance.prototype.getPendingChannelBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.xudrpc.Balance.prototype.setPendingChannelBalance = function(value) {
  jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional uint64 inactive_channel_balance = 4;
 * @return {number}
 */
proto.xudrpc.Balance.prototype.getInactiveChannelBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.xudrpc.Balance.prototype.setInactiveChannelBalance = function(value) {
  jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional uint64 wallet_balance = 5;
 * @return {number}
 */
proto.xudrpc.Balance.prototype.getWalletBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/** @param {number} value */
proto.xudrpc.Balance.prototype.setWalletBalance = function(value) {
  jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional uint64 unconfirmed_wallet_balance = 6;
 * @return {number}
 */
proto.xudrpc.Balance.prototype.getUnconfirmedWalletBalance = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/** @param {number} value */
proto.xudrpc.Balance.prototype.setUnconfirmedWalletBalance = function(value) {
  jspb.Message.setProto3IntField(this, 6, value);
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
proto.xudrpc.BanRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.BanRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.BanRequest.displayName = 'proto.xudrpc.BanRequest';
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
proto.xudrpc.BanRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.BanRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.BanRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.BanRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    nodeIdentifier: jspb.Message.getFieldWithDefault(msg, 1, "")
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
 * @return {!proto.xudrpc.BanRequest}
 */
proto.xudrpc.BanRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.BanRequest;
  return proto.xudrpc.BanRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.BanRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.BanRequest}
 */
proto.xudrpc.BanRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setNodeIdentifier(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.BanRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.BanRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.BanRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.BanRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getNodeIdentifier();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string node_identifier = 1;
 * @return {string}
 */
proto.xudrpc.BanRequest.prototype.getNodeIdentifier = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.BanRequest.prototype.setNodeIdentifier = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
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
proto.xudrpc.BanResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.BanResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.BanResponse.displayName = 'proto.xudrpc.BanResponse';
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
proto.xudrpc.BanResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.BanResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.BanResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.BanResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.xudrpc.BanResponse}
 */
proto.xudrpc.BanResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.BanResponse;
  return proto.xudrpc.BanResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.BanResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.BanResponse}
 */
proto.xudrpc.BanResponse.deserializeBinaryFromReader = function(msg, reader) {
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.BanResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.BanResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.BanResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.BanResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.xudrpc.Chain = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.Chain, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.Chain.displayName = 'proto.xudrpc.Chain';
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
proto.xudrpc.Chain.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.Chain.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.Chain} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Chain.toObject = function(includeInstance, msg) {
  var f, obj = {
    chain: jspb.Message.getFieldWithDefault(msg, 1, ""),
    network: jspb.Message.getFieldWithDefault(msg, 2, "")
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
 * @return {!proto.xudrpc.Chain}
 */
proto.xudrpc.Chain.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.Chain;
  return proto.xudrpc.Chain.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.Chain} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.Chain}
 */
proto.xudrpc.Chain.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setChain(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setNetwork(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.Chain.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.Chain.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.Chain} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Chain.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChain();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getNetwork();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string chain = 1;
 * @return {string}
 */
proto.xudrpc.Chain.prototype.getChain = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.Chain.prototype.setChain = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string network = 2;
 * @return {string}
 */
proto.xudrpc.Chain.prototype.getNetwork = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.xudrpc.Chain.prototype.setNetwork = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
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
proto.xudrpc.Channels = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.Channels, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.Channels.displayName = 'proto.xudrpc.Channels';
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
proto.xudrpc.Channels.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.Channels.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.Channels} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Channels.toObject = function(includeInstance, msg) {
  var f, obj = {
    active: jspb.Message.getFieldWithDefault(msg, 1, 0),
    inactive: jspb.Message.getFieldWithDefault(msg, 2, 0),
    pending: jspb.Message.getFieldWithDefault(msg, 3, 0),
    closed: jspb.Message.getFieldWithDefault(msg, 4, 0)
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
 * @return {!proto.xudrpc.Channels}
 */
proto.xudrpc.Channels.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.Channels;
  return proto.xudrpc.Channels.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.Channels} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.Channels}
 */
proto.xudrpc.Channels.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setActive(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setInactive(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setPending(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setClosed(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.Channels.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.Channels.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.Channels} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Channels.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getActive();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getInactive();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
  f = message.getPending();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = message.getClosed();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
};


/**
 * optional uint32 active = 1;
 * @return {number}
 */
proto.xudrpc.Channels.prototype.getActive = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.xudrpc.Channels.prototype.setActive = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional uint32 inactive = 2;
 * @return {number}
 */
proto.xudrpc.Channels.prototype.getInactive = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.xudrpc.Channels.prototype.setInactive = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint32 pending = 3;
 * @return {number}
 */
proto.xudrpc.Channels.prototype.getPending = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.xudrpc.Channels.prototype.setPending = function(value) {
  jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional uint32 closed = 4;
 * @return {number}
 */
proto.xudrpc.Channels.prototype.getClosed = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.xudrpc.Channels.prototype.setClosed = function(value) {
  jspb.Message.setProto3IntField(this, 4, value);
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
proto.xudrpc.ConnectRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.ConnectRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.ConnectRequest.displayName = 'proto.xudrpc.ConnectRequest';
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
proto.xudrpc.ConnectRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.ConnectRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.ConnectRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ConnectRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    nodeUri: jspb.Message.getFieldWithDefault(msg, 1, "")
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
 * @return {!proto.xudrpc.ConnectRequest}
 */
proto.xudrpc.ConnectRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.ConnectRequest;
  return proto.xudrpc.ConnectRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.ConnectRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.ConnectRequest}
 */
proto.xudrpc.ConnectRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setNodeUri(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.ConnectRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.ConnectRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.ConnectRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ConnectRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getNodeUri();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string node_uri = 1;
 * @return {string}
 */
proto.xudrpc.ConnectRequest.prototype.getNodeUri = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.ConnectRequest.prototype.setNodeUri = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
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
proto.xudrpc.ConnectResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.ConnectResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.ConnectResponse.displayName = 'proto.xudrpc.ConnectResponse';
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
proto.xudrpc.ConnectResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.ConnectResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.ConnectResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ConnectResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.xudrpc.ConnectResponse}
 */
proto.xudrpc.ConnectResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.ConnectResponse;
  return proto.xudrpc.ConnectResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.ConnectResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.ConnectResponse}
 */
proto.xudrpc.ConnectResponse.deserializeBinaryFromReader = function(msg, reader) {
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.ConnectResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.ConnectResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.ConnectResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ConnectResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.xudrpc.CreateNodeRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.CreateNodeRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.CreateNodeRequest.displayName = 'proto.xudrpc.CreateNodeRequest';
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
proto.xudrpc.CreateNodeRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.CreateNodeRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.CreateNodeRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.CreateNodeRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    password: jspb.Message.getFieldWithDefault(msg, 1, "")
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
 * @return {!proto.xudrpc.CreateNodeRequest}
 */
proto.xudrpc.CreateNodeRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.CreateNodeRequest;
  return proto.xudrpc.CreateNodeRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.CreateNodeRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.CreateNodeRequest}
 */
proto.xudrpc.CreateNodeRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPassword(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.CreateNodeRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.CreateNodeRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.CreateNodeRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.CreateNodeRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPassword();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string password = 1;
 * @return {string}
 */
proto.xudrpc.CreateNodeRequest.prototype.getPassword = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.CreateNodeRequest.prototype.setPassword = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
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
proto.xudrpc.CreateNodeResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.xudrpc.CreateNodeResponse.repeatedFields_, null);
};
goog.inherits(proto.xudrpc.CreateNodeResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.CreateNodeResponse.displayName = 'proto.xudrpc.CreateNodeResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.xudrpc.CreateNodeResponse.repeatedFields_ = [1,2];



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
proto.xudrpc.CreateNodeResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.CreateNodeResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.CreateNodeResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.CreateNodeResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    seedMnemonicList: jspb.Message.getRepeatedField(msg, 1),
    initializedLndsList: jspb.Message.getRepeatedField(msg, 2),
    initializedRaiden: jspb.Message.getFieldWithDefault(msg, 3, false)
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
 * @return {!proto.xudrpc.CreateNodeResponse}
 */
proto.xudrpc.CreateNodeResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.CreateNodeResponse;
  return proto.xudrpc.CreateNodeResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.CreateNodeResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.CreateNodeResponse}
 */
proto.xudrpc.CreateNodeResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.addSeedMnemonic(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.addInitializedLnds(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setInitializedRaiden(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.CreateNodeResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.CreateNodeResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.CreateNodeResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.CreateNodeResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSeedMnemonicList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
  f = message.getInitializedLndsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      2,
      f
    );
  }
  f = message.getInitializedRaiden();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
};


/**
 * repeated string seed_mnemonic = 1;
 * @return {!Array<string>}
 */
proto.xudrpc.CreateNodeResponse.prototype.getSeedMnemonicList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/** @param {!Array<string>} value */
proto.xudrpc.CreateNodeResponse.prototype.setSeedMnemonicList = function(value) {
  jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.xudrpc.CreateNodeResponse.prototype.addSeedMnemonic = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


proto.xudrpc.CreateNodeResponse.prototype.clearSeedMnemonicList = function() {
  this.setSeedMnemonicList([]);
};


/**
 * repeated string initialized_lnds = 2;
 * @return {!Array<string>}
 */
proto.xudrpc.CreateNodeResponse.prototype.getInitializedLndsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
};


/** @param {!Array<string>} value */
proto.xudrpc.CreateNodeResponse.prototype.setInitializedLndsList = function(value) {
  jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.xudrpc.CreateNodeResponse.prototype.addInitializedLnds = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


proto.xudrpc.CreateNodeResponse.prototype.clearInitializedLndsList = function() {
  this.setInitializedLndsList([]);
};


/**
 * optional bool initialized_raiden = 3;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.xudrpc.CreateNodeResponse.prototype.getInitializedRaiden = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 3, false));
};


/** @param {boolean} value */
proto.xudrpc.CreateNodeResponse.prototype.setInitializedRaiden = function(value) {
  jspb.Message.setProto3BooleanField(this, 3, value);
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
proto.xudrpc.Currency = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.Currency, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.Currency.displayName = 'proto.xudrpc.Currency';
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
proto.xudrpc.Currency.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.Currency.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.Currency} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Currency.toObject = function(includeInstance, msg) {
  var f, obj = {
    currency: jspb.Message.getFieldWithDefault(msg, 1, ""),
    swapClient: jspb.Message.getFieldWithDefault(msg, 2, 0),
    tokenAddress: jspb.Message.getFieldWithDefault(msg, 3, ""),
    decimalPlaces: jspb.Message.getFieldWithDefault(msg, 4, 0)
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
 * @return {!proto.xudrpc.Currency}
 */
proto.xudrpc.Currency.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.Currency;
  return proto.xudrpc.Currency.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.Currency} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.Currency}
 */
proto.xudrpc.Currency.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setCurrency(value);
      break;
    case 2:
      var value = /** @type {!proto.xudrpc.Currency.SwapClient} */ (reader.readEnum());
      msg.setSwapClient(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setTokenAddress(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setDecimalPlaces(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.Currency.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.Currency.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.Currency} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Currency.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCurrency();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getSwapClient();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getTokenAddress();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getDecimalPlaces();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.xudrpc.Currency.SwapClient = {
  LND: 0,
  RAIDEN: 1
};

/**
 * optional string currency = 1;
 * @return {string}
 */
proto.xudrpc.Currency.prototype.getCurrency = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.Currency.prototype.setCurrency = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional SwapClient swap_client = 2;
 * @return {!proto.xudrpc.Currency.SwapClient}
 */
proto.xudrpc.Currency.prototype.getSwapClient = function() {
  return /** @type {!proto.xudrpc.Currency.SwapClient} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {!proto.xudrpc.Currency.SwapClient} value */
proto.xudrpc.Currency.prototype.setSwapClient = function(value) {
  jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional string token_address = 3;
 * @return {string}
 */
proto.xudrpc.Currency.prototype.getTokenAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.xudrpc.Currency.prototype.setTokenAddress = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional uint32 decimal_places = 4;
 * @return {number}
 */
proto.xudrpc.Currency.prototype.getDecimalPlaces = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.xudrpc.Currency.prototype.setDecimalPlaces = function(value) {
  jspb.Message.setProto3IntField(this, 4, value);
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
proto.xudrpc.DiscoverNodesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.DiscoverNodesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.DiscoverNodesRequest.displayName = 'proto.xudrpc.DiscoverNodesRequest';
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
proto.xudrpc.DiscoverNodesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.DiscoverNodesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.DiscoverNodesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.DiscoverNodesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    nodeIdentifier: jspb.Message.getFieldWithDefault(msg, 1, "")
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
 * @return {!proto.xudrpc.DiscoverNodesRequest}
 */
proto.xudrpc.DiscoverNodesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.DiscoverNodesRequest;
  return proto.xudrpc.DiscoverNodesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.DiscoverNodesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.DiscoverNodesRequest}
 */
proto.xudrpc.DiscoverNodesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setNodeIdentifier(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.DiscoverNodesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.DiscoverNodesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.DiscoverNodesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.DiscoverNodesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getNodeIdentifier();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string node_identifier = 1;
 * @return {string}
 */
proto.xudrpc.DiscoverNodesRequest.prototype.getNodeIdentifier = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.DiscoverNodesRequest.prototype.setNodeIdentifier = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
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
proto.xudrpc.DiscoverNodesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.DiscoverNodesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.DiscoverNodesResponse.displayName = 'proto.xudrpc.DiscoverNodesResponse';
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
proto.xudrpc.DiscoverNodesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.DiscoverNodesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.DiscoverNodesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.DiscoverNodesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    numNodes: jspb.Message.getFieldWithDefault(msg, 1, 0)
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
 * @return {!proto.xudrpc.DiscoverNodesResponse}
 */
proto.xudrpc.DiscoverNodesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.DiscoverNodesResponse;
  return proto.xudrpc.DiscoverNodesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.DiscoverNodesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.DiscoverNodesResponse}
 */
proto.xudrpc.DiscoverNodesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setNumNodes(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.DiscoverNodesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.DiscoverNodesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.DiscoverNodesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.DiscoverNodesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getNumNodes();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
};


/**
 * optional uint32 num_nodes = 1;
 * @return {number}
 */
proto.xudrpc.DiscoverNodesResponse.prototype.getNumNodes = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.xudrpc.DiscoverNodesResponse.prototype.setNumNodes = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
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
proto.xudrpc.ExecuteSwapRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.ExecuteSwapRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.ExecuteSwapRequest.displayName = 'proto.xudrpc.ExecuteSwapRequest';
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
proto.xudrpc.ExecuteSwapRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.ExecuteSwapRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.ExecuteSwapRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ExecuteSwapRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    orderId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    pairId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    peerPubKey: jspb.Message.getFieldWithDefault(msg, 3, ""),
    quantity: jspb.Message.getFieldWithDefault(msg, 4, 0)
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
 * @return {!proto.xudrpc.ExecuteSwapRequest}
 */
proto.xudrpc.ExecuteSwapRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.ExecuteSwapRequest;
  return proto.xudrpc.ExecuteSwapRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.ExecuteSwapRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.ExecuteSwapRequest}
 */
proto.xudrpc.ExecuteSwapRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setOrderId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setPairId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setPeerPubKey(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setQuantity(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.ExecuteSwapRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.ExecuteSwapRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.ExecuteSwapRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ExecuteSwapRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOrderId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPairId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getPeerPubKey();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getQuantity();
  if (f !== 0) {
    writer.writeUint64(
      4,
      f
    );
  }
};


/**
 * optional string order_id = 1;
 * @return {string}
 */
proto.xudrpc.ExecuteSwapRequest.prototype.getOrderId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.ExecuteSwapRequest.prototype.setOrderId = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string pair_id = 2;
 * @return {string}
 */
proto.xudrpc.ExecuteSwapRequest.prototype.getPairId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.xudrpc.ExecuteSwapRequest.prototype.setPairId = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string peer_pub_key = 3;
 * @return {string}
 */
proto.xudrpc.ExecuteSwapRequest.prototype.getPeerPubKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.xudrpc.ExecuteSwapRequest.prototype.setPeerPubKey = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional uint64 quantity = 4;
 * @return {number}
 */
proto.xudrpc.ExecuteSwapRequest.prototype.getQuantity = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.xudrpc.ExecuteSwapRequest.prototype.setQuantity = function(value) {
  jspb.Message.setProto3IntField(this, 4, value);
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
proto.xudrpc.GetBalanceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.GetBalanceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.GetBalanceRequest.displayName = 'proto.xudrpc.GetBalanceRequest';
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
proto.xudrpc.GetBalanceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.GetBalanceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.GetBalanceRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.GetBalanceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    currency: jspb.Message.getFieldWithDefault(msg, 1, "")
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
 * @return {!proto.xudrpc.GetBalanceRequest}
 */
proto.xudrpc.GetBalanceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.GetBalanceRequest;
  return proto.xudrpc.GetBalanceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.GetBalanceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.GetBalanceRequest}
 */
proto.xudrpc.GetBalanceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setCurrency(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.GetBalanceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.GetBalanceRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.GetBalanceRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.GetBalanceRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCurrency();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string currency = 1;
 * @return {string}
 */
proto.xudrpc.GetBalanceRequest.prototype.getCurrency = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.GetBalanceRequest.prototype.setCurrency = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
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
proto.xudrpc.GetBalanceResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.GetBalanceResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.GetBalanceResponse.displayName = 'proto.xudrpc.GetBalanceResponse';
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
proto.xudrpc.GetBalanceResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.GetBalanceResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.GetBalanceResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.GetBalanceResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    balancesMap: (f = msg.getBalancesMap()) ? f.toObject(includeInstance, proto.xudrpc.Balance.toObject) : []
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
 * @return {!proto.xudrpc.GetBalanceResponse}
 */
proto.xudrpc.GetBalanceResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.GetBalanceResponse;
  return proto.xudrpc.GetBalanceResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.GetBalanceResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.GetBalanceResponse}
 */
proto.xudrpc.GetBalanceResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = msg.getBalancesMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.xudrpc.Balance.deserializeBinaryFromReader, "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.GetBalanceResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.GetBalanceResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.GetBalanceResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.GetBalanceResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBalancesMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(1, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.xudrpc.Balance.serializeBinaryToWriter);
  }
};


/**
 * map<string, Balance> balances = 1;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.xudrpc.Balance>}
 */
proto.xudrpc.GetBalanceResponse.prototype.getBalancesMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.xudrpc.Balance>} */ (
      jspb.Message.getMapField(this, 1, opt_noLazyCreate,
      proto.xudrpc.Balance));
};


proto.xudrpc.GetBalanceResponse.prototype.clearBalancesMap = function() {
  this.getBalancesMap().clear();
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
proto.xudrpc.GetInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.GetInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.GetInfoRequest.displayName = 'proto.xudrpc.GetInfoRequest';
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
proto.xudrpc.GetInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.GetInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.GetInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.GetInfoRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.xudrpc.GetInfoRequest}
 */
proto.xudrpc.GetInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.GetInfoRequest;
  return proto.xudrpc.GetInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.GetInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.GetInfoRequest}
 */
proto.xudrpc.GetInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.GetInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.GetInfoRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.GetInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.GetInfoRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.xudrpc.GetInfoResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.xudrpc.GetInfoResponse.repeatedFields_, null);
};
goog.inherits(proto.xudrpc.GetInfoResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.GetInfoResponse.displayName = 'proto.xudrpc.GetInfoResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.xudrpc.GetInfoResponse.repeatedFields_ = [3,11];



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
proto.xudrpc.GetInfoResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.GetInfoResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.GetInfoResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.GetInfoResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    version: jspb.Message.getFieldWithDefault(msg, 1, ""),
    nodePubKey: jspb.Message.getFieldWithDefault(msg, 2, ""),
    urisList: jspb.Message.getRepeatedField(msg, 3),
    numPeers: jspb.Message.getFieldWithDefault(msg, 4, 0),
    numPairs: jspb.Message.getFieldWithDefault(msg, 5, 0),
    orders: (f = msg.getOrders()) && proto.xudrpc.OrdersCount.toObject(includeInstance, f),
    lndMap: (f = msg.getLndMap()) ? f.toObject(includeInstance, proto.xudrpc.LndInfo.toObject) : [],
    raiden: (f = msg.getRaiden()) && proto.xudrpc.RaidenInfo.toObject(includeInstance, f),
    alias: jspb.Message.getFieldWithDefault(msg, 9, ""),
    network: jspb.Message.getFieldWithDefault(msg, 10, ""),
    pendingSwapHashesList: jspb.Message.getRepeatedField(msg, 11)
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
 * @return {!proto.xudrpc.GetInfoResponse}
 */
proto.xudrpc.GetInfoResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.GetInfoResponse;
  return proto.xudrpc.GetInfoResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.GetInfoResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.GetInfoResponse}
 */
proto.xudrpc.GetInfoResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setVersion(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setNodePubKey(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.addUris(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setNumPeers(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setNumPairs(value);
      break;
    case 6:
      var value = new proto.xudrpc.OrdersCount;
      reader.readMessage(value,proto.xudrpc.OrdersCount.deserializeBinaryFromReader);
      msg.setOrders(value);
      break;
    case 7:
      var value = msg.getLndMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.xudrpc.LndInfo.deserializeBinaryFromReader, "");
         });
      break;
    case 8:
      var value = new proto.xudrpc.RaidenInfo;
      reader.readMessage(value,proto.xudrpc.RaidenInfo.deserializeBinaryFromReader);
      msg.setRaiden(value);
      break;
    case 9:
      var value = /** @type {string} */ (reader.readString());
      msg.setAlias(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setNetwork(value);
      break;
    case 11:
      var value = /** @type {string} */ (reader.readString());
      msg.addPendingSwapHashes(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.GetInfoResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.GetInfoResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.GetInfoResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.GetInfoResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getVersion();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getNodePubKey();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getUrisList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      3,
      f
    );
  }
  f = message.getNumPeers();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
  f = message.getNumPairs();
  if (f !== 0) {
    writer.writeUint32(
      5,
      f
    );
  }
  f = message.getOrders();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.xudrpc.OrdersCount.serializeBinaryToWriter
    );
  }
  f = message.getLndMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(7, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.xudrpc.LndInfo.serializeBinaryToWriter);
  }
  f = message.getRaiden();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      proto.xudrpc.RaidenInfo.serializeBinaryToWriter
    );
  }
  f = message.getAlias();
  if (f.length > 0) {
    writer.writeString(
      9,
      f
    );
  }
  f = message.getNetwork();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getPendingSwapHashesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      11,
      f
    );
  }
};


/**
 * optional string version = 1;
 * @return {string}
 */
proto.xudrpc.GetInfoResponse.prototype.getVersion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.GetInfoResponse.prototype.setVersion = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string node_pub_key = 2;
 * @return {string}
 */
proto.xudrpc.GetInfoResponse.prototype.getNodePubKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.xudrpc.GetInfoResponse.prototype.setNodePubKey = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * repeated string uris = 3;
 * @return {!Array<string>}
 */
proto.xudrpc.GetInfoResponse.prototype.getUrisList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
};


/** @param {!Array<string>} value */
proto.xudrpc.GetInfoResponse.prototype.setUrisList = function(value) {
  jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.xudrpc.GetInfoResponse.prototype.addUris = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


proto.xudrpc.GetInfoResponse.prototype.clearUrisList = function() {
  this.setUrisList([]);
};


/**
 * optional uint32 num_peers = 4;
 * @return {number}
 */
proto.xudrpc.GetInfoResponse.prototype.getNumPeers = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.xudrpc.GetInfoResponse.prototype.setNumPeers = function(value) {
  jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional uint32 num_pairs = 5;
 * @return {number}
 */
proto.xudrpc.GetInfoResponse.prototype.getNumPairs = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/** @param {number} value */
proto.xudrpc.GetInfoResponse.prototype.setNumPairs = function(value) {
  jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional OrdersCount orders = 6;
 * @return {?proto.xudrpc.OrdersCount}
 */
proto.xudrpc.GetInfoResponse.prototype.getOrders = function() {
  return /** @type{?proto.xudrpc.OrdersCount} */ (
    jspb.Message.getWrapperField(this, proto.xudrpc.OrdersCount, 6));
};


/** @param {?proto.xudrpc.OrdersCount|undefined} value */
proto.xudrpc.GetInfoResponse.prototype.setOrders = function(value) {
  jspb.Message.setWrapperField(this, 6, value);
};


proto.xudrpc.GetInfoResponse.prototype.clearOrders = function() {
  this.setOrders(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.xudrpc.GetInfoResponse.prototype.hasOrders = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * map<string, LndInfo> lnd = 7;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.xudrpc.LndInfo>}
 */
proto.xudrpc.GetInfoResponse.prototype.getLndMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.xudrpc.LndInfo>} */ (
      jspb.Message.getMapField(this, 7, opt_noLazyCreate,
      proto.xudrpc.LndInfo));
};


proto.xudrpc.GetInfoResponse.prototype.clearLndMap = function() {
  this.getLndMap().clear();
};


/**
 * optional RaidenInfo raiden = 8;
 * @return {?proto.xudrpc.RaidenInfo}
 */
proto.xudrpc.GetInfoResponse.prototype.getRaiden = function() {
  return /** @type{?proto.xudrpc.RaidenInfo} */ (
    jspb.Message.getWrapperField(this, proto.xudrpc.RaidenInfo, 8));
};


/** @param {?proto.xudrpc.RaidenInfo|undefined} value */
proto.xudrpc.GetInfoResponse.prototype.setRaiden = function(value) {
  jspb.Message.setWrapperField(this, 8, value);
};


proto.xudrpc.GetInfoResponse.prototype.clearRaiden = function() {
  this.setRaiden(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.xudrpc.GetInfoResponse.prototype.hasRaiden = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional string alias = 9;
 * @return {string}
 */
proto.xudrpc.GetInfoResponse.prototype.getAlias = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/** @param {string} value */
proto.xudrpc.GetInfoResponse.prototype.setAlias = function(value) {
  jspb.Message.setProto3StringField(this, 9, value);
};


/**
 * optional string network = 10;
 * @return {string}
 */
proto.xudrpc.GetInfoResponse.prototype.getNetwork = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/** @param {string} value */
proto.xudrpc.GetInfoResponse.prototype.setNetwork = function(value) {
  jspb.Message.setProto3StringField(this, 10, value);
};


/**
 * repeated string pending_swap_hashes = 11;
 * @return {!Array<string>}
 */
proto.xudrpc.GetInfoResponse.prototype.getPendingSwapHashesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 11));
};


/** @param {!Array<string>} value */
proto.xudrpc.GetInfoResponse.prototype.setPendingSwapHashesList = function(value) {
  jspb.Message.setField(this, 11, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.xudrpc.GetInfoResponse.prototype.addPendingSwapHashes = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 11, value, opt_index);
};


proto.xudrpc.GetInfoResponse.prototype.clearPendingSwapHashesList = function() {
  this.setPendingSwapHashesList([]);
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
proto.xudrpc.GetNodeInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.GetNodeInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.GetNodeInfoRequest.displayName = 'proto.xudrpc.GetNodeInfoRequest';
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
proto.xudrpc.GetNodeInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.GetNodeInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.GetNodeInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.GetNodeInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    nodeIdentifier: jspb.Message.getFieldWithDefault(msg, 1, "")
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
 * @return {!proto.xudrpc.GetNodeInfoRequest}
 */
proto.xudrpc.GetNodeInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.GetNodeInfoRequest;
  return proto.xudrpc.GetNodeInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.GetNodeInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.GetNodeInfoRequest}
 */
proto.xudrpc.GetNodeInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setNodeIdentifier(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.GetNodeInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.GetNodeInfoRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.GetNodeInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.GetNodeInfoRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getNodeIdentifier();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string node_identifier = 1;
 * @return {string}
 */
proto.xudrpc.GetNodeInfoRequest.prototype.getNodeIdentifier = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.GetNodeInfoRequest.prototype.setNodeIdentifier = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
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
proto.xudrpc.GetNodeInfoResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.GetNodeInfoResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.GetNodeInfoResponse.displayName = 'proto.xudrpc.GetNodeInfoResponse';
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
proto.xudrpc.GetNodeInfoResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.GetNodeInfoResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.GetNodeInfoResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.GetNodeInfoResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    reputationscore: jspb.Message.getFieldWithDefault(msg, 1, 0),
    banned: jspb.Message.getFieldWithDefault(msg, 2, false)
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
 * @return {!proto.xudrpc.GetNodeInfoResponse}
 */
proto.xudrpc.GetNodeInfoResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.GetNodeInfoResponse;
  return proto.xudrpc.GetNodeInfoResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.GetNodeInfoResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.GetNodeInfoResponse}
 */
proto.xudrpc.GetNodeInfoResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readSint32());
      msg.setReputationscore(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setBanned(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.GetNodeInfoResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.GetNodeInfoResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.GetNodeInfoResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.GetNodeInfoResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getReputationscore();
  if (f !== 0) {
    writer.writeSint32(
      1,
      f
    );
  }
  f = message.getBanned();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * optional sint32 reputationScore = 1;
 * @return {number}
 */
proto.xudrpc.GetNodeInfoResponse.prototype.getReputationscore = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.xudrpc.GetNodeInfoResponse.prototype.setReputationscore = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional bool banned = 2;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.xudrpc.GetNodeInfoResponse.prototype.getBanned = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 2, false));
};


/** @param {boolean} value */
proto.xudrpc.GetNodeInfoResponse.prototype.setBanned = function(value) {
  jspb.Message.setProto3BooleanField(this, 2, value);
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
proto.xudrpc.ListCurrenciesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.ListCurrenciesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.ListCurrenciesRequest.displayName = 'proto.xudrpc.ListCurrenciesRequest';
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
proto.xudrpc.ListCurrenciesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.ListCurrenciesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.ListCurrenciesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListCurrenciesRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.xudrpc.ListCurrenciesRequest}
 */
proto.xudrpc.ListCurrenciesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.ListCurrenciesRequest;
  return proto.xudrpc.ListCurrenciesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.ListCurrenciesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.ListCurrenciesRequest}
 */
proto.xudrpc.ListCurrenciesRequest.deserializeBinaryFromReader = function(msg, reader) {
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.ListCurrenciesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.ListCurrenciesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.ListCurrenciesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListCurrenciesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.xudrpc.ListCurrenciesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.xudrpc.ListCurrenciesResponse.repeatedFields_, null);
};
goog.inherits(proto.xudrpc.ListCurrenciesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.ListCurrenciesResponse.displayName = 'proto.xudrpc.ListCurrenciesResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.xudrpc.ListCurrenciesResponse.repeatedFields_ = [1];



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
proto.xudrpc.ListCurrenciesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.ListCurrenciesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.ListCurrenciesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListCurrenciesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    currenciesList: jspb.Message.toObjectList(msg.getCurrenciesList(),
    proto.xudrpc.Currency.toObject, includeInstance)
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
 * @return {!proto.xudrpc.ListCurrenciesResponse}
 */
proto.xudrpc.ListCurrenciesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.ListCurrenciesResponse;
  return proto.xudrpc.ListCurrenciesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.ListCurrenciesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.ListCurrenciesResponse}
 */
proto.xudrpc.ListCurrenciesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.xudrpc.Currency;
      reader.readMessage(value,proto.xudrpc.Currency.deserializeBinaryFromReader);
      msg.addCurrencies(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.ListCurrenciesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.ListCurrenciesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.ListCurrenciesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListCurrenciesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCurrenciesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.xudrpc.Currency.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Currency currencies = 1;
 * @return {!Array<!proto.xudrpc.Currency>}
 */
proto.xudrpc.ListCurrenciesResponse.prototype.getCurrenciesList = function() {
  return /** @type{!Array<!proto.xudrpc.Currency>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.xudrpc.Currency, 1));
};


/** @param {!Array<!proto.xudrpc.Currency>} value */
proto.xudrpc.ListCurrenciesResponse.prototype.setCurrenciesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.xudrpc.Currency=} opt_value
 * @param {number=} opt_index
 * @return {!proto.xudrpc.Currency}
 */
proto.xudrpc.ListCurrenciesResponse.prototype.addCurrencies = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.xudrpc.Currency, opt_index);
};


proto.xudrpc.ListCurrenciesResponse.prototype.clearCurrenciesList = function() {
  this.setCurrenciesList([]);
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
proto.xudrpc.ListOrdersRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.ListOrdersRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.ListOrdersRequest.displayName = 'proto.xudrpc.ListOrdersRequest';
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
proto.xudrpc.ListOrdersRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.ListOrdersRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.ListOrdersRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListOrdersRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    pairId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    owner: jspb.Message.getFieldWithDefault(msg, 2, 0),
    limit: jspb.Message.getFieldWithDefault(msg, 3, 0)
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
 * @return {!proto.xudrpc.ListOrdersRequest}
 */
proto.xudrpc.ListOrdersRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.ListOrdersRequest;
  return proto.xudrpc.ListOrdersRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.ListOrdersRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.ListOrdersRequest}
 */
proto.xudrpc.ListOrdersRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPairId(value);
      break;
    case 2:
      var value = /** @type {!proto.xudrpc.ListOrdersRequest.Owner} */ (reader.readEnum());
      msg.setOwner(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setLimit(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.ListOrdersRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.ListOrdersRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.ListOrdersRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListOrdersRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPairId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getOwner();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getLimit();
  if (f !== 0) {
    writer.writeUint32(
      3,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.xudrpc.ListOrdersRequest.Owner = {
  BOTH: 0,
  OWN: 1,
  PEER: 2
};

/**
 * optional string pair_id = 1;
 * @return {string}
 */
proto.xudrpc.ListOrdersRequest.prototype.getPairId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.ListOrdersRequest.prototype.setPairId = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional Owner owner = 2;
 * @return {!proto.xudrpc.ListOrdersRequest.Owner}
 */
proto.xudrpc.ListOrdersRequest.prototype.getOwner = function() {
  return /** @type {!proto.xudrpc.ListOrdersRequest.Owner} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {!proto.xudrpc.ListOrdersRequest.Owner} value */
proto.xudrpc.ListOrdersRequest.prototype.setOwner = function(value) {
  jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional uint32 limit = 3;
 * @return {number}
 */
proto.xudrpc.ListOrdersRequest.prototype.getLimit = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.xudrpc.ListOrdersRequest.prototype.setLimit = function(value) {
  jspb.Message.setProto3IntField(this, 3, value);
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
proto.xudrpc.ListOrdersResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.ListOrdersResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.ListOrdersResponse.displayName = 'proto.xudrpc.ListOrdersResponse';
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
proto.xudrpc.ListOrdersResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.ListOrdersResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.ListOrdersResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListOrdersResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    ordersMap: (f = msg.getOrdersMap()) ? f.toObject(includeInstance, proto.xudrpc.Orders.toObject) : []
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
 * @return {!proto.xudrpc.ListOrdersResponse}
 */
proto.xudrpc.ListOrdersResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.ListOrdersResponse;
  return proto.xudrpc.ListOrdersResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.ListOrdersResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.ListOrdersResponse}
 */
proto.xudrpc.ListOrdersResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = msg.getOrdersMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.xudrpc.Orders.deserializeBinaryFromReader, "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.ListOrdersResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.ListOrdersResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.ListOrdersResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListOrdersResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOrdersMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(1, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.xudrpc.Orders.serializeBinaryToWriter);
  }
};


/**
 * map<string, Orders> orders = 1;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.xudrpc.Orders>}
 */
proto.xudrpc.ListOrdersResponse.prototype.getOrdersMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.xudrpc.Orders>} */ (
      jspb.Message.getMapField(this, 1, opt_noLazyCreate,
      proto.xudrpc.Orders));
};


proto.xudrpc.ListOrdersResponse.prototype.clearOrdersMap = function() {
  this.getOrdersMap().clear();
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
proto.xudrpc.ListPairsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.ListPairsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.ListPairsRequest.displayName = 'proto.xudrpc.ListPairsRequest';
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
proto.xudrpc.ListPairsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.ListPairsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.ListPairsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListPairsRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.xudrpc.ListPairsRequest}
 */
proto.xudrpc.ListPairsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.ListPairsRequest;
  return proto.xudrpc.ListPairsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.ListPairsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.ListPairsRequest}
 */
proto.xudrpc.ListPairsRequest.deserializeBinaryFromReader = function(msg, reader) {
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.ListPairsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.ListPairsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.ListPairsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListPairsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.xudrpc.ListPairsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.xudrpc.ListPairsResponse.repeatedFields_, null);
};
goog.inherits(proto.xudrpc.ListPairsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.ListPairsResponse.displayName = 'proto.xudrpc.ListPairsResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.xudrpc.ListPairsResponse.repeatedFields_ = [1];



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
proto.xudrpc.ListPairsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.ListPairsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.ListPairsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListPairsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    pairsList: jspb.Message.getRepeatedField(msg, 1)
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
 * @return {!proto.xudrpc.ListPairsResponse}
 */
proto.xudrpc.ListPairsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.ListPairsResponse;
  return proto.xudrpc.ListPairsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.ListPairsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.ListPairsResponse}
 */
proto.xudrpc.ListPairsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.addPairs(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.ListPairsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.ListPairsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.ListPairsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListPairsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPairsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
};


/**
 * repeated string pairs = 1;
 * @return {!Array<string>}
 */
proto.xudrpc.ListPairsResponse.prototype.getPairsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/** @param {!Array<string>} value */
proto.xudrpc.ListPairsResponse.prototype.setPairsList = function(value) {
  jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.xudrpc.ListPairsResponse.prototype.addPairs = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


proto.xudrpc.ListPairsResponse.prototype.clearPairsList = function() {
  this.setPairsList([]);
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
proto.xudrpc.ListPeersRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.ListPeersRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.ListPeersRequest.displayName = 'proto.xudrpc.ListPeersRequest';
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
proto.xudrpc.ListPeersRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.ListPeersRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.ListPeersRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListPeersRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.xudrpc.ListPeersRequest}
 */
proto.xudrpc.ListPeersRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.ListPeersRequest;
  return proto.xudrpc.ListPeersRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.ListPeersRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.ListPeersRequest}
 */
proto.xudrpc.ListPeersRequest.deserializeBinaryFromReader = function(msg, reader) {
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.ListPeersRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.ListPeersRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.ListPeersRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListPeersRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.xudrpc.ListPeersResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.xudrpc.ListPeersResponse.repeatedFields_, null);
};
goog.inherits(proto.xudrpc.ListPeersResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.ListPeersResponse.displayName = 'proto.xudrpc.ListPeersResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.xudrpc.ListPeersResponse.repeatedFields_ = [1];



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
proto.xudrpc.ListPeersResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.ListPeersResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.ListPeersResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListPeersResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    peersList: jspb.Message.toObjectList(msg.getPeersList(),
    proto.xudrpc.Peer.toObject, includeInstance)
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
 * @return {!proto.xudrpc.ListPeersResponse}
 */
proto.xudrpc.ListPeersResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.ListPeersResponse;
  return proto.xudrpc.ListPeersResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.ListPeersResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.ListPeersResponse}
 */
proto.xudrpc.ListPeersResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.xudrpc.Peer;
      reader.readMessage(value,proto.xudrpc.Peer.deserializeBinaryFromReader);
      msg.addPeers(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.ListPeersResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.ListPeersResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.ListPeersResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListPeersResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPeersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.xudrpc.Peer.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Peer peers = 1;
 * @return {!Array<!proto.xudrpc.Peer>}
 */
proto.xudrpc.ListPeersResponse.prototype.getPeersList = function() {
  return /** @type{!Array<!proto.xudrpc.Peer>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.xudrpc.Peer, 1));
};


/** @param {!Array<!proto.xudrpc.Peer>} value */
proto.xudrpc.ListPeersResponse.prototype.setPeersList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.xudrpc.Peer=} opt_value
 * @param {number=} opt_index
 * @return {!proto.xudrpc.Peer}
 */
proto.xudrpc.ListPeersResponse.prototype.addPeers = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.xudrpc.Peer, opt_index);
};


proto.xudrpc.ListPeersResponse.prototype.clearPeersList = function() {
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
proto.xudrpc.ListTradesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.ListTradesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.ListTradesRequest.displayName = 'proto.xudrpc.ListTradesRequest';
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
proto.xudrpc.ListTradesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.ListTradesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.ListTradesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListTradesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    limit: jspb.Message.getFieldWithDefault(msg, 1, 0)
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
 * @return {!proto.xudrpc.ListTradesRequest}
 */
proto.xudrpc.ListTradesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.ListTradesRequest;
  return proto.xudrpc.ListTradesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.ListTradesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.ListTradesRequest}
 */
proto.xudrpc.ListTradesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setLimit(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.ListTradesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.ListTradesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.ListTradesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListTradesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLimit();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
};


/**
 * optional int32 limit = 1;
 * @return {number}
 */
proto.xudrpc.ListTradesRequest.prototype.getLimit = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.xudrpc.ListTradesRequest.prototype.setLimit = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
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
proto.xudrpc.ListTradesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.xudrpc.ListTradesResponse.repeatedFields_, null);
};
goog.inherits(proto.xudrpc.ListTradesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.ListTradesResponse.displayName = 'proto.xudrpc.ListTradesResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.xudrpc.ListTradesResponse.repeatedFields_ = [1];



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
proto.xudrpc.ListTradesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.ListTradesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.ListTradesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListTradesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    tradesList: jspb.Message.toObjectList(msg.getTradesList(),
    proto.xudrpc.Trade.toObject, includeInstance)
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
 * @return {!proto.xudrpc.ListTradesResponse}
 */
proto.xudrpc.ListTradesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.ListTradesResponse;
  return proto.xudrpc.ListTradesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.ListTradesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.ListTradesResponse}
 */
proto.xudrpc.ListTradesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.xudrpc.Trade;
      reader.readMessage(value,proto.xudrpc.Trade.deserializeBinaryFromReader);
      msg.addTrades(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.ListTradesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.ListTradesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.ListTradesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ListTradesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTradesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.xudrpc.Trade.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Trade trades = 1;
 * @return {!Array<!proto.xudrpc.Trade>}
 */
proto.xudrpc.ListTradesResponse.prototype.getTradesList = function() {
  return /** @type{!Array<!proto.xudrpc.Trade>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.xudrpc.Trade, 1));
};


/** @param {!Array<!proto.xudrpc.Trade>} value */
proto.xudrpc.ListTradesResponse.prototype.setTradesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.xudrpc.Trade=} opt_value
 * @param {number=} opt_index
 * @return {!proto.xudrpc.Trade}
 */
proto.xudrpc.ListTradesResponse.prototype.addTrades = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.xudrpc.Trade, opt_index);
};


proto.xudrpc.ListTradesResponse.prototype.clearTradesList = function() {
  this.setTradesList([]);
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
proto.xudrpc.LndInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.xudrpc.LndInfo.repeatedFields_, null);
};
goog.inherits(proto.xudrpc.LndInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.LndInfo.displayName = 'proto.xudrpc.LndInfo';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.xudrpc.LndInfo.repeatedFields_ = [3,5];



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
proto.xudrpc.LndInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.LndInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.LndInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.LndInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    status: jspb.Message.getFieldWithDefault(msg, 1, ""),
    channels: (f = msg.getChannels()) && proto.xudrpc.Channels.toObject(includeInstance, f),
    chainsList: jspb.Message.toObjectList(msg.getChainsList(),
    proto.xudrpc.Chain.toObject, includeInstance),
    blockheight: jspb.Message.getFieldWithDefault(msg, 4, 0),
    urisList: jspb.Message.getRepeatedField(msg, 5),
    version: jspb.Message.getFieldWithDefault(msg, 6, ""),
    alias: jspb.Message.getFieldWithDefault(msg, 7, "")
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
 * @return {!proto.xudrpc.LndInfo}
 */
proto.xudrpc.LndInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.LndInfo;
  return proto.xudrpc.LndInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.LndInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.LndInfo}
 */
proto.xudrpc.LndInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStatus(value);
      break;
    case 2:
      var value = new proto.xudrpc.Channels;
      reader.readMessage(value,proto.xudrpc.Channels.deserializeBinaryFromReader);
      msg.setChannels(value);
      break;
    case 3:
      var value = new proto.xudrpc.Chain;
      reader.readMessage(value,proto.xudrpc.Chain.deserializeBinaryFromReader);
      msg.addChains(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setBlockheight(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.addUris(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setVersion(value);
      break;
    case 7:
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.LndInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.LndInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.LndInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.LndInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStatus();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getChannels();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.xudrpc.Channels.serializeBinaryToWriter
    );
  }
  f = message.getChainsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.xudrpc.Chain.serializeBinaryToWriter
    );
  }
  f = message.getBlockheight();
  if (f !== 0) {
    writer.writeUint32(
      4,
      f
    );
  }
  f = message.getUrisList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      5,
      f
    );
  }
  f = message.getVersion();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getAlias();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
};


/**
 * optional string status = 1;
 * @return {string}
 */
proto.xudrpc.LndInfo.prototype.getStatus = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.LndInfo.prototype.setStatus = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional Channels channels = 2;
 * @return {?proto.xudrpc.Channels}
 */
proto.xudrpc.LndInfo.prototype.getChannels = function() {
  return /** @type{?proto.xudrpc.Channels} */ (
    jspb.Message.getWrapperField(this, proto.xudrpc.Channels, 2));
};


/** @param {?proto.xudrpc.Channels|undefined} value */
proto.xudrpc.LndInfo.prototype.setChannels = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.xudrpc.LndInfo.prototype.clearChannels = function() {
  this.setChannels(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.xudrpc.LndInfo.prototype.hasChannels = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * repeated Chain chains = 3;
 * @return {!Array<!proto.xudrpc.Chain>}
 */
proto.xudrpc.LndInfo.prototype.getChainsList = function() {
  return /** @type{!Array<!proto.xudrpc.Chain>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.xudrpc.Chain, 3));
};


/** @param {!Array<!proto.xudrpc.Chain>} value */
proto.xudrpc.LndInfo.prototype.setChainsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.xudrpc.Chain=} opt_value
 * @param {number=} opt_index
 * @return {!proto.xudrpc.Chain}
 */
proto.xudrpc.LndInfo.prototype.addChains = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.xudrpc.Chain, opt_index);
};


proto.xudrpc.LndInfo.prototype.clearChainsList = function() {
  this.setChainsList([]);
};


/**
 * optional uint32 blockheight = 4;
 * @return {number}
 */
proto.xudrpc.LndInfo.prototype.getBlockheight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.xudrpc.LndInfo.prototype.setBlockheight = function(value) {
  jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * repeated string uris = 5;
 * @return {!Array<string>}
 */
proto.xudrpc.LndInfo.prototype.getUrisList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 5));
};


/** @param {!Array<string>} value */
proto.xudrpc.LndInfo.prototype.setUrisList = function(value) {
  jspb.Message.setField(this, 5, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.xudrpc.LndInfo.prototype.addUris = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 5, value, opt_index);
};


proto.xudrpc.LndInfo.prototype.clearUrisList = function() {
  this.setUrisList([]);
};


/**
 * optional string version = 6;
 * @return {string}
 */
proto.xudrpc.LndInfo.prototype.getVersion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/** @param {string} value */
proto.xudrpc.LndInfo.prototype.setVersion = function(value) {
  jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string alias = 7;
 * @return {string}
 */
proto.xudrpc.LndInfo.prototype.getAlias = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/** @param {string} value */
proto.xudrpc.LndInfo.prototype.setAlias = function(value) {
  jspb.Message.setProto3StringField(this, 7, value);
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
proto.xudrpc.OpenChannelRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.OpenChannelRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.OpenChannelRequest.displayName = 'proto.xudrpc.OpenChannelRequest';
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
proto.xudrpc.OpenChannelRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.OpenChannelRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.OpenChannelRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.OpenChannelRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    nodeIdentifier: jspb.Message.getFieldWithDefault(msg, 1, ""),
    currency: jspb.Message.getFieldWithDefault(msg, 2, ""),
    amount: jspb.Message.getFieldWithDefault(msg, 3, 0)
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
 * @return {!proto.xudrpc.OpenChannelRequest}
 */
proto.xudrpc.OpenChannelRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.OpenChannelRequest;
  return proto.xudrpc.OpenChannelRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.OpenChannelRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.OpenChannelRequest}
 */
proto.xudrpc.OpenChannelRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setNodeIdentifier(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setCurrency(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setAmount(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.OpenChannelRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.OpenChannelRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.OpenChannelRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.OpenChannelRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getNodeIdentifier();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCurrency();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getAmount();
  if (f !== 0) {
    writer.writeInt64(
      3,
      f
    );
  }
};


/**
 * optional string node_identifier = 1;
 * @return {string}
 */
proto.xudrpc.OpenChannelRequest.prototype.getNodeIdentifier = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.OpenChannelRequest.prototype.setNodeIdentifier = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string currency = 2;
 * @return {string}
 */
proto.xudrpc.OpenChannelRequest.prototype.getCurrency = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.xudrpc.OpenChannelRequest.prototype.setCurrency = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional int64 amount = 3;
 * @return {number}
 */
proto.xudrpc.OpenChannelRequest.prototype.getAmount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.xudrpc.OpenChannelRequest.prototype.setAmount = function(value) {
  jspb.Message.setProto3IntField(this, 3, value);
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
proto.xudrpc.OpenChannelResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.OpenChannelResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.OpenChannelResponse.displayName = 'proto.xudrpc.OpenChannelResponse';
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
proto.xudrpc.OpenChannelResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.OpenChannelResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.OpenChannelResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.OpenChannelResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.xudrpc.OpenChannelResponse}
 */
proto.xudrpc.OpenChannelResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.OpenChannelResponse;
  return proto.xudrpc.OpenChannelResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.OpenChannelResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.OpenChannelResponse}
 */
proto.xudrpc.OpenChannelResponse.deserializeBinaryFromReader = function(msg, reader) {
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.OpenChannelResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.OpenChannelResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.OpenChannelResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.OpenChannelResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.xudrpc.Order = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.xudrpc.Order.oneofGroups_);
};
goog.inherits(proto.xudrpc.Order, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.Order.displayName = 'proto.xudrpc.Order';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.xudrpc.Order.oneofGroups_ = [[5,6]];

/**
 * @enum {number}
 */
proto.xudrpc.Order.OwnOrPeerCase = {
  OWN_OR_PEER_NOT_SET: 0,
  PEER_PUB_KEY: 5,
  LOCAL_ID: 6
};

/**
 * @return {proto.xudrpc.Order.OwnOrPeerCase}
 */
proto.xudrpc.Order.prototype.getOwnOrPeerCase = function() {
  return /** @type {proto.xudrpc.Order.OwnOrPeerCase} */(jspb.Message.computeOneofCase(this, proto.xudrpc.Order.oneofGroups_[0]));
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
proto.xudrpc.Order.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.Order.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.Order} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Order.toObject = function(includeInstance, msg) {
  var f, obj = {
    price: +jspb.Message.getFieldWithDefault(msg, 1, 0.0),
    quantity: jspb.Message.getFieldWithDefault(msg, 2, 0),
    pairId: jspb.Message.getFieldWithDefault(msg, 3, ""),
    id: jspb.Message.getFieldWithDefault(msg, 4, ""),
    peerPubKey: jspb.Message.getFieldWithDefault(msg, 5, ""),
    localId: jspb.Message.getFieldWithDefault(msg, 6, ""),
    createdAt: jspb.Message.getFieldWithDefault(msg, 7, 0),
    side: jspb.Message.getFieldWithDefault(msg, 8, 0),
    isOwnOrder: jspb.Message.getFieldWithDefault(msg, 9, false),
    hold: jspb.Message.getFieldWithDefault(msg, 10, 0)
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
 * @return {!proto.xudrpc.Order}
 */
proto.xudrpc.Order.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.Order;
  return proto.xudrpc.Order.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.Order} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.Order}
 */
proto.xudrpc.Order.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setPrice(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setQuantity(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setPairId(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setPeerPubKey(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setLocalId(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setCreatedAt(value);
      break;
    case 8:
      var value = /** @type {!proto.xudrpc.OrderSide} */ (reader.readEnum());
      msg.setSide(value);
      break;
    case 9:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsOwnOrder(value);
      break;
    case 10:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setHold(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.Order.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.Order.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.Order} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Order.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPrice();
  if (f !== 0.0) {
    writer.writeDouble(
      1,
      f
    );
  }
  f = message.getQuantity();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getPairId();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 5));
  if (f != null) {
    writer.writeString(
      5,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 6));
  if (f != null) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getCreatedAt();
  if (f !== 0) {
    writer.writeUint64(
      7,
      f
    );
  }
  f = message.getSide();
  if (f !== 0.0) {
    writer.writeEnum(
      8,
      f
    );
  }
  f = message.getIsOwnOrder();
  if (f) {
    writer.writeBool(
      9,
      f
    );
  }
  f = message.getHold();
  if (f !== 0) {
    writer.writeUint64(
      10,
      f
    );
  }
};


/**
 * optional double price = 1;
 * @return {number}
 */
proto.xudrpc.Order.prototype.getPrice = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 1, 0.0));
};


/** @param {number} value */
proto.xudrpc.Order.prototype.setPrice = function(value) {
  jspb.Message.setProto3FloatField(this, 1, value);
};


/**
 * optional uint64 quantity = 2;
 * @return {number}
 */
proto.xudrpc.Order.prototype.getQuantity = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.xudrpc.Order.prototype.setQuantity = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string pair_id = 3;
 * @return {string}
 */
proto.xudrpc.Order.prototype.getPairId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.xudrpc.Order.prototype.setPairId = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string id = 4;
 * @return {string}
 */
proto.xudrpc.Order.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.xudrpc.Order.prototype.setId = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string peer_pub_key = 5;
 * @return {string}
 */
proto.xudrpc.Order.prototype.getPeerPubKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.xudrpc.Order.prototype.setPeerPubKey = function(value) {
  jspb.Message.setOneofField(this, 5, proto.xudrpc.Order.oneofGroups_[0], value);
};


proto.xudrpc.Order.prototype.clearPeerPubKey = function() {
  jspb.Message.setOneofField(this, 5, proto.xudrpc.Order.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.xudrpc.Order.prototype.hasPeerPubKey = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional string local_id = 6;
 * @return {string}
 */
proto.xudrpc.Order.prototype.getLocalId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/** @param {string} value */
proto.xudrpc.Order.prototype.setLocalId = function(value) {
  jspb.Message.setOneofField(this, 6, proto.xudrpc.Order.oneofGroups_[0], value);
};


proto.xudrpc.Order.prototype.clearLocalId = function() {
  jspb.Message.setOneofField(this, 6, proto.xudrpc.Order.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.xudrpc.Order.prototype.hasLocalId = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional uint64 created_at = 7;
 * @return {number}
 */
proto.xudrpc.Order.prototype.getCreatedAt = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/** @param {number} value */
proto.xudrpc.Order.prototype.setCreatedAt = function(value) {
  jspb.Message.setProto3IntField(this, 7, value);
};


/**
 * optional OrderSide side = 8;
 * @return {!proto.xudrpc.OrderSide}
 */
proto.xudrpc.Order.prototype.getSide = function() {
  return /** @type {!proto.xudrpc.OrderSide} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/** @param {!proto.xudrpc.OrderSide} value */
proto.xudrpc.Order.prototype.setSide = function(value) {
  jspb.Message.setProto3EnumField(this, 8, value);
};


/**
 * optional bool is_own_order = 9;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.xudrpc.Order.prototype.getIsOwnOrder = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 9, false));
};


/** @param {boolean} value */
proto.xudrpc.Order.prototype.setIsOwnOrder = function(value) {
  jspb.Message.setProto3BooleanField(this, 9, value);
};


/**
 * optional uint64 hold = 10;
 * @return {number}
 */
proto.xudrpc.Order.prototype.getHold = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 10, 0));
};


/** @param {number} value */
proto.xudrpc.Order.prototype.setHold = function(value) {
  jspb.Message.setProto3IntField(this, 10, value);
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
proto.xudrpc.OrderRemoval = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.OrderRemoval, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.OrderRemoval.displayName = 'proto.xudrpc.OrderRemoval';
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
proto.xudrpc.OrderRemoval.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.OrderRemoval.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.OrderRemoval} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.OrderRemoval.toObject = function(includeInstance, msg) {
  var f, obj = {
    quantity: jspb.Message.getFieldWithDefault(msg, 1, 0),
    pairId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    orderId: jspb.Message.getFieldWithDefault(msg, 3, ""),
    localId: jspb.Message.getFieldWithDefault(msg, 4, ""),
    isOwnOrder: jspb.Message.getFieldWithDefault(msg, 5, false)
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
 * @return {!proto.xudrpc.OrderRemoval}
 */
proto.xudrpc.OrderRemoval.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.OrderRemoval;
  return proto.xudrpc.OrderRemoval.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.OrderRemoval} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.OrderRemoval}
 */
proto.xudrpc.OrderRemoval.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setQuantity(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setPairId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setOrderId(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setLocalId(value);
      break;
    case 5:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsOwnOrder(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.OrderRemoval.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.OrderRemoval.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.OrderRemoval} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.OrderRemoval.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getQuantity();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getPairId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getOrderId();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getLocalId();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getIsOwnOrder();
  if (f) {
    writer.writeBool(
      5,
      f
    );
  }
};


/**
 * optional uint64 quantity = 1;
 * @return {number}
 */
proto.xudrpc.OrderRemoval.prototype.getQuantity = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.xudrpc.OrderRemoval.prototype.setQuantity = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional string pair_id = 2;
 * @return {string}
 */
proto.xudrpc.OrderRemoval.prototype.getPairId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.xudrpc.OrderRemoval.prototype.setPairId = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string order_id = 3;
 * @return {string}
 */
proto.xudrpc.OrderRemoval.prototype.getOrderId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.xudrpc.OrderRemoval.prototype.setOrderId = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string local_id = 4;
 * @return {string}
 */
proto.xudrpc.OrderRemoval.prototype.getLocalId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.xudrpc.OrderRemoval.prototype.setLocalId = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional bool is_own_order = 5;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.xudrpc.OrderRemoval.prototype.getIsOwnOrder = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 5, false));
};


/** @param {boolean} value */
proto.xudrpc.OrderRemoval.prototype.setIsOwnOrder = function(value) {
  jspb.Message.setProto3BooleanField(this, 5, value);
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
proto.xudrpc.Orders = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.xudrpc.Orders.repeatedFields_, null);
};
goog.inherits(proto.xudrpc.Orders, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.Orders.displayName = 'proto.xudrpc.Orders';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.xudrpc.Orders.repeatedFields_ = [1,2];



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
proto.xudrpc.Orders.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.Orders.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.Orders} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Orders.toObject = function(includeInstance, msg) {
  var f, obj = {
    buyOrdersList: jspb.Message.toObjectList(msg.getBuyOrdersList(),
    proto.xudrpc.Order.toObject, includeInstance),
    sellOrdersList: jspb.Message.toObjectList(msg.getSellOrdersList(),
    proto.xudrpc.Order.toObject, includeInstance)
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
 * @return {!proto.xudrpc.Orders}
 */
proto.xudrpc.Orders.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.Orders;
  return proto.xudrpc.Orders.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.Orders} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.Orders}
 */
proto.xudrpc.Orders.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.xudrpc.Order;
      reader.readMessage(value,proto.xudrpc.Order.deserializeBinaryFromReader);
      msg.addBuyOrders(value);
      break;
    case 2:
      var value = new proto.xudrpc.Order;
      reader.readMessage(value,proto.xudrpc.Order.deserializeBinaryFromReader);
      msg.addSellOrders(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.Orders.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.Orders.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.Orders} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Orders.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBuyOrdersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.xudrpc.Order.serializeBinaryToWriter
    );
  }
  f = message.getSellOrdersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.xudrpc.Order.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Order buy_orders = 1;
 * @return {!Array<!proto.xudrpc.Order>}
 */
proto.xudrpc.Orders.prototype.getBuyOrdersList = function() {
  return /** @type{!Array<!proto.xudrpc.Order>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.xudrpc.Order, 1));
};


/** @param {!Array<!proto.xudrpc.Order>} value */
proto.xudrpc.Orders.prototype.setBuyOrdersList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.xudrpc.Order=} opt_value
 * @param {number=} opt_index
 * @return {!proto.xudrpc.Order}
 */
proto.xudrpc.Orders.prototype.addBuyOrders = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.xudrpc.Order, opt_index);
};


proto.xudrpc.Orders.prototype.clearBuyOrdersList = function() {
  this.setBuyOrdersList([]);
};


/**
 * repeated Order sell_orders = 2;
 * @return {!Array<!proto.xudrpc.Order>}
 */
proto.xudrpc.Orders.prototype.getSellOrdersList = function() {
  return /** @type{!Array<!proto.xudrpc.Order>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.xudrpc.Order, 2));
};


/** @param {!Array<!proto.xudrpc.Order>} value */
proto.xudrpc.Orders.prototype.setSellOrdersList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.xudrpc.Order=} opt_value
 * @param {number=} opt_index
 * @return {!proto.xudrpc.Order}
 */
proto.xudrpc.Orders.prototype.addSellOrders = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.xudrpc.Order, opt_index);
};


proto.xudrpc.Orders.prototype.clearSellOrdersList = function() {
  this.setSellOrdersList([]);
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
proto.xudrpc.OrdersCount = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.OrdersCount, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.OrdersCount.displayName = 'proto.xudrpc.OrdersCount';
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
proto.xudrpc.OrdersCount.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.OrdersCount.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.OrdersCount} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.OrdersCount.toObject = function(includeInstance, msg) {
  var f, obj = {
    peer: jspb.Message.getFieldWithDefault(msg, 1, 0),
    own: jspb.Message.getFieldWithDefault(msg, 2, 0)
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
 * @return {!proto.xudrpc.OrdersCount}
 */
proto.xudrpc.OrdersCount.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.OrdersCount;
  return proto.xudrpc.OrdersCount.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.OrdersCount} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.OrdersCount}
 */
proto.xudrpc.OrdersCount.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setPeer(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setOwn(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.OrdersCount.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.OrdersCount.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.OrdersCount} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.OrdersCount.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPeer();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getOwn();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
};


/**
 * optional uint32 peer = 1;
 * @return {number}
 */
proto.xudrpc.OrdersCount.prototype.getPeer = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.xudrpc.OrdersCount.prototype.setPeer = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional uint32 own = 2;
 * @return {number}
 */
proto.xudrpc.OrdersCount.prototype.getOwn = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.xudrpc.OrdersCount.prototype.setOwn = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
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
proto.xudrpc.OrderUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.xudrpc.OrderUpdate.oneofGroups_);
};
goog.inherits(proto.xudrpc.OrderUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.OrderUpdate.displayName = 'proto.xudrpc.OrderUpdate';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.xudrpc.OrderUpdate.oneofGroups_ = [[1,2]];

/**
 * @enum {number}
 */
proto.xudrpc.OrderUpdate.OrderUpdateCase = {
  ORDER_UPDATE_NOT_SET: 0,
  ORDER: 1,
  ORDER_REMOVAL: 2
};

/**
 * @return {proto.xudrpc.OrderUpdate.OrderUpdateCase}
 */
proto.xudrpc.OrderUpdate.prototype.getOrderUpdateCase = function() {
  return /** @type {proto.xudrpc.OrderUpdate.OrderUpdateCase} */(jspb.Message.computeOneofCase(this, proto.xudrpc.OrderUpdate.oneofGroups_[0]));
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
proto.xudrpc.OrderUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.OrderUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.OrderUpdate} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.OrderUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    order: (f = msg.getOrder()) && proto.xudrpc.Order.toObject(includeInstance, f),
    orderRemoval: (f = msg.getOrderRemoval()) && proto.xudrpc.OrderRemoval.toObject(includeInstance, f)
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
 * @return {!proto.xudrpc.OrderUpdate}
 */
proto.xudrpc.OrderUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.OrderUpdate;
  return proto.xudrpc.OrderUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.OrderUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.OrderUpdate}
 */
proto.xudrpc.OrderUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.xudrpc.Order;
      reader.readMessage(value,proto.xudrpc.Order.deserializeBinaryFromReader);
      msg.setOrder(value);
      break;
    case 2:
      var value = new proto.xudrpc.OrderRemoval;
      reader.readMessage(value,proto.xudrpc.OrderRemoval.deserializeBinaryFromReader);
      msg.setOrderRemoval(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.OrderUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.OrderUpdate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.OrderUpdate} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.OrderUpdate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOrder();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.xudrpc.Order.serializeBinaryToWriter
    );
  }
  f = message.getOrderRemoval();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.xudrpc.OrderRemoval.serializeBinaryToWriter
    );
  }
};


/**
 * optional Order order = 1;
 * @return {?proto.xudrpc.Order}
 */
proto.xudrpc.OrderUpdate.prototype.getOrder = function() {
  return /** @type{?proto.xudrpc.Order} */ (
    jspb.Message.getWrapperField(this, proto.xudrpc.Order, 1));
};


/** @param {?proto.xudrpc.Order|undefined} value */
proto.xudrpc.OrderUpdate.prototype.setOrder = function(value) {
  jspb.Message.setOneofWrapperField(this, 1, proto.xudrpc.OrderUpdate.oneofGroups_[0], value);
};


proto.xudrpc.OrderUpdate.prototype.clearOrder = function() {
  this.setOrder(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.xudrpc.OrderUpdate.prototype.hasOrder = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional OrderRemoval order_removal = 2;
 * @return {?proto.xudrpc.OrderRemoval}
 */
proto.xudrpc.OrderUpdate.prototype.getOrderRemoval = function() {
  return /** @type{?proto.xudrpc.OrderRemoval} */ (
    jspb.Message.getWrapperField(this, proto.xudrpc.OrderRemoval, 2));
};


/** @param {?proto.xudrpc.OrderRemoval|undefined} value */
proto.xudrpc.OrderUpdate.prototype.setOrderRemoval = function(value) {
  jspb.Message.setOneofWrapperField(this, 2, proto.xudrpc.OrderUpdate.oneofGroups_[0], value);
};


proto.xudrpc.OrderUpdate.prototype.clearOrderRemoval = function() {
  this.setOrderRemoval(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.xudrpc.OrderUpdate.prototype.hasOrderRemoval = function() {
  return jspb.Message.getField(this, 2) != null;
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
proto.xudrpc.Peer = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.xudrpc.Peer.repeatedFields_, null);
};
goog.inherits(proto.xudrpc.Peer, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.Peer.displayName = 'proto.xudrpc.Peer';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.xudrpc.Peer.repeatedFields_ = [5];



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
proto.xudrpc.Peer.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.Peer.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.Peer} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Peer.toObject = function(includeInstance, msg) {
  var f, obj = {
    address: jspb.Message.getFieldWithDefault(msg, 1, ""),
    nodePubKey: jspb.Message.getFieldWithDefault(msg, 2, ""),
    lndPubKeysMap: (f = msg.getLndPubKeysMap()) ? f.toObject(includeInstance, undefined) : [],
    inbound: jspb.Message.getFieldWithDefault(msg, 4, false),
    pairsList: jspb.Message.getRepeatedField(msg, 5),
    xudVersion: jspb.Message.getFieldWithDefault(msg, 6, ""),
    secondsConnected: jspb.Message.getFieldWithDefault(msg, 7, 0),
    raidenAddress: jspb.Message.getFieldWithDefault(msg, 8, ""),
    alias: jspb.Message.getFieldWithDefault(msg, 9, "")
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
 * @return {!proto.xudrpc.Peer}
 */
proto.xudrpc.Peer.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.Peer;
  return proto.xudrpc.Peer.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.Peer} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.Peer}
 */
proto.xudrpc.Peer.deserializeBinaryFromReader = function(msg, reader) {
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
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setNodePubKey(value);
      break;
    case 3:
      var value = msg.getLndPubKeysMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readString, null, "");
         });
      break;
    case 4:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setInbound(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.addPairs(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setXudVersion(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setSecondsConnected(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setRaidenAddress(value);
      break;
    case 9:
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.Peer.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.Peer.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.Peer} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Peer.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddress();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getNodePubKey();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getLndPubKeysMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(3, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeString);
  }
  f = message.getInbound();
  if (f) {
    writer.writeBool(
      4,
      f
    );
  }
  f = message.getPairsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      5,
      f
    );
  }
  f = message.getXudVersion();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getSecondsConnected();
  if (f !== 0) {
    writer.writeUint32(
      7,
      f
    );
  }
  f = message.getRaidenAddress();
  if (f.length > 0) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getAlias();
  if (f.length > 0) {
    writer.writeString(
      9,
      f
    );
  }
};


/**
 * optional string address = 1;
 * @return {string}
 */
proto.xudrpc.Peer.prototype.getAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.Peer.prototype.setAddress = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string node_pub_key = 2;
 * @return {string}
 */
proto.xudrpc.Peer.prototype.getNodePubKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.xudrpc.Peer.prototype.setNodePubKey = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * map<string, string> lnd_pub_keys = 3;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,string>}
 */
proto.xudrpc.Peer.prototype.getLndPubKeysMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,string>} */ (
      jspb.Message.getMapField(this, 3, opt_noLazyCreate,
      null));
};


proto.xudrpc.Peer.prototype.clearLndPubKeysMap = function() {
  this.getLndPubKeysMap().clear();
};


/**
 * optional bool inbound = 4;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.xudrpc.Peer.prototype.getInbound = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 4, false));
};


/** @param {boolean} value */
proto.xudrpc.Peer.prototype.setInbound = function(value) {
  jspb.Message.setProto3BooleanField(this, 4, value);
};


/**
 * repeated string pairs = 5;
 * @return {!Array<string>}
 */
proto.xudrpc.Peer.prototype.getPairsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 5));
};


/** @param {!Array<string>} value */
proto.xudrpc.Peer.prototype.setPairsList = function(value) {
  jspb.Message.setField(this, 5, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.xudrpc.Peer.prototype.addPairs = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 5, value, opt_index);
};


proto.xudrpc.Peer.prototype.clearPairsList = function() {
  this.setPairsList([]);
};


/**
 * optional string xud_version = 6;
 * @return {string}
 */
proto.xudrpc.Peer.prototype.getXudVersion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/** @param {string} value */
proto.xudrpc.Peer.prototype.setXudVersion = function(value) {
  jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional uint32 seconds_connected = 7;
 * @return {number}
 */
proto.xudrpc.Peer.prototype.getSecondsConnected = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/** @param {number} value */
proto.xudrpc.Peer.prototype.setSecondsConnected = function(value) {
  jspb.Message.setProto3IntField(this, 7, value);
};


/**
 * optional string raiden_address = 8;
 * @return {string}
 */
proto.xudrpc.Peer.prototype.getRaidenAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/** @param {string} value */
proto.xudrpc.Peer.prototype.setRaidenAddress = function(value) {
  jspb.Message.setProto3StringField(this, 8, value);
};


/**
 * optional string alias = 9;
 * @return {string}
 */
proto.xudrpc.Peer.prototype.getAlias = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/** @param {string} value */
proto.xudrpc.Peer.prototype.setAlias = function(value) {
  jspb.Message.setProto3StringField(this, 9, value);
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
proto.xudrpc.PlaceOrderRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.PlaceOrderRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.PlaceOrderRequest.displayName = 'proto.xudrpc.PlaceOrderRequest';
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
proto.xudrpc.PlaceOrderRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.PlaceOrderRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.PlaceOrderRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.PlaceOrderRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    price: +jspb.Message.getFieldWithDefault(msg, 1, 0.0),
    quantity: jspb.Message.getFieldWithDefault(msg, 2, 0),
    pairId: jspb.Message.getFieldWithDefault(msg, 3, ""),
    orderId: jspb.Message.getFieldWithDefault(msg, 4, ""),
    side: jspb.Message.getFieldWithDefault(msg, 5, 0),
    replaceOrderId: jspb.Message.getFieldWithDefault(msg, 6, ""),
    immediateOrCancel: jspb.Message.getFieldWithDefault(msg, 7, false)
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
 * @return {!proto.xudrpc.PlaceOrderRequest}
 */
proto.xudrpc.PlaceOrderRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.PlaceOrderRequest;
  return proto.xudrpc.PlaceOrderRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.PlaceOrderRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.PlaceOrderRequest}
 */
proto.xudrpc.PlaceOrderRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setPrice(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setQuantity(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setPairId(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setOrderId(value);
      break;
    case 5:
      var value = /** @type {!proto.xudrpc.OrderSide} */ (reader.readEnum());
      msg.setSide(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setReplaceOrderId(value);
      break;
    case 7:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setImmediateOrCancel(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.PlaceOrderRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.PlaceOrderRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.PlaceOrderRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.PlaceOrderRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPrice();
  if (f !== 0.0) {
    writer.writeDouble(
      1,
      f
    );
  }
  f = message.getQuantity();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getPairId();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getOrderId();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getSide();
  if (f !== 0.0) {
    writer.writeEnum(
      5,
      f
    );
  }
  f = message.getReplaceOrderId();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getImmediateOrCancel();
  if (f) {
    writer.writeBool(
      7,
      f
    );
  }
};


/**
 * optional double price = 1;
 * @return {number}
 */
proto.xudrpc.PlaceOrderRequest.prototype.getPrice = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 1, 0.0));
};


/** @param {number} value */
proto.xudrpc.PlaceOrderRequest.prototype.setPrice = function(value) {
  jspb.Message.setProto3FloatField(this, 1, value);
};


/**
 * optional uint64 quantity = 2;
 * @return {number}
 */
proto.xudrpc.PlaceOrderRequest.prototype.getQuantity = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.xudrpc.PlaceOrderRequest.prototype.setQuantity = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string pair_id = 3;
 * @return {string}
 */
proto.xudrpc.PlaceOrderRequest.prototype.getPairId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.xudrpc.PlaceOrderRequest.prototype.setPairId = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string order_id = 4;
 * @return {string}
 */
proto.xudrpc.PlaceOrderRequest.prototype.getOrderId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.xudrpc.PlaceOrderRequest.prototype.setOrderId = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional OrderSide side = 5;
 * @return {!proto.xudrpc.OrderSide}
 */
proto.xudrpc.PlaceOrderRequest.prototype.getSide = function() {
  return /** @type {!proto.xudrpc.OrderSide} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/** @param {!proto.xudrpc.OrderSide} value */
proto.xudrpc.PlaceOrderRequest.prototype.setSide = function(value) {
  jspb.Message.setProto3EnumField(this, 5, value);
};


/**
 * optional string replace_order_id = 6;
 * @return {string}
 */
proto.xudrpc.PlaceOrderRequest.prototype.getReplaceOrderId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/** @param {string} value */
proto.xudrpc.PlaceOrderRequest.prototype.setReplaceOrderId = function(value) {
  jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional bool immediate_or_cancel = 7;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.xudrpc.PlaceOrderRequest.prototype.getImmediateOrCancel = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 7, false));
};


/** @param {boolean} value */
proto.xudrpc.PlaceOrderRequest.prototype.setImmediateOrCancel = function(value) {
  jspb.Message.setProto3BooleanField(this, 7, value);
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
proto.xudrpc.PlaceOrderResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.xudrpc.PlaceOrderResponse.repeatedFields_, null);
};
goog.inherits(proto.xudrpc.PlaceOrderResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.PlaceOrderResponse.displayName = 'proto.xudrpc.PlaceOrderResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.xudrpc.PlaceOrderResponse.repeatedFields_ = [1,2,4];



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
proto.xudrpc.PlaceOrderResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.PlaceOrderResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.PlaceOrderResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.PlaceOrderResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    internalMatchesList: jspb.Message.toObjectList(msg.getInternalMatchesList(),
    proto.xudrpc.Order.toObject, includeInstance),
    swapSuccessesList: jspb.Message.toObjectList(msg.getSwapSuccessesList(),
    proto.xudrpc.SwapSuccess.toObject, includeInstance),
    remainingOrder: (f = msg.getRemainingOrder()) && proto.xudrpc.Order.toObject(includeInstance, f),
    swapFailuresList: jspb.Message.toObjectList(msg.getSwapFailuresList(),
    proto.xudrpc.SwapFailure.toObject, includeInstance)
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
 * @return {!proto.xudrpc.PlaceOrderResponse}
 */
proto.xudrpc.PlaceOrderResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.PlaceOrderResponse;
  return proto.xudrpc.PlaceOrderResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.PlaceOrderResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.PlaceOrderResponse}
 */
proto.xudrpc.PlaceOrderResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.xudrpc.Order;
      reader.readMessage(value,proto.xudrpc.Order.deserializeBinaryFromReader);
      msg.addInternalMatches(value);
      break;
    case 2:
      var value = new proto.xudrpc.SwapSuccess;
      reader.readMessage(value,proto.xudrpc.SwapSuccess.deserializeBinaryFromReader);
      msg.addSwapSuccesses(value);
      break;
    case 3:
      var value = new proto.xudrpc.Order;
      reader.readMessage(value,proto.xudrpc.Order.deserializeBinaryFromReader);
      msg.setRemainingOrder(value);
      break;
    case 4:
      var value = new proto.xudrpc.SwapFailure;
      reader.readMessage(value,proto.xudrpc.SwapFailure.deserializeBinaryFromReader);
      msg.addSwapFailures(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.PlaceOrderResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.PlaceOrderResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.PlaceOrderResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.PlaceOrderResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInternalMatchesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.xudrpc.Order.serializeBinaryToWriter
    );
  }
  f = message.getSwapSuccessesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.xudrpc.SwapSuccess.serializeBinaryToWriter
    );
  }
  f = message.getRemainingOrder();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.xudrpc.Order.serializeBinaryToWriter
    );
  }
  f = message.getSwapFailuresList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto.xudrpc.SwapFailure.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Order internal_matches = 1;
 * @return {!Array<!proto.xudrpc.Order>}
 */
proto.xudrpc.PlaceOrderResponse.prototype.getInternalMatchesList = function() {
  return /** @type{!Array<!proto.xudrpc.Order>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.xudrpc.Order, 1));
};


/** @param {!Array<!proto.xudrpc.Order>} value */
proto.xudrpc.PlaceOrderResponse.prototype.setInternalMatchesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.xudrpc.Order=} opt_value
 * @param {number=} opt_index
 * @return {!proto.xudrpc.Order}
 */
proto.xudrpc.PlaceOrderResponse.prototype.addInternalMatches = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.xudrpc.Order, opt_index);
};


proto.xudrpc.PlaceOrderResponse.prototype.clearInternalMatchesList = function() {
  this.setInternalMatchesList([]);
};


/**
 * repeated SwapSuccess swap_successes = 2;
 * @return {!Array<!proto.xudrpc.SwapSuccess>}
 */
proto.xudrpc.PlaceOrderResponse.prototype.getSwapSuccessesList = function() {
  return /** @type{!Array<!proto.xudrpc.SwapSuccess>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.xudrpc.SwapSuccess, 2));
};


/** @param {!Array<!proto.xudrpc.SwapSuccess>} value */
proto.xudrpc.PlaceOrderResponse.prototype.setSwapSuccessesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.xudrpc.SwapSuccess=} opt_value
 * @param {number=} opt_index
 * @return {!proto.xudrpc.SwapSuccess}
 */
proto.xudrpc.PlaceOrderResponse.prototype.addSwapSuccesses = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.xudrpc.SwapSuccess, opt_index);
};


proto.xudrpc.PlaceOrderResponse.prototype.clearSwapSuccessesList = function() {
  this.setSwapSuccessesList([]);
};


/**
 * optional Order remaining_order = 3;
 * @return {?proto.xudrpc.Order}
 */
proto.xudrpc.PlaceOrderResponse.prototype.getRemainingOrder = function() {
  return /** @type{?proto.xudrpc.Order} */ (
    jspb.Message.getWrapperField(this, proto.xudrpc.Order, 3));
};


/** @param {?proto.xudrpc.Order|undefined} value */
proto.xudrpc.PlaceOrderResponse.prototype.setRemainingOrder = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.xudrpc.PlaceOrderResponse.prototype.clearRemainingOrder = function() {
  this.setRemainingOrder(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.xudrpc.PlaceOrderResponse.prototype.hasRemainingOrder = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * repeated SwapFailure swap_failures = 4;
 * @return {!Array<!proto.xudrpc.SwapFailure>}
 */
proto.xudrpc.PlaceOrderResponse.prototype.getSwapFailuresList = function() {
  return /** @type{!Array<!proto.xudrpc.SwapFailure>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.xudrpc.SwapFailure, 4));
};


/** @param {!Array<!proto.xudrpc.SwapFailure>} value */
proto.xudrpc.PlaceOrderResponse.prototype.setSwapFailuresList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.xudrpc.SwapFailure=} opt_value
 * @param {number=} opt_index
 * @return {!proto.xudrpc.SwapFailure}
 */
proto.xudrpc.PlaceOrderResponse.prototype.addSwapFailures = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.xudrpc.SwapFailure, opt_index);
};


proto.xudrpc.PlaceOrderResponse.prototype.clearSwapFailuresList = function() {
  this.setSwapFailuresList([]);
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
proto.xudrpc.PlaceOrderEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.xudrpc.PlaceOrderEvent.oneofGroups_);
};
goog.inherits(proto.xudrpc.PlaceOrderEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.PlaceOrderEvent.displayName = 'proto.xudrpc.PlaceOrderEvent';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.xudrpc.PlaceOrderEvent.oneofGroups_ = [[1,2,3,4]];

/**
 * @enum {number}
 */
proto.xudrpc.PlaceOrderEvent.EventCase = {
  EVENT_NOT_SET: 0,
  INTERNAL_MATCH: 1,
  SWAP_SUCCESS: 2,
  REMAINING_ORDER: 3,
  SWAP_FAILURE: 4
};

/**
 * @return {proto.xudrpc.PlaceOrderEvent.EventCase}
 */
proto.xudrpc.PlaceOrderEvent.prototype.getEventCase = function() {
  return /** @type {proto.xudrpc.PlaceOrderEvent.EventCase} */(jspb.Message.computeOneofCase(this, proto.xudrpc.PlaceOrderEvent.oneofGroups_[0]));
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
proto.xudrpc.PlaceOrderEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.PlaceOrderEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.PlaceOrderEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.PlaceOrderEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    internalMatch: (f = msg.getInternalMatch()) && proto.xudrpc.Order.toObject(includeInstance, f),
    swapSuccess: (f = msg.getSwapSuccess()) && proto.xudrpc.SwapSuccess.toObject(includeInstance, f),
    remainingOrder: (f = msg.getRemainingOrder()) && proto.xudrpc.Order.toObject(includeInstance, f),
    swapFailure: (f = msg.getSwapFailure()) && proto.xudrpc.SwapFailure.toObject(includeInstance, f)
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
 * @return {!proto.xudrpc.PlaceOrderEvent}
 */
proto.xudrpc.PlaceOrderEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.PlaceOrderEvent;
  return proto.xudrpc.PlaceOrderEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.PlaceOrderEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.PlaceOrderEvent}
 */
proto.xudrpc.PlaceOrderEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.xudrpc.Order;
      reader.readMessage(value,proto.xudrpc.Order.deserializeBinaryFromReader);
      msg.setInternalMatch(value);
      break;
    case 2:
      var value = new proto.xudrpc.SwapSuccess;
      reader.readMessage(value,proto.xudrpc.SwapSuccess.deserializeBinaryFromReader);
      msg.setSwapSuccess(value);
      break;
    case 3:
      var value = new proto.xudrpc.Order;
      reader.readMessage(value,proto.xudrpc.Order.deserializeBinaryFromReader);
      msg.setRemainingOrder(value);
      break;
    case 4:
      var value = new proto.xudrpc.SwapFailure;
      reader.readMessage(value,proto.xudrpc.SwapFailure.deserializeBinaryFromReader);
      msg.setSwapFailure(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.PlaceOrderEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.PlaceOrderEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.PlaceOrderEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.PlaceOrderEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInternalMatch();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.xudrpc.Order.serializeBinaryToWriter
    );
  }
  f = message.getSwapSuccess();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.xudrpc.SwapSuccess.serializeBinaryToWriter
    );
  }
  f = message.getRemainingOrder();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.xudrpc.Order.serializeBinaryToWriter
    );
  }
  f = message.getSwapFailure();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.xudrpc.SwapFailure.serializeBinaryToWriter
    );
  }
};


/**
 * optional Order internal_match = 1;
 * @return {?proto.xudrpc.Order}
 */
proto.xudrpc.PlaceOrderEvent.prototype.getInternalMatch = function() {
  return /** @type{?proto.xudrpc.Order} */ (
    jspb.Message.getWrapperField(this, proto.xudrpc.Order, 1));
};


/** @param {?proto.xudrpc.Order|undefined} value */
proto.xudrpc.PlaceOrderEvent.prototype.setInternalMatch = function(value) {
  jspb.Message.setOneofWrapperField(this, 1, proto.xudrpc.PlaceOrderEvent.oneofGroups_[0], value);
};


proto.xudrpc.PlaceOrderEvent.prototype.clearInternalMatch = function() {
  this.setInternalMatch(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.xudrpc.PlaceOrderEvent.prototype.hasInternalMatch = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional SwapSuccess swap_success = 2;
 * @return {?proto.xudrpc.SwapSuccess}
 */
proto.xudrpc.PlaceOrderEvent.prototype.getSwapSuccess = function() {
  return /** @type{?proto.xudrpc.SwapSuccess} */ (
    jspb.Message.getWrapperField(this, proto.xudrpc.SwapSuccess, 2));
};


/** @param {?proto.xudrpc.SwapSuccess|undefined} value */
proto.xudrpc.PlaceOrderEvent.prototype.setSwapSuccess = function(value) {
  jspb.Message.setOneofWrapperField(this, 2, proto.xudrpc.PlaceOrderEvent.oneofGroups_[0], value);
};


proto.xudrpc.PlaceOrderEvent.prototype.clearSwapSuccess = function() {
  this.setSwapSuccess(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.xudrpc.PlaceOrderEvent.prototype.hasSwapSuccess = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional Order remaining_order = 3;
 * @return {?proto.xudrpc.Order}
 */
proto.xudrpc.PlaceOrderEvent.prototype.getRemainingOrder = function() {
  return /** @type{?proto.xudrpc.Order} */ (
    jspb.Message.getWrapperField(this, proto.xudrpc.Order, 3));
};


/** @param {?proto.xudrpc.Order|undefined} value */
proto.xudrpc.PlaceOrderEvent.prototype.setRemainingOrder = function(value) {
  jspb.Message.setOneofWrapperField(this, 3, proto.xudrpc.PlaceOrderEvent.oneofGroups_[0], value);
};


proto.xudrpc.PlaceOrderEvent.prototype.clearRemainingOrder = function() {
  this.setRemainingOrder(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.xudrpc.PlaceOrderEvent.prototype.hasRemainingOrder = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional SwapFailure swap_failure = 4;
 * @return {?proto.xudrpc.SwapFailure}
 */
proto.xudrpc.PlaceOrderEvent.prototype.getSwapFailure = function() {
  return /** @type{?proto.xudrpc.SwapFailure} */ (
    jspb.Message.getWrapperField(this, proto.xudrpc.SwapFailure, 4));
};


/** @param {?proto.xudrpc.SwapFailure|undefined} value */
proto.xudrpc.PlaceOrderEvent.prototype.setSwapFailure = function(value) {
  jspb.Message.setOneofWrapperField(this, 4, proto.xudrpc.PlaceOrderEvent.oneofGroups_[0], value);
};


proto.xudrpc.PlaceOrderEvent.prototype.clearSwapFailure = function() {
  this.setSwapFailure(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.xudrpc.PlaceOrderEvent.prototype.hasSwapFailure = function() {
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
proto.xudrpc.RaidenInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.RaidenInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.RaidenInfo.displayName = 'proto.xudrpc.RaidenInfo';
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
proto.xudrpc.RaidenInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.RaidenInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.RaidenInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RaidenInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    status: jspb.Message.getFieldWithDefault(msg, 1, ""),
    address: jspb.Message.getFieldWithDefault(msg, 2, ""),
    channels: (f = msg.getChannels()) && proto.xudrpc.Channels.toObject(includeInstance, f),
    version: jspb.Message.getFieldWithDefault(msg, 4, ""),
    chain: jspb.Message.getFieldWithDefault(msg, 5, "")
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
 * @return {!proto.xudrpc.RaidenInfo}
 */
proto.xudrpc.RaidenInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.RaidenInfo;
  return proto.xudrpc.RaidenInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.RaidenInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.RaidenInfo}
 */
proto.xudrpc.RaidenInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setStatus(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddress(value);
      break;
    case 3:
      var value = new proto.xudrpc.Channels;
      reader.readMessage(value,proto.xudrpc.Channels.deserializeBinaryFromReader);
      msg.setChannels(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setVersion(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setChain(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.RaidenInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.RaidenInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.RaidenInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RaidenInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStatus();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getAddress();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getChannels();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.xudrpc.Channels.serializeBinaryToWriter
    );
  }
  f = message.getVersion();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getChain();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
};


/**
 * optional string status = 1;
 * @return {string}
 */
proto.xudrpc.RaidenInfo.prototype.getStatus = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.RaidenInfo.prototype.setStatus = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string address = 2;
 * @return {string}
 */
proto.xudrpc.RaidenInfo.prototype.getAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.xudrpc.RaidenInfo.prototype.setAddress = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional Channels channels = 3;
 * @return {?proto.xudrpc.Channels}
 */
proto.xudrpc.RaidenInfo.prototype.getChannels = function() {
  return /** @type{?proto.xudrpc.Channels} */ (
    jspb.Message.getWrapperField(this, proto.xudrpc.Channels, 3));
};


/** @param {?proto.xudrpc.Channels|undefined} value */
proto.xudrpc.RaidenInfo.prototype.setChannels = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.xudrpc.RaidenInfo.prototype.clearChannels = function() {
  this.setChannels(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.xudrpc.RaidenInfo.prototype.hasChannels = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional string version = 4;
 * @return {string}
 */
proto.xudrpc.RaidenInfo.prototype.getVersion = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.xudrpc.RaidenInfo.prototype.setVersion = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string chain = 5;
 * @return {string}
 */
proto.xudrpc.RaidenInfo.prototype.getChain = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.xudrpc.RaidenInfo.prototype.setChain = function(value) {
  jspb.Message.setProto3StringField(this, 5, value);
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
proto.xudrpc.RemoveCurrencyRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.RemoveCurrencyRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.RemoveCurrencyRequest.displayName = 'proto.xudrpc.RemoveCurrencyRequest';
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
proto.xudrpc.RemoveCurrencyRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.RemoveCurrencyRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.RemoveCurrencyRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RemoveCurrencyRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    currency: jspb.Message.getFieldWithDefault(msg, 1, "")
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
 * @return {!proto.xudrpc.RemoveCurrencyRequest}
 */
proto.xudrpc.RemoveCurrencyRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.RemoveCurrencyRequest;
  return proto.xudrpc.RemoveCurrencyRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.RemoveCurrencyRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.RemoveCurrencyRequest}
 */
proto.xudrpc.RemoveCurrencyRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setCurrency(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.RemoveCurrencyRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.RemoveCurrencyRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.RemoveCurrencyRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RemoveCurrencyRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCurrency();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string currency = 1;
 * @return {string}
 */
proto.xudrpc.RemoveCurrencyRequest.prototype.getCurrency = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.RemoveCurrencyRequest.prototype.setCurrency = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
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
proto.xudrpc.RemoveCurrencyResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.RemoveCurrencyResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.RemoveCurrencyResponse.displayName = 'proto.xudrpc.RemoveCurrencyResponse';
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
proto.xudrpc.RemoveCurrencyResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.RemoveCurrencyResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.RemoveCurrencyResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RemoveCurrencyResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.xudrpc.RemoveCurrencyResponse}
 */
proto.xudrpc.RemoveCurrencyResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.RemoveCurrencyResponse;
  return proto.xudrpc.RemoveCurrencyResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.RemoveCurrencyResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.RemoveCurrencyResponse}
 */
proto.xudrpc.RemoveCurrencyResponse.deserializeBinaryFromReader = function(msg, reader) {
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.RemoveCurrencyResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.RemoveCurrencyResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.RemoveCurrencyResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RemoveCurrencyResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.xudrpc.RemoveOrderRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.RemoveOrderRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.RemoveOrderRequest.displayName = 'proto.xudrpc.RemoveOrderRequest';
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
proto.xudrpc.RemoveOrderRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.RemoveOrderRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.RemoveOrderRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RemoveOrderRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    orderId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    quantity: jspb.Message.getFieldWithDefault(msg, 2, 0)
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
 * @return {!proto.xudrpc.RemoveOrderRequest}
 */
proto.xudrpc.RemoveOrderRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.RemoveOrderRequest;
  return proto.xudrpc.RemoveOrderRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.RemoveOrderRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.RemoveOrderRequest}
 */
proto.xudrpc.RemoveOrderRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setOrderId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setQuantity(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.RemoveOrderRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.RemoveOrderRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.RemoveOrderRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RemoveOrderRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOrderId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getQuantity();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
};


/**
 * optional string order_id = 1;
 * @return {string}
 */
proto.xudrpc.RemoveOrderRequest.prototype.getOrderId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.RemoveOrderRequest.prototype.setOrderId = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional uint64 quantity = 2;
 * @return {number}
 */
proto.xudrpc.RemoveOrderRequest.prototype.getQuantity = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.xudrpc.RemoveOrderRequest.prototype.setQuantity = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
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
proto.xudrpc.RemoveOrderResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.RemoveOrderResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.RemoveOrderResponse.displayName = 'proto.xudrpc.RemoveOrderResponse';
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
proto.xudrpc.RemoveOrderResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.RemoveOrderResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.RemoveOrderResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RemoveOrderResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    quantityOnHold: jspb.Message.getFieldWithDefault(msg, 1, 0)
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
 * @return {!proto.xudrpc.RemoveOrderResponse}
 */
proto.xudrpc.RemoveOrderResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.RemoveOrderResponse;
  return proto.xudrpc.RemoveOrderResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.RemoveOrderResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.RemoveOrderResponse}
 */
proto.xudrpc.RemoveOrderResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setQuantityOnHold(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.RemoveOrderResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.RemoveOrderResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.RemoveOrderResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RemoveOrderResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getQuantityOnHold();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
};


/**
 * optional uint64 quantity_on_hold = 1;
 * @return {number}
 */
proto.xudrpc.RemoveOrderResponse.prototype.getQuantityOnHold = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.xudrpc.RemoveOrderResponse.prototype.setQuantityOnHold = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
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
proto.xudrpc.RemovePairRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.RemovePairRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.RemovePairRequest.displayName = 'proto.xudrpc.RemovePairRequest';
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
proto.xudrpc.RemovePairRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.RemovePairRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.RemovePairRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RemovePairRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    pairId: jspb.Message.getFieldWithDefault(msg, 1, "")
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
 * @return {!proto.xudrpc.RemovePairRequest}
 */
proto.xudrpc.RemovePairRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.RemovePairRequest;
  return proto.xudrpc.RemovePairRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.RemovePairRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.RemovePairRequest}
 */
proto.xudrpc.RemovePairRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPairId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.RemovePairRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.RemovePairRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.RemovePairRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RemovePairRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPairId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string pair_id = 1;
 * @return {string}
 */
proto.xudrpc.RemovePairRequest.prototype.getPairId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.RemovePairRequest.prototype.setPairId = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
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
proto.xudrpc.RemovePairResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.RemovePairResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.RemovePairResponse.displayName = 'proto.xudrpc.RemovePairResponse';
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
proto.xudrpc.RemovePairResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.RemovePairResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.RemovePairResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RemovePairResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.xudrpc.RemovePairResponse}
 */
proto.xudrpc.RemovePairResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.RemovePairResponse;
  return proto.xudrpc.RemovePairResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.RemovePairResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.RemovePairResponse}
 */
proto.xudrpc.RemovePairResponse.deserializeBinaryFromReader = function(msg, reader) {
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.RemovePairResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.RemovePairResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.RemovePairResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RemovePairResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.xudrpc.RestoreNodeRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.xudrpc.RestoreNodeRequest.repeatedFields_, null);
};
goog.inherits(proto.xudrpc.RestoreNodeRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.RestoreNodeRequest.displayName = 'proto.xudrpc.RestoreNodeRequest';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.xudrpc.RestoreNodeRequest.repeatedFields_ = [1];



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
proto.xudrpc.RestoreNodeRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.RestoreNodeRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.RestoreNodeRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RestoreNodeRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    seedMnemonicList: jspb.Message.getRepeatedField(msg, 1),
    password: jspb.Message.getFieldWithDefault(msg, 2, ""),
    lndBackupsMap: (f = msg.getLndBackupsMap()) ? f.toObject(includeInstance, undefined) : [],
    raidenDatabase: msg.getRaidenDatabase_asB64(),
    raidenDatabasePath: jspb.Message.getFieldWithDefault(msg, 5, ""),
    xudDatabase: msg.getXudDatabase_asB64()
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
 * @return {!proto.xudrpc.RestoreNodeRequest}
 */
proto.xudrpc.RestoreNodeRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.RestoreNodeRequest;
  return proto.xudrpc.RestoreNodeRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.RestoreNodeRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.RestoreNodeRequest}
 */
proto.xudrpc.RestoreNodeRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.addSeedMnemonic(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setPassword(value);
      break;
    case 3:
      var value = msg.getLndBackupsMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readBytes, null, "");
         });
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setRaidenDatabase(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setRaidenDatabasePath(value);
      break;
    case 6:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setXudDatabase(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.RestoreNodeRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.RestoreNodeRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.RestoreNodeRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RestoreNodeRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSeedMnemonicList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
  f = message.getPassword();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getLndBackupsMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(3, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeBytes);
  }
  f = message.getRaidenDatabase_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      4,
      f
    );
  }
  f = message.getRaidenDatabasePath();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getXudDatabase_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      6,
      f
    );
  }
};


/**
 * repeated string seed_mnemonic = 1;
 * @return {!Array<string>}
 */
proto.xudrpc.RestoreNodeRequest.prototype.getSeedMnemonicList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/** @param {!Array<string>} value */
proto.xudrpc.RestoreNodeRequest.prototype.setSeedMnemonicList = function(value) {
  jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.xudrpc.RestoreNodeRequest.prototype.addSeedMnemonic = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


proto.xudrpc.RestoreNodeRequest.prototype.clearSeedMnemonicList = function() {
  this.setSeedMnemonicList([]);
};


/**
 * optional string password = 2;
 * @return {string}
 */
proto.xudrpc.RestoreNodeRequest.prototype.getPassword = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.xudrpc.RestoreNodeRequest.prototype.setPassword = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * map<string, bytes> lnd_backups = 3;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!(string|Uint8Array)>}
 */
proto.xudrpc.RestoreNodeRequest.prototype.getLndBackupsMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!(string|Uint8Array)>} */ (
      jspb.Message.getMapField(this, 3, opt_noLazyCreate,
      null));
};


proto.xudrpc.RestoreNodeRequest.prototype.clearLndBackupsMap = function() {
  this.getLndBackupsMap().clear();
};


/**
 * optional bytes raiden_database = 4;
 * @return {!(string|Uint8Array)}
 */
proto.xudrpc.RestoreNodeRequest.prototype.getRaidenDatabase = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * optional bytes raiden_database = 4;
 * This is a type-conversion wrapper around `getRaidenDatabase()`
 * @return {string}
 */
proto.xudrpc.RestoreNodeRequest.prototype.getRaidenDatabase_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getRaidenDatabase()));
};


/**
 * optional bytes raiden_database = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getRaidenDatabase()`
 * @return {!Uint8Array}
 */
proto.xudrpc.RestoreNodeRequest.prototype.getRaidenDatabase_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getRaidenDatabase()));
};


/** @param {!(string|Uint8Array)} value */
proto.xudrpc.RestoreNodeRequest.prototype.setRaidenDatabase = function(value) {
  jspb.Message.setProto3BytesField(this, 4, value);
};


/**
 * optional string raiden_database_path = 5;
 * @return {string}
 */
proto.xudrpc.RestoreNodeRequest.prototype.getRaidenDatabasePath = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.xudrpc.RestoreNodeRequest.prototype.setRaidenDatabasePath = function(value) {
  jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional bytes xud_database = 6;
 * @return {!(string|Uint8Array)}
 */
proto.xudrpc.RestoreNodeRequest.prototype.getXudDatabase = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * optional bytes xud_database = 6;
 * This is a type-conversion wrapper around `getXudDatabase()`
 * @return {string}
 */
proto.xudrpc.RestoreNodeRequest.prototype.getXudDatabase_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getXudDatabase()));
};


/**
 * optional bytes xud_database = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getXudDatabase()`
 * @return {!Uint8Array}
 */
proto.xudrpc.RestoreNodeRequest.prototype.getXudDatabase_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getXudDatabase()));
};


/** @param {!(string|Uint8Array)} value */
proto.xudrpc.RestoreNodeRequest.prototype.setXudDatabase = function(value) {
  jspb.Message.setProto3BytesField(this, 6, value);
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
proto.xudrpc.RestoreNodeResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.xudrpc.RestoreNodeResponse.repeatedFields_, null);
};
goog.inherits(proto.xudrpc.RestoreNodeResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.RestoreNodeResponse.displayName = 'proto.xudrpc.RestoreNodeResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.xudrpc.RestoreNodeResponse.repeatedFields_ = [1];



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
proto.xudrpc.RestoreNodeResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.RestoreNodeResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.RestoreNodeResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RestoreNodeResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    restoredLndsList: jspb.Message.getRepeatedField(msg, 1),
    restoredRaiden: jspb.Message.getFieldWithDefault(msg, 2, false)
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
 * @return {!proto.xudrpc.RestoreNodeResponse}
 */
proto.xudrpc.RestoreNodeResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.RestoreNodeResponse;
  return proto.xudrpc.RestoreNodeResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.RestoreNodeResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.RestoreNodeResponse}
 */
proto.xudrpc.RestoreNodeResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.addRestoredLnds(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setRestoredRaiden(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.RestoreNodeResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.RestoreNodeResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.RestoreNodeResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.RestoreNodeResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRestoredLndsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
  f = message.getRestoredRaiden();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * repeated string restored_lnds = 1;
 * @return {!Array<string>}
 */
proto.xudrpc.RestoreNodeResponse.prototype.getRestoredLndsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/** @param {!Array<string>} value */
proto.xudrpc.RestoreNodeResponse.prototype.setRestoredLndsList = function(value) {
  jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.xudrpc.RestoreNodeResponse.prototype.addRestoredLnds = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


proto.xudrpc.RestoreNodeResponse.prototype.clearRestoredLndsList = function() {
  this.setRestoredLndsList([]);
};


/**
 * optional bool restored_raiden = 2;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.xudrpc.RestoreNodeResponse.prototype.getRestoredRaiden = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 2, false));
};


/** @param {boolean} value */
proto.xudrpc.RestoreNodeResponse.prototype.setRestoredRaiden = function(value) {
  jspb.Message.setProto3BooleanField(this, 2, value);
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
proto.xudrpc.ShutdownRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.ShutdownRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.ShutdownRequest.displayName = 'proto.xudrpc.ShutdownRequest';
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
proto.xudrpc.ShutdownRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.ShutdownRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.ShutdownRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ShutdownRequest.toObject = function(includeInstance, msg) {
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
 * @return {!proto.xudrpc.ShutdownRequest}
 */
proto.xudrpc.ShutdownRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.ShutdownRequest;
  return proto.xudrpc.ShutdownRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.ShutdownRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.ShutdownRequest}
 */
proto.xudrpc.ShutdownRequest.deserializeBinaryFromReader = function(msg, reader) {
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.ShutdownRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.ShutdownRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.ShutdownRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ShutdownRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.xudrpc.ShutdownResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.ShutdownResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.ShutdownResponse.displayName = 'proto.xudrpc.ShutdownResponse';
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
proto.xudrpc.ShutdownResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.ShutdownResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.ShutdownResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ShutdownResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.xudrpc.ShutdownResponse}
 */
proto.xudrpc.ShutdownResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.ShutdownResponse;
  return proto.xudrpc.ShutdownResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.ShutdownResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.ShutdownResponse}
 */
proto.xudrpc.ShutdownResponse.deserializeBinaryFromReader = function(msg, reader) {
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.ShutdownResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.ShutdownResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.ShutdownResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.ShutdownResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.xudrpc.SubscribeOrdersRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.SubscribeOrdersRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.SubscribeOrdersRequest.displayName = 'proto.xudrpc.SubscribeOrdersRequest';
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
proto.xudrpc.SubscribeOrdersRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.SubscribeOrdersRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.SubscribeOrdersRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.SubscribeOrdersRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    existing: jspb.Message.getFieldWithDefault(msg, 1, false)
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
 * @return {!proto.xudrpc.SubscribeOrdersRequest}
 */
proto.xudrpc.SubscribeOrdersRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.SubscribeOrdersRequest;
  return proto.xudrpc.SubscribeOrdersRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.SubscribeOrdersRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.SubscribeOrdersRequest}
 */
proto.xudrpc.SubscribeOrdersRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setExisting(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.SubscribeOrdersRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.SubscribeOrdersRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.SubscribeOrdersRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.SubscribeOrdersRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getExisting();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool existing = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.xudrpc.SubscribeOrdersRequest.prototype.getExisting = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 1, false));
};


/** @param {boolean} value */
proto.xudrpc.SubscribeOrdersRequest.prototype.setExisting = function(value) {
  jspb.Message.setProto3BooleanField(this, 1, value);
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
proto.xudrpc.SubscribeSwapsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.SubscribeSwapsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.SubscribeSwapsRequest.displayName = 'proto.xudrpc.SubscribeSwapsRequest';
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
proto.xudrpc.SubscribeSwapsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.SubscribeSwapsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.SubscribeSwapsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.SubscribeSwapsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    includeTaker: jspb.Message.getFieldWithDefault(msg, 1, false)
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
 * @return {!proto.xudrpc.SubscribeSwapsRequest}
 */
proto.xudrpc.SubscribeSwapsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.SubscribeSwapsRequest;
  return proto.xudrpc.SubscribeSwapsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.SubscribeSwapsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.SubscribeSwapsRequest}
 */
proto.xudrpc.SubscribeSwapsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIncludeTaker(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.SubscribeSwapsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.SubscribeSwapsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.SubscribeSwapsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.SubscribeSwapsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getIncludeTaker();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool include_taker = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.xudrpc.SubscribeSwapsRequest.prototype.getIncludeTaker = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 1, false));
};


/** @param {boolean} value */
proto.xudrpc.SubscribeSwapsRequest.prototype.setIncludeTaker = function(value) {
  jspb.Message.setProto3BooleanField(this, 1, value);
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
proto.xudrpc.SwapFailure = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.SwapFailure, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.SwapFailure.displayName = 'proto.xudrpc.SwapFailure';
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
proto.xudrpc.SwapFailure.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.SwapFailure.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.SwapFailure} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.SwapFailure.toObject = function(includeInstance, msg) {
  var f, obj = {
    orderId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    pairId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    quantity: jspb.Message.getFieldWithDefault(msg, 3, 0),
    peerPubKey: jspb.Message.getFieldWithDefault(msg, 4, ""),
    failureReason: jspb.Message.getFieldWithDefault(msg, 5, "")
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
 * @return {!proto.xudrpc.SwapFailure}
 */
proto.xudrpc.SwapFailure.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.SwapFailure;
  return proto.xudrpc.SwapFailure.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.SwapFailure} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.SwapFailure}
 */
proto.xudrpc.SwapFailure.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setOrderId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setPairId(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setQuantity(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setPeerPubKey(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setFailureReason(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.SwapFailure.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.SwapFailure.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.SwapFailure} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.SwapFailure.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOrderId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPairId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getQuantity();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = message.getPeerPubKey();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getFailureReason();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
};


/**
 * optional string order_id = 1;
 * @return {string}
 */
proto.xudrpc.SwapFailure.prototype.getOrderId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.SwapFailure.prototype.setOrderId = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string pair_id = 2;
 * @return {string}
 */
proto.xudrpc.SwapFailure.prototype.getPairId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.xudrpc.SwapFailure.prototype.setPairId = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional uint64 quantity = 3;
 * @return {number}
 */
proto.xudrpc.SwapFailure.prototype.getQuantity = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.xudrpc.SwapFailure.prototype.setQuantity = function(value) {
  jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional string peer_pub_key = 4;
 * @return {string}
 */
proto.xudrpc.SwapFailure.prototype.getPeerPubKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.xudrpc.SwapFailure.prototype.setPeerPubKey = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string failure_reason = 5;
 * @return {string}
 */
proto.xudrpc.SwapFailure.prototype.getFailureReason = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.xudrpc.SwapFailure.prototype.setFailureReason = function(value) {
  jspb.Message.setProto3StringField(this, 5, value);
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
proto.xudrpc.SwapSuccess = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.SwapSuccess, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.SwapSuccess.displayName = 'proto.xudrpc.SwapSuccess';
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
proto.xudrpc.SwapSuccess.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.SwapSuccess.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.SwapSuccess} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.SwapSuccess.toObject = function(includeInstance, msg) {
  var f, obj = {
    orderId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    localId: jspb.Message.getFieldWithDefault(msg, 2, ""),
    pairId: jspb.Message.getFieldWithDefault(msg, 3, ""),
    quantity: jspb.Message.getFieldWithDefault(msg, 4, 0),
    rHash: jspb.Message.getFieldWithDefault(msg, 5, ""),
    amountReceived: jspb.Message.getFieldWithDefault(msg, 8, 0),
    amountSent: jspb.Message.getFieldWithDefault(msg, 9, 0),
    peerPubKey: jspb.Message.getFieldWithDefault(msg, 10, ""),
    role: jspb.Message.getFieldWithDefault(msg, 11, 0),
    currencyReceived: jspb.Message.getFieldWithDefault(msg, 12, ""),
    currencySent: jspb.Message.getFieldWithDefault(msg, 13, ""),
    rPreimage: jspb.Message.getFieldWithDefault(msg, 14, ""),
    price: +jspb.Message.getFieldWithDefault(msg, 15, 0.0)
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
 * @return {!proto.xudrpc.SwapSuccess}
 */
proto.xudrpc.SwapSuccess.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.SwapSuccess;
  return proto.xudrpc.SwapSuccess.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.SwapSuccess} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.SwapSuccess}
 */
proto.xudrpc.SwapSuccess.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setOrderId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setLocalId(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setPairId(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setQuantity(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setRHash(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setAmountReceived(value);
      break;
    case 9:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setAmountSent(value);
      break;
    case 10:
      var value = /** @type {string} */ (reader.readString());
      msg.setPeerPubKey(value);
      break;
    case 11:
      var value = /** @type {!proto.xudrpc.SwapSuccess.Role} */ (reader.readEnum());
      msg.setRole(value);
      break;
    case 12:
      var value = /** @type {string} */ (reader.readString());
      msg.setCurrencyReceived(value);
      break;
    case 13:
      var value = /** @type {string} */ (reader.readString());
      msg.setCurrencySent(value);
      break;
    case 14:
      var value = /** @type {string} */ (reader.readString());
      msg.setRPreimage(value);
      break;
    case 15:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setPrice(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.SwapSuccess.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.SwapSuccess.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.SwapSuccess} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.SwapSuccess.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOrderId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getLocalId();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getPairId();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getQuantity();
  if (f !== 0) {
    writer.writeUint64(
      4,
      f
    );
  }
  f = message.getRHash();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getAmountReceived();
  if (f !== 0) {
    writer.writeUint64(
      8,
      f
    );
  }
  f = message.getAmountSent();
  if (f !== 0) {
    writer.writeUint64(
      9,
      f
    );
  }
  f = message.getPeerPubKey();
  if (f.length > 0) {
    writer.writeString(
      10,
      f
    );
  }
  f = message.getRole();
  if (f !== 0.0) {
    writer.writeEnum(
      11,
      f
    );
  }
  f = message.getCurrencyReceived();
  if (f.length > 0) {
    writer.writeString(
      12,
      f
    );
  }
  f = message.getCurrencySent();
  if (f.length > 0) {
    writer.writeString(
      13,
      f
    );
  }
  f = message.getRPreimage();
  if (f.length > 0) {
    writer.writeString(
      14,
      f
    );
  }
  f = message.getPrice();
  if (f !== 0.0) {
    writer.writeDouble(
      15,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.xudrpc.SwapSuccess.Role = {
  TAKER: 0,
  MAKER: 1
};

/**
 * optional string order_id = 1;
 * @return {string}
 */
proto.xudrpc.SwapSuccess.prototype.getOrderId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.SwapSuccess.prototype.setOrderId = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string local_id = 2;
 * @return {string}
 */
proto.xudrpc.SwapSuccess.prototype.getLocalId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.xudrpc.SwapSuccess.prototype.setLocalId = function(value) {
  jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string pair_id = 3;
 * @return {string}
 */
proto.xudrpc.SwapSuccess.prototype.getPairId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.xudrpc.SwapSuccess.prototype.setPairId = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional uint64 quantity = 4;
 * @return {number}
 */
proto.xudrpc.SwapSuccess.prototype.getQuantity = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.xudrpc.SwapSuccess.prototype.setQuantity = function(value) {
  jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional string r_hash = 5;
 * @return {string}
 */
proto.xudrpc.SwapSuccess.prototype.getRHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.xudrpc.SwapSuccess.prototype.setRHash = function(value) {
  jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional uint64 amount_received = 8;
 * @return {number}
 */
proto.xudrpc.SwapSuccess.prototype.getAmountReceived = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/** @param {number} value */
proto.xudrpc.SwapSuccess.prototype.setAmountReceived = function(value) {
  jspb.Message.setProto3IntField(this, 8, value);
};


/**
 * optional uint64 amount_sent = 9;
 * @return {number}
 */
proto.xudrpc.SwapSuccess.prototype.getAmountSent = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 9, 0));
};


/** @param {number} value */
proto.xudrpc.SwapSuccess.prototype.setAmountSent = function(value) {
  jspb.Message.setProto3IntField(this, 9, value);
};


/**
 * optional string peer_pub_key = 10;
 * @return {string}
 */
proto.xudrpc.SwapSuccess.prototype.getPeerPubKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 10, ""));
};


/** @param {string} value */
proto.xudrpc.SwapSuccess.prototype.setPeerPubKey = function(value) {
  jspb.Message.setProto3StringField(this, 10, value);
};


/**
 * optional Role role = 11;
 * @return {!proto.xudrpc.SwapSuccess.Role}
 */
proto.xudrpc.SwapSuccess.prototype.getRole = function() {
  return /** @type {!proto.xudrpc.SwapSuccess.Role} */ (jspb.Message.getFieldWithDefault(this, 11, 0));
};


/** @param {!proto.xudrpc.SwapSuccess.Role} value */
proto.xudrpc.SwapSuccess.prototype.setRole = function(value) {
  jspb.Message.setProto3EnumField(this, 11, value);
};


/**
 * optional string currency_received = 12;
 * @return {string}
 */
proto.xudrpc.SwapSuccess.prototype.getCurrencyReceived = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 12, ""));
};


/** @param {string} value */
proto.xudrpc.SwapSuccess.prototype.setCurrencyReceived = function(value) {
  jspb.Message.setProto3StringField(this, 12, value);
};


/**
 * optional string currency_sent = 13;
 * @return {string}
 */
proto.xudrpc.SwapSuccess.prototype.getCurrencySent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 13, ""));
};


/** @param {string} value */
proto.xudrpc.SwapSuccess.prototype.setCurrencySent = function(value) {
  jspb.Message.setProto3StringField(this, 13, value);
};


/**
 * optional string r_preimage = 14;
 * @return {string}
 */
proto.xudrpc.SwapSuccess.prototype.getRPreimage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 14, ""));
};


/** @param {string} value */
proto.xudrpc.SwapSuccess.prototype.setRPreimage = function(value) {
  jspb.Message.setProto3StringField(this, 14, value);
};


/**
 * optional double price = 15;
 * @return {number}
 */
proto.xudrpc.SwapSuccess.prototype.getPrice = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 15, 0.0));
};


/** @param {number} value */
proto.xudrpc.SwapSuccess.prototype.setPrice = function(value) {
  jspb.Message.setProto3FloatField(this, 15, value);
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
proto.xudrpc.TradingLimits = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.TradingLimits, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.TradingLimits.displayName = 'proto.xudrpc.TradingLimits';
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
proto.xudrpc.TradingLimits.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.TradingLimits.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.TradingLimits} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.TradingLimits.toObject = function(includeInstance, msg) {
  var f, obj = {
    maxsell: jspb.Message.getFieldWithDefault(msg, 1, 0),
    maxbuy: jspb.Message.getFieldWithDefault(msg, 2, 0)
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
 * @return {!proto.xudrpc.TradingLimits}
 */
proto.xudrpc.TradingLimits.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.TradingLimits;
  return proto.xudrpc.TradingLimits.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.TradingLimits} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.TradingLimits}
 */
proto.xudrpc.TradingLimits.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setMaxsell(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setMaxbuy(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.TradingLimits.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.TradingLimits.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.TradingLimits} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.TradingLimits.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMaxsell();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getMaxbuy();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
};


/**
 * optional uint64 MaxSell = 1;
 * @return {number}
 */
proto.xudrpc.TradingLimits.prototype.getMaxsell = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.xudrpc.TradingLimits.prototype.setMaxsell = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional uint64 MaxBuy = 2;
 * @return {number}
 */
proto.xudrpc.TradingLimits.prototype.getMaxbuy = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.xudrpc.TradingLimits.prototype.setMaxbuy = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
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
proto.xudrpc.Trade = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.Trade, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.Trade.displayName = 'proto.xudrpc.Trade';
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
proto.xudrpc.Trade.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.Trade.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.Trade} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Trade.toObject = function(includeInstance, msg) {
  var f, obj = {
    makerOrder: (f = msg.getMakerOrder()) && proto.xudrpc.Order.toObject(includeInstance, f),
    takerOrder: (f = msg.getTakerOrder()) && proto.xudrpc.Order.toObject(includeInstance, f),
    rHash: jspb.Message.getFieldWithDefault(msg, 3, ""),
    quantity: jspb.Message.getFieldWithDefault(msg, 4, 0),
    pairId: jspb.Message.getFieldWithDefault(msg, 5, "")
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
 * @return {!proto.xudrpc.Trade}
 */
proto.xudrpc.Trade.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.Trade;
  return proto.xudrpc.Trade.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.Trade} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.Trade}
 */
proto.xudrpc.Trade.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.xudrpc.Order;
      reader.readMessage(value,proto.xudrpc.Order.deserializeBinaryFromReader);
      msg.setMakerOrder(value);
      break;
    case 2:
      var value = new proto.xudrpc.Order;
      reader.readMessage(value,proto.xudrpc.Order.deserializeBinaryFromReader);
      msg.setTakerOrder(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setRHash(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setQuantity(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setPairId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.Trade.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.Trade.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.Trade} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.Trade.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMakerOrder();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.xudrpc.Order.serializeBinaryToWriter
    );
  }
  f = message.getTakerOrder();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.xudrpc.Order.serializeBinaryToWriter
    );
  }
  f = message.getRHash();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getQuantity();
  if (f !== 0) {
    writer.writeInt64(
      4,
      f
    );
  }
  f = message.getPairId();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
};


/**
 * optional Order maker_order = 1;
 * @return {?proto.xudrpc.Order}
 */
proto.xudrpc.Trade.prototype.getMakerOrder = function() {
  return /** @type{?proto.xudrpc.Order} */ (
    jspb.Message.getWrapperField(this, proto.xudrpc.Order, 1));
};


/** @param {?proto.xudrpc.Order|undefined} value */
proto.xudrpc.Trade.prototype.setMakerOrder = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.xudrpc.Trade.prototype.clearMakerOrder = function() {
  this.setMakerOrder(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.xudrpc.Trade.prototype.hasMakerOrder = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional Order taker_order = 2;
 * @return {?proto.xudrpc.Order}
 */
proto.xudrpc.Trade.prototype.getTakerOrder = function() {
  return /** @type{?proto.xudrpc.Order} */ (
    jspb.Message.getWrapperField(this, proto.xudrpc.Order, 2));
};


/** @param {?proto.xudrpc.Order|undefined} value */
proto.xudrpc.Trade.prototype.setTakerOrder = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.xudrpc.Trade.prototype.clearTakerOrder = function() {
  this.setTakerOrder(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.xudrpc.Trade.prototype.hasTakerOrder = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string r_hash = 3;
 * @return {string}
 */
proto.xudrpc.Trade.prototype.getRHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.xudrpc.Trade.prototype.setRHash = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional int64 quantity = 4;
 * @return {number}
 */
proto.xudrpc.Trade.prototype.getQuantity = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/** @param {number} value */
proto.xudrpc.Trade.prototype.setQuantity = function(value) {
  jspb.Message.setProto3IntField(this, 4, value);
};


/**
 * optional string pair_id = 5;
 * @return {string}
 */
proto.xudrpc.Trade.prototype.getPairId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.xudrpc.Trade.prototype.setPairId = function(value) {
  jspb.Message.setProto3StringField(this, 5, value);
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
proto.xudrpc.TradingLimitsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.TradingLimitsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.TradingLimitsRequest.displayName = 'proto.xudrpc.TradingLimitsRequest';
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
proto.xudrpc.TradingLimitsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.TradingLimitsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.TradingLimitsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.TradingLimitsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    currency: jspb.Message.getFieldWithDefault(msg, 1, "")
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
 * @return {!proto.xudrpc.TradingLimitsRequest}
 */
proto.xudrpc.TradingLimitsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.TradingLimitsRequest;
  return proto.xudrpc.TradingLimitsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.TradingLimitsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.TradingLimitsRequest}
 */
proto.xudrpc.TradingLimitsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setCurrency(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.TradingLimitsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.TradingLimitsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.TradingLimitsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.TradingLimitsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCurrency();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string currency = 1;
 * @return {string}
 */
proto.xudrpc.TradingLimitsRequest.prototype.getCurrency = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.TradingLimitsRequest.prototype.setCurrency = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
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
proto.xudrpc.TradingLimitsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.TradingLimitsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.TradingLimitsResponse.displayName = 'proto.xudrpc.TradingLimitsResponse';
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
proto.xudrpc.TradingLimitsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.TradingLimitsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.TradingLimitsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.TradingLimitsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    limitsMap: (f = msg.getLimitsMap()) ? f.toObject(includeInstance, proto.xudrpc.TradingLimits.toObject) : []
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
 * @return {!proto.xudrpc.TradingLimitsResponse}
 */
proto.xudrpc.TradingLimitsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.TradingLimitsResponse;
  return proto.xudrpc.TradingLimitsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.TradingLimitsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.TradingLimitsResponse}
 */
proto.xudrpc.TradingLimitsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = msg.getLimitsMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readString, jspb.BinaryReader.prototype.readMessage, proto.xudrpc.TradingLimits.deserializeBinaryFromReader, "");
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.TradingLimitsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.TradingLimitsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.TradingLimitsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.TradingLimitsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLimitsMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(1, writer, jspb.BinaryWriter.prototype.writeString, jspb.BinaryWriter.prototype.writeMessage, proto.xudrpc.TradingLimits.serializeBinaryToWriter);
  }
};


/**
 * map<string, TradingLimits> limits = 1;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<string,!proto.xudrpc.TradingLimits>}
 */
proto.xudrpc.TradingLimitsResponse.prototype.getLimitsMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<string,!proto.xudrpc.TradingLimits>} */ (
      jspb.Message.getMapField(this, 1, opt_noLazyCreate,
      proto.xudrpc.TradingLimits));
};


proto.xudrpc.TradingLimitsResponse.prototype.clearLimitsMap = function() {
  this.getLimitsMap().clear();
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
proto.xudrpc.UnbanRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.UnbanRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.UnbanRequest.displayName = 'proto.xudrpc.UnbanRequest';
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
proto.xudrpc.UnbanRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.UnbanRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.UnbanRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.UnbanRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    nodeIdentifier: jspb.Message.getFieldWithDefault(msg, 1, ""),
    reconnect: jspb.Message.getFieldWithDefault(msg, 2, false)
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
 * @return {!proto.xudrpc.UnbanRequest}
 */
proto.xudrpc.UnbanRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.UnbanRequest;
  return proto.xudrpc.UnbanRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.UnbanRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.UnbanRequest}
 */
proto.xudrpc.UnbanRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setNodeIdentifier(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setReconnect(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.UnbanRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.UnbanRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.UnbanRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.UnbanRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getNodeIdentifier();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getReconnect();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * optional string node_identifier = 1;
 * @return {string}
 */
proto.xudrpc.UnbanRequest.prototype.getNodeIdentifier = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.UnbanRequest.prototype.setNodeIdentifier = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bool reconnect = 2;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.xudrpc.UnbanRequest.prototype.getReconnect = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 2, false));
};


/** @param {boolean} value */
proto.xudrpc.UnbanRequest.prototype.setReconnect = function(value) {
  jspb.Message.setProto3BooleanField(this, 2, value);
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
proto.xudrpc.UnbanResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.UnbanResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.UnbanResponse.displayName = 'proto.xudrpc.UnbanResponse';
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
proto.xudrpc.UnbanResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.UnbanResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.UnbanResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.UnbanResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.xudrpc.UnbanResponse}
 */
proto.xudrpc.UnbanResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.UnbanResponse;
  return proto.xudrpc.UnbanResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.UnbanResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.UnbanResponse}
 */
proto.xudrpc.UnbanResponse.deserializeBinaryFromReader = function(msg, reader) {
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
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.UnbanResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.UnbanResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.UnbanResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.UnbanResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
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
proto.xudrpc.UnlockNodeRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.xudrpc.UnlockNodeRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.UnlockNodeRequest.displayName = 'proto.xudrpc.UnlockNodeRequest';
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
proto.xudrpc.UnlockNodeRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.UnlockNodeRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.UnlockNodeRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.UnlockNodeRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    password: jspb.Message.getFieldWithDefault(msg, 1, "")
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
 * @return {!proto.xudrpc.UnlockNodeRequest}
 */
proto.xudrpc.UnlockNodeRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.UnlockNodeRequest;
  return proto.xudrpc.UnlockNodeRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.UnlockNodeRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.UnlockNodeRequest}
 */
proto.xudrpc.UnlockNodeRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setPassword(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.UnlockNodeRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.UnlockNodeRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.UnlockNodeRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.UnlockNodeRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPassword();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string password = 1;
 * @return {string}
 */
proto.xudrpc.UnlockNodeRequest.prototype.getPassword = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/** @param {string} value */
proto.xudrpc.UnlockNodeRequest.prototype.setPassword = function(value) {
  jspb.Message.setProto3StringField(this, 1, value);
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
proto.xudrpc.UnlockNodeResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.xudrpc.UnlockNodeResponse.repeatedFields_, null);
};
goog.inherits(proto.xudrpc.UnlockNodeResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.xudrpc.UnlockNodeResponse.displayName = 'proto.xudrpc.UnlockNodeResponse';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.xudrpc.UnlockNodeResponse.repeatedFields_ = [1,3];



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
proto.xudrpc.UnlockNodeResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.xudrpc.UnlockNodeResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.xudrpc.UnlockNodeResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.UnlockNodeResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    unlockedLndsList: jspb.Message.getRepeatedField(msg, 1),
    unlockedRaiden: jspb.Message.getFieldWithDefault(msg, 2, false),
    lockedLndsList: jspb.Message.getRepeatedField(msg, 3)
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
 * @return {!proto.xudrpc.UnlockNodeResponse}
 */
proto.xudrpc.UnlockNodeResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.xudrpc.UnlockNodeResponse;
  return proto.xudrpc.UnlockNodeResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.xudrpc.UnlockNodeResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.xudrpc.UnlockNodeResponse}
 */
proto.xudrpc.UnlockNodeResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.addUnlockedLnds(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setUnlockedRaiden(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.addLockedLnds(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.xudrpc.UnlockNodeResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.xudrpc.UnlockNodeResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.xudrpc.UnlockNodeResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.xudrpc.UnlockNodeResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUnlockedLndsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
  f = message.getUnlockedRaiden();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
  f = message.getLockedLndsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      3,
      f
    );
  }
};


/**
 * repeated string unlocked_lnds = 1;
 * @return {!Array<string>}
 */
proto.xudrpc.UnlockNodeResponse.prototype.getUnlockedLndsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/** @param {!Array<string>} value */
proto.xudrpc.UnlockNodeResponse.prototype.setUnlockedLndsList = function(value) {
  jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.xudrpc.UnlockNodeResponse.prototype.addUnlockedLnds = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


proto.xudrpc.UnlockNodeResponse.prototype.clearUnlockedLndsList = function() {
  this.setUnlockedLndsList([]);
};


/**
 * optional bool unlocked_raiden = 2;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.xudrpc.UnlockNodeResponse.prototype.getUnlockedRaiden = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 2, false));
};


/** @param {boolean} value */
proto.xudrpc.UnlockNodeResponse.prototype.setUnlockedRaiden = function(value) {
  jspb.Message.setProto3BooleanField(this, 2, value);
};


/**
 * repeated string locked_lnds = 3;
 * @return {!Array<string>}
 */
proto.xudrpc.UnlockNodeResponse.prototype.getLockedLndsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 3));
};


/** @param {!Array<string>} value */
proto.xudrpc.UnlockNodeResponse.prototype.setLockedLndsList = function(value) {
  jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 */
proto.xudrpc.UnlockNodeResponse.prototype.addLockedLnds = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


proto.xudrpc.UnlockNodeResponse.prototype.clearLockedLndsList = function() {
  this.setLockedLndsList([]);
};


/**
 * @enum {number}
 */
proto.xudrpc.OrderSide = {
  BUY: 0,
  SELL: 1
};

goog.object.extend(exports, proto.xudrpc);
