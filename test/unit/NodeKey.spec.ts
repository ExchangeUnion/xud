import { expect } from 'chai';
import NodeKey from '../../lib/nodekey/NodeKey';
import secp256k1 from 'secp256k1';

describe('NodeKey', () => {
  it('should generate a valid node key', async () => {
    const nodeKey = await NodeKey['generate']();
    expect(nodeKey.nodePubKey).to.have.length(66);
    expect(secp256k1.privateKeyVerify(nodeKey['privKey'])).to.be.true;
    expect(secp256k1.publicKeyVerify(Buffer.from(nodeKey.nodePubKey, 'hex'))).to.be.true;
  });
});
