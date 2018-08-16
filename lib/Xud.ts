import bootstrap from './bootstrap';
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
import Service from './service/Service';
import { Arguments } from 'yargs';

const version: string = require('../package.json').version;

bootstrap();

/** Class representing a complete Exchange Union daemon. */
class Xud {
  public service!: Service;
  private logger!: Logger;
  private config: Config;
  private db!: DB;
  private lndbtcClient!: LndClient;
  private lndltcClient!: LndClient;
  private raidenClient!: RaidenClient;
  private pool?: Pool;
  private orderBook!: OrderBook;
  private rpcServer?: GrpcServer;
  private nodeKey!: NodeKey;
  private grpcAPIProxy?: GrpcWebProxyServer;

  public get nodePubKey() {
    return this.nodeKey.nodePubKey;
  }

  /**
   * Create an Exchange Union daemon.
   * @param args optional command line arguments to override configuration parameters.
   */
  constructor(args?: Arguments | Object)  {
    this.config = new Config(args);
  }

  /**
   * Start all processes necessary for the operation of an Exchange Union node.
   */
  public start = async () => {
    await this.config.load();
    const loggers = Logger.createLoggers(this.config.instanceId);
    this.logger = loggers.global;
    this.logger.info('config loaded');

    try {
      // TODO: wait for decryption of existing key or encryption of new key, config option to disable encryption
      this.nodeKey = NodeKey.load(this.config.xudir, this.config.instanceId);
      this.logger.info(`Local nodePubKey is ${this.nodeKey.nodePubKey}`);

      this.db = new DB(this.config.db, loggers.db);
      await this.db.init();

      const initPromises: Promise<void>[] = [];
      // setup LND clients and connect if configured
      this.lndbtcClient = new LndClient(this.config.lndbtc, loggers.lnd);
      if (!this.lndbtcClient.isDisabled()) {
        initPromises.push(this.lndbtcClient.connect());
      }
      this.lndltcClient = new LndClient(this.config.lndltc, loggers.lnd);
      if (!this.lndltcClient.isDisabled()) {
        initPromises.push(this.lndltcClient.connect());
      }

      // setup raiden client and connect if configured
      this.raidenClient = new RaidenClient(this.config.raiden, loggers.raiden);
      if (!this.raidenClient.isDisabled()) {
        initPromises.push(this.raidenClient.init());
      }
      this.pool = new Pool(this.config.p2p, loggers.p2p, this.db);

      this.orderBook = new OrderBook(this.logger, this.db.models, this.pool, this.lndbtcClient, this.raidenClient);
      initPromises.push(this.orderBook.init());

      // wait for components to initialize in parallel
      await Promise.all(initPromises);

      // initialize pool and start listening/connecting only once other components are initialized
      await this.pool.init({
        version,
        pairs: this.orderBook.pairIds,
        nodePubKey: this.nodeKey.nodePubKey,
        raidenAddress: this.raidenClient.address,
      });

      this.service = new Service(loggers.global, {
        version,
        orderBook: this.orderBook,
        lndBtcClient: this.lndbtcClient,
        lndLtcClient: this.lndltcClient,
        raidenClient: this.raidenClient,
        pool: this.pool,
        config: this.config,
        shutdown: this.shutdown,
      });

      // start rpc server last
      if (!this.config.rpc.disable) {
        this.rpcServer = new GrpcServer(loggers.rpc, this.service);
        const listening = await this.rpcServer.listen(this.config.rpc.port, this.config.rpc.host);
        if (!listening) {
          // if rpc should be enabled but fails to start, treat it as a fatal error
          this.logger.error('Could not start gRPC server, exiting...');
          this.shutdown();
          return;
        }

        if (!this.config.webproxy.disable) {
          this.grpcAPIProxy = new GrpcWebProxyServer(loggers.rpc);
          try {
            await this.grpcAPIProxy.listen(this.config.webproxy.port, this.config.rpc.port, this.config.rpc.host);
          } catch (err) {
            this.logger.error('Could not start gRPC web proxy server', err);
          }
        }
      } else {
        this.logger.warn('RPC server is disabled.');
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
      // we use an immediately invoked function here exit the process AFTER the
      // shutdown method returns a response.
      this.lndbtcClient.close();
      this.lndltcClient.close();

      const closePromises: Promise<void>[] = [];
      if (this.rpcServer) {
        closePromises.push(this.rpcServer.close());
      }
      if (this.grpcAPIProxy) {
        closePromises.push(this.grpcAPIProxy.close());
      }
      await Promise.all(closePromises);

      await this.db.close();
      this.logger.info(msg);
    })();

    return msg;
  }
}

if (!module.parent) {
  const xud = new Xud();
  xud.start();
}

export default Xud;
