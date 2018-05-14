import grpc, { Metadata, ChannelCredentials, StatusObject } from 'grpc';
import fs from 'fs';

import Logger from '../Logger';
import BaseClient, { ClientStatus } from'../BaseClient';
import errors from './errors';
import * as lndrpc from './lndrpc_pb';

/**
 * The configurable options for the lnd client.
 */
type LndClientConfig = {
  disable: boolean;
  datadir: string;
  certificate: string;
  host: string;
  macaroon: string;
  rpcprotopath: string;
};

/** A class representing a client to interact with lnd. */
class LndClient extends BaseClient{
  lightning: any;
  meta?: Metadata;

  /**
   * Create an lnd client.
   * @param config - The lnd configuration
   */
  constructor(config: LndClientConfig) {
    super();
    const { disable, datadir, certificate, host, macaroon, rpcprotopath } = config;

    this.logger = Logger.global;
    if (disable) {
      this.setStatus(ClientStatus.DISABLED);
    } else if (!fs.existsSync(certificate)) {
      this.logger.error('could not find certificate in the lnd datadir, is lnd installed?');
      this.setStatus(ClientStatus.DISABLED);
    } else {
      const lndCert: Buffer = fs.readFileSync(certificate);
      const credentials: ChannelCredentials = grpc.credentials.createSsl(lndCert);
      const lnrpcDescriptor: any = grpc.load(rpcprotopath);
      this.lightning = new lnrpcDescriptor.lnrpc.Lightning(host, credentials);

      const adminMacaroon: Buffer = fs.readFileSync(macaroon);
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
  getInfo(): Promise<lndrpc.GetInfoResponse.AsObject> {
    return new Promise((resolve, reject) => {
      if (this.isDisabled()) {
        reject(errors.LND_IS_DISABLED);
        return;
      }
      this.lightning.getInfo({}, this.meta, (err: StatusObject, response: lndrpc.GetInfoResponse.AsObject) => {
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
   * @param value The value of this invoice in satoshis
   */
  addInvoice(value: number): Promise<lndrpc.AddInvoiceResponse.AsObject> {
    return new Promise((resolve, reject) => {
      if (this.isDisabled()) {
        reject(errors.LND_IS_DISABLED);
        return;
      }
      this.lightning.addInvoice({
        value,
        memo: 'XU',
      }, this.meta, (err: StatusObject, response: lndrpc.AddInvoiceResponse.AsObject) => {
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
   * @param payment_request An invoice for a payment within the Lightning Network.
   */
  payInvoice(payment_request: string): Promise<lndrpc.SendResponse.AsObject> {
    return new Promise((resolve, reject) => {
      if (this.isDisabled()) {
        reject(errors.LND_IS_DISABLED);
        return;
      }
      this.lightning.sendPaymentSync({ payment_request }, this.meta, (err: StatusObject, response: lndrpc.SendResponse.AsObject) => {
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
