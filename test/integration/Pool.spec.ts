import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import Pool from '../../lib/p2p/Pool';
import Logger, { Level } from '../../lib/Logger';
import DB from '../../lib/db/DB';
import Config from '../../lib/Config';
import NodeKey from '../../lib/nodekey/NodeKey';
import Peer from '../../lib/p2p/Peer';
import { Address } from '../../lib/p2p/types';
import { DisconnectionReason } from '../../lib/constants/enums';

chai.use(chaiAsPromised);

describe('P2P Pool Tests', async () => {
  let db: DB;
  let pool: Pool;
  let nodeKeyOne: NodeKey;
  const loggers = Logger.createLoggers(Level.Warn);
  const sandbox = sinon.createSandbox();

  const createPeer = (nodePubKey: string, addresses: Address[]) => {
    const peer = sandbox.createStubInstance(Peer) as any;
    peer.address = addresses[0];
    peer.nodeState = {
      addresses,
      nodePubKey,
      version: 'test',
      pairs: ['LTC/BTC'],
    };
    peer.socket = {};
    peer.sendPacket = () => {};
    peer.close = () => {
      peer.sentDisconnectionReason = DisconnectionReason.NotAcceptingConnections;
      pool['handlePeerClose'](peer);
    };
    pool['bindPeer'](peer);

    return peer;
  };

  before(async () => {
    nodeKeyOne = await NodeKey['generate']();

    const config = new Config();
    config.p2p.listen = false;
    config.p2p.discover = false;
    db = new DB(loggers.db);
    await db.init();

    pool = new Pool(config.p2p, loggers.p2p, db.models);

    await pool.init({
      nodePubKey: 'test',
      version: 'test',
      pairs: [],
      lndPubKeys: {},
    }, nodeKeyOne);
  });

  it('should handle an opened peer', async () => {
    const currentNodeCount = pool['nodes'].count;

    const addresses = [{ host: '123.123.123.123', port: 8885 }];
    const peer = createPeer(nodeKeyOne.nodePubKey, addresses);

    const handleOpenPromise = pool['handleOpen'](peer);
    expect(handleOpenPromise).to.be.fulfilled;
    await handleOpenPromise;
    expect(pool['nodes'].count).to.equal(currentNodeCount + 1);
    expect(pool['nodes'].has(nodeKeyOne.nodePubKey)).to.be.true;

    expect(pool['peers'].has(nodeKeyOne.nodePubKey)).to.be.true;

    const nodeInstance = await db.models.Node.find({
      where: {
        nodePubKey: nodeKeyOne.nodePubKey,
      },
    });
    expect(nodeInstance).to.not.be.undefined;
    expect(nodeInstance!.addresses!).to.have.length(1);
    expect(nodeInstance!.addresses![0].host).to.equal(addresses[0].host);
  });

  it('should close a peer', () => {
    pool.closePeer(nodeKeyOne.nodePubKey, DisconnectionReason.NotAcceptingConnections);
    expect(pool['peers'].has(nodeKeyOne.nodePubKey)).to.be.false;
    expect(pool['peers'].size).to.equal(0);
  });

  it('should ban a peer', async () => {
    const banPromise = pool.banNode(nodeKeyOne.nodePubKey);
    expect(banPromise).to.be.fulfilled;
    await banPromise;
    const nodeReputationPromise = await pool.getNodeReputation(nodeKeyOne.nodePubKey);
    expect(nodeReputationPromise.banned).to.be.true;
  });

  it('should unban a peer', async () => {
    const unbanPromise = pool.unbanNode(nodeKeyOne.nodePubKey, false);
    expect(unbanPromise).to.be.fulfilled;
    await unbanPromise;
    const nodeReputationPromise = await pool.getNodeReputation(nodeKeyOne.nodePubKey);
    expect(nodeReputationPromise.banned).to.be.false;
  });

  it('should update a node on new handshake', async () => {
    const addresses = [{ host: '86.75.30.9', port: 8885 }];
    const peer = createPeer(nodeKeyOne.nodePubKey, addresses);

    pool['handleOpen'](peer);

    const nodeInstance = await db.models.Node.find({
      where: {
        nodePubKey: nodeKeyOne.nodePubKey,
      },
    });
    expect(nodeInstance).to.not.be.undefined;
    expect(nodeInstance!.addresses!).to.have.length(1);
    expect(nodeInstance!.addresses![0].host).to.equal(addresses[0].host);

    pool.closePeer(nodeKeyOne.nodePubKey, DisconnectionReason.NotAcceptingConnections);
  });

  after(async () => {
    await db.close();
    await pool.disconnect();
  });
});
