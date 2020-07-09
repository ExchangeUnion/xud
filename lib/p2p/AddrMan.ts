// Ported from https://github.com/bitcoin/bitcoin/blob/master/src/addrman.h

import assert from 'assert';
import { NodeInstance } from '../db/types';
import { createHash } from "crypto";
//import Logger from '../Logger';

class AddrInfo {
  public node = null;
  // time this node was added
  public nTime = 0;
  // last try whatsoever by us
  public nLastTry = 0;
  // last counted attempt
  public nLastAttempt = 0;
  // where knowledge about this address first came from
  private source = null;
  // last successful connection by us
  private nLastSuccess = 0;
  // connection attempts since last successful attempt
  private nAttempts = 0;
  // reference count in new sets
  private nRefCount = 0;
  // in tried set?
  public fInTried = false;
  // position in vRandom
  private nRandomPos = -1;

  // Calculate in which "tried" bucket this entry belongs
  public GetTriedBucket = (key: uint256): number => {
    /*hash this.node.lastAddress and key
    hash again
    mod by AddrMan.TRIED_BUCKET_COUNT*/
    return 0;
  }
  // Calculate in which "new" bucket this entry belongs, given a certain source
  public GetNewBucket = (key: uint256, src: NodeInstance): number => {
    return 0;
  }
  // Calculate in which position of a bucket to store this entry
  public GetBucketPosition = (key: uint256, fNew: boolean, nBucket: number): number => {
    let hash = createHash("sha256").update(key, 'Utf8').digest();
    return hash % AddrMan.BUCKET_SIZE;
  }

  // Determine whether the statistics about this entry are bad enough so that it can just be deleted
  public IsTerrible = (): boolean => {
    const time = new Date().getTime() / 1000;
    if (this.nLastTry && this.nLastTry >= time - 60) {
      return false;
    }
    if (this.nTime > time + 10 * 60) {
      return true;
    }
    if (this.nTime == 0 || time - this.nTime > AddrMan.HORIZON_DAYS * 24 * 60 * 60) {
      return true;
    }
    if (this.nLastSuccess == 0 && this.nAttempts >= AddrMan.RETRIES) {
      return true;
    }
    if (time - this.nLastSuccess > AddrMan.MIN_FAIL_DAYS * 24 * 60 * 60 && this.nAttempts >= AddrMan.MAX_FAILURES) {
      return true;
    }
    return false;
  }
  // Calculate the relative chance this entry should be given when selecting nodes to connect to
  public GetChance = (): number => {
    let fChance = 1.0;
    const time = new Date().getTime() / 1000;
    let nSinceLastTry = max(time - this.nLastTry, 0);
    if (nSinceLastTry < 60 * 10) {
      fChance *- 0.01;
    }
    fChance = pow(0.66, min(this.nAttempts, 8));
    return fChance;
  }
  // Check if this address is routable
  public IsRoutable = (): void => {

  }

}

class AddrMan {
  // last used nId
  public nIdCount;
  // table with information about all nIds
  public mapAddr = new Map<number, AddrInfo>();
  // find an nId based on its network address
  // public mapAddr = new Map<NodeInstance, number>();
  // randomly-ordered vector of all nIds
  public vRandom = [];
  // number of "tried" entries
  public nTried = 0;
  // number of (unique) "new" entries
  public nNew = 0;
  // last time Good was called
  public nLastGood;
  // pnId ?
  public pnId;
  // Holds addrs inserted into tried table that collide with existing entries. Test-before-evict discipline used to resolve these collisions.
  public m_tried_collisions = Set();
  // secret key to randomize bucket select with
  private nKey;
  // total number of buckets for tried addresses
  private static readonly TRIED_BUCKET_COUNT_LOG2 = 8;
  // total number of buckets for new addresses
  private static readonly NEW_BUCKET_COUNT_LOG2 = 10;
  // maximum allowed number of entries in buckets for new and tried addresses
  private static readonly BUCKET_SIZE_LOG2 = 6;
  // over how many buckets entries with tried addresses from a single group  (/16 for IPv4) are spread
  private static readonly TRIED_BUCKETS_PER_GROUP = 8;
  // over how many buckets entries with new addresses originating from a single group are spread
  private static readonly NEW_BUCKETS_PER_SOURCE_GROUP = 64;
  // in how many buckets for entries with new addresses a single address may occur
  private static readonly NEW_BUCKETS_PER_ADDRESS = 8;
  // how old addresses can maximally be
  public static readonly HORIZON_DAYS = 30;
  // after how many failed attempts we give up on a new node
  public static readonly RETRIES = 3;
  // how many successive failures are allowed ...
  public static readonly MAX_FAILURES = 10;
  // ... in at least this many days
  public static readonly MIN_FAIL_DAYS = 7;
  // how recent a successful connection should be before we allow an address to be evicted from tried
  private static readonly REPLACEMENT_HOURS = 4;
  // the maximum percentage of nodes to return in a getaddr call
  private static readonly GETADDR_MAX_PCT = 23;
  // the maximum number of nodes to return in a getaddr call
  private static readonly GETADDR_MAX = 2500;
  // Convenience
  private static readonly TRIED_BUCKET_COUNT = (1 << AddrMan.TRIED_BUCKET_COUNT_LOG2);
  private static readonly NEW_BUCKET_COUNT = (1 << AddrMan.NEW_BUCKET_COUNT_LOG2);
  private static readonly BUCKET_SIZE = (1 << AddrMan.BUCKET_SIZE_LOG2);
  // the maximum number of tried addr collisions to store
  private static readonly SET_TRIED_COLLISION_SIZE = 10;
  // the maximum time we'll spend trying to resolve a tried table collision, in seconds
  private static readonly TEST_WINDOW = 40*60; // 40 minutes

  // list of "tried" buckets
  public vvTried: AddrInfo[AddrMan.TRIED_BUCKET_COUNT][AddrMan.BUCKET_SIZE];
  // list of "new" buckets
  public vvNew = AddrInfo[AddrMan.NEW_BUCKET_COUNT][AddrMan.BUCKET_SIZE];

  // constructor: logger, key, other vars?`

  // Find an entry by url
  public Find = (n: NodeInstance) => {
    let toFind = `${n.node.lastAddress.host}:${n.node.lastAddress.port}`; 
    for (let [k,v] in this.mapAddr) {
      let url = `${v.node.lastAddress.host}:${v.node.lastAddress.port}`;
      if (url == toFind) { // === or == ?
        return [k,v];
      }
    }
    return [-1, null];
  }
  
  // nTime and nServices of the found node are updated, if necessary.
  public Create = (addr: NodeInstance, addrSource: NodeInstance, pnId: number): AddrInfo => {
    let nId = this.nIdCount++;
    let newAddr = new AddrInfo();
    newAddr.node = addr;
    newAddr.source = addrSource;
    newAddr.nRandomPos = this.vRandom.length;
    this.mapAddr.set(nId, newAddr);
    this.vRandom.push(nId);
    if (pnId) {
      this.pnId = pnId;
    }
    return newAddr;
  }
  // Swap two elements in vRandom
  public SwapRandom = (nRndPos1: number, nRndPos2: number): void => {
    if (nRndPos1 === nRndPos2) {
      return;
    }
    assert(nRndPos1 < this.vRandom.length && nRndPos2 < this.vRandom.length);

    let nId1 = this.vRandom[nRndPos1];
    let nId2 = this.vRandom[nRndPos2];

    assert(this.mapAddr.has(nId1) && this.mapAddr.has(nId2));
    
    this.mapAddr[nId1].nRandomPos = nRndPos2;
    this.mapAddr[nId2].nRandomPos = nRndPos1;

    this.vRandom[nRndPos1] = nId2;
    this.vRandom[nRndPos2] = nId1;
  }
  // Move an entry from the "new" table to the "tried" table
  public MakeTried = (nId: number) => {
    // removed the entry from all new buckets
    let entry = this.mapAddr.get(nId);
    for (let bucket = 0; bucket < AddrMan.NEW_BUCKET_COUNT; bucket++) {
      let pos = entry.GetBucketPosition(this.nKey, true, bucket);
      if (this.vvNew[bucket][pos] == nId) {
        this.vvNew[bucket][pos] = -1;
        entry.nRefCount--;
      }
    }
    this.nNew--;
    
    assert(entry.nRefCount == 0);

    // which tried bucket to move the entry to
    let nKBucket = entry.GetTriedBucket(this.nKey);
    let nKBucket = entry.GetBucketPosition(this.nKey, false, nKBucket);

    // first make space to add it (the existing tried entry there is moved to new, deleting whatever is there).
    if (this.vvTried[nKBucket][nKBucketPos] !== -1) {
      // find and item to evict
      let nIdEvict = this.vvTried[nKBucket][nKBucketPos];
      assert(this.mapAddr.count(nIdEvict) == 1);
      let entryOld = this.mapAddr.get(nIdEvict);

      // Remove the to-be-evicted item from the tried set.
      entryOld.fInTried = false;
      this.vvTried[nKBucket][nKBucket] = -1;
      this.nTried--;

      // find which new bucket it belongs to
      let nUBucket = infoOld.GetNewBucket(this.nKey);
      let nUBucket = infoOld.GetBucketPosition(this.nKey, true, nUBucket);
      this.ClearNew(nUBucket, nUBucketPos);
      assert(this.vvNew[nUBucket][nUBucketPos]) == -1;

      // Enter it into the new set again
      entryOld.nRefCount = 1;
      this.mapAddr.set(nIdEvict, entryOld);
      this.vvNew[nUBucket][nUBucketPos] = nIdEvict;
      this.nNew++;
    }
    assert(this.vvTried[nKBucket][nKBucketPos] == -1);

    this.vvTried[nKBucket][nKBucketPos] = nId;
    this.nTried++;
    entry.fInTried = true; 
    this.mapAddr.set(nId, entry);
  }

  // Delete an entry. It must not be in tried, and have refcount 0
  public Delete = (nId: number): void => {
    assert(this.mapAddr.has(nId));
    let entry = this.mapAddr.get(nId);
    assert(!entry.fInTried);
    assert(entry.nRefCount === 0);

    this.SwapRandom(entry.nRandomPos, this.vRandom.length - 1);
    this.vRandom.pop();
    this.mapAddr.delete(nId);
    this.nNew--;
  }
  // Clear a position in a "new" table. This is the only place where entries are actually deleted
  public ClearNew = (nUBucket: number, nUBucketPos: number): void => {
    // if there is an entry in the specified bucket, delete it
    if (this.vvNew[nUBucket][nUBucketPos] !== -1) {
      let nIdDelete = this.vvNew[nUBucket][nUBucketPos];
      let entryDelete = this.mapAddr.get(nIdDelete);
      assert(entryDelete.nRefCount > 0);
      entryDelete.nRefCount--;
      this.mapAddr.set(nIdDelete, entryDelete);
      this.vvNew[nUBucket][nUBucketPos] = -1;
      if (entryDelete.nRefCount == 0) {
        this.Delete(nIdDelete);
      }
    }
  }
  // Mark an entry "good", possibly moving it from "new" to "tried"
  public Good = (addr: NodeInstance, test_before_evict: boolean, nTime: number): void => {
    
    this.nLastGood = nTime;
    let [nId, entry] = this.Find(addr);

    if (!(nId && info)) {
      return;
    }

    if (entry.fInTried) {
      return;
    }
    
    entry.nLastSuccess = nTime;
    entry.nLastTry = nTime;
    entry.nAttempts = 0;
    this.mapAddr.set(nId, entry);

    // find a bucket it is in now
    let nRnd = this.getRandomInt(AddrMan.NEW_BUCKET_COUNT);
    let nUBucket = -1;
    for (let n = 0; n < AddrMan.NEW_BUCKET_COUNT; n++) {
      let nB = (n + nRnd) % AddrMan.NEW_BUCKET_COUNT;
      let nBpos = entry.GetBucketPosition(this.nKey, true, nB);
      if (this.vvNew[nB][nBpos] == nId) {
        nUBucket = nB;
        break;
      }
    }
    // if no bucket is found, something bad happened
    if (nUBucket == -1) {
      return;
    }

    // which tried bucket to move the entry to
    let tried_bucket = entry.GetTriedBucket(this.nKey);
    let tried_bucket_pos = entry.GetBucketPosition(this.nKey, false, tried_bucket);
    if (test_before_evict && (this.vvTried[tried_bucket][tried_bucket_pos] !== -1)) {
      let colliding_entry = this.mapAddr.find(this.vvTried[tried_bucket][tried_bucket_pos]);
      // TODO this.logger.info(`Collision inserting element...`);
      if (this.m_tried_collisions.length < AddrMan.SET_TRIED_COLLISION_SIZE) {
        this.m_tried_collisions.push(nId);
      }
    } else {
      // this.logger.info(`moving to ...`);
      this.MakeTried(nId);
    }
  }
  // TODO Add an entry to the "new" table
  public Add = (addr: NodeInstance, source: NodeInstance, nTimePenalty: number): boolean => {
    if (!(addr.IsRoutable())) {
      return false;
    }
    return true;
  }
  // Mark and entry as attempted to connect
  public Attempt = (addr: NodeInstance, fCountFailure: boolean, nTime: number): void => {
    let [nId, info] = this.Find(addr);

    if (!(nId && info)) {
      return;
    }
    if (info !== addr) {
      return;
    }
    info.nLastTry = nTime;
    if (fCountFailure && info.nLastCountAttempt < this.nLastGood) {
      info.nLastCountAttempt = nTime;
      info.nAttempts++;
    }
    this.mapAddr.set(nId, info);
  }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  // Select an address to connect to, if newOnly is set to true, only the new table is selected from
  public Select = (newOnly: boolean): AddrInfo => {
    // size() == 0?
    
    if (newOnly && this.nNew == 0){
      return new AddrInfo();
    }
    // Use a 50% chance for choosing between tried and new table entries.
    if (!newOnly && (this.nTried > 0 && (this.nNew === 0 || Math.random() < 0.5))) {
      let fChanceFactor = 1.0;
      while (true) {
        let nKBucket = this.getRandomInt(AddrMan.TRIED_BUCKET_COUNT);
        let nKBucketPos = this.getRandomInt(AddrMan.BUCKET_SIZE);
        while (this.vvTried[nKBucket][nKBucketPos] == -1) {
          nKBucket = (nKBucket + this.getRandomInt(AddrMan.TRIED_BUCKET_COUNT)) % AddrMan.TRIED_BUCKET_COUNT;
          nKBucketPos = (nKBucketPos + this.getRandomInt(AddrMan.BUCKET_SIZE)) % AddrMan.BUCKET_SIZE;
        }
        let nId = this.vvTried[nKBucket][nKBucketPos];
        assert(this.mapAddr.count(nId) == 1);
        let info = this.mapAddr.get(nId);
        if (this.getRandomInt(1 << 30) < fChanceFactor * info.GetChance() * (1 << 30)) {
          return info;
        }
        fChanceFactor *= 1.2;
      }
    } else {
       let fChanceFactor = 1.0;
      while (true) {
        let nKBucket = this.getRandomInt(AddrMan.NEW_BUCKET_COUNT);
        let nKBucketPos = this.getRandomInt(AddrMan.BUCKET_SIZE);
        while (this.vvNew[nKBucket][nKBucketPos] == -1) {
          nKBucket = (nKBucket + this.getRandomInt(AddrMan.NEW_BUCKET_COUNT)) % AddrMan.NEW_BUCKET_COUNT;
          nKBucketPos = (nKBucketPos + this.getRandomInt(AddrMan.BUCKET_SIZE)) % AddrMan.BUCKET_SIZE;
        }
        let nId = this.vvNew[nKBucket][nKBucket];
        assert(this.mapAddr.count(nId) == 1);
        let info = this.mapAddr.get(nId);
        if (this.getRandomInt(1 << 30) < fChanceFactor * info.GetChance() * (1 << 30)) {
          return info;
        }
        fChanceFactor *= 1.2;

      }
    }
  }
  // See if any to-be-evicted tried table entries have been tested and if so resolve the collisions
  public ResolveCollisions = (): void => {
    return;
  }
  // Return a random to-be-evicted tried table address
  public SelectTriedCollision = (): AddrInfo => {
    let a = new AddrInfo();
    return a;
  }
}

