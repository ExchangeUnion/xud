import Logger from '../Logger';
import DB, { Models } from '../db/DB';
import { db } from '../types';

class P2PRepository {
  private models: Models;

  constructor(private logger: Logger, private db: DB) {
    this.models = db.models;
  }

  public getNodes = async (): Promise<db.NodeInstance[]> => {
    return this.models.Node.findAll();
  }

  public addNode = async (node: db.NodeFactory) => {
    return this.models.Node.create(<db.NodeAttributes>node);
  }

  public addNodes = async (nodes: db.NodeFactory[]) => {
    return this.models.Node.bulkCreate(<db.NodeAttributes[]>nodes);
  }

  public updateNode = async (node: db.NodeInstance) => {
    return this.models.Node.update(node);
  }
}

export default P2PRepository;
