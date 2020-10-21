// Copyright 2018 The Exchange Union Developers

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

syntax = "proto3";

import "annotations.proto";

package xudrpc;

/* A service for interacting with a locked or uninitalized xud node. */
service XudInit {
  /* Creates an xud identity node key and underlying wallets. The node key and
   * wallets are derived from a single seed and encrypted using a single
   * password provided as a parameter to the call. 
   * shell: xucli create */
  rpc CreateNode(CreateNodeRequest) returns (CreateNodeResponse) { }

  /* Restores an xud instance and underlying wallets from a seed.
   * shell: xucli restore [backup_directory] */
  rpc RestoreNode(RestoreNodeRequest) returns (RestoreNodeResponse) { }

  /* Unlocks and decrypts the xud node key and any underlying wallets.
   * shell: xucli unlock */
  rpc UnlockNode(UnlockNodeRequest) returns (UnlockNodeResponse) { }
}

/* The primary service for interacting with a running xud node. */
service Xud {
  /* Adds a currency to the list of supported currencies. Once added, the currency may be used for
   * new trading pairs.
   * shell: xucli addcurrency <currency> <swap_client> [decimal_places] [token_address] */
  rpc AddCurrency(Currency) returns (AddCurrencyResponse) {
    option (google.api.http) = {
      post: "/v1/addcurrency"
      body: "*"
    };
  }

  /* Adds a trading pair to the list of supported trading pairs. The newly supported pair is
   * advertised to peers so they may begin sending orders for it.
   * shell: xucli addpair <base_currency> <quote_currency> */
  rpc AddPair(AddPairRequest) returns (AddPairResponse) {
    option (google.api.http) = {
      post: "/v1/addpair"
      body: "*"
    };
  }

  /* Bans a node and immediately disconnects from it. This can be used to prevent any connections
   * to a specific node.
   * shell: xucli ban <node_identifier> */
  rpc Ban(BanRequest) returns (BanResponse) {
    option (google.api.http) = {
      post: "/v1/ban"
      body: "*"
    };
  }

  /* Closes any existing payment channels with a peer for the specified currency.
   * shell: xucli closechannel <currency> [node_identifier ] [--force]*/
  rpc CloseChannel(CloseChannelRequest) returns (CloseChannelResponse) {
    option (google.api.http) = {
      post: "/v1/closechannel"
    };
  }

  /* Attempts to connect to a node. Once connected, the node is added to the list of peers and
   * becomes available for swaps and trading. A handshake exchanges information about the peer's
   * supported trading and swap clients. Orders will be shared with the peer upon connection and
   * upon new order placements.
   * shell: xucli connect <node_uri> */
  rpc Connect(ConnectRequest) returns (ConnectResponse) {
    option (google.api.http) = {
      post: "/v1/connect"
      body: "*"
    };
  }

  /* Gets an address to deposit a given currency into the xud wallets.
   * shell: xucli walletdeposit <currency> */
  rpc WalletDeposit(DepositRequest) returns (DepositResponse) {
    option (google.api.http) = {
      post: "/v1/walletdeposit"
      body: "*"
    };
  }

  /* Discover nodes from a specific peer and apply new connections */
  rpc DiscoverNodes(DiscoverNodesRequest) returns (DiscoverNodesResponse) {
      option (google.api.http) = {
      post: "/v1/discovernodes"
      body: "*"
    };
  }

  /* Gets the total balance available across all payment channels and wallets for one or all currencies.
   * shell: xucli getbalance [currency] */
  rpc GetBalance(GetBalanceRequest) returns (GetBalanceResponse) {
    option (google.api.http) = {
      get: "/v1/balance"
    };
  }

  /* Gets general information about this node.
   * shell: xucli getinfo */
  rpc GetInfo(GetInfoRequest) returns (GetInfoResponse) {
    option (google.api.http) = {
      get: "/v1/info"
    };
  }

  /* Gets general information about a node.
   * shell: xucli getnodeinfo <node_identifier> */
  rpc GetNodeInfo(GetNodeInfoRequest) returns (GetNodeInfoResponse) {
    option (google.api.http) = {
      get: "/v1/nodeinfo"
    };
  }

  /* Gets orders from the order book. This call returns the state of the order book at a given point
   * in time, although it is not guaranteed to still be vaild by the time a response is received
   * and processed by a client. It accepts an optional trading pair id parameter. If specified, only
   * orders for that particular trading pair are returned. Otherwise, all orders are returned. Orders
   * are separated into buys and sells for each trading pair, but unsorted.
   * shell: xucli listorders [pair_id] [include_own_orders] [limit] */
  rpc ListOrders(ListOrdersRequest) returns (ListOrdersResponse) {
    option (google.api.http) = {
      get: "/v1/orders"
    };
  }

  /* Gets a list of this node's supported currencies.
   * shell: xucli listcurrencies */
  rpc ListCurrencies(ListCurrenciesRequest) returns (ListCurrenciesResponse) {
    option (google.api.http) = {
      get: "/v1/currencies"
    };
  }

  /* Gets a list of this nodes suported trading pairs.
   * shell: xucli listpairs */
  rpc ListPairs(ListPairsRequest) returns (ListPairsResponse) {
    option (google.api.http) = {
      get: "/v1/pairs"
    };
  }

  /* Gets a list of connected peers.
   * shell: xucli listpeers */
  rpc ListPeers(ListPeersRequest) returns (ListPeersResponse) {
    option (google.api.http) = {
      get: "/v1/peers"
    };
  }

  /* Opens a payment channel to a peer for the specified amount and currency.
   * shell: xucli openchannel <currency> <amount> [node_identifier] [push_amount] */
  rpc OpenChannel(OpenChannelRequest) returns (OpenChannelResponse) {
    option (google.api.http) = {
      post: "/v1/openchannel"
    };
  }

  /* Adds an order to the order book.
   * If price is zero or unspecified a market order will get added. */
  rpc PlaceOrder(PlaceOrderRequest) returns (stream PlaceOrderEvent) {
    option (google.api.http) = {
      post: "/v1/placeorder"
      body: "*"
    };
  }

  /* The synchronous, non-streaming version of PlaceOrder.
   * shell: xucli buy <quantity> <pair_id> <price> [order_id] [stream]
   * shell: xucli sell <quantity> <pair_id> <price> [order_id] [stream] */
  rpc PlaceOrderSync(PlaceOrderRequest) returns (PlaceOrderResponse) {
    option (google.api.http) = {
      post: "/v1/placeordersync"
      body: "*"
    };
  }


  /* Executes a swap on a maker peer order. */
  rpc ExecuteSwap(ExecuteSwapRequest) returns (SwapSuccess) {
    option (google.api.http) = {
      post: "/v1/executeswap"
      body: "*"
    };
  }

  /* Removes a currency from the list of supported currencies. Only currencies that are not in use
   * for any currently supported trading pairs may be removed. Once removed, the currency can no
   * longer be used for any supported trading pairs.
   * shell: xucli removecurrency <currency> */
  rpc RemoveCurrency(RemoveCurrencyRequest) returns (RemoveCurrencyResponse) {
    option (google.api.http) = {
      post: "/v1/removecurrency"
      body: "*"
    };
  }

  /* Removes an order from the order book by its local id. This should be called when an order is
   * canceled or filled outside of xud. Removed orders become immediately unavailable for swaps,
   * and peers are notified that the order is no longer valid. Any portion of the order that is
   * on hold due to ongoing swaps will not be removed until after the swap attempts complete.
   * shell: xucli removeorder <order_id> [quantity] */
   rpc RemoveOrder(RemoveOrderRequest) returns (RemoveOrderResponse) {
    option (google.api.http) = {
      post: "/v1/removeorder"
      body: "*"
    };
  }

  /* Removes all orders from the order book. Removed orders become immediately unavailable for swaps,
   * and peers are notified that the orders are no longer valid. Any portion of the orders that is
   * on hold due to ongoing swaps will not be removed until after the swap attempts complete.
   * shell: xucli removeallorders */
  rpc RemoveAllOrders(RemoveAllOrdersRequest) returns (RemoveAllOrdersResponse) {
    option (google.api.http) = {
      post: "/v1/removeallorders"
      body: "*"
    };
  }

  /* Removes a trading pair from the list of currently supported trading pair. This call will
   * effectively cancel any standing orders for that trading pair. Peers are informed when a pair
   * is no longer supported so that they will know to stop sending orders for it.
   * shell: xucli removepair <pair_id> */
  rpc RemovePair(RemovePairRequest) returns (RemovePairResponse) {
    option (google.api.http) = {
      post: "/v1/removepair"
      body: "*"
    };
  }

  /* Set the logging level.
   * shell: xucli loglevel <level> */
  rpc SetLogLevel(SetLogLevelRequest) returns (SetLogLevelResponse) {
    option (google.api.http) = {
      post: "/v1/setloglevel"
      body: "*"
    };
  }

  /* Begin gracefully shutting down xud.
   * shell: xucli shutdown */
  rpc Shutdown(ShutdownRequest) returns (ShutdownResponse) {
    option (google.api.http) = {
      post: "/v1/shutdown"
      body: "*"
    };
  }

  /* Subscribes to orders being added to and removed from the order book. This call allows the client
   * to maintain an up-to-date view of the order book. For example, an exchange that wants to show
   * its users a real time view of the orders available to them would subscribe to this streaming
   * call to be alerted as new orders are added and expired orders are removed. */
  rpc SubscribeOrders(SubscribeOrdersRequest) returns (stream OrderUpdate) {
    option (google.api.http) = {
      get: "/v1/subscribeorders"
    };
  }

  /* Subscribes to failed swaps. By default, only swaps that are initiated by a remote peer are
   * transmitted unless a flag is set to include swaps initiated by the local node. This call allows
   * the client to get real-time notifications when swap attempts are failing. It can be used for
   * status monitoring, debugging, and testing purposes. */
  rpc SubscribeSwapFailures(SubscribeSwapsRequest) returns (stream SwapFailure) {
    option (google.api.http) = {
      get: "/v1/subscribeswapfailures"
    };
  }

  /* Subscribes to completed swaps. By default, only swaps that are initiated by a remote peer are
   * transmitted unless a flag is set to include swaps initiated by the local node. This call allows
   * the client to get real-time notifications when its orders are filled by a peer. It can be used
   * for tracking order executions, updating balances, and informing a trader when one of their orders
   * is settled through the Exchange Union network. */
  rpc SubscribeSwaps(SubscribeSwapsRequest) returns (stream SwapSuccess) {
    option (google.api.http) = {
      get: "/v1/subscribeswaps"
    };
  }

  /* Subscribes to accepted swaps. This stream emits a message when the local xud node 
   * accepts a swap request from a peer, but before the swap has actually succeeded. */
  rpc SubscribeSwapsAccepted(SubscribeSwapsAcceptedRequest) returns (stream SwapAccepted) {
    option (google.api.http) = {
      get: "/v1/subscribeswapsaccepted"
    };
  }

  /* Gets a list of completed trades.
   * shell: xucli tradehistory [limit] */
  rpc TradeHistory(TradeHistoryRequest) returns (TradeHistoryResponse) {
    option (google.api.http) = {
      post: "/v1/tradehistory"
      body: "*"
    };
  }

  /* Gets the trading limits for one or all currencies.
   * shell: xucli tradinglimits [currency] */
  rpc TradingLimits(TradingLimitsRequest) returns (TradingLimitsResponse) {
      option (google.api.http) = {
      get: "/v1/tradinglimits"
    };
  }

  /* Removes a ban from a node manually and, optionally, attempts to connect to it.
   * shell: xucli unban <node_identifier> [reconnect] */
  rpc Unban(UnbanRequest) returns (UnbanResponse) {
    option (google.api.http) = {
      post: "/v1/unban"
      body: "*"
    };
  }

  /* Withdraws a given currency from the xud wallets to a specified address.
   * shell: xucli withdraw [amount] [currency] <destination> [fee] */
  rpc WalletWithdraw(WithdrawRequest) returns (WithdrawResponse) {
    option (google.api.http) = {
      post: "/v1/walletwithdraw"
      body: "*"
    };
  }
}

enum OrderSide {
  BUY = 0;
  SELL = 1;
  BOTH = 2;
}

enum Role {
  TAKER = 0;
  MAKER = 1;
  INTERNAL = 2;
}

enum LogLevel {
  ALERT = 0;
  ERROR = 1;
  WARN = 2;
  INFO = 3;
  VERBOSE = 4;
  DEBUG = 5;
  TRACE = 6;
}

message AddCurrencyResponse {}

message AddPairRequest {
  // The base currency that is bought and sold for this trading pair.
  string base_currency = 1 [json_name = "base_currency"];
  // The currency used to quote a price for the base currency.
  string quote_currency = 2 [json_name = "quote_currency"];
}
message AddPairResponse {}

message Balance {
  // Total balance denominated in satoshis.
  uint64 total_balance = 1 [json_name = "total_balance"];
  // Sum of confirmed channel balances denominated in satoshis.
  uint64 channel_balance = 2 [json_name = "channel_balance"];
  // Sum of pending channel balances denominated in satoshis.
  uint64 pending_channel_balance = 3 [json_name = "pending_channel_balance"];
  // Sum of inactive channel balances denominated in satoshis.
  uint64 inactive_channel_balance = 4 [json_name = "inactive_channel_balance"];
  // Confirmed wallet balance in satoshis.
  uint64 wallet_balance = 5 [json_name = "wallet_balance"];
  // Unconfirmed wallet balance in satoshis.
  uint64 unconfirmed_wallet_balance = 6 [json_name = "unconfirmed_wallet_balance"];
}

message BanRequest {
  // The node pub key or alias of the node to ban.
  string node_identifier = 1 [json_name = "node_identifier"];
}
message BanResponse {}

message Chain {
  // The blockchain the swap client is on (eg bitcoin, litecoin)
  string chain = 1 [json_name = "chain"];
  // The network the swap client is on (eg regtest, testnet, mainnet)
  string network = 2 [json_name = "network"];
}

message Channels {
  // The number of active/online channels for this lnd instance that can be used for swaps.
  uint32 active = 1 [json_name = "active"];
  // The number of inactive/offline channels for this lnd instance.
  uint32 inactive = 2 [json_name = "inactive"];
  // The number of channels that are pending on-chain confirmation before they can be used.
  uint32 pending = 3 [json_name = "pending"];
  // The number of channels that have been closed.
  uint32 closed = 4 [json_name = "closed"];
}

message CloseChannelRequest {
  // The node pub key or alias of the peer with which to close any channels with.
  string node_identifier = 1 [json_name = "node_identifier"];
  // The ticker symbol of the currency of the channel to close.
  string currency = 2 [json_name = "currency"];
  // Whether to force close the channel in case the peer is offline or unresponsive.
  bool force = 3 [json_name = "force"];
  // The on-chain address to send funds extracted from the channel. If unspecified,
  // the funds return to the default wallet for the client closing the channel.
  string destination = 4 [json_name = "destination"];
  // For Connext only - the amount to extract from the channel. If 0 or unspecified,
  // the entire off-chain balance for the specified currency will be extracted.
  uint64 amount = 5 [json_name = "amount"];
  // A manual fee rate set in sat/byte that should be used when crafting the closure
  // transaction.
  uint64 fee = 6 [json_name = "fee"];
}

message CloseChannelResponse {
  // The id of the transaction per channel close.
  repeated string transaction_ids = 1 [json_name = "transaction_ids"];
}

message ConnectRequest {
  // The uri of the node to connect to in "[nodePubKey]@[host]:[port]" format.
  string node_uri = 1 [json_name = "node_uri"];
}

message ConnectResponse {}

message CreateNodeRequest {
  // The password in utf-8 with which to encrypt the new xud node key as well
  // as any uninitialized underlying wallets.
  string password = 1;
}
message CreateNodeResponse {
  // The 24 word mnemonic to recover the xud identity key and underlying wallets
  repeated string seed_mnemonic = 1;
  // The list of lnd clients that were initialized.
  repeated string initialized_lnds = 2;
  // Whether the connext wallet was initialized.
  bool initialized_connext = 3;
}

message Currency {
  // The ticker symbol for this currency such as BTC, LTC, ETH, etc...
  string currency = 1 [json_name = "currency"];
  enum SwapClient {
    LND = 0;
    CONNEXT = 2;
  }
  // The payment channel network client to use for executing swaps.
  SwapClient swap_client = 2 [json_name = "swap_client"];
  // The contract address for layered tokens such as ERC20.
  string token_address = 3 [json_name = "token_address"];
  // The number of places to the right of the decimal point of the smallest subunit of the currency.
  // For example, BTC, LTC, and others where the smallest subunits (satoshis) are 0.00000001 full
  // units (bitcoins) have 8 decimal places. ETH has 18. This can be thought of as the base 10
  // exponent of the smallest subunit expressed as a positive integer. A default value of 8 is
  // used if unspecified.
  uint32 decimal_places = 4 [json_name = "decimal_places"];
}

message DepositRequest {
  // The ticker symbol of the currency to deposit.
  string currency = 1 [json_name = "currency"];
}
message DepositResponse {
  // The address to use to deposit funds.
  string address = 1 [json_name = "address"];
}

message DiscoverNodesRequest {
  // The node pub key or alias of the peer to discover nodes from.
  string node_identifier = 1 [json_name = "node_identifier"];
}
message DiscoverNodesResponse {
  uint32 num_nodes = 1 [json_name = "num_nodes"];
}

message ExecuteSwapRequest {
  // The order id of the maker order.
  string order_id = 1 [json_name = "order_id"];
  // The trading pair of the swap orders.
  string pair_id = 2 [json_name = "pair_id"];
  // The node pub key of the peer which owns the maker order. This is optional but helps locate the order more quickly.
  string peer_pub_key = 3 [json_name = "peer_pub_key"];
  // The quantity to swap denominated in satoshis. The whole order will be swapped if unspecified.
  uint64 quantity = 4 [json_name = "quantity"];
}

message GetBalanceRequest {
  // The ticker symbol of the currency to query for, if unspecified then balances for all supported
  // currencies are queried.
  string currency = 1 [json_name = "currency"];
}
message GetBalanceResponse {
  // A map between currency ticker symbols and their balances.
  map<string, Balance> balances = 1 [json_name = "balances"];
}

message GetInfoRequest {}
message GetInfoResponse {
  // The version of this instance of xud.
  string version = 1 [json_name = "version"];
  // The node pub key of this node.
  string node_pub_key = 2 [json_name = "node_pub_key"];
  // A list of uris that can be used to connect to this node. These are shared with peers.
  repeated string uris = 3 [json_name = "uris"];
  // The number of currently connected peers.
  uint32 num_peers = 4 [json_name = "num_peers"];
  // The number of supported trading pairs.
  uint32 num_pairs = 5 [json_name = "num_pairs"];
  // The number of active, standing orders in the order book.
  OrdersCount orders = 6 [json_name = "orders"];
  map<string, LndInfo> lnd = 7 [json_name = "lnd"];
  // The alias of this instance of xud.
  string alias = 9 [json_name = "alias"];
  // The network of this node.
  string network = 10 [json_name = "network"];
  repeated string pending_swap_hashes = 11 [json_name = "pending_swap_hashes"];
  ConnextInfo connext = 12 [json_name = "connext"];
}

message GetNodeInfoRequest {
  // The node pub key or alias of the node for which to get information.
  string node_identifier = 1 [json_name = "node_identifier"];
}
message GetNodeInfoResponse {
  // The node's reputation score. Points are subtracted for unexpected or potentially malicious
  // behavior. Points are added when swaps are successfully executed.
  sint32 reputationScore = 1 [json_name = "reputation"];
  // Whether the node is currently banned.
  bool banned = 2 [json_name = "banned"];
}

message ListCurrenciesRequest {}
message ListCurrenciesResponse {
  // The list of available currencies in the orderbook.
  repeated Currency currencies = 1 [json_name = "currencies"];
}

message ListOrdersRequest {
  // The trading pair for which to retrieve orders.
  string pair_id = 1 [json_name = "pair_id"];
  enum Owner {
    BOTH = 0;
    OWN = 1;
    PEER = 2;
  }
  // Whether only own, only peer or both orders should be included in result.
  Owner owner = 2 [json_name = "owner"];
  // The maximum number of orders to return from each side of the order book.
  uint32 limit = 3 [json_name = "limit"];
  // Whether to include the node aliases of owners of the orders. 
  bool include_aliases = 4 [json_name = "include_aliases"];
}
message ListOrdersResponse {
  // A map between pair ids and their buy and sell orders.
  map<string, Orders> orders = 1 [json_name = "orders"];
}

message ListPairsRequest {}
message ListPairsResponse {
  // The list of supported trading pair tickers in formats like "LTC/BTC".
  repeated string pairs = 1 [json_name = "pairs"];
}

message ListPeersRequest {}
message ListPeersResponse {
  // The list of connected peers.
  repeated Peer peers = 1 [json_name = "peers"];
}

message LndInfo {
  string status = 1 [json_name = "status"];
  Channels channels = 2 [json_name = "channels"];
  repeated Chain chains = 3 [json_name = "chains"];
  uint32 blockheight = 4 [json_name = "blockheight"];
  repeated string uris = 5 [json_name = "uris"];
  string version = 6 [json_name = "version"];
  string alias = 7 [json_name = "alias"];
}

message NodeIdentifier {
  // The pub key of this node
  string node_pub_key = 1 [json_name = "node_pub_key"];
  // An alias for this node deterministically generated from the pub key
  string alias = 2 [json_name = "alias"];
}

message OpenChannelRequest {
  // The node pub key or alias of the peer with which to open channel with.
  string node_identifier = 1 [json_name = "node_identifier"];
  // The ticker symbol of the currency to open the channel for.
  string currency = 2 [json_name = "currency"];
  // The amount to be deposited into the channel denominated in satoshis.
  uint64 amount = 3 [json_name = "amount"];
  // The balance amount to be pushed to the remote side of the channel denominated in satoshis.
  uint64 push_amount = 4 [json_name = "push_amount"];
  // The manual fee rate set in sat/byte that should be used when crafting the funding transaction in the channel.
  uint64 fee = 5 [json_name = "fee"];
}

message OpenChannelResponse {
  // The id of the transaction that opened the channel.
  string transaction_id = 1 [json_name = "transaction_id"];
}

message Order {
  // The price of the order.
  double price = 1 [json_name = "price"];
  // The quantity of the order in satoshis.
  uint64 quantity = 2 [json_name = "quantity"];
  // The trading pair that this order is for.
  string pair_id = 3 [json_name = "pair_id"];
  // A UUID for this order.
  string id = 4 [json_name = "id"];
  // The identifier of the node that created this order.
  NodeIdentifier node_identifier = 5 [json_name = "node_identifier"];
  // The local id for this order, if applicable.
  string local_id = 6 [json_name = "local_id"];
  // The epoch time in milliseconds when this order was created.
  uint64 created_at = 7 [json_name = "created_at"];
  // Whether this order is a buy or sell
  OrderSide side = 8 [json_name = "side"];
  // Whether this order is a local own order or a remote peer order.
  bool is_own_order = 9 [json_name = "is_own_order"];
  // The quantity on hold pending swap execution.
  uint64 hold = 10 [json_name = "hold"];
}

message OrderRemoval {
  // The quantity removed from the order.
  uint64 quantity = 1 [json_name = "quantity"];
  // The trading pair that the order is for.
  string pair_id = 2 [json_name = "pair_id"];
  // The global UUID for the order.
  string order_id = 3 [json_name = "order_id"];
  // The local id for the order, if applicable.
  string local_id = 4 [json_name = "local_id"];
  // Whether the order being removed is a local own order or a remote peer order.
  bool is_own_order = 5 [json_name = "is_own_order"];
}

message Orders {
  // A list of buy orders sorted by descending price.
  repeated Order buy_orders = 1 [json_name = "buy_orders"];
  // A list of sell orders sorted by ascending price.
  repeated Order sell_orders = 2 [json_name = "sell_orders"];
}

message OrdersCount {
  // The number of orders belonging to remote xud nodes.
  uint32 peer = 1 [json_name = "peer"];
  // The number of orders belonging to our local xud node.
  uint32 own = 2 [json_name = "own"];
}

message OrderUpdate {
  oneof order_update {
    // An order that was added to the order book.
    Order order = 1 [json_name = "order"];
    // An order (or portion thereof) that was removed from the order book.
    OrderRemoval order_removal = 2 [json_name = "order_removal"];
  }
}

message Peer {
  // The socket address with host and port for this peer.
  string address = 1 [json_name = "address"];
  // The node pub key to uniquely identify this peer.
  string node_pub_key = 2 [json_name = "node_pub_key"];
  // A map of ticker symbols to lnd pub keys for this peer
  map<string, string> lnd_pub_keys = 3 [json_name = "lnd_pub_keys"];
  // Indicates whether this peer was connected inbound.
  bool inbound = 4 [json_name = "inbound"];
  // A list of trading pair tickers supported by this peer.
  repeated string pairs = 5 [json_name = "pairs"];
  // The version of xud being used by the peer.
  string xud_version = 6 [json_name = "xud_version"];
  // The time in seconds that we have been connected to this peer.
  uint32 seconds_connected = 7 [json_name = "seconds_connected"];
  // The alias for this peer's public key
  string alias = 9 [json_name = "alias"];
}

message PlaceOrderRequest {
  // The price of the order.
  double price = 1 [json_name = "price"];
  // The quantity of the order denominated in satoshis.
  uint64 quantity = 2 [json_name = "quantity"];
  // The trading pair that the order is for.
  string pair_id = 3 [json_name = "pair_id"];
  // The local id to assign to the order.
  string order_id = 4 [json_name = "order_id"];
  // Whether the order is a buy or sell.
  OrderSide side = 5 [json_name = "side"];
  // The local id of an existing order to be replaced. If provided, the order must be successfully
  // found and removed before the new order is placed, otherwise an error is returned.
  string replace_order_id = 6 [json_name = "replace_order_id"];
  // Whether the order must be filled immediately and not allowed to enter the order book.
  bool immediate_or_cancel = 7 [json_name = "immediate_or_cancel"];
}
message PlaceOrderResponse {
  // A list of own orders (or portions thereof) that matched the newly placed order.
  repeated Order internal_matches = 1 [json_name = "internal_matches"];
  // A list of successful swaps of peer orders that matched the newly placed order.
  repeated SwapSuccess swap_successes = 2 [json_name = "swap_successes"];
  // The remaining portion of the order, after matches, that enters the order book.
  Order remaining_order = 3 [json_name = "remaining_order"];
  // A list of swap attempts that failed.
  repeated SwapFailure swap_failures = 4 [json_name = "swap_failures"];
}

message PlaceOrderEvent {
  oneof event {
    // An order (or portion thereof) that matched the newly placed order.
    Order match = 1 [json_name = "match"];
    // A successful swap of a peer order that matched the newly placed order.
    SwapSuccess swap_success = 2 [json_name = "swap_success"];
    // The remaining portion of the order, after matches, that enters the order book.
    Order remaining_order = 3 [json_name= "remaining_order"];
    // A swap attempt that failed.
    SwapFailure swap_failure = 4 [json_name = "swap_failure"];
  }
}

message ConnextInfo {
  string status = 1 [json_name = "status"];
  string address = 2 [json_name = "address"];
  string version = 4 [json_name = "version"];
  string chain = 5 [json_name = "chain"];
}

message RemoveCurrencyRequest {
  // The ticker symbol for this currency such as BTC, LTC, ETH, etc...
  string currency = 1 [json_name = "currency"];
}
message RemoveCurrencyResponse {}

message RemoveOrderRequest {
  // The local id of the order to remove.
  string order_id = 1 [json_name = "order_id"];
  // The quantity to remove from the order denominated in satoshis.
  // If zero or unspecified then the entire order is removed.
  uint64 quantity = 2 [json_name = "quantity"];
}
message RemoveOrderResponse {
  // Any portion of the order that was on hold due to ongoing swaps at the time of the request
  // and could not be removed until after the swaps finish.
  uint64 quantity_on_hold = 1 [json_name = "hold"];
}

message RemoveAllOrdersRequest {}

message RemoveAllOrdersResponse {
  // The local order ids that were successfully removed.
  repeated string removed_order_ids = 1 [json_name = "removed_order_ids"];
  // The local order ids that were on hold and failed to be removed.
  repeated string on_hold_order_ids = 2 [json_name = "on_hold_order_ids"];
}

message RemovePairRequest {
  // The trading pair ticker to remove in a format such as "LTC/BTC".
  string pair_id = 1 [json_name = "pair_id"];
}
message RemovePairResponse {}

message RestoreNodeRequest {
  // The 24 word mnemonic to recover the xud identity key and underlying wallets
  repeated string seed_mnemonic = 1;
  // The password in utf-8 with which to encrypt the restored xud node key as well
  // as any restored underlying wallets.
  string password = 2;

  // A map between the currency of the LND and its multi channel SCB
  map<string, bytes> lnd_backups = 3;

  // The XUD database backup
  bytes xud_database = 6;
}
message RestoreNodeResponse {
  // The list of lnd clients that were initialized.
  repeated string restored_lnds = 1;

  // Whether the connext wallet was initialized.
  bool restored_connext = 2;
}

message SetLogLevelRequest {
  LogLevel log_level = 1 [json_name = "log_level"];
}
message SetLogLevelResponse {}

message ShutdownRequest {}
message ShutdownResponse {}

message SubscribeOrdersRequest {
  // Whether to transmit all existing active orders upon establishing the stream.
  bool existing = 1 [json_name = "existing"];
}

message SubscribeSwapsAcceptedRequest { }

message SubscribeSwapsRequest {
  // Whether to include the results for swaps initiated via the PlaceOrder or ExecuteSwap calls.
  // These swap results are also returned in the responses for the respective calls.
  bool include_taker = 1 [json_name = "include_taker"];
}

message SwapAccepted {
  // The global UUID for the order that was accepted to be swapped.
  string order_id = 1;
  // The local id for the order that was accepted to be swapped.
  string local_id = 2 [json_name = "local_id"];
  // The trading pair that the swap is for.
  string pair_id = 3 [json_name = "pair_id"];
  // The order quantity that was accepted to be swapped.
  uint64 quantity = 4 [json_name = "quantity"];
  // The price for the swap.
  double price = 5 [json_name = "price"];
  // The node pub key of the peer that executed this order.
  string peer_pub_key = 6 [json_name = "peer_pub_key"];
  // The hex-encoded payment hash for the swap.
  string r_hash = 7 [json_name = "r_hash"];
  // The amount received denominated in satoshis.
  uint64 amount_receiving = 8 [json_name = "amount_receiving"];
  // The amount sent denominated in satoshis.
  uint64 amount_sending = 9 [json_name = "amount_sending"];
  // The ticker symbol of the currency received.
  string currency_receiving = 10 [json_name = "currency_receiving"];
  // The ticker symbol of the currency sent.
  string currency_sending = 11 [json_name = "currency_sending"];
}

message SwapFailure {
  // The global UUID for the order that failed the swap.
  string order_id = 1 [json_name = "order_id"];
  // The trading pair that the swap is for.
  string pair_id = 2 [json_name = "pair_id"];
  // The order quantity that was attempted to be swapped.
  uint64 quantity = 3 [json_name = "quantity"];
  // The node pub key of the peer that we attempted to swap with.
  string peer_pub_key = 4 [json_name = "peer_pub_key"];
  // The reason why the swap failed.
  string failure_reason = 5 [json_name = "failure_reason"];
}

message SwapSuccess {
  // The global UUID for the order that was swapped.
  string order_id = 1;
  // The local id for the order that was swapped.
  string local_id = 2 [json_name = "local_id"];
  // The trading pair that the swap is for.
  string pair_id = 3 [json_name = "pair_id"];
  // The order quantity that was swapped.
  uint64 quantity = 4 [json_name = "quantity"];
  // The hex-encoded payment hash for the swap.
  string r_hash = 5 [json_name = "r_hash"];
  // The amount received denominated in satoshis.
  uint64 amount_received = 8 [json_name = "amount_received"];
  // The amount sent denominated in satoshis.
  uint64 amount_sent = 9 [json_name = "amount_sent"];
  // The node pub key of the peer that executed this order.
  string peer_pub_key = 10 [json_name = "peer_pub_key"];
  // Our role in the swap, either MAKER or TAKER.
  Role role = 11 [json_name = "role"];
  // The ticker symbol of the currency received.
  string currency_received = 12 [json_name = "currency_received"];
  // The ticker symbol of the currency sent.
  string currency_sent = 13 [json_name = "currency_sent"];
  // The hex-encoded preimage.
  string r_preimage = 14 [json_name = "r_preimage"];
  // The price used for the swap.
  double price = 15 [json_name = "price"];
}

message Trade {
  // The maker order involved in this trade.
  Order maker_order = 1 [json_name = "maker_order"];
  // The taker order involved in this trade. Note that when a trade occurs from
  // a remote peer filling one of our orders, we do not receive the order (only a
  // swap request) and this field will be empty.
  Order taker_order = 2 [json_name = "taker_order"];
  // The payment hash involved in this trade.
  string r_hash = 3 [json_name = "r_hash"];
  // The quantity transacted in this trade.
  uint64 quantity = 4 [json_name = "quantity"];
  // The trading pair for this trade.
  string pair_id = 5 [json_name = "pair_id"];
  // The price used for the trade.
  double price = 6 [json_name = "price"];
  // Our role in the trade.
  Role role = 7 [json_name = "role"];
  // The epoch time in milliseconds that this trade was executed
  uint64 executed_at = 8 [json_name = "executed_at"];
  // Whether this node was on the buy or sell side of the trade - or both in case of internal trades.
  OrderSide side = 9 [json_name = "side"];
  // The counterparty to this trade, if applicable.
  NodeIdentifier counterparty = 10 [json_name = "counterparty"];
}

message TradeHistoryRequest {
  // The maximum number of trades to return
  uint32 limit = 1 [json_name = "limit"];
}

message TradeHistoryResponse {
  repeated Trade trades = 1 [json_name = "trades"];
}

message TradingLimits {
  // Maximum outbound limit for a sell order denominated in satoshis.
  uint64 max_sell = 1 [json_name = "max_sell"];
  // Maximum inbound limit for a buy order denominated in satoshis.
  uint64 max_buy = 2 [json_name = "max_buy"];
  // The outbound amount reserved for open sell orders.
  uint64 reserved_sell = 3 [json_name = "reserved_sell"];
  // The inbound amount reserved for open buy orders.
  uint64 reserved_buy = 4 [json_name = "reserved_buy"];
}

message TradingLimitsRequest {
    // The ticker symbol of the currency to query for, if unspecified then trading limits for all supported
    // currencies are queried.
    string currency = 1 [json_name = "currency"];
}
message TradingLimitsResponse {
    // A map between currency ticker symbols and their trading limits.
    map<string, TradingLimits> limits = 1 [json_name = "limits"];
}

message UnbanRequest {
  // The node pub key or alias of the peer to unban.
  string node_identifier = 1 [json_name = "node_identifier"];
  // Whether to attempt to connect to the peer after it is unbanned.
  bool reconnect = 2  [json_name = "reconnect"];
}
message UnbanResponse {}

message UnlockNodeRequest {
  // The password in utf-8 with which to unlock an existing xud node key as
  // well as underlying client wallets such as lnd.
  string password = 1;
}
message UnlockNodeResponse {
  // The list of lnd clients that were unlocked.
  repeated string unlocked_lnds = 1;
  // The list of lnd clients that could not be unlocked.
  repeated string locked_lnds = 3;
}

message WithdrawRequest {
  // The ticker symbol of the currency to withdraw.
  string currency = 1 [json_name = "currency"];
  // The address to withdraw funds to.
  string destination = 2 [json_name = "destination"];
  // The amount to withdraw denominated in satoshis
  uint64 amount = 3 [json_name = "amount"];
  // Whether to withdraw all available funds for this currency.
  // If true, the amount field is ignored.
  bool all = 4 [json_name = "all"];
  // The fee to use for the withdrawal transaction denominated in satoshis per byte.
  uint32 fee = 5 [json_name = "fee"];
}
message WithdrawResponse {
  // The id of the withdrawal transaction.
  string transaction_id = 1 [json_name = "transaction_id"];
}
