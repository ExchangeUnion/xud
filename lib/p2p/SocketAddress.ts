import { Socket } from 'net';
import assert from 'assert';
import { Address } from '../types/p2p';

/** Represents a network socket address. */
class SocketAddress {
  constructor(private host: string, private port: number) {}

  /**
   * Create a SocketAddress using the remote host and port of a socket.
   */
  public static fromSocket = (socket: Socket) => {
    const { remoteAddress: address, remotePort: port } = socket;
    assert(address, 'socket must have a remoteAddress value');
    assert(port, 'socket must have a remotePort value');
    return new SocketAddress(address!, port!);
  }

  /**
   * Create a SocketAddress from a string.
   * @param addressString a string in the "{host}:{port}" format
   * @param port a port number to use if no port is specified in the string, defaults to 8885
   */
  public static fromString = (addressString: string, port = 8885) => {
    const arr = addressString.split(':');
    return new SocketAddress(arr[0], arr[1] ? parseInt(arr[1], 10) : port);
  }

  public toString = () => {
    return `${this.host}:${this.port}`;
  }

  /**
   * Return this SocketAddress as an [[Address]] object.
   */
  public toAddress = (): Address => {
    return {
      host: this.host,
      port: this.port,
    };
  }
}

export default SocketAddress;
