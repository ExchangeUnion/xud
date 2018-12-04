enum PacketType {
  Hello = 0,
  Disconnecting = 1,
  Ping = 2,
  Pong = 3,
  Order = 4,
  OrderInvalidation = 5,
  GetOrders = 6,
  Orders = 7,
  GetNodes = 8,
  Nodes = 9,
  SwapRequest = 10,
  SwapAccepted = 11,
  SwapComplete = 12,
  SwapFailed = 13,
}

export default PacketType;
