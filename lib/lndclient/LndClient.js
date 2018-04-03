/* eslint-disable camelcase */

const grpc = require('grpc');
const fs = require('fs');
const assert = require('assert');
const Config = require('../Config');

class LndClient {
  constructor(config) {
    assert(config instanceof Config, 'config must be an instance of Config');
    const { lndDir, lndRpcProto } = config;

    const lndCert = fs.readFileSync(`${lndDir}tls.cert`);
    const credentials = grpc.credentials.createSsl(lndCert);
    const lnrpcDescriptor = grpc.load(lndRpcProto);
    this.lightning = new lnrpcDescriptor.lnrpc.Lightning('127.0.0.1:10009', credentials);

    const adminMacaroon = fs.readFileSync(`${lndDir}admin.macaroon`);
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

  addInvoice(value) {
    return new Promise((resolve, reject) => {
      this.lightning.addInvoice({
        value,
        memo: 'XU',
      }, this.meta, (err, response) => {
        if (err) {
          reject(err.details);
        } else {
          resolve(response);
        }
      });
    });
  }

  payInvoice(payment_request) {
    return new Promise((resolve, reject) => {
      this.lightning.sendPaymentSync({ payment_request }, this.meta, (err, response) => {
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
