import fs from 'fs';
import path from 'path';
import Backup from '../../lib/backup/Backup';

const removeDir = (dir: string) => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      fs.unlinkSync(`${dir}/${file}`);
    });
  }

  fs.rmdirSync(dir);
};

const backupdir = 'backup-test';

const xudDatabasePath = 'xud';

const backups = {
  lnd: {
    event: 'lnd event',
    startup: 'lnd startup',
  },
  xud: {
    event: 'xud event',
    startup: 'xud startup',
  },
};

let channelBackupCallback: any;

const onListenerMock = jest.fn((event, callback) => {
  if (event === 'channelBackup') {
    channelBackupCallback = callback;
  } else {
    expect(event).toEqual('channelBackupEnd');
  }
});

jest.mock('../../lib/lndclient/LndClient', () => {
  return jest.fn().mockImplementation(() => {
    return {
      isConnected: () => true,
      on: onListenerMock,
      currency: 'BTC',
      init: () => Promise.resolve(),
      close: () => Promise.resolve(),
      subscribeChannelBackups: () => Promise.resolve(),
      exportAllChannelBackup: () => Promise.resolve(backups.lnd.startup),
    };
  });
});

describe('Backup', () => {
  const backup = new Backup();

  beforeAll(async () => {
    await fs.promises.writeFile(xudDatabasePath, backups.xud.startup);

    await backup.start({
      backupdir,
      loglevel: 'error',
      dbpath: xudDatabasePath,
    });
  });

  afterAll(() => {
    backup.stop();
  });

  test('should write LND backups on startup', () => {
    expect(fs.readFileSync(path.join(backupdir, 'lnd-BTC'), 'utf8')).toEqual(backups.lnd.startup);
  });

  test('should write LND backups on new event', () => {
    channelBackupCallback(backups.lnd.event);

    expect(fs.readFileSync(path.join(backupdir, 'lnd-BTC'), 'utf8')).toEqual(backups.lnd.event);
  });

  test('should write XUD database backups on startup', () => {
    expect(fs.readFileSync(path.join(backupdir, 'xud'), 'utf8')).toEqual(backups.xud.startup);
  });

  test('should detect XUD database backups on new event', async () => {
    fs.writeFileSync(xudDatabasePath, backups.xud.event);

    // Wait to make sure the file watcher handled the new file
    await new Promise((resolve, reject) => {
      setTimeout(reject, 3000);
      backup.on('changeDetected', (path) => {
        if (path.endsWith(xudDatabasePath)) {
          resolve();
        }
      });
    });
  });

  afterAll(async () => {
    backup.stop();

    removeDir(backupdir);

    await fs.promises.unlink(xudDatabasePath);
  });
});
