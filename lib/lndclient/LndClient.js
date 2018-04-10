/* eslint-disable camelcase */

const grpc = require('grpc');
const fs = require('fs');
const assert = require('assert');
const Config = require('../Config');

/** A class representing a client to interact with a running lnd instance. */
class LndClient {
  /**
   * Create an lnd client.
   * @param {Config} config - The XUD configuration
   */
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

  /**
   * Return general information concerning the lightning node including it’s identity pubkey,
   * alias, the chains it is connected to, and information concerning the number of
   * open+pending channels.
   */
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

  /**
   * Attempt to add a new invoice to the lnd invoice database.
   * @param {number} value - The value of this invoice in satoshis
   */
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

  /**
   * Pay an invoice through the Lightning Network.
   * @param {string} payment_request - An invoice for a payment within the Lightning Network.
   */
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
