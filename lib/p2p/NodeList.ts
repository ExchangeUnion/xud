import P2PRepository from './P2PRepository';
import { NodeInstance, NodeFactory } from '../types/db';
import { NodeConnectionInfo } from '../types/p2p';

/** Represents a list of nodes for managing network peers activity */
class NodeList {
  private nodes = new Map<string, NodeInstance>();

  constructor(private repository: P2PRepository) {}

  /**
   * Return a [[NodeConnectionInfo]] array for nodes that haven't been banned and have known addresses.
   */
  public toConnectionInfoArray = (): NodeConnectionInfo[] => {
    const nodeConnectionInfos: NodeConnectionInfo[] = Array.from({ length: this.nodes.size });
    let unbannedNodeCount = 0;
    this.nodes.forEach((node) => {
      if (!node.banned && node.addresses.length > 0) {
        nodeConnectionInfos[unbannedNodeCount] = {
          nodePubKey: node.nodePubKey,
          addresses: node.addresses,
        };
        unbannedNodeCount += 1;
      }
    });
    nodeConnectionInfos.length = unbannedNodeCount;
    return nodeConnectionInfos;
  }

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
      const updatedNodes = await this.repository.updateNode(node);
      return updatedNodes.length > 0;
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
}

export default NodeList;
