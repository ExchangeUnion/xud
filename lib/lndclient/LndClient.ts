import grpc, { Metadata } from 'grpc';
import fs from 'fs';

import Logger from '../Logger';
import BaseClient, { ClientStatus } from '../BaseClient';
import errors from './errors';

type LndClientConfig = {
  disable: boolean;
  datadir: string;
  host: string;
  port: number;
  rpcprotopath: string;
};

/** A class representing a client to interact with a running lnd instance. */
class LndClient extends BaseClient {
  lightning: any;
  meta: Metadata | undefined;
  port: number;
  host: string;

  /**
   * Create an lnd client.
   * @param config - The lnd configuration
   */
  constructor(config: LndClientConfig) {
    super();
    const { disable, datadir, host, port, rpcprotopath } = config;

    this.logger = Logger.global;
    this.port = port;
    this.host = host;
    if (disable) {
      this.setStatus(ClientStatus.DISABLED);
    } else if (!fs.existsSync(`${datadir}tls.cert`)) {
      this.logger.error('could not find tls.cert in the lnd datadir, is lnd installed?', undefined);
      this.setStatus(ClientStatus.DISABLED);
    } else {
      const lndCert = fs.readFileSync(`${datadir}tls.cert`);
      const credentials = grpc.credentials.createSsl(lndCert);
      const lnrpcDescriptor: any = grpc.load(rpcprotopath);
      this.lightning = new lnrpcDescriptor.lnrpc.Lightning(this.host + ':' + this.port, credentials);

      const adminMacaroon = fs.readFileSync(`${datadir}admin.macaroon`);
      this.meta = new grpc.Metadata();
      this.meta.add('macaroon', adminMacaroon.toString('hex'));

      this.setStatus(ClientStatus.CONNECTION_VERIFIED); // TODO: verify connection
    }
  }

  /**
   * Return general information concerning the lightning node including it’s identity pubkey,
   * alias, the chains it is connected to, and information concerning the number of
   * open+pending channels.
   */
  getInfo(): Promise<any> {
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
   * @param value - The value of this invoice in satoshis
   */
  addInvoice(value: number): Promise<any> {
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
   * @param payment_request - An invoice for a payment within the Lightning Network.
   */
  payInvoice(payment_request: string): Promise<any> {
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

export default LndClient;
export { LndClientConfig };
