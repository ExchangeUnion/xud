
import { expect } from 'chai';
import Xud from '../../lib/Xud';
import fs from 'fs';
import path from 'path';

describe('P2P Sanity Tests', () => {
  let firstpeer: Xud;
  let secondpeer: Xud;

  before(async () => {
    const firstpeerconfig = {
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
      xudir : `${process.env.HOME}/.xud/1`,
    };

    const secondpeerconfig = {
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
      xudir : `${process.env.HOME}/.xud/2`,
    };

    if (!fs.existsSync(firstpeerconfig.xudir)) {
      mkdirRecursiveSync(firstpeerconfig.xudir);
    }

    if (!fs.existsSync(secondpeerconfig.xudir)) {
      mkdirRecursiveSync(secondpeerconfig.xudir);
    }

    firstpeer = new Xud(firstpeerconfig);
    await firstpeer.start();

    secondpeer = new Xud(secondpeerconfig);
    await secondpeer.start();
  });

  it('should return connected', async () => {
    const result = await firstpeer.service.connect({ host:'localhost', port:8886 });
    expect(result).to.be.equal('connected');
  });

  after(async () => {
    await firstpeer.shutdown();
    await secondpeer.shutdown();
  });
});

function mkdirRecursiveSync(targetDir: string, isRelative = false) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelative ? __dirname : '.';

  targetDir.split(sep).reduce((prevDirPath, dirToCreate) => {
    const curDirPathToCreate = path.resolve(baseDir, prevDirPath, dirToCreate);
    try {
      fs.mkdirSync(curDirPathToCreate);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    // caught EEXIST error if curDirPathToCreate already existed (not a problem for us).
    }
    return curDirPathToCreate; // becomes prevDirPath on next call to reduce
  }, initDir);
}
