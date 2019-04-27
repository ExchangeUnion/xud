import grpc, { ChannelCredentials, ClientReadableStream } from 'grpc';
import Logger from '../Logger';
import BaseClient, { ClientStatus } from '../BaseClient';
import errors from './errors';
import { LightningClient } from '../proto/lndrpc_grpc_pb';
import * as lndrpc from '../proto/lndrpc_pb';
import assert from 'assert';
import { exists, readFile } from '../utils/fsUtils';
import { SwapState, SwapRole, SwapClient } from '../constants/enums';
import { SwapDeal } from '../swaps/types';

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

/** A class representing a client to interact with lnd. */
class LndClient extends BaseClient {
  public readonly type = SwapClient.Lnd;
  public readonly cltvDelta: number;
  private lightning!: LightningClient | LightningMethodIndex;
  private meta!: grpc.Metadata;
  private uri!: string;
  private credentials!: ChannelCredentials;
  private identityPubKey?: string;
  private invoiceSubscription?: ClientReadableStream<lndrpc.InvoiceSubscription>;

  /**
   * Creates an lnd client.
   * @param config the lnd configuration
   */
  constructor(private config: LndClientConfig, public currency: string, logger: Logger) {
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
      await this.setStatus(ClientStatus.Disabled);
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
      this.logger.info(`macaroons are disabled for lnd for ${this.currency}`);
    }
    await this.verifyConnection();
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

  protected verifyConnection = async () => {
    if (this.isDisabled()) {
      throw(errors.LND_IS_DISABLED);
    }
    if (!this.isConnected()) {
      this.logger.info(`trying to verify connection to lnd for ${this.currency} at ${this.uri}`);
      this.lightning = new LightningClient(this.uri, this.credentials);

      try {
        const getInfoResponse = await this.getInfo();
        if (getInfoResponse.getSyncedToChain()) {
          // mark connection as active
          await this.setStatus(ClientStatus.ConnectionVerified);

          /** The new lnd pub key value if different from the one we had previously. */
          let newPubKey: string | undefined;
          if (this.identityPubKey !== getInfoResponse.getIdentityPubkey()) {
            newPubKey = getInfoResponse.getIdentityPubkey();
            this.identityPubKey = newPubKey;
          }
          this.emit('connectionVerified', newPubKey);
          this.subscribeInvoices();
        } else {
          await this.setStatus(ClientStatus.OutOfSync);
          this.logger.warn(`lnd for ${this.currency} is out of sync with chain, retrying in ${LndClient.RECONNECT_TIMER} ms`);
        }
      } catch (err) {
        this.logger.error(`could not verify connection to lnd for ${this.currency} at ${this.uri}, error: ${JSON.stringify(err)},
          retrying in ${LndClient.RECONNECT_TIMER} ms`);
        await this.setStatus(ClientStatus.Disconnected);
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
   * Gets the preimage in hex format from an lnd SendResponse message.
   */
  private getPreimageFromSendResponse = (response: lndrpc.SendResponse) => {
    return Buffer.from(response.getPaymentPreimage_asB64(), 'base64').toString('hex');
  }

  public sendSmallestAmount = async (rHash: string, destination: string) => {
    const sendRequest = new lndrpc.SendRequest();
    sendRequest.setAmt(1);
    sendRequest.setDestString(destination);
    sendRequest.setPaymentHashString(rHash);
    let sendPaymentResponse: lndrpc.SendResponse;
    try {
      sendPaymentResponse = await this.sendPaymentSync(sendRequest);
    } catch (err) {
      this.logger.error(`got exception from sendPaymentSync`, err.message);
      throw err;
    }
    const paymentError = sendPaymentResponse.getPaymentError();
    if (paymentError) {
      throw new Error(paymentError);
    }
    return this.getPreimageFromSendResponse(sendPaymentResponse);
  }

  public sendPayment = async (deal: SwapDeal): Promise<string> => {
    assert(deal.state === SwapState.Active);

    if (deal.makerToTakerRoutes && deal.role === SwapRole.Maker) {
      const request = new lndrpc.SendToRouteRequest();
      request.setRoutesList(deal.makerToTakerRoutes as lndrpc.Route[]);
      request.setPaymentHashString(deal.rHash);

      try {
        const sendToRouteResponse = await this.sendToRouteSync(request);
        const sendPaymentError = sendToRouteResponse.getPaymentError();
        if (sendPaymentError) {
          this.logger.error(`sendToRouteSync failed with payment error: ${sendPaymentError}`);
          throw new Error(sendPaymentError);
        }

        return this.getPreimageFromSendResponse(sendToRouteResponse);
      } catch (err) {
        this.logger.error(`got exception from sendToRouteSync: ${JSON.stringify(request.toObject())}`, err);
        throw err;
      }
    } else if (deal.destination) {
      const request = new lndrpc.SendRequest();
      request.setDestString(deal.destination);
      request.setPaymentHashString(deal.rHash);

      if (deal.role === SwapRole.Taker) {
        // we are the taker paying the maker
        request.setFinalCltvDelta(deal.makerCltvDelta!);
        request.setAmt(deal.makerAmount);
      } else {
        // we are the maker paying the taker
        request.setFinalCltvDelta(deal.takerCltvDelta);
        request.setAmt(deal.takerAmount);
      }

      try {
        const sendPaymentResponse = await this.sendPaymentSync(request);
        const sendPaymentError = sendPaymentResponse.getPaymentError();
        if (sendPaymentError) {
          this.logger.error(`sendPaymentSync failed with payment error: ${sendPaymentError}`);
          throw new Error(sendPaymentError);
        }

        return this.getPreimageFromSendResponse(sendPaymentResponse);
      } catch (err) {
        this.logger.error(`got exception from sendPaymentSync: ${JSON.stringify(request.toObject())}`, err);
        throw err;
      }
    } else {
      assert.fail('swap deal must have a route or destination to send payment');
      return '';
    }
  }

  /**
   * Sends a payment through the Lightning Network.
   */
  private sendPaymentSync = (request: lndrpc.SendRequest): Promise<lndrpc.SendResponse> => {
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

  public getHeight = async () => {
    const info = await this.getInfo();
    return info.getBlockHeight();
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

  public getRoutes =  async (amount: number, destination: string): Promise<lndrpc.Route[]> => {
    const request = new lndrpc.QueryRoutesRequest();
    request.setAmt(amount);
    request.setFinalCltvDelta(this.cltvDelta);
    request.setNumRoutes(1);
    request.setPubKey(destination);
    try {
      const routes = (await this.queryRoutes(request)).getRoutesList();
      this.logger.debug(`got ${routes.length} route(s) to destination ${destination}: ${routes}`);
      return routes;
    } catch (err) {
      if (typeof err.message === 'string' && (
        err.message.includes('unable to find a path to destination') ||
        err.message.includes('target not found')
      )) {
        return [];
      } else {
        this.logger.error(`error calling queryRoutes for ${this.currency} to ${destination}: ${JSON.stringify(err)}`);
        throw err;
      }
    }
  }

  /**
   * Lists all routes to destination.
   */
  private queryRoutes = (request: lndrpc.QueryRoutesRequest): Promise<lndrpc.QueryRoutesResponse> => {
    return this.unaryCall<lndrpc.QueryRoutesRequest, lndrpc.QueryRoutesResponse>('queryRoutes', request);
  }

  /**
   * Sends amount to destination using pre-defined routes.
   */
  private sendToRouteSync = (request: lndrpc.SendToRouteRequest): Promise<lndrpc.SendResponse> => {
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
    .on('error', async (error) => {
      this.invoiceSubscription = undefined;
      this.logger.error(`lnd for ${this.currency} has been disconnected, error: ${error}`);
      await this.setStatus(ClientStatus.Disconnected);
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

  /** Lnd client specific cleanup. */
  protected closeSpecific = () => {
    if (this.invoiceSubscription) {
      this.invoiceSubscription.cancel();
    }
  }
}

export default LndClient;
export { LndClientConfig, LndInfo };
