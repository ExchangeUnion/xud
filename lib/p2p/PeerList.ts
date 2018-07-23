import Peer from './Peer';
import SocketAddress from './SocketAddress';

class PeerList {
  private peers: { [ socketAddress: string ]: Peer } = {};

  get length(): number {
    let length = 0;

    this.forEach((peer) => {
      if (peer.connected) {
        length = length + 1;
      }
    });

    return length;
  }

  public get = (socketAddress: SocketAddress): Peer => {
    return this.peers[socketAddress.toString()];
  }

  public has = (socketAddress: SocketAddress): boolean => {
    return !!this.peers[socketAddress.toString()];
  }

  public add = (peer: Peer): boolean => {
    if (this.has(peer.socketAddress)) {
      return false;
    } else {
      this.peers[peer.socketAddress.toString()] = peer;
      return true;
    }
  }

  public remove = (socketAddress: SocketAddress): Peer | null => {
    const peer = this.get(socketAddress);
    if (peer) {
      delete this.peers[socketAddress.toString()];
      return peer;
    } else {
      return null;
    }
  }

  public forEach = (cb: (peer: Peer) => void) => {
    Object.keys(this.peers).map(key => cb(this.peers[key]));
  }
}

export default PeerList;
