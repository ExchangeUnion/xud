import grpc, { ChannelCredentials } from 'grpc';
import fs from 'fs';

import Logger from '../Logger';
import BaseClient, { ClientStatus } from '../BaseClient';
import errors from './errors';
import { LightningClient } from '../proto/lndrpc_grpc_pb';
import * as lndrpc from '../proto/lndrpc_pb';

/**
 * The configurable options for the lnd client.
 */
type LndClientConfig = {
  disable: boolean;
  certpath: string;
  macaroonpath: string;
  host: string;
  port: number;
};

interface GrpcResponse {
  toObject: Function;
}

/** A class representing a client to interact with lnd. */
class LndClient extends BaseClient {
  private lightning!: LightningClient;
  private meta!: grpc.Metadata;
  private uri!: string;
  private credentials!: ChannelCredentials;

  /**
   * Create an lnd client.
   * @param config The lnd configuration
   */
  constructor(config: LndClientConfig) {
    super(Logger.lnd);
    const { disable, certpath, macaroonpath } = config;

    if (disable) {
      this.setStatus(ClientStatus.DISABLED);
    } else if (!fs.existsSync(certpath)) {
      this.logger.error('could not find lnd certificate, is lnd installed?');
      this.setStatus(ClientStatus.DISABLED);
    } else if (!fs.existsSync(macaroonpath)) {
      this.logger.error('could not find lnd macaroon, is lnd installed?');
      this.setStatus(ClientStatus.DISABLED);
    } else {
      this.uri = `${config.host}:${config.port}`;
      const lndCert = fs.readFileSync(certpath);
      this.credentials = grpc.credentials.createSsl(lndCert);

      const adminMacaroon = fs.readFileSync(macaroonpath);
      this.meta = new grpc.Metadata();
      this.meta.add('macaroon', adminMacaroon.toString('hex'));
    }
  }

  private unaryCall = <T, U>(methodName: string, params: T): Promise<U> => {
    return new Promise((resolve, reject) => {
      if (this.isDisabled()) {
        reject(errors.LND_IS_DISABLED);
        return;
      }
      this.lightning[methodName](params, this.meta, (err: grpc.ServiceError, response: GrpcResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.toObject());
        }
      });
    });
  }

  public connect = async () => {
    if (!this.isDisabled()) {
      this.logger.info(`trying to connect to lnd with uri: ${this.uri}`);
      this.lightning = new LightningClient(this.uri, this.credentials);

      try {
        const getInfoResponse = await this.getInfo();
        if (getInfoResponse) {
          this.setStatus(ClientStatus.CONNECTION_VERIFIED);
          this.subscribeInvoices();
        }
      } catch (err) {
        this.logger.error(`could not fetch info from lnd host, error: ${JSON.stringify(err)}, retrying in 5000 ms`);
        setTimeout(this.connect, 5000);
      }
    }
  }

  /**
   * Return general information concerning the lightning node including it’s identity pubkey, alias, the chains it
   * is connected to, and information concerning the number of open+pending channels.
   */
  public getInfo = (): Promise<lndrpc.GetInfoResponse.AsObject> => {
    return this.unaryCall<lndrpc.GetInfoRequest, lndrpc.GetInfoResponse.AsObject>('getInfo', new lndrpc.GetInfoRequest());
  }

  /**
   * Attempt to add a new invoice to the lnd invoice database.
   * @param value The value of this invoice in satoshis
   */
  public addInvoice = (value: number): Promise<lndrpc.AddInvoiceResponse.AsObject> => {
    const request = new lndrpc.Invoice();
    request.setValue(value);
    return this.unaryCall<lndrpc.Invoice, lndrpc.AddInvoiceResponse.AsObject>('addInvoice', request);
  }

  /**
   * Pay an invoice through the Lightning Network.
   * @param payment_request An invoice for a payment within the Lightning Network.
   */
  public payInvoice = (paymentRequest: string): Promise<lndrpc.SendResponse.AsObject> => {
    const request = new lndrpc.SendRequest();
    request.setPaymentRequest(paymentRequest);
    return this.unaryCall<lndrpc.SendRequest, lndrpc.SendResponse.AsObject>('sendPaymentSync', request);
  }

  /**
   * Get a new address for the internal lnd wallet.
   */
  public newAddress = (addressType: lndrpc.NewAddressRequest.AddressType): Promise<lndrpc.NewAddressResponse.AsObject> => {
    const request = new lndrpc.NewAddressRequest();
    request.setType(addressType);
    return this.unaryCall<lndrpc.NewAddressRequest, lndrpc.NewAddressResponse.AsObject>('newAddress', request);
  }

  /**
   * Return the total of unspent outputs for the internal lnd wallet.
   */
  public walletBalance = (): Promise<lndrpc.WalletBalanceResponse.AsObject> => {
    return this.unaryCall<lndrpc.WalletBalanceRequest, lndrpc.WalletBalanceResponse.AsObject>('walletBalance', new lndrpc.WalletBalanceRequest());
  }

  /**
   * Return the total funds available across all channels.
   */
  public channelBalance = (): Promise<lndrpc.ChannelBalanceResponse.AsObject> => {
    return this.unaryCall<lndrpc.ChannelBalanceRequest, lndrpc.ChannelBalanceResponse.AsObject>('channelBalance', new lndrpc.ChannelBalanceRequest());
  }

  /**
   * Connect to another lnd node.
   */
  public connectPeer = (pubkey: string, host: string, port: number): Promise<lndrpc.ConnectPeerResponse.AsObject> => {
    const request = new lndrpc.ConnectPeerRequest();
    const address = new lndrpc.LightningAddress();
    address.setHost(`${host}:${port}`);
    address.setPubkey(pubkey);
    request.setAddr(address);
    return this.unaryCall<lndrpc.ConnectPeerRequest, lndrpc.ConnectPeerResponse.AsObject>('connectPeer', request);
  }

  /**
   * Open a channel with a connected lnd node.
   */
  public openChannel = (node_pubkey_string: string, local_funding_amount: number): Promise<lndrpc.ChannelPoint.AsObject> => {
    const request = new lndrpc.OpenChannelRequest;
    request.setNodePubkeyString(node_pubkey_string);
    request.setLocalFundingAmount(local_funding_amount);
    return this.unaryCall<lndrpc.OpenChannelRequest, lndrpc.ChannelPoint.AsObject>('openChannelSync', request);
  }

  /**
   * List all open channels for this node.
   */
  public listChannels = (): Promise<lndrpc.ListChannelsResponse.AsObject> => {
    return this.unaryCall<lndrpc.ListChannelsRequest, lndrpc.ListChannelsResponse.AsObject>('listChannels', new lndrpc.ListChannelsRequest());
  }

  /**
   * Attempt to close an open channel.
   */
  public closeChannel = (fundingTxId: string, outputIndex: number, force: boolean): void => {
    if (this.isDisabled()) {
      throw(errors.LND_IS_DISABLED);
    }
    const request = new lndrpc.CloseChannelRequest();
    const channelPoint = new lndrpc.ChannelPoint();
    channelPoint.setFundingTxidStr(fundingTxId);
    channelPoint.setOutputIndex(outputIndex);
    request.setChannelPoint(channelPoint);
    request.setForce(force);
    this.lightning.closeChannel(request, this.meta)
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
  private subscribeInvoices = (): void => {
    if (this.isDisabled()) {
      throw(errors.LND_IS_DISABLED);
    }
    this.lightning.subscribeInvoices(new lndrpc.InvoiceSubscription(), this.meta)
      // TODO: handle invoice events
      .on('data', (message: string) => {
        this.logger.info(`invoice update: ${message}`);
      })
      .on('end', () => {
        this.logger.info('invoice ended');
        this.setStatus(ClientStatus.DISABLED);
        this.connect();
      })
      .on('status', (status: string) => {
        this.logger.debug(`invoice status: ${JSON.stringify(status)}`);
      })
      .on('error', (error: any) => {
        this.logger.error(`invoice error: ${error}`);
        this.setStatus(ClientStatus.DISABLED);
        this.connect();
      });
  }
}

export default LndClient;
export { LndClientConfig };
