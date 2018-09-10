import Logger from '../Logger';
import { Models } from '../db/DB';
import { db } from '../types';

class P2PRepository {

  constructor(private logger: Logger, private models: Models) {}

  public getNodes = async (): Promise<db.NodeInstance[]> => {
    return this.models.Node.findAll();
  }

  public addNode = (node: db.NodeFactory) => {
    return this.models.Node.create(<db.NodeAttributes>node);
  }

  public addNodes = async (nodes: db.NodeFactory[]) => {
    return this.models.Node.bulkCreate(<db.NodeAttributes[]>nodes);
  }
}

export default P2PRepository;
