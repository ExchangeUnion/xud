import Peer from './Peer';
import SocketAddress from './SocketAddress';

class PeerList {
  private peers: { [ key: string ]: Peer } = {};

  public add(peer: Peer): boolean {
    if (this.has(peer.address)) {
      return false;
    } else {
      const key = peer.address.toString();
      this.peers[key] = peer;
      return true;
    }
  }

  public remove(peer:Peer): void {
    const key = peer.address.toString();
    delete this.peers[key];
  }

  public has(address: SocketAddress): boolean {
    const key = address.toString();
    return !!this.peers[key];
  }
}

export default PeerList;
