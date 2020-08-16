import { Models } from '../db/DB';
import { NodeAttributes, NodeFactory, NodeInstance, ReputationEventAttributes, ReputationEventFactory, ReputationEventInstance } from '../db/types';

class P2PRepository {

  constructor(private models: Models) {}

  public getNodes = async (): Promise<NodeInstance[]> => {
    return this.models.Node.findAll();
  }

  public getNode = async (nodePubKey: string): Promise<NodeInstance | null> => {
    return this.models.Node.findOne({
      where: {
        nodePubKey,
      },
    });
  }

  public getReputationEvents = async (node: NodeInstance): Promise<ReputationEventInstance[]> => {
    return this.models.ReputationEvent.findAll({
      where: {
        nodeId: node.id,
      },
    });
  }

  /**
   * Adds a node to the database if it doesn't already exist.
   * @returns the created node instance, or undefined if it already existed.
   */
  public addNodeIfNotExists = async (node: NodeFactory) => {
    try {
      const createdNode = await this.models.Node.create(<NodeAttributes>node);
      return createdNode;
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return undefined;
      } else {
        throw err;
      }
    }
  }

  public addReputationEvent = async (event: ReputationEventFactory) => {
    return this.models.ReputationEvent.create(<ReputationEventAttributes>event);
  }

  public addNodes = async (nodes: NodeFactory[]) => {
    return this.models.Node.bulkCreate(<NodeAttributes[]>nodes);
  }
  /*public deleteNode = async (nodePubKey: string) => {
    let node = await this.getNode(nodePubKey);
    if (node) { // TODO actually delete the node
      return this.models.Node.deleteOne({"NodeInstance": node});
    }
  }*/
}

export default P2PRepository;
