import net, { Server, Socket } from 'net';
import { EventEmitter } from 'events';
import errors, { errorCodes } from './errors';
import Peer, { PeerInfo } from './Peer';
import NodeList from './NodeList';
import PeerList from './PeerList';
import P2PRepository from './P2PRepository';
import * as packets from './packets/types';
import { Packet, PacketType } from './packets';
import { OutgoingOrder, OrderIdentifier, StampedPeerOrder } from '../types/orders';
import { Models } from '../db/DB';
import Logger from '../Logger';
import { HandshakeState, Address, NodeConnectionInfo } from '../types/p2p';
import addressUtils from '../utils/addressUtils';
import { getExternalIp } from '../utils/utils';
import assert from 'assert';

type PoolConfig = {
  listen: boolean;
  port: number;
  addresses: string[];
};

interface Pool {
  on(event: 'packet.order', listener: (order: StampedPeerOrder) => void): this;
  on(event: 'packet.getOrders', listener: (peer: Peer, reqId: string) => void): this;
  on(event: 'packet.orderInvalidation', listener: (orderInvalidation: OrderIdentifier) => void): this;
  on(event: 'peer.close', listener: (peer: Peer) => void): this;
  on(event: 'packet.dealRequest', listener: (packet: packets.DealRequestPacket, peer: Peer) => void): this;
  on(event: 'packet.dealResponse', listener: (packet: packets.DealResponsePacket, peer: Peer) => void): this;
  on(event: 'packet.swapRequest', listener: (packet: packets.SwapRequestPacket, peer: Peer) => void): this;
  on(event: 'packet.swapResponse', listener: (packet: packets.SwapResponsePacket) => void): this;
  emit(event: 'packet.order', order: StampedPeerOrder): boolean;
  emit(event: 'packet.getOrders', peer: Peer, reqId: string): boolean;
  emit(event: 'packet.orderInvalidation', orderInvalidation: OrderIdentifier): boolean;
  emit(event: 'peer.close', peer: Peer): boolean;
  emit(event: 'packet.dealRequest', packet: packets.DealRequestPacket, peer: Peer): boolean;
  emit(event: 'packet.dealResponse', packet: packets.DealResponsePacket, peer: Peer): boolean;
  emit(event: 'packet.swapRequest', packet: packets.SwapRequestPacket, peer: Peer): boolean;
  emit(event: 'packet.swapResponse', packet: packets.SwapResponsePacket): boolean;
}

/** An interface for an object with a `forEach` method that iterates over [[NodeConnectionInfo]] objects. */
interface NodeConnectionIterator {
  forEach: (callback: (node: NodeConnectionInfo) => void) => void;
}

/** A class representing a pool of peers that handles network activity. */
class Pool extends EventEmitter {
  /** The local handshake data to be sent to newly connected peers. */
  public handshakeData!: HandshakeState;
  /** A collection of known nodes on the XU network. */
  private nodes: NodeList;
  /** A collection of opened, active peers. */
  private peers: PeerList = new PeerList();
  private server?: Server;
  private connected = false;
  /** The port on which to listen for peer connections, undefined if this node is not listening. */
  private listenPort?: number;
  /** This node's listening external socket addresses to advertise to peers. */
  private addresses: Address[] = [];

  constructor(config: PoolConfig, private logger: Logger, models: Models) {
    super();

    if (config.listen) {
      this.listenPort = config.port;
      this.server = net.createServer();
      config.addresses.forEach((addressString) => {
        const address = addressUtils.fromString(addressString, config.port);
        this.addresses.push(address);
      });
    }
    this.nodes = new NodeList(new P2PRepository(logger, models));
  }

  public get peerCount(): number {
    return this.peers.length;
  }

  /**
   * Initialize the Pool by connecting to known nodes and listening to incoming peer connections, if configured to do so.
   */
  public init = async (handshakeData: HandshakeState): Promise<void> => {
    if (this.connected) {
      return;
    }

    if (this.server) {
      let externalIp: string | undefined;
      // Fetch the external IP if no address was specified by the user
      if (this.addresses.length === 0) {
        try {
          externalIp = await getExternalIp();

          this.logger.info(`retrieved external IP: ${externalIp}`);
        } catch (error) {
          this.logger.error(error.message);
        }
      }

      await this.listen();
      this.bindServer();

      if (externalIp) {
        this.addresses.push({
          host: externalIp,
          port: this.listenPort!,
        });
      }
    }

    this.handshakeData = handshakeData;
    this.handshakeData.addresses = this.addresses;

    this.logger.info('Connecting to known / previously connected peers');
    await this.nodes.load();
    this.connectNodes(this.nodes, false, true).then(() => {
      this.logger.info('Completed start-up connections to known peers.');
    }).catch((reason) => {
      this.logger.error('Unexpected error connecting to known peers on startup', reason);
    });

    this.verifyReachability();
    this.connected = true;
  }

  public disconnect = async (): Promise<void> => {
    if (!this.connected) {
      return;
    }

    // ensure we stop listening for new peers before disconnecting from peers
    if (this.server && this.server.listening) {
      await this.unlisten();
    }

    this.closePeers();

    this.connected = false;
  }

  private verifyReachability = () => {
    this.handshakeData.addresses!.forEach(async (address) => {
      const externalAddress = addressUtils.toString(address);
      this.logger.debug(`Verifying reachability of advertised address: ${externalAddress}`);
      try {
        const peer = new Peer(Logger.disabledLogger, address);
        await peer.open(this.handshakeData, this.handshakeData.nodePubKey);
        assert(false, errors.ATTEMPTED_CONNECTION_TO_SELF.message);
      } catch (err) {
        if (err.code === errors.ATTEMPTED_CONNECTION_TO_SELF.code) {
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
   * @param nodes a collection of nodes with a `forEach` iterator to attempt to connect to
   * @param ignoreKnown whether to ignore nodes we are already aware of, defaults to false
   * @param retryConnecting whether to attempt retry connecting, defaults to false
   * @returns a promise that will resolve when all outbound connections resolve
   */
  private connectNodes = (nodes: NodeConnectionIterator, ignoreKnown = false, retryConnecting = false) => {
    const connectionPromises: Promise<void>[] = [];
    nodes.forEach((node) => {
      // check that this node is not ourselves, that it has listening addresses,
      // and that either we haven't heard of it, or we're not ignoring known nodes and it's not banned
      if (node.nodePubKey !== this.handshakeData.nodePubKey && node.addresses.length > 0 &&
        (!this.nodes.has(node.nodePubKey) || (!ignoreKnown && !this.nodes.isBanned(node.nodePubKey)))) {
        connectionPromises.push(this.tryConnectNode(node, retryConnecting));
      }
    });
    return Promise.all(connectionPromises);
  }

  /**
   * Attempt to create an outbound connection to a node using its known listening addresses.
   */
  private tryConnectNode = async (node: NodeConnectionInfo, retryConnecting = false) => {
    const { addresses, nodePubKey } = node;

    // sort by lastConnected desc
    const sortedAddresses = [...addresses].sort((a, b) => {
      if (!a.lastConnected) return 1;
      if (!b.lastConnected) return -1;
      return b.lastConnected - a.lastConnected;
    });

    for (const address of sortedAddresses) {
      try {
        await this.addOutbound(address, nodePubKey, false);
        return; // once we've successfully established an outbound connection, stop attempting new connections
      } catch (err) {}
    }

    if (retryConnecting && sortedAddresses.length && sortedAddresses[0].lastConnected) {
      try {
        await this.addOutbound(sortedAddresses[0], nodePubKey, true);
      } catch (err) {}
    }
  }

  /**
   * Attempt to add an outbound peer by connecting to a given socket address.
   * Throws an error if a connection to a node with the given nodePubKey exists or
   * if the connection handshake shows a different nodePubKey than the one provided.
   * @param nodePubKey the nodePubKey of the node to connect to
   * @returns the connected peer
   */
  public addOutbound = async (address: Address, nodePubKey: string, retryConnecting: boolean): Promise<Peer> => {
    if (nodePubKey === this.handshakeData.nodePubKey) {
      const err = errors.ATTEMPTED_CONNECTION_TO_SELF;
      this.logger.warn(err.message);
      throw err;
    } else if (this.peers.has(nodePubKey)) {
      const err = errors.NODE_ALREADY_CONNECTED(nodePubKey, address);
      throw err;
    }

    const peer = new Peer(this.logger, address);
    await this.openPeer(peer, nodePubKey, retryConnecting);
    return peer;
  }

  public listPeers = (): PeerInfo[] => {
    const peerInfos: PeerInfo[] = Array.from({ length: this.peers.length });
    let i = 0;
    this.peers.forEach((peer) => {
      peerInfos[i] = peer.info;
      i += 1;
    });
    return peerInfos;
  }

  private tryOpenPeer = async (peer: Peer, nodePubKey?: string, retryConnecting = false): Promise<void> => {
    try {
      await this.openPeer(peer, nodePubKey, retryConnecting);
    } catch (err) {}
  }

  private openPeer = async (peer: Peer, nodePubKey?: string, retryConnecting = false): Promise<void> => {
    this.bindPeer(peer);
    try {
      await peer.open(this.handshakeData, nodePubKey, retryConnecting);
    } catch (err) {
      // we don't have `nodePubKey` for inbound connections, which might fail on handshake
      const id = nodePubKey || addressUtils.toString(peer.address);
      this.logger.warn(`error while opening connection to peer (${id}): ${err.message}`);

      if (err.code === errorCodes.CONNECTING_RETRIES_MAX_PERIOD_EXCEEDED) {
        await this.nodes.removeAddress(nodePubKey!, peer.address);
      }

      throw err;
    }
  }

  public closePeer = async (nodePubKey: string): Promise<void> => {
    const peer = this.peers.get(nodePubKey);
    if (peer) {
      peer.close();
      this.logger.info(`Disconnected from ${peer.nodePubKey}@${addressUtils.toString(peer.address)}`);
    } else {
      throw(errors.NOT_CONNECTED(nodePubKey));
    }
  }

  public sendToPeer = (nodePubKey: string, packet: Packet) => {
    const peer = this.peers.get(nodePubKey);
    if (!peer) {
      throw errors.NOT_CONNECTED(nodePubKey);
    }
    peer.sendPacket(packet);
  }

  public getPeer = (nodePubKey: string) => {
    const peer = this.peers.get(nodePubKey);
    if (!peer) {
      throw errors.NOT_CONNECTED(nodePubKey);
    }
    return peer;
  }

  public broadcastOrder = (order: OutgoingOrder) => {
    const orderPacket = new packets.OrderPacket(order);
    this.peers.forEach(peer => peer.sendPacket(orderPacket));

    // TODO: send only to peers which accepts the pairId
  }

  public broadcastOrderInvalidation = (order: OrderIdentifier) => {
    const orderInvalidationPacket = new packets.OrderInvalidationPacket(order);
    this.peers.forEach(peer => peer.sendPacket(orderInvalidationPacket));

    // TODO: send only to peers which accepts the pairId
  }

  private addInbound = async (socket: Socket) => {
    const peer = Peer.fromInbound(socket, this.logger);
    await this.tryOpenPeer(peer);
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
      case PacketType.ORDER: {
        const order = (packet as packets.OrderPacket).body!;
        this.logger.verbose(`received order from ${peer.nodePubKey}: ${JSON.stringify(order)}`);
        this.emit('packet.order', { ...order, peerPubKey: peer.nodePubKey } as StampedPeerOrder);
        break;
      }
      case PacketType.ORDER_INVALIDATION: {
        const order = (packet as packets.OrderInvalidationPacket).body!;
        this.logger.verbose(`canceled order from ${peer.nodePubKey}: ${JSON.stringify(order)}`);
        this.emit('packet.orderInvalidation', order);
        break;
      }
      case PacketType.GET_ORDERS: {
        this.emit('packet.getOrders', peer, packet.header.id);
        break;
      }
      case PacketType.ORDERS: {
        const orders = (packet as packets.OrdersPacket).body!;
        this.logger.verbose(`received ${orders.length} orders from ${peer.nodePubKey}`);
        orders.forEach((order) => {
          this.emit('packet.order', { ...order, peerPubKey: peer.nodePubKey } as StampedPeerOrder);
        });
        break;
      }
      case PacketType.GET_NODES: {
        this.handleGetNodes(peer, packet.header.id);
        break;
      }
      case PacketType.NODES: {
        const nodes = (packet as packets.NodesPacket).body!;
        await this.connectNodes(nodes);
        break;
      }
      case PacketType.DEAL_REQUEST: {
        this.logger.debug(`received dealRequest from ${peer.nodePubKey}: ${JSON.stringify(packet.body)}`);
        this.emit('packet.dealRequest', packet, peer);
        break;
      }
      case PacketType.DEAL_RESPONSE: {
        this.logger.debug(`received dealResponse from ${peer.nodePubKey}: ${JSON.stringify(packet.body)}`);
        this.emit('packet.dealResponse', packet, peer);
        break;
      }
      case PacketType.SWAP_REQUEST: {
        this.logger.debug(`received swapRequest from ${peer.nodePubKey}: ${JSON.stringify(packet.body)}`);
        this.emit('packet.swapRequest', packet, peer);
        break;
      }
      case PacketType.SWAP_RESPONSE: {
        this.logger.debug(`received swapResponse from ${peer.nodePubKey}: ${JSON.stringify(packet.body)}`);
        this.emit('packet.swapResponse', packet);
        break;
      }
    }
  }

  private handleOpen = async (peer: Peer): Promise<void> => {
    if (peer.nodePubKey === this.handshakeData.nodePubKey) {
      return;
    }

    if (this.nodes.isBanned(peer.nodePubKey!)) {
      // TODO: Ban IP address for this session if banned peer attempts repeated connections.
      peer.close();
    } else if (this.peers.has(peer.nodePubKey!)) {
      // TODO: Penalize peers that attempt to create duplicate connections to us
      peer.close();
    } else {
      this.peers.add(peer);

      // request peer's orders and known nodes
      peer.sendPacket(new packets.GetOrdersPacket());
      peer.sendPacket(new packets.GetNodesPacket());

      // if outbound, update the `lastConnected` field for the address we're actually connected to
      const addresses = peer.inbound ? peer.addresses! : peer.addresses!.map((address) => {
        if (addressUtils.areEqual(peer.address, address)) {
          return { ...address, lastConnected: Date.now() };
        } else {
          return address;
        }
      });

      // upserting the node entry
      if (!this.nodes.has(peer.nodePubKey!)) {
        await this.nodes.createNode({
          addresses,
          nodePubKey: peer.nodePubKey!,
        });
      } else {
        // the node is known, update its listening addresses
        await this.nodes.updateAddresses(peer.nodePubKey!, addresses);
      }
    }
  }

  /**
   * Responds to a [[GetNodesPacket]] by populating and sending a [[NodesPacket]].
   */
  private handleGetNodes = (peer: Peer, reqId: string) => {
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
    peer.sendNodes(connectedNodesInfo, reqId);
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

    peer.on('error', (err) => {
      // The only situation in which the node should be connected to itself is the
      // reachability check of the advertised addresses and we don't have to log that
      if (peer.nodePubKey !== this.handshakeData.nodePubKey) {
        this.logger.error(`peer error (${peer.nodePubKey}): ${err.message}`);
      }
    });

    peer.once('open', async () => {
      await this.handleOpen(peer);
    });

    peer.once('close', () => {
      if (peer.nodePubKey) {
        this.peers.remove(peer.nodePubKey);
      }
      this.emit('peer.close', peer);
    });

    peer.once('ban', async () => {
      this.logger.debug(`Banning peer (${peer.nodePubKey})`);
      if (peer.nodePubKey) {
        await this.nodes.ban(peer.nodePubKey);
      }
      if (peer.connected) {
        peer.close();
      }
    });
  }

  private closePeers = (): void => {
    this.peers.forEach(peer => peer.close());
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
        const { address, port } = this.server!.address();
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
    return new Promise<void>((resolve) => {
      this.server!.close(() => {
        resolve();
      });
    });
  }
}

export default Pool;
export { PoolConfig };
