import assert from 'assert';
import grpc from 'grpc';

class XUClient {
  port: number;
  grpcClient: any;
  host: string = 'localhost';

  constructor(port: number, host?: string) {
    if (port) {
      assert(port > 1023 && port < 65536, 'port must be between 1024 and 65535');
      this.port = port;
    }
    if (host) {
      this.host = host;
    }
    this.port = port || 8886;
    const xurpc: any = grpc.load(__dirname + '/xud.proto', 'proto');
    this.grpcClient = new xurpc.xudrpc.XUDService(`${this.host}:${this.port}`, grpc.credentials.createInsecure());
  }

  getInfo(): Promise<any> {
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

  getOrders(): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.grpcClient.getOrders({}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  getPairs(): Promise<any> {
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

  placeOrder(order): Promise<any> {
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

  connect(host, port): Promise<any> {
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

  tokenSwap(target_address, payload, identifier): Promise<any> {
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

  shutdown(): Promise<any> {
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
