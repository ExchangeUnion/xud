class P2PError {
  constructor(public message: string) {}
}

export default {
  ADDRESS_ALREADY_CONNECTED: (address: string) => new P2PError(`Address (${address}) already connected`),
  NOT_CONNECTED: (address: string) => new P2PError(`Address (${address}) is not connected`),
};
