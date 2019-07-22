import { EventEmitter } from 'events';
import P2PRepository from './P2PRepository';
import { NodeInstance, NodeFactory, ReputationEventInstance } from '../db/types';
import { Address } from './types';
import addressUtils from '../utils/addressUtils';
import { ReputationEvent } from '../constants/enums';

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
  private nodes = new Map<string, NodeInstance>();
  private bannedNodes = new Map<string, NodeInstance>();

  private static readonly BAN_THRESHOLD = -50;

  public get count() {
    return this.nodes.size;
  }

  constructor(private repository: P2PRepository) {
    super();
  }

  /**
   * Check if a node with a given nodePubKey exists.
   */
  public has = (nodePubKey: string): boolean => {
    return this.nodes.has(nodePubKey);
  }

  public forEach = (callback: (node: NodeInstance) => void) => {
    this.nodes.forEach(callback);
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
    return this.bannedNodes.has(nodePubKey);
  }

  /**
   * Load this NodeList from the database.
   */
  public load = async (): Promise<void> => {
    const nodes = await this.repository.getNodes();

    const reputationLoadPromises: Promise<void>[] = [];
    nodes.forEach((node) => {
      if (node.banned) {
        this.bannedNodes.set(node.nodePubKey, node);
      } else {
        this.nodes.set(node.nodePubKey, node);
        const reputationLoadPromise = this.repository.getReputationEvents(node).then((events) => {
          events.forEach(({ event }) => {
            this.updateReputationScore(node, event);
          });
        });
        reputationLoadPromises.push(reputationLoadPromise);
      }
    });
    await Promise.all(reputationLoadPromises);
  }

  /**
   * Create a Node in the database.
   */
  public createNode = async (nodeFactory: NodeFactory): Promise<NodeInstance> => {
    const node = await this.repository.addNode(nodeFactory);
    this.nodes.set(node.nodePubKey, node);
    return node;
  }

  /**
   * Update a node's addresses.
   * @return true if the specified node exists and was updated, false otherwise
   */
  public updateAddresses = async (nodePubKey: string, addresses: Address[] = [], lastAddress?: Address): Promise<boolean> => {
    const node = this.nodes.get(nodePubKey);
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
    const node = this.isBanned(nodePubKey) ? this.bannedNodes.get(nodePubKey) : this.nodes.get(nodePubKey);

    if (node) {
      const promises: PromiseLike<any>[] = [
        this.repository.addReputationEvent({ event, nodeId: node.id }),
      ];

      this.updateReputationScore(node, event);

      if (node.reputationScore < NodeList.BAN_THRESHOLD) {
        promises.push(this.setBanStatus(node, true));
        this.bannedNodes.set(node.nodePubKey, node);
        this.nodes.delete(node.nodePubKey);

        const events = await this.repository.getReputationEvents(node);
        this.emit('node.ban', nodePubKey, events);
      } else if (node.banned) {
        // If the reputationScore is not below the banThreshold but node.banned
        // is true that means that the node was unbanned
        this.bannedNodes.delete(node.nodePubKey);
        this.nodes.set(node.nodePubKey, node);
        promises.push(this.setBanStatus(node, false));
      }

      await Promise.all(promises);

      return true;
    }

    return false;
  }

  public removeAddress = async (nodePubKey: string, address: Address) => {
    const node = this.nodes.get(nodePubKey);
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
      default: node.reputationScore += reputationEventWeight[event];
    }
  }

  private setBanStatus = (node: NodeInstance, status: boolean) => {
    node.banned = status;
    return node.save();
  }
}

export default NodeList;
