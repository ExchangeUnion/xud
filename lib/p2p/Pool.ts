import net, { Server, Socket } from 'net';
import { EventEmitter } from 'events';
import errors from './errors';
import Peer, { PeerInfo } from './Peer';
import NodeList from './NodeList';
import PeerList from './PeerList';
import P2PRepository from './P2PRepository';
import { Packet, PacketType, OrderPacket, OrderInvalidationPacket, GetOrdersPacket, NodesPacket, OrdersPacket, GetNodesPacket } from './packets';
import { PeerOrder, OutgoingOrder, OrderIdentifier } from '../types/orders';
import DB from '../db/DB';
import Logger from '../Logger';
import { HandshakeState, Address, NodeConnectionInfo } from '../types/p2p';
import addressUtils from '../utils/addressUtils';

type PoolConfig = {
  listen: boolean;
  port: number;
  addresses: string[];
};

interface Pool {
  on(event: 'packet.order', listener: (order: PeerOrder) => void): this;
  on(event: 'packet.getOrders', listener: (peer: Peer, reqId: string) => void): this;
  on(event: 'packet.orderInvalidation', listener: (orderInvalidation: OrderIdentifier) => void): this;
  on(event: 'peer.close', listener: (peer: Peer) => void): this;
  emit(event: 'packet.order', order: PeerOrder): boolean;
  emit(event: 'packet.getOrders', peer: Peer, reqId: string): boolean;
  emit(event: 'packet.orderInvalidation', orderInvalidation: OrderIdentifier): boolean;
  emit(event: 'peer.close', peer: Peer): boolean;
}

/** An interface for an object with a `forEach` method that iterates over [[NodeConnectionInfo]] objects. */
interface NodeConnectionIterator {
  forEach: (callback: (node: NodeConnectionInfo) => void) => void;
}

/** A class representing a pool of peers that handles network activity. */
class Pool extends EventEmitter {
  private nodes: NodeList;
  private peers: PeerList = new PeerList();
  private server: Server = net.createServer();
  private connected = false;
  /** The local handshake data to be sent to newly connected peers. */
  private handshakeData!: HandshakeState;
  /** The port on which to listen for peer connections, undefined if this node is not listening. */
  private listenPort?: number;
  /** This node's listening external socket addresses to advertise to peers. */
  private addresses?: Address[];

  constructor(config: PoolConfig, private logger: Logger, db: DB) {
    super();

    if (config.listen) {
      this.listenPort = config.port;
      this.addresses = [];
      config.addresses.forEach((addressString) => {
        const address = addressUtils.fromString(addressString, config.port);
        this.addresses!.push(address);
      });
    }
    this.nodes = new NodeList(new P2PRepository(logger, db));
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

    this.handshakeData = handshakeData;
    this.handshakeData.addresses = this.addresses;

    this.logger.info('Connecting to known / previously connected peers');
    await this.nodes.load();
    await this.connectNodes(this.nodes);

    if (this.listenPort) {
      this.bindServer(this.server);
      this.listen(this.listenPort);
    }

    this.connected = true;
  }

  public disconnect = async (): Promise<void> => {
    if (!this.connected) {
      return;
    }

    if (this.listenPort) {
      await this.unlisten();
    }

    this.closePeers();

    this.connected = false;
  }

  /**
   * Iterate over a collection of nodes and attempt to connect to them.
   * If the node is banned, already connected, or has no listening addresses, then do nothing.
   * @param nodes a collection of nodes with a `forEach` iterator to attempt to connect to
   * @param ignoreKnown whether to ignore nodes we are already aware of, defaults to false
   * @returns a promise that will resolve when all outbound connections resolve
   */
  private connectNodes = (nodes: NodeConnectionIterator, ignoreKnown = false) => {
    const connectionPromises: Promise<void>[] = [];
    nodes.forEach((node) => {
      // check that this node is not ourselves, that it has listening addresses,
      // and that either we haven't heard of it, or we're not ignoring known nodes and it's not banned
      if (node.nodePubKey !== this.handshakeData.nodePubKey && node.addresses.length > 0 &&
        (!this.nodes.has(node.nodePubKey) || (!ignoreKnown && !this.nodes.isBanned(node.nodePubKey)))) {
        connectionPromises.push(this.connectNode(node));
      }
    });
    return Promise.all(connectionPromises);
  }

  /**
   * Attempt to create an outbound connection to a node using its known listening addresses.
   */
  private connectNode = async ({ addresses, nodePubKey }: NodeConnectionInfo) => {
    for (let n = 0; n < addresses.length; n += 1) {
      try {
        await this.addOutbound(addresses[n], nodePubKey);
        break; // once we've successfully established an outbound connection, stop attempting new connections
      } catch (err) {
        this.logger.info(err);
      }
    }
  }

  /**
   * Attempt to add an outbound peer by connecting to a given socket address.
   * Throws an error if a connection to a node with the given nodePubKey exists or
   * if the connection handshake shows a different nodePubKey than the one provided.
   * @param nodePubKey the nodePubKey of the node to connect to
   * @returns the connected peer
   */
  public addOutbound = async (address: Address, nodePubKey: string): Promise<Peer> => {
    if (nodePubKey === this.handshakeData.nodePubKey) {
      const err = errors.ATTEMPTED_CONNECTION_TO_SELF;
      this.logger.warn(err.message);
      throw err;
    } else if (this.peers.has(nodePubKey)) {
      const err = errors.NODE_ALREADY_CONNECTED(nodePubKey, address.host);
      this.logger.warn(err.message);
      throw err;
    }

    const peer = Peer.fromOutbound(address, this.logger);
    await this.tryOpenPeer(peer, nodePubKey);
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

  private tryOpenPeer = async (peer: Peer, nodePubKey?: string): Promise<void> => {
    try {
      await this.openPeer(peer, nodePubKey);
    } catch (err) {
      this.logger.warn(`error while opening connection to peer ${nodePubKey}: ${err.message}`);
    }
  }

  private openPeer = async (peer: Peer, nodePubKey?: string): Promise<void> => {
    this.bindPeer(peer);
    await peer.open(this.handshakeData, nodePubKey);
    this.peers.add(peer);
  }

  public closePeer = async (nodePubKey: string): Promise<void> => {
    const peer = this.peers.get(nodePubKey);
    if (peer) {
      peer.close();
      this.logger.info(`Disconnected from ${peer.nodePubKey} @ ${addressUtils.toString(peer.socketAddress)}`);
    } else {
      throw(errors.NOT_CONNECTED(nodePubKey));
    }
  }

  public broadcastOrder = (order: OutgoingOrder) => {
    const orderPacket = new OrderPacket(order);
    this.peers.forEach(peer => peer.sendPacket(orderPacket));

    // TODO: send only to peers which accepts the pairId
  }

  public broadcastOrderInvalidation = (order: OrderIdentifier) => {
    const orderInvalidationPacket = new OrderInvalidationPacket(order);
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
        const order = (packet as OrderPacket).body!;
        this.emit('packet.order', { ...order, peerPubKey: peer.nodePubKey } as PeerOrder);
        break;
      }
      case PacketType.ORDER_INVALIDATION: {
        this.emit('packet.orderInvalidation', (packet as OrderInvalidationPacket).body!);
        break;
      }
      case PacketType.GET_ORDERS: {
        this.emit('packet.getOrders', peer, packet.header.id);
        break;
      }
      case PacketType.ORDERS: {
        const orders = (packet as OrdersPacket).body!;
        orders.forEach((order) => {
          this.emit('packet.order', { ...order, peerPubKey: peer.nodePubKey } as PeerOrder);
        });
        break;
      }
      case PacketType.GET_NODES: {
        peer.sendNodes(this.nodes.toConnectionInfoArray(), packet.header.id);
        break;
      }
      case PacketType.NODES: {
        const nodes = (packet as NodesPacket).body!;
        await this.connectNodes(nodes);
        break;
      }
    }
  }

  private handleOpen = async (peer: Peer): Promise<void> => {
    if (this.nodes.isBanned(peer.nodePubKey!)) {
      // TODO: Ban IP address for this session if banned peer attempts repeated connections.
      peer.close();
    } else if (this.peers.has(peer.nodePubKey!)) {
      // TODO: Penalize peers that attempt to create duplicate connections to us
      peer.close();
    } else {
      // request peer's orders and known nodes
      peer.sendPacket(new GetOrdersPacket());
      peer.sendPacket(new GetNodesPacket());

      if (!this.nodes.has(peer.nodePubKey!)) {
        await this.nodes.createNode({
          nodePubKey: peer.nodePubKey!,
          addresses: peer.addresses!,
        });
      } else {
        // the node is known, update its listening addresses
        await this.nodes.updateAddresses(peer.nodePubKey!, peer.addresses);
      }
    }
  }

  private bindServer = (server: Server) => {
    server.on('error', (err) => {
      console.log('err: ' + err);
    });

    server.on('connection', async (socket) => {
      await this.handleSocket(socket);
    });

    server.on('listening', () => {
      const { address, port } = this.server.address();
      this.logger.info(`p2p server listening on ${address}:${port}`);
    });
  }

  private bindPeer = (peer: Peer) => {
    peer.on('packet', async (packet) => {
      await this.handlePacket(peer, packet);
    });

    peer.on('error', (err) => {
      this.logger.error(`peer error (${peer.nodePubKey}): ${err.message}`);
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

  private listen = (port: number): void => {
    this.server.listen(port, '0.0.0.0');
  }

  private unlisten = async (): Promise<void> => {
    this.server.close();
  }
}

export default Pool;
export { PoolConfig };
