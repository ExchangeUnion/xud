import grpc, { Server } from 'grpc';
import assert from 'assert';
import Logger from '../Logger';
import GrpcService from './GrpcService';
import OrderBook from '../orderbook/OrderBook';
import LndClient from '../lndclient/LndClient';
import RaidenClient from '../raidenclient/RaidenClient';
import Pool from '../p2p/Pool';

/**
 * The components required by the RPC server.
 */
type GrpcComponents = {
  orderBook: OrderBook;
  lndClient: LndClient;
  raidenClient: RaidenClient;
  pool: Pool;
  /** The function to be called to shutdown the parent process */
  shutdown: Function;
};

class GrpcServer {
  private server: Server;
  private logger: Logger;
  private grpcService: GrpcService;
  private xudrpc: any;

  constructor(components: GrpcComponents) {
    this.grpcService = new GrpcService(components);
    this.logger = Logger.global;
    const PROTO_PATH = __dirname + '/xud.proto';
    const protoDescriptor = grpc.load(PROTO_PATH, 'proto');
    this.xudrpc = protoDescriptor.xudrpc;
    this.server = new grpc.Server();
  }

  /**
   * Starts the server and begins listening on the provided port
   * @param port
   */
  public listen = (port: number) => {
    assert(Number.isInteger(port) && port > 1023 && port < 65536, 'port must be an integer between 1024 and 65535');

    this.server.addService(this.xudrpc.XUDService.service, {
      getInfo: this.grpcService.getInfo,
      getPairs: this.grpcService.getPairs,
      getOrders: this.grpcService.getOrders,
      placeOrder: this.grpcService.placeOrder,
      connect: this.grpcService.connect,
      tokenSwap: this.grpcService.tokenSwap,
    });

    try {
      this.server.bind('localhost:' + port, grpc.ServerCredentials.createInsecure());
      this.server.start();
      this.logger.info(`GRPC server listening on port ${port}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Stops listening for requests
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
export { GrpcComponents };
