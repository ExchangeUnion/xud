import { Socket } from 'net';
import assert from 'assert';

/** Represents a network socketAddress. */
class SocketAddress {
  constructor(public address: string, public port: number) {}

  /**
   * Create a `SocketAddress` using the remote host and port of a `Socket`.
   */
  public static fromSocket = (socket: Socket) => {
    const { remoteAddress: address, remotePort: port } = socket;
    assert(address, 'socket must have a remoteAddress value');
    assert(port, 'socket must have a remotePort value');
    return new SocketAddress(address!, port!);
  }

  public static fromString = (socketAddress: string) => {
    const arr = socketAddress.split(':');
    return new SocketAddress(arr[0], parseInt(arr[1], 10));
  }

  public toString = () => {
    return `${this.address}:${this.port}`;
  }
}

export default SocketAddress;
