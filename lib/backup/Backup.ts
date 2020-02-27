import { createHash } from 'crypto';
import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';
import Config from '../Config';
import LndClient from '../lndclient/LndClient';
import Logger, { Context } from '../Logger';
import { getDefaultBackupDir } from '../utils/utils';

interface Backup {
  on(event: 'newBackup', listener: (path: string) => void): this;
  emit(event: 'newBackup', path: string): boolean;
}

class Backup extends EventEmitter {
  private logger!: Logger;
  private config = new Config();

  private backupDir!: string;

  private fileWatchers: fs.FSWatcher[] = [];
  private lndClients: LndClient[] = [];
  private checkLndTimer: ReturnType<typeof setInterval> | undefined;

  public start = async (args: { [argName: string]: any }) => {
    await this.config.load(args);

    this.backupDir = args.backupdir || getDefaultBackupDir();

    this.logger = new Logger({
      context: Context.Backup,
      level: this.config.loglevel,
      filename: this.config.logpath,
      instanceId: this.config.instanceid,
      dateFormat: this.config.logdateformat,
    });

    if (!fs.existsSync(this.backupDir)) {
      try {
        fs.mkdirSync(this.backupDir);
      } catch (error) {
        this.logger.error(`Could not create backup directory: ${error}`);
        return;
      }
    }

    this.startLndSubscriptions().catch((err) => {
      this.logger.error(`Could not connect to LNDs: ${err}`);
    });

    // Start the Raiden database filewatcher
    if (args.raiden) {
      this.startFilewatcher('raiden', args.raiden.dbpath).catch(this.logger.error);
    } else {
      this.logger.warn('Raiden database file not specified');
    }

    // Start the XUD database filewatcher
    this.startFilewatcher('xud', this.config.dbpath).catch(this.logger.error);

    this.logger.info('Started backup daemon');
  }

  public stop = () => {
    if (this.checkLndTimer) {
      clearInterval(this.checkLndTimer);
    }
    this.fileWatchers.forEach((watcher) => {
      watcher.close();
    });

    for (const lndClient of this.lndClients) {
      lndClient.close();
    }
  }

  private waitForLndConnected = (lndClient: LndClient) => {
    return new Promise((resolve) => {
      if (lndClient.isConnected()) {
        resolve();
      } else {
        lndClient.on('connectionVerified', resolve);
      }
    });
  }

  private startLndSubscriptions = async () => {
    // Start the LND SCB subscriptions
    const lndPromises: Promise<void>[] = [];

    const startLndSubscription = async (currency: string) => {
      const config = this.config.lnd[currency]!;

      // Ignore the LND client if it is disabled or not configured
      if (!config.disable && Object.entries(config).length !== 0) {
        const lndClient = new LndClient({
          config,
          currency,
          logger: Logger.DISABLED_LOGGER,
        });

        this.lndClients.push(lndClient);

        await lndClient.init();

        this.logger.info(`Waiting for lnd-${lndClient.currency}`);
        await this.waitForLndConnected(lndClient);

        const backupPath = this.getBackupPath('lnd', lndClient.currency);

        this.logger.verbose(`Writing initial ${lndClient.currency} LND channel backup to: ${backupPath}`);

        const channelBackup = await lndClient.exportAllChannelBackup();
        this.writeBackup(backupPath, channelBackup);

        lndClient.subscribeChannelBackups();
        this.logger.info(`Listening to ${currency} LND channel backups`);

        lndClient.on('channelBackup', (channelBackup) => {
          this.logger.debug(`New ${lndClient.currency} channel backup`);
          this.writeBackup(backupPath, channelBackup);
        });
        lndClient.on('channelBackupEnd', async () => {
          this.logger.warn(`Lost subscription to ${lndClient.currency} channel backups - attempting to restore`);
          // attempt to re-subscribe to lnd backups
          await this.waitForLndConnected(lndClient);
          lndClient.subscribeChannelBackups();
          this.logger.info(`Subscription to ${lndClient.currency} channel backups restored`);
        });
      }
    };

    for (const currency in this.config.lnd) {
      lndPromises.push(startLndSubscription(currency));
    }

    await Promise.all(lndPromises);
  }

  private startFilewatcher = async (client: string, dbPath: string) => {
    let previousDatabaseHash: string | undefined;
    const backupPath = this.getBackupPath(client);

    if (fs.existsSync(dbPath)) {
      this.logger.verbose(`Writing initial ${client} database backup to: ${backupPath}`);
      const { content, hash } = this.readDatabase(dbPath);

      this.writeBackup(backupPath, content);
      previousDatabaseHash = hash;
    } else {
      this.logger.warn(`Could not find database file of ${client} at ${dbPath}, waiting for it to be created...`);
      const dbDir = path.dirname(dbPath);
      const dbFilename = path.basename(dbPath);
      await new Promise((resolve) => {
        const dbCreateWatcher = fs.watch(dbDir, (_, filename) => {
          if (filename === dbFilename) {
            this.logger.info(`${client} database created at ${dbPath}`);
            dbCreateWatcher.close();
            resolve();
          }
        });
      });
    }

    this.fileWatchers.push(fs.watch(dbPath, { persistent: true, recursive: false }, (event: string) => {
      if (event === 'change') {
        const { content, hash } = this.readDatabase(dbPath);

        // Compare the MD5 hash of the current content of the file with hash of the content when
        // it was backed up the last time to ensure that the content of the file has changed
        if (hash !== previousDatabaseHash) {
          this.logger.debug(`${client} database changed`);

          previousDatabaseHash = hash;
          this.writeBackup(backupPath, content);
        }
      }
    }));

    this.logger.verbose(`Listening for changes to the ${client} database`);
  }

  private readDatabase = (path: string): { content: Buffer, hash: string } => {
    const content = fs.readFileSync(path);

    return {
      content,
      hash: createHash('md5').update(content).digest('base64'),
    };
  }

  private writeBackup = (backupPath: string, data: Uint8Array) => {
    try {
      fs.writeFileSync(
        backupPath,
        data,
      );
      this.emit('newBackup', backupPath);
    } catch (error) {
      this.logger.error(`Could not write backup file: ${error}`);
    }
  }

  private getBackupPath = (client: string, currency?: string) => {
    let clientName = client;

    if (currency) {
      clientName += `-${currency}`;
    }

    return path.join(this.backupDir, clientName);
  }
}

export default Backup;
