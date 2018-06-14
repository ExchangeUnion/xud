
import { expect } from 'chai';
import Xud from '../../lib/Xud';
import fs from 'fs';

describe('P2P Sanity Tests', () => {
  let firstpeer: Xud;
  let secondpeer: Xud;

  before(async () => {
    const firstpeerconfig = {
      xudir : `${process.env.HOME}/.xud/1`,
      p2p : {
        listen: true,
        port: 8885, // X = 88, U = 85 in ASCII
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

    const secondpeerconfig = {
      xudir : `${process.env.HOME}/.xud/2`,
      p2p : {
        listen: true,
        port: 8886,
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
    const result = await firstpeer.service.connect({ host:'localhost', port:8886 });
    expect(result).to.be.equal('Connected to peer (localhost:8886)');
  });

  it('should fail to connect', async () => {
    const result = await firstpeer.service.connect({ host:'localhost', port:8887 });
    expect(result).to.be.equal('Address (localhost) already connected');
  });

  after(async () => {
    await firstpeer.shutdown();
    await secondpeer.shutdown();
  });
});
