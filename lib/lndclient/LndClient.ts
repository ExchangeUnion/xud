import grpc, { ChannelCredentials, ClientReadableStream } from 'grpc';
import Logger from '../Logger';
import BaseClient, { ClientStatus } from '../BaseClient';
import errors from './errors';
import { LightningClient } from '../proto/lndrpc_grpc_pb';
import * as lndrpc from '../proto/lndrpc_pb';
import assert from 'assert';
import { exists, readFile } from '../utils/fsUtils';

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

interface LightningMethodIndex extends LightningClient {
  [methodName: string]: Function;
}

interface LndClient {
  on(event: 'connectionVerified', listener: (newPubKey?: string) => void): this;
  emit(event: 'connectionVerified', newPubKey?: string): boolean;
}

/** A class representing a client to interact with lnd. */
class LndClient extends BaseClient {
  public readonly cltvDelta: number;
  private lightning!: LightningClient | LightningMethodIndex;
  private meta!: grpc.Metadata;
  private uri!: string;
  private credentials!: ChannelCredentials;
  private identityPubKey?: string;
  private invoiceSubscription?: ClientReadableStream<lndrpc.InvoiceSubscription>;

  /** Time in milliseconds between attempts to recheck if lnd's backend chain is in sync. */
  private static readonly RECHECK_SYNC_TIMER = 30000;

  /**
   * Creates an lnd client.
   * @param config the lnd configuration
   */
  constructor(private config: LndClientConfig, logger: Logger) {
    super(logger);

    this.cltvDelta = config.cltvdelta || 0;
  }

  /** Initializes the client for calls to lnd and verifies that we can connect to it.  */
  public init = async () => {
    const { disable, certpath, macaroonpath, nomacaroons, host, port } = this.config;
    let shouldDisable = disable;

    if (!(await exists(certpath))) {
      this.logger.error('could not find lnd certificate, is lnd installed?');
      shouldDisable = true;
    }
    if (!nomacaroons && !(await exists(macaroonpath))) {
      this.logger.error('could not find lnd macaroon, is lnd installed?');
      shouldDisable = true;
    }
    if (shouldDisable) {
      return;
    }

    assert(this.cltvDelta > 0, 'cltvdelta must be a positive number');
    this.uri = `${host}:${port}`;
    const lndCert = await readFile(certpath);
    this.credentials = grpc.credentials.createSsl(lndCert);

    this.meta = new grpc.Metadata();
    if (!nomacaroons) {
      const adminMacaroon = await readFile(macaroonpath);
      this.meta.add('macaroon', adminMacaroon.toString('hex'));
    } else {
      this.logger.info(`macaroons are disabled for lnd at ${this.uri}`);
    }
    // set status as disconnected until we can verify the connection
    this.setStatus(ClientStatus.Disconnected);
    return this.verifyConnection();
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
      error = errors.LND_IS_UNAVAILABLE.message;
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
   * Verifies that the lnd gRPC service can be reached by attempting a `getInfo` call.
   * If successful, subscribe to invoice events and store the lnd identity pubkey.
   * If not, set a timer to attempt to reach the service again in 5 seconds.
   */
  public verifyConnection = async () => {
    if (this.isDisabled()) {
      throw(errors.LND_IS_DISABLED);
    }
    if (!this.isConnected()) {
      this.logger.info(`trying to verify connection to lnd with uri: ${this.uri}`);
      this.lightning = new LightningClient(this.uri, this.credentials);

      try {
        const getInfoResponse = await this.getInfo();
        if (getInfoResponse.getSyncedToChain()) {
          // mark connection as active
          this.setStatus(ClientStatus.ConnectionVerified);
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
          this.subscribeInvoices();
        } else {
          this.setStatus(ClientStatus.OutOfSync);
          this.logger.error(`lnd at ${this.uri} is out of sync with chain, retrying in ${LndClient.RECONNECT_TIMER} ms`);
          this.reconnectionTimer = setTimeout(this.verifyConnection, LndClient.RECHECK_SYNC_TIMER);
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
   * Returns general information concerning the lightning node including it’s identity pubkey, alias, the chains it
   * is connected to, and information concerning the number of open+pending channels.
   */
  public getInfo = (): Promise<lndrpc.GetInfoResponse> => {
    return this.unaryCall<lndrpc.GetInfoRequest, lndrpc.GetInfoResponse>('getInfo', new lndrpc.GetInfoRequest());
  }

  /**
   * Sends a payment through the Lightning Network.
   */
  public sendPaymentSync = (request: lndrpc.SendRequest): Promise<lndrpc.SendResponse> => {
    return this.unaryCall<lndrpc.SendRequest, lndrpc.SendResponse>('sendPaymentSync', request);
  }

  /**
   * Gets a new address for the internal lnd wallet.
   */
  public newAddress = (addressType: lndrpc.NewAddressRequest.AddressType): Promise<lndrpc.NewAddressResponse> => {
    const request = new lndrpc.NewAddressRequest();
    request.setType(addressType);
    return this.unaryCall<lndrpc.NewAddressRequest, lndrpc.NewAddressResponse>('newAddress', request);
  }

  /**
   * Returns the total of unspent outputs for the internal lnd wallet.
   */
  public walletBalance = (): Promise<lndrpc.WalletBalanceResponse> => {
    return this.unaryCall<lndrpc.WalletBalanceRequest, lndrpc.WalletBalanceResponse>('walletBalance', new lndrpc.WalletBalanceRequest());
  }

  /**
   * Returns the total balance available across all channels.
   */
  public channelBalance = async (): Promise<lndrpc.ChannelBalanceResponse.AsObject> => {
    const channelBalanceResponse = await this.unaryCall<lndrpc.ChannelBalanceRequest, lndrpc.ChannelBalanceResponse>(
      'channelBalance', new lndrpc.ChannelBalanceRequest(),
    );
    return channelBalanceResponse.toObject();
  }

  /**
   * Connects to another lnd node.
   */
  public connectPeer = (pubkey: string, host: string, port: number): Promise<lndrpc.ConnectPeerResponse> => {
    const request = new lndrpc.ConnectPeerRequest();
    const address = new lndrpc.LightningAddress();
    address.setHost(`${host}:${port}`);
    address.setPubkey(pubkey);
    request.setAddr(address);
    return this.unaryCall<lndrpc.ConnectPeerRequest, lndrpc.ConnectPeerResponse>('connectPeer', request);
  }

  /**
   * Opens a channel with a connected lnd node.
   */
  public openChannel = (node_pubkey_string: string, local_funding_amount: number): Promise<lndrpc.ChannelPoint> => {
    const request = new lndrpc.OpenChannelRequest;
    request.setNodePubkeyString(node_pubkey_string);
    request.setLocalFundingAmount(local_funding_amount);
    return this.unaryCall<lndrpc.OpenChannelRequest, lndrpc.ChannelPoint>('openChannelSync', request);
  }

  /**
   * Lists all open channels for this node.
   */
  public listChannels = (): Promise<lndrpc.ListChannelsResponse> => {
    return this.unaryCall<lndrpc.ListChannelsRequest, lndrpc.ListChannelsResponse>('listChannels', new lndrpc.ListChannelsRequest());
  }

  /**
   * Lists all routes to destination.
   */
  public queryRoutes = (request: lndrpc.QueryRoutesRequest): Promise<lndrpc.QueryRoutesResponse> => {
    return this.unaryCall<lndrpc.QueryRoutesRequest, lndrpc.QueryRoutesResponse>('queryRoutes', request);
  }

  /**
   * Sends amount to destination using pre-defined routes.
   */
  public sendToRouteSync = (request: lndrpc.SendToRouteRequest): Promise<lndrpc.SendResponse> => {
    return this.unaryCall<lndrpc.SendToRouteRequest, lndrpc.SendResponse>('sendToRouteSync', request);
  }

  /**
   * Subscribes to invoices.
   */
  private subscribeInvoices = (): void => {
    if (this.invoiceSubscription) {
      this.invoiceSubscription.cancel();
    }

    this.invoiceSubscription = this.lightning.subscribeInvoices(new lndrpc.InvoiceSubscription(), this.meta)
    .on('error', (error) => {
      this.invoiceSubscription = undefined;
      this.setStatus(ClientStatus.Disconnected);
      this.logger.error(`lnd has been disconnected at ${this.uri}, error: ${error}`);
      this.reconnectionTimer = setTimeout(this.verifyConnection, LndClient.RECONNECT_TIMER);
    });
  }

  /**
   * Attempts to close an open channel.
   */
  public closeChannel = (fundingTxId: string, outputIndex: number, force: boolean): void => {
    if (this.isDisabled()) {
      throw(errors.LND_IS_DISABLED);
    }
    if (this.isDisconnected()) {
      throw(errors.LND_IS_UNAVAILABLE);
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

  /** Ends all subscriptions and reconnection attempts. */
  public close = () => {
    if (this.invoiceSubscription) {
      this.invoiceSubscription.cancel();
    }

    if (this.reconnectionTimer) {
      clearTimeout(this.reconnectionTimer);
    }
  }
}

export default LndClient;
export { LndClientConfig, LndInfo };
