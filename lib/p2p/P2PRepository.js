const Logger = require('../Logger');
const baseRepository = require('../db/baseRepository');

class P2PRepository {
  constructor(db) {
    this.logger = Logger.global;
    this.models = db.getModels();
  }

  addPeer(peer) {
    return baseRepository.addOne(this.models.Peer, peer);
  }

  addPeers(peers) {
    return baseRepository.addMany(this.models.Peer, peers);
  }
}

module.exports = P2PRepository;
