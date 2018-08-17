# Protocol Documentation
<a name="top"/>

## Table of Contents

- [xudrpc.proto](#xudrpc.proto)
    - [CancelOrderRequest](#xudrpc.CancelOrderRequest)
    - [CancelOrderResponse](#xudrpc.CancelOrderResponse)
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



<a name="xudrpc.proto"/>
<p align="right"><a href="#top">Top</a></p>

## xudrpc.proto



<a name="xudrpc.CancelOrderRequest"/>

### CancelOrderRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| order_id | [string](#string) |  | The local id of the order to cancel |
| pair_id | [string](#string) |  | The trading pair that the order to cancel is for |






<a name="xudrpc.CancelOrderResponse"/>

### CancelOrderResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| canceled | [bool](#bool) |  | Indicates whether an order was successfully canceled |






<a name="xudrpc.ConnectRequest"/>

### ConnectRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| host | [string](#string) |  |  |
| port | [uint32](#uint32) |  |  |
| node_pub_key | [string](#string) |  |  |






<a name="xudrpc.ConnectResponse"/>

### ConnectResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [string](#string) |  | A message describing the result of the connection request |






<a name="xudrpc.DisconnectRequest"/>

### DisconnectRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| node_pub_key | [string](#string) |  |  |






<a name="xudrpc.DisconnectResponse"/>

### DisconnectResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [string](#string) |  |  |






<a name="xudrpc.ExecuteSwapRequest"/>

### ExecuteSwapRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| target_address | [string](#string) |  |  |
| payload | [SwapPayload](#xudrpc.SwapPayload) |  |  |






<a name="xudrpc.ExecuteSwapResponse"/>

### ExecuteSwapResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [string](#string) |  |  |






<a name="xudrpc.GetInfoRequest"/>

### GetInfoRequest







<a name="xudrpc.GetInfoResponse"/>

### GetInfoResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| num_peers | [int32](#int32) |  |  |
| num_pairs | [int32](#int32) |  |  |
| version | [string](#string) |  |  |
| orders | [OrdersCount](#xudrpc.OrdersCount) |  |  |
| lndbtc | [LndInfo](#xudrpc.LndInfo) |  |  |
| lndltc | [LndInfo](#xudrpc.LndInfo) |  |  |
| raiden | [RaidenInfo](#xudrpc.RaidenInfo) |  |  |






<a name="xudrpc.GetOrdersRequest"/>

### GetOrdersRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| pair_id | [string](#string) |  | The trading pair for which to retrieve orders |
| max_results | [uint32](#uint32) |  | The maximum number of orders to return from either side of the order book |






<a name="xudrpc.GetOrdersResponse"/>

### GetOrdersResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| peer_orders | [Orders](#xudrpc.Orders) |  | A list of peer orders |
| own_orders | [Orders](#xudrpc.Orders) |  | A list of orders placed locally |






<a name="xudrpc.GetPairsRequest"/>

### GetPairsRequest







<a name="xudrpc.GetPairsResponse"/>

### GetPairsResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| pairs | [Pair](#xudrpc.Pair) | repeated |  |






<a name="xudrpc.ListPeersRequest"/>

### ListPeersRequest







<a name="xudrpc.ListPeersResponse"/>

### ListPeersResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| peers | [Peer](#xudrpc.Peer) | repeated |  |






<a name="xudrpc.LndChannels"/>

### LndChannels



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| active | [int32](#int32) |  |  |
| inactive | [int32](#int32) |  |  |
| pending | [int32](#int32) |  |  |






<a name="xudrpc.LndInfo"/>

### LndInfo



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| error | [string](#string) |  |  |
| channels | [LndChannels](#xudrpc.LndChannels) |  |  |
| chains | [string](#string) | repeated |  |
| blockheight | [int32](#int32) |  |  |
| uris | [string](#string) | repeated |  |
| version | [string](#string) |  |  |






<a name="xudrpc.Order"/>

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






<a name="xudrpc.OrderMatch"/>

### OrderMatch



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| maker | [Order](#xudrpc.Order) |  |  |
| taker | [Order](#xudrpc.Order) |  |  |






<a name="xudrpc.Orders"/>

### Orders



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| buy_orders | [Order](#xudrpc.Order) | repeated | A list of buy orders sorted by descending price |
| sell_orders | [Order](#xudrpc.Order) | repeated | A list of sell orders sorted by ascending price |






<a name="xudrpc.OrdersCount"/>

### OrdersCount



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| peer | [int32](#int32) |  |  |
| own | [int32](#int32) |  |  |






<a name="xudrpc.Pair"/>

### Pair



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| id | [string](#string) |  |  |
| base_currency | [string](#string) |  |  |
| quote_currency | [string](#string) |  |  |
| swap_protocol | [string](#string) |  |  |






<a name="xudrpc.Peer"/>

### Peer



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| address | [string](#string) |  | The socket address with host and port for this peer |
| node_pub_key | [string](#string) |  | The node pub key to uniquely identify this peer |
| inbound | [bool](#bool) |  | Indicates whether this peer was connected inbound |
| pairs | [string](#string) | repeated | A list of trading pair tickers supported by this peer |
| xud_version | [string](#string) |  | The version of xud being used by the peer |
| seconds_connected | [int32](#int32) |  | The time in seconds that we have been connected to this peer |






<a name="xudrpc.PlaceOrderRequest"/>

### PlaceOrderRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| order | [Order](#xudrpc.Order) |  |  |






<a name="xudrpc.PlaceOrderResponse"/>

### PlaceOrderResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| matches | [OrderMatch](#xudrpc.OrderMatch) | repeated | A list of orders matching the newly placed order |
| remaining_order | [Order](#xudrpc.Order) |  | The remaining portion of the order, after matches, that enters the order book |






<a name="xudrpc.RaidenInfo"/>

### RaidenInfo



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| error | [string](#string) |  |  |
| address | [string](#string) |  |  |
| channels | [int32](#int32) |  |  |
| version | [string](#string) |  |  |






<a name="xudrpc.ShutdownRequest"/>

### ShutdownRequest







<a name="xudrpc.ShutdownResponse"/>

### ShutdownResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| result | [string](#string) |  | A message describing the result of the shutdown request |






<a name="xudrpc.SubscribePeerOrdersRequest"/>

### SubscribePeerOrdersRequest







<a name="xudrpc.SubscribePeerOrdersResponse"/>

### SubscribePeerOrdersResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| order | [Order](#xudrpc.Order) |  |  |






<a name="xudrpc.SubscribeSwapsRequest"/>

### SubscribeSwapsRequest







<a name="xudrpc.SubscribeSwapsResponse"/>

### SubscribeSwapsResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| order | [string](#string) |  | The order which was executed for the swap with updated remaining quantity |






<a name="xudrpc.SwapPayload"/>

### SwapPayload



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| role | [string](#string) |  |  |
| sending_amount | [uint64](#uint64) |  |  |
| sending_token | [string](#string) |  |  |
| receiving_amount | [uint64](#uint64) |  |  |
| receiving_token | [string](#string) |  |  |





 

 

 


<a name="xudrpc.Xud"/>

### Xud


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| CancelOrder | [CancelOrderRequest](#xudrpc.CancelOrderRequest) | [CancelOrderResponse](#xudrpc.CancelOrderRequest) | Cancel placed order from the orderbook. |
| Connect | [ConnectRequest](#xudrpc.ConnectRequest) | [ConnectResponse](#xudrpc.ConnectRequest) | Connect to an XU node. |
| Disconnect | [DisconnectRequest](#xudrpc.DisconnectRequest) | [DisconnectResponse](#xudrpc.DisconnectRequest) | Disconnect from a connected peer XU node. |
| ExecuteSwap | [ExecuteSwapRequest](#xudrpc.ExecuteSwapRequest) | [ExecuteSwapResponse](#xudrpc.ExecuteSwapRequest) | Execute an atomic swap |
| GetInfo | [GetInfoRequest](#xudrpc.GetInfoRequest) | [GetInfoResponse](#xudrpc.GetInfoRequest) | Get general information about this Exchange Union node. |
| GetPairs | [GetPairsRequest](#xudrpc.GetPairsRequest) | [GetPairsResponse](#xudrpc.GetPairsRequest) | Get the list of the order book&#39;s available pairs. |
| GetOrders | [GetOrdersRequest](#xudrpc.GetOrdersRequest) | [GetOrdersResponse](#xudrpc.GetOrdersRequest) | Get a list of standing orders from the order book. |
| ListPeers | [ListPeersRequest](#xudrpc.ListPeersRequest) | [ListPeersResponse](#xudrpc.ListPeersRequest) | Get a list of connected peers. |
| PlaceOrder | [PlaceOrderRequest](#xudrpc.PlaceOrderRequest) | [PlaceOrderResponse](#xudrpc.PlaceOrderRequest) | Add an order to the order book. If price is zero or unspecified a market order will get added. |
| Shutdown | [ShutdownRequest](#xudrpc.ShutdownRequest) | [ShutdownResponse](#xudrpc.ShutdownRequest) | Shutdown the xud daemon. |
| SubscribePeerOrders | [SubscribePeerOrdersRequest](#xudrpc.SubscribePeerOrdersRequest) | [SubscribePeerOrdersResponse](#xudrpc.SubscribePeerOrdersRequest) | Subscribe to peer order events. |
| SubscribeSwaps | [SubscribeSwapsRequest](#xudrpc.SubscribeSwapsRequest) | [SubscribeSwapsResponse](#xudrpc.SubscribeSwapsRequest) | Subscribe executed swaps. |

 



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

