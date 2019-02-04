import { Socket } from 'net';
import { Address } from '../p2p/types';
import assert from 'assert';

/** Helper methods for interacting with the [[Address]] type. */
const addressUtils = {
  /**
   * Create an [[Address]] using the remote host and port of a socket.
   */
  fromSocket: (socket: Socket): Address => {
    const { remoteAddress, remotePort } = socket;
    assert(remoteAddress, 'socket must have a remoteAddress value');
    assert(remotePort, 'socket must have a remotePort value');
    return { host: remoteAddress!, port: remotePort! };
  },

  /**
   * Create an [[Address]] from a string.
   * @param addressString a string in the "{host}:{port}" format
   * @param port a port number to use if no port is specified in the string, defaults to 8885
   */
  fromString: (addressString: string, port = 8885): Address => {
    const arr = addressString.split(':');
    return {
      host: arr[0],
      port: arr[1] ? parseInt(arr[1], 10) : port,
    };
  },

  /** Convert an [[Address]] to a string in the "{host}:{port}" format. */
  toString: (address: Address) => `${address.host}:${address.port}`,

  /** Checks whether two [[Address]] instances are equal, based solely on `host` and `port` fields */
  areEqual: (a: Address, b: Address) => a.host === b.host && a.port === b.port,

  sortByLastConnected: (addresses: Address[]) => {
    return [...addresses].sort((a, b) => {
      if (!a.lastConnected) return 1;
      if (!b.lastConnected) return -1;
      return b.lastConnected - a.lastConnected;
    });
  },
};

export default addressUtils;
