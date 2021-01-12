// Ported from https://github.com/bitcoin/bitcoin/blob/master/src/addrman.h

import assert from 'assert';
import { createHash } from 'crypto';
import { NodeInstance } from '../db/types';
// import { NodeState } from './types';
// import Logger from '../Logger';

class AddrInfo {
  public node: NodeInstance;
  // time this node was added
  public nTime = 0;
  // last try whatsoever by us
  public nLastTry = 0;
  // last counted attempt
  public nLastAttempt = 0;
  // host IP where knowledge about this address first came from
  public sourceIP: string;
  // last successful connection by us
  public nLastSuccess = 0;
  // connection attempts since last successful attempt
  public nAttempts = 0;
  // reference count in new sets
  public nRefCount = 0;
  // in tried set?
  public fInTried = false;
  // position in vRandom
  public nRandomPos = -1;

  constructor({ node, sourceIP }: { node: NodeInstance; sourceIP: string }) {
    this.node = node;
    this.sourceIP = sourceIP;
  }

  // Calculate in which "tried" bucket this entry belongs
  public GetTriedBucket = (key: number): number => {
    const hash1 = createHash('sha256').update(key.toString()).update(this.node.nodePubKey).digest('hex');
    const hash2 = createHash('sha256')
      .update(key.toString())
      .update((parseInt(hash1, 16) % AddrMan.TRIED_BUCKETS_PER_SOURCE_GROUP).toString())
      .digest('hex');
    const triedBucket = Number(BigInt(`0x${hash2}`) % BigInt(AddrMan.TRIED_BUCKET_COUNT));
    return triedBucket;
  };
  // Calculate in which "new" bucket this entry belongs, given a certain source (ignoring asmap concerns)
  public GetNewBucket = (key: number, src?: string): number => {
    const source = src || 'none';

    const hash1 = createHash('sha256').update(key.toString()).update(source).digest('hex');
    const hash2 = createHash('sha256')
      .update(key.toString())
      .update((parseInt(hash1, 16) % AddrMan.NEW_BUCKETS_PER_SOURCE_GROUP).toString())
      .digest('hex');
    const newBucket = Number(BigInt(`0x${hash2}`) % BigInt(AddrMan.NEW_BUCKET_COUNT));
    return newBucket;
  };
  // Calculate in which position of a bucket to store this entry
  public GetBucketPosition = (key: number, fNew: boolean, nBucket: number): number => {
    let url = this.node.lastAddressText;
    if (url === null) {
      const parsed = JSON.parse(this.node.addressesText)[0];
      url = `${parsed.host}:${parsed.port}`;
    }
    const hash = createHash('sha256')
      .update(key.toString())
      .update(fNew ? 'N' : 'K')
      .update(nBucket.toString())
      .update(url)
      .digest('hex');
    const pos = Number(BigInt(`0x${hash}`) % BigInt(AddrMan.BUCKET_SIZE));
    return pos;
  };

  // Determine whether the statistics about this entry are bad enough so that it can just be deleted
  public IsTerrible = (): boolean => {
    const time = new Date().getTime() / 1000;
    if (this.nLastTry && this.nLastTry >= time - 60) {
      return false;
    }
    if (this.nTime > time + 10 * 60) {
      return true;
    }
    if (this.nTime === 0 || time - this.nTime > AddrMan.HORIZON_DAYS * 24 * 60 * 60) {
      return true;
    }
    if (this.nLastSuccess === 0 && this.nAttempts >= AddrMan.RETRIES) {
      return true;
    }
    if (time - this.nLastSuccess > AddrMan.MIN_FAIL_DAYS * 24 * 60 * 60 && this.nAttempts >= AddrMan.MAX_FAILURES) {
      return true;
    }
    return false;
  };
  // Calculate the relative chance this entry should be given when selecting nodes to connect to
  public GetChance = (): number => {
    let fChance = 1.0;
    const time = new Date().getTime() / 1000;
    const nSinceLastTry = Math.max(time - this.nLastTry, 0);
    if (nSinceLastTry < 60 * 10) {
      fChance * -0.01;
    }
    fChance = 0.66 ** Math.min(this.nAttempts, 8);
    return fChance;
  };
}

class AddrMan {
  // last used nId
  public nIdCount = -1;
  // table with information about all nIds
  public addrMap = new Map<number, AddrInfo>();
  // find an nId based on its network address
  // public addrMap = new Map<NodeInstance, number>();
  // randomly-ordered vector of all nIds
  public vRandom: number[] = [];
  // number of "tried" entries
  public nTried = 0;
  // number of (unique) "new" entries
  public nNew = 0;
  // last time Good was called
  public nLastGood = 0;
  // pnId ?
  // public pnId;
  // Holds addrs inserted into tried table that collide with existing entries. Test-before-evict discipline used to resolve these collisions.
  public mTriedCollisions = new Set();
  // secret key to randomize bucket select with
  private nKey: number;
  // total number of buckets for tried addresses
  private static readonly TRIED_BUCKET_COUNT_LOG2 = 4; // 8;
  // total number of buckets for new addresses
  private static readonly NEW_BUCKET_COUNT_LOG2 = 4; // 10;
  // maximum allowed number of entries in buckets for new and tried addresses
  private static readonly BUCKET_SIZE_LOG2 = 4; // 6;
  // over how many buckets entries with tried addresses from a single group  (/16 for IPv4) are spread
  public static readonly TRIED_BUCKETS_PER_SOURCE_GROUP = 4; // 8;
  // over how many buckets entries with new addresses originating from a single group are spread
  public static readonly NEW_BUCKETS_PER_SOURCE_GROUP = 4; // 64
  // in how many buckets for entries with new addresses a single address may occur
  private static readonly NEW_BUCKETS_PER_ADDRESS = 4; // 8
  // how old addresses can maximally be
  public static readonly HORIZON_DAYS = 30;
  // after how many failed attempts we give up on a new node
  public static readonly RETRIES = 3;
  // how many successive failures are allowed ...
  public static readonly MAX_FAILURES = 10;
  // ... in at least this many days
  public static readonly MIN_FAIL_DAYS = 7;
  // how recent a successful connection should be before we allow an address to be evicted from tried
  // private static readonly REPLACEMENT_HOURS = 4;
  // the maximum percentage of nodes to return in a getaddr call
  // private static readonly GETADDR_MAX_PCT = 23;
  // the maximum number of nodes to return in a getaddr call
  // private static readonly GETADDR_MAX = 2500;
  // Convenience
  public static readonly TRIED_BUCKET_COUNT = 2 ** AddrMan.TRIED_BUCKET_COUNT_LOG2;
  public static readonly NEW_BUCKET_COUNT = 2 ** AddrMan.NEW_BUCKET_COUNT_LOG2;
  public static readonly BUCKET_SIZE = 2 ** AddrMan.BUCKET_SIZE_LOG2;
  // the maximum number of tried addr collisions to store
  private static readonly SET_TRIED_COLLISION_SIZE = 10;
  // the maximum time we'll spend trying to resolve a tried table collision, in seconds
  // private static readonly TEST_WINDOW = 40*60; // 40 minutes

  // list of "tried" buckets
  public vvTried: number[][] = new Array(AddrMan.TRIED_BUCKET_COUNT)
    .fill(-1)
    .map(() => new Array(AddrMan.BUCKET_SIZE).fill(-1));
  // list of "new" buckets
  public vvNew: number[][] = new Array(AddrMan.NEW_BUCKET_COUNT)
    .fill(-1)
    .map(() => new Array(AddrMan.BUCKET_SIZE).fill(-1)); // = new Array(AddrMan.NEW_BUCKET_COUNT).fill(-1).map(() => new Array(AddrMan.BUCKET_SIZE).fill(-1));

  // constructor: logger, key, other vars?`
  constructor({ key }: { key: number }) {
    this.nKey = key;
  }

  // Find an entry by url. Returns last known instance of NodeInstance n
  public Find = (n: NodeInstance): [number, AddrInfo | undefined] => {
    if (this.addrMap.size >= 1) {
      // let toFind = n.nodePubKey;
      /* if (toFind === null) {
        //console.log("AM", n.addressesText, JSON.parse(n.addressesText));
        let parsed = JSON.parse(n['addressesText'])[0];
        toFind =`${parsed['host']}:${parsed['port']}`;
      } */
      // console.log("AM finding ", toFind);

      // let url = "";
      // console.log("AM searching for node in addrMap");
      for (const [k, v] of this.addrMap) {
        /* if (v.node.lastAddressText !== "null") {
          url = `${v.node.lastAddressText}`;
        } else{
          let parsed = JSON.parse(v.node['addressesText'])[0];
          url = `${parsed['host']}:${parsed['port']}`;
        } */

        if (v.node.nodePubKey === n.nodePubKey) {
          console.log('AM found node in addrMap');
          return [k, v];
        }
      }
    }
    // console.log("did not find node in addrMap");
    return [-2, undefined];
  };

  public ShowContents = (): void => {
    console.log('==== AddrMap ====');
    for (const [k, v] of this.addrMap) {
      console.log(k, v.node!.addressesText);
    }
    console.log('=================');
  };

  public GetNodeByPubKey = (pubkey: string): NodeInstance | undefined => {
    for (const v of this.addrMap.values()) {
      const { nodePubKey } = v.node;
      if (pubkey === nodePubKey) {
        return v.node;
      }
    }
    return undefined;
  };

  // nTime and nServices of the found node are updated, if necessary.
  public Create = (addr: NodeInstance, sourceIP: string): AddrInfo => {
    this.nIdCount += 1;
    const nId = this.nIdCount;
    const newAddr = new AddrInfo({ node: addr, sourceIP });
    newAddr.nRandomPos = this.vRandom.length;
    newAddr.nRefCount = 0;
    this.addrMap.set(nId, newAddr);
    this.vRandom.push(nId);
    return newAddr;
  };
  // Swap two elements in vRandom
  public SwapRandom = (nRndPos1: number, nRndPos2: number): void => {
    if (nRndPos1 === nRndPos2) {
      return;
    }
    assert(nRndPos1 < this.vRandom.length && nRndPos2 < this.vRandom.length);

    const nId1 = this.vRandom[nRndPos1];
    const nId2 = this.vRandom[nRndPos2];

    assert(this.addrMap.has(nId1) && this.addrMap.has(nId2));

    const tmp1 = this.addrMap.get(nId1);
    tmp1!.nRandomPos = nRndPos2;
    this.addrMap.set(nId1, tmp1!);
    const tmp2 = this.addrMap.get(nId2);
    tmp2!.nRandomPos = nRndPos1;
    this.addrMap.set(nId2, tmp2!);

    this.vRandom[nRndPos1] = nId2;
    this.vRandom[nRndPos2] = nId1;
  };
  // Move an entry from the "new" table to the "tried" table
  public MakeTried = (nId: number) => {
    // removed the entry from all new buckets
    const entry = this.addrMap.get(nId);
    if (entry) {
      for (let bucket = 0; bucket < AddrMan.NEW_BUCKET_COUNT; bucket += 1) {
        const pos = entry.GetBucketPosition(this.nKey, true, bucket);
        if (this.vvNew[bucket][pos] === nId) {
          this.vvNew[bucket][pos] = -1;
          entry.nRefCount -= 1;
        }
      }
      this.nNew -= 1;

      assert(entry.nRefCount === 0);

      // which tried bucket to move the entry to
      const nKBucket = entry.GetTriedBucket(this.nKey);
      const nKBucketPos = entry.GetBucketPosition(this.nKey, false, nKBucket);

      // first make space to add it (the existing tried entry there is moved to new, deleting whatever is there).
      if (this.vvTried[nKBucket][nKBucketPos] !== -1) {
        console.log('AM tried slot is not empty, has: ', this.vvTried[nKBucket][nKBucketPos]);
        // find and item to evict
        const nIdEvict = this.vvTried[nKBucket][nKBucketPos];
        console.log('nId is', nIdEvict);
        assert(this.addrMap.has(nIdEvict));
        const entryOld = this.addrMap.get(nIdEvict);
        console.log('entryOld is', entryOld!.node.nodePubKey);

        // Remove the to-be-evicted item from the tried set.
        if (entryOld) {
          entryOld.fInTried = false;
          this.vvTried[nKBucket][nKBucketPos] = -1;
          this.nTried -= 1;

          // find which new bucket it belongs to
          const nUBucket = entryOld.GetNewBucket(this.nKey);
          const nUBucketPos = entryOld.GetBucketPosition(this.nKey, true, nUBucket);
          console.log('clearing: ', nUBucket, nUBucketPos);
          this.ClearNew(nUBucket, nUBucketPos);
          assert(this.vvNew[nUBucket][nUBucketPos] === -1);

          // Enter it into the new set again
          entryOld.nRefCount = 1;
          this.addrMap.set(nIdEvict, entryOld);
          this.vvNew[nUBucket][nUBucketPos] = nIdEvict;
          this.nNew += 1;
        }
      }
      assert(this.vvTried[nKBucket][nKBucketPos] === -1);

      this.vvTried[nKBucket][nKBucketPos] = nId;
      this.nTried += 1;
      entry.fInTried = true;
      this.addrMap.set(nId, entry);
    }
  };

  // Delete an entry. It must not be in tried, and have refcount 0
  public Delete = (nId: number): void => {
    // assert(this.addrMap.has(nId));
    const entry = this.addrMap.get(nId);
    if (entry) {
      assert(!entry.fInTried);
      assert(entry.nRefCount === 0);

      this.SwapRandom(entry.nRandomPos, this.vRandom.length - 1);
      this.vRandom.pop();
      this.addrMap.delete(nId);
      this.nNew -= 1;
    }
  };

  // Clear a position in a "new" table. This is the only place where entries are actually deleted
  public ClearNew = (nUBucket: number, nUBucketPos: number): void => {
    // if there is an entry in the specified bucket, delete it
    console.log('AM clearing entry in new table');
    if (this.vvNew[nUBucket][nUBucketPos] !== -1) {
      const nIdDelete = this.vvNew[nUBucket][nUBucketPos];
      console.log('AM deleting nId', nIdDelete);
      const entryDelete = this.addrMap.get(nIdDelete);
      if (entryDelete) {
        console.log('AM deleting node ', entryDelete.node.nodePubKey);
        assert(entryDelete.nRefCount > 0);
        entryDelete.nRefCount -= 1;
        this.addrMap.set(nIdDelete, entryDelete);
        this.vvNew[nUBucket][nUBucketPos] = -1;
        if (entryDelete.nRefCount === 0) {
          this.Delete(nIdDelete);
        }
      } else {
        console.log('AM no entry to clear, not deleting anything');
      }
    } else {
      console.log('AM entry is already clear');
    }
  };
  // Mark an entry "good", possibly moving it from "new" to "tried"
  public Good = (addr: NodeInstance): void => {
    const nTime = new Date().getTime() / 1000;
    this.nLastGood = nTime;
    const [nId, entry] = this.Find(addr);

    if (!(nId && entry)) {
      return;
    }

    if (entry.fInTried) {
      return;
    }

    entry.nLastSuccess = nTime;
    entry.nLastTry = nTime;
    entry.nAttempts = 0;
    this.addrMap.set(nId, entry);

    // find a bucket it is in now
    const nRnd = this.getRandomInt(AddrMan.NEW_BUCKET_COUNT);
    let nUBucket = -1;
    for (let n = 0; n < AddrMan.NEW_BUCKET_COUNT; n += 1) {
      const nB = (n + nRnd) % AddrMan.NEW_BUCKET_COUNT;
      const nBpos = entry.GetBucketPosition(this.nKey, true, nB);
      if (this.vvNew[nB][nBpos] === nId) {
        nUBucket = nB;
        break;
      }
    }
    // if no bucket is found, something bad happened
    if (nUBucket === -1) {
      return;
    }

    // which tried bucket to move the entry to
    const triedBucket = entry.GetTriedBucket(this.nKey);
    const triedBucketPos = entry.GetBucketPosition(this.nKey, false, triedBucket);
    if (this.vvTried[triedBucket][triedBucketPos] !== -1) {
      // let colliding_entry = this.addrMap.get(this.vvTried[tried_bucket][tried_bucket_pos]);
      // TODO this.logger.info(`Collision inserting element...`);
      if (this.mTriedCollisions.size < AddrMan.SET_TRIED_COLLISION_SIZE) {
        this.mTriedCollisions.add(nId);
      }
    } else {
      // this.logger.info(`moving to ...);
      this.MakeTried(nId);
    }
  };

  // Add an entry to the "new" table. The addr node was either a seed or advertised by a peer: seeds are placed directly into a tried bucket
  public Add = (addr: NodeInstance, sourceIP: string, nTimePenalty?: number, isSeedNode?: boolean): boolean => {
    let fNew = false;
    let [nId, entry] = this.Find(addr);
    let host = '';

    if (addr.lastAddressText !== null) {
      host = addr.lastAddressText.split(':')[0];
    } else {
      const parsed = JSON.parse(addr.addressesText)[0];
      host = parsed.host;
    }

    if (!nTimePenalty || host === sourceIP) {
      nTimePenalty = 0;
    }

    if (entry !== undefined) {
      console.log('updating existing entry');

      const time = new Date().getTime() / 1000;

      // check most recent connection time
      if (addr.lastAddress !== undefined && addr.lastAddress.lastConnected !== undefined) {
        const { lastConnected } = addr.lastAddress;
        const fCurrentlyOnline = time - lastConnected < 24 * 60 * 60;
        const nUpdateInterval = fCurrentlyOnline ? 60 * 60 : 24 * 60 * 60;
        if (!entry.nTime || entry.nTime < lastConnected - nUpdateInterval - nTimePenalty) {
          entry.nTime = Math.max(0, lastConnected - nTimePenalty);
        }

        // do not update if no new information is present
        if (lastConnected <= entry.nTime) {
          // if bugs arise here then ensure that Address timestamps are getting updated accurately
          return false;
        }
      }
      // do not update if the entry was already in the "tried" table
      if (entry.fInTried) {
        return false;
      }
      // do not update if the max reference count is reached
      if (entry.nRefCount === AddrMan.NEW_BUCKETS_PER_ADDRESS) {
        return false;
      }
      // stochastic test: previous nRefCount === N: 2^N times harder to increase it
      let nFactor = 1;
      for (let n = 0; n < entry.nRefCount; n += 1) {
        nFactor *= 2;
      }
      if (nFactor > 1 && this.getRandomInt(nFactor) !== 0) {
        return false;
      }
    } else {
      console.log('AM creating new entry');
      entry = this.Create(addr, sourceIP);
      entry.nTime = Math.max(0, entry.nTime - nTimePenalty);
      entry.nRefCount = 0;
      this.nNew += 1;
      fNew = true;
      nId = this.nIdCount;
    }

    const nUBucket = entry.GetNewBucket(this.nKey, sourceIP);
    const nUBucketPos = entry.GetBucketPosition(this.nKey, true, nUBucket);
    // console.log("y is ", nUBucket, "x is ", nUBucketPos);

    if (this.vvNew[nUBucket][nUBucketPos] !== nId) {
      // only true if something else is there
      let fInsert = this.vvNew[nUBucket][nUBucketPos] === -1; // true if slot is empty
      // will insert (overwrite) if the existing entry is -1
      if (!fInsert) {
        assert(this.addrMap.has(this.vvNew[nUBucket][nUBucketPos]) === true);
        const entryExisting = this.addrMap.get(this.vvNew[nUBucket][nUBucketPos]);
        if (entryExisting!.IsTerrible() || (entryExisting!.nRefCount > 1 && entry.nRefCount === 0)) {
          // Overwrite the existing new table entry.
          fInsert = true;
        }
      }
      if (fInsert) {
        // console.log("AM overwriting existing entry...");
        console.log('clearing: ', nUBucket, nUBucketPos);
        this.ClearNew(nUBucket, nUBucketPos);
        entry.nRefCount += 1;
        this.addrMap.set(nId, entry);
        this.vvNew[nUBucket][nUBucketPos] = nId;
        console.log('moving seed node to a tried bucket');
        if (isSeedNode) {
          this.MakeTried(nId);
        }
      } else if (entry.nRefCount === 0) {
        this.Delete(nId);
      }
    }
    // console.log("AM vvNew inserted bucket is now: ", this.vvNew[nUBucket]);
    // console.log("AM addrMap is now: ", this.addrMap);
    return fNew;
  };
  // Update metadata:  attempted to connect but all addresses were bad
  public Attempt = (addr: NodeInstance): void => {
    console.log('AM attempt fxn');
    const [nId, info] = this.Find(addr);

    if (!(nId && info)) {
      console.log('AM attempt fxn Find() failed');
      return;
    }
    // if (info) {
    // if (info.node.lastAddress.host !== addr.lastAddress.host) {
    //  return;
    // }
    info.nLastTry = new Date().getTime() / 1000;
    if (info.nLastAttempt < this.nLastGood) {
      info.nLastAttempt = info.nLastTry;
      info.nAttempts += 1;
    }
    console.log('AM attempt fxn updated metadata successfully');
    this.addrMap.set(nId, info); // unneccessary b/c info is reference?
    // }
  };

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  // Select an address to connect to, if newOnly is set to true, only the new table is selected from
  public Select = (newOnly: boolean): NodeInstance | undefined => {
    if (this.nNew === 0 && this.nTried === 0) {
      return undefined;
    }

    if (newOnly && this.nNew === 0) {
      // return new AddrInfo();
      return undefined;
    }
    // Use a 50% chance for choosing between tried and new table entries.
    if (!newOnly && this.nTried > 0 && (this.nNew === 0 || Math.random() < 0.5)) {
      let fChanceFactor = 1.0;
      while (true) {
        let nKBucket = this.getRandomInt(AddrMan.TRIED_BUCKET_COUNT);
        let nKBucketPos = this.getRandomInt(AddrMan.BUCKET_SIZE);
        while (this.vvTried[nKBucket][nKBucketPos] === -1) {
          nKBucket = (nKBucket + this.getRandomInt(AddrMan.TRIED_BUCKET_COUNT)) % AddrMan.TRIED_BUCKET_COUNT;
          nKBucketPos = (nKBucketPos + this.getRandomInt(AddrMan.BUCKET_SIZE)) % AddrMan.BUCKET_SIZE;
        }
        const nId = this.vvTried[nKBucket][nKBucketPos];
        assert(this.addrMap.has(nId));
        const info = this.addrMap.get(nId);
        if (info && this.getRandomInt(2 ** 30) < fChanceFactor * info.GetChance() * 2 ** 30) {
          return info.node;
        }
        fChanceFactor *= 1.2;
      }
    } else {
      let fChanceFactor = 1.0;
      // console.log("AM vvNew is ", this.vvNew);
      while (true) {
        let nKBucket = this.getRandomInt(AddrMan.NEW_BUCKET_COUNT);
        let nKBucketPos = this.getRandomInt(AddrMan.BUCKET_SIZE);
        while (this.vvNew[nKBucket][nKBucketPos] === -1) {
          nKBucket = (nKBucket + this.getRandomInt(AddrMan.NEW_BUCKET_COUNT)) % AddrMan.NEW_BUCKET_COUNT;
          nKBucketPos = (nKBucketPos + this.getRandomInt(AddrMan.BUCKET_SIZE)) % AddrMan.BUCKET_SIZE;
        }
        const nId = this.vvNew[nKBucket][nKBucketPos];
        // console.log("AM selected nId is: ", nId);

        const info = this.addrMap.get(nId);
        if (info !== undefined && this.getRandomInt(2 ** 30) < fChanceFactor * info.GetChance() * 2 ** 30) {
          return info.node;
        }
        fChanceFactor *= 1.2;
      }
    }
  };
  // TODO See if any to-be-evicted tried table entries have been tested and if so resolve the collisions
  public ResolveCollisions = (): void => {};
  // TODO Return a random to-be-evicted tried table address
  /* public SelectTriedCollision = (): AddrInfo => {
    let a = new AddrInfo();
    return a;
  } */
}

export default AddrMan;
export { AddrInfo };
