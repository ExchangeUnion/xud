import path from 'path';
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
import { EventEmitter } from 'events';
import Swaps from './swaps/Swaps';

const version: string = require('../package.json').version;

interface Xud {
  on(event: 'shutdown', listener: () => void): this;
  emit(event: 'shutdown'): boolean;
}

bootstrap();

/** Class representing a complete Exchange Union daemon. */
class Xud extends EventEmitter {
  public service!: Service;
  private logger!: Logger;
  private config: Config;
  private db!: DB;
  private lndbtcClient!: LndClient;
  private lndltcClient!: LndClient;
  private raidenClient!: RaidenClient;
  private pool!: Pool;
  private orderBook!: OrderBook;
  private rpcServer?: GrpcServer;
  private nodeKey!: NodeKey;
  private grpcAPIProxy?: GrpcWebProxyServer;
  private swaps!: Swaps;
  private shuttingDown = false;

  public get nodePubKey() {
    return this.nodeKey.nodePubKey;
  }

  /**
   * Create an Exchange Union daemon.
   */
  constructor()  {
    super();

    this.config = new Config();

    process.on('SIGINT', () => {
      this.beginShutdown();
    });
  }

  /**
   * Start all processes necessary for the operation of an Exchange Union node.
   * @param args optional arguments to override configuration parameters.
   */
  public start = async (args?: { [argName: string]: any }) => {
    await this.config.load(args);
    const loggers = Logger.createLoggers(this.config.loglevel, this.config.logpath, this.config.instanceid, this.config.logdateformat);
    this.logger = loggers.global;
    this.logger.info('config loaded');

    try {
      const initPromises: Promise<any>[] = [];
      // TODO: wait for decryption of existing key or encryption of new key, config option to disable encryption
      initPromises.push(NodeKey.load(this.config.xudir, this.config.instanceid));

      this.db = new DB(loggers.db, this.config.dbpath);
      await this.db.init(this.config.initdb);

      // setup LND clients and initialize
      this.lndbtcClient = new LndClient(this.config.lndbtc, loggers.lnd);
      initPromises.push(this.lndbtcClient.init());
      this.lndltcClient = new LndClient(this.config.lndltc, loggers.lnd);
      initPromises.push(this.lndltcClient.init());

      // setup raiden client and connect if configured
      this.raidenClient = new RaidenClient(this.config.raiden, loggers.raiden);
      if (!this.raidenClient.isDisabled()) {
        initPromises.push(this.raidenClient.init());
      }

      this.pool = new Pool(this.config.p2p, loggers.p2p, this.db.models);

      this.swaps = new Swaps(loggers.swaps, this.db.models, this.pool, this.lndbtcClient, this.lndltcClient);
      initPromises.push(this.swaps.init());

      this.orderBook = new OrderBook(loggers.orderbook, this.db.models, this.config.nomatching, this.pool, this.swaps);
      initPromises.push(this.orderBook.init());

      // wait for components to initialize in parallel
      const initPromisesResults = await Promise.all(initPromises);
      this.nodeKey = initPromisesResults[0]; // the first init promise in the array was NodeKey.load
      this.logger.info(`Local nodePubKey is ${this.nodeKey.nodePubKey}`);

      // initialize pool and start listening/connecting only once other components are initialized
      await this.pool.init({
        version,
        pairs: this.orderBook.pairIds,
        nodePubKey: this.nodeKey.nodePubKey,
        raidenAddress: this.raidenClient.address,
        lndbtcPubKey: this.lndbtcClient.pubKey,
        lndltcPubKey: this.lndltcClient.pubKey,
      }, this.nodeKey);

      this.service = new Service(loggers.global, {
        version,
        orderBook: this.orderBook,
        lndBtcClient: this.lndbtcClient,
        lndLtcClient: this.lndltcClient,
        raidenClient: this.raidenClient,
        pool: this.pool,
        swaps: this.swaps,
        shutdown: this.beginShutdown,
      });

      // start rpc server last
      if (!this.config.rpc.disable) {
        this.rpcServer = new GrpcServer(loggers.rpc, this.service);
        const listening = await this.rpcServer.listen(
          this.config.rpc.port,
          this.config.rpc.host,
          path.join(this.config.xudir, 'tls.cert'),
          path.join(this.config.xudir, 'tls.key'),
        );

        if (!listening) {
          // if rpc should be enabled but fails to start, treat it as a fatal error
          this.logger.error('Could not start gRPC server, exiting...');
          await this.shutdown();
          return;
        }

        if (!this.config.webproxy.disable) {
          this.grpcAPIProxy = new GrpcWebProxyServer(loggers.rpc);
          try {
            await this.grpcAPIProxy.listen(
              this.config.webproxy.port,
              this.config.rpc.port,
              this.config.rpc.host,
              path.join(this.config.xudir, 'tls.cert'),
            );
          } catch (err) {
            this.logger.error('Could not start gRPC web proxy server', err);
          }
        }
      } else {
        this.logger.warn('RPC server is disabled.');
      }

      this.bind();
    } catch (err) {
      this.logger.error(err);
    }
  }

  private bind = () => {
    this.lndbtcClient.on('connectionVerified', (newPubKey) => {
      if (newPubKey) {
        this.pool.updateNodeState({ lndbtcPubKey: newPubKey });
      }
    });
    this.lndltcClient.on('connectionVerified', (newPubKey) => {
      if (newPubKey) {
        this.pool.updateNodeState({ lndltcPubKey: newPubKey });
      }
    });
  }

  private shutdown = async () => {
    if (this.shuttingDown) {
      this.logger.info('XUD is already shutting down');
      return;
    }
    this.shuttingDown = true;
    this.logger.info('XUD is shutting down');

    this.lndbtcClient.close();
    this.lndltcClient.close();

    // TODO: ensure we are not in the middle of executing any trades
    const closePromises: Promise<void>[] = [];

    if (this.pool) {
      closePromises.push(this.pool.disconnect());
    }
    if (this.rpcServer) {
      closePromises.push(this.rpcServer.close());
    }
    if (this.grpcAPIProxy) {
      closePromises.push(this.grpcAPIProxy.close());
      await this.grpcAPIProxy.close();
    }
    await Promise.all(closePromises);

    await this.db.close();
    this.logger.info('XUD shutdown gracefully');

    this.emit('shutdown');
  }

  /**
   * Initiate graceful shutdown of xud. Emits the `shutdown` event when shutdown is complete.
   */
  public beginShutdown = () => {
    // we begin the shutdown process but return a response before it completes.
    void (this.shutdown());
  }
}

if (!module.parent) {
  const xud = new Xud();
  void xud.start();
}

export default Xud;
