/* tslint:disable max-line-length */
import chai, { expect } from 'chai';
import Xud from '../../lib/Xud';
import chaiAsPromised from 'chai-as-promised';
import { toUri } from '../../lib/utils/uriUtils';
import { XUNetwork } from '../../lib/constants/enums';
import { createConfig } from './sanity.spec';

chai.use(chaiAsPromised);

describe('P2P Networks Tests', () => {
  function testConnectionFailure(srcNodeNetwork: XUNetwork, destNodeNetwork: XUNetwork) {
    it(`should fail to connect a node from ${srcNodeNetwork} to a node from ${destNodeNetwork}`, async () => {
      const srcNodeConfig = createConfig(1, 0, srcNodeNetwork);
      const destNodeConfig = createConfig(2, 0, destNodeNetwork);
      const srcNode = new Xud();
      const destNode = new Xud();
      await Promise.all([srcNode.start(srcNodeConfig), destNode.start(destNodeConfig)]);

      const host = 'localhost';
      const port = destNode['pool']['listenPort']!;
      const nodeTwoUri = toUri({ host, port, nodePubKey: destNode.nodePubKey });

      const rejectionMsg = `Peer (${host}:${port}) closed due to WireProtocolErr framer: incompatible msg origin network (expected: ${srcNodeNetwork}, found: ${destNodeNetwork})`;
      await expect(srcNode.service.connect({ nodeUri: nodeTwoUri, retryConnecting: false })).to.be.rejectedWith(rejectionMsg);

      expect(await srcNode.service.listPeers().length).to.equal(0);
      expect(await destNode.service.listPeers().length).to.equal(0);

      await Promise.all([srcNode['shutdown'](), destNode['shutdown']()]);
    });
  }

  function testConnectionSuccess(srcNodeNetwork: XUNetwork, destNodeNetwork: XUNetwork) {
    it(`should successfully connect a node from ${srcNodeNetwork} to a node from ${destNodeNetwork}`, async () => {
      const srcNodeConfig = createConfig(1, 0, srcNodeNetwork);
      const destNodeConfig = createConfig(2, 0, destNodeNetwork);
      const srcNode = new Xud();
      const destNode = new Xud();
      await Promise.all([srcNode.start(srcNodeConfig), destNode.start(destNodeConfig)]);

      const host = 'localhost';
      const port = destNode['pool']['listenPort']!;
      const nodeTwoUri = toUri({ host, port, nodePubKey: destNode.nodePubKey });

      await expect(srcNode.service.connect({ nodeUri: nodeTwoUri, retryConnecting: false })).to.be.fulfilled;

      const peers = srcNode.service.listPeers();
      expect(peers.length).to.equal(1);
      expect(peers[0].nodePubKey).to.equal(destNode.nodePubKey);

      const verifyDestNodePeers = () => new Promise((resolve) => {
        setTimeout(() => {
          const peers = destNode.service.listPeers();
          expect(peers.length).to.equal(1);
          expect(peers[0].nodePubKey).to.equal(srcNode.nodePubKey);
          resolve();
        }, 100);
      });
      await verifyDestNodePeers();

      await Promise.all([srcNode['shutdown'](), destNode['shutdown']()]);
    });
  }

  testConnectionFailure(XUNetwork.MainNet, XUNetwork.SimNet);
  testConnectionFailure(XUNetwork.MainNet, XUNetwork.TestNet);
  testConnectionFailure(XUNetwork.MainNet, XUNetwork.RegTest);
  testConnectionFailure(XUNetwork.TestNet, XUNetwork.MainNet);
  testConnectionFailure(XUNetwork.TestNet, XUNetwork.SimNet);
  testConnectionFailure(XUNetwork.TestNet, XUNetwork.RegTest);
  testConnectionFailure(XUNetwork.SimNet, XUNetwork.MainNet);
  testConnectionFailure(XUNetwork.SimNet, XUNetwork.TestNet);
  testConnectionFailure(XUNetwork.SimNet, XUNetwork.RegTest);
  testConnectionFailure(XUNetwork.RegTest, XUNetwork.MainNet);
  testConnectionFailure(XUNetwork.RegTest, XUNetwork.TestNet);
  testConnectionFailure(XUNetwork.RegTest, XUNetwork.SimNet);

  testConnectionSuccess(XUNetwork.SimNet, XUNetwork.SimNet);
  testConnectionSuccess(XUNetwork.TestNet, XUNetwork.TestNet);
  testConnectionSuccess(XUNetwork.SimNet, XUNetwork.SimNet);
  testConnectionSuccess(XUNetwork.RegTest, XUNetwork.RegTest);
});
