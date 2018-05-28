import { Socket } from 'net';

/** Represents a network address */
class SocketAddress {
  constructor(public host, public port) {}

  public static fromSocket(socket: Socket) {
    const { remoteAddress: host, remotePort: port } = socket;
    return new SocketAddress(host, port);
  }

  public toString(): string {
    return `${this.host}:${this.port}`;
  }
}

export default SocketAddress;
