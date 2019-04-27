import net, { Server, Socket } from 'net';
import semver from 'semver';
import { EventEmitter } from 'events';
import errors, { errorCodes } from './errors';
import Peer, { PeerInfo } from './Peer';
import NodeList, { reputationEventWeight } from './NodeList';
import P2PRepository from './P2PRepository';
import * as packets from './packets/types';
import { Packet, PacketType } from './packets';
import { OutgoingOrder, OrderPortion, IncomingOrder } from '../orderbook/types';
import { Models } from '../db/DB';
import Logger from '../Logger';
import { NodeState, Address, NodeConnectionInfo, NodeStateUpdate, PoolConfig } from './types';
import addressUtils from '../utils/addressUtils';
import { getExternalIp } from '../utils/utils';
import assert from 'assert';
import { ReputationEvent, DisconnectionReason, XuNetwork } from '../constants/enums';
import NodeKey from '../nodekey/NodeKey';
import { ReputationEventInstance } from '../db/types';
import Network from './Network';

const minCompatibleVersion: string = require('../../package.json').minCompatibleVersion;

type NodeReputationInfo = {
  reputationScore: ReputationEvent;
  banned?: boolean;
};

interface Pool {
  on(event: 'packet.order', listener: (order: IncomingOrder) => void): this;
  on(event: 'packet.getOrders', listener: (peer: Peer, reqId: string, pairIds: string[]) => void): this;
  on(event: 'packet.orderInvalidation', listener: (orderInvalidation: OrderPortion, peer: string) => void): this;
  on(event: 'peer.close', listener: (peerPubKey?: string) => void): this;
  /** Adds a listener to be called when a peer has newly advertised pairs. */
  on(event: 'peer.pairsAdvertised', listener: (peer: Peer, pairIds: string[]) => void): this;
  /** Adds a listener to be called when a previously active pair is dropped by the peer or deactivated. */
  on(event: 'peer.pairDropped', listener: (peerPubKey: string, pairId: string) => void): this;
  on(event: 'peer.nodeStateUpdate', listener: (peer: Peer) => void): this;
  on(event: 'packet.sanitySwap', listener: (packet: packets.SanitySwapPacket, peer: Peer) => void): this;
  on(event: 'packet.swapRequest', listener: (packet: packets.SwapRequestPacket, peer: Peer) => void): this;
  on(event: 'packet.swapAccepted', listener: (packet: packets.SwapAcceptedPacket, peer: Peer) => void): this;
  on(event: 'packet.swapComplete', listener: (packet: packets.SwapCompletePacket) => void): this;
  on(event: 'packet.swapFailed', listener: (packet: packets.SwapFailedPacket) => void): this;
  emit(event: 'packet.order', order: IncomingOrder): boolean;
  emit(event: 'packet.getOrders', peer: Peer, reqId: string, pairIds: string[]): boolean;
  emit(event: 'packet.orderInvalidation', orderInvalidation: OrderPortion, peer: string): boolean;
  emit(event: 'peer.close', peerPubKey?: string): boolean;
  /** Notifies listeners that a peer has newly activated pairs. */
  emit(event: 'peer.pairsAdvertised', peer: Peer, pairIds: string[]): boolean;
  /** Notifies listeners that a previously active pair was dropped by the peer or deactivated. */
  emit(event: 'peer.pairDropped', peerPubKey: string, pairId: string): boolean;
  emit(event: 'peer.nodeStateUpdate', peer: Peer): boolean;
  emit(event: 'packet.sanitySwap', packet: packets.SanitySwapPacket, peer: Peer): boolean;
  emit(event: 'packet.swapRequest', packet: packets.SwapRequestPacket, peer: Peer): boolean;
  emit(event: 'packet.swapAccepted', packet: packets.SwapAcceptedPacket, peer: Peer): boolean;
  emit(event: 'packet.swapComplete', packet: packets.SwapCompletePacket): boolean;
  emit(event: 'packet.swapFailed', packet: packets.SwapFailedPacket): boolean;
}

/** An interface for an object with a `forEach` method that iterates over [[NodeConnectionInfo]] objects. */
interface NodeConnectionIterator {
  forEach: (callback: (node: NodeConnectionInfo) => void) => void;
}

/** A class representing a pool of peers that handles network activity. */
class Pool extends EventEmitter {
  /** The local handshake data to be sent to newly connected peers. */
  public nodeState!: NodeState;
  /** The local node key. */
  private nodeKey!: NodeKey;
  /** A map of pub keys to nodes for which we have pending outgoing connections. */
  private pendingOutboundPeers = new Map<string, Peer>();
  /** A set of peers for which we have pending incoming connections. */
  private pendingInboundPeers = new Set<Peer>();
  /** A collection of known nodes on the XU network. */
  private nodes: NodeList;
  /** A collection of opened, active peers. */
  private peers = new Map<string, Peer>();
  private server?: Server;
  private connected = false;
  /** The port on which to listen for peer connections, undefined if this node is not listening. */
  private listenPort?: number;
  /** This node's listening external socket addresses to advertise to peers. */
  private addresses: Address[] = [];
  /** Points to config comes during construction. */
  private config: PoolConfig;
  private repository: P2PRepository;
  private network: Network;

  constructor(config: PoolConfig, xuNetwork: XuNetwork, private logger: Logger, models: Models) {
    super();
    this.config = config;
    this.network = new Network(xuNetwork);
    this.repository = new P2PRepository(models);
    this.nodes = new NodeList(this.repository, this.network);

    if (config.listen) {
      this.listenPort = config.port;
      this.server = net.createServer();
      config.addresses.forEach((addressString) => {
        const address = addressUtils.fromString(addressString, config.port);
        this.addresses.push(address);
      });
    }
  }

  public get peerCount(): number {
    return this.peers.size;
  }

  /**
   * Initialize the Pool by connecting to known nodes and listening to incoming peer connections, if configured to do so.
   */
  public init = async (ownNodeState: Pick<NodeState, Exclude<keyof NodeState, 'addresses'>>, nodeKey: NodeKey): Promise<void> => {
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

    this.nodeState = { ...ownNodeState, addresses: this.addresses };
    this.nodeKey = nodeKey;

    this.bindNodeList();

    this.nodes.load().then(() => {
      if (this.nodes.count > 0) {
        this.logger.info('Connecting to known / previously connected peers');
      }
      return this.connectNodes(this.nodes, false, true);
    }).then(() => {
      if (this.nodes.count > 0) {
        this.logger.info('Completed start-up connections to known peers');
      }
    }).catch((reason) => {
      this.logger.error('Unexpected error connecting to known peers on startup', reason);
    });

    this.verifyReachability();
    this.connected = true;
  }

  private detectExternalIpAddress = async () => {
    let externalIp: string | undefined;
    try {
      externalIp = await getExternalIp();
      this.logger.info(`retrieved external IP: ${externalIp}`);

      const externalIpExists = this.addresses.some((address) =>  { return address.host === externalIp; });
      if (!externalIpExists) {
        this.addresses.push({
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
  public updatePairs = (pairs: string[]) => {
    this.nodeState.pairs = pairs;
    this.sendNodeStateUpdate();
  }

  /**
   * Updates our raiden address and sends a node state update packet to currently connected
   * peers to notify them of the change.
   */
  public updateRaidenAddress = (raidenAddress: string) => {
    this.nodeState.raidenAddress = raidenAddress;
    this.sendNodeStateUpdate();
  }

  /**
   * Updates our lnd pub key for a given currency and sends a node state update packet to currently
   * connected peers to notify them of the change.
   */
  public updateLndPubKey = (currency: string, pubKey: string) => {
    this.nodeState.lndPubKeys[currency] = pubKey;
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
    await Promise.all([this.unlisten(), this.closePendingConnections(), this.closePeers()]);
    this.connected = false;
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
        const peer = new Peer(Logger.DISABLED_LOGGER, address, this.config, this.network);
        await peer.beginOpen(this.nodeState, this.nodeKey, this.nodeState.nodePubKey);
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
   * @param ignoreKnown whether to ignore nodes we are already aware of, defaults to false
   * @param retryConnecting whether to attempt retry connecting, defaults to false
   * @returns a promise that will resolve when all outbound connections resolve
   */
  private connectNodes = (nodes: NodeConnectionIterator, ignoreKnown = false, retryConnecting = false) => {
    const connectionPromises: Promise<void>[] = [];
    nodes.forEach((node) => {
      // check that this node is not ourselves
      const isNotUs = node.nodePubKey !== this.nodeState.nodePubKey;

      // check that it has listening addresses,
      const hasAddresses = node.lastAddress || node.addresses.length;

      // ignore nodes that we already know if ignoreKnown is true
      const isNotIgnored = this.nodes.has(node.nodePubKey) && !ignoreKnown;

      // determine whether we should attempt to connect
      if (isNotUs && hasAddresses && isNotIgnored) {
        connectionPromises.push(this.tryConnectNode(node, retryConnecting));
      }
    });
    return Promise.all(connectionPromises);
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
      this.logger.warn(`node ${nodePubKey} not found`);
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
    if (nodePubKey === this.nodeState.nodePubKey) {
      const err = errors.ATTEMPTED_CONNECTION_TO_SELF;
      this.logger.warn(err.message);
      throw err;
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

    const peer = new Peer(this.logger, address, this.config, this.network);
    this.pendingOutboundPeers.set(nodePubKey, peer);
    await this.openPeer(peer, nodePubKey, retryConnecting);
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
    this.bindPeer(peer);

    try {
      const sessionInit = await peer.beginOpen(this.nodeState, this.nodeKey, expectedNodePubKey, retryConnecting);

      await this.validatePeer(peer);

      await peer.completeOpen(this.nodeState, this.nodeKey, sessionInit);
    } catch (err) {
      // we don't have nodePubKey for inbound connections, which might fail on handshake
      if (typeof err === 'string') {
        this.logger.warn(`could not open connection to peer (${peer.label}): ${err}`);
      } else {
        this.logger.warn(`could not open connection to peer (${peer.label}): ${err.message}`);
      }

      if (err.code === errorCodes.CONNECTION_RETRIES_MAX_PERIOD_EXCEEDED) {
        await this.nodes.removeAddress(expectedNodePubKey!, peer.address);
      }

      throw err;
    }

    const peerPubKey = peer.nodePubKey!;
    this.logger.verbose(`opened connection to ${peerPubKey} at ${addressUtils.toString(peer.address)}`);
    this.pendingOutboundPeers.delete(peerPubKey);
    this.peers.set(peerPubKey, peer);
    peer.active = true;

    this.emit('peer.pairsAdvertised', peer, peer.advertisedPairs);

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

    // upserting the node entry
    if (!this.nodes.has(peerPubKey)) {
      await this.nodes.createNode({
        addresses,
        nodePubKey: peerPubKey,
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
      this.logger.info(`Disconnected from ${peer.nodePubKey}@${addressUtils.toString(peer.address)}`);
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

        this.logger.info(`node ${nodePubKey} was unbanned`);
        if (reconnect) {
          await this.tryConnectNode(Node, false);
        }
      }
    } else {
      throw errors.NODE_NOT_BANNED(nodePubKey);
    }
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
   * Gets a peer by its node pub key. Throws a [[NOT_CONNECTED]] error if the pub key does not
   * match any currently connected peer.
   */
  public getPeer = (nodePubKey: string) => {
    const peer = this.peers.get(nodePubKey);
    if (!peer) {
      throw errors.NOT_CONNECTED(nodePubKey);
    }
    return peer;
  }

  public broadcastOrder = (order: OutgoingOrder) => {
    const orderPacket = new packets.OrderPacket(order);
    this.peers.forEach(async (peer) => {
      if (peer.activePairs.has(order.pairId)) {
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
    const peer = Peer.fromInbound(socket, this.logger, this.config, this.network);
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
        this.logger.verbose(`received order from ${peer.nodePubKey}: ${JSON.stringify(receivedOrder)}`);
        const incomingOrder: IncomingOrder = { ...receivedOrder, peerPubKey: peer.nodePubKey! };

        if (peer.activePairs.has(incomingOrder.pairId)) {
          this.emit('packet.order', incomingOrder);
        } else {
          this.logger.debug(`received order ${incomingOrder.id} for deactivated trading pair`);
        }
        break;
      }
      case PacketType.OrderInvalidation: {
        const orderPortion = (packet as packets.OrderInvalidationPacket).body!;
        this.logger.verbose(`received order invalidation from ${peer.nodePubKey}: ${JSON.stringify(orderPortion)}`);
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
        this.logger.verbose(`received ${receivedOrders.length} orders from ${peer.nodePubKey}`);
        receivedOrders.forEach((order) => {
          if (peer.activePairs.has(order.pairId)) {
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
        this.logger.verbose(`received ${nodes.length} nodes (${newNodesCount} new) from ${peer.nodePubKey}`);
        await this.connectNodes(nodes);
        break;
      }
      case PacketType.SanitySwap: {
        this.logger.debug(`received sanitySwap from ${peer.nodePubKey}: ${JSON.stringify(packet.body)}`);
        this.emit('packet.sanitySwap', packet, peer);
        break;
      }
      case PacketType.SwapRequest: {
        this.logger.debug(`received swapRequest from ${peer.nodePubKey}: ${JSON.stringify(packet.body)}`);
        this.emit('packet.swapRequest', packet, peer);
        break;
      }
      case PacketType.SwapAccepted: {
        this.logger.debug(`received swapAccepted from ${peer.nodePubKey}: ${JSON.stringify(packet.body)}`);
        this.emit('packet.swapAccepted', packet, peer);
        break;
      }
      case PacketType.SwapComplete: {
        this.logger.debug(`received swapComplete from ${peer.nodePubKey}: ${JSON.stringify(packet.body)}`);
        this.emit('packet.swapComplete', packet);
        break;
      }
      case PacketType.SwapFailed: {
        this.logger.debug(`received swapFailed from ${peer.nodePubKey}: ${JSON.stringify(packet.body)}`);
        this.emit('packet.swapFailed', packet);
        break;
      }
    }
  }

  /** Validates a peer. If a check fails, closes the peer and throws a p2p error. */
  private validatePeer = async (peer: Peer): Promise<void> => {
    assert(peer.nodePubKey);
    const peerPubKey = peer.nodePubKey!;

    if (peerPubKey === this.nodeState.nodePubKey) {
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
      // TODO: Penalize peers that attempt to create duplicate connections to us more then once.
      // the first time might be due connection retries
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

    this.server!.on('connection', async (socket) => {
      await this.handleSocket(socket);
    });
  }

  private bindPeer = (peer: Peer) => {
    peer.on('packet', async (packet) => {
      await this.handlePacket(peer, packet);
    });

    peer.on('pairDropped', (pairId) => {
      // drop all orders for trading pairs that are no longer supported
      this.emit('peer.pairDropped', peer.nodePubKey!, pairId);
    });

    peer.on('pairsAdvertised', (pairIds) => {
      // drop all orders for trading pairs that are no longer supported
      this.emit('peer.pairsAdvertised', peer, pairIds);
    });

    peer.on('nodeStateUpdate', () => {
      this.emit('peer.nodeStateUpdate', peer);
    });

    peer.on('error', (err) => {
      // The only situation in which the node should be connected to itself is the
      // reachability check of the advertised addresses and we don't have to log that
      if (peer.nodePubKey !== this.nodeState.nodePubKey) {
        this.logger.error(`Peer (${peer.label}): error: ${err.message}`);
      }
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
    if (!peer.nodePubKey && peer.expectedNodePubKey) {
      this.pendingOutboundPeers.delete(peer.expectedNodePubKey);
    }

    if (!peer.active) {
      return;
    }

    if (peer.nodePubKey) {
      this.pendingOutboundPeers.delete(peer.nodePubKey);
      this.peers.delete(peer.nodePubKey);
    }
    this.emit('peer.close', peer.nodePubKey);
    peer.removeAllListeners();
    peer.active = false;

    const shouldReconnect =
      (peer.sentDisconnectionReason === undefined || peer.sentDisconnectionReason === DisconnectionReason.ResponseStalling) &&
      (peer.recvDisconnectionReason === undefined || peer.recvDisconnectionReason === DisconnectionReason.ResponseStalling ||
       peer.recvDisconnectionReason === DisconnectionReason.AlreadyConnected ||
       peer.recvDisconnectionReason === DisconnectionReason.Shutdown);
    const addresses = peer.addresses || [];

    if (!peer.inbound && peer.nodePubKey && shouldReconnect && (addresses.length || peer.address)) {
      this.logger.debug(`attempting to reconnect to a disconnected peer ${peer.nodePubKey}`);
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
   * Start listening for incoming p2p connections on the configured host and port. If `this.listenPort` is 0 or undefined,
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
   * Stop listening for incoming p2p connections.
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
}

export default Pool;
export { PoolConfig };
