import grpc, { Server, GrpcObject } from 'grpc';
import assert from 'assert';
import path from 'path';
import Logger from '../Logger';
import GrpcService from './GrpcService';
import OrderBook from '../orderbook/OrderBook';
import LndClient from '../lndclient/LndClient';
import RaidenClient from '../raidenclient/RaidenClient';
import Pool from '../p2p/Pool';
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
    this.server.addService(xudrpc.XUDService.service, {
      getInfo: grpcService.getInfo,
      getPairs: grpcService.getPairs,
      getOrders: grpcService.getOrders,
      placeOrder: grpcService.placeOrder,
      connect: grpcService.connect,
      tokenSwap: grpcService.tokenSwap,
    });
  }

  /**
   * Start the server and begin listening on the provided port
   * @param port
   */
  public listen = (host: string, port: number) => {
    assert(Number.isInteger(port) && port > 1023 && port < 65536, 'port must be an integer between 1024 and 65535');

    try {
      const address = `${host}:${port}`;
      this.server.bind(address, grpc.ServerCredentials.createInsecure());
      this.server.start();
      this.logger.info(`GRPC server listening on ${address}`);
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
