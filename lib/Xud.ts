import { EventEmitter } from 'events';
import { promises as fs } from 'fs';
import path from 'path';
import bootstrap from './bootstrap';
import Config from './Config';
import DB from './db/DB';
import GrpcServer from './grpc/GrpcServer';
import GrpcWebProxyServer from './grpc/webproxy/GrpcWebProxyServer';
import HttpServer from './http/HttpServer';
import Logger from './Logger';
import NodeKey from './nodekey/NodeKey';
import OrderBook from './orderbook/OrderBook';
import Pool from './p2p/Pool';
import InitService from './service/InitService';
import Service from './service/Service';
import SwapClientManager from './swaps/SwapClientManager';
import Swaps from './swaps/Swaps';
import { UnitConverter } from './utils/UnitConverter';
import { AssertionError } from 'assert';
import { SwapClientType } from './constants/enums';

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
  private unitConverter?: UnitConverter;

  /**
   * Create an Exchange Union daemon.
   */
  constructor() {
    super();

    this.config = new Config();

    process.on('SIGINT', () => {
      this.beginShutdown();
    });

    process.on('SIGTERM', () => {
      this.beginShutdown();
    });
  }

  /**
   * Start all processes necessary for the operation of an Exchange Union node.
   * @param args optional arguments to override configuration parameters.
   */
  public start = async (args?: { [argName: string]: any }) => {
    let configFileLoaded: boolean;
    try {
      configFileLoaded = await this.config.load(args);
    } catch (err) {
      if (err instanceof AssertionError) {
        console.error(err.message);
        process.exit(1);
      } else {
        throw err;
      }
    }

    const loggers = Logger.createLoggers(this.config.loglevel, this.config.logpath, this.config.instanceid, this.config.logdateformat);
    this.logger = loggers.global;
    if (configFileLoaded) {
      this.logger.info('config file loaded');
    }

    try {
      if (!this.config.rpc.disable) {
        // start rpc server first, it will respond with UNAVAILABLE error
        // indicating xud is starting until xud finishes initializing
        this.rpcServer = new GrpcServer(loggers.rpc);
        await this.rpcServer.listen(
          this.config.rpc.port,
          this.config.rpc.host,
          path.join(this.config.xudir, 'tls.cert'),
          path.join(this.config.xudir, 'tls.key'),
        );

        if (!this.config.webproxy.disable) {
          this.grpcAPIProxy = new GrpcWebProxyServer(loggers.rpc);
          await this.grpcAPIProxy.listen(
            this.config.webproxy.port,
            this.config.rpc.port,
            this.config.rpc.host,
            path.join(this.config.xudir, 'tls.cert'),
          );
        }
      }

      this.db = new DB(loggers.db, this.config.dbpath);
      await this.db.init(this.config.network, this.config.initdb);

      this.unitConverter = new UnitConverter();
      this.unitConverter.init();

      const nodeKeyPath = NodeKey.getPath(this.config.xudir, this.config.instanceid);
      const nodeKeyExists = await fs.access(nodeKeyPath).then(() => true).catch(() => false);

      this.swapClientManager = new SwapClientManager(this.config, loggers, this.unitConverter);
      await this.swapClientManager.init(this.db.models);

      let nodeKey: NodeKey | undefined;
      if (this.config.noencrypt) {
        if (nodeKeyExists) {
          nodeKey = await NodeKey.fromFile(nodeKeyPath);
        } else {
          nodeKey = await NodeKey.generate();
          await nodeKey.toFile(nodeKeyPath);
        }
      } else if (this.rpcServer) {
        this.rpcServer.grpcService.locked = true;
        const initService = new InitService(this.swapClientManager, nodeKeyPath, nodeKeyExists, this.config.dbpath);

        this.rpcServer.grpcInitService.setInitService(initService);
        this.logger.info("Node key is encrypted, unlock with 'xucli unlock', 'xucli create', or 'xucli restore'");
        nodeKey = await new Promise<NodeKey | undefined>((resolve) => {
          initService.once('nodekey', resolve);
          this.on('shutdown', () => {
            // in case we shutdown before unlocking xud
            resolve();
            initService.removeListener('nodekey', resolve);
          });
        });
        if (!nodeKey) {
          return; // we interrupted before unlocking xud
        }
        this.rpcServer.grpcService.locked = false;
      } else {
        throw new Error('rpc server cannot be disabled when xud is locked');
      }
      if (this.rpcServer) {
        this.rpcServer.grpcInitService.disable();
      }

      this.logger.info(`Local nodePubKey is ${nodeKey.pubKey}`);

      // TODO: temporary code. We're initializing ConnextClient later
      // because NodeKey is required.
      await this.swapClientManager.initConnext(
        nodeKey.childSeed(SwapClientType.Connext),
      );

      this.pool = new Pool({
        nodeKey,
        version,
        config: this.config.p2p,
        xuNetwork: this.config.network,
        logger: loggers.p2p,
        models: this.db.models,
      });

      const initPromises: Promise<any>[] = [];

      this.swaps = new Swaps(loggers.swaps, this.db.models, this.pool, this.swapClientManager);
      initPromises.push(this.swaps.init());

      this.orderBook = new OrderBook({
        logger: loggers.orderbook,
        models: this.db.models,
        thresholds: this.config.orderthresholds,
        nomatching: this.config.nomatching,
        pool: this.pool,
        swaps: this.swaps,
        nosanityswaps: this.config.nosanityswaps,
        nobalancechecks: this.config.nobalancechecks,
        maxlimits: this.config.maxlimits,
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

      if (this.swapClientManager.raidenClient?.isOperational()) {
        this.httpServer = new HttpServer(loggers.http, this.service);
        await this.httpServer.listen(
          this.config.http.port,
          this.config.http.host,
        );
      }

      // initialize rpc server last
      if (this.rpcServer) {
        this.rpcServer.grpcService.setService(this.service);

      } else {
        this.logger.info('RPC server is disabled.');
      }
    } catch (err) {
      this.logger.error('Unexpected error during initialization, shutting down...', err);
      await this.shutdown();
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
      this.swapClientManager.close();
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
    }
    if (this.swaps) {
      this.swaps.close();
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
