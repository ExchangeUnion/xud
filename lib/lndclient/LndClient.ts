import grpc, { ChannelCredentials, ClientReadableStream } from 'grpc';
import Logger from '../Logger';
import SwapClient, { ClientStatus, SwapClientInfo, PaymentState } from '../swaps/SwapClient';
import errors from './errors';
import { errors as swapErrors } from '../swaps/errors';
import { LightningClient, WalletUnlockerClient } from '../proto/lndrpc_grpc_pb';
import { InvoicesClient } from '../proto/lndinvoices_grpc_pb';
import * as lndrpc from '../proto/lndrpc_pb';
import * as lndinvoices from '../proto/lndinvoices_pb';
import assert from 'assert';
import { promises as fs, watch } from 'fs';
import { SwapState, SwapRole, SwapClientType } from '../constants/enums';
import { SwapDeal } from '../swaps/types';
import { base64ToHex, hexToUint8Array } from '../utils/utils';
import { LndClientConfig, LndInfo, ChannelCount, Chain, ClientMethods } from './types';
import path from 'path';

interface LndClient {
  on(event: 'connectionVerified', listener: (swapClientInfo: SwapClientInfo) => void): this;
  on(event: 'htlcAccepted', listener: (rHash: string, amount: number) => void): this;
  on(event: 'locked', listener: () => void): this;
  emit(event: 'connectionVerified', swapClientInfo: SwapClientInfo): boolean;
  emit(event: 'htlcAccepted', rHash: string, amount: number): boolean;
  emit(event: 'locked'): boolean;
}

const MAXFEE = 0.03;

/** A class representing a client to interact with lnd. */
class LndClient extends SwapClient {
  public readonly type = SwapClientType.Lnd;
  public readonly finalLock: number;
  public config: LndClientConfig;
  public currency: string;
  private lightning?: LightningClient;
  private walletUnlocker?: WalletUnlockerClient;
  private invoices?: InvoicesClient;
  private macaroonpath?: string;
  private meta = new grpc.Metadata();
  private uri!: string;
  private credentials!: ChannelCredentials;
  /** The identity pub key for this lnd instance. */
  private identityPubKey?: string;
  /** List of client's public listening uris that are advertised to the network */
  private urisList?: string[];
  /** The identifier for the chain this lnd instance is using in the format [chain]-[network] like "bitcoin-testnet" */
  private chainIdentifier?: string;
  private invoiceSubscriptions = new Map<string, ClientReadableStream<lndrpc.Invoice>>();
  private maximumOutboundAmount = 0;
  private initWalletResolve?: (value: boolean) => void;
  private watchMacaroonResolve?: (value: boolean) => void;

  private static MINUTES_PER_BLOCK_BY_CURRENCY: { [key: string]: number } = {
    BTC: 10,
    LTC: 2.5,
  };

  /**
   * Creates an lnd client.
   */
  constructor(
    { config, logger, currency }:
    { config: LndClientConfig, logger: Logger, currency: string },
  ) {
    super(logger);
    this.config = config;
    this.currency = currency;
    this.finalLock = config.cltvdelta;
  }

  private static waitForClientReady = (client: grpc.Client) => {
    return new Promise((resolve, reject) => {
      client.waitForReady(Number.POSITIVE_INFINITY, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public get minutesPerBlock() {
    return LndClient.MINUTES_PER_BLOCK_BY_CURRENCY[this.currency];
  }

  /**
   * Initializes the client for calls to lnd and verifies that we can connect to it.
   * @param awaitingCreate whether xud is waiting for its node key to be created
   */
  public init = async (awaitingCreate = false) => {
    const { disable, certpath, macaroonpath, nomacaroons, host, port } = this.config;
    if (disable) {
      await this.setStatus(ClientStatus.Disabled);
      return;
    }

    try {
      const lndCert = await fs.readFile(certpath);
      this.credentials = grpc.credentials.createSsl(lndCert);
      this.logger.debug(`loaded tls cert from ${certpath}`);
    } catch (err) {
      this.logger.error(`could not load tls cert from ${certpath}, is lnd installed?`);
      await this.setStatus(ClientStatus.Disabled);
      return;
    }

    if (!nomacaroons) {
      this.macaroonpath = macaroonpath;
      try {
        await this.loadMacaroon();
      } catch (err) {
        if (!awaitingCreate) {
          // unless we are waiting for the xud nodekey and lnd wallet to be created
          // we expect the macaroon to exist and disable this client otherwise
          this.logger.error(`expected macaroon not found at ${macaroonpath}`);
          await this.setStatus(ClientStatus.Disabled);
          return;
        }
      }
    } else {
      this.logger.info('macaroons are disabled');
    }

    this.uri = `${host}:${port}`;
    await this.verifyConnectionWithTimeout();
  }

  public get pubKey() {
    return this.identityPubKey;
  }

  public get uris() {
    return this.urisList;
  }

  public get chain() {
    return this.chainIdentifier;
  }

  public maximumOutboundCapacity = () => {
    return this.maximumOutboundAmount;
  }

  protected updateCapacity = async () => {
    await this.channelBalance().catch(err => this.logger.error('failed to update maximum outbound capacity', err));
  }

  private unaryCall = <T, U>(methodName: Exclude<keyof LightningClient, ClientMethods>, params: T): Promise<U> => {
    return new Promise((resolve, reject) => {
      if (this.isDisabled()) {
        reject(errors.LND_IS_DISABLED);
        return;
      }
      (this.lightning![methodName] as Function)(params, this.meta, (err: grpc.ServiceError, response: U) => {
        if (err) {
          if (err.code === grpc.status.UNAVAILABLE) {
            this.disconnect().catch(this.logger.error);
          }
          this.logger.trace(`error on ${methodName}: ${err.message}`);
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  private loadMacaroon = async () => {
    if (this.macaroonpath) {
      const adminMacaroon = await fs.readFile(this.macaroonpath);
      this.meta.add('macaroon', adminMacaroon.toString('hex'));
      this.logger.debug(`loaded macaroon from ${this.macaroonpath}`);
    }
  }

  private unaryInvoiceCall = <T, U>(methodName: Exclude<keyof InvoicesClient, ClientMethods>, params: T): Promise<U> => {
    return new Promise((resolve, reject) => {
      if (this.isDisabled()) {
        reject(errors.LND_IS_DISABLED);
        return;
      }
      (this.invoices![methodName] as Function)(params, this.meta, (err: grpc.ServiceError, response: U) => {
        if (err) {
          if (err.code === grpc.status.UNAVAILABLE) {
            this.disconnect().catch(this.logger.error);
          }
          this.logger.trace(`error on ${methodName}: ${err.message}`);
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  private unaryWalletUnlockerCall = <T, U>(methodName: Exclude<keyof WalletUnlockerClient, ClientMethods>, params: T): Promise<U> => {
    return new Promise((resolve, reject) => {
      if (this.isDisabled()) {
        reject(errors.LND_IS_DISABLED);
        return;
      }
      (this.walletUnlocker![methodName] as Function)(params, this.meta, (err: grpc.ServiceError, response: U) => {
        if (err) {
          this.logger.trace(`error on ${methodName}: ${err.message}`);
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
        this.logger.error('getinfo error', err);
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
   * Waits for the lnd wallet to be initialized and for its macaroons to be created then attempts
   * to verify the connection to lnd.
   */
  private awaitWalletInit = async () => {
    // we are waiting for lnd to be initialized by xud and for the lnd macaroons to be created
    this.logger.info('waiting for wallet to be initialized...');

    const isWalletInitialized = await new Promise<boolean>((resolve) => {
      this.initWalletResolve = resolve;
    });

    if (isWalletInitialized) {
      if (this.walletUnlocker) {
        this.walletUnlocker.close();
        this.walletUnlocker = undefined;
      }

      // admin.macaroon will not necessarily be created by the time lnd responds to a successful
      // InitWallet call, so we watch the folder that we expect it to be in for it to be created
      const watchMacaroonPromise = new Promise<boolean>((resolve) => {
        this.watchMacaroonResolve = resolve;
      });
      const macaroonDir = path.join(this.macaroonpath!, '..');
      const fsWatcher = watch(macaroonDir, (_, filename) => {
        if (filename === 'admin.macaroon') {
          this.logger.debug('admin.macaroon was created');
          if (this.watchMacaroonResolve) {
            this.watchMacaroonResolve(true);
          }
        }
      });
      this.logger.debug(`watching ${macaroonDir} for admin.macaroon to be created`);
      const macaroonCreated = await watchMacaroonPromise;
      fsWatcher.close();
      this.watchMacaroonResolve = undefined;

      if (macaroonCreated) {
        try {
          await this.loadMacaroon();

          // once we've loaded the macaroon we can attempt to verify the conneciton
          this.verifyConnection().catch(this.logger.error);
        } catch (err) {
          this.logger.error(`could not load macaroon from ${this.macaroonpath}`);
          await this.setStatus(ClientStatus.Disabled);
        }
      }
    }
  }

  protected verifyConnection = async () => {
    if (this.isDisabled()) {
      throw(errors.LND_IS_DISABLED);
    }

    if (this.macaroonpath && this.meta.get('macaroon').length === 0) {
      // we have not loaded the macaroon yet - it is not created until the lnd wallet is initialized
      if (!this.isWaitingUnlock()) { // check that we are not already waiting for wallet init & unlock
        this.walletUnlocker = new WalletUnlockerClient(this.uri, this.credentials);
        await LndClient.waitForClientReady(this.walletUnlocker);
        await this.setStatus(ClientStatus.WaitingUnlock);

        if (this.reconnectionTimer) {
          // we don't need scheduled attempts to retry the connection while waiting on the wallet
          clearTimeout(this.reconnectionTimer);
          this.reconnectionTimer = undefined;
        }

        this.awaitWalletInit().catch(this.logger.error);
      }
      return;
    }

    if (!this.isConnected()) {
      this.logger.info(`trying to verify connection to lnd at ${this.uri}`);
      this.lightning = new LightningClient(this.uri, this.credentials);

      try {
        await LndClient.waitForClientReady(this.lightning);

        const getInfoResponse = await this.getInfo();
        if (getInfoResponse.getSyncedToChain()) {
          // mark connection as active
          await this.setStatus(ClientStatus.ConnectionVerified);

          /** The new lnd pub key value if different from the one we had previously. */
          let newPubKey: string | undefined;
          let newUris: string[] = [];
          if (this.identityPubKey !== getInfoResponse.getIdentityPubkey()) {
            newPubKey = getInfoResponse.getIdentityPubkey();
            this.logger.debug(`pubkey is ${newPubKey}`);
            this.identityPubKey = newPubKey;
            newUris = getInfoResponse.getUrisList();
            if (newUris.length) {
              this.logger.debug(`uris are ${newUris}`);
            } else {
              this.logger.debug('no uris advertised');
            }
            this.urisList = newUris;
          }
          const chain = getInfoResponse.getChainsList()[0];
          const chainIdentifier = `${chain.getChain()}-${chain.getNetwork()}`;
          if (!this.chainIdentifier) {
            this.chainIdentifier = chainIdentifier;
            this.logger.debug(`chain is ${chainIdentifier}`);
          } else if (this.chainIdentifier !== chainIdentifier) {
            // we switched chains for this lnd client while xud was running which is not supported
            this.logger.error(`chain switched from ${this.chainIdentifier} to ${chainIdentifier}`);
            await this.setStatus(ClientStatus.Disabled);
          }
          this.emit('connectionVerified', {
            newUris,
            newIdentifier: newPubKey,
          });

          this.invoices = new InvoicesClient(this.uri, this.credentials);

          if (this.walletUnlocker) {
            // WalletUnlocker service is disabled when the main Lightning service is available
            this.walletUnlocker.close();
            this.walletUnlocker = undefined;
          }
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

          if (!this.isWaitingUnlock()) {
            await this.setStatus(ClientStatus.WaitingUnlock);
            this.emit('locked');
          }
        } else {
          const errStr = typeof(err) === 'string' ? err : JSON.stringify(err);
          this.logger.error(`could not verify connection at ${this.uri}, error: ${errStr}, retrying in ${LndClient.RECONNECT_TIMER} ms`);
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

  public sendSmallestAmount = async (rHash: string, destination: string): Promise<string> => {
    const request = this.buildSendRequest({
      rHash,
      destination,
      amount: 1,
      // In case of sanity swaps we don't know the
      // takerCltvDelta or the makerCltvDelta. Using our
      // client's default.
      finalCltvDelta: this.finalLock,
    });
    const preimage = await this.executeSendRequest(request);
    return preimage;
  }

  public sendPayment = async (deal: SwapDeal): Promise<string> => {
    assert(deal.state === SwapState.Active);
    let request: lndrpc.SendRequest;
    assert(deal.makerCltvDelta, 'swap deal must have a makerCltvDelta');
    if (deal.role === SwapRole.Taker) {
      // we are the taker paying the maker
      assert(deal.destination, 'swap deal as taker must have a destination');
      request = this.buildSendRequest({
        rHash: deal.rHash,
        destination: deal.destination!,
        amount: deal.makerAmount,
        // Using the agreed upon makerCltvDelta. Maker won't accept
        // our payment if we provide a smaller value.
        finalCltvDelta: deal.makerCltvDelta!,
      });
    } else {
      // we are the maker paying the taker
      assert(deal.takerPubKey, 'swap deal as maker must have a takerPubKey');
      assert(deal.takerCltvDelta, 'swap deal as maker must have a takerCltvDelta');
      request = this.buildSendRequest({
        rHash: deal.rHash,
        destination: deal.takerPubKey!,
        amount: deal.takerAmount,
        finalCltvDelta: deal.takerCltvDelta,
        // Enforcing the maximum duration/length of the payment by
        // specifying the cltvLimit.
        // TODO: investigate why we need to add 3 blocks - if not lnd says route not found
        cltvLimit: deal.takerMaxTimeLock! + 3,
      });
    }
    const preimage = await this.executeSendRequest(request);
    return preimage;
  }

  /**
   * Sends a payment through the Lightning Network.
   */
  private sendPaymentSync = (request: lndrpc.SendRequest): Promise<lndrpc.SendResponse> => {
    this.logger.trace(`sending payment of ${request.getAmt()} for ${request.getPaymentHashString()}`);
    return this.unaryCall<lndrpc.SendRequest, lndrpc.SendResponse>('sendPaymentSync', request);
  }

  /**
   * Builds a lndrpc.SendRequest
   */
  private buildSendRequest = (
    { rHash, destination, amount, finalCltvDelta, cltvLimit }:
    { rHash: string, destination: string, amount: number, finalCltvDelta: number, cltvLimit?: number },
  ): lndrpc.SendRequest => {
    const request = new lndrpc.SendRequest();
    request.setPaymentHashString(rHash);
    request.setDestString(destination);
    request.setAmt(amount);
    request.setFinalCltvDelta(finalCltvDelta);
    const fee = new lndrpc.FeeLimit();
    fee.setFixed(Math.floor(MAXFEE * request.getAmt()));
    request.setFeeLimit(fee);
    if (cltvLimit) {
      // cltvLimit is used to enforce the maximum
      // duration/length of the payment.
      request.setCltvLimit(cltvLimit);
    }
    return request;
  }

  /**
   * Executes the provided lndrpc.SendRequest
   */
  private executeSendRequest = async (
    request: lndrpc.SendRequest,
  ): Promise<string> => {
    this.logger.trace(`sending payment with ${JSON.stringify(request.toObject())}`);
    let sendPaymentResponse: lndrpc.SendResponse;
    try {
      sendPaymentResponse = await this.sendPaymentSync(request);
    } catch (err) {
      this.logger.error('got exception from sendPaymentSync', err);
      throw swapErrors.PAYMENT_ERROR(err.message);
    }
    const paymentError = sendPaymentResponse.getPaymentError();
    if (paymentError) {
      if (paymentError.includes('UnknownPaymentHash') || paymentError.includes('IncorrectOrUnknownPaymentDetails')) {
        throw swapErrors.PAYMENT_REJECTED;
      } else {
        throw swapErrors.PAYMENT_ERROR(paymentError);
      }
    }
    return base64ToHex(sendPaymentResponse.getPaymentPreimage_asB64());
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
  public walletBalance = async (): Promise<lndrpc.WalletBalanceResponse.AsObject> => {
    const walletBalanceResponse = await this.unaryCall<lndrpc.WalletBalanceRequest, lndrpc.WalletBalanceResponse>(
      'walletBalance', new lndrpc.WalletBalanceRequest(),
    );
    return walletBalanceResponse.toObject();
  }

  public channelBalance = async (): Promise<lndrpc.ChannelBalanceResponse.AsObject> => {
    const channelBalanceResponse = await this.unaryCall<lndrpc.ChannelBalanceRequest, lndrpc.ChannelBalanceResponse>(
      'channelBalance', new lndrpc.ChannelBalanceRequest(),
    );
    if (this.maximumOutboundAmount !== channelBalanceResponse.getBalance()) {
      this.maximumOutboundAmount = channelBalanceResponse.getBalance();
      this.logger.debug(`new outbound capacity: ${this.maximumOutboundAmount}`);
    }
    return channelBalanceResponse.toObject();
  }

  public getHeight = async () => {
    const info = await this.getInfo();
    return info.getBlockHeight();
  }

  /**
   * Connects to another lnd node.
   */
  public connectPeer = (pubkey: string, address: string): Promise<lndrpc.ConnectPeerResponse> => {
    const request = new lndrpc.ConnectPeerRequest();
    const lightningAddress = new lndrpc.LightningAddress();
    lightningAddress.setHost(address);
    lightningAddress.setPubkey(pubkey);
    request.setAddr(lightningAddress);
    return this.unaryCall<lndrpc.ConnectPeerRequest, lndrpc.ConnectPeerResponse>('connectPeer', request);
  }

  /**
   * Opens a channel given peerPubKey and amount.
   */
  public openChannel = async (
    { peerIdentifier: peerPubKey, units, lndUris }:
    { peerIdentifier: string, units: number, lndUris: string[] },
  ): Promise<void> => {
    const connectionEstablished = await this.connectPeerAddreses(lndUris);
    if (connectionEstablished) {
      await this.openChannelSync(peerPubKey, units);
    } else {
      throw new Error('connectPeerAddreses failed');
    }
  }

  /**
   * Tries to connect to a given list of peer's node addresses
   * in a sequential order.
   * Returns true when successful, otherwise false.
   */
  private connectPeerAddreses = async (
    peerListeningUris: string[],
  ): Promise<boolean> => {
    const splitListeningUris = peerListeningUris
      .map((uri) => {
        const splitUri = uri.split('@');
        return {
          peerPubKey: splitUri[0],
          address: splitUri[1],
        };
      });
    const CONNECT_TIMEOUT = 4000;
    for (const uri of splitListeningUris) {
      const { peerPubKey, address } = uri;
      let timeout;
      try {
        timeout = setTimeout(() => {
          throw new Error('connectPeer has timed out');
        }, CONNECT_TIMEOUT);
        await this.connectPeer(peerPubKey, address);
        return true;
      } catch (e) {
        if (e.message && e.message.includes('already connected')) {
          return true;
        }
        this.logger.trace(`connectPeer failed: ${e}`);
      } finally {
        timeout && clearTimeout(timeout);
      }
    }
    return false;
  }

  /**
   * Opens a channel with a connected lnd node.
   */
  private openChannelSync = (node_pubkey_string: string, local_funding_amount: number): Promise<lndrpc.ChannelPoint> => {
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

  public getRoute = async (units: number, destination: string, _currency: string, finalLock = this.finalLock) => {
    const request = new lndrpc.QueryRoutesRequest();
    request.setAmt(units);
    request.setFinalCltvDelta(finalLock);
    request.setPubKey(destination);
    const fee = new lndrpc.FeeLimit();
    fee.setFixed(Math.floor(MAXFEE * request.getAmt()));
    request.setFeeLimit(fee);

    let route: lndrpc.Route | undefined;

    try {
      // QueryRoutes no longer returns more than one route
      route = (await this.queryRoutes(request)).getRoutesList()[0];
    } catch (err) {
      if (typeof err.message !== 'string' || (
        !err.message.includes('unable to find a path to destination') &&
        !err.message.includes('target not found')
      )) {
        this.logger.error(`error calling queryRoutes to ${destination}, amount ${units}, finalCltvDelta ${finalLock}`, err);
        throw err;
      }
    }

    if (route) {
      this.logger.debug(`found a route to ${destination} for ${units} units with finalCltvDelta ${finalLock}: ${route}`);
    } else {
      this.logger.debug(`could not find a route to ${destination} for ${units} units with finalCltvDelta ${finalLock}: ${route}`);
    }
    return route;
  }

  /**
   * Lists all routes to destination.
   */
  private queryRoutes = (request: lndrpc.QueryRoutesRequest): Promise<lndrpc.QueryRoutesResponse> => {
    return this.unaryCall<lndrpc.QueryRoutesRequest, lndrpc.QueryRoutesResponse>('queryRoutes', request);
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
    request.setWalletPassword(Uint8Array.from(Buffer.from(walletPassword, 'utf8')));
    const initWalletResponse = await this.unaryWalletUnlockerCall<lndrpc.InitWalletRequest, lndrpc.InitWalletResponse>(
      'initWallet', request,
    );
    if (this.initWalletResolve) {
      this.initWalletResolve(true);
    }
    this.logger.info('wallet initialized');
    return initWalletResponse.toObject();
  }

  public unlockWallet = async (walletPassword: string): Promise<lndrpc.UnlockWalletResponse.AsObject> => {
    const request = new lndrpc.UnlockWalletRequest();
    request.setWalletPassword(Uint8Array.from(Buffer.from(walletPassword, 'utf8')));
    const unlockWalletResponse = await this.unaryWalletUnlockerCall<lndrpc.UnlockWalletRequest, lndrpc.UnlockWalletResponse>(
      'unlockWallet', request,
    );
    this.logger.info('wallet unlocked');
    return unlockWalletResponse.toObject();
  }

  public addInvoice = async (rHash: string, units: number, expiry = this.finalLock) => {
    const addHoldInvoiceRequest = new lndinvoices.AddHoldInvoiceRequest();
    addHoldInvoiceRequest.setHash(hexToUint8Array(rHash));
    addHoldInvoiceRequest.setValue(units);
    addHoldInvoiceRequest.setCltvExpiry(expiry);
    await this.addHoldInvoice(addHoldInvoiceRequest);
    this.logger.debug(`added invoice of ${units} for ${rHash} with cltvExpiry ${expiry}`);
    this.subscribeSingleInvoice(rHash);
  }

  public settleInvoice = async (rHash: string, rPreimage: string) => {
    const settleInvoiceRequest = new lndinvoices.SettleInvoiceMsg();
    settleInvoiceRequest.setPreimage(hexToUint8Array(rPreimage));
    await this.settleInvoiceLnd(settleInvoiceRequest);

    const invoiceSubscription = this.invoiceSubscriptions.get(rHash);
    if (invoiceSubscription) {
      this.logger.debug(`settled invoice for ${rHash}`);
      invoiceSubscription.cancel();
    }
  }

  public removeInvoice = async (rHash: string) => {
    const invoiceSubscription = this.invoiceSubscriptions.get(rHash);
    if (invoiceSubscription) {
      const cancelInvoiceRequest = new lndinvoices.CancelInvoiceMsg();
      cancelInvoiceRequest.setPaymentHash(hexToUint8Array(rHash));
      try {
        await this.cancelInvoice(cancelInvoiceRequest);
        this.logger.debug(`canceled invoice for ${rHash}`);
      } catch (err) {
        // handle errors due to attempting to remove an invoice that doesn't exist
        if (err.message === 'unable to locate invoice') {
          this.logger.debug(`attempted to cancel non-existent invoice for ${rHash}`);
        } else if (err.message === 'invoice already canceled') {
          this.logger.debug(`attempted to cancel already canceled invoice for ${rHash}`);
        } else {
          throw err;
        }
      }
      invoiceSubscription.cancel();
    }
  }

  public lookupPayment = async (rHash: string) => {
    const payments = await this.listPayments(true);
    for (const payment of payments.getPaymentsList()) {
      if (payment.getPaymentHash() === rHash) {
        switch (payment.getStatus()) {
          case lndrpc.Payment.PaymentStatus.SUCCEEDED:
            const preimage = payment.getPaymentPreimage();
            return { preimage, state: PaymentState.Succeeded };
          case lndrpc.Payment.PaymentStatus.IN_FLIGHT:
            return { state: PaymentState.Pending };
          default:
            this.logger.warn(`unexpected payment state for payment with hash ${rHash}`);
            /* falls through */
          case lndrpc.Payment.PaymentStatus.FAILED:
            return { state: PaymentState.Failed };
        }
      }
    }

    // if no payment is found, we assume that the payment was never attempted by lnd
    return { state: PaymentState.Failed };
  }

  private listPayments = (includeIncomplete?: boolean): Promise<lndrpc.ListPaymentsResponse> => {
    const request = new lndrpc.ListPaymentsRequest();
    if (includeIncomplete) {
      request.setIncludeIncomplete(includeIncomplete);
    }
    return this.unaryCall<lndrpc.ListPaymentsRequest, lndrpc.ListPaymentsResponse>('listPayments', request);
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
    const request = new lndinvoices.SubscribeSingleInvoiceRequest();
    request.setRHash(hexToUint8Array(rHash));
    const invoiceSubscription = this.invoices.subscribeSingleInvoice(request, this.meta);
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
    if (this.lightning) {
      this.lightning.close();
      this.lightning = undefined;
    }
    if (this.invoices) {
      this.invoices.close();
      this.invoices = undefined;
    }
    if (this.initWalletResolve) {
      this.initWalletResolve(false);
      this.initWalletResolve = undefined;
    }
    if (this.watchMacaroonResolve) {
      this.watchMacaroonResolve(false);
      this.watchMacaroonResolve = undefined;
    }

    if (!this.isDisabled()) {
      await this.setStatus(ClientStatus.Disconnected);
    }
  }
}

export default LndClient;
