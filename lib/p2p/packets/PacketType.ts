enum PacketType {
  HELLO = 'HELLO',
  PING = 'PING',
  PONG = 'PONG',
  ORDER = 'ORDER',
  ORDER_INVALIDATION = 'ORDER_INVALIDATION',
  GET_ORDERS = 'GET_ORDERS',
  ORDERS = 'ORDERS',
  GET_NODES = 'GET_NODES',
  NODES = 'NODES',
}

export default PacketType;
