import Logger from './Logger';
import Config from './Config';
import DB from './db/DB';
import OrderBook from './orderbook/OrderBook';
import LndClient from './lndclient/LndClient';
import RaidenClient from './raidenclient/RaidenClient';
import RpcServer from './rpc/RpcServer';
import Pool from './p2p/Pool';
import dotenv from 'dotenv';

/** Loads environment variables from the file .env */
dotenv.config();

/** Class representing a complete Exchange Union daemon. */
class Xud {
  logger: any;
  config: any;
  db: any;
  lndClient: any;
  raidenClient: any;
  pool?: Pool;
  orderBook: any;
  rpcServer: any;

  /**
   * Create an Exchange Union daemon.
   * @param {Object} args - Optional command line arguments to override configuration parameters.
   */
  constructor(args) {
    this.logger = Logger.global;
    this.config = new Config(args);

    this.shutdown = this.shutdown.bind(this);
  }

  /**
   * Start all processes necessary for the operation of an Exchange Union node.
   */
  async start() {
    await this.config.load();
    this.logger.info('config loaded');

    try {
      this.db = new DB(this.config.db);
      await this.db.init();

      this.lndClient = new LndClient(this.config.lnd);
      this.raidenClient = new RaidenClient(this.config.raiden);

      this.pool = new Pool(this.config.p2p);
      this.pool.connect();

      this.orderBook = new OrderBook(this.db, this.pool);
      await this.orderBook.init();

      this.rpcServer = new RpcServer({
        orderBook: this.orderBook,
        lndClient: this.lndClient,
        raidenClient: this.raidenClient,
        pool: this.pool,
        shutdown: this.shutdown,
      });
      await this.rpcServer.listen(this.config.rpc.port);
    } catch (err) {
      this.logger.error(err);
    }
  }

  /**
   * Gracefully end all running processes and disconnects from peers.
   */
  async shutdown() {
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
