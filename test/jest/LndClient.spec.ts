import LndClient from '../../lib/lndclient/LndClient';
import { LndClientConfig } from '../../lib/lndclient/types';
import Logger from '../../lib/Logger';

jest.mock('../../lib/Logger');
const mockedLogger = <jest.Mock<Logger>><any>Logger;
describe('LndClient', () => {
  let lnd: LndClient;
  let config: LndClientConfig;
  let currency: string;
  let logger: Logger;

  beforeEach(() => {
    config = {
      disable: false,
      certpath: '/cert/path',
      macaroonpath: '/macaroon/path',
      host: '127.0.0.1',
      port: 4321,
      cltvdelta: 144,
      nomacaroons: true,
    };
    currency = 'BTC';
    logger = new mockedLogger();
    logger.error = jest.fn();
    logger.info = jest.fn();
    logger.trace = jest.fn();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await lnd.close();
  });

  describe('openChannel', () => {
    const peerPubKey = '02f8895eb03c37b2665415be4d83b20228acc0abc55ebf6728565141c66cfc164a';
    const units = 16000000;
    const externalIp1 = '123.456.789.321:9735';
    const externalIp2 = '192.168.63.155:9777';
    const lndListeningUris = [
      `${peerPubKey}@${externalIp1}`,
      `${peerPubKey}@${externalIp2}`,
    ];

    test('it throws when connectPeer fails', async () => {
      expect.assertions(3);
      lnd = new LndClient(config, currency, logger);
      lnd['connectPeer'] = jest.fn().mockImplementation(() => {
        throw new Error('connectPeer failed');
      });
      try {
        await lnd.openChannel({
          units,
          peerIdentifier: peerPubKey,
          lndUris: [lndListeningUris[0]],
        });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
      expect(lnd['connectPeer']).toHaveBeenCalledTimes(1);
      expect(lnd['connectPeer'])
        .toHaveBeenCalledWith(peerPubKey, externalIp1);
    });

    test('it tries all 2 lnd uris when connectPeer to first one fails', async () => {
      expect.assertions(3);
      lnd = new LndClient(config, currency, logger);
      lnd['openChannelSync'] = jest.fn().mockReturnValue(Promise.resolve());
      const connectPeerFail = () => {
        throw new Error('connectPeer failed');
      };
      lnd['connectPeer'] = jest.fn()
        .mockImplementationOnce(connectPeerFail)
        .mockImplementationOnce(() => {
          return Promise.resolve();
        });
      await lnd.openChannel({
        units,
        peerIdentifier: peerPubKey,
        lndUris: lndListeningUris,
      });
      expect(lnd['connectPeer']).toHaveBeenCalledTimes(2);
      expect(lnd['connectPeer'])
        .toHaveBeenCalledWith(peerPubKey, externalIp1);
      expect(lnd['connectPeer'])
        .toHaveBeenCalledWith(peerPubKey, externalIp2);
    });

    test('it does succeed when connecting to already connected peer', async () => {
      expect.assertions(4);
      lnd = new LndClient(config, currency, logger);
      lnd['openChannelSync'] = jest.fn().mockReturnValue(Promise.resolve());
      const alreadyConnected = () => {
        throw new Error('already connected');
      };
      lnd['connectPeer'] = jest.fn()
        .mockImplementation(alreadyConnected);
      await lnd.openChannel({
        units,
        peerIdentifier: peerPubKey,
        lndUris: lndListeningUris,
      });
      expect(lnd['connectPeer']).toHaveBeenCalledTimes(1);
      expect(lnd['connectPeer'])
        .toHaveBeenCalledWith(peerPubKey, externalIp1);
      expect(lnd['openChannelSync']).toHaveBeenCalledTimes(1);
      expect(lnd['openChannelSync'])
        .toHaveBeenCalledWith(peerPubKey, units);
    });

    test('it throws when timeout reached', async () => {
      expect.assertions(3);
      jest.useFakeTimers();
      lnd = new LndClient(config, currency, logger);
      lnd['openChannelSync'] = jest.fn().mockReturnValue(Promise.resolve());
      const timeOut = () => {
        jest.runAllTimers();
        return new Promise(() => {});
      };
      lnd['connectPeer'] = jest.fn()
        .mockImplementation(timeOut);
      try {
        await lnd.openChannel({
          units,
          peerIdentifier: peerPubKey,
          lndUris: lndListeningUris,
        });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
      expect(lnd['connectPeer']).toHaveBeenCalledTimes(2);
      expect(lnd['openChannelSync']).not.toHaveBeenCalled();
      jest.clearAllTimers();
    });

    test('it stops trying to connect to lnd uris when first once succeeds', async () => {
      expect.assertions(3);
      lnd = new LndClient(config, currency, logger);
      lnd['openChannelSync'] = jest.fn().mockReturnValue(Promise.resolve());
      lnd['connectPeer'] = jest.fn()
        .mockImplementationOnce(() => {
          return Promise.resolve();
        });
      await lnd.openChannel({
        units,
        peerIdentifier: peerPubKey,
        lndUris: lndListeningUris,
      });
      expect(lnd['connectPeer']).toHaveBeenCalledTimes(1);
      expect(lnd['connectPeer'])
        .toHaveBeenCalledWith(peerPubKey, externalIp1);
      expect(lnd['connectPeer'])
        .not.toHaveBeenCalledWith(peerPubKey, externalIp2);
    });

    test('it throws when openchannel fails', async () => {
      expect.assertions(2);
      lnd = new LndClient(config, currency, logger);
      lnd['connectPeer'] = jest.fn().mockReturnValue(Promise.resolve());
      lnd['openChannelSync'] = jest.fn().mockImplementation(() => {
        throw new Error('openChannelSync error');
      });
      try {
        await lnd.openChannel({
          units,
          peerIdentifier: peerPubKey,
          lndUris: lndListeningUris,
        });
      } catch (e) {
        expect(e).toMatchSnapshot();
      }
      expect(lnd['openChannelSync']).toHaveBeenCalledTimes(1);
    });

  });

});
