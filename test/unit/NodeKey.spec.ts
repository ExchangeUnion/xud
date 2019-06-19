import { expect } from 'chai';
import NodeKey from '../../lib/nodekey/NodeKey';
import secp256k1 from 'secp256k1';
import { getTempDir } from '../utils';

describe('NodeKey', () => {
  it('should generate a valid node key', async () => {
    const nodeKey = await NodeKey['generate']();
    expect(nodeKey.pubKey).to.have.length(66);
    expect(secp256k1.privateKeyVerify(nodeKey['privKey'])).to.be.true;
    expect(secp256k1.publicKeyVerify(Buffer.from(nodeKey.pubKey, 'hex'))).to.be.true;
  });

  it('should write a nodekey to disk and read it back without encryption', async () => {
    const nodeKey = await NodeKey['generate']();
    const path = NodeKey.getPath(getTempDir(true));
    await nodeKey.toFile(path);
    const nodeKeyFromDisk = await NodeKey.fromFile(path);
    expect(nodeKey.privKey.compare(nodeKeyFromDisk.privKey)).to.equal(0);
  });

  it('should write a nodekey to disk and read it back with encryption', async () => {
    const password = 'wasspord';
    const nodeKey = await NodeKey['generate']();
    const path = NodeKey.getPath(getTempDir(true));
    await nodeKey.toFile(path, password);
    const nodeKeyFromDisk = await NodeKey.fromFile(path, password);
    expect(nodeKey.privKey.compare(nodeKeyFromDisk.privKey)).to.equal(0);
  });

  it('should write a nodekey to disk with encryption and fail reading it with the wrong password', async () => {
    const password = 'wasspord';
    const nodeKey = await NodeKey['generate']();
    const path = NodeKey.getPath(getTempDir(true));
    await nodeKey.toFile(path, password);
    expect(NodeKey.fromFile(path, 'wrongpassword')).to.eventually.throw;
  });
});
