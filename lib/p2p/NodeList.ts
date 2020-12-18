import { EventEmitter } from 'events';
import { ReputationEvent } from '../constants/enums';
import { NodeCreationAttributes, NodeInstance } from '../db/types';
import addressUtils from '../utils/addressUtils';
import { pubKeyToAlias } from '../utils/aliasUtils';
import errors from './errors';
import P2PRepository from './P2PRepository';
import { Address } from './types';
import AddrMan from './AddrMan';

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
  [ReputationEvent.SwapAbuse]: Number.NEGATIVE_INFINITY,
  [ReputationEvent.SwapDelay]: -25,
};

// TODO: inform node about getting banned
// TODO: remove reputation events after certain amount of time

interface NodeList {
  on(event: 'node.ban', listener: (nodePubKey: string, events: ReputationEvent[]) => void): this;
  emit(event: 'node.ban', nodePubKey: string, events: ReputationEvent[]): boolean;
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
  private static readonly MAX_REPUTATION_SCORE = 100;

  public get count() { // number of nodes currently connected
    console.log("NL connected node count is ", this.inbound.size + this.outbound.size + this.customOutbound.size);
    return this.inbound.size + this.outbound.size + this.customOutbound.size;
  }

  constructor(private repository: P2PRepository) {
    super();
  }

  private static updateReputationScore = (node: NodeInstance, event: ReputationEvent) => {
    if (event === ReputationEvent.ManualUnban) {
      node.reputationScore = reputationEventWeight[event];
    } else {
      // events that carry a negative infinity weight will set the
      // reputationScore to negative infinity and result in a ban
      node.reputationScore += reputationEventWeight[event];
      // reputation score for a node cannot exceed the maximum
      node.reputationScore = Math.min(node.reputationScore, NodeList.MAX_REPUTATION_SCORE);
    }
  };

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
  
  public forEach = (callback: (node: NodeInstance) => void) => {
    this.outbound.forEach(callback);
    this.customOutbound.forEach(callback);
    this.inbound.forEach(callback);
  }
    

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
    const nodePubKey = this.aliasToPubKeyMap.get(alias);
    if (!nodePubKey) {
      throw errors.ALIAS_NOT_FOUND(alias);
    }
    if (nodePubKey === 'CONFLICT') {
      throw errors.ALIAS_CONFLICT(alias);
    }
    return nodePubKey;
  };

  /**
   * Ban a node by nodePubKey.
   * @returns true if the node was banned, false otherwise
   */
  public ban = (nodePubKey: string): Promise<boolean> => {
    return this.addReputationEvent(nodePubKey, ReputationEvent.ManualBan);
  };

  /**
   * Remove ban from node by nodePubKey.
   * @returns true if ban was removed, false otherwise
   */
  public unBan = (nodePubKey: string): Promise<boolean> => {
    return this.addReputationEvent(nodePubKey, ReputationEvent.ManualUnban);
  };

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
    console.log("NL initializing these nodes:" , nodes);
    const reputationLoadPromises: Promise<void>[] = [];
    nodes.forEach((node) => {
      console.log("NL adding loaded node");
      this.addNode(node, "none");
      //this.outbound.set(node.nodePubKey, node);
      const reputationLoadPromise = this.repository.getReputationEvents(node).then((events) => {
        node.reputationScore = 0;
        events.forEach(({ event }) => {
          console.log("NL updating reputation score of loaded node");
          NodeList.updateReputationScore(node, event);
        });
      });
      reputationLoadPromises.push(reputationLoadPromise);
    });
    await Promise.all(reputationLoadPromises);
    console.log("NL done loading seed nodes");
  };

  /**
   * Persists a node to the database and adds it to the address manager.
   */
  public createNode = async (nodeCreationAttributes: NodeCreationAttributes, sourceIP: string) => {
    // fetch node if already exists
    let existingNode = await this.repository.getNode(nodeCreationAttributes.nodePubKey);
    if (existingNode) {
      // duplicates are okay because nodes seen multiple times get greater representation in Address Manager
      this.addNode(existingNode, sourceIP);
    } else {
      let node = await this.repository.addNodeIfNotExists(nodeCreationAttributes);
      if (node) {
        // TODO node.reputationScore = 0;
        this.addNode(node,sourceIP);
      }
    } 
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
    // this.repository.deleteNode(pubKey); // TODO actually delete node
  };


  /**
   * Update a node's addresses in the db.
   * @return true if the specified node exists and was updated, false otherwise
   */
  public updateAddresses = async (
    /*nodePubKey: string,
    addresses: Address[] = [],
    lastAddress?: Address,*/
  ): Promise<boolean> => {
    console.log("failing to update addresses...");
    /* TODO update correctly 
    const node = this.nodes.get(nodePubKey);
    if (node) {
      // avoid overriding the `lastConnected` field for existing matching addresses unless a new value was set
      node.addresses = addresses.map((newAddress) => {
        const oldAddress = node.addresses.find((address) => addressUtils.areEqual(address, newAddress));
     
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
     */
    return false;
  };

  /**
   * Retrieves up to 10 of the most recent negative reputation events for a node
   * from the repository.
   * @param node the node for which to retrieve events
   * @param newEvent a reputation event that hasn't been added to the repository yet
   */
  private getNegativeReputationEvents = async (node: NodeInstance, newEvent?: ReputationEvent) => {
    const reputationEvents = await this.repository.getReputationEvents(node);
    const negativeReputationEvents = reputationEvents
      .filter((e) => reputationEventWeight[e.event] < 0)
      .slice(0, 9)
      .map((e) => e.event);

    if (newEvent) {
      negativeReputationEvents.unshift(newEvent);
    }
    return negativeReputationEvents;
  };

  /**
   * Add a reputation event to the node's history
   * @return true if the specified node exists and the event was added, false otherwise
   */
  public addReputationEvent = async (nodePubKey: string, event: ReputationEvent): Promise<boolean> => {
    const node = this.get(nodePubKey); 

    if (node) {
      const promises: PromiseLike<any>[] = [];

      NodeList.updateReputationScore(node, event);

      if (node.reputationScore < NodeList.BAN_THRESHOLD && !node.banned) {
        promises.push(this.setBanStatus(node, true));

        const negativeReputationEvents = await this.getNegativeReputationEvents(node);
        this.emit('node.ban', nodePubKey, negativeReputationEvents);
      } else if (node.reputationScore >= NodeList.BAN_THRESHOLD && node.banned) {
        // If the reputationScore is not below the banThreshold but node.banned
        // is true that means that the node was unbanned
        promises.push(this.setBanStatus(node, false));
      }

      promises.push(this.repository.addReputationEvent({ event, nodeId: node.id }));

      await Promise.all(promises);

      return true;
    }

    return false;
  };

  public removeAddress = async (nodePubKey: string, address: Address) => {
    const node = this.get(nodePubKey);
    if (node) {
      const index = node.addresses.findIndex((existingAddress) => addressUtils.areEqual(address, existingAddress));
      if (index > -1) {
        node.addresses = [...node.addresses.slice(0, index), ...node.addresses.slice(index + 1)];
        await node.save();
        return true;
      }

      // if the lastAddress is removed, then re-assigning lastAddress with the latest connected advertised address
      if (node.lastAddress && addressUtils.areEqual(address, node.lastAddress)) {
        [node.lastAddress] = addressUtils.sortByLastConnected(node.addresses);
      }
    }

    return false;
  };

  private setBanStatus = (node: NodeInstance, status: boolean) => {
    node.banned = status;
    return node.save();
  };

  private addNode = (node: NodeInstance, sourceIP: string) => {
    const { nodePubKey } = node;
    console.log("NL adding node: ", node);
    const alias = pubKeyToAlias(nodePubKey);
    if (this.aliasToPubKeyMap.has(alias)) {
      this.aliasToPubKeyMap.set(alias, 'CONFLICT');
    } else {
      this.aliasToPubKeyMap.set(alias, nodePubKey);
    }

    this.addrManager.Add(node, sourceIP);
    //this.nodeIdMap.set(node.id, node);
    this.pubKeyToAliasMap.set(nodePubKey, alias);
  };
}

export default NodeList;
