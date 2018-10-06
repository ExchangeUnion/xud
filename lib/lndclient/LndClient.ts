import grpc, { ChannelCredentials, ClientReadableStream } from 'grpc';
import fs from 'fs';
import Logger from '../Logger';
import BaseClient, { ClientStatus } from '../BaseClient';
import errors from './errors';
import { LightningClient } from '../proto/lndrpc_grpc_pb';
import * as lndrpc from '../proto/lndrpc_pb';
import assert from 'assert';

/** The configurable options for the lnd client. */
type LndClientConfig = {
  disable: boolean;
  certpath: string;
  macaroonpath: string;
  host: string;
  port: number;
  cltvdelta: number;
  nomacaroons: boolean;
};

/** General information about the state of this lnd client. */
type LndInfo = {
  error?: string;
  channels?: ChannelCount;
  chains?: string[];
  blockheight?: number;
  uris?: string[];
  version?: string;
  alias?: string;
};

type ChannelCount = {
  active: number,
  inactive?: number,
  pending: number,
};

interface GrpcResponse {
  toObject: Function;
}

interface LightningMethodIndex extends LightningClient {
  [methodName: string]: Function;
}

interface LndClient {
  on(event: 'connectionVerified', listener: (newPubKey?: string) => void): this;
  emit(event: 'connectionVerified', newPubKey?: string): boolean;
}

/** A class representing a client to interact with lnd. */
class LndClient extends BaseClient {
  public readonly cltvDelta: number = 0;
  private lightning!: LightningClient | LightningMethodIndex;
  private meta!: grpc.Metadata;
  private uri!: string;
  private credentials!: ChannelCredentials;
  private invoiceSubscription?: ClientReadableStream<lndrpc.InvoiceSubscription>;
  private reconnectionTimer?: NodeJS.Timer;
  private identityPubKey?: string;

  /** Time in milliseconds between attempts to recheck connectivity to lnd if it is lost. */
  private static RECONNECT_TIMER = 5000;

  /**
   * Create an lnd client.
   * @param config the lnd configuration
   */
  constructor(config: LndClientConfig, logger: Logger) {
    super(logger);

    let shouldEnable = true;
    const { disable, certpath, macaroonpath, cltvdelta, nomacaroons } = config;

    if (disable) {
      shouldEnable = false;
    }
    if (!fs.existsSync(certpath)) {
      this.logger.error('could not find lnd certificate, is lnd installed?');
      shouldEnable = false;
    }
    if (!nomacaroons && !fs.existsSync(macaroonpath)) {
      this.logger.error('could not find lnd macaroon, is lnd installed?');
      shouldEnable = false;
    }
    if (shouldEnable) {
      this.cltvDelta = cltvdelta;
      assert(this.cltvDelta > 0, 'cltvdelta must be a positive number');
      this.uri = `${config.host}:${config.port}`;
      this.cltvDelta = cltvdelta;
      const lndCert = fs.readFileSync(certpath);
      this.credentials = grpc.credentials.createSsl(lndCert);

      this.meta = new grpc.Metadata();
      if (!nomacaroons) {
        const adminMacaroon = fs.readFileSync(macaroonpath);
        this.meta.add('macaroon', adminMacaroon.toString('hex'));
      } else {
        this.logger.info(`macaroons are disabled for lnd at ${this.uri}`);
      }
      // set status as disconnected until we can verify the connection
      this.setStatus(ClientStatus.Disconnected);
    }
  }

  public get pubKey() {
    return this.identityPubKey;
  }

  private unaryCall = <T, U>(methodName: string, params: T): Promise<U> => {
    return new Promise((resolve, reject) => {
      if (this.isDisabled()) {
        reject(errors.LND_IS_DISABLED);
        return;
      }
      (this.lightning as LightningMethodIndex)[methodName](params, this.meta, (err: grpc.ServiceError, response: GrpcResponse) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.toObject());
        }
      });
    });
  }

  private unaryCallNative = <T, U>(methodName: string, params: T): Promise<U> => {
    return new Promise((resolve, reject) => {
      if (this.isDisabled()) {
        reject(errors.LND_IS_DISABLED);
        return;
      }
      (this.lightning as LightningMethodIndex)[methodName](params, this.meta, (err: grpc.ServiceError, response: U) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  public getLndInfo = async (): Promise<LndInfo> => {
    let channels: ChannelCount | undefined;
    let chains: string[] | undefined;
    let blockheight: number | undefined;
    let uris: string[] | undefined;
    let version: string | undefined;
    let error: string | undefined;
    let alias: string | undefined;
    if (this.isDisabled()) {
      error = errors.LND_IS_DISABLED.message;
    } else if (!this.isConnected()) {
      error = errors.LND_IS_DISCONNECTED.message;
    } else {
      try {
        const lnd = await this.getInfo();
        channels = {
          active: lnd.getNumActiveChannels(),
          pending: lnd.getNumPendingChannels(),
        };
        chains = lnd.getChainsList(),
        blockheight = lnd.getBlockHeight(),
        uris = lnd.getUrisList(),
        version = lnd.getVersion();
        alias = lnd.getAlias();
      } catch (err) {
        this.logger.error(`LND error: ${err}`);
        error = err.message;
      }
    }

    return {
      error,
      channels,
      chains,
      blockheight,
      uris,
      version,
      alias,
    };
  }

  /**
   * Verify that the lnd gRPC service can be reached by attempting a `getInfo` call.
   * If successful, subscribe to invoice events and store the lnd identity pubkey.
   * If not, set a timer to attempt to reach the service again in 5 seconds.
   */
  public verifyConnection = async () => {
    if (this.isDisabled()) {
      throw(errors.LND_IS_DISABLED);
    }
    if (this.isConnected()) {
      this.logger.warn(`not verifying connection to lnd, lnd is already connected`);
      return;
    }
    if (this.isDisconnected()) {
      this.logger.info(`trying to verify connection to lnd with uri: ${this.uri}`);
      this.lightning = new LightningClient(this.uri, this.credentials);

      try {
        const getInfoResponse = await this.getInfo();
        if (getInfoResponse) {
          // mark connection as active
          this.setStatus(ClientStatus.ConnectionVerified);
          this.subscribeInvoices();
          if (this.reconnectionTimer) {
            clearTimeout(this.reconnectionTimer);
            this.reconnectionTimer = undefined;
          }

          /** The new lnd pub key value if different from the one we had previously. */
          let newPubKey: string | undefined;
          if (this.identityPubKey !== getInfoResponse.getIdentityPubkey()) {
            newPubKey = getInfoResponse.getIdentityPubkey();
            this.identityPubKey = newPubKey;
          }
          this.emit('connectionVerified', newPubKey);
        }
      } catch (err) {
        this.setStatus(ClientStatus.Disconnected);
        this.logger.error(`could not verify connection to lnd at ${this.uri}, error: ${JSON.stringify(err)},
          retrying in ${LndClient.RECONNECT_TIMER} ms`);
        this.reconnectionTimer = setTimeout(this.verifyConnection, LndClient.RECONNECT_TIMER);
      }
    }
  }

  /**
   * Return general information concerning the lightning node including it’s identity pubkey, alias, the chains it
   * is connected to, and information concerning the number of open+pending channels.
   */
  public getInfo = (): Promise<lndrpc.GetInfoResponse> => {
    return this.unaryCallNative<lndrpc.GetInfoRequest, lndrpc.GetInfoResponse>('getInfo', new lndrpc.GetInfoRequest());
  }

  /**
   * Attempt to add a new invoice to the lnd invoice database.
   * @param value the value of this invoice in satoshis
   */
  public addInvoice = (value: number): Promise<lndrpc.AddInvoiceResponse.AsObject> => {
    const request = new lndrpc.Invoice();
    request.setValue(value);
    return this.unaryCall<lndrpc.Invoice, lndrpc.AddInvoiceResponse.AsObject>('addInvoice', request);
  }

  /**
   * Pay an invoice through the Lightning Network.
   * @param payment_request an invoice for a payment within the Lightning Network
   */
  public payInvoice = (paymentRequest: string): Promise<lndrpc.SendResponse.AsObject> => {
    const request = new lndrpc.SendRequest();
    request.setPaymentRequest(paymentRequest);
    return this.unaryCall<lndrpc.SendRequest, lndrpc.SendResponse.AsObject>('sendPaymentSync', request);
  }

  /**
   * Send a payment through the Lightning Network.
   * @param lndrpc.SendRequest (see lndrpc.proto)
   */
  public sendPaymentSync = (request: lndrpc.SendRequest): Promise<lndrpc.SendResponse> => {
    return this.unaryCallNative<lndrpc.SendRequest, lndrpc.SendResponse>('sendPaymentSync', request);
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
   * Return the total balance available across all channels.
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
   * List all routes to destination.
   */
  public queryRoutes = (request: lndrpc.QueryRoutesRequest): Promise<lndrpc.QueryRoutesResponse> => {
    return this.unaryCallNative<lndrpc.QueryRoutesRequest, lndrpc.QueryRoutesResponse>('queryRoutes', request);
  }

  /**
   * Send amount to destination using pre-defined routes.
   */
  public sendToRouteSync = (request: lndrpc.SendToRouteRequest): Promise<lndrpc.SendResponse> => {
    return this.unaryCallNative<lndrpc.SendToRouteRequest, lndrpc.SendResponse>('sendToRouteSync', request);
  }

  /**
   * Attempt to close an open channel.
   */
  public closeChannel = (fundingTxId: string, outputIndex: number, force: boolean): void => {
    if (this.isDisabled()) {
      throw(errors.LND_IS_DISABLED);
    }
    if (this.isDisconnected()) {
      throw(errors.LND_IS_DISCONNECTED);
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
    if (this.isDisconnected()) {
      throw(errors.LND_IS_DISCONNECTED);
    }
    this.invoiceSubscription = this.lightning.subscribeInvoices(new lndrpc.InvoiceSubscription(), this.meta)
      // TODO: handle invoice events
      .on('data', (message: string) => {
        this.logger.info(`invoice update: ${message}`);
      })
      .on('end', async () => {
        this.logger.info('invoice ended');
        this.setStatus(ClientStatus.Disconnected);
        await this.verifyConnection();
      })
      .on('status', (status: string) => {
        this.logger.debug(`invoice status: ${JSON.stringify(status)}`);
      })
      .on('error', async (error) => {
        this.logger.error(`invoice error: ${error}`);
        this.setStatus(ClientStatus.Disconnected);
        await this.verifyConnection();
      });
  }

  /** End all subscriptions and reconnection attempts. */
  public close = () => {
    if (this.reconnectionTimer) {
      clearTimeout(this.reconnectionTimer);
    }
    if (this.invoiceSubscription) {
      this.invoiceSubscription.cancel();
    }
  }
}

export default LndClient;
export { LndClientConfig, LndInfo };
