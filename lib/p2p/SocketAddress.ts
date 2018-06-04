import { Socket } from 'net';

/** Represents a network socketAddress */
class SocketAddress {
  constructor(public address, public port) {}

  public static fromSocket(socket: Socket) {
    const { remoteAddress: address, remotePort: port } = socket;
    return new SocketAddress(address, port);
  }

  public static fromString(socketAddress: string) {
    const arr = socketAddress.split(':');
    return new SocketAddress(arr[0], arr[1]);
  }

  public toString(): string {
    return `${this.address}:${this.port}`;
  }
}

export default SocketAddress;
