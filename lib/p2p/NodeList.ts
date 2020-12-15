import { EventEmitter } from 'events';
import { ReputationEvent } from '../constants/enums';
import { NodeCreationAttributes, NodeInstance } from '../db/types';
import addressUtils from '../utils/addressUtils';
import { pubKeyToAlias } from '../utils/aliasUtils';
import errors from './errors';
import P2PRepository from './P2PRepository';
import { Address } from './types';

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
  private nodes = new Map<string, NodeInstance>();
  /** A map of node ids to node instances. */
  private nodeIdMap = new Map<number, NodeInstance>();
  /** A map of node pub keys to aliases. */
  private pubKeyToAliasMap = new Map<string, string>();
  /** A map of aliases to node pub keys. */
  private aliasToPubKeyMap = new Map<string, string>();

  private static readonly BAN_THRESHOLD = -50;
  private static readonly MAX_REPUTATION_SCORE = 100;

  private static readonly PRIMARY_PEER_CONN_FAILURES_THRESHOLD = 200;
  private static readonly SECONDARY_PEER_CONN_FAILURES_THRESHOLD = 1500;

  public get count() {
    return this.nodes.size;
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
    return this.nodes.has(nodePubKey);
  };

  public forEach = (callback: (node: NodeInstance) => void) => {
    this.nodes.forEach(callback);
  };

  public rank = (): { primary: NodeInstance[]; secondary: NodeInstance[] } => {
    const primary: NodeInstance[] = [];
    const secondary: NodeInstance[] = [];

    this.nodes.forEach((node) => {
      if (node.consecutiveConnFailures < NodeList.PRIMARY_PEER_CONN_FAILURES_THRESHOLD) {
        primary.push(node);
      } else if (node.consecutiveConnFailures < NodeList.SECONDARY_PEER_CONN_FAILURES_THRESHOLD) {
        secondary.push(node);
      }
    });

    if (primary.length === 0) {
      return { primary: secondary, secondary: [] };
    }
    return { primary, secondary };
  };

  /**
   * Get the internal node id for a given nodePubKey.
   */
  public getNodeById = (nodeId: number) => {
    return this.nodeIdMap.get(nodeId);
  };

  /**
   * Get the alias for a given nodePubKey.
   */
  public getAlias = (nodePubKey: string) => {
    return this.pubKeyToAliasMap.get(nodePubKey);
  };

  public getId = (nodePubKey: string) => {
    return this.nodes.get(nodePubKey)?.id;
  };

  public get = (nodePubKey: string) => {
    return this.nodes.get(nodePubKey);
  };

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
    return this.nodes.get(nodePubKey)?.banned || false;
  };

  /**
   * Load this NodeList from the database.
   */
  public load = async (): Promise<void> => {
    const nodes = await this.repository.getNodes();

    const reputationLoadPromises: Promise<void>[] = [];
    nodes.forEach((node) => {
      this.addNode(node);
      const reputationLoadPromise = this.repository.getReputationEvents(node).then((events) => {
        node.reputationScore = 0;
        events.forEach(({ event }) => {
          NodeList.updateReputationScore(node, event);
        });
      });
      reputationLoadPromises.push(reputationLoadPromise);
    });
    await Promise.all(reputationLoadPromises);
  };

  /**
   * Persists a node to the database and adds it to the node list.
   */
  public createNode = async (nodeCreationAttributes: NodeCreationAttributes) => {
    const node = await this.repository.addNodeIfNotExists(nodeCreationAttributes);
    if (node) {
      node.reputationScore = 0;
      this.addNode(node);
    }
  };

  /**
   * Update a node's addresses.
   * @return true if the specified node exists and was updated, false otherwise
   */
  public updateAddresses = async (
    nodePubKey: string,
    addresses: Address[] = [],
    lastAddress?: Address,
  ): Promise<boolean> => {
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
    const node = this.nodes.get(nodePubKey);

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
    const node = this.nodes.get(nodePubKey);
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

  public incrementConsecutiveConnFailures = async (nodePubKey: string) => {
    const node = this.nodes.get(nodePubKey);
    if (node) {
      node.consecutiveConnFailures += 1;
      await node.save();
    }
  };

  public resetConsecutiveConnFailures = async (nodePubKey: string) => {
    const node = this.nodes.get(nodePubKey);
    if (node && node.consecutiveConnFailures > 0) {
      node.consecutiveConnFailures = 0;
      await node.save();
    }
  };

  private setBanStatus = (node: NodeInstance, status: boolean) => {
    node.banned = status;
    return node.save();
  };

  private addNode = (node: NodeInstance) => {
    const { nodePubKey } = node;
    const alias = pubKeyToAlias(nodePubKey);
    if (this.aliasToPubKeyMap.has(alias)) {
      this.aliasToPubKeyMap.set(alias, 'CONFLICT');
    } else {
      this.aliasToPubKeyMap.set(alias, nodePubKey);
    }

    this.nodes.set(nodePubKey, node);
    this.nodeIdMap.set(node.id, node);
    this.pubKeyToAliasMap.set(nodePubKey, alias);
  };
}

export default NodeList;
