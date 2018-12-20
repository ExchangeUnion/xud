enum PacketType {
  Hello = 0,
  HelloRequest = 1,
  HelloResponse = 2,
  NodeStateUpdate = 3,
  Disconnecting = 4,
  Ping = 5,
  Pong = 6,
  Order = 7,
  OrderInvalidation = 8,
  GetOrders = 9,
  Orders = 10,
  GetNodes = 11,
  Nodes = 12,
  SwapRequest = 13,
  SwapAccepted = 14,
  SwapComplete = 15,
  SwapFailed = 16,
}

export default PacketType;
