import { Models } from '../db/DB';
import { NodeInstance, ReputationEventInstance, ReputationEventFactory, NodeFactory, ReputationEventAttributes, NodeAttributes } from '../db/types';
import Bluebird from 'bluebird';

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

  public addNode = (node: NodeFactory): Bluebird<NodeInstance> => {
    return this.models.Node.create(<NodeAttributes>node);
  }

  public addReputationEvent = async (event: ReputationEventFactory) => {
    return this.models.ReputationEvent.create(<ReputationEventAttributes>event);
  }

  public addNodes = async (nodes: NodeFactory[]) => {
    return this.models.Node.bulkCreate(<NodeAttributes[]>nodes);
  }
}

export default P2PRepository;
