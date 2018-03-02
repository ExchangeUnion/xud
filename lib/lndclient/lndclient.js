const grpc = require('grpc');
const fs = require('fs');
const assert = require('assert');

class LndClient {
  constructor(lndHomeDir) {
    assert(typeof lndHomeDir === 'string', 'lnd directory must be a string');
    const lndCert = fs.readFileSync(`${lndHomeDir}/tls.cert`);
    const credentials = grpc.credentials.createSsl(lndCert);
    const lnrpcDescriptor = grpc.load('../rpc.proto');
    this.lightning = new lnrpcDescriptor.lnrpc.Lightning('127.0.0.1:10009', credentials);

    const adminMacaroon = fs.readFileSync(`${lndHomeDir}admin.macaroon`);
    this.meta = new grpc.Metadata();
    this.meta.add('macaroon', adminMacaroon.toString('hex'));
  }

  getInfo() {
    return new Promise((resolve, reject) => {
      this.lightning.getInfo({}, this.meta, (err, response) => {
        if (err) {
          reject(err.details);
        } else {
          resolve(response);
        }
      });
    });
  }
}

module.exports = LndClient;
