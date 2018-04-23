## Classes

<dl>
<dt><a href="#LndClient">LndClient</a></dt>
<dd><p>A class representing a client to interact with a running lnd instance.</p>
</dd>
<dt><a href="#P2P">P2P</a></dt>
<dd><p>Class representing a pool of XU peers</p>
</dd>
<dt><a href="#P2PServer">P2PServer</a></dt>
<dd><p>Class representing a server that accepts incoming peer connections</p>
</dd>
<dt><a href="#RpcMethods">RpcMethods</a></dt>
<dd><p>Class containing the available RPC methods for Exchange Union</p>
</dd>
<dt><a href="#RpcServer">RpcServer</a></dt>
<dd><p>Class representing an Exchange Union RPC Server.</p>
</dd>
<dt><a href="#Xud">Xud</a></dt>
<dd><p>Class representing a complete Exchange Union daemon.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#isObject">isObject()</a> ⇒ <code>boolean</code></dt>
<dd><p>Check whether a variable is a non-array object</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Orders">Orders</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Order">Order</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="LndClient"></a>

## LndClient
A class representing a client to interact with a running lnd instance.

**Kind**: global class  

* [LndClient](#LndClient)
    * [new LndClient(options)](#new_LndClient_new)
    * [.getInfo()](#LndClient+getInfo)
    * [.addInvoice(value)](#LndClient+addInvoice)
    * [.payInvoice(payment_request)](#LndClient+payInvoice)

<a name="new_LndClient_new"></a>

### new LndClient(options)
Create an lnd client.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The lnd configuration |

<a name="LndClient+getInfo"></a>

### lndClient.getInfo()
Return general information concerning the lightning node including it’s identity pubkey,alias, the chains it is connected to, and information concerning the number ofopen+pending channels.

**Kind**: instance method of [<code>LndClient</code>](#LndClient)  
<a name="LndClient+addInvoice"></a>

### lndClient.addInvoice(value)
Attempt to add a new invoice to the lnd invoice database.

**Kind**: instance method of [<code>LndClient</code>](#LndClient)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | The value of this invoice in satoshis |

<a name="LndClient+payInvoice"></a>

### lndClient.payInvoice(payment_request)
Pay an invoice through the Lightning Network.

**Kind**: instance method of [<code>LndClient</code>](#LndClient)  

| Param | Type | Description |
| --- | --- | --- |
| payment_request | <code>string</code> | An invoice for a payment within the Lightning Network. |

<a name="P2P"></a>

## P2P
Class representing a pool of XU peers

**Kind**: global class  

* [P2P](#P2P)
    * [new P2P()](#new_P2P_new)
    * [.broadcast(type, object)](#P2P+broadcast)
    * [.connect(host, port)](#P2P+connect)
    * [.closeAllConnections()](#P2P+closeAllConnections)
    * [.addPeer(peer)](#P2P+addPeer)

<a name="new_P2P_new"></a>

### new P2P()
Create a pool of XU peers.

<a name="P2P+broadcast"></a>

### p2P.broadcast(type, object)
Broadcast a message to all peers.

**Kind**: instance method of [<code>P2P</code>](#P2P)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of message to broadcast. |
| object | <code>Object</code> | The JSON body of the message to be converted and sent as a string. |

<a name="P2P+connect"></a>

### p2P.connect(host, port)
Connect to an XU peer on a given host and port.

**Kind**: instance method of [<code>P2P</code>](#P2P)  

| Param | Type |
| --- | --- |
| host | <code>string</code> | 
| port | <code>number</code> | 

<a name="P2P+closeAllConnections"></a>

### p2P.closeAllConnections()
Close all connections to peers.

**Kind**: instance method of [<code>P2P</code>](#P2P)  
<a name="P2P+addPeer"></a>

### p2P.addPeer(peer)
Add a peer to the list of peers and set handlers for socket events.

**Kind**: instance method of [<code>P2P</code>](#P2P)  

| Param | Type |
| --- | --- |
| peer | <code>net.Socket</code> | 

<a name="P2PServer"></a>

## P2PServer
Class representing a server that accepts incoming peer connections

**Kind**: global class  

* [P2PServer](#P2PServer)
    * [new P2PServer()](#new_P2PServer_new)
    * [.listen(port)](#P2PServer+listen)
    * [.close()](#P2PServer+close)

<a name="new_P2PServer_new"></a>

### new P2PServer()
Create a server to accept incoming peer connections

<a name="P2PServer+listen"></a>

### p2PServer.listen(port)
Start listening for incoming connections on a given port.

**Kind**: instance method of [<code>P2PServer</code>](#P2PServer)  

| Param | Type |
| --- | --- |
| port | <code>number</code> | 

<a name="P2PServer+close"></a>

### p2PServer.close()
Stop listening for incoming connections.

**Kind**: instance method of [<code>P2PServer</code>](#P2PServer)  
<a name="RpcMethods"></a>

## RpcMethods
Class containing the available RPC methods for Exchange Union

**Kind**: global class  

* [RpcMethods](#RpcMethods)
    * [new RpcMethods()](#new_RpcMethods_new)
    * [.getInfo()](#RpcMethods+getInfo) ⇒ <code>object</code>
    * [.getPairs()](#RpcMethods+getPairs) ⇒ <code>Array</code>
    * [.getOrders()](#RpcMethods+getOrders) ⇒ [<code>Orders</code>](#Orders)
    * [.placeOrder(params)](#RpcMethods+placeOrder)
    * [.connect(params)](#RpcMethods+connect)
    * [.tokenSwap()](#RpcMethods+tokenSwap)
    * [.shutdown()](#RpcMethods+shutdown)

<a name="new_RpcMethods_new"></a>

### new RpcMethods()
Create an instance of available RPC methods and bind all exposed functions.

<a name="RpcMethods+getInfo"></a>

### rpcMethods.getInfo() ⇒ <code>object</code>
Placeholder for a method to return general information about an Exchange Union node.

**Kind**: instance method of [<code>RpcMethods</code>](#RpcMethods)  
<a name="RpcMethods+getPairs"></a>

### rpcMethods.getPairs() ⇒ <code>Array</code>
Get the list of the orderbook's available pairs.

**Kind**: instance method of [<code>RpcMethods</code>](#RpcMethods)  
**Returns**: <code>Array</code> - - A list of available trading pairs  
**See**: [getPairs](#OrderBook+getPairs)  
<a name="RpcMethods+getOrders"></a>

### rpcMethods.getOrders() ⇒ [<code>Orders</code>](#Orders)
Get a list of standing orders from the orderbook.

**Kind**: instance method of [<code>RpcMethods</code>](#RpcMethods)  
**See**: [OrderBook#getOrders](OrderBook#getOrders)  
<a name="RpcMethods+placeOrder"></a>

### rpcMethods.placeOrder(params)
Add an order to the orderbook.

**Kind**: instance method of [<code>RpcMethods</code>](#RpcMethods)  
**See**: [OrderBook#addOrder](OrderBook#addOrder)  

| Param | Type |
| --- | --- |
| params | <code>Object</code> | 
| params.order | <code>Object</code> | 

<a name="RpcMethods+connect"></a>

### rpcMethods.connect(params)
Connect to an XU node on a given host and port.

**Kind**: instance method of [<code>RpcMethods</code>](#RpcMethods)  
**See**: [connect](#P2P+connect)  

| Param | Type |
| --- | --- |
| params | <code>Object</code> | 
| params.host | <code>string</code> | 
| params.port | <code>number</code> | 

<a name="RpcMethods+tokenSwap"></a>

### rpcMethods.tokenSwap()
Demo method to execute a Raiden Token Swap through XUD.

**Kind**: instance method of [<code>RpcMethods</code>](#RpcMethods)  
**See**: [tokenSwap](#RaidenClient+tokenSwap)  
<a name="RpcMethods+shutdown"></a>

### rpcMethods.shutdown()
Gracefully shutdown the parent process.

**Kind**: instance method of [<code>RpcMethods</code>](#RpcMethods)  
**See**: [shutdown](#Xud+shutdown)  
<a name="RpcServer"></a>

## RpcServer
Class representing an Exchange Union RPC Server.

**Kind**: global class  

* [RpcServer](#RpcServer)
    * [new RpcServer()](#new_RpcServer_new)
    * [.listen(port)](#RpcServer+listen)
    * [.close()](#RpcServer+close)

<a name="new_RpcServer_new"></a>

### new RpcServer()
Create an RPC server.


| Param | Type | Description |
| --- | --- | --- |
| $0.orderBook | <code>OrderBook</code> |  |
| $0.lndClient | [<code>LndClient</code>](#LndClient) |  |
| $0.raidenClient | <code>RaidenClient</code> |  |
| $0.p2p | [<code>P2P</code>](#P2P) |  |
| $0.shutdown | <code>function</code> | The function to be called to shutdown the parent process |

<a name="RpcServer+listen"></a>

### rpcServer.listen(port)
Starts the server and begins listening on the provided port

**Kind**: instance method of [<code>RpcServer</code>](#RpcServer)  

| Param | Type |
| --- | --- |
| port | <code>number</code> | 

<a name="RpcServer+close"></a>

### rpcServer.close()
Closes the server and stops listening

**Kind**: instance method of [<code>RpcServer</code>](#RpcServer)  
<a name="Xud"></a>

## Xud
Class representing a complete Exchange Union daemon.

**Kind**: global class  

* [Xud](#Xud)
    * [new Xud(args)](#new_Xud_new)
    * [.start()](#Xud+start)
    * [.shutdown()](#Xud+shutdown)

<a name="new_Xud_new"></a>

### new Xud(args)
Create an Exchange Union daemon.


| Param | Type | Description |
| --- | --- | --- |
| args | <code>Object</code> | Optional command line arguments to override configuration parameters. |

<a name="Xud+start"></a>

### xud.start()
Start all processes necessary for the operation of an Exchange Union node.

**Kind**: instance method of [<code>Xud</code>](#Xud)  
<a name="Xud+shutdown"></a>

### xud.shutdown()
Gracefully end all running processes and disconnects from peers.

**Kind**: instance method of [<code>Xud</code>](#Xud)  
<a name="isObject"></a>

## isObject() ⇒ <code>boolean</code>
Check whether a variable is a non-array object

**Kind**: global function  
<a name="Orders"></a>

## Orders : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| buys | <code>Array</code> | A list of buy orders ordered by descending price |
| sells | <code>Array</code> | A list of sell orders ordered by ascending price |

<a name="Order"></a>

## Order : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| price | <code>number</code> | Price of the order |
| quantity | <code>number</code> | Order quantity |
| pairId | <code>string</code> | Trading pair for the order |

