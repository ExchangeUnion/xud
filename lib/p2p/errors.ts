import SocketAddress from './SocketAddress';

class P2PError {
  constructor(public message: string) {}

  public toString() {
    return this.message;
  }
}

export default {
  ADDRESS_ALREADY_CONNECTED: (socketAddress: SocketAddress) => new P2PError(`SocketAddress (${socketAddress}) already connected`),
};
