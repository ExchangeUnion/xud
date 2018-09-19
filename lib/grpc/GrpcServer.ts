import grpc, { Server } from 'grpc';
import assert from 'assert';
import Logger from '../Logger';
import GrpcService from './GrpcService';
import Service from '../service/Service';
import errors from './errors';
import { XudService } from '../proto/xudrpc_grpc_pb';
import { HashResolverService } from '../proto/lndrpc_grpc_pb';

class GrpcServer {
  private server: Server;

  constructor(private logger: Logger, service: Service) {
    this.server = new grpc.Server();

    const grpcService = new GrpcService(logger, service);
    this.server.addService(XudService, {
      addCurrency: grpcService.addCurrency,
      addPair: grpcService.addPair,
      cancelOrder: grpcService.cancelOrder,
      channelBalance: grpcService.channelBalance,
      connect: grpcService.connect,
      disconnect: grpcService.disconnect,
      getInfo: grpcService.getInfo,
      getOrders: grpcService.getOrders,
      listCurrencies: grpcService.listCurrencies,
      listPairs: grpcService.listPairs,
      listPeers: grpcService.listPeers,
      placeOrder: grpcService.placeOrder,
      removeCurrency: grpcService.removeCurrency,
      removePair: grpcService.removePair,
      shutdown: grpcService.shutdown,
      subscribeAddedOrders: grpcService.subscribeAddedOrders,
      subscribeRemovedOrders: grpcService.subscribeRemovedOrders,
      subscribeSwaps: grpcService.subscribeSwaps,
    });

    this.server.addService(HashResolverService, {
      resolveHash: grpcService.resolveHash,
    });
  }

  /**
   * Start the server and begin listening on the provided port
   * @returns true if the server started listening successfully, false otherwise
   */
  public listen = (port: number, host: string) => {
    assert(Number.isInteger(port) && port > 1023 && port < 65536, 'port must be an integer between 1024 and 65535');

    const bindCode = this.server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure());
    if (bindCode !== port) {
      const error = errors.COULD_NOT_BIND(port.toString());
      this.logger.error(error.message);
      return false;
    }

    this.server.start();
    this.logger.info(`gRPC server listening on ${host}:${port}`);
    return true;
  }

  /**
   * Stop listening for requests
   */
  public close = (): Promise<void> => {
    return new Promise((resolve) => {
      this.server.tryShutdown(() => {
        this.logger.info('GRPC server completed shutdown');
        resolve();
      });
    });
  }
}

export default GrpcServer;
