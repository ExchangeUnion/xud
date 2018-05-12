import { Socket } from 'net';

/** Represents a network address */
class SocketAddress {
  constructor(public host, public port) {}

  static fromSocket(socket: Socket) {
    const { remoteAddress: host, remotePort: port } = socket;
    return new SocketAddress(host, port);
  }

  toString(): string {
    return `${this.host}:${this.port}`;
  }
}

export default SocketAddress;
