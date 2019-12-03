import { EventEmitter } from 'events';
import NodeKey from '../nodekey/NodeKey';
import swapErrors from '../swaps/errors';
import SwapClientManager from '../swaps/SwapClientManager';
import errors from './errors';
import assert = require('assert');

interface InitService {
  once(event: 'nodekey', listener: (nodeKey: NodeKey) => void): this;
  emit(event: 'nodekey', nodeKey: NodeKey): boolean;
}

/** A class containing the methods available for a locked, uninitialized instance of xud. */
class InitService extends EventEmitter {
  /** Whether there is a pending `CreateNode` or `UnlockNode` call. */
  public pendingCall = false;

  constructor(private swapClientManager: SwapClientManager, private nodeKeyPath: string, private nodeKeyExists: boolean) {
    super();
  }

  public createNode = async (args: { password: string }) => {
    const { password } = args;
    if (password.length < 8) {
      // lnd requires 8+ character passwords, so we must as well
      throw errors.INVALID_ARGUMENT('password must be at least 8 characters');
    }
    if (this.nodeKeyExists) {
      throw errors.UNIMPLEMENTED;
    }
    if (this.swapClientManager.misconfiguredClientLabels.length > 0) {
      throw swapErrors.SWAP_CLIENT_MISCONFIGURED(this.swapClientManager.misconfiguredClientLabels);
    }
    if (this.pendingCall) {
      throw errors.PENDING_CALL_CONFLICT;
    }

    this.pendingCall = true;

    // wait briefly for all lnd instances to be available
    await this.swapClientManager.waitForLnd();

    const seed = await this.swapClientManager.genSeed();
    let initializedLndWallets: string[] | undefined;
    let initializedRaiden = false;
    let nodeKey: NodeKey;

    const seedBytes = typeof seed.encipheredSeed === 'string' ?
      Buffer.from(seed.encipheredSeed, 'base64') :
      Buffer.from(seed.encipheredSeed);
    assert.equal(seedBytes.length, 33);

    // the seed is 33 bytes, the first byte of which is the version
    // so we use the remaining 32 bytes to generate our private key
    // TODO: use seedutil tool to derive a child private key from deciphered seed key?
    const privKey = Buffer.from(seedBytes.slice(1));
    nodeKey = new NodeKey(privKey);

    // use this seed to init any lnd wallets that are uninitialized
    const initWalletResult = await this.swapClientManager.initWallets(password, seed.cipherSeedMnemonicList);
    initializedLndWallets = initWalletResult.initializedLndWallets;
    initializedRaiden = initWalletResult.initializedRaiden;

    await nodeKey.toFile(this.nodeKeyPath, password);
    this.emit('nodekey', nodeKey);
    return {
      initializedLndWallets,
      initializedRaiden,
      mnemonic: seed ? seed.cipherSeedMnemonicList : undefined,
    };
  }

  public unlockNode = async (args: { password: string }) => {
    const { password } = args;
    if (!this.nodeKeyExists) {
      throw errors.UNIMPLEMENTED;
    }
    if (this.pendingCall) {
      throw errors.PENDING_CALL_CONFLICT;
    }

    this.pendingCall = true;

    // wait briefly for all lnd instances to be available
    await this.swapClientManager.waitForLnd();

    const nodeKey = await NodeKey.fromFile(this.nodeKeyPath, password);
    this.emit('nodekey', nodeKey);

    return this.swapClientManager.unlockWallets(password);
  }
}

export default InitService;
