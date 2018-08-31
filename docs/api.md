# Protocol Documentation
<a name="top"></a>

## Table of Contents

- [xudrpc.proto](#xudrpc.proto)
    - [CancelOrderRequest](#xudrpc.CancelOrderRequest)
    - [CancelOrderResponse](#xudrpc.CancelOrderResponse)
    - [ChannelBalanceRequest](#xudrpc.ChannelBalanceRequest)
    - [ChannelBalanceResponse](#xudrpc.ChannelBalanceResponse)
    - [ConnectRequest](#xudrpc.ConnectRequest)
    - [ConnectResponse](#xudrpc.ConnectResponse)
    - [DisconnectRequest](#xudrpc.DisconnectRequest)
    - [DisconnectResponse](#xudrpc.DisconnectResponse)
    - [ExecuteSwapRequest](#xudrpc.ExecuteSwapRequest)
    - [ExecuteSwapResponse](#xudrpc.ExecuteSwapResponse)
    - [GetInfoRequest](#xudrpc.GetInfoRequest)
    - [GetInfoResponse](#xudrpc.GetInfoResponse)
    - [GetOrdersRequest](#xudrpc.GetOrdersRequest)
    - [GetOrdersResponse](#xudrpc.GetOrdersResponse)
    - [GetPairsRequest](#xudrpc.GetPairsRequest)
    - [GetPairsResponse](#xudrpc.GetPairsResponse)
    - [ListPeersRequest](#xudrpc.ListPeersRequest)
    - [ListPeersResponse](#xudrpc.ListPeersResponse)
    - [LndChannels](#xudrpc.LndChannels)
    - [LndInfo](#xudrpc.LndInfo)
    - [Order](#xudrpc.Order)
    - [OrderMatch](#xudrpc.OrderMatch)
    - [Orders](#xudrpc.Orders)
    - [OrdersCount](#xudrpc.OrdersCount)
    - [Pair](#xudrpc.Pair)
    - [Peer](#xudrpc.Peer)
    - [PlaceOrderRequest](#xudrpc.PlaceOrderRequest)
    - [PlaceOrderResponse](#xudrpc.PlaceOrderResponse)
    - [RaidenInfo](#xudrpc.RaidenInfo)
    - [ShutdownRequest](#xudrpc.ShutdownRequest)
    - [ShutdownResponse](#xudrpc.ShutdownResponse)
    - [SubscribePeerOrdersRequest](#xudrpc.SubscribePeerOrdersRequest)
    - [SubscribePeerOrdersResponse](#xudrpc.SubscribePeerOrdersResponse)
    - [SubscribeSwapsRequest](#xudrpc.SubscribeSwapsRequest)
    - [SubscribeSwapsResponse](#xudrpc.SubscribeSwapsResponse)
    - [SwapPayload](#xudrpc.SwapPayload)
  
  
  
    - [Xud](#xudrpc.Xud)
  

- [Scalar Value Types](#scalar-value-types)



<a name="xudrpc.proto"></a>
<p align="right"><a href="#top">Top</a></p>

## xudrpc.proto



<a name="xudrpc.CancelOrderRequest"></a>

### CancelOrderRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| order_id | [string](#string) |  | The local id of the order to cancel |
| pair_id | [string](#string) |  | The trading pair that the order to cancel is for |






<a name="xudrpc.CancelOrderResponse"></a>

### CancelOrderResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| canceled | [bool](#bool) |  | Indicates whether an order was successfully canceled |






<a name="xudrpc.ChannelBalanceRequest"></a>

### ChannelBalanceRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| currency | [string](#string) |  | The ticker symbol of the currency to query for |






<a name="xudrpc.ChannelBalanceResponse"></a>

### ChannelBalanceResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| balance | [int64](#int64) |  | Sum of channels balances denominated in satoshis or equivalent |
| pending_open_balance | [int64](#int64) |  | Sum of channels pending balances denominated in satoshis or equivalent |






<a name="xudrpc.ConnectRequest"></a>

### ConnectRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| node_uri | [string](#string) |  |  |






<a name="xudrpc.ConnectResponse"></a>

### ConnectResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [string](#string) |  | A message describing the result of the connection request |






<a name="xudrpc.DisconnectRequest"></a>

### DisconnectRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| node_pub_key | [string](#string) |  |  |






<a name="xudrpc.DisconnectResponse"></a>

### DisconnectResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [string](#string) |  |  |






<a name="xudrpc.ExecuteSwapRequest"></a>

### ExecuteSwapRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| target_address | [string](#string) |  |  |
| payload | [SwapPayload](#xudrpc.SwapPayload) |  |  |






<a name="xudrpc.ExecuteSwapResponse"></a>

### ExecuteSwapResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [string](#string) |  |  |






<a name="xudrpc.GetInfoRequest"></a>

### GetInfoRequest







<a name="xudrpc.GetInfoResponse"></a>

### GetInfoResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| version | [string](#string) |  |  |
| node_pub_key | [string](#string) |  |  |
| uris | [string](#string) | repeated |  |
| num_peers | [int32](#int32) |  |  |
| num_pairs | [int32](#int32) |  |  |
| orders | [OrdersCount](#xudrpc.OrdersCount) |  |  |
| lndbtc | [LndInfo](#xudrpc.LndInfo) |  |  |
| lndltc | [LndInfo](#xudrpc.LndInfo) |  |  |
| raiden | [RaidenInfo](#xudrpc.RaidenInfo) |  |  |






<a name="xudrpc.GetOrdersRequest"></a>

### GetOrdersRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| pair_id | [string](#string) |  | The trading pair for which to retrieve orders |
| max_results | [uint32](#uint32) |  | The maximum number of orders to return from either side of the order book |






<a name="xudrpc.GetOrdersResponse"></a>

### GetOrdersResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| peer_orders | [Orders](#xudrpc.Orders) |  | A list of peer orders |
| own_orders | [Orders](#xudrpc.Orders) |  | A list of orders placed locally |






<a name="xudrpc.GetPairsRequest"></a>

### GetPairsRequest







<a name="xudrpc.GetPairsResponse"></a>

### GetPairsResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| pairs | [Pair](#xudrpc.Pair) | repeated |  |






<a name="xudrpc.ListPeersRequest"></a>

### ListPeersRequest







<a name="xudrpc.ListPeersResponse"></a>

### ListPeersResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| peers | [Peer](#xudrpc.Peer) | repeated |  |






<a name="xudrpc.LndChannels"></a>

### LndChannels



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| active | [int32](#int32) |  |  |
| inactive | [int32](#int32) |  |  |
| pending | [int32](#int32) |  |  |






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






<a name="xudrpc.Order"></a>

### Order



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| price | [double](#double) |  | The price of the order, precise to 6 decimal places. |
| quantity | [double](#double) |  | The quantity of the order, precise to 6 decimal places. |
| pair_id | [string](#string) |  | The trading pair that this order is for |
| peer_pub_key | [string](#string) |  | The node pub key of the peer that created this order |
| id | [string](#string) |  | A UUID for this order |
| local_id | [string](#string) |  | The local id for this order |
| created_at | [int64](#int64) |  | The epoch time when this order was created |
| invoice | [string](#string) |  | Lightning invoice |
| canceled | [bool](#bool) |  | Indicates whether an order was canceled |






<a name="xudrpc.OrderMatch"></a>

### OrderMatch



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| maker | [Order](#xudrpc.Order) |  |  |
| taker | [Order](#xudrpc.Order) |  |  |






<a name="xudrpc.Orders"></a>

### Orders



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| buy_orders | [Order](#xudrpc.Order) | repeated | A list of buy orders sorted by descending price |
| sell_orders | [Order](#xudrpc.Order) | repeated | A list of sell orders sorted by ascending price |






<a name="xudrpc.OrdersCount"></a>

### OrdersCount



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| peer | [int32](#int32) |  |  |
| own | [int32](#int32) |  |  |






<a name="xudrpc.Pair"></a>

### Pair



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| base_currency | [string](#string) |  |  |
| quote_currency | [string](#string) |  |  |
| swap_protocol | [string](#string) |  |  |






<a name="xudrpc.Peer"></a>

### Peer



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| address | [string](#string) |  | The socket address with host and port for this peer |
| node_pub_key | [string](#string) |  | The node pub key to uniquely identify this peer |
| inbound | [bool](#bool) |  | Indicates whether this peer was connected inbound |
| pairs | [string](#string) | repeated | A list of trading pair tickers supported by this peer |
| xud_version | [string](#string) |  | The version of xud being used by the peer |
| seconds_connected | [int32](#int32) |  | The time in seconds that we have been connected to this peer |






<a name="xudrpc.PlaceOrderRequest"></a>

### PlaceOrderRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| price | [double](#double) |  | The price of the order, precise to 6 decimal places. |
| quantity | [double](#double) |  | The quantity of the order, precise to 6 decimal places. |
| pair_id | [string](#string) |  | The trading pair that the order is for |
| order_id | [string](#string) |  | The local id to assign to the order |






<a name="xudrpc.PlaceOrderResponse"></a>

### PlaceOrderResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| matches | [OrderMatch](#xudrpc.OrderMatch) | repeated | A list of orders matching the newly placed order |
| remaining_order | [Order](#xudrpc.Order) |  | The remaining portion of the order, after matches, that enters the order book |






<a name="xudrpc.RaidenInfo"></a>

### RaidenInfo



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| error | [string](#string) |  |  |
| address | [string](#string) |  |  |
| channels | [int32](#int32) |  |  |
| version | [string](#string) |  |  |






<a name="xudrpc.ShutdownRequest"></a>

### ShutdownRequest







<a name="xudrpc.ShutdownResponse"></a>

### ShutdownResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [string](#string) |  | A message describing the result of the shutdown request |






<a name="xudrpc.SubscribePeerOrdersRequest"></a>

### SubscribePeerOrdersRequest







<a name="xudrpc.SubscribePeerOrdersResponse"></a>

### SubscribePeerOrdersResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| order | [Order](#xudrpc.Order) |  |  |






<a name="xudrpc.SubscribeSwapsRequest"></a>

### SubscribeSwapsRequest







<a name="xudrpc.SubscribeSwapsResponse"></a>

### SubscribeSwapsResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| order | [string](#string) |  | The order which was executed for the swap with updated remaining quantity |






<a name="xudrpc.SwapPayload"></a>

### SwapPayload



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| role | [string](#string) |  |  |
| sending_amount | [uint64](#uint64) |  |  |
| sending_token | [string](#string) |  |  |
| receiving_amount | [uint64](#uint64) |  |  |
| receiving_token | [string](#string) |  |  |
| node_pub_key | [string](#string) |  |  |





 

 

 


<a name="xudrpc.Xud"></a>

### Xud


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| CancelOrder | [CancelOrderRequest](#xudrpc.CancelOrderRequest) | [CancelOrderResponse](#xudrpc.CancelOrderResponse) | Cancel placed order from the orderbook. |
| ChannelBalance | [ChannelBalanceRequest](#xudrpc.ChannelBalanceRequest) | [ChannelBalanceResponse](#xudrpc.ChannelBalanceResponse) | Get the total balance available across all channels for a given currency. |
| Connect | [ConnectRequest](#xudrpc.ConnectRequest) | [ConnectResponse](#xudrpc.ConnectResponse) | Connect to an XU node. |
| Disconnect | [DisconnectRequest](#xudrpc.DisconnectRequest) | [DisconnectResponse](#xudrpc.DisconnectResponse) | Disconnect from a connected peer XU node. |
| ExecuteSwap | [ExecuteSwapRequest](#xudrpc.ExecuteSwapRequest) | [ExecuteSwapResponse](#xudrpc.ExecuteSwapResponse) | Execute an atomic swap |
| GetInfo | [GetInfoRequest](#xudrpc.GetInfoRequest) | [GetInfoResponse](#xudrpc.GetInfoResponse) | Get general information about this Exchange Union node. |
| GetPairs | [GetPairsRequest](#xudrpc.GetPairsRequest) | [GetPairsResponse](#xudrpc.GetPairsResponse) | Get the list of the order book&#39;s available pairs. |
| GetOrders | [GetOrdersRequest](#xudrpc.GetOrdersRequest) | [GetOrdersResponse](#xudrpc.GetOrdersResponse) | Get a list of standing orders from the order book. |
| ListPeers | [ListPeersRequest](#xudrpc.ListPeersRequest) | [ListPeersResponse](#xudrpc.ListPeersResponse) | Get a list of connected peers. |
| PlaceOrder | [PlaceOrderRequest](#xudrpc.PlaceOrderRequest) | [PlaceOrderResponse](#xudrpc.PlaceOrderResponse) | Add an order to the order book. If price is zero or unspecified a market order will get added. |
| Shutdown | [ShutdownRequest](#xudrpc.ShutdownRequest) | [ShutdownResponse](#xudrpc.ShutdownResponse) | Begin shutting down xud. |
| SubscribePeerOrders | [SubscribePeerOrdersRequest](#xudrpc.SubscribePeerOrdersRequest) | [SubscribePeerOrdersResponse](#xudrpc.SubscribePeerOrdersResponse) stream | Subscribe to peer order events. |
| SubscribeSwaps | [SubscribeSwapsRequest](#xudrpc.SubscribeSwapsRequest) | [SubscribeSwapsResponse](#xudrpc.SubscribeSwapsResponse) stream | Subscribe executed swaps. |

 



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

