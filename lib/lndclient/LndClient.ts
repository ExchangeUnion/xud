import grpc, { ChannelCredentials, ClientReadableStream } from 'grpc';
import Logger from '../Logger';
import SwapClient, { ClientStatus } from '../swaps/SwapClient';
import errors from './errors';
import { LightningClient, WalletUnlockerClient } from '../proto/lndrpc_grpc_pb';
import { InvoicesClient } from '../proto/lndinvoices_grpc_pb';
import * as lndrpc from '../proto/lndrpc_pb';
import * as lndinvoices from '../proto/lndinvoices_pb';
import assert from 'assert';
import { promises as fs } from 'fs';
import { SwapState, SwapRole, SwapClientType } from '../constants/enums';
import { SwapDeal } from '../swaps/types';
import { base64ToHex, hexToUint8Array } from '../utils/utils';
import { LndClientConfig, LndInfo, ChannelCount, Chain } from './types';

interface LightningMethodIndex extends LightningClient {
  [methodName: string]: Function;
}

interface WalletUnlockerMethodIndex extends WalletUnlockerClient {
  [methodName: string]: Function;
}

interface InvoicesMethodIndex extends InvoicesClient {
  [methodName: string]: Function;
}

interface LndClient {
  on(event: 'connectionVerified', listener: (newIdentifier?: string) => void): this;
  on(event: 'htlcAccepted', listener: (rHash: string, amount: number) => void): this;
  emit(event: 'connectionVerified', newIdentifier?: string): boolean;
  emit(event: 'htlcAccepted', rHash: string, amount: number): boolean;
}

/** A class representing a client to interact with lnd. */
class LndClient extends SwapClient {
  public readonly type = SwapClientType.Lnd;
  public readonly cltvDelta: number;
  private lightning?: LightningClient | LightningMethodIndex;
  private walletUnlocker?: WalletUnlockerClient | InvoicesMethodIndex;
  private invoices?: InvoicesClient | InvoicesMethodIndex;
  private meta!: grpc.Metadata;
  private uri!: string;
  private credentials!: ChannelCredentials;
  private identityPubKey?: string;
  private channelSubscription?: ClientReadableStream<lndrpc.ChannelEventUpdate>;
  private invoiceSubscriptions = new Map<string, ClientReadableStream<lndrpc.Invoice>>();

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
    assert(this.cltvDelta > 0, `lnd-${this.currency}: cltvdelta must be a positive number`);

    const { disable, certpath, macaroonpath, nomacaroons, host, port } = this.config;
    if (disable) {
      await this.setStatus(ClientStatus.Disabled);
      return;
    }

    try {
      const lndCert = await fs.readFile(certpath);
      this.credentials = grpc.credentials.createSsl(lndCert);
    } catch (err) {
      this.logger.error('could not load lnd certificate, is lnd installed?');
      await this.setStatus(ClientStatus.Disabled);
      return;
    }

    this.meta = new grpc.Metadata();
    if (!nomacaroons) {
      try {
        const adminMacaroon = await fs.readFile(macaroonpath);
        this.meta.add('macaroon', adminMacaroon.toString('hex'));
      } catch (err) {
        this.logger.error('could not load lnd macaroon, is lnd installed?');
        await this.setStatus(ClientStatus.Disabled);
        return;
      }
    } else {
      this.logger.info('macaroons are disabled for lnd');
    }

    this.uri = `${host}:${port}`;
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

  private unaryInvoiceCall = <T, U>(methodName: string, params: T): Promise<U> => {
    return new Promise((resolve, reject) => {
      if (this.isDisabled()) {
        reject(errors.LND_IS_DISABLED);
        return;
      }
      (this.invoices as InvoicesMethodIndex)[methodName](params, this.meta, (err: grpc.ServiceError, response: U) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  private unaryWalletUnlockerCall = <T, U>(methodName: string, params: T): Promise<U> => {
    return new Promise((resolve, reject) => {
      if (this.isDisabled()) {
        reject(errors.LND_IS_DISABLED);
        return;
      }
      (this.walletUnlocker as WalletUnlockerMethodIndex)[methodName](params, this.meta, (err: grpc.ServiceError, response: U) => {
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
    let chains: Chain[] | undefined;
    let blockheight: number | undefined;
    let uris: string[] | undefined;
    let version: string | undefined;
    let error: string | undefined;
    let alias: string | undefined;
    if (this.isDisabled()) {
      error = errors.LND_IS_DISABLED.message;
    } else if (!this.isConnected()) {
      error = errors.LND_IS_UNAVAILABLE(this.status).message;
    } else {
      try {
        const lnd = await this.getInfo();
        channels = {
          active: lnd.getNumActiveChannels(),
          pending: lnd.getNumPendingChannels(),
        };
        chains = lnd.getChainsList().map(value => value.toObject());
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
      this.logger.info(`trying to verify connection to lnd at ${this.uri}`);
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

          this.invoices = new InvoicesClient(this.uri, this.credentials);

          if (this.walletUnlocker) {
            // WalletUnlocker service is disabled when the main Lightning service is available
            this.walletUnlocker.close();
            this.walletUnlocker = undefined;
          }

          this.subscribeChannels();
        } else {
          await this.setStatus(ClientStatus.OutOfSync);
          this.logger.warn(`lnd is out of sync with chain, retrying in ${LndClient.RECONNECT_TIMER} ms`);
        }
      } catch (err) {
        if (err.code === grpc.status.UNIMPLEMENTED) {
          // if GetInfo is unimplemented, it means this lnd instance is online but locked
          this.walletUnlocker = new WalletUnlockerClient(this.uri, this.credentials);
          this.lightning.close();
          this.lightning = undefined;
          await this.setStatus(ClientStatus.WaitingUnlock);
        } else {
          this.logger.error(`could not verify connection to lnd at ${this.uri}, error: ${JSON.stringify(err)},
            retrying in ${LndClient.RECONNECT_TIMER} ms`);
          await this.disconnect();
        }
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

  public sendSmallestAmount = async (rHash: string, destination: string) => {
    const sendRequest = new lndrpc.SendRequest();
    sendRequest.setAmt(1);
    sendRequest.setDestString(destination);
    sendRequest.setPaymentHashString(rHash);
    sendRequest.setFinalCltvDelta(this.cltvDelta);
    let sendPaymentResponse: lndrpc.SendResponse;
    try {
      sendPaymentResponse = await this.sendPaymentSync(sendRequest);
    } catch (err) {
      this.logger.error('got exception from sendPaymentSync', err.message);
      throw err;
    }
    const paymentError = sendPaymentResponse.getPaymentError();
    if (paymentError) {
      throw new Error(paymentError);
    }
    return base64ToHex(sendPaymentResponse.getPaymentPreimage_asB64());
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

        return base64ToHex(sendToRouteResponse.getPaymentPreimage_asB64());
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
        this.logger.debug(`executing sendPaymentSync -
          destination: ${deal.destination}, rHash: ${deal.rHash}, amount: ${request.getAmt()}, FinalCltvDelta: ${request.getFinalCltvDelta()}`);
        const sendPaymentResponse = await this.sendPaymentSync(request);
        const sendPaymentError = sendPaymentResponse.getPaymentError();
        if (sendPaymentError) {
          this.logger.error(`sendPaymentSync failed with payment error: ${sendPaymentError}`);
          throw new Error(sendPaymentError);
        }

        return base64ToHex(sendPaymentResponse.getPaymentPreimage_asB64());
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
    this.logger.trace(`sending payment of ${request.getAmt()} for ${request.getPaymentHashString()}`);
    return this.unaryCall<lndrpc.SendRequest, lndrpc.SendResponse>('sendPaymentSync', request);
  }

  /**
   * Gets a new address for the internal lnd wallet.
   */
  public newAddress = (addressType: lndrpc.AddressType): Promise<lndrpc.NewAddressResponse> => {
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
      this.logger.debug(`got ${routes.length} route(s) to destination ${destination}: ${routes}, FinalCltvDelta: ${this.cltvDelta}`);
      return routes;
    } catch (err) {
      if (typeof err.message === 'string' && (
        err.message.includes('unable to find a path to destination') ||
        err.message.includes('target not found')
      )) {
        return [];
      } else {
        this.logger.error(`error calling queryRoutes to ${destination}, amount ${amount} FinalCltvDelta ${this.cltvDelta}: ${JSON.stringify(err)}`);
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

  public genSeed = async (): Promise<lndrpc.GenSeedResponse.AsObject> => {
    const genSeedResponse = await this.unaryWalletUnlockerCall<lndrpc.GenSeedRequest, lndrpc.GenSeedResponse>(
      'genSeed', new lndrpc.GenSeedRequest(),
    );
    return genSeedResponse.toObject();
  }

  public initWallet = async (walletPassword: string, seedMnemonic: string[]): Promise<lndrpc.InitWalletResponse.AsObject> => {
    const request = new lndrpc.InitWalletRequest();
    request.setCipherSeedMnemonicList(seedMnemonic);
    request.setWalletPassword(walletPassword);
    const initWalletResponse = await this.unaryWalletUnlockerCall<lndrpc.InitWalletRequest, lndrpc.InitWalletResponse>(
      'initWallet', new lndrpc.InitWalletRequest(),
    );
    this.logger.info('wallet initialized');
    return initWalletResponse.toObject();
  }

  public unlockWallet = async (walletPassword: string): Promise<lndrpc.UnlockWalletResponse.AsObject> => {
    const request = new lndrpc.UnlockWalletRequest();
    request.setWalletPassword(walletPassword);
    const unlockWalletResponse = await this.unaryWalletUnlockerCall<lndrpc.UnlockWalletRequest, lndrpc.UnlockWalletResponse>(
      'unlockWallet', new lndrpc.UnlockWalletRequest(),
    );
    this.logger.info('wallet unlocked');
    return unlockWalletResponse.toObject();
  }

  public addInvoice = async (rHash: string, amount: number) => {
    const addHoldInvoiceRequest = new lndinvoices.AddHoldInvoiceRequest();
    addHoldInvoiceRequest.setHash(hexToUint8Array(rHash));
    addHoldInvoiceRequest.setValue(amount);
    addHoldInvoiceRequest.setCltvExpiry(this.cltvDelta); // TODO: use peer's cltv delta
    await this.addHoldInvoice(addHoldInvoiceRequest);
    this.logger.debug(`added invoice of ${amount} for ${rHash} with CltvExpiry ${this.cltvDelta}`);
    this.subscribeSingleInvoice(rHash);
  }

  public settleInvoice = async (rHash: string, rPreimage: string) => {
    const invoiceSubscription = this.invoiceSubscriptions.get(rHash);
    if (invoiceSubscription) {
      const settleInvoiceRequest = new lndinvoices.SettleInvoiceMsg();
      settleInvoiceRequest.setPreimage(hexToUint8Array(rPreimage));
      await this.settleInvoiceLnd(settleInvoiceRequest);
      this.logger.debug(`settled invoice for ${rHash}`);
      invoiceSubscription.cancel();
    }
  }

  public removeInvoice = async (rHash: string) => {
    const invoiceSubscription = this.invoiceSubscriptions.get(rHash);
    if (invoiceSubscription) {
      const cancelInvoiceRequest = new lndinvoices.CancelInvoiceMsg();
      cancelInvoiceRequest.setPaymentHash(hexToUint8Array(rHash));
      await this.cancelInvoice(cancelInvoiceRequest);
      this.logger.debug(`canceled invoice for ${rHash}`);
      invoiceSubscription.cancel();
    }
  }

  private addHoldInvoice = (request: lndinvoices.AddHoldInvoiceRequest): Promise<lndinvoices.AddHoldInvoiceResp> => {
    return this.unaryInvoiceCall<lndinvoices.AddHoldInvoiceRequest, lndinvoices.AddHoldInvoiceResp>('addHoldInvoice', request);
  }

  private cancelInvoice = (request: lndinvoices.CancelInvoiceMsg): Promise<lndinvoices.CancelInvoiceResp> => {
    return this.unaryInvoiceCall<lndinvoices.CancelInvoiceMsg, lndinvoices.CancelInvoiceResp>('cancelInvoice', request);
  }

  private settleInvoiceLnd = (request: lndinvoices.SettleInvoiceMsg): Promise<lndinvoices.SettleInvoiceResp> => {
    return this.unaryInvoiceCall<lndinvoices.SettleInvoiceMsg, lndinvoices.SettleInvoiceResp>('settleInvoice', request);
  }

  private subscribeSingleInvoice = (rHash: string) => {
    if (!this.invoices) {
      throw errors.LND_IS_UNAVAILABLE(this.status);
    }
    const paymentHash = new lndrpc.PaymentHash();
    // TODO: use RHashStr when bug fixed in lnd - https://github.com/lightningnetwork/lnd/pull/3019
    paymentHash.setRHash(hexToUint8Array(rHash));
    const invoiceSubscription = this.invoices.subscribeSingleInvoice(paymentHash, this.meta);
    const deleteInvoiceSubscription = () => {
      invoiceSubscription.removeAllListeners();
      this.invoiceSubscriptions.delete(rHash);
      this.logger.debug(`deleted invoice subscription for ${rHash}`);
    };
    invoiceSubscription.on('data', (invoice: lndrpc.Invoice) => {
      if (invoice.getState() === lndrpc.Invoice.InvoiceState.ACCEPTED) {
        // we have accepted an htlc for this invoice
        this.emit('htlcAccepted', rHash, invoice.getValue());
      }
    }).on('end', deleteInvoiceSubscription).on('error', deleteInvoiceSubscription);
    this.invoiceSubscriptions.set(rHash, invoiceSubscription);
  }

  /**
   * Subscribes to channel events.
   */
  private subscribeChannels = (): void => {
    if (!this.lightning) {
      throw errors.LND_IS_UNAVAILABLE(this.status);
    }
    if (this.channelSubscription) {
      this.channelSubscription.cancel();
    }

    this.channelSubscription = this.lightning.subscribeChannelEvents(new lndrpc.ChannelEventSubscription(), this.meta)
    .on('error', async (error) => {
      this.channelSubscription = undefined;
      this.logger.error(`lnd has been disconnected, error: ${error}`);
      await this.disconnect();
    });
  }

  /**
   * Attempts to close an open channel.
   */
  public closeChannel = (fundingTxId: string, outputIndex: number, force: boolean): void => {
    if (!this.lightning) {
      throw(errors.LND_IS_UNAVAILABLE(this.status));
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

  /** Lnd specific procedure to disconnect from the server. */
  protected disconnect = async () => {
    if (this.channelSubscription) {
      this.channelSubscription.cancel();
      this.channelSubscription = undefined;
    }
    if (this.lightning) {
      this.lightning.close();
      this.lightning = undefined;
    }
    if (this.invoices) {
      this.invoices.close();
      this.invoices = undefined;
    }
    await this.setStatus(ClientStatus.Disconnected);
  }
}

export default LndClient;
