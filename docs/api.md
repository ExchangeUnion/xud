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
    - [Chain](#xudrpc.Chain)
    - [ChannelBalance](#xudrpc.ChannelBalance)
    - [ChannelBalanceRequest](#xudrpc.ChannelBalanceRequest)
    - [ChannelBalanceResponse](#xudrpc.ChannelBalanceResponse)
    - [ChannelBalanceResponse.BalancesEntry](#xudrpc.ChannelBalanceResponse.BalancesEntry)
    - [ConnectRequest](#xudrpc.ConnectRequest)
    - [ConnectResponse](#xudrpc.ConnectResponse)
    - [CreateNodeRequest](#xudrpc.CreateNodeRequest)
    - [CreateNodeResponse](#xudrpc.CreateNodeResponse)
    - [DiscoverNodesRequest](#xudrpc.DiscoverNodesRequest)
    - [DiscoverNodesResponse](#xudrpc.DiscoverNodesResponse)
    - [ExecuteSwapRequest](#xudrpc.ExecuteSwapRequest)
    - [GetInfoRequest](#xudrpc.GetInfoRequest)
    - [GetInfoResponse](#xudrpc.GetInfoResponse)
    - [GetInfoResponse.LndEntry](#xudrpc.GetInfoResponse.LndEntry)
    - [GetNodeInfoRequest](#xudrpc.GetNodeInfoRequest)
    - [GetNodeInfoResponse](#xudrpc.GetNodeInfoResponse)
    - [ListCurrenciesRequest](#xudrpc.ListCurrenciesRequest)
    - [ListCurrenciesResponse](#xudrpc.ListCurrenciesResponse)
    - [ListOrdersRequest](#xudrpc.ListOrdersRequest)
    - [ListOrdersResponse](#xudrpc.ListOrdersResponse)
    - [ListOrdersResponse.OrdersEntry](#xudrpc.ListOrdersResponse.OrdersEntry)
    - [ListPairsRequest](#xudrpc.ListPairsRequest)
    - [ListPairsResponse](#xudrpc.ListPairsResponse)
    - [ListPeersRequest](#xudrpc.ListPeersRequest)
    - [ListPeersResponse](#xudrpc.ListPeersResponse)
    - [LndChannels](#xudrpc.LndChannels)
    - [LndInfo](#xudrpc.LndInfo)
    - [Order](#xudrpc.Order)
    - [OrderRemoval](#xudrpc.OrderRemoval)
    - [OrderUpdate](#xudrpc.OrderUpdate)
    - [Orders](#xudrpc.Orders)
    - [OrdersCount](#xudrpc.OrdersCount)
    - [Peer](#xudrpc.Peer)
    - [Peer.LndPubKeysEntry](#xudrpc.Peer.LndPubKeysEntry)
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
    - [SubscribeOrdersRequest](#xudrpc.SubscribeOrdersRequest)
    - [SubscribeSwapsRequest](#xudrpc.SubscribeSwapsRequest)
    - [SwapFailure](#xudrpc.SwapFailure)
    - [SwapSuccess](#xudrpc.SwapSuccess)
    - [UnbanRequest](#xudrpc.UnbanRequest)
    - [UnbanResponse](#xudrpc.UnbanResponse)
    - [UnlockNodeRequest](#xudrpc.UnlockNodeRequest)
    - [UnlockNodeResponse](#xudrpc.UnlockNodeResponse)
  
    - [AddCurrencyRequest.SwapClient](#xudrpc.AddCurrencyRequest.SwapClient)
    - [OrderSide](#xudrpc.OrderSide)
    - [SwapSuccess.Role](#xudrpc.SwapSuccess.Role)
  
  
    - [Xud](#xudrpc.Xud)
    - [XudInit](#xudrpc.XudInit)
  

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







<a name="xudrpc.Chain"></a>

### Chain



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| chain | [string](#string) |  | The blockchain the swap client is on (eg bitcoin, litecoin) |
| network | [string](#string) |  | The network the swap client is on (eg regtest, testnet, mainnet) |






<a name="xudrpc.ChannelBalance"></a>

### ChannelBalance



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| balance | [uint64](#uint64) |  | Sum of channel balances denominated in satoshis. |
| pending_open_balance | [uint64](#uint64) |  | Sum of pending channel balances denominated in satoshis. |






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







<a name="xudrpc.CreateNodeRequest"></a>

### CreateNodeRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| password | [string](#string) |  | The password in utf-8 with which to encrypt the new xud node key as well as underlying client wallets such as lnd. |






<a name="xudrpc.CreateNodeResponse"></a>

### CreateNodeResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| seed_mnemonic | [string](#string) | repeated |  |






<a name="xudrpc.DiscoverNodesRequest"></a>

### DiscoverNodesRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| peer_pub_key | [string](#string) |  | The node pub key of the peer to discover nodes from. |






<a name="xudrpc.DiscoverNodesResponse"></a>

### DiscoverNodesResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| num_nodes | [uint32](#uint32) |  |  |






<a name="xudrpc.ExecuteSwapRequest"></a>

### ExecuteSwapRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| order_id | [string](#string) |  | The order id of the maker order. |
| pair_id | [string](#string) |  | The trading pair of the swap orders. |
| peer_pub_key | [string](#string) |  | The node pub key of the peer which owns the maker order. This is optional but helps locate the order more quickly. |
| quantity | [uint64](#uint64) |  | The quantity to swap denominated in satoshis. The whole order will be swapped if unspecified. |






<a name="xudrpc.GetInfoRequest"></a>

### GetInfoRequest







<a name="xudrpc.GetInfoResponse"></a>

### GetInfoResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| version | [string](#string) |  | The version of this instance of xud. |
| node_pub_key | [string](#string) |  | The node pub key of this node. |
| uris | [string](#string) | repeated | A list of uris that can be used to connect to this node. These are shared with peers. |
| num_peers | [uint32](#uint32) |  | The number of currently connected peers. |
| num_pairs | [uint32](#uint32) |  | The number of supported trading pairs. |
| orders | [OrdersCount](#xudrpc.OrdersCount) |  | The number of active, standing orders in the order book. |
| lnd | [GetInfoResponse.LndEntry](#xudrpc.GetInfoResponse.LndEntry) | repeated |  |
| raiden | [RaidenInfo](#xudrpc.RaidenInfo) |  |  |






<a name="xudrpc.GetInfoResponse.LndEntry"></a>

### GetInfoResponse.LndEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [LndInfo](#xudrpc.LndInfo) |  |  |






<a name="xudrpc.GetNodeInfoRequest"></a>

### GetNodeInfoRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| node_pub_key | [string](#string) |  | The node pub key of the node for which to get information. |






<a name="xudrpc.GetNodeInfoResponse"></a>

### GetNodeInfoResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| reputationScore | [sint32](#sint32) |  | The node&#39;s reputation score. Points are subtracted for unexpected or potentially malicious behavior. Points are added when swaps are successfully executed. |
| banned | [bool](#bool) |  | Whether the node is currently banned. |






<a name="xudrpc.ListCurrenciesRequest"></a>

### ListCurrenciesRequest







<a name="xudrpc.ListCurrenciesResponse"></a>

### ListCurrenciesResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| currencies | [string](#string) | repeated | A list of ticker symbols of the supported currencies. |






<a name="xudrpc.ListOrdersRequest"></a>

### ListOrdersRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| pair_id | [string](#string) |  | The trading pair for which to retrieve orders. |
| include_own_orders | [bool](#bool) |  | Whether own orders should be included in result or not. |
| limit | [uint32](#uint32) |  | The maximum number of orders to return from each side of the order book. |






<a name="xudrpc.ListOrdersResponse"></a>

### ListOrdersResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| orders | [ListOrdersResponse.OrdersEntry](#xudrpc.ListOrdersResponse.OrdersEntry) | repeated | A map between pair ids and their buy and sell orders. |






<a name="xudrpc.ListOrdersResponse.OrdersEntry"></a>

### ListOrdersResponse.OrdersEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [Orders](#xudrpc.Orders) |  |  |






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
| active | [uint32](#uint32) |  | The number of active/online channels for this lnd instance that can be used for swaps. |
| inactive | [uint32](#uint32) |  | The number of inactive/offline channels for this lnd instance. |
| pending | [uint32](#uint32) |  | The number of channels that are pending on-chain confirmation before they can be used. |






<a name="xudrpc.LndInfo"></a>

### LndInfo



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| error | [string](#string) |  |  |
| channels | [LndChannels](#xudrpc.LndChannels) |  |  |
| chains | [Chain](#xudrpc.Chain) | repeated |  |
| blockheight | [uint32](#uint32) |  |  |
| uris | [string](#string) | repeated |  |
| version | [string](#string) |  |  |
| alias | [string](#string) |  |  |






<a name="xudrpc.Order"></a>

### Order



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| price | [double](#double) |  | The price of the order. |
| quantity | [uint64](#uint64) |  | The quantity of the order in satoshis. |
| pair_id | [string](#string) |  | The trading pair that this order is for. |
| id | [string](#string) |  | A UUID for this order. |
| peer_pub_key | [string](#string) |  | The node pub key of the peer that created this order. |
| local_id | [string](#string) |  | The local id for this order. |
| created_at | [uint64](#uint64) |  | The epoch time when this order was created. |
| side | [OrderSide](#xudrpc.OrderSide) |  | Whether this order is a buy or sell |
| is_own_order | [bool](#bool) |  | Whether this order is a local own order or a remote peer order. |
| hold | [uint64](#uint64) |  | The quantity on hold pending swap execution. |






<a name="xudrpc.OrderRemoval"></a>

### OrderRemoval



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| quantity | [uint64](#uint64) |  | The quantity removed from the order. |
| pair_id | [string](#string) |  | The trading pair that the order is for. |
| order_id | [string](#string) |  | The global UUID for the order. |
| local_id | [string](#string) |  | The local id for the order, if applicable. |
| is_own_order | [bool](#bool) |  | Whether the order being removed is a local own order or a remote peer order. |






<a name="xudrpc.OrderUpdate"></a>

### OrderUpdate



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| order | [Order](#xudrpc.Order) |  | An order that was added to the order book. |
| order_removal | [OrderRemoval](#xudrpc.OrderRemoval) |  | An order (or portion thereof) that was removed from the order book. |






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
| peer | [uint32](#uint32) |  | The number of orders belonging to remote xud nodes. |
| own | [uint32](#uint32) |  | The number of orders belonging to our local xud node. |






<a name="xudrpc.Peer"></a>

### Peer



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| address | [string](#string) |  | The socket address with host and port for this peer. |
| node_pub_key | [string](#string) |  | The node pub key to uniquely identify this peer. |
| lnd_pub_keys | [Peer.LndPubKeysEntry](#xudrpc.Peer.LndPubKeysEntry) | repeated | A map of ticker symbols to lnd pub keys for this peer |
| inbound | [bool](#bool) |  | Indicates whether this peer was connected inbound. |
| pairs | [string](#string) | repeated | A list of trading pair tickers supported by this peer. |
| xud_version | [string](#string) |  | The version of xud being used by the peer. |
| seconds_connected | [uint32](#uint32) |  | The time in seconds that we have been connected to this peer. |
| raiden_address | [string](#string) |  | The raiden address for this peer |






<a name="xudrpc.Peer.LndPubKeysEntry"></a>

### Peer.LndPubKeysEntry



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| key | [string](#string) |  |  |
| value | [string](#string) |  |  |






<a name="xudrpc.PlaceOrderEvent"></a>

### PlaceOrderEvent



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| internal_match | [Order](#xudrpc.Order) |  | An own order (or portion thereof) that matched the newly placed order. |
| swap_success | [SwapSuccess](#xudrpc.SwapSuccess) |  | A successful swap of a peer order that matched the newly placed order. |
| remaining_order | [Order](#xudrpc.Order) |  | The remaining portion of the order, after matches, that enters the order book. |
| swap_failure | [SwapFailure](#xudrpc.SwapFailure) |  | A swap attempt that failed. |






<a name="xudrpc.PlaceOrderRequest"></a>

### PlaceOrderRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| price | [double](#double) |  | The price of the order. |
| quantity | [uint64](#uint64) |  | The quantity of the order denominated in satoshis. |
| pair_id | [string](#string) |  | The trading pair that the order is for. |
| order_id | [string](#string) |  | The local id to assign to the order. |
| side | [OrderSide](#xudrpc.OrderSide) |  | Whether the order is a buy or sell. |






<a name="xudrpc.PlaceOrderResponse"></a>

### PlaceOrderResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| internal_matches | [Order](#xudrpc.Order) | repeated | A list of own orders (or portions thereof) that matched the newly placed order. |
| swap_successes | [SwapSuccess](#xudrpc.SwapSuccess) | repeated | A list of successful swaps of peer orders that matched the newly placed order. |
| remaining_order | [Order](#xudrpc.Order) |  | The remaining portion of the order, after matches, that enters the order book. |
| swap_failures | [SwapFailure](#xudrpc.SwapFailure) | repeated | A list of swap attempts that failed. |






<a name="xudrpc.RaidenInfo"></a>

### RaidenInfo



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| error | [string](#string) |  |  |
| address | [string](#string) |  |  |
| channels | [uint32](#uint32) |  |  |
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
| quantity | [uint64](#uint64) |  | The quantity to remove from the order denominated in satoshis. If zero or unspecified then the entire order is removed. |






<a name="xudrpc.RemoveOrderResponse"></a>

### RemoveOrderResponse



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| quantity_on_hold | [uint64](#uint64) |  | Any portion of the order that was on hold due to ongoing swaps at the time of the request and could not be removed until after the swaps finish. |






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







<a name="xudrpc.SubscribeOrdersRequest"></a>

### SubscribeOrdersRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| existing | [bool](#bool) |  | Whether to transmit all existing active orders upon establishing the stream. |






<a name="xudrpc.SubscribeSwapsRequest"></a>

### SubscribeSwapsRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| include_taker | [bool](#bool) |  | Whether to include the results for swaps initiated via the PlaceOrder or ExecuteSwap calls. These swap results are also returned in the responses for the respective calls. |






<a name="xudrpc.SwapFailure"></a>

### SwapFailure



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| order_id | [string](#string) |  | The global UUID for the order that failed the swap. |
| pair_id | [string](#string) |  | The trading pair that the swap is for. |
| quantity | [uint64](#uint64) |  | The order quantity that was attempted to be swapped. |
| peer_pub_key | [string](#string) |  | The node pub key of the peer that we attempted to swap with. |
| failure_reason | [string](#string) |  | The reason why the swap failed. |






<a name="xudrpc.SwapSuccess"></a>

### SwapSuccess



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| order_id | [string](#string) |  | The global UUID for the order that was swapped. |
| local_id | [string](#string) |  | The local id for the order that was swapped. |
| pair_id | [string](#string) |  | The trading pair that the swap is for. |
| quantity | [uint64](#uint64) |  | The order quantity that was swapped. |
| r_hash | [string](#string) |  | The hex-encoded payment hash for the swap. |
| amount_received | [int64](#int64) |  | The amount of the smallest base unit of the currency (like satoshis or wei) received. |
| amount_sent | [int64](#int64) |  | The amount of the smallest base unit of the currency (like satoshis or wei) sent. |
| peer_pub_key | [string](#string) |  | The node pub key of the peer that executed this order. |
| role | [SwapSuccess.Role](#xudrpc.SwapSuccess.Role) |  | Our role in the swap, either MAKER or TAKER. |
| currency_received | [string](#string) |  | The ticker symbol of the currency received. |
| currency_sent | [string](#string) |  | The ticker symbol of the currency sent. |
| r_preimage | [string](#string) |  | The hex-encoded preimage. |
| price | [double](#double) |  | The price used for the swap. |






<a name="xudrpc.UnbanRequest"></a>

### UnbanRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| node_pub_key | [string](#string) |  | The node pub key of the peer to unban. |
| reconnect | [bool](#bool) |  | Whether to attempt to connect to the peer after it is unbanned. |






<a name="xudrpc.UnbanResponse"></a>

### UnbanResponse







<a name="xudrpc.UnlockNodeRequest"></a>

### UnlockNodeRequest



| Field | Type | Label | Description |
| ----- | ---- | ----- | ----------- |
| password | [string](#string) |  | The password in utf-8 with which to unlock an existing xud node key as well as underlying client wallets such as lnd. |






<a name="xudrpc.UnlockNodeResponse"></a>

### UnlockNodeResponse






 


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



<a name="xudrpc.SwapSuccess.Role"></a>

### SwapSuccess.Role


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
| RemoveOrder | [RemoveOrderRequest](#xudrpc.RemoveOrderRequest) | [RemoveOrderResponse](#xudrpc.RemoveOrderResponse) | Removes an order from the order book by its local id. This should be called when an order is canceled or filled outside of xud. Removed orders become immediately unavailable for swaps, and peers are notified that the order is no longer valid. Any portion of the order that is on hold due to ongoing swaps will not be removed until after the swap attempts complete. |
| ChannelBalance | [ChannelBalanceRequest](#xudrpc.ChannelBalanceRequest) | [ChannelBalanceResponse](#xudrpc.ChannelBalanceResponse) | Gets the total balance available across all payment channels for one or all currencies. |
| Connect | [ConnectRequest](#xudrpc.ConnectRequest) | [ConnectResponse](#xudrpc.ConnectResponse) | Attempts to connect to a node. Once connected, the node is added to the list of peers and becomes available for swaps and trading. A handshake exchanges information about the peer&#39;s supported trading and swap clients. Orders will be shared with the peer upon connection and upon new order placements. |
| Ban | [BanRequest](#xudrpc.BanRequest) | [BanResponse](#xudrpc.BanResponse) | Bans a node and immediately disconnects from it. This can be used to prevent any connections to a specific node. |
| Unban | [UnbanRequest](#xudrpc.UnbanRequest) | [UnbanResponse](#xudrpc.UnbanResponse) | Removes a ban from a node manually and, optionally, attempts to connect to it. |
| GetInfo | [GetInfoRequest](#xudrpc.GetInfoRequest) | [GetInfoResponse](#xudrpc.GetInfoResponse) | Gets general information about this node. |
| GetNodeInfo | [GetNodeInfoRequest](#xudrpc.GetNodeInfoRequest) | [GetNodeInfoResponse](#xudrpc.GetNodeInfoResponse) | Gets general information about a node. |
| ListOrders | [ListOrdersRequest](#xudrpc.ListOrdersRequest) | [ListOrdersResponse](#xudrpc.ListOrdersResponse) | Gets orders from the order book. This call returns the state of the order book at a given point in time, although it is not guaranteed to still be vaild by the time a response is received and processed by a client. It accepts an optional trading pair id parameter. If specified, only orders for that particular trading pair are returned. Otherwise, all orders are returned. Orders are separated into buys and sells for each trading pair, but unsorted. |
| ListCurrencies | [ListCurrenciesRequest](#xudrpc.ListCurrenciesRequest) | [ListCurrenciesResponse](#xudrpc.ListCurrenciesResponse) | Gets a list of this node&#39;s supported currencies. |
| ListPairs | [ListPairsRequest](#xudrpc.ListPairsRequest) | [ListPairsResponse](#xudrpc.ListPairsResponse) | Gets a list of this nodes suported trading pairs. |
| ListPeers | [ListPeersRequest](#xudrpc.ListPeersRequest) | [ListPeersResponse](#xudrpc.ListPeersResponse) | Gets a list of connected peers. |
| PlaceOrder | [PlaceOrderRequest](#xudrpc.PlaceOrderRequest) | [PlaceOrderEvent](#xudrpc.PlaceOrderEvent) stream | Adds an order to the order book. If price is zero or unspecified a market order will get added. |
| PlaceOrderSync | [PlaceOrderRequest](#xudrpc.PlaceOrderRequest) | [PlaceOrderResponse](#xudrpc.PlaceOrderResponse) | The synchronous non-streaming version of PlaceOrder. |
| ExecuteSwap | [ExecuteSwapRequest](#xudrpc.ExecuteSwapRequest) | [SwapSuccess](#xudrpc.SwapSuccess) | Execute a swap on a maker peer order |
| RemoveCurrency | [RemoveCurrencyRequest](#xudrpc.RemoveCurrencyRequest) | [RemoveCurrencyResponse](#xudrpc.RemoveCurrencyResponse) | Removes a currency from the list of supported currencies. Only currencies that are not in use for any currently supported trading pairs may be removed. Once removed, the currency can no longer be used for any supported trading pairs. |
| RemovePair | [RemovePairRequest](#xudrpc.RemovePairRequest) | [RemovePairResponse](#xudrpc.RemovePairResponse) | Removes a trading pair from the list of currently supported trading pair. This call will effectively cancel any standing orders for that trading pair. Peers are informed when a pair is no longer supported so that they will know to stop sending orders for it. |
| DiscoverNodes | [DiscoverNodesRequest](#xudrpc.DiscoverNodesRequest) | [DiscoverNodesResponse](#xudrpc.DiscoverNodesResponse) | Discover nodes from a specific peer and apply new connections |
| Shutdown | [ShutdownRequest](#xudrpc.ShutdownRequest) | [ShutdownResponse](#xudrpc.ShutdownResponse) | Begin gracefully shutting down xud. |
| SubscribeOrders | [SubscribeOrdersRequest](#xudrpc.SubscribeOrdersRequest) | [OrderUpdate](#xudrpc.OrderUpdate) stream | Subscribes to orders being added to and removed from the order book. This call allows the client to maintain an up-to-date view of the order book. For example, an exchange that wants to show its users a real time view of the orders available to them would subscribe to this streaming call to be alerted as new orders are added and expired orders are removed. |
| SubscribeSwaps | [SubscribeSwapsRequest](#xudrpc.SubscribeSwapsRequest) | [SwapSuccess](#xudrpc.SwapSuccess) stream | Subscribes to completed swaps. By default, only swaps that are initiated by a remote peer are transmitted unless a flag is set to include swaps initiated by the local node. This call allows the client to get real-time notifications when its orders are filled by a peer. It can be used for tracking order executions, updating balances, and informing a trader when one of their orders is settled through the Exchange Union network. |
| SubscribeSwapFailures | [SubscribeSwapsRequest](#xudrpc.SubscribeSwapsRequest) | [SwapFailure](#xudrpc.SwapFailure) stream | Subscribes to failed swaps. By default, only swaps that are initiated by a remote peer are transmitted unless a flag is set to include swaps initiated by the local node. This call allows the client to get real-time notifications when swap attempts are failing. It can be used for status monitoring, debugging, and testing purposes. |


<a name="xudrpc.XudInit"></a>

### XudInit


| Method Name | Request Type | Response Type | Description |
| ----------- | ------------ | ------------- | ------------|
| CreateNode | [CreateNodeRequest](#xudrpc.CreateNodeRequest) | [CreateNodeResponse](#xudrpc.CreateNodeResponse) |  |
| UnlockNode | [UnlockNodeRequest](#xudrpc.UnlockNodeRequest) | [UnlockNodeResponse](#xudrpc.UnlockNodeResponse) |  |

 



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

