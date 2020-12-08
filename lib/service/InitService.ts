import { EventEmitter } from 'events';
import { promises as fs } from 'fs';
import { SwapClientType } from '../constants/enums';
import { errorCodes as lndErrorCodes } from '../lndclient/errors';
import NodeKey from '../nodekey/NodeKey';
import swapErrors from '../swaps/errors';
import SwapClientManager from '../swaps/SwapClientManager';
import { decipher, generate } from '../utils/seedutil';
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

    try {
      await this.prepareCall(true);
      const seedMnemonic = await generate();

      // we use the deciphered seed (without the salt and extra fields that make up the enciphered seed)
      // to generate an xud nodekey from the same seed used for wallets
      const decipheredSeed = await decipher(seedMnemonic);
      const nodeKey = NodeKey.fromBytes(decipheredSeed, this.nodeKeyPath);

      // use this seed to init any lnd wallets that are uninitialized
      const initWalletResult = await this.swapClientManager.initWallets({
        seedMnemonic,
        nodeKey,
        walletPassword: password,
      });

      await nodeKey.toFile(password);
      this.emit('nodekey', nodeKey);
      return {
        initializedLndWallets: initWalletResult.initializedLndWallets,
        initializedConnext: initWalletResult.initializedConnext,
        mnemonic: seedMnemonic,
      };
    } finally {
      this.pendingCall = false;
    }
  };

  public unlockNode = async (args: { password: string }) => {
    const { password } = args;

    if (!this.nodeKeyExists) {
      throw errors.NODE_DOES_NOT_EXIST;
    }

    try {
      await this.prepareCall(true);

      const nodeKey = await NodeKey.fromFile(this.nodeKeyPath, password);
      this.emit('nodekey', nodeKey);

      return this.swapClientManager.unlockWallets({
        nodeKey,
        walletPassword: password,
        connextSeed: nodeKey.childSeed(SwapClientType.Connext),
      });
    } catch (err) {
      if (err.code === 'ERR_OSSL_EVP_BAD_DECRYPT') {
        throw errors.INVALID_ARGUMENT('password is incorrect');
      } else {
        throw err;
      }
    } finally {
      this.pendingCall = false;
    }
  };

  public restoreNode = async (args: {
    password: string;
    xudDatabase: Uint8Array;
    lndBackupsMap: Map<string, Uint8Array>;
    seedMnemonicList: string[];
  }) => {
    const { password, xudDatabase, lndBackupsMap, seedMnemonicList } = args;

    if (seedMnemonicList.length !== 24) {
      throw errors.INVALID_ARGUMENT('mnemonic must be exactly 24 words');
    }

    this.newWalletValidation(password);

    try {
      await this.prepareCall();

      const decipheredSeed = await decipher(seedMnemonicList);
      const nodeKey = NodeKey.fromBytes(decipheredSeed, this.nodeKeyPath);

      // use the seed and database backups to restore any swap clients' wallets
      // that are uninitialized
      const initWalletResult = await this.swapClientManager.initWallets({
        nodeKey,
        lndBackups: lndBackupsMap,
        walletPassword: password,
        seedMnemonic: seedMnemonicList,
        restore: true,
      });

      if (xudDatabase.byteLength) {
        await fs.writeFile(this.databasePath, xudDatabase);
      }
      await nodeKey.toFile(password);
      this.emit('nodekey', nodeKey);
      return {
        initializedLndWallets: initWalletResult.initializedLndWallets,
        initializedConnext: initWalletResult.initializedConnext,
      };
    } finally {
      this.pendingCall = false;
    }
  };

  private newWalletValidation = (password: string) => {
    if (this.nodeKeyExists) {
      throw errors.NODE_ALREADY_EXISTS;
    }
    if (password.length < 8) {
      // lnd requires 8+ character passwords, so we must as well
      throw errors.INVALID_ARGUMENT('password must be at least 8 characters');
    }
    if (this.swapClientManager.misconfiguredClients.size > 0) {
      const misconfiguredClientLabels: string[] = [];
      this.swapClientManager.misconfiguredClients.forEach((client) => {
        misconfiguredClientLabels.push(client.label);
      });
      throw swapErrors.SWAP_CLIENT_MISCONFIGURED(misconfiguredClientLabels);
    }
  };

  private prepareCall = async (ignoreUnavailableClients = false) => {
    if (this.pendingCall) {
      throw errors.PENDING_CALL_CONFLICT;
    }

    this.pendingCall = true;

    // wait briefly for all lnd instances to be available
    try {
      await this.swapClientManager.waitForLnd();
    } catch (err) {
      if (!ignoreUnavailableClients || err.code !== lndErrorCodes.UNAVAILABLE) {
        throw err;
      }
    }
  };
}

export default InitService;
