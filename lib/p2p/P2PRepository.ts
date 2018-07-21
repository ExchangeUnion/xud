import Logger from '../Logger';
import DB, { Models } from '../db/DB';
import { db } from '../types';
import { Op } from 'sequelize';

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

  public removeHost = async (host: db.HostFactory): Promise<void> => {
    const whereClause = { address: { [Op.eq]: host.address }, port: { [Op.eq]: host.port } };
    return await this.models.Host.destroy({ where: whereClause }).then((affectedRows: number) => {
      if (affectedRows > 0) {
        this.logger.info(`Removed host ${host.address}:${host.port}`);
      } else {
        this.logger.info(`Host ${host.address}:${host.port} does not exist.`);
      }
    });
  }

  public addHosts = async (hosts: db.HostFactory[]): Promise<db.HostInstance[]> => {
    return this.models.Host.bulkCreate(<db.HostAttributes[]>hosts);
  }

  public addBannedHost = async (host: db.BannedHostFactory): Promise<db.BannedHostInstance> => {
    return this.models.BannedHost.create(<db.BannedHostAttributes>host);
  }
}

export default P2PRepository;
