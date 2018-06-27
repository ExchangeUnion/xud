import Peer from './Peer';
import SocketAddress from './SocketAddress';

class PeerList {
  private peers: { [ socketAddress: string ]: Peer } = {};

  get lenght(): number {
    return Object.keys(this.peers).length;
  }

  public add = (peer: Peer): boolean => {
    if (this.has(peer.socketAddress)) {
      return false;
    } else {
      this.peers[peer.socketAddress.toString()] = peer;
      return true;
    }
  }

  public remove = (peer:Peer): void => {
    delete this.peers[peer.socketAddress.toString()];
  }

  public has = (socketAddress: SocketAddress): boolean => {
    return !!this.peers[socketAddress.toString()];
  }

  public forEach = (cb: (peer: Peer) => void) => {
    Object.keys(this.peers).map(key => cb(this.peers[key]));
  }
}

export default PeerList;
