import * as bodyParser from 'body-parser';
import Logger from '../../Logger';
import path from 'path';
import { Server } from 'net';
import grpcGateway from '@exchangeunion/grpc-dynamic-gateway';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import grpc from 'grpc';
const swaggerDocument = require('../../proto/xudrpc.swagger.json');

/** A class representing an HTTP web proxy for the gRPC service. */
class GrpcWebProxyServer {
  private app: express.Express;
  private server?: Server;

  constructor(private logger: Logger) {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  /**
   * Start the server and begins listening on the specified proxy port.
   */
  public listen = (proxyPort: number, grpcPort: number, grpcHost: string): Promise<void> => {
    // Load the proxy on / URL
    const protoPath = path.join(__dirname, '..', '..', '..', 'proto');
    const gateway = grpcGateway(['xudrpc.proto'], `${grpcHost}:${grpcPort}`, grpc.credentials.createInsecure(), protoPath);
    this.app.use('/api/', gateway);
    return new Promise((resolve) => {
      this.server = this.app.listen(proxyPort, () => {
        this.logger.info(`gRPC Web API proxy listening on port ${proxyPort}`);
        resolve();
      });
      this.server.on('error', (err) => {
        this.logger.error('WebProxyServer Error: ' + err.message);
      });
    });
  }

  /**
   * Stops listening for requests
   */
  public close = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (this.server && this.server.listening) {
        this.server.close(() => {
          this.logger.info('gRPC Web API proxy stopped listening');
          resolve();
        }).once('error', (err) => {
          this.logger.error(err);
          reject(err);
        });
      } else {
        // there is already no server listening
        resolve();
      }
    });
  }
}

export default GrpcWebProxyServer;
