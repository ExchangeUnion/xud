import Peer from './Peer';

class PeerList {
  private peers = new Map<string, Peer>();

  get length(): number {
    let length = 0;

    this.forEach((peer) => {
      if (peer.connected) {
        length = length + 1;
      }
    });

    return length;
  }

  public get = (nodePubKey: string): Peer | undefined => {
    return this.peers.get(nodePubKey);
  }

  public has = (nodePubKey: string): boolean => {
    return this.peers.has(nodePubKey);
  }

  /**
   * Add a peer to the list.
   * @returns `true` if the peer was added, `false` if it could not be added due to a missing or duplicate nodePubKey
   */
  public add = (peer: Peer): boolean => {
    if (!peer.nodePubKey || this.has(peer.nodePubKey)) {
      return false;
    } else {
      this.peers.set(peer.nodePubKey, peer);
      return true;
    }
  }

  /**
   * Remove a peer from the list by its nodePubKey.
   * @returns `true` if the peer was removed, `false` if no peer was removed
   */
  public remove = (nodePubKey: string): boolean => {
    return this.peers.delete(nodePubKey);
  }

  public forEach = (callback: (peer: Peer) => void) => {
    this.peers.forEach(callback);
  }
}

export default PeerList;
