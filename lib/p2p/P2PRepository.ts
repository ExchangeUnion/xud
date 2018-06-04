import Logger from '../Logger';
import DB, { Models } from '../db/DB';
import { db } from '../types';

class P2PRepository {
  private logger: Logger = Logger.p2p;
  private models: Models;

  constructor(private db: DB) {
    this.models = db.models;
  }

  public getHosts = async (): Promise<db.HostInstance[]> => {
    return this.models.Host.findAll();
  }

  public getBannedHosts = async (): Promise<db.BannedHostInstance[]> => {
    return this.models.BannedHost.findAll();
  }

  public addHost = async (host: db.HostFactory): Promise<db.HostInstance> => {
    return this.models.Host.create(<db.HostAttributes>host);
  }

  public addHosts = async (hosts: db.HostFactory[]): Promise<db.HostInstance[]> => {
    return this.models.Host.bulkCreate(<db.HostAttributes[]>hosts);
  }

  public addBannedHost = async (host: db.BannedHostFactory): Promise<db.BannedHostInstance> => {
    return this.models.BannedHost.create(<db.BannedHostAttributes>host);
  }
}

export default P2PRepository;
