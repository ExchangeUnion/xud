import { Socket } from 'net';

/** Represents a network address */
class NetAddress {
  get hostname(): string {
    return `${this.host}:${this.port}`;
  }

  constructor(public host, public port) {}

  static fromSocket(socket: Socket) {
    const { remoteAddress: host, remotePort: port } = socket;
    return new NetAddress(host, port);
  }
}

export default NetAddress;
