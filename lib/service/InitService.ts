import errors from '../service/errors';
import { EventEmitter } from 'events';
import SwapClientManager from '../swaps/SwapClientManager';
import NodeKey from '../nodekey/NodeKey';
import assert = require('assert');

interface InitService {
  once(event: 'nodekey', listener: (nodeKey: NodeKey) => void): this;
  emit(event: 'nodekey', nodeKey: NodeKey): boolean;
}

class InitService extends EventEmitter {
  /** Whether there is a pending `CreateNode` or `UnlockNode` call. */
  public pendingCall = false;

  constructor(private swapClientManager: SwapClientManager, private nodeKeyPath: string, private nodeKeyExists: boolean) {
    super();
  }

  public createNode = async (args: { password: string }) => {
    const { password } = args;
    if (this.nodeKeyExists) {
      throw errors.UNIMPLEMENTED;
    }
    if (this.pendingCall) {
      throw errors.PENDING_CALL_CONFLICT;
    }

    this.pendingCall = true;
    const seed = await this.swapClientManager.genSeed();
    let nodeKey: NodeKey;

    if (seed) {
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
      await this.swapClientManager.initWallets(password, seed.cipherSeedMnemonicList);
    } else {
      // we couldn't generate a seed externally, so we must create one locally
      nodeKey = await NodeKey.generate();
    }

    await nodeKey.toFile(this.nodeKeyPath, password);
    this.emit('nodekey', nodeKey);
    return seed ? seed.cipherSeedMnemonicList : undefined;
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

    const nodeKey = await NodeKey.fromFile(this.nodeKeyPath, password);
    this.emit('nodekey', nodeKey);

    await this.swapClientManager.unlockWallets(password);
  }
}

export default InitService;
