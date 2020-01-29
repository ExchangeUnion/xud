import { EventEmitter } from 'events';
import { promises as fs } from 'fs';
import NodeKey from '../nodekey/NodeKey';
import swapErrors from '../swaps/errors';
import SwapClientManager from '../swaps/SwapClientManager';
import { decipher } from '../utils/seedutil';
import errors from './errors';

interface InitService {
  once(event: 'nodekey', listener: (nodeKey: NodeKey) => void): this;
  emit(event: 'nodekey', nodeKey: NodeKey): boolean;
}

/** A class containing the methods available for a locked, uninitialized instance of xud. */
class InitService extends EventEmitter {
  /** Whether there is a pending `CreateNode` or `UnlockNode` call. */
  private pendingCall = false;

  constructor(
    private swapClientManager: SwapClientManager,
    private nodeKeyPath: string,
    private nodeKeyExists: boolean,
    private databasePath: string,
  ) {
    super();
  }

  public createNode = async (args: { password: string }) => {
    const { password } = args;

    this.newWalletValidation(password);
    await this.prepareCall();

    try {
      const seedMnemonic = await this.swapClientManager.genSeed();

      // we use the deciphered seed (without the salt and extra fields that make up the enciphered seed)
      // to generate an xud nodekey from the same seed used for wallets
      // TODO: use seedutil tool to derive a child private key from deciphered seed key?
      const decipheredSeed = await decipher(seedMnemonic);
      const nodeKey = NodeKey.fromBytes(decipheredSeed);

      // use this seed to init any lnd wallets that are uninitialized
      const initWalletResult = await this.swapClientManager.initWallets({ seedMnemonic, walletPassword: password });
      const initializedLndWallets = initWalletResult.initializedLndWallets;
      const initializedRaiden = initWalletResult.initializedRaiden;

      await nodeKey.toFile(this.nodeKeyPath, password);
      this.emit('nodekey', nodeKey);
      return {
        initializedLndWallets,
        initializedRaiden,
        mnemonic: seedMnemonic,
      };
    } finally {
      this.pendingCall = false;
    }
  }

  public unlockNode = async (args: { password: string }) => {
    const { password } = args;

    if (!this.nodeKeyExists) {
      throw errors.NODE_DOES_NOT_EXIST;
    }
    await this.prepareCall();

    try {
      const nodeKey = await NodeKey.fromFile(this.nodeKeyPath, password);
      this.emit('nodekey', nodeKey);

      return this.swapClientManager.unlockWallets(password);
    } finally {
      this.pendingCall = false;
    }
  }

  public restoreNode = async (args: {
    password: string,
    xudDatabase: Uint8Array,
    lndBackupsMap: Map<string, Uint8Array>,
    raidenDatabase: Uint8Array,
    seedMnemonicList: string[],
    raidenDatabasePath: string,
  }) => {
    const {
      password,
      xudDatabase,
      lndBackupsMap,
      raidenDatabase,
      seedMnemonicList,
      raidenDatabasePath,
    } = args;

    if (seedMnemonicList.length !== 24) {
      throw errors.INVALID_ARGUMENT('mnemonic must be exactly 24 words');
    }

    this.newWalletValidation(password);
    await this.prepareCall();

    try {
      const decipheredSeed = await decipher(seedMnemonicList);
      const nodeKey = NodeKey.fromBytes(decipheredSeed);

      // use the seed and database backups to restore any lnd wallets that are uninitialized
      const initWalletResult = await this.swapClientManager.initWallets({
        raidenDatabasePath,
        raidenDatabase,
        lndBackups: lndBackupsMap,
        walletPassword: password,
        seedMnemonic: seedMnemonicList,
        restore: true,
      });
      const restoredLndWallets = initWalletResult.initializedLndWallets;
      const restoredRaiden = initWalletResult.initializedRaiden;

      if (xudDatabase.byteLength) {
        await fs.writeFile(this.databasePath, xudDatabase);
      }
      await nodeKey.toFile(this.nodeKeyPath, password);
      this.emit('nodekey', nodeKey);
      return {
        restoredLndWallets,
        restoredRaiden,
      };
    } finally {
      this.pendingCall = false;
    }
  }

  private newWalletValidation = (password: string) => {
    if (this.nodeKeyExists) {
      throw errors.NODE_ALREADY_EXISTS;
    }
    if (password.length < 8) {
      // lnd requires 8+ character passwords, so we must as well
      throw errors.INVALID_ARGUMENT('password must be at least 8 characters');
    }
    if (this.swapClientManager.misconfiguredClientLabels.length > 0) {
      throw swapErrors.SWAP_CLIENT_MISCONFIGURED(this.swapClientManager.misconfiguredClientLabels);
    }
  }

  private prepareCall = async () => {
    if (this.pendingCall) {
      throw errors.PENDING_CALL_CONFLICT;
    }

    this.pendingCall = true;

    // wait briefly for all lnd instances to be available
    try {
      await this.swapClientManager.waitForLnd();
    } catch (err) {
      this.pendingCall = false; // end pending call if there's an error while waiting for lnd
      throw err;
    }
  }
}

export default InitService;
