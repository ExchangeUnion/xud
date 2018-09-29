import { Models } from '../db/DB';
import { db } from '../types';
import { NodeInstance } from '../types/db';

class P2PRepository {

  constructor(private models: Models) {}

  public getNodes = async (): Promise<db.NodeInstance[]> => {
    return this.models.Node.findAll();
  }

  public getReputationEvents = async (node: NodeInstance): Promise<db.ReputationEventInstance[]> => {
    return this.models.ReputationEvent.findAll({
      where: {
        nodeId: node.id,
      },
    });
  }

  public addNode = (node: db.NodeFactory) => {
    return this.models.Node.create(<db.NodeAttributes>node);
  }

  public addReputationEvent = async (event: db.ReputationEventFactory) => {
    return this.models.ReputationEvent.create(<db.ReputationEventAttributes>event);
  }

  public addNodes = async (nodes: db.NodeFactory[]) => {
    return this.models.Node.bulkCreate(<db.NodeAttributes[]>nodes);
  }
}

export default P2PRepository;
