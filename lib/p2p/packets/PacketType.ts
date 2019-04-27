enum PacketType {
  SessionInit = 0,
  SessionAck = 1,
  NodeStateUpdate = 2,
  Disconnecting = 3,
  Ping = 4,
  Pong = 5,
  Order = 6,
  OrderInvalidation = 7,
  GetOrders = 8,
  Orders = 9,
  GetNodes = 10,
  Nodes = 11,
  SwapRequest = 12,
  SwapAccepted = 13,
  SwapComplete = 14,
  SwapFailed = 15,
  SanitySwap = 16,
}

export default PacketType;
