import { EventEmitter } from 'events';
import NodeKey from '../nodekey/NodeKey';
import swapErrors from '../swaps/errors';
import SwapClientManager from '../swaps/SwapClientManager';
import errors from './errors';
import assert = require('assert');
import { encipher } from '../utils/seedutil';

interface InitService {
  once(event: 'nodekey', listener: (nodeKey: NodeKey) => void): this;
  emit(event: 'nodekey', nodeKey: NodeKey): boolean;
}

/** A class containing the methods available for a locked, uninitialized instance of xud. */
class InitService extends EventEmitter {
  /** Whether there is a pending `CreateNode` or `UnlockNode` call. */
  private pendingCall = false;

  constructor(private swapClientManager: SwapClientManager, private nodeKeyPath: string, private nodeKeyExists: boolean) {
    super();
  }

  public createNode = async (args: { password: string }) => {
    const { password } = args;

    this.newWalletValidation(password);
    await this.prepareCall();

    try {
      const seed = await this.swapClientManager.genSeed();

      const seedBytes = typeof seed.encipheredSeed === 'string' ?
        Buffer.from(seed.encipheredSeed, 'base64') :
        Buffer.from(seed.encipheredSeed);
      assert.equal(seedBytes.length, 33);

      // the seed is 33 bytes, the first byte of which is the version
      // so we use the remaining 32 bytes to generate our private key
      // TODO: use seedutil tool to derive a child private key from deciphered seed key?
      const privKey = Buffer.from(seedBytes.slice(1));
      const nodeKey = new NodeKey(privKey);

      // use this seed to init any lnd wallets that are uninitialized
      const initWalletResult = await this.swapClientManager.initWallets(password, seed.cipherSeedMnemonicList);
      const initializedLndWallets = initWalletResult.initializedLndWallets;
      const initializedRaiden = initWalletResult.initializedRaiden;

      await nodeKey.toFile(this.nodeKeyPath, password);
      this.emit('nodekey', nodeKey);
      return {
        initializedLndWallets,
        initializedRaiden,
        mnemonic: seed ? seed.cipherSeedMnemonicList : undefined,
      };
    } finally {
      this.pendingCall = false;
    }
  }

  public unlockNode = async (args: { password: string }) => {
    const { password } = args;

    if (!this.nodeKeyExists) {
      throw errors.UNIMPLEMENTED;
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

  public restoreNode = async (args: { password: string, seedMnemonicList: string[] }) => {
    const { password, seedMnemonicList } = args;
    if (seedMnemonicList.length !== 24) {
      throw errors.INVALID_ARGUMENT('mnemonic must be exactly 24 words');
    }

    this.newWalletValidation(password);
    await this.prepareCall();

    try {
      const seedBytes = await encipher(seedMnemonicList);

      // the seed is 33 bytes, the first byte of which is the version
      // so we use the remaining 32 bytes to generate our private key
      // TODO: use seedutil tool to derive a child private key from deciphered seed key?
      const privKey = Buffer.from(seedBytes.slice(1));
      const nodeKey = new NodeKey(privKey);

      // use this seed to restore any lnd wallets that are uninitialized
      const initWalletResult = await this.swapClientManager.initWallets(password, seedMnemonicList);
      const restoredLndWallets = initWalletResult.initializedLndWallets;
      const restoredRaiden = initWalletResult.initializedRaiden;

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
      throw errors.UNIMPLEMENTED;
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
    await this.swapClientManager.waitForLnd();
  }
}

export default InitService;
