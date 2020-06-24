// Ported from https://github.com/bitcoin/bitcoin/blob/master/src/addrman.h

import { NodeInstance } from '../db/types';

class AddrInfo {
  public node = null;
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
  }
  // Calculate in which "new" bucket this entry belongs, given a certain source
  public GetNewBucket = (key: uint256, src: NodeInstance): number => {
  }
  // Calculate in which position of a bucket to store this entry
  public GetBucketPosition = (key: uint256, fNew: boolean, nBucket: number): number => {
  }
  // Determine whether the statistics about this entry are bad enough so that it can just be deleted
  public IsTerrible = (): boolean => {
  }
  // Calculate the relative chance this entry should be given when selecting nodes to connect to
  public GetChance = (): float => {
  }

}

class AddrMan {
  // last used nId
  public nIdCount;
  // table with informatino about all nIds
  public mapInfo = new Map<NodeInstance, number>();
  // find an nId based on its network address
  public mapAddr = new Map<NodeInstance, number>();
  // randomly-ordered vector of all nIds
  public vRandom = [];
  // number of "tried" entries
  public nTried = 0;
  // list of "tried" buckets
  public vvTried: AddrInfo[ADDRMAN_TRIED_BUCKET_COUNT][ADDRMAN_BUCKET_SIZE];
  // number of (unique) "new" entries
  public nNew = 0;
  // list of "new" buckets
  public vvNew = AddrInfo[ADDRMAN_NEW_BUCKET_COUNT][ADDRMAN_BUCKET_SIZE];
  // last time Good was called
  public nLastGood;
  // Holds addrs inserted int:o tried table that collide with existing entries. Test-before-evict discipline used to resolve these collisions.
  public m_tried_collisions = set();
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
  private static readonly ADDRMAN_HORIZON_DAYS = 30;
  // after how many failed attempts we give up on a new node
  private static readonly ADDRMAN_RETRIES = 3;
  // how many successive failures are allowed ...
  private static readonly ADDRMAN_MAX_FAILURES = 10;
  // ... in at least this many days
  private static readonly ADDRMAN_MIN_FAIL_DAYS = 7;
  // how recent a successful connection should be before we allow an address to be evicted from tried
  private static readonly ADDRMAN_REPLACEMENT_HOURS = 4;
  // the maximum percentage of nodes to return in a getaddr call
  private static readonly ADDRMAN_GETADDR_MAX_PCT = 23;
  // the maximum number of nodes to return in a getaddr call
  private static readonly ADDRMAN_GETADDR_MAX = 2500;
  // Convenience
  private static readonly ADDRMAN_TRIED_BUCKET_COUNT = (1 << ADDRMAN_TRIED_BUCKET_COUNT_LOG2);
  private static readonly ADDRMAN_NEW_BUCKET_COUNT = (1 << ADDRMAN_NEW_BUCKET_COUNT_LOG2);
  private static readonly ADDRMAN_BUCKET_SIZE = (1 << ADDRMAN_BUCKET_SIZE_LOG2);
  // the maximum number of tried addr collisions to store
  private static readonly ADDRMAN_SET_TRIED_COLLISION_SIZE = 10;
  // the maximum time we'll spend trying to resolve a tried table collision, in seconds
  private static readonly ADDRMAN_TEST_WINDOW = 40*60; // 40 minutes

  // Find an entry
  public Find = (node: NodeInstance, pnId: number): AddrInfo => {
  }
  // find an entry, creating it if necessary.
  // nTime and nServices of the found node are updated, if necessary.
  public Create = (addr: NodeInstance, addrSource: NodeInstance, pnId: number): AddrInfo => {
  }
  // Swap two elements in vRandom
  public SwapRandom = (nRandomPos1: number, nRandomPos2: number): void => {
  }
  // Move an entry from the "new" table = (s) to the "tried" table
  public MakeTried = (info: NodeInstance, nId: number) => {
  }
  // Delete an entry. It must not be in tried, and have refcount 0
  public Delete = (nId: number): void => {
  }
  // Clear a position in a "new" table. This is the only place where entries are actually deleted
  public ClearNew = (nUBucket: number, nUBucketPos: number): void => {
  }
  // Mark an entry "good", possibly moving it from "new" to "tried"
  public Good = (addr: NodeInstance, test_before_evict: boolean, time: number): void => {
  }
  // Add an entry to the "new" table
  public Add = (addr: NodeInstance, source: NodeInstance, nTimePenalty: number): boolean => {
  }
  // Mark and entry as attempted to connect
  public Attempt = (addr: NodeInstance, fCountFailure: boolean, nTime: number): void => {
  }
  // Select an address to connect to, if newOnly is set to true, only the new table is selected from
  public Select = (newOnly: boolean): AddrInfo => {
  }
  // See if any to-be-evicted tried table entries have been tested and if so resolve the collisions
  public ResolveCollisions = (): void => {
  }
  // Return a random to-be-evicted tried table address
  public SelectTriedCollision = (): AddrInfo => {
  }
}

