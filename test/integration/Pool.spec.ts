import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Pool from '../../lib/p2p/Pool';
import Logger, { Level } from '../../lib/Logger';
import DB from '../../lib/db/DB';
import Config from '../../lib/Config';
import NodeKey from '../../lib/nodekey/NodeKey';
import Peer from '../../lib/p2p/Peer';
import { Address } from '../../lib/types/p2p';

chai.use(chaiAsPromised);

describe('P2P Pool Tests', () => {
  let db: DB;
  let pool: Pool;
  const loggers = Logger.createLoggers(Level.WARN);
  const nodePubKeyOne = NodeKey['generate']().nodePubKey;

  const createPeer = (nodePubKey: string, addresses: Address[]) => {
    const peer = new Peer(loggers.p2p);
    peer.socketAddress = addresses[0];
    peer['handshakeState'] = {
      addresses,
      nodePubKey,
      version: 'test',
      pairs: [],
    };
    pool['bindPeer'](peer);

    return peer;
  };

  before(async () => {
    const config = new Config();
    config.load({
      p2p: {
        listen: false,
      },
    });
    db = new DB(config.testDb, loggers.db);
    await db.init();
    await db.models.Node.truncate();

    pool = new Pool(config.p2p, loggers.p2p, db.models);

    await pool.init({
      nodePubKey: 'test',
      version: 'test',
      pairs: [],
    });
  });

  it('should handle an opened peer', async () => {
    const currentNodeCount = pool['nodes'].count;

    const addresses = [{ host: '123.123.123.123', port: 8885 }];
    const peer = createPeer(nodePubKeyOne, addresses);

    const handleOpenPromise = pool['handleOpen'](peer);
    expect(handleOpenPromise).to.be.fulfilled;
    await handleOpenPromise;
    expect(pool['nodes'].count).to.equal(currentNodeCount + 1);
    expect(pool['nodes'].has(nodePubKeyOne)).to.be.true;

    expect(pool['peers'].has(nodePubKeyOne)).to.be.true;

    const nodeInstance = await db.models.Node.find({
      where: {
        nodePubKey: nodePubKeyOne,
      },
    });
    expect(nodeInstance).to.not.be.undefined;
    expect(nodeInstance!.addresses!).to.have.length(1);
    expect(nodeInstance!.addresses![0].host).to.equal(addresses[0].host);
  });

  it('should close a peer', async () => {
    const closePromise = pool.closePeer(nodePubKeyOne);
    expect(closePromise).to.be.fulfilled;
    await closePromise;
    expect(pool['peers'].has(nodePubKeyOne)).to.be.false;
    expect(pool['peers']['peers'].size).to.equal(0);
  });

  it('should update a node on new handshake', async () => {
    const addresses = [{ host: '86.75.30.9', port: 8885 }];
    const peer = createPeer(nodePubKeyOne, addresses);

    await pool['handleOpen'](peer);

    const nodeInstance = await db.models.Node.find({
      where: {
        nodePubKey: nodePubKeyOne,
      },
    });
    expect(nodeInstance).to.not.be.undefined;
    expect(nodeInstance!.addresses!).to.have.length(1);
    expect(nodeInstance!.addresses![0].host).to.equal(addresses[0].host);
  });

  after(async () => {
    await db.models.Node.truncate();
    await db.close();
    await pool.disconnect();
  });
});
