import { EventEmitter } from 'events';
import { ReputationEvent } from '../constants/enums';
import { NodeFactory, NodeInstance, ReputationEventInstance } from '../db/types';
import addressUtils from '../utils/addressUtils';
import { pubKeyToAlias } from '../utils/aliasUtils';
import P2PRepository from './P2PRepository';
import { Address } from './types';
import errors from './errors';
import AddrMan/*, {AddrInfo}*/ from './AddrMan';

export const reputationEventWeight = {
  [ReputationEvent.ManualBan]: Number.NEGATIVE_INFINITY,
  [ReputationEvent.ManualUnban]: 0,
  [ReputationEvent.PacketTimeout]: -1,
  [ReputationEvent.SwapFailure]: -10,
  [ReputationEvent.SwapSuccess]: 1,
  [ReputationEvent.WireProtocolErr]: -5,
  [ReputationEvent.InvalidAuth]: -20,
  [ReputationEvent.SwapTimeout]: -15,
  [ReputationEvent.SwapMisbehavior]: -20,
};

// TODO: inform node about getting banned
// TODO: remove reputation events after certain amount of time

interface NodeList {
  on(event: 'node.ban', listener: (nodePubKey: string, events: ReputationEventInstance[]) => void): this;
  emit(event: 'node.ban', nodePubKey: string, events: ReputationEventInstance[]): boolean;
}

/** Represents a list of nodes for managing network peers activity */
class NodeList extends EventEmitter {
  /** A map of node pub keys to node instances. */
  //private nodes = Map<string, NodeInstance>();
  /** Stochastic data structure for P2P scalability */
  private addrManKey = Math.floor(Math.random() * 999999999);
  public addrManager = new AddrMan({ key: this.addrManKey }); // initialize with random key
  /** Inbound nodes: can have at most 117 inbound connections*/
  public inbound = new Map<string, NodeInstance>();
  /** Outbound nodes: can have at most 8 stochasically selected nodes */
  public outbound = new Map<string, NodeInstance>();
  /** User-specified connections: no upper limit */
  public customOutbound = new Map<string, NodeInstance>();

  /** A map of node ids to node instances. */
  // private nodeIdMap = new Map<number, NodeInstance>();
  /** A map of node pub keys to aliases. */
  private pubKeyToAliasMap = new Map<string, string>();
  /** A map of aliases to node pub keys. */
  private aliasToPubKeyMap = new Map<string, string>();

  private static readonly BAN_THRESHOLD = -50;

  public get count() {
    return this.inbound.size + this.outbound.size + this.customOutbound.size;
  }

  constructor(private repository: P2PRepository) {
    super();
  }

  /**
   * Check if a node with a given nodePubKey exists.
   */
  public has = (nodePubKey: string): boolean => {
    return this.inbound.has(nodePubKey) || this.outbound.has(nodePubKey) || this.customOutbound.has(nodePubKey);
  }

  /**
   * Removes closed peer from lists of active connections 
   */
  public remove = (nodePubKey: string): boolean => {
    if (!this.outbound.delete(nodePubKey)) {
      if (!this.customOutbound.delete(nodePubKey)) {
        return this.inbound.delete(nodePubKey);
      }
    }
    return true;
  }
  /*
  public forEach = (callback: (node: NodeInstance) => void) => {
    this.nodes.addrMap.forEach(callback);
  }*/

  /**
   * Get the node for a given node id.
   */
  public getNodeById = (nodeId: number) => {
    const entry = this.addrManager.addrMap.get(nodeId);
    if (entry) {
      return entry.node;
    }
    return undefined;
  }

  /**
   * Get the internal node id for a given nodePubKey.
   */
  public getId = (nodePubKey: string) => {
    return this.addrManager.GetNodeByPubKey(nodePubKey)?.id;
  }

  /**
   * Get a node that is currently connected
   */
  public get = (nodePubKey: string) => {
    let node = this.outbound.get(nodePubKey);
    if (!node) {
      node = this.customOutbound.get(nodePubKey);
      if (!node) {
        node = this.inbound.get(nodePubKey);
      }
    }
    return node;
  }

  /**
   * Get a node from the DB
   */
  public getFromDB = async (nodePubKey: string) => {
    let node = await this.repository.getNode(nodePubKey);
    return node;
  }

  /**
   * Get the alias for a given nodePubKey.
   */
  public getAlias = (nodePubKey: string) => {
    return this.pubKeyToAliasMap.get(nodePubKey);
  }

  public getPubKeyForAlias = (alias: string) => {
    return this.aliasToPubKeyMap.get(alias);
  }

  /**
   * Ban a node by nodePubKey.
   * @returns true if the node was banned, false otherwise
   */
  public ban = async (nodePubKey: string): Promise<boolean> => {
    return this.addReputationEvent(nodePubKey, ReputationEvent.ManualBan);
  }

  /**
   * Remove ban from node by nodePubKey.
   * @returns true if ban was removed, false otherwise
   */
  public unBan = async (nodePubKey: string): Promise<boolean> => {
    return this.addReputationEvent(nodePubKey, ReputationEvent.ManualUnban);
  }

  public isBanned = (nodePubKey: string): boolean => {
    for (let [_, v] of this.addrManager.addrMap) {
      if (nodePubKey == v.node.nodePubKey) {
        return v.node.banned;
      }
    }
    return false
  }

  /**
   * Load this NodeList from the database and initialize the 8 outbound connections.
   */
  public load = async (): Promise<void> => {
    const nodes = await this.repository.getNodes();

    const reputationLoadPromises: Promise<void>[] = [];
    nodes.forEach((node) => {
      this.addNode(node, "none");
      const reputationLoadPromise = this.repository.getReputationEvents(node).then((events) => {
        events.forEach(({ event }) => {
          this.updateReputationScore(node, event);
        });
      });
      reputationLoadPromises.push(reputationLoadPromise);
    });
    await Promise.all(reputationLoadPromises);
  }

  /**
   * Persists a node to the database and adds it to the address manager.
   */
  public createNode = async (nodeFactory: NodeFactory, sourceIP: string) => {
    let node = await this.repository.getNode(nodeFactory.nodePubKey);
    if (!node) {
      node = await this.repository.addNodeIfNotExists(nodeFactory);
    }
    // duplicates are okay because nodes seen multiple times get greater representation in Address Manager
    this.addNode(node, sourceIP);
    //}
  }
  /**
   * Delete node from NodeList, Address Manager, and DB
   */
  public removeNode = (pubKey: string) => {
    if (!this.outbound.delete(pubKey)) {
      if (!this.customOutbound.delete(pubKey)) {
        this.inbound.delete(pubKey);
      }
    }
    let nodeId = this.getId(pubKey);
    if (nodeId) {
      this.addrManager.Delete(nodeId);
    }
    this.repository.deleteNode(pubKey);
  }


  /**
   * Update a node's addresses in the db.
   * @return true if the specified node exists and was updated, false otherwise
   */
  public updateAddresses = async (nodePubKey: string, addresses: Address[] = [], lastAddress?: Address): Promise<boolean> => {
    const node = this.get(nodePubKey);
    if (node) {
      // avoid overriding the `lastConnected` field for existing matching addresses unless a new value was set
      node.addresses = addresses.map((newAddress) => {
        const oldAddress = node.addresses.find(address => addressUtils.areEqual(address, newAddress));
        if (oldAddress && !newAddress.lastConnected) {
          return oldAddress;
        } else {
          return newAddress;
        }
      });

      if (lastAddress) {
        node.lastAddress = lastAddress;
      }

      await node.save();
      return true;
    }

    return false;
  }

  /**
   * Add a reputation event to the node's history
   * @return true if the specified node exists and the event was added, false otherwise
   */
  public addReputationEvent = async (nodePubKey: string, event: ReputationEvent): Promise<boolean> => {
    const node = this.get(nodePubKey); 

    if (node) {
      const promises: PromiseLike<any>[] = [
        this.repository.addReputationEvent({ event, nodeId: node.id }),
      ];

      this.updateReputationScore(node, event);

      if (node.reputationScore < NodeList.BAN_THRESHOLD) {
        promises.push(this.setBanStatus(node, true));

        const events = await this.repository.getReputationEvents(node);
        this.emit('node.ban', nodePubKey, events);
      } else if (node.banned) {
        // If the reputationScore is not below the banThreshold but node.banned
        // is true that means that the node was unbanned
        promises.push(this.setBanStatus(node, false));
      }

      await Promise.all(promises);

      return true;
    }

    return false;
  }

  public removeAddress = async (nodePubKey: string, address: Address) => {
    const node = this.get(nodePubKey);
    if (node) {
      const index = node.addresses.findIndex(existingAddress => addressUtils.areEqual(address, existingAddress));
      if (index > -1) {
        node.addresses = [...node.addresses.slice(0, index), ...node.addresses.slice(index + 1)];
        await node.save();
        return true;
      }

      // if the lastAddress is removed, then re-assigning lastAddress with the latest connected advertised address
      if (node.lastAddress && addressUtils.areEqual(address, node.lastAddress)) {
        node.lastAddress = addressUtils.sortByLastConnected(node.addresses)[0];
      }
    }

    return false;
  }

  private updateReputationScore = (node: NodeInstance, event: ReputationEvent) => {
    switch (event) {
      case (ReputationEvent.ManualBan):
      case (ReputationEvent.ManualUnban): {
        node.reputationScore = reputationEventWeight[event];
        break;
      }
      default: node.reputationScore += reputationEventWeight[event]; break;
    }
  }

  private setBanStatus = (node: NodeInstance, status: boolean) => {
    node.banned = status;
    return node.save();
  }

  private addNode = (node: NodeInstance, sourceIP: string) => {
    const { nodePubKey } = node;
    const alias = pubKeyToAlias(nodePubKey);
    if (this.aliasToPubKeyMap.has(alias)) {
      throw errors.ALIAS_CONFLICT(alias);
    }

    this.addrManager.Add(node, sourceIP);
    //this.nodeIdMap.set(node.id, node);
    this.pubKeyToAliasMap.set(nodePubKey, alias);
    this.aliasToPubKeyMap.set(alias, nodePubKey);
  }
}

export default NodeList;
