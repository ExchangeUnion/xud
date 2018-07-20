
import { expect } from 'chai';
import Xud from '../../lib/Xud';

describe('P2P Sanity Tests', () => {
  let firstpeer: Xud;
  let secondpeer: Xud;
  let secondpeerconfig: any;
  let firstpeerconfig: any;

  before(async () => {

    firstpeerconfig = {
      instanceId : 1,
      p2p : {
        listen: true,
        port: 8885,
      },
      rpc : {
        disable: true,
      },
      lnd : {
        disable: true,
      },
      raiden : {
        disable: true,
      },
      db : {
        database: 'xud_test',
      },
    };

    secondpeerconfig = {
      instanceId : 2,
      p2p : {
        listen: true,
        port: 8886,
      },
      rpc : {
        disable: true,
      },
      lnd : {
        disable: true,
      },
      raiden : {
        disable: true,
      },
      db : {
        database: 'xud_test',
      },
    };

    firstpeer = new Xud(firstpeerconfig);
    await firstpeer.start();

    secondpeer = new Xud(secondpeerconfig);
    await secondpeer.start();
  });

  it('should return connected', async () => {
    const result = await firstpeer.service.connect({ host:'localhost', port: 8886 });
    expect(result).to.be.equal('Connected to peer (localhost:8886)');
  });

  it('should fail to connect', async () => {
    const result = await firstpeer.service.connect({ host:'localhost', port: 8886 });
    expect(result).to.be.equal('SocketAddress (localhost:8886) already connected');
  });

  it('should not connect', async () => {
    const result = await firstpeer.service.connect({ host:'localhost', port:8887 });
    expect(result).to.be.equal('Not connected');
  });

  after(async () => {
    await firstpeer.shutdown();
    await secondpeer.shutdown();
  });
});
