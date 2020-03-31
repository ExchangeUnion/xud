import assert from 'assert';
import { EventEmitter } from 'events';
import net, { Server, Socket } from 'net';
import semver from 'semver';
import { DisconnectionReason, ReputationEvent, XuNetwork } from '../constants/enums';
import { Models } from '../db/DB';
import { ReputationEventInstance } from '../db/types';
import Logger from '../Logger';
import NodeKey from '../nodekey/NodeKey';
import { IncomingOrder, OrderPortion, OutgoingOrder } from '../orderbook/types';
import addressUtils from '../utils/addressUtils';
import { getExternalIp } from '../utils/utils';
import { getAlias } from '../utils/aliasUtils';
import errors, { errorCodes } from './errors';
import Network from './Network';
import NodeList, { reputationEventWeight } from './NodeList';
import P2PRepository from './P2PRepository';
import { Packet, PacketType } from './packets';
import * as packets from './packets/types';
import Peer, { PeerInfo } from './Peer';
import { Address, NodeConnectionInfo, NodeState, PoolConfig } from './types';

const minCompatibleVersion: string = require('../../package.json').minCompatibleVersion;

type NodeReputationInfo = {
  reputationScore: ReputationEvent;
  banned?: boolean;
};

interface Pool {
  on(event: 'packet.order', listener: (order: IncomingOrder) => void): this;
  on(event: 'packet.getOrders', listener: (peer: Peer, reqId: string, pairIds: string[]) => void): this;
  on(event: 'packet.orderInvalidation', listener: (orderInvalidation: OrderPortion, peer: string) => void): this;
  on(event: 'peer.active', listener: (peerPubKey?: string) => void): this;
  on(event: 'peer.close', listener: (peerPubKey?: string) => void): this;
  /** Adds a listener to be called when a peer's advertised but inactive pairs should be verified. */
  on(event: 'peer.verifyPairs', listener: (peer: Peer) => void): this;
  /** Adds a listener to be called when a previously active pair is dropped by the peer or deactivated. */
  on(event: 'peer.pairDropped', listener: (peerPubKey: string, pairId: string) => void): this;
  on(event: 'peer.nodeStateUpdate', listener: (peer: Peer) => void): this;
  on(event: 'packet.sanitySwapInit', listener: (packet: packets.SanitySwapInitPacket, peer: Peer) => void): this;
  on(event: 'packet.swapRequest', listener: (packet: packets.SwapRequestPacket, peer: Peer) => void): this;
  on(event: 'packet.swapAccepted', listener: (packet: packets.SwapAcceptedPacket, peer: Peer) => void): this;
  on(event: 'packet.swapComplete', listener: (packet: packets.SwapCompletePacket) => void): this;
  on(event: 'packet.swapFailed', listener: (packet: packets.SwapFailedPacket) => void): this;
  emit(event: 'packet.order', order: IncomingOrder): boolean;
  emit(event: 'packet.getOrders', peer: Peer, reqId: string, pairIds: string[]): boolean;
  emit(event: 'packet.orderInvalidation', orderInvalidation: OrderPortion, peer: string): boolean;
  emit(event: 'peer.active', peerPubKey?: string): boolean;
  emit(event: 'peer.close', peerPubKey?: string): boolean;
  /** Notifies listeners that a peer's advertised but inactive pairs should be verified. */
  emit(event: 'peer.verifyPairs', peer: Peer): boolean;
  /** Notifies listeners that a previously active pair was dropped by the peer or deactivated. */
  emit(event: 'peer.pairDropped', peerPubKey: string, pairId: string): boolean;
  emit(event: 'peer.nodeStateUpdate', peer: Peer): boolean;
  emit(event: 'packet.sanitySwapInit', packet: packets.SanitySwapInitPacket, peer: Peer): boolean;
  emit(event: 'packet.swapRequest', packet: packets.SwapRequestPacket, peer: Peer): boolean;
  emit(event: 'packet.swapAccepted', packet: packets.SwapAcceptedPacket, peer: Peer): boolean;
  emit(event: 'packet.swapComplete', packet: packets.SwapCompletePacket): boolean;
  emit(event: 'packet.swapFailed', packet: packets.SwapFailedPacket): boolean;
}

/** An interface for an object with a `forEach` method that iterates over [[NodeConnectionInfo]] objects. */
interface NodeConnectionIterator {
  forEach: (callback: (node: NodeConnectionInfo) => void) => void;
}

/**
 * Represents a pool of peers that handles all p2p network activity. This tracks all active and
 * pending peers, optionally runs a server to listen for incoming connections, and is the primary
 * interface for other modules to interact with the p2p layer.
 */
class Pool extends EventEmitter {
  /** The version of xud we are using. */
  public version: string;
  /** Our node pub key. */
  public nodePubKey: string;
  /** The local handshake data to be sent to newly connected peers. */
  private nodeState: NodeState;
  /** A map of pub keys to nodes for which we have pending outgoing connections. */
  private pendingOutboundPeers = new Map<string, Peer>();
  /** A set of peers for which we have pending incoming connections. */
  private pendingInboundPeers = new Set<Peer>();
  /** A collection of known nodes on the XU network. */
  private nodes: NodeList;
  private loadingNodesPromise?: Promise<void>;
  /** A collection of opened, active peers. */
  private peers = new Map<string, Peer>();
  private server?: Server;
  private disconnecting = false;
  private connected = false;
  /** The port on which to listen for peer connections, undefined if this node is not listening. */
  private listenPort?: number;
  /** Points to config comes during construction. */
  private config: PoolConfig;
  private repository: P2PRepository;
  private network: Network;
  private logger: Logger;
  private nodeKey: NodeKey;

  constructor({ config, xuNetwork, logger, models, nodeKey, version }: {
    config: PoolConfig,
    xuNetwork: XuNetwork,
    logger: Logger,
    models: Models,
    nodeKey: NodeKey,
    version: string,
  }) {
    super();

    this.logger = logger;
    this.nodeKey = nodeKey;
    this.nodePubKey = nodeKey.pubKey;
    this.version = version;
    this.config = config;
    this.network = new Network(xuNetwork);
    this.repository = new P2PRepository(models);
    this.nodes = new NodeList(this.repository);

    this.nodeState = {
      addresses: [],
      pairs: [],
      raidenAddress: '',
      lndPubKeys: {},
      lndUris: {},
      tokenIdentifiers: {},
    };

    if (config.listen) {
      this.listenPort = config.port;
      this.server = net.createServer();
      config.addresses.forEach((addressString) => {
        const address = addressUtils.fromString(addressString, config.port);
        this.nodeState.addresses.push(address);
      });
    }
  }

  public get peerCount(): number {
    return this.peers.size;
  }

  public get addresses() {
    return this.nodeState.addresses;
  }

  public getTokenIdentifier(currency: string) {
    return this.nodeState.tokenIdentifiers[currency];
  }

  /**
   * Initialize the Pool by connecting to known nodes and listening to incoming peer connections, if configured to do so.
   */
  public init = async (): Promise<void> => {
    if (this.connected) {
      return;
    }
    this.logger.info(`Connecting to ${this.network.xuNetwork} XU network`);

    if (this.server) {
      await this.listen();
      this.bindServer();

      if (this.config.detectexternalip) {
        await this.detectExternalIpAddress();
      }
    }

    this.bindNodeList();

    this.loadingNodesPromise = this.nodes.load();
    this.loadingNodesPromise.then(async () => {
      if (this.nodes.count > 0 && !this.disconnecting) {
        this.logger.info('Connecting to known / previously connected peers');
        await this.connectNodes(this.nodes, true, true);
        this.logger.info('Completed start-up connections to known peers');
      }
      this.loadingNodesPromise = undefined;
    }).catch((reason) => {
      this.logger.error('Unexpected error connecting to known peers on startup', reason);
      this.loadingNodesPromise = undefined;
    });

    this.verifyReachability();
    this.connected = true;
  }

  private detectExternalIpAddress = async () => {
    let externalIp: string | undefined;
    try {
      externalIp = await getExternalIp();
      this.logger.info(`retrieved external IP: ${externalIp}`);

      const externalIpExists = this.nodeState.addresses.some((address) => { return address.host === externalIp; });
      if (!externalIpExists) {
        this.nodeState.addresses.push({
          host: externalIp,
          port: this.listenPort!,
        });
      }
    } catch (error) {
      this.logger.error(`error while retrieving external IP: ${error.message}`);
    }
  }

  /**
   * Updates our active trading pairs and sends a node state update packet to currently connected
   * peers to notify them of the change.
   */
  public updatePairs = (pairIds: string[]) => {
    this.nodeState.pairs = pairIds;
    this.sendNodeStateUpdate();
  }

  /**
   * Updates our raiden address and supported token addresses, then sends a node state update
   * packet to currently connected peers to notify them of the change.
   */
  public updateRaidenState = (tokenAddresses: Map<string, string>, raidenAddress?: string) => {
    this.nodeState.raidenAddress = raidenAddress || '';
    tokenAddresses.forEach((tokenAddress, currency) => {
      this.nodeState.tokenIdentifiers[currency] = tokenAddress;
    });
    this.sendNodeStateUpdate();
  }

  /**
   * Updates our lnd pub key and chain identifier for a given currency and sends a node state
   * update packet to currently connected peers to notify them of the change.
   */
  public updateLndState = (
    { currency, pubKey, chain, uris }:
    { currency: string, pubKey: string, chain?: string, uris?: string[] },
  ) => {
    this.nodeState.lndPubKeys[currency] = pubKey;
    if (uris) {
      this.nodeState.lndUris[currency] = uris;
    }
    this.nodeState.tokenIdentifiers[currency] = chain;
    this.sendNodeStateUpdate();
  }

  private sendNodeStateUpdate = () => {
    const packet = new packets.NodeStateUpdatePacket(this.nodeState);
    this.peers.forEach(async (peer) => {
      await peer.sendPacket(packet);
    });
  }

  public disconnect = async (): Promise<void> => {
    if (!this.connected) {
      return;
    }

    this.disconnecting = true;
    if (this.loadingNodesPromise) {
      await this.loadingNodesPromise;
    }
    await Promise.all([this.unlisten(), this.closePendingConnections(), this.closePeers()]);
    this.connected = false;
    this.disconnecting = false;
  }

  private bindNodeList = () => {
    this.nodes.on('node.ban', (nodePubKey: string, events: ReputationEventInstance[]) => {
      this.logger.warn(`node ${nodePubKey} was banned`);

      const peer = this.peers.get(nodePubKey);
      if (peer) {
        const lastNegativeEvents = events.filter(e => reputationEventWeight[e.event] < 0).slice(0, 10);
        return peer.close(DisconnectionReason.Banned, JSON.stringify(lastNegativeEvents));
      }
      return;
    });
  }

  private verifyReachability = () => {
    this.nodeState.addresses.forEach(async (address) => {
      const externalAddress = addressUtils.toString(address);
      this.logger.debug(`Verifying reachability of advertised address: ${externalAddress}`);
      try {
        const peer = new Peer(Logger.DISABLED_LOGGER, address, this.network);
        await peer.beginOpen({
          ownNodeState: this.nodeState,
          ownNodeKey: this.nodeKey,
          ownVersion: this.version,
          expectedNodePubKey: this.nodePubKey,
          torport: this.config.torport,
        });
        await peer.close();
        assert.fail();
      } catch (err) {
        if (typeof err.message === 'string' && err.message.includes(DisconnectionReason[DisconnectionReason.ConnectedToSelf])) {
          this.logger.verbose(`Verified reachability of advertised address: ${externalAddress}`);
        } else {
          this.logger.warn(`Could not verify reachability of advertised address: ${externalAddress}`);
        }
      }
    });
  }

  /**
   * Iterate over a collection of nodes and attempt to connect to them.
   * If the node is banned, already connected, or has no listening addresses, then do nothing.
   * Additionally, if we're already trying to connect to a given node also do nothing.
   * @param nodes a collection of nodes with a `forEach` iterator to attempt to connect to
   * @param allowKnown whether to allow connecting to nodes we are already aware of, defaults to true
   * @param retryConnecting whether to attempt retry connecting, defaults to false
   * @returns a promise that will resolve when all outbound connections resolve
   */
  private connectNodes = async (nodes: NodeConnectionIterator, allowKnown = true, retryConnecting = false) => {
    const connectionPromises: Promise<void>[] = [];
    nodes.forEach((node) => {
      // check that this node is not ourselves
      const isNotUs = node.nodePubKey !== this.nodePubKey;

      // check that it has listening addresses,
      const hasAddresses = node.lastAddress || node.addresses.length;

      // if allowKnown is false, allow nodes that we don't aware of
      const isAllowed = allowKnown || !this.nodes.has(node.nodePubKey);

      // determine whether we should attempt to connect
      if (isNotUs && hasAddresses && isAllowed) {
        connectionPromises.push(this.tryConnectNode(node, retryConnecting));
      }
    });
    await Promise.all(connectionPromises);
  }

  /**
   * Attempt to create an outbound connection to a node using its known listening addresses.
   */
  private tryConnectNode = async (node: NodeConnectionInfo, retryConnecting = false) => {
    if (!await this.tryConnectWithLastAddress(node)) {
      if (!await this.tryConnectWithAdvertisedAddresses(node) && retryConnecting) {
        await this.tryConnectWithLastAddress(node, true);
      }
    }
  }

  private tryConnectWithLastAddress = async (node: NodeConnectionInfo, retryConnecting = false) => {
    const { lastAddress, nodePubKey } = node;

    if (!lastAddress) return false;

    try {
      await this.addOutbound(lastAddress, nodePubKey, retryConnecting, false);
      return true;
    } catch (err) {}

    return false;
  }

  private tryConnectWithAdvertisedAddresses = async (node: NodeConnectionInfo) => {
    const { addresses, nodePubKey } = node;

    // sort by lastConnected desc
    const sortedAddresses = addressUtils.sortByLastConnected(addresses);

    for (const address of sortedAddresses) {
      if (node.lastAddress && addressUtils.areEqual(address, node.lastAddress)) continue;

      try {
        await this.addOutbound(address, nodePubKey, false, false);
        return true; // once we've successfully established an outbound connection, stop attempting new connections
      } catch (err) {}
    }

    return false;
  }

  /**
   * Gets the active XU network as specified by the configuration.
   *
   * @returns the active XU network
   */
  public getNetwork = () => {
    return this.network.xuNetwork;
  }

  /**
   * Gets a node's reputation score and whether it is banned
   * @param nodePubKey The node pub key of the node for which to get reputation information
   * @return true if the specified node exists and the event was added, false otherwise
   */
  public getNodeReputation = async (nodePubKey: string): Promise<NodeReputationInfo> => {
    const node = await this.repository.getNode(nodePubKey);
    if (node) {
      const { reputationScore, banned } = node;
      return {
        reputationScore,
        banned,
      };
    } else {
      this.logger.warn(`node ${nodePubKey} (${getAlias(nodePubKey)}) not found`);
      throw errors.NODE_UNKNOWN(nodePubKey);
    }
  }

  /**
   * Attempt to add an outbound peer by connecting to a given socket address and nodePubKey.
   * Throws an error if a socket connection to or the handshake with the node fails for any reason.
   * @param address the socket address of the node to connect to
   * @param nodePubKey the nodePubKey of the node to connect to
   * @returns a promise that resolves to the connected and opened peer
   */
  public addOutbound = async (address: Address, nodePubKey: string, retryConnecting: boolean, revokeConnectionRetries: boolean): Promise<Peer> => {
    if (nodePubKey === this.nodePubKey || this.addressIsSelf(address)) {
      throw errors.ATTEMPTED_CONNECTION_TO_SELF;
    }

    // check if we allow connections to tor addresses
    if (!this.config.tor && address.host.indexOf('.onion') !== -1) {
      throw errors.NODE_TOR_ADDRESS(nodePubKey, address);
    }

    if (this.nodes.isBanned(nodePubKey)) {
      throw errors.NODE_IS_BANNED(nodePubKey);
    }

    if (this.peers.has(nodePubKey)) {
      throw errors.NODE_ALREADY_CONNECTED(nodePubKey, address);
    }

    const pendingPeer = this.pendingOutboundPeers.get(nodePubKey);
    if (pendingPeer) {
      if (revokeConnectionRetries) {
        pendingPeer.revokeConnectionRetries();
      } else {
        throw errors.ALREADY_CONNECTING(nodePubKey);
      }
    }

    const peer = new Peer(this.logger, address, this.network);
    this.bindPeer(peer);

    this.pendingOutboundPeers.set(nodePubKey, peer);
    try {
      await this.openPeer(peer, nodePubKey, retryConnecting);
    } finally {
      this.pendingOutboundPeers.delete(nodePubKey);
    }
    return peer;
  }

  public listPeers = (): PeerInfo[] => {
    const peerInfos: PeerInfo[] = Array.from({ length: this.peers.size });
    let i = 0;
    this.peers.forEach((peer) => {
      peerInfos[i] = peer.info;
      i += 1;
    });
    return peerInfos;
  }

  private addressIsSelf = (address: Address): boolean => {
    if (address.port === this.listenPort) {
      switch (address.host) {
        case '::1':
        case '0.0.0.0':
        case '127.0.0.1':
        case 'localhost':
          return true;
      }
    }

    return false;
  }

  private tryOpenPeer = async (peer: Peer, peerPubKey?: string, retryConnecting = false): Promise<void> => {
    try {
      await this.openPeer(peer, peerPubKey, retryConnecting);
    } catch (err) {}
  }

  /**
   * Opens a connection to a peer and performs a routine for newly opened peers that includes
   * requesting open orders and updating the database with the peer's information.
   * @returns a promise that resolves once the connection has opened and the newly opened peer
   * routine is complete
   */
  private openPeer = async (peer: Peer, expectedNodePubKey?: string, retryConnecting = false): Promise<void> => {
    if (this.disconnecting || !this.connected) {
      // if we are disconnected or disconnecting, don't open new connections
      throw errors.POOL_CLOSED;
    }

    try {
      const sessionInit = await peer.beginOpen({
        expectedNodePubKey,
        retryConnecting,
        ownNodeState: this.nodeState,
        ownNodeKey: this.nodeKey,
        ownVersion: this.version,
        torport: this.config.torport,
      });

      await this.validatePeer(peer);

      await peer.completeOpen(this.nodeState, this.nodeKey, this.version, sessionInit);
    } catch (err) {
      const msg = `could not open connection to ${peer.inbound ? 'inbound' : 'outbound'} peer`;
      if (typeof err === 'string') {
        this.logger.warn(`${msg} (${peer.label}): ${err}`);
      } else {
        this.logger.warn(`${msg} (${peer.label}): ${err.message}`);
      }

      if (err.code === errorCodes.CONNECTION_RETRIES_MAX_PERIOD_EXCEEDED) {
        await this.nodes.removeAddress(expectedNodePubKey!, peer.address);
      }

      throw err;
    }

    const peerPubKey = peer.nodePubKey!;

    // A potential race condition exists here in the case where two peers attempt connections
    // to each other simultaneously. Handshakes may be completed on both sockets without being
    // detected in the validatePeer method that is called above after a handshake begins and
    // the node pub key for the inbound peer is established but before it completes. In this case,
    // both peers cannot close the "duplicate" connection or else they may wind up closing both
    // of them. The approach below arbitrarily picks the peer with the higher node pubkey to close
    // the socket when it encounters a duplicate, while the other peer waits briefly to see if
    // the already established connection is closed.
    if (this.peers.has(peerPubKey)) {
      if (this.nodePubKey > peerPubKey) {
        await peer.close(DisconnectionReason.AlreadyConnected);
        throw errors.NODE_ALREADY_CONNECTED(peerPubKey, peer.address);
      } else {
        const stillConnected = await new Promise<boolean>((resolve) => {
          const timeout = setTimeout(() => resolve(true), Peer.STALL_INTERVAL);
          this.peers.get(peerPubKey)!.once('close', () => {
            resolve(false);
            clearTimeout(timeout);
          });
        });
        if (stillConnected) {
          await peer.close(DisconnectionReason.AlreadyConnected);
          throw errors.NODE_ALREADY_CONNECTED(peerPubKey, peer.address);
        }
      }
    }

    this.peers.set(peerPubKey, peer);
    peer.active = true;
    this.emit('peer.active', peerPubKey);
    this.logger.verbose(`opened connection to ${peer.label} at ${addressUtils.toString(peer.address)}`);

    // begin the process to handle a just opened peer, but return from this method immediately
    this.handleOpenedPeer(peer).catch(this.logger.error);
  }

  private handleOpenedPeer = async (peer: Peer) => {
    this.emit('peer.verifyPairs', peer);

    // request peer's known nodes only if p2p.discover option is true
    if (this.config.discover) {
      await peer.sendGetNodes();
      if (this.config.discoverminutes === 0) {
        // timer is disabled
        peer.discoverTimer = undefined; // defensive programming
      } else {
        // timer is enabled
        peer.discoverTimer = setInterval(peer.sendGetNodes, this.config.discoverminutes * 1000 * 60);
      }
    }

    // if outbound, update the `lastConnected` field for the address we're actually connected to
    const addresses = peer.inbound ? peer.addresses! : peer.addresses!.map((address) => {
      if (addressUtils.areEqual(peer.address, address)) {
        return { ...address, lastConnected: Date.now() };
      } else {
        return address;
      }
    });

    // creating the node entry
    if (!this.nodes.has(peer.nodePubKey!)) {
      await this.nodes.createNode({
        addresses,
        nodePubKey: peer.nodePubKey!,
        lastAddress: peer.inbound ? undefined : peer.address,
      });
    } else {
      // the node is known, update its listening addresses
      await this.nodes.updateAddresses(peer.nodePubKey!, addresses, peer.inbound ? undefined : peer.address);
    }
  }

  public closePeer = async (nodePubKey: string, reason?: DisconnectionReason, reasonPayload?: string) => {
    const peer = this.peers.get(nodePubKey);
    if (peer) {
      await peer.close(reason, reasonPayload);
      this.logger.info(`Disconnected from ${peer.nodePubKey}@${addressUtils.toString(peer.address)} (${peer.alias})`);
    } else {
      throw(errors.NOT_CONNECTED(nodePubKey));
    }
  }

  public banNode = async (nodePubKey: string): Promise<void> => {
    if (this.nodes.isBanned(nodePubKey)) {
      throw errors.NODE_ALREADY_BANNED(nodePubKey);
    } else {
      const banned = await this.nodes.ban(nodePubKey);
      if (!banned) {
        throw errors.NODE_UNKNOWN(nodePubKey);
      }
    }
  }

  public unbanNode = async (nodePubKey: string, reconnect: boolean): Promise<void> => {
    if (this.nodes.isBanned(nodePubKey)) {
      const unbanned = await this.nodes.unBan(nodePubKey);
      if (!unbanned) {
        throw errors.NODE_UNKNOWN(nodePubKey);
      }

      const node = await this.repository.getNode(nodePubKey);
      if (node) {
        const Node: NodeConnectionInfo = {
          nodePubKey,
          addresses: node.addresses,
          lastAddress: node.lastAddress,
        };

        this.logger.info(`node ${nodePubKey} (${getAlias(nodePubKey)}) was unbanned`);
        if (reconnect) {
          await this.tryConnectNode(Node, false);
        }
      }
    } else {
      throw errors.NODE_NOT_BANNED(nodePubKey);
    }
  }

  public discoverNodes = async (peerPubKey: string): Promise<number> => {
    const peer = this.peers.get(peerPubKey);
    if (!peer) {
      throw errors.NOT_CONNECTED(peerPubKey);
    }
    return peer.discoverNodes();
  }

  // A wrapper for [[NodeList.addReputationEvent]].
  public addReputationEvent = (nodePubKey: string, event: ReputationEvent) => {
    return this.nodes.addReputationEvent(nodePubKey, event);
  }

  public sendToPeer = async (nodePubKey: string, packet: Packet) => {
    const peer = this.peers.get(nodePubKey);
    if (!peer) {
      throw errors.NOT_CONNECTED(nodePubKey);
    }
    await peer.sendPacket(packet);
  }

  /**
   * Gets a peer by its node pub key or alias. Throws a [[NOT_CONNECTED]] error if the supplied identifier does not
   * match any currently connected peer.
   */
  public getPeer = (peerPubKey: string) => {
    const peer = this.peers.get(peerPubKey);
    if (!peer) {
      throw errors.NOT_CONNECTED(peerPubKey);
    }
    return peer;
  }

  public broadcastOrder = (order: OutgoingOrder) => {
    const orderPacket = new packets.OrderPacket(order);
    this.peers.forEach(async (peer) => {
      if (peer.isPairActive(order.pairId)) {
        await peer.sendPacket(orderPacket);
      }
    });
  }

  /**
   * Broadcasts an [[OrderInvalidationPacket]] to all currently connected peers.
   * @param nodeToExclude the node pub key of a node to exclude from the packet broadcast
   */
  public broadcastOrderInvalidation = ({ id, pairId, quantity }: OrderPortion, nodeToExclude?: string) => {
    const orderInvalidationPacket = new packets.OrderInvalidationPacket({ id, pairId, quantity });
    this.peers.forEach(async (peer) => {
      if (!nodeToExclude || peer.nodePubKey !== nodeToExclude) {
        await peer.sendPacket(orderInvalidationPacket);
      }
    });

    // TODO: send only to peers which accepts the pairId
  }

  private addInbound = async (socket: Socket) => {
    const peer = Peer.fromInbound(socket, this.logger, this.network);
    this.bindPeer(peer);
    this.pendingInboundPeers.add(peer);
    await this.tryOpenPeer(peer);
    this.pendingInboundPeers.delete(peer);
  }

  private handleSocket = async (socket: Socket) => {
    if (!socket.remoteAddress) { // client disconnected, socket is destroyed
      this.logger.debug('Ignoring disconnected peer');
      socket.destroy();
      return;
    }

    if (this.nodes.isBanned(socket.remoteAddress)) {
      this.logger.debug(`Ignoring banned peer (${socket.remoteAddress})`);
      socket.destroy();
      return;
    }

    await this.addInbound(socket);
  }

  private handlePacket = async (peer: Peer, packet: Packet) => {
    switch (packet.type) {
      case PacketType.Order: {
        const receivedOrder: OutgoingOrder = (packet as packets.OrderPacket).body!;
        this.logger.verbose(`received order from ${peer.label}: ${JSON.stringify(receivedOrder)}`);
        const incomingOrder: IncomingOrder = { ...receivedOrder, peerPubKey: peer.nodePubKey! };

        if (peer.isPairActive(incomingOrder.pairId)) {
          this.emit('packet.order', incomingOrder);
        } else {
          this.logger.debug(`received order ${incomingOrder.id} for deactivated trading pair`);
        }
        break;
      }
      case PacketType.OrderInvalidation: {
        const orderPortion = (packet as packets.OrderInvalidationPacket).body!;
        this.logger.verbose(`received order invalidation from ${peer.label}: ${JSON.stringify(orderPortion)}`);
        this.emit('packet.orderInvalidation', orderPortion, peer.nodePubKey as string);
        break;
      }
      case PacketType.GetOrders: {
        const getOrdersPacketBody = (packet as packets.GetOrdersPacket).body;
        const pairIds = getOrdersPacketBody ? getOrdersPacketBody.pairIds : [];
        this.emit('packet.getOrders', peer, packet.header.id, pairIds);
        break;
      }
      case PacketType.Orders: {
        const receivedOrders = (packet as packets.OrdersPacket).body!;
        this.logger.verbose(`received ${receivedOrders.length} orders from ${peer.label}`);
        receivedOrders.forEach((order) => {
          if (peer.isPairActive(order.pairId)) {
            this.emit('packet.order', { ...order, peerPubKey: peer.nodePubKey! });
          } else {
            this.logger.debug(`received order ${order.id} for deactivated trading pair`);
          }
        });
        break;
      }
      case PacketType.GetNodes: {
        await this.handleGetNodes(peer, packet.header.id);
        break;
      }
      case PacketType.Nodes: {
        const nodes = (packet as packets.NodesPacket).body!;
        let newNodesCount = 0;
        nodes.forEach((node) => {
          if (!this.nodes.has(node.nodePubKey)) {
            newNodesCount += 1;
          }
        });
        this.logger.verbose(`received ${nodes.length} nodes (${newNodesCount} new) from ${peer.label}`);
        await this.connectNodes(nodes);
        break;
      }
      case PacketType.SanitySwap: {
        this.logger.debug(`received sanitySwap from ${peer.label}: ${JSON.stringify(packet.body)}`);
        this.emit('packet.sanitySwapInit', packet, peer);
        break;
      }
      case PacketType.SwapRequest: {
        this.logger.debug(`received swapRequest from ${peer.label}: ${JSON.stringify(packet.body)}`);
        this.emit('packet.swapRequest', packet, peer);
        break;
      }
      case PacketType.SwapAccepted: {
        this.logger.debug(`received swapAccepted from ${peer.label}: ${JSON.stringify(packet.body)}`);
        this.emit('packet.swapAccepted', packet, peer);
        break;
      }
      case PacketType.SwapComplete: {
        this.logger.debug(`received swapComplete from ${peer.label}: ${JSON.stringify(packet.body)}`);
        this.emit('packet.swapComplete', packet);
        break;
      }
      case PacketType.SwapFailed: {
        this.logger.debug(`received swapFailed from ${peer.label}: ${JSON.stringify(packet.body)}`);
        this.emit('packet.swapFailed', packet);
        break;
      }
    }
  }

  /** Validates a peer. If a check fails, closes the peer and throws a p2p error. */
  private validatePeer = async (peer: Peer): Promise<void> => {
    assert(peer.nodePubKey);
    const peerPubKey = peer.nodePubKey!;

    if (peerPubKey === this.nodePubKey) {
      await peer.close(DisconnectionReason.ConnectedToSelf);
      throw errors.ATTEMPTED_CONNECTION_TO_SELF;
    }

    // Check if version is semantic, and higher than minCompatibleVersion.
    if (!semver.valid(peer.version)) {
      await peer.close(DisconnectionReason.MalformedVersion);
      throw errors.MALFORMED_VERSION(addressUtils.toString(peer.address), peer.version);
    }
    // dev.note: compare returns 0 if v1 == v2, or 1 if v1 is greater, or -1 if v2 is greater.
    if (semver.compare(peer.version, minCompatibleVersion) === -1) {
      await peer.close(DisconnectionReason.IncompatibleProtocolVersion);
      throw errors.INCOMPATIBLE_VERSION(addressUtils.toString(peer.address), minCompatibleVersion, peer.version);
    }

    if (!this.connected) {
      // if we have disconnected the pool, don't allow any new connections to open
      await peer.close(DisconnectionReason.NotAcceptingConnections);
      throw errors.POOL_CLOSED;
    }

    if (this.nodes.isBanned(peerPubKey)) {
      // TODO: Ban IP address for this session if banned peer attempts repeated connections.
      await peer.close(DisconnectionReason.Banned);
      throw errors.NODE_IS_BANNED(peerPubKey);
    }

    if (this.peers.has(peerPubKey)) {
      // TODO: Penalize peers that attempt to create duplicate connections to us more than once.
      // The first time might be due to connection retries.
      await peer.close(DisconnectionReason.AlreadyConnected);
      throw errors.NODE_ALREADY_CONNECTED(peerPubKey, peer.address);
    }

    // check to make sure the socket was not destroyed during or immediately after the handshake
    if (!peer.connected) {
      this.logger.error(`the socket to node ${peerPubKey} was disconnected`);
      throw errors.NOT_CONNECTED(peerPubKey);
    }
  }

  /**
   * Responds to a [[GetNodesPacket]] by populating and sending a [[NodesPacket]].
   */
  private handleGetNodes = async (peer: Peer, reqId: string) => {
    const connectedNodesInfo: NodeConnectionInfo[] = [];
    this.peers.forEach((connectedPeer) => {
      if (connectedPeer.nodePubKey !== peer.nodePubKey && connectedPeer.addresses && connectedPeer.addresses.length > 0) {
        // don't send the peer itself or any peers for whom we don't have listening addresses
        connectedNodesInfo.push({
          nodePubKey: connectedPeer.nodePubKey!,
          addresses: connectedPeer.addresses,
        });
      }
    });
    await peer.sendNodes(connectedNodesInfo, reqId);
  }

  private bindServer = () => {
    this.server!.on('error', (err) => {
      this.logger.error(err);
    });

    this.server!.on('connection', this.handleSocket);
  }

  private bindPeer = (peer: Peer) => {
    peer.on('packet', async (packet) => {
      await this.handlePacket(peer, packet);
    });

    peer.on('pairDropped', (pairId) => {
      // drop all orders for trading pairs that exist and are no longer supported
      if (this.nodeState.pairs.includes(pairId)) {
        this.emit('peer.pairDropped', peer.nodePubKey!, pairId);
      }
    });

    peer.on('verifyPairs', () => {
      // drop all orders for trading pairs that are no longer supported
      this.emit('peer.verifyPairs', peer);
    });

    peer.on('nodeStateUpdate', () => {
      this.emit('peer.nodeStateUpdate', peer);
    });

    peer.once('close', () => this.handlePeerClose(peer));

    peer.on('reputation', async (event) => {
      this.logger.debug(`Peer (${peer.label}): reputation event: ${ReputationEvent[event]}`);
      if (peer.nodePubKey) {
        await this.addReputationEvent(peer.nodePubKey, event);
      }
    });
  }

  private handlePeerClose = async (peer: Peer) => {
    if (peer.active) {
      this.peers.delete(peer.nodePubKey!);
    }
    peer.removeAllListeners();

    if (!peer.active) {
      return;
    }
    peer.active = false;
    this.emit('peer.close', peer.nodePubKey);

    const shouldReconnect =
      (peer.sentDisconnectionReason === undefined || peer.sentDisconnectionReason === DisconnectionReason.ResponseStalling) &&
      (peer.recvDisconnectionReason === undefined || peer.recvDisconnectionReason === DisconnectionReason.ResponseStalling ||
       peer.recvDisconnectionReason === DisconnectionReason.AlreadyConnected ||
       peer.recvDisconnectionReason === DisconnectionReason.Shutdown);
    const addresses = peer.addresses || [];

    if (!peer.inbound && peer.nodePubKey && shouldReconnect && (addresses.length || peer.address)) {
      this.logger.debug(`attempting to reconnect to a disconnected peer ${peer.label}`);
      const node = { addresses, lastAddress: peer.address, nodePubKey: peer.nodePubKey };
      await this.tryConnectNode(node, true);
    }
  }

  private closePeers = () => {
    const closePromises = [];
    for (const peer of this.peers.values()) {
      closePromises.push(peer.close(DisconnectionReason.Shutdown));
    }
    return Promise.all(closePromises);
  }

  private closePendingConnections = () => {
    const closePromises = [];
    for (const peer of this.pendingOutboundPeers.values()) {
      closePromises.push(peer.close());
    }
    for (const peer of this.pendingInboundPeers) {
      closePromises.push(peer.close());
    }
    return Promise.all(closePromises);
  }

  /**
   * Starts listening for incoming p2p connections on the configured host and port. If `this.listenPort` is 0 or undefined,
   * a random available port is used and will be assigned to `this.listenPort`.
   * @return a promise that resolves once the server is listening, or rejects if it fails to listen
   */
  private listen = () => {
    return new Promise<void>((resolve, reject) => {
      const listenErrHandler = (err: Error) => {
        reject(err);
      };

      this.server!.listen(this.listenPort || 0, '0.0.0.0').on('listening', () => {
        const { address, port } = this.server!.address() as net.AddressInfo;
        this.logger.info(`p2p server listening on ${address}:${port}`);

        if (this.listenPort === 0) {
          // we didn't specify a port and grabbed any available port
          this.listenPort = port;
        }

        this.server!.removeListener('error', listenErrHandler);
        resolve();
      }).on('error', listenErrHandler);
    });
  }

  /**
   * Stops listening for incoming p2p connections.
   * @return a promise that resolves once the server is no longer listening
   */
  private unlisten = () => {
    if (this.server && this.server.listening) {
      this.server.close(); // stop listening for new connections
    }
    return new Promise<void>((resolve) => {
      if (this.server) {
        this.server.once('close', resolve);
      } else {
        resolve();
      }
    });
  }

  /**
   * Resolves alias to a connected node's public key
   */
  public resolveAlias = (alias: string) => {
    if (alias === '') {
      throw errors.UNKNOWN_ALIAS;
    }
    let pubkeys: string[] = [];
    this.peers.forEach((peer) => {
      if (peer.alias) {
        if (peer.alias.toLowerCase() === alias.toLowerCase()) {
          pubkeys.push(peer.nodePubKey!);
        }
      }
    });
    pubkeys = pubkeys.concat(this.nodes.getBannedPubKeys(alias));
    if (pubkeys.length === 1) {
      return pubkeys[0];
    } else if (pubkeys.length === 0) {
      throw errors.UNKNOWN_ALIAS(alias);
    } else {
      throw errors.ALIAS_CONFLICT(alias);
    }
  }

  /**
   * Resolves alias of a possibly non-connected node
   */
  public getNodeByAlias = async (alias: string) => {
    const nlist = await this.repository.getNodes();
    const pubkeys: string[] = [];
    for (const entry of nlist) {
      if (getAlias(entry.nodePubKey).toLowerCase() === alias.toLowerCase()) {
        pubkeys.push(entry.nodePubKey);
      }
    }
    if (pubkeys.length === 1) {
      return pubkeys[0];
    } else if (pubkeys.length === 0) {
      throw errors.UNKNOWN_ALIAS(alias);
    } else {
      throw errors.ALIAS_CONFLICT(alias);
    }
  }
}

export default Pool;
export { PoolConfig };
