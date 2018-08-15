import grpc, { Server } from 'grpc';
import assert from 'assert';
import path from 'path';
import Logger from '../Logger';
import GrpcService from './GrpcService';
import Service from '../service/Service';
import errors from './errors';

class GrpcServer {
  private server: Server;

  constructor(private logger: Logger, service: Service) {
    this.server = new grpc.Server();
    const xudrpcProtoPath = path.join(__dirname, '..', '..', 'proto', 'xudrpc.proto');
    const protoDescriptor = grpc.load(xudrpcProtoPath, 'proto', { convertFieldsToCamelCase: true });
    const { xudrpc }: any = protoDescriptor;

    const grpcService = new GrpcService(logger, service);
    this.server.addService(xudrpc.Xud.service, {
      cancelOrder: grpcService.cancelOrder,
      connect: grpcService.connect,
      disconnect: grpcService.disconnect,
      executeSwap: grpcService.executeSwap,
      getInfo: grpcService.getInfo,
      getOrders: grpcService.getOrders,
      getPairs: grpcService.getPairs,
      placeOrder: grpcService.placeOrder,
      shutdown: grpcService.shutdown,
      subscribePeerOrders: grpcService.subscribePeerOrders,
      subscribeSwaps: grpcService.subscribeSwaps,
      listPeers: grpcService.listPeers,
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
