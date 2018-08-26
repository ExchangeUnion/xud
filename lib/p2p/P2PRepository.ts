import Logger from '../Logger';
import DB, { Models } from '../db/DB';
import { db } from '../types';

class P2PRepository {
  private models: Models;
  private options: any;

  constructor(private logger: Logger, db: DB) {
    this.models = db.models;
    this.options = db.options;
  }

  public getNodes = async (): Promise<db.NodeInstance[]> => {
    return this.models.Node.findAll(this.options);
  }

  public addNode = (node: db.NodeFactory) => {
    return this.models.Node.create(<db.NodeAttributes>node, this.options);
  }

  public addNodes = async (nodes: db.NodeFactory[]) => {
    return this.models.Node.bulkCreate(<db.NodeAttributes[]>nodes, this.options);
  }

  public updateNode = async (node: db.NodeInstance) => {
    return node.save(this.options);
  }
}

export default P2PRepository;
