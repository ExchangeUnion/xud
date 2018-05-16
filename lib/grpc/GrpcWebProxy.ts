import grpcGateway from 'grpc-dynamic-gateway';
import grpc from 'grpc';
import express from 'express';
import * as bodyParser from 'body-parser';
import Logger from '../Logger';

class GrpcWebAPIProxy {
  logger: Logger;
  server: any;

  constructor() {
    this.logger = Logger.global;
    this.server = express();
    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({ extended: false }));
  }

  /**
   * Starts the server and begins listening on the provided port
   * @param {number} proxyPort
   * @param {number} grpcPort
   */
  async listen(proxyPort, grpcPort) {
    // Load the proxy on / URL
    await this.server.use('/api/', grpcGateway(['xud.proto'], `0.0.0.0:${grpcPort}`, grpc.credentials.createInsecure(), true, __dirname));
    await this.server.listen(proxyPort, () => {
      this.logger.info(`GRPC Web API proxy listening on port ${proxyPort}`);
    });
  }

  /**
   * Closes the server and stops listening
   */
  async close() {
    await this.server.close(() => {
      this.logger.info('GRPC Web API proxy stopped listening');
    });
  }
}

export default GrpcWebAPIProxy;
