import Logger from '../Logger';
import DB from '../db/DB';
import { db } from '../types';

class P2PRepository {
  private logger: Logger = Logger.global;

  constructor(private db: DB) {}

  public addPeer = async (peer: db.PeerFactory): Promise<db.PeerInstance> => {
    return this.db.models.Peer.create(<db.PeerAttributes>peer);
  }

  public addPeers = async (peers: db.PeerFactory[]): Promise<db.PeerInstance[]> => {
    return this.db.models.Peer.bulkCreate(<db.PeerAttributes[]>peers);
  }

  public getOrAddPeer = async(address, port): Promise<db.PeerInstance> => {
    const results = await this.db.sequelize.query(`
      INSERT IGNORE INTO peers (address, port, createdAt, updatedAt) VALUES ('${address}', ${port}, NOW(), NOW());
      SELECT * FROM peers WHERE address = '${address}' and port = ${port};
    `);

    return results[0][1][0];
  }
}

export default P2PRepository;
