import grpc from 'grpc';
import fs from 'fs';
import path from 'path';

import Logger from '../Logger';
import BaseClient, { ClientStatus } from '../BaseClient';
import errors from './errors';
import * as lndrpc from './lndrpc_pb';

/**
 * The configurable options for the lnd client.
 */
type LndClientConfig = {
  disable: boolean;
  datadir: string;
  certpath: string;
  macaroonpath: string;
  host: string;
  port: number;
};

/** A class representing a client to interact with lnd. */
class LndClient extends BaseClient{
  private lightning: any;
  private meta?: grpc.Metadata;

  /**
   * Create an lnd client.
   * @param config The lnd configuration
   */
  constructor(config: LndClientConfig) {
    super();
    const { disable, datadir, certpath, host, port, macaroonpath } = config;

    this.logger = Logger.global;

    if (disable) {
      this.setStatus(ClientStatus.DISABLED);
    } else if (!fs.existsSync(certpath)) {
      this.logger.error('could not find certificate in the lnd datadir, is lnd installed?');
      this.setStatus(ClientStatus.DISABLED);
    } else {
      const lndCert = fs.readFileSync(certpath);
      const credentials = grpc.credentials.createSsl(lndCert);
      const rpcprotopath = path.join(__dirname, '..', '..', 'lndrpc.proto');
      const lnrpcDescriptor: any = grpc.load(rpcprotopath);
      this.lightning = new lnrpcDescriptor.lnrpc.Lightning(`${host}:${port}`, credentials);

      const adminMacaroon = fs.readFileSync(macaroonpath);
      this.meta = new grpc.Metadata();
      this.meta.add('macaroon', adminMacaroon.toString('hex'));

      this.setStatus(ClientStatus.CONNECTION_VERIFIED); // TODO: verify connection
    }
  }

  private unaryCall = <T>(method: Function, params: any): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (this.isDisabled()) {
        reject(errors.LND_IS_DISABLED);
        return;
      }
      method(params, this.meta, (err: grpc.StatusObject, response: T) => {
        if (err) {
          reject(err.details);
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Return general information concerning the lightning node including it’s identity pubkey, alias, the chains it
   * is connected to, and information concerning the number of open+pending channels.
   */
  public getInfo = (): Promise<lndrpc.GetInfoResponse.AsObject> => {
    return this.unaryCall<lndrpc.GetInfoResponse.AsObject>(this.lightning.getInfo, {});
  }

  /**
   * Attempt to add a new invoice to the lnd invoice database.
   * @param value The value of this invoice in satoshis
   */
  public addInvoice = (value: number): Promise<lndrpc.AddInvoiceResponse.AsObject> => {
    return this.unaryCall<lndrpc.AddInvoiceResponse.AsObject>(this.lightning.addInvoice, { value, memo: 'XU' });
  }

  /**
   * Pay an invoice through the Lightning Network.
   * @param payment_request An invoice for a payment within the Lightning Network.
   */
  public payInvoice = (payment_request: string): Promise<lndrpc.SendResponse.AsObject> => {
    return this.unaryCall<lndrpc.SendResponse.AsObject>(this.lightning.sendPaymentSync, { payment_request });
  }

  /**
   * Get a new address for the internal lnd wallet.
   */
  public newAddress = (address_type: lndrpc.NewAddressRequest.AddressType): Promise<lndrpc.NewAddressResponse.AsObject> => {
    return this.unaryCall<lndrpc.NewAddressResponse.AsObject>(this.lightning.newAddress, { address_type });
  }

  /**
   * Return the total of unspent outputs for the internal lnd wallet.
   */
  public walletBalance = (): Promise<lndrpc.WalletBalanceResponse.AsObject> => {
    return this.unaryCall<lndrpc.WalletBalanceResponse.AsObject>(this.lightning.walletBalance, {});
  }

  /**
   * Return the total funds available across all channels.
   */
  public channelBalance = (): Promise<lndrpc.ChannelBalanceResponse.AsObject> => {
    return this.unaryCall<lndrpc.ChannelBalanceResponse.AsObject>(this.lightning.channelBalance, {});
  }

  /**
   * Connect to another lnd node.
   */
  public connectPeer = (addr: lndrpc.LightningAddress): Promise<lndrpc.ConnectPeerResponse.AsObject> => {
    return this.unaryCall<lndrpc.ConnectPeerResponse.AsObject>(this.lightning.connectPeer, { addr });
  }

  /**
   * Open a channel with a connected lnd node.
   */
  public openChannel = (node_pubkey_string: string, local_funding_amount: string): Promise<lndrpc.ChannelPoint.AsObject> => {
    return this.unaryCall<lndrpc.ChannelPoint.AsObject>(this.lightning.openChannel, { node_pubkey_string, local_funding_amount });
  }

  /**
   * List all open channels for this node.
   */
  public listChannels = (): Promise<lndrpc.ListChannelsResponse.AsObject> => {
    return this.unaryCall<lndrpc.ListChannelsResponse.AsObject>(this.lightning.listChannels, {});
  }

  /**
   * Attempt to close an open channel.
   */
  public closeChannel = (channel_point: lndrpc.ChannelPoint, force: boolean): void => {
    if (this.isDisabled()) {
      throw(errors.LND_IS_DISABLED);
    }
    this.lightning.closeChannel({ channel_point, force }, this.meta)
      // TODO: handle close channel events
      .on('data', (message: string) => {
        this.logger.info(`closeChannel update: ${message}`);
      })
      .on('end', () => {
        this.logger.info('closeChannel ended');
      })
      .on('status', (status: string) => {
        this.logger.debug(`closeChannel status: ${JSON.stringify(status)}`);
      })
      .on('error', (error: any) => {
        this.logger.error(`closeChannel error: ${error}`);
      });
  }

  /**
   * Subscribe to events for when invoices are settled.
   */
  public subscribeInvoices = (): void => {
    if (this.isDisabled()) {
      throw(errors.LND_IS_DISABLED);
    }
    this.lightning.subscribeInvoices({}, this.meta)
      // TODO: handle invoice events
      .on('data', (message: string) => {
        this.logger.info(`invoice update: ${message}`);
      })
      .on('end', () => {
        this.logger.info('invoice ended');
      })
      .on('status', (status: string) => {
        this.logger.debug(`invoice status: ${JSON.stringify(status)}`);
      })
      .on('error', (error: any) => {
        this.logger.error(`invoice error: ${error}`);
      });
  }
}

export default LndClient;
export { LndClientConfig };
