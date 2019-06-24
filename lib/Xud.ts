import path from 'path';
import bootstrap from './bootstrap';
import Logger from './Logger';
import Config from './Config';
import DB from './db/DB';
import OrderBook from './orderbook/OrderBook';
import GrpcServer from './grpc/GrpcServer';
import GrpcWebProxyServer from './grpc/webproxy/GrpcWebProxyServer';
import Pool from './p2p/Pool';
import NodeKey from './nodekey/NodeKey';
import Service from './service/Service';
import { EventEmitter } from 'events';
import Swaps from './swaps/Swaps';
import HttpServer from './http/HttpServer';
import SwapClientManager from './swaps/SwapClientManager';
import InitService from './service/InitService';
import { promises as fs } from 'fs';

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
  private pool!: Pool;
  private orderBook!: OrderBook;
  private rpcServer?: GrpcServer;
  private httpServer?: HttpServer;
  private grpcAPIProxy?: GrpcWebProxyServer;
  private swaps!: Swaps;
  private shuttingDown = false;
  private swapClientManager?: SwapClientManager;

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
      this.db = new DB(loggers.db, this.config.dbpath);
      await this.db.init(this.config.network, this.config.initdb);

      this.swapClientManager = new SwapClientManager(this.config, loggers);
      await this.swapClientManager.init(this.db.models);

      const nodeKeyPath = NodeKey.getPath(this.config.xudir, this.config.instanceid);
      let nodeKey: NodeKey;
      if (this.config.noencrypt) {
        nodeKey = await NodeKey.load(nodeKeyPath);
      } else {
        const nodeKeyExists = await fs.access(nodeKeyPath).then(() => true).catch(() => false);
        const initService = new InitService(this.swapClientManager, nodeKeyPath, nodeKeyExists);

        const initRpcServer = new GrpcServer(loggers.rpc);
        initRpcServer.addXudInitService(initService);
        await initRpcServer.listen(
          this.config.rpc.port,
          this.config.rpc.host,
          path.join(this.config.xudir, 'tls.cert'),
          path.join(this.config.xudir, 'tls.key'),
        );

        this.logger.info("Node key is encrypted, unlock using 'xucli unlock' or set password using" +
        " 'xucli create' if this is the first time starting xud");
        nodeKey = await new Promise<NodeKey>((resolve) => {
          initService.once('nodekey', resolve);
        });
        await initRpcServer.close();
      }

      this.logger.info(`Local nodePubKey is ${nodeKey.pubKey}`);

      this.pool = new Pool({
        nodeKey,
        version,
        config: this.config.p2p,
        xuNetwork: this.config.network,
        logger: loggers.p2p,
        models: this.db.models,
      });

      const initPromises: Promise<any>[] = [];

      this.swapClientManager = new SwapClientManager(this.config, loggers);
      initPromises.push(this.swapClientManager.init(this.db.models));

      this.swaps = new Swaps(loggers.swaps, this.db.models, this.pool, this.swapClientManager);
      initPromises.push(this.swaps.init());

      this.orderBook = new OrderBook({
        logger: loggers.orderbook,
        models: this.db.models,
        nomatching: this.config.nomatching,
        pool: this.pool,
        swaps: this.swaps,
        nosanitychecks: this.config.nosanitychecks,
      });
      initPromises.push(this.orderBook.init());

      // wait for components to initialize in parallel
      await Promise.all(initPromises);

      // initialize pool and start listening/connecting only once other components are initialized
      await this.pool.init();

      this.service = new Service({
        version,
        orderBook: this.orderBook,
        swapClientManager: this.swapClientManager,
        pool: this.pool,
        swaps: this.swaps,
        shutdown: this.beginShutdown,
      });

      if (!this.swapClientManager.raidenClient.isDisabled()) {
        this.httpServer = new HttpServer(loggers.http, this.service);
        await this.httpServer.listen(this.config.http.port);
      }

      // start rpc server last
      if (!this.config.rpc.disable) {
        this.rpcServer = new GrpcServer(loggers.rpc);
        this.rpcServer.addXudService(this.service);
        await this.rpcServer.listen(
          this.config.rpc.port,
          this.config.rpc.host,
          path.join(this.config.xudir, 'tls.cert'),
          path.join(this.config.xudir, 'tls.key'),
        );

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
    } catch (err) {
      this.logger.error('Unexpected error during initialization', err);
    }
  }

  private shutdown = async () => {
    if (this.shuttingDown) {
      this.logger.info('XUD is already shutting down');
      return;
    }
    this.shuttingDown = true;
    this.logger.info('XUD is shutting down');

    // TODO: ensure we are not in the middle of executing any trades
    const closePromises: Promise<void>[] = [];

    if (this.swapClientManager) {
      closePromises.push(this.swapClientManager.close());
    }
    if (this.httpServer) {
      closePromises.push(this.httpServer.close());
    }
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
