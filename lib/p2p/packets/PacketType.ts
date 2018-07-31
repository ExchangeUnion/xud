enum PacketType  {
  HELLO = 'HELLO',
  PING = 'PING',
  PONG = 'PONG',
  ORDER = 'ORDER',
  ORDER_INVALIDATION = 'ORDER_INVALIDATION',
  GET_ORDERS = 'GET_ORDERS',
  ORDERS = 'ORDERS',
  GET_HOSTS = 'GET_HOSTS',
  HOSTS = 'HOSTS',
}

export default PacketType;
