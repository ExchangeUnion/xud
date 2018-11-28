enum PacketType {
  Hello = 0,
  Disconnecting,
  Ping,
  Pong,
  Order,
  OrderInvalidation,
  GetOrders,
  Orders,
  GetNodes,
  Nodes,
  SwapRequest,
  SwapResponse,
  SwapComplete,
  SwapError,
}

/*
enum PacketType {
  Hello = 'HELLO',
  Disconnecting = 'DISCONNECTING',
  Ping = 'PING',
  Pong = 'PONG',
  Order = 'ORDER',
  OrderInvalidation = 'ORDER_INVALIDATION',
  GetOrders = 'GET_ORDERS',
  Orders = 'ORDERS',
  GetNodes = 'GET_NODES',
  Nodes = 'NODES',
  SwapRequest = 'SWAP_REQUEST',
  SwapResponse = 'SWAP_RESPONSE',
  SwapComplete = 'SWAP_COMPLETE',
  SwapError = 'SWAP_ERROR',
}
*/

export default PacketType;
