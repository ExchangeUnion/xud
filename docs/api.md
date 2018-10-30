# Protocol Documentation
<a name="top"></a>

## Table of Contents

- [xudrpc.proto](#xudrpc.proto)
    - [AddCurrencyRequest](#xudrpc.AddCurrencyRequest)
    - [AddCurrencyResponse](#xudrpc.AddCurrencyResponse)
    - [AddPairRequest](#xudrpc.AddPairRequest)
    - [AddPairResponse](#xudrpc.AddPairResponse)
    - [BanRequest](#xudrpc.BanRequest)
    - [BanResponse](#xudrpc.BanResponse)
    - [ChannelBalance](#xudrpc.ChannelBalance)
    - [ChannelBalanceRequest](#xudrpc.ChannelBalanceRequest)
    - [ChannelBalanceResponse](#xudrpc.ChannelBalanceResponse)
    - [ChannelBalanceResponse.BalancesEntry](#xudrpc.ChannelBalanceResponse.BalancesEntry)
    - [ConnectRequest](#xudrpc.ConnectRequest)
    - [ConnectResponse](#xudrpc.ConnectResponse)
    - [ExecuteSwapRequest](#xudrpc.ExecuteSwapRequest)
    - [GetInfoRequest](#xudrpc.GetInfoRequest)
    - [GetInfoResponse](#xudrpc.GetInfoResponse)
    - [GetNodeInfoRequest](#xudrpc.GetNodeInfoRequest)
    - [GetNodeInfoResponse](#xudrpc.GetNodeInfoResponse)
    - [GetOrdersRequest](#xudrpc.GetOrdersRequest)
    - [GetOrdersResponse](#xudrpc.GetOrdersResponse)
    - [GetOrdersResponse.OrdersEntry](#xudrpc.GetOrdersResponse.OrdersEntry)
    - [ListCurrenciesRequest](#xudrpc.ListCurrenciesRequest)
    - [ListCurrenciesResponse](#xudrpc.ListCurrenciesResponse)
    - [ListPairsRequest](#xudrpc.ListPairsRequest)
    - [ListPairsResponse](#xudrpc.ListPairsResponse)
    - [ListPeersRequest](#xudrpc.ListPeersRequest)
    - [ListPeersResponse](#xudrpc.ListPeersResponse)
    - [LndChannels](#xudrpc.LndChannels)
    - [LndInfo](#xudrpc.LndInfo)
    - [Order](#xudrpc.Order)
    - [OrderRemoval](#xudrpc.OrderRemoval)
    - [Orders](#xudrpc.Orders)
    - [OrdersCount](#xudrpc.OrdersCount)
    - [Peer](#xudrpc.Peer)
    - [PlaceOrderEvent](#xudrpc.PlaceOrderEvent)
    - [PlaceOrderRequest](#xudrpc.PlaceOrderRequest)
    - [PlaceOrderResponse](#xudrpc.PlaceOrderResponse)
    - [RaidenInfo](#xudrpc.RaidenInfo)
    - [RemoveCurrencyRequest](#xudrpc.RemoveCurrencyRequest)
    - [RemoveCurrencyResponse](#xudrpc.RemoveCurrencyResponse)
    - [RemoveOrderRequest](#xudrpc.RemoveOrderRequest)
    - [RemoveOrderResponse](#xudrpc.RemoveOrderResponse)
    - [RemovePairRequest](#xudrpc.RemovePairRequest)
    - [RemovePairResponse](#xudrpc.RemovePairResponse)
    - [ShutdownRequest](#xudrpc.ShutdownRequest)
    - [ShutdownResponse](#xudrpc.ShutdownResponse)
    - [SubscribeAddedOrdersRequest](#xudrpc.SubscribeAddedOrdersRequest)
    - [SubscribeRemovedOrdersRequest](#xudrpc.SubscribeRemovedOrdersRequest)
    - [SubscribeSwapsRequest](#xudrpc.SubscribeSwapsRequest)
    - [SwapResult](#xudrpc.SwapResult)
    - [UnbanRequest](#xudrpc.UnbanRequest)
    - [UnbanResponse](#xudrpc.UnbanResponse)
  
    - [AddCurrencyRequest.SwapClient](#xudrpc.AddCurrencyRequest.SwapClient)
    - [OrderSide](#xudrpc.OrderSide)
    - [SwapResult.Role](#xudrpc.SwapResult.Role)
  
  
    - [Xud](#xudrpc.Xud)
  

- [Scalar Value Types](#scalar-value-types)



<a name="xudrpc.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## xudrpc.proto



<a name="xudrpc.AddCurrencyRequest"></a>

### AddCurrencyRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| currency | [string](#string) |  | The ticker symbol for this currency such as BTC, LTC, ETH, etc... |
| swap_client | [AddCurrencyRequest.SwapClient](#xudrpc.AddCurrencyRequest.SwapClient) |  | The payment channel network client to use for executing swaps. |
| token_address | [string](#string) |  | The contract address for layered tokens such as ERC20. |
| decimal_places | [uint32](#uint32) |  | The number of places to the right of the decimal point of the smallest subunit of the currency. For example, BTC, LTC, and others where the smallest subunits (satoshis) are 0.00000001 full units (bitcoins) have 8 decimal places. ETH has 18. This can be thought of as the base 10 exponent of the smallest subunit expressed as a positive integer. A default value of 8 is used if unspecified. |






<a name="xudrpc.AddCurrencyResponse"></a>

### AddCurrencyResponse







<a name="xudrpc.AddPairRequest"></a>

### AddPairRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| base_currency | [string](#string) |  | The base currency that is bought and sold for this trading pair. |
| quote_currency | [string](#string) |  | The currency used to quote a price for the base currency. |






<a name="xudrpc.AddPairResponse"></a>

### AddPairResponse







<a name="xudrpc.BanRequest"></a>

### BanRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| node_pub_key | [string](#string) |  | The node pub key of the node to ban. |






<a name="xudrpc.BanResponse"></a>

### BanResponse







<a name="xudrpc.ChannelBalance"></a>

### ChannelBalance



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| balance | [int64](#int64) |  | Sum of channels balances denominated in satoshis or equivalent. |
| pending_open_balance | [int64](#int64) |  | Sum of channels pending balances denominated in satoshis or equivalent. |






<a name="xudrpc.ChannelBalanceRequest"></a>

### ChannelBalanceRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| currency | [string](#string) |  | The ticker symbol of the currency to query for, if unspecified then balances for all supported currencies are queried. |






<a name="xudrpc.ChannelBalanceResponse"></a>

### ChannelBalanceResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| balances | [ChannelBalanceResponse.BalancesEntry](#xudrpc.ChannelBalanceResponse.BalancesEntry) | repeated | A map between currency ticker symbols and their channel balances. |






<a name="xudrpc.ChannelBalanceResponse.BalancesEntry"></a>

### ChannelBalanceResponse.BalancesEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [ChannelBalance](#xudrpc.ChannelBalance) |  |  |






<a name="xudrpc.ConnectRequest"></a>

### ConnectRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| node_uri | [string](#string) |  | The uri of the node to connect to in &#34;[nodePubKey]@[host]:[port]&#34; format. |






<a name="xudrpc.ConnectResponse"></a>

### ConnectResponse







<a name="xudrpc.ExecuteSwapRequest"></a>

### ExecuteSwapRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| pair_id | [string](#string) |  | The trading pair of the swap orders. |
| order_id | [string](#string) |  | The order id of the maker order. |
| peer_pub_key | [string](#string) |  | The node pub key of the peer which owns the maker order. |
| quantity | [double](#double) |  | the quantity to swap. the whole order will be swapped if unspecified. |






<a name="xudrpc.GetInfoRequest"></a>

### GetInfoRequest







<a name="xudrpc.GetInfoResponse"></a>

### GetInfoResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| version | [string](#string) |  | The version of this instance of xud. |
| node_pub_key | [string](#string) |  | The node pub key of this node. |
| uris | [string](#string) | repeated | A list of uris that can be used to connect to this node. These are shared with peers. |
| num_peers | [int32](#int32) |  | The number of currently connected peers. |
| num_pairs | [int32](#int32) |  | The number of supported trading pairs. |
| orders | [OrdersCount](#xudrpc.OrdersCount) |  | The number of active, standing orders in the order book. |
| lndbtc | [LndInfo](#xudrpc.LndInfo) |  |  |
| lndltc | [LndInfo](#xudrpc.LndInfo) |  |  |
| raiden | [RaidenInfo](#xudrpc.RaidenInfo) |  |  |






<a name="xudrpc.GetNodeInfoRequest"></a>

### GetNodeInfoRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| node_pub_key | [string](#string) |  | The node pub key of the node for which to get information. |






<a name="xudrpc.GetNodeInfoResponse"></a>

### GetNodeInfoResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| reputationScore | [int32](#int32) |  | The node&#39;s reputation score. Points are subtracted for unexpected or potentially malicious behavior. Points are added when swaps are successfully executed. |
| banned | [bool](#bool) |  | Whether the node is currently banned. |






<a name="xudrpc.GetOrdersRequest"></a>

### GetOrdersRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| pair_id | [string](#string) |  | The trading pair for which to retrieve orders. |
| include_own_orders | [bool](#bool) |  | Whether own orders should be included in result or not. |






<a name="xudrpc.GetOrdersResponse"></a>

### GetOrdersResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| orders | [GetOrdersResponse.OrdersEntry](#xudrpc.GetOrdersResponse.OrdersEntry) | repeated | A map between pair ids and their buy and sell orders. |






<a name="xudrpc.GetOrdersResponse.OrdersEntry"></a>

### GetOrdersResponse.OrdersEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [Orders](#xudrpc.Orders) |  |  |






<a name="xudrpc.ListCurrenciesRequest"></a>

### ListCurrenciesRequest







<a name="xudrpc.ListCurrenciesResponse"></a>

### ListCurrenciesResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| currencies | [string](#string) | repeated | A list of ticker symbols of the supported currencies. |






<a name="xudrpc.ListPairsRequest"></a>

### ListPairsRequest







<a name="xudrpc.ListPairsResponse"></a>

### ListPairsResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| pairs | [string](#string) | repeated | The list of supported trading pair tickers in formats like &#34;LTC/BTC&#34;. |






<a name="xudrpc.ListPeersRequest"></a>

### ListPeersRequest







<a name="xudrpc.ListPeersResponse"></a>

### ListPeersResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| peers | [Peer](#xudrpc.Peer) | repeated | The list of connected peers. |






<a name="xudrpc.LndChannels"></a>

### LndChannels



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| active | [int32](#int32) |  | The number of active/online channels for this lnd instance that can be used for swaps. |
| inactive | [int32](#int32) |  | The number of inactive/offline channels for this lnd instance. |
| pending | [int32](#int32) |  | The number of channels that are pending on-chain confirmation before they can be used. |






<a name="xudrpc.LndInfo"></a>

### LndInfo



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| error | [string](#string) |  |  |
| channels | [LndChannels](#xudrpc.LndChannels) |  |  |
| chains | [string](#string) | repeated |  |
| blockheight | [int32](#int32) |  |  |
| uris | [string](#string) | repeated |  |
| version | [string](#string) |  |  |
| alias | [string](#string) |  |  |






<a name="xudrpc.Order"></a>

### Order



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| price | [double](#double) |  | The price of the order. |
| quantity | [double](#double) |  | The quantity of the order. |
| pair_id | [string](#string) |  | The trading pair that this order is for. |
| id | [string](#string) |  | A UUID for this order. |
| peer_pub_key | [string](#string) |  | The node pub key of the peer that created this order. |
| local_id | [string](#string) |  | The local id for this order. |
| created_at | [int64](#int64) |  | The epoch time when this order was created. |
| side | [OrderSide](#xudrpc.OrderSide) |  | Whether this order is a buy or sell |
| is_own_order | [bool](#bool) |  | Whether this order is a local own order or a remote peer order. |






<a name="xudrpc.OrderRemoval"></a>

### OrderRemoval



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| quantity | [double](#double) |  | The quantity of the order being removed. |
| pair_id | [string](#string) |  | The trading pair that the order is for. |
| order_id | [string](#string) |  | The global UUID for the order. |
| local_id | [string](#string) |  | The local id for the order, if applicable. |
| is_own_order | [bool](#bool) |  | Whether the order being removed is a local own order or a remote peer order. |






<a name="xudrpc.Orders"></a>

### Orders



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| buy_orders | [Order](#xudrpc.Order) | repeated | A list of buy orders sorted by descending price. |
| sell_orders | [Order](#xudrpc.Order) | repeated | A list of sell orders sorted by ascending price. |






<a name="xudrpc.OrdersCount"></a>

### OrdersCount



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| peer | [int32](#int32) |  | The number of orders belonging to remote xud nodes. |
| own | [int32](#int32) |  | The number of orders belonging to our local xud node. |






<a name="xudrpc.Peer"></a>

### Peer



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| address | [string](#string) |  | The socket address with host and port for this peer. |
| node_pub_key | [string](#string) |  | The node pub key to uniquely identify this peer. |
| lnd_btc_pub_key | [string](#string) |  | The lnd BTC pub key associated with this peer. |
| lnd_ltc_pub_key | [string](#string) |  | The lnd LTC pub key associated with this peer. |
| inbound | [bool](#bool) |  | Indicates whether this peer was connected inbound. |
| pairs | [string](#string) | repeated | A list of trading pair tickers supported by this peer. |
| xud_version | [string](#string) |  | The version of xud being used by the peer. |
| seconds_connected | [int32](#int32) |  | The time in seconds that we have been connected to this peer. |






<a name="xudrpc.PlaceOrderEvent"></a>

### PlaceOrderEvent



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| internal_match | [Order](#xudrpc.Order) |  | An own orders (or portions thereof) that matched the newly placed order. |
| swap_result | [SwapResult](#xudrpc.SwapResult) |  | A swap results of peer orders that matched the newly placed order. |
| remaining_order | [Order](#xudrpc.Order) |  | The remaining portion of the order, after matches, that enters the order book. |






<a name="xudrpc.PlaceOrderRequest"></a>

### PlaceOrderRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| price | [double](#double) |  | The price of the order. |
| quantity | [double](#double) |  | The quantity of the order. |
| pair_id | [string](#string) |  | The trading pair that the order is for. |
| order_id | [string](#string) |  | The local id to assign to the order. |
| side | [OrderSide](#xudrpc.OrderSide) |  | Whether the order is a Buy or Sell. |






<a name="xudrpc.PlaceOrderResponse"></a>

### PlaceOrderResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| internal_matches | [Order](#xudrpc.Order) | repeated | A list of own orders (or portions thereof) that matched the newly placed order. |
| swap_results | [SwapResult](#xudrpc.SwapResult) | repeated | A list of swap results of peer orders that matched the newly placed order. |
| remaining_order | [Order](#xudrpc.Order) |  | The remaining portion of the order, after matches, that enters the order book. |






<a name="xudrpc.RaidenInfo"></a>

### RaidenInfo



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| error | [string](#string) |  |  |
| address | [string](#string) |  |  |
| channels | [int32](#int32) |  |  |
| version | [string](#string) |  |  |






<a name="xudrpc.RemoveCurrencyRequest"></a>

### RemoveCurrencyRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| currency | [string](#string) |  | The ticker symbol for this currency such as BTC, LTC, ETH, etc... |






<a name="xudrpc.RemoveCurrencyResponse"></a>

### RemoveCurrencyResponse







<a name="xudrpc.RemoveOrderRequest"></a>

### RemoveOrderRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| order_id | [string](#string) |  | The local id of the order to remove. |






<a name="xudrpc.RemoveOrderResponse"></a>

### RemoveOrderResponse







<a name="xudrpc.RemovePairRequest"></a>

### RemovePairRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| pair_id | [string](#string) |  | The trading pair ticker to remove in a format such as &#34;LTC/BTC&#34;. |






<a name="xudrpc.RemovePairResponse"></a>

### RemovePairResponse







<a name="xudrpc.ShutdownRequest"></a>

### ShutdownRequest







<a name="xudrpc.ShutdownResponse"></a>

### ShutdownResponse







<a name="xudrpc.SubscribeAddedOrdersRequest"></a>

### SubscribeAddedOrdersRequest







<a name="xudrpc.SubscribeRemovedOrdersRequest"></a>

### SubscribeRemovedOrdersRequest







<a name="xudrpc.SubscribeSwapsRequest"></a>

### SubscribeSwapsRequest







<a name="xudrpc.SwapResult"></a>

### SwapResult



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| order_id | [string](#string) |  | The global UUID for the order that was swapped. |
| local_id | [string](#string) |  | The local id for the order that was swapped. |
| pair_id | [string](#string) |  | The trading pair that this order is for. |
| quantity | [double](#double) |  | The order quantity that was swapped. |
| r_hash | [string](#string) |  | The hex-encoded r_hash for the swap payments. |
| amount_received | [int64](#int64) |  | The amount of subunits (satoshis) received. |
| amount_sent | [int64](#int64) |  | The amount of subunits (satoshis) sent. |
| peer_pub_key | [string](#string) |  | The node pub key of the peer that executed this order. |
| role | [SwapResult.Role](#xudrpc.SwapResult.Role) |  | Our role in the swap, either MAKER or TAKER. |






<a name="xudrpc.UnbanRequest"></a>

### UnbanRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| node_pub_key | [string](#string) |  | The node pub key of the peer to unban. |
| reconnect | [bool](#bool) |  | Whether to attempt to connect to the peer after it is unbanned. |






<a name="xudrpc.UnbanResponse"></a>

### UnbanResponse






 


<a name="xudrpc.AddCurrencyRequest.SwapClient"></a>

### AddCurrencyRequest.SwapClient


| Name | Number | Description |
| ---- | ------ | ----------- |
| LND | 0 |  |
| RAIDEN | 1 |  |



<a name="xudrpc.OrderSide"></a>

### OrderSide


| Name | Number | Description |
| ---- | ------ | ----------- |
| BUY | 0 |  |
| SELL | 1 |  |



<a name="xudrpc.SwapResult.Role"></a>

### SwapResult.Role


| Name | Number | Description |
| ---- | ------ | ----------- |
| TAKER | 0 |  |
| MAKER | 1 |  |


 

 


<a name="xudrpc.Xud"></a>

### Xud


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| AddCurrency | [AddCurrencyRequest](#xudrpc.AddCurrencyRequest) | [AddCurrencyResponse](#xudrpc.AddCurrencyResponse) | Adds a currency to the list of supported currencies. Once added, the currency may be used for new trading pairs. |
| AddPair | [AddPairRequest](#xudrpc.AddPairRequest) | [AddPairResponse](#xudrpc.AddPairResponse) | Adds a trading pair to the list of supported trading pairs. The newly supported pair is advertised to peers so they may begin sending orders for it. |
| RemoveOrder | [RemoveOrderRequest](#xudrpc.RemoveOrderRequest) | [RemoveOrderResponse](#xudrpc.RemoveOrderResponse) | Removes an order from the order book by its local id. This should be called when an order is canceled or filled outside of xud. Removed orders become immediately unavailable for swaps, and peers are notified that the order is no longer valid. |
| ChannelBalance | [ChannelBalanceRequest](#xudrpc.ChannelBalanceRequest) | [ChannelBalanceResponse](#xudrpc.ChannelBalanceResponse) | Gets the total balance available across all payment channels for one or all currencies. |
| Connect | [ConnectRequest](#xudrpc.ConnectRequest) | [ConnectResponse](#xudrpc.ConnectResponse) | Attempts to connect to a node. Once connected, the node is added to the list of peers and becomes available for swaps and trading. A handshake exchanges information about the peer&#39;s supported trading and swap clients. Orders will be shared with the peer upon connection and upon new order placements. |
| Ban | [BanRequest](#xudrpc.BanRequest) | [BanResponse](#xudrpc.BanResponse) | Bans a node and immediately disconnects from it. This can be used to prevent any connections to a specific node. |
| Unban | [UnbanRequest](#xudrpc.UnbanRequest) | [UnbanResponse](#xudrpc.UnbanResponse) | Removes a ban from a node manually and, optionally, attempts to connect to it. |
| GetInfo | [GetInfoRequest](#xudrpc.GetInfoRequest) | [GetInfoResponse](#xudrpc.GetInfoResponse) | Gets general information about this node. |
| GetNodeInfo | [GetNodeInfoRequest](#xudrpc.GetNodeInfoRequest) | [GetNodeInfoResponse](#xudrpc.GetNodeInfoResponse) | Gets general information about a node. |
| GetOrders | [GetOrdersRequest](#xudrpc.GetOrdersRequest) | [GetOrdersResponse](#xudrpc.GetOrdersResponse) | Gets orders from the order book. This call returns the state of the order book at a given point in time, although it is not guaranteed to still be vaild by the time a response is received and processed by a client. It accepts an optional trading pair id parameter. If specified, only orders for that particular trading pair are returned. Otherwise, all orders are returned. Orders are separated into buys and sells for each trading pair, but unsorted. |
| ListCurrencies | [ListCurrenciesRequest](#xudrpc.ListCurrenciesRequest) | [ListCurrenciesResponse](#xudrpc.ListCurrenciesResponse) | Gets a list of this node&#39;s supported currencies. |
| ListPairs | [ListPairsRequest](#xudrpc.ListPairsRequest) | [ListPairsResponse](#xudrpc.ListPairsResponse) | Gets a list of this nodes suported trading pairs. |
| ListPeers | [ListPeersRequest](#xudrpc.ListPeersRequest) | [ListPeersResponse](#xudrpc.ListPeersResponse) | Gets a list of connected peers. |
| PlaceOrder | [PlaceOrderRequest](#xudrpc.PlaceOrderRequest) | [PlaceOrderEvent](#xudrpc.PlaceOrderEvent) stream | Adds an order to the order book. If price is zero or unspecified a market order will get added. |
| PlaceOrderSync | [PlaceOrderRequest](#xudrpc.PlaceOrderRequest) | [PlaceOrderResponse](#xudrpc.PlaceOrderResponse) | The synchronous non-streaming version of PlaceOrder. |
| ExecuteSwap | [ExecuteSwapRequest](#xudrpc.ExecuteSwapRequest) | [SwapResult](#xudrpc.SwapResult) | Execute a swap on a maker peer order |
| RemoveCurrency | [RemoveCurrencyRequest](#xudrpc.RemoveCurrencyRequest) | [RemoveCurrencyResponse](#xudrpc.RemoveCurrencyResponse) | Removes a currency from the list of supported currencies. Only currencies that are not in use for any currently supported trading pairs may be removed. Once removed, the currency can no longer be used for any supported trading pairs. |
| RemovePair | [RemovePairRequest](#xudrpc.RemovePairRequest) | [RemovePairResponse](#xudrpc.RemovePairResponse) | Removes a trading pair from the list of currently supported trading pair. This call will effectively cancel any standing orders for that trading pair. Peers are informed when a pair is no longer supported so that they will know to stop sending orders for it. |
| Shutdown | [ShutdownRequest](#xudrpc.ShutdownRequest) | [ShutdownResponse](#xudrpc.ShutdownResponse) | Begin gracefully shutting down xud. |
| SubscribeAddedOrders | [SubscribeAddedOrdersRequest](#xudrpc.SubscribeAddedOrdersRequest) | [Order](#xudrpc.Order) stream | Subscribes to orders being added to the order book. This call, together with SubscribeRemovedOrders, allows the client to maintain an up-to-date view of the order book. For example, an exchange that wants to show its users a real time list of the orders available to them would subscribe to this streaming call to be alerted of new orders as they become available for trading. |
| SubscribeRemovedOrders | [SubscribeRemovedOrdersRequest](#xudrpc.SubscribeRemovedOrdersRequest) | [OrderRemoval](#xudrpc.OrderRemoval) stream | Subscribes to orders being removed - either in full or in part - from the order book. This call, together with SubscribeAddedOrders, allows the client to maintain an up-to-date view of the order book. For example, an exchange that wants to show its users a real time list of the orders available to them would subscribe to this streaming call to be alerted when part or all of an existing order is no longer available for trading. |
| SubscribeSwaps | [SubscribeSwapsRequest](#xudrpc.SubscribeSwapsRequest) | [SwapResult](#xudrpc.SwapResult) stream | Subscribes to completed swaps that are initiated by a remote peer. This call allows the client to get real-time notifications when its orders are filled by a remote taker. It can be used for tracking order executions, updating balances, and informing a trader when one of their orders is settled through Exchange Union network. |

 



## Scalar Value Types

| .proto Type | Notes | C++ Type | Java Type | Python Type |
| ----------- | ----- | -------- | --------- | ----------- |
| <a name="double" /> double |  | double | double | float |
| <a name="float" /> float |  | float | float | float |
| <a name="int32" /> int32 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint32 instead. | int32 | int | int |
| <a name="int64" /> int64 | Uses variable-length encoding. Inefficient for encoding negative numbers – if your field is likely to have negative values, use sint64 instead. | int64 | long | int/long |
| <a name="uint32" /> uint32 | Uses variable-length encoding. | uint32 | int | int/long |
| <a name="uint64" /> uint64 | Uses variable-length encoding. | uint64 | long | int/long |
| <a name="sint32" /> sint32 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int32s. | int32 | int | int |
| <a name="sint64" /> sint64 | Uses variable-length encoding. Signed int value. These more efficiently encode negative numbers than regular int64s. | int64 | long | int/long |
| <a name="fixed32" /> fixed32 | Always four bytes. More efficient than uint32 if values are often greater than 2^28. | uint32 | int | int |
| <a name="fixed64" /> fixed64 | Always eight bytes. More efficient than uint64 if values are often greater than 2^56. | uint64 | long | int/long |
| <a name="sfixed32" /> sfixed32 | Always four bytes. | int32 | int | int |
| <a name="sfixed64" /> sfixed64 | Always eight bytes. | int64 | long | int/long |
| <a name="bool" /> bool |  | bool | boolean | boolean |
| <a name="string" /> string | A string must always contain UTF-8 encoded or 7-bit ASCII text. | string | String | str/unicode |
| <a name="bytes" /> bytes | May contain any arbitrary sequence of bytes. | string | ByteString | str |

