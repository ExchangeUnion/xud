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

const raidenDatabasePath = 'raiden';
const xudDatabasePath = 'xud';

const backups = {
  lnd: {
    event: 'lnd event',
    startup: 'lnd startup',
  },
  raiden: {
    event: 'raiden event',
    startup: 'raiden startup',
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
    await Promise.all([
      fs.promises.writeFile(
        raidenDatabasePath,
        backups.raiden.startup,
      ),
      fs.promises.writeFile(
        xudDatabasePath,
        backups.xud.startup,
      ),
    ]);

    await backup.start({
      backupdir,
      loglevel: 'error',
      dbpath: xudDatabasePath,
      raiden: {
        dbpath: raidenDatabasePath,
      },
    });
  });

  afterAll(async () => {
    await backup.stop();
  });

  test('should write LND backups on startup', () => {
    expect(
      fs.readFileSync(
        path.join(backupdir, 'lnd-BTC'),
        'utf8',
      ),
    ).toEqual(backups.lnd.startup);
  });

  test('should write LND backups on new event', () => {
    channelBackupCallback(backups.lnd.event);

    expect(
      fs.readFileSync(
        path.join(backupdir, 'lnd-BTC'),
        'utf8',
      ),
    ).toEqual(backups.lnd.event);
  });

  test('should write Raiden backups on startup', () => {
    expect(
      fs.readFileSync(
        path.join(backupdir, 'raiden'),
        'utf8',
      ),
    ).toEqual(backups.raiden.startup);
  });

  test('should write Raiden backups on new event', async () => {
    fs.writeFileSync(
      raidenDatabasePath,
      backups.raiden.event,
    );

    // Wait to make sure the file watcher handled the new file
    await new Promise((resolve, reject) => {
      setTimeout(reject, 3000);
      backup.on('newBackup', (path) => {
        if (path.endsWith(raidenDatabasePath)) {
          resolve();
        }
      });
    });

    expect(
      fs.readFileSync(
        path.join(backupdir, 'raiden'),
        'utf8',
      ),
    ).toEqual(backups.raiden.event);
  });

  test('should write XUD database backups on startup', () => {
    expect(
      fs.readFileSync(
        path.join(backupdir, 'xud'),
        'utf8',
      ),
    ).toEqual(backups.xud.startup);
  });

  test('should write XUD database backups on new event', async () => {
    fs.writeFileSync(
      xudDatabasePath,
      backups.xud.event,
    );

    // Wait to make sure the file watcher handled the new file
    await new Promise((resolve, reject) => {
      setTimeout(reject, 3000);
      backup.on('newBackup', (path) => {
        if (path.endsWith(xudDatabasePath)) {
          resolve();
        }
      });
    });

    expect(
      fs.readFileSync(
        path.join(backupdir, 'xud'),
        'utf8',
      ),
    ).toEqual(backups.xud.event);
  });

  afterAll(async () => {
    await backup.stop();

    removeDir(backupdir);

    await Promise.all([
      fs.promises.unlink(xudDatabasePath),
      fs.promises.unlink(raidenDatabasePath),
    ]);
  });
});
