import P2PRepository from './P2PRepository';
import { NodeInstance, NodeFactory } from '../types/db';
import { NodeConnectionInfo, Address } from '../types/p2p';

/** Represents a list of nodes for managing network peers activity */
class NodeList {
  private nodes = new Map<string, NodeInstance>();

  public get count() {
    return this.nodes.size;
  }

  constructor(private repository: P2PRepository) {}

  /**
   * Check if a node with a given nodePubKey exists.
   */
  public has = (nodePubKey: string) => {
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
    const node = this.nodes.get(nodePubKey);
    if (node) {
      node.banned = true;
      await this.repository.updateNode(node);
      return true;
    }
    return false;
  }

  public isBanned = (nodePubKey: string): boolean => {
    const node = this.nodes.get(nodePubKey);
    return node ? node.banned : false;
  }

  /**
   * Load this NodeList from the database.
   */
  public load = async (): Promise<void> => {
    const nodes = await this.repository.getNodes();

    nodes.forEach((node) => {
      this.nodes.set(node.nodePubKey, node);
    });
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
  public updateAddresses = async (nodePubKey: string, addresses: Address[] = []) => {
    const node = this.nodes.get(nodePubKey);
    if (node) {
      node.addresses = addresses;
      await this.repository.updateNode(node);
      return true;
    }

    return false;
  }
}

export default NodeList;
