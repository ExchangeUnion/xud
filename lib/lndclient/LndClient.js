/* eslint-disable camelcase */

const grpc = require('grpc');
const fs = require('fs');
const assert = require('assert');
const Logger = require('../Logger');
const errors = require('./errors');


/** A class representing a client to interact with a running lnd instance. */
class LndClient {
  /**
   * Create an lnd client.
   * @param {Object} options - The lnd configuration
   */
  constructor(options) {
    const { disable, datadir, rpcProtoPath } = options;
    assert(typeof disable === 'boolean', 'disable must be a boolean');
    assert(typeof datadir === 'string', 'datadir must be a string');
    assert(typeof rpcProtoPath === 'string', 'rpcProtoPath must be a string');

    this.logger = Logger.global;
    if (disable) {
      this.setStatus(LndClient.statuses.DISABLED);
    } else {
      const lndCert = fs.readFileSync(`${datadir}tls.cert`);
      const credentials = grpc.credentials.createSsl(lndCert);
      const lnrpcDescriptor = grpc.load(rpcProtoPath);
      this.lightning = new lnrpcDescriptor.lnrpc.Lightning('127.0.0.1:10009', credentials);

      const adminMacaroon = fs.readFileSync(`${datadir}admin.macaroon`);
      this.meta = new grpc.Metadata();
      this.meta.add('macaroon', adminMacaroon.toString('hex'));

      this.setStatus(LndClient.statuses.CONNECTION_VERIFIED); // TODO: verify connection
    }
  }

  isDisabled() {
    return this.status === LndClient.statuses.DISABLED;
  }

  setStatus(val) {
    this.logger.info(`lndClient status: ${val}`);
    this.status = val;
  }

  /**
   * Return general information concerning the lightning node including it’s identity pubkey,
   * alias, the chains it is connected to, and information concerning the number of
   * open+pending channels.
   */
  getInfo() {
    return new Promise((resolve, reject) => {
      if (this.isDisabled()) {
        reject(errors.LND_IS_DISABLED);
        return;
      }
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
      if (this.isDisabled()) {
        reject(errors.LND_IS_DISABLED);
        return;
      }
      this.lightning.addInvoice({
        value,
        memo: 'XU',
      }, this.meta, (err, response) => {
        if (err) {
          reject(err);
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
      if (this.isDisabled()) {
        reject(errors.LND_IS_DISABLED);
        return;
      }
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

LndClient.statuses = {
  DISABLED: 'DISABLED',
  CONNECTION_VERIFIED: 'CONNECTION_VERIFIED', // assuming connection does not remain open
};

module.exports = LndClient;
