import fs from 'fs';
import Logger from './Logger';
import Config from './Config';
import DB from './db/DB';
import OrderBook from './orderbook/OrderBook';
import LndClient from './lndclient/LndClient';
import RaidenClient from './raidenclient/RaidenClient';
import GrpcServer from './grpc/GrpcServer';
import GrpcWebProxyServer from './grpc/webproxy/GrpcWebProxyServer';
import Pool from './p2p/Pool';
import NodeKey from './nodekey/NodeKey';
import dotenv from 'dotenv';

/** Loads environment variables from the file .env */
dotenv.config();

/** Class representing a complete Exchange Union daemon. */
class Xud {
  private logger: Logger = Logger.global;
  private config: Config;
  private db: any;
  private lndClient: any;
  private raidenClient: any;
  private pool?: Pool;
  private orderBook!: OrderBook;
  private rpcServer: any;
  private nodeKey!: NodeKey;
  private grpcAPIProxy: any;

  /**
   * Create an Exchange Union daemon.
   * @param args Optional command line arguments to override configuration parameters.
   */
  constructor(args)  {
    this.config = new Config(args);
  }

  /**
   * Start all processes necessary for the operation of an Exchange Union node.
   */
  public start = async () => {
    await this.config.load();
    this.logger.info('config loaded');

    try {
      // TODO: wait for decryption of existing key or encryption of new key, config option to disable encryption
      this.nodeKey = NodeKey.load(`${this.config.xudir}/nodekey.dat`);

      this.db = new DB(this.config.db);
      await this.db.init();

      this.lndClient = new LndClient(this.config.lnd);
      this.raidenClient = new RaidenClient(this.config.raiden);

      this.pool = new Pool(this.config.p2p, this.db);
      this.pool.connect();

      this.orderBook = new OrderBook(this.config.orderbook, this.db, this.pool, this.lndClient);
      await this.orderBook.init();

      this.rpcServer = new GrpcServer({
        orderBook: this.orderBook,
        lndClient: this.lndClient,
        raidenClient: this.raidenClient,
        pool: this.pool,
        shutdown: this.shutdown,
      });
      await this.rpcServer.listen(this.config.rpc.port);

      if (!this.config.webproxy.disable) {
        this.grpcAPIProxy = new GrpcWebProxyServer();
        await this.grpcAPIProxy.listen(this.config.webproxy.port, this.config.rpc.port);
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  /**
   * Gracefully end all running processes and disconnects from peers.
   */
  public shutdown = async () => {
    // ensure we stop listening for new peers before disconnecting from peers
    if (this.pool) {
      await this.pool.disconnect();
    }
    // TODO: ensure we are not in the middle of executing any trades
    const msg = 'XUD shutdown gracefully';
    (async () => {
      // we use an immediately invoked function here to close rpcServer and exit process AFTER the
      // shutdown method returns a response.
      await this.rpcServer.close();
      if (this.grpcAPIProxy) {
        await this.grpcAPIProxy.close();
      }
      this.logger.info(msg);
      this.db.close();
    })();

    return msg;
  }
}

if (!module.parent) {
  const xud = new Xud(null);
  xud.start();
}

export default Xud;
