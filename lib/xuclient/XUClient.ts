import assert from 'assert';
import grpc from 'grpc';
import path from 'path';
import { TokenSwapPayload } from '../raidenclient/RaidenClient';
import { OwnOrder } from '../types/orders';

class XUClient {
  private port: number = 8886;
  private id: number = 1;
  private grpcClient: any;

  constructor(port?: number, private host: string = 'localhost') {
    if (port) {
      assert(port > 1023 && port < 65536, 'port must be between 1024 and 65535');
      this.port = port;
    }
    if (host) {
      this.host = host;
    }
    this.port = port || 8886;
    const xudrpcProtoPath = path.join(__dirname, '..', '..', 'proto', 'xudrpc.proto');
    const xurpc: any = grpc.load(xudrpcProtoPath, 'proto');
    this.grpcClient = new xurpc.xudrpc.XUDService(`${this.host}:${this.port}`, grpc.credentials.createInsecure());
  }

  public getInfo = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      return this.grpcClient.getInfo({}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  public getOrders = (pairId: string, maxResults: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      return this.grpcClient.getOrders({ pairId, maxResults }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  public getPairs = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      return this.grpcClient.getPairs({}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });

  }

  public placeOrder = (order: OwnOrder): Promise<any> => {
    return new Promise((resolve, reject) => {
      return this.grpcClient.placeOrder({ order }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  public connect = (host: number, port: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      return this.grpcClient.connect({ host, port }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  public tokenSwap = (target_address: string, payload: TokenSwapPayload, identifier: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      return this.grpcClient.tokenSwap({ target_address, payload, identifier }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  public shutdown = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      return this.grpcClient.shutdown({}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }
}

export default XUClient;
