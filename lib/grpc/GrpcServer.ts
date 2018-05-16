import grpc, { Server } from 'grpc';
import assert from 'assert';
import Logger from '../Logger';
import GrpcMethods from './GrpcMethods';
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
  server: Server;
  logger: Logger;
  rpcMethods: GrpcMethods;
  xudrpc: any;

  constructor(components: GrpcComponents) {
    this.rpcMethods = new GrpcMethods(components);
    this.logger = Logger.global;
    const PROTO_PATH = __dirname + '/xud.proto';
    const protoDescriptor = grpc.load(PROTO_PATH, 'proto');
    this.xudrpc = protoDescriptor.xudrpc;
    this.server = new grpc.Server();
  }

  /**
   * Starts the server and begins listening on the provided port
   * @param {number} port
   */
  async listen(port) {
    assert(port && Number.isInteger(port) && port > 1023 && port < 65536, 'port must be an integer between 1024 and 65535');

    await this.server.addService(this.xudrpc.XUDService.service, {
      getInfo: this.rpcMethods.getInfo,
      getPairs: this.rpcMethods.getPairs,
      getOrders: this.rpcMethods.getOrders,
      placeOrder: this.rpcMethods.placeOrder,
      connect: this.rpcMethods.connect,
      tokenSwap: this.rpcMethods.tokenSwap,
    });
    try {
      await this.server.bind('localhost:' + port, grpc.ServerCredentials.createInsecure());
      await this.server.start();
      this.logger.info(`GRPC server listening on port ${port}`);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Closes the server and stops listening
   */
  async close() {
    await this.server.tryShutdown(function name() {
      this.logger.info('GRPC server stopped listening');
    });
  }
}

export default GrpcServer;
export { GrpcComponents };
