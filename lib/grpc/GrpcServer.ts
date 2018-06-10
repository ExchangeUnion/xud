import grpc, { Server } from 'grpc';
import assert from 'assert';
import path from 'path';
import Logger from '../Logger';
import GrpcService from './GrpcService';
import Service from '../service/Service';

class GrpcServer {
  private server: Server;
  private logger: Logger;

  constructor(service: Service) {
    this.logger = Logger.rpc;
    this.server = new grpc.Server();

    const xudrpcProtoPath = path.join(__dirname, '..', '..', 'proto', 'xudrpc.proto');
    const protoDescriptor = grpc.load(xudrpcProtoPath, 'proto', { convertFieldsToCamelCase: true });
    const { xudrpc }: any = protoDescriptor;

    const grpcService = new GrpcService(service);
    this.server.addService(xudrpc.Xud.service, {
      getInfo: grpcService.getInfo,
      getPairs: grpcService.getPairs,
      getOrders: grpcService.getOrders,
      placeOrder: grpcService.placeOrder,
      connect: grpcService.connect,
      tokenSwap: grpcService.tokenSwap,
      shutdown: grpcService.shutdown,
    });
  }

  /**
   * Start the server and begin listening on the provided port
   * @param port
   */
  public listen = (port: number, host: string) => {
    assert(Number.isInteger(port) && port > 1023 && port < 65536, 'port must be an integer between 1024 and 65535');

    try {
      this.server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure());
      this.server.start();
      this.logger.info(`gRPC server listening on ${host}:${port}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Stop listening for requests
   */
  public close = (): Promise<void> => {
    return new Promise((resolve) => {
      this.server.tryShutdown(() => {
        this.logger.info('GRPC server stopped listening');
        resolve();
      });
    });
  }
}

export default GrpcServer;
