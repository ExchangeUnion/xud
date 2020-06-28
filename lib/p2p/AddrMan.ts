// Ported from https://github.com/bitcoin/bitcoin/blob/master/src/addrman.h

import assert from 'assert';
import { NodeInstance } from '../db/types';
import { createHash } from "crypto";

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
  private fintried = false;
  // position in vRandom
  private nRandomPos = -1;

  // Calculate in which "tried" bucket this entry belongs
  public GetTriedBucket = (key: uint256): number => {
    /*hash this.node.lastAddress and key
    hash again
    mod by AddrMan.ADDRMAN_TRIED_BUCKET_COUNT*/
    return 0;
  }
  // Calculate in which "new" bucket this entry belongs, given a certain source
  public GetNewBucket = (key: uint256, src: NodeInstance): number => {
    return 0;
  }
  // Calculate in which position of a bucket to store this entry
  public GetBucketPosition = (key: uint256, fNew: boolean, nBucket: number): number => {
    let hash = createHash("sha256").update(key, 'Utf8').digest();
    return hash % AddrMan.ADDRMAN_BUCKET_SIZE;
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
    if (this.nTime == 0 || time - this.nTime > AddrMan.ADDRMAN_HORIZON_DAYS * 24 * 60 * 60) {
      return true;
    }
    if (this.nLastSuccess == 0 && this.nAttempts >= AddrMan.ADDRMAN_RETRIES) {
      return true;
    }
    if (time - this.nLastSuccess > AddrMan.ADDRMAN_MIN_FAIL_DAYS * 24 * 60 * 60 && this.nAttempts >= AddrMan.ADDRMAN_MAX_FAILURES) {
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

}

class AddrMan {
  // last used nId
  public nIdCount;
  // table with informatino about all nIds
  public mapInfo = new Map<number, NodeInstance>();
  // find an nId based on its network address
  public mapAddr = new Map<NodeInstance, number>();
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
  private static readonly ADDRMAN_TRIED_BUCKET_COUNT_LOG2 = 8;
  // total number of buckets for new addresses
  private static readonly ADDRMAN_NEW_BUCKET_COUNT_LOG2 = 10;
  // maximum allowed number of entries in buckets for new and tried addresses
  private static readonly ADDRMAN_BUCKET_SIZE_LOG2 = 6;
  // over how many buckets entries with tried addresses from a single group  (/16 for IPv4) are spread
  private static readonly ADDRMAN_TRIED_BUCKETS_PER_GROUP = 8;
  // over how many buckets entries with new addresses originating from a single group are spread
  private static readonly ADDRMAN_NEW_BUCKETS_PER_SOURCE_GROUP = 64;
  // in how many buckets for entries with new addresses a single address may occur
  private static readonly ADDRMAN_NEW_BUCKETS_PER_ADDRESS = 8;
  // how old addresses can maximally be
  public static readonly ADDRMAN_HORIZON_DAYS = 30;
  // after how many failed attempts we give up on a new node
  public static readonly ADDRMAN_RETRIES = 3;
  // how many successive failures are allowed ...
  public static readonly ADDRMAN_MAX_FAILURES = 10;
  // ... in at least this many days
  public static readonly ADDRMAN_MIN_FAIL_DAYS = 7;
  // how recent a successful connection should be before we allow an address to be evicted from tried
  private static readonly ADDRMAN_REPLACEMENT_HOURS = 4;
  // the maximum percentage of nodes to return in a getaddr call
  private static readonly ADDRMAN_GETADDR_MAX_PCT = 23;
  // the maximum number of nodes to return in a getaddr call
  private static readonly ADDRMAN_GETADDR_MAX = 2500;
  // Convenience
  private static readonly ADDRMAN_TRIED_BUCKET_COUNT = (1 << AddrMan.ADDRMAN_TRIED_BUCKET_COUNT_LOG2);
  private static readonly ADDRMAN_NEW_BUCKET_COUNT = (1 << AddrMan.ADDRMAN_NEW_BUCKET_COUNT_LOG2);
  private static readonly ADDRMAN_BUCKET_SIZE = (1 << AddrMan.ADDRMAN_BUCKET_SIZE_LOG2);
  // the maximum number of tried addr collisions to store
  private static readonly ADDRMAN_SET_TRIED_COLLISION_SIZE = 10;
  // the maximum time we'll spend trying to resolve a tried table collision, in seconds
  private static readonly ADDRMAN_TEST_WINDOW = 40*60; // 40 minutes

  // list of "tried" buckets
  public vvTried: AddrInfo[AddrMan.ADDRMAN_TRIED_BUCKET_COUNT][AddrMan.ADDRMAN_BUCKET_SIZE];
  // list of "new" buckets
  public vvNew = AddrInfo[AddrMan.ADDRMAN_NEW_BUCKET_COUNT][AddrMan.ADDRMAN_BUCKET_SIZE];

  // Find an entry
  public Find = (node: NodeInstance, pnId: number): AddrInfo => {
    for (let [k,v] in this.mapAddr) {
      if (v == node) { // === or == ?
        return k;
      }
    }
    return null;
  }
  // find an entry, creating it if necessary.
  // nTime and nServices of the found node are updated, if necessary.
  public Create = (addr: NodeInstance, addrSource: NodeInstance, pnId: number): AddrInfo => {
    let nId = this.nIdCount++;
    this.mapInfo[nId] = new AddrInfo();
    this.mapInfo[nId].node = addr;
    this.mapInfo[nId].source = addrSource;
    this.mapAddr[addr] = nId;
    this.mapInfo[nId].nRandomPos = this.vRandom.length;
    this.vRandom.push(nId);
    if (pnId) {
      this.pnId = pnId;
    }
    return this.mapInfo[nId];
  }
  // Swap two elements in vRandom
  public SwapRandom = (nRndPos1: number, nRndPos2: number): void => {
    if (nRndPos1 === nRndPos2) {
      return;
    }
    assert(nRndPos1 < this.vRandom.length && nRndPos2 < this.vRandom.length);

    let nId1 = this.vRandom[nRndPos1];
    let nId2 = this.vRandom[nRndPos2];

    assert(this.mapInfo.has(nId1) && this.mapInfo.has(nId2));
    
    this.mapInfo[nId1].nRandomPos = nRndPos2;
    this.mapInfo[nId2].nRandomPos = nRndPos1;

    this.vRandom[nRndPos1] = nId2;
    this.vRandom[nRndPos2] = nId1;
  }
  // Move an entry from the "new" table = (s) to the "tried" table
  public MakeTried = (info: NodeInstance, nId: number) => {
    return 0;
  }
  // Delete an entry. It must not be in tried, and have refcount 0
  public Delete = (nId: number): void => {
    assert(this.mapInfo.has(nId));
    let info = this.mapInfo[nId];
    assert(!info.fInTried);
    assert(info.nRefCount === 0);

    this.SwapRandom(info.nRandomPos, vRandom.length - 1);
    this.vRandom.pop();
    this.mapAddr.delete(info);
    this.mapInfo.delete(nId);
    this.nNew--;
  }
  // Clear a position in a "new" table. This is the only place where entries are actually deleted
  public ClearNew = (nUBucket: number, nUBucketPos: number): void => {
  }
  // Mark an entry "good", possibly moving it from "new" to "tried"
  public Good = (addr: NodeInstance, test_before_evict: boolean, time: number): void => {
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
  }
  private getRandomInt(max) {
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
        let nKBucket = this.getRandomInt(AddrMan.ADDRMAN_TRIED_BUCKET_COUNT);
        let nKBucketPos = this.getRandomInt(AddrMan.ADDRMAN_BUCKET_SIZE);
        while (this.vvTried[nKBucket][nKBucketPos] == -1) {
          nKBucket = (nKBucket + 
    return new AddrInfo();
  }
  // See if any to-be-evicted tried table entries have been tested and if so resolve the collisions
  public ResolveCollisions = (): void => {
  }
  // Return a random to-be-evicted tried table address
  public SelectTriedCollision = (): AddrInfo => {
    let a = new AddrInfo();
    return a;
  }
}

