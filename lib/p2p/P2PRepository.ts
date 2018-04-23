import Logger from '../Logger';
import baseRepository from '../db/baseRepository';

class P2PRepository {
  logger: any;
  db: any;
  models: any;
  constructor(db) {
    this.logger = Logger.global;
    this.db = db;
    this.models = db.getModels();
  }

  addPeer(peer) {
    return baseRepository.addOne(this.models.Peer, peer);
  }

  addPeers(peers) {
    return baseRepository.addMany(this.models.Peer, peers);
  }

  async getOrAddPeer(address, port) {
    const results = await this.db.sequelize.query(`
      INSERT IGNORE INTO peers (address, port, createdAt, updatedAt) VALUES ('${address}', ${port}, NOW(), NOW());
      SELECT * FROM peers WHERE address = '${address}' and port = ${port};
    `);

    return results[0][1][0];
  }
}

export default P2PRepository;
