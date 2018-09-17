# Protocol Documentation
<a name="top"></a>

## Table of Contents

- [xudrpc.proto](#xudrpc.proto)
    - [AddCurrencyRequest](#xudrpc.AddCurrencyRequest)
    - [AddCurrencyResponse](#xudrpc.AddCurrencyResponse)
    - [AddPairRequest](#xudrpc.AddPairRequest)
    - [AddPairResponse](#xudrpc.AddPairResponse)
    - [CancelOrderRequest](#xudrpc.CancelOrderRequest)
    - [CancelOrderResponse](#xudrpc.CancelOrderResponse)
    - [ChannelBalanceRequest](#xudrpc.ChannelBalanceRequest)
    - [ChannelBalanceResponse](#xudrpc.ChannelBalanceResponse)
    - [ConnectRequest](#xudrpc.ConnectRequest)
    - [ConnectResponse](#xudrpc.ConnectResponse)
    - [DisconnectRequest](#xudrpc.DisconnectRequest)
    - [DisconnectResponse](#xudrpc.DisconnectResponse)
    - [GetInfoRequest](#xudrpc.GetInfoRequest)
    - [GetInfoResponse](#xudrpc.GetInfoResponse)
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
    - [OrderMatch](#xudrpc.OrderMatch)
    - [Orders](#xudrpc.Orders)
    - [OrdersCount](#xudrpc.OrdersCount)
    - [Peer](#xudrpc.Peer)
    - [PlaceOrderRequest](#xudrpc.PlaceOrderRequest)
    - [PlaceOrderResponse](#xudrpc.PlaceOrderResponse)
    - [RaidenInfo](#xudrpc.RaidenInfo)
    - [RemoveCurrencyRequest](#xudrpc.RemoveCurrencyRequest)
    - [RemoveCurrencyResponse](#xudrpc.RemoveCurrencyResponse)
    - [RemovePairRequest](#xudrpc.RemovePairRequest)
    - [RemovePairResponse](#xudrpc.RemovePairResponse)
    - [ShutdownRequest](#xudrpc.ShutdownRequest)
    - [ShutdownResponse](#xudrpc.ShutdownResponse)
    - [SubscribePeerOrdersRequest](#xudrpc.SubscribePeerOrdersRequest)
    - [SubscribePeerOrdersResponse](#xudrpc.SubscribePeerOrdersResponse)
    - [SubscribeSwapsRequest](#xudrpc.SubscribeSwapsRequest)
    - [SubscribeSwapsResponse](#xudrpc.SubscribeSwapsResponse)
    - [SwapPayload](#xudrpc.SwapPayload)
  
    - [AddCurrencyRequest.SwapClient](#xudrpc.AddCurrencyRequest.SwapClient)
  
  
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
| swap_client | [AddCurrencyRequest.SwapClient](#xudrpc.AddCurrencyRequest.SwapClient) |  | The payment channel network client to use for executing swaps |
| token_address | [string](#string) |  | The contract address for layered tokens such as ERC20 |
| decimal_places | [uint32](#uint32) |  | The number of places to the right of the decimal point of the smallest subunit of the currency. For example, BTC, LTC, and others where the smallest subunits (satoshis) are 0.00000001 full units (bitcoins) have 8 decimal places. ETH has 18. This can be thought of as the base 10 exponent of the smallest subunit expressed as a positive integer. A default value of 8 is used if unspecified. |






<a name="xudrpc.AddCurrencyResponse"></a>

### AddCurrencyResponse







<a name="xudrpc.AddPairRequest"></a>

### AddPairRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| base_currency | [string](#string) |  | The base currency that is bought and sold for this trading pair |
| quote_currency | [string](#string) |  | The currency used to quote a price for the base currency |






<a name="xudrpc.AddPairResponse"></a>

### AddPairResponse







<a name="xudrpc.CancelOrderRequest"></a>

### CancelOrderRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| order_id | [string](#string) |  | The local id of the order to cancel |






<a name="xudrpc.CancelOrderResponse"></a>

### CancelOrderResponse







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







<a name="xudrpc.DisconnectRequest"></a>

### DisconnectRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| node_pub_key | [string](#string) |  |  |






<a name="xudrpc.DisconnectResponse"></a>

### DisconnectResponse







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
| include_own_orders | [bool](#bool) |  | Whether own orders should be included in result or not |






<a name="xudrpc.GetOrdersResponse"></a>

### GetOrdersResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| orders | [GetOrdersResponse.OrdersEntry](#xudrpc.GetOrdersResponse.OrdersEntry) | repeated | A map between pair ids and their buy and sell orders |






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
| currencies | [string](#string) | repeated | The ticker symbols of supported currencies |






<a name="xudrpc.ListPairsRequest"></a>

### ListPairsRequest







<a name="xudrpc.ListPairsResponse"></a>

### ListPairsResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| pairs | [string](#string) | repeated | The supported trading pair tickers in formats like &#34;LTC/BTC&#34; |






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






<a name="xudrpc.RemoveCurrencyRequest"></a>

### RemoveCurrencyRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| currency | [string](#string) |  | The ticker symbol for this currency such as BTC, LTC, ETH, etc... |






<a name="xudrpc.RemoveCurrencyResponse"></a>

### RemoveCurrencyResponse







<a name="xudrpc.RemovePairRequest"></a>

### RemovePairRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| pair_id | [string](#string) |  | The trading pair ticker to remove, such as &#34;LTC/BTC&#34; |






<a name="xudrpc.RemovePairResponse"></a>

### RemovePairResponse







<a name="xudrpc.ShutdownRequest"></a>

### ShutdownRequest







<a name="xudrpc.ShutdownResponse"></a>

### ShutdownResponse







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





 


<a name="xudrpc.AddCurrencyRequest.SwapClient"></a>

### AddCurrencyRequest.SwapClient


| Name | Number | Description |
| ---- | ------ | ----------- |
| LND | 0 |  |
| RAIDEN | 1 |  |


 

 


<a name="xudrpc.Xud"></a>

### Xud


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| AddCurrency | [AddCurrencyRequest](#xudrpc.AddCurrencyRequest) | [AddCurrencyResponse](#xudrpc.AddCurrencyResponse) | Add a currency to the list of supported currencies. |
| AddPair | [AddPairRequest](#xudrpc.AddPairRequest) | [AddPairResponse](#xudrpc.AddPairResponse) | Add a trading pair to the list of supported trading pairs. |
| CancelOrder | [CancelOrderRequest](#xudrpc.CancelOrderRequest) | [CancelOrderResponse](#xudrpc.CancelOrderResponse) | Cancel placed order from the orderbook. |
| ChannelBalance | [ChannelBalanceRequest](#xudrpc.ChannelBalanceRequest) | [ChannelBalanceResponse](#xudrpc.ChannelBalanceResponse) | Get the total balance available across all channels for a given currency. |
| Connect | [ConnectRequest](#xudrpc.ConnectRequest) | [ConnectResponse](#xudrpc.ConnectResponse) | Connect to an XU node. |
| Disconnect | [DisconnectRequest](#xudrpc.DisconnectRequest) | [DisconnectResponse](#xudrpc.DisconnectResponse) | Disconnect from a connected peer XU node. |
| GetInfo | [GetInfoRequest](#xudrpc.GetInfoRequest) | [GetInfoResponse](#xudrpc.GetInfoResponse) | Get general information about this Exchange Union node. |
| GetOrders | [GetOrdersRequest](#xudrpc.GetOrdersRequest) | [GetOrdersResponse](#xudrpc.GetOrdersResponse) | Get a map between pair ids and their buy and sell orders from the order book. |
| ListCurrencies | [ListCurrenciesRequest](#xudrpc.ListCurrenciesRequest) | [ListCurrenciesResponse](#xudrpc.ListCurrenciesResponse) | Get the list of the order book&#39;s supported currencies. |
| ListPairs | [ListPairsRequest](#xudrpc.ListPairsRequest) | [ListPairsResponse](#xudrpc.ListPairsResponse) | Get the list of the order book&#39;s suported trading pairs. |
| ListPeers | [ListPeersRequest](#xudrpc.ListPeersRequest) | [ListPeersResponse](#xudrpc.ListPeersResponse) | Get a list of connected peers. |
| PlaceOrder | [PlaceOrderRequest](#xudrpc.PlaceOrderRequest) | [PlaceOrderResponse](#xudrpc.PlaceOrderResponse) | Add an order to the order book. If price is zero or unspecified a market order will get added. |
| RemoveCurrency | [RemoveCurrencyRequest](#xudrpc.RemoveCurrencyRequest) | [RemoveCurrencyResponse](#xudrpc.RemoveCurrencyResponse) | Remove a currency. |
| RemovePair | [RemovePairRequest](#xudrpc.RemovePairRequest) | [RemovePairResponse](#xudrpc.RemovePairResponse) | Remove a trading pair. |
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

