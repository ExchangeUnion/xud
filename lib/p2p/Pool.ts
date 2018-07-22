import net, { Server, Socket } from 'net';
import { EventEmitter } from 'events';
import errors from './errors';
import Peer, { ConnectionDirection, HandshakeState } from './Peer';
import HostList from './HostList';
import SocketAddress from './SocketAddress';
import PeerList from './PeerList';
import P2PRepository from './P2PRepository';
import { Packet, PacketType, OrderPacket, GetOrdersPacket } from './packets';
import { PeerOrder, OutgoingOrder } from '../types/orders';
import DB from '../db/DB';
import Logger from '../Logger';

type PoolConfig = {
  listen: boolean;
  port: number;
};

/** A pool of peers for handling all network activity */
class Pool extends EventEmitter {
  private hosts: HostList;
  private peers: PeerList = new PeerList();
  private server: Server = net.createServer();
  private logger: Logger = Logger.p2p;
  private connected: boolean = false;

  constructor(private config: PoolConfig, db: DB) {
    super();

    this.hosts = new HostList(new P2PRepository(db));
  }

  get peerCount(): number {
    return this.peers.length;
  }

  /**
   * Initialize the Pool by connecting to known hosts and listening to incoming peer connections, if configured to do so.
   */
  public init = async (): Promise<void> => {
    if (this.connected) {
      return;
    }

    await this.hosts.load();
    for (const host of this.hosts.toArray()) {
      this.addOutbound(host.socketAddress);
    }

    if (this.config.listen) {
      this.bindServer(this.server);
      this.listen();
    }

    this.connected = true;
  }

  public disconnect = async (): Promise<void> => {
    if (!this.connected) {
      return;
    }

    if (this.config.listen) {
      await this.unlisten();
    }

    this.destroyPeers();

    this.connected = false;
  }

  /**
   * Attempt to add an outbound peer by connecting to a given SocketAddress.
   * Throws an error if a connection already exists for the provided address.
   */
  public addOutbound = async (socketAddress: SocketAddress): Promise<Peer> => {
    if (this.peers.has(socketAddress)) {
      const err = errors.ADDRESS_ALREADY_CONNECTED(socketAddress.address);
      this.logger.info(err.message);
      throw err;
    }

    const peer = Peer.fromOutbound(socketAddress);
    await this.tryConnectPeer(peer);
    return peer;
  }

  private tryConnectPeer = async (peer: Peer): Promise<void> => {
    try {
      await this.connectPeer(peer);
    } catch (err) {
      this.logger.info(`connectPeer failed: ${err}`);
    }
  }

  private connectPeer = async (peer: Peer): Promise<void> => {
    this.bindPeer(peer);
    await peer.open();
    this.peers.add(peer);
  }

  public broadcastOrder = (order: OutgoingOrder) => {
    const orderPacket = new OrderPacket(order);
    this.peers.forEach(peer => peer.sendPacket(orderPacket));
  }

  private addInbound = async (socket: Socket): Promise<Peer> => {
    const peer = Peer.fromInbound(socket);
    await this.connectPeer(peer);
    return peer;
  }

  private handleSocket = (socket: Socket) => {
    if (!socket.remoteAddress) { // client disconnected, socket is destroyed
      this.logger.debug('Ignoring disconnected peer');
      socket.destroy();
      return;
    }

    if (this.hosts.isBanned(socket.remoteAddress)) {
      this.logger.debug(`Ignoring banned peer (${socket.remoteAddress})`);
      socket.destroy();
      return;
    }

    this.addInbound(socket);
  }

  private handlePacket = (peer: Peer, packet: Packet) => {
    switch (packet.type) {
      case PacketType.ORDER: {
        const order: PeerOrder = { ...packet.body, hostId: peer.id };
        this.emit('packet.order', order);
        break;
      }
      case PacketType.GET_ORDERS: {
        this.emit('packet.getOrders', peer);
        break;
      }
      case PacketType.ORDERS: {
        const { orders } = (packet as OrdersPacket).body;
        orders.forEach((order) => {
          this.emit('packet.order', { ...order, hostId: peer.id });
        });
        break;
      }
    }
  }

  private handleOpen = async (peer: Peer, handshakeState: HandshakeState): Promise<void> => {
    this.setPeerHost(peer, handshakeState.listenPort);
    peer.sendPacket(new GetOrdersPacket({}));
  }

  private setPeerHost = async (peer: Peer, listenPort?: number): Promise<void> => {
    if (peer.direction === ConnectionDirection.OUTBOUND) {
      const host = await this.hosts.getOrCreateHost(peer.socketAddress);
      peer.setHost(host);
    } else if (peer.direction === ConnectionDirection.INBOUND && listenPort) {
      const socketAddress = new SocketAddress(peer.socketAddress.address, listenPort);
      const host = await this.hosts.getOrCreateHost(socketAddress);
      peer.setHost(host);
    }
  }

  private bindServer = (server: Server) => {
    server.on('error', (err) => {
      console.log('err: ' + err);
    });

    server.on('connection', (socket: Socket) => {
      this.handleSocket(socket);
    });

    server.on('listening', () => {
      const { address, port } = this.server.address();
      this.logger.info(`pool server listening on ${address}:${port}`);
    });
  }

  private bindPeer = (peer: Peer) => {
    peer.on('packet', (packet) => {
      this.handlePacket(peer, packet);
    });

    peer.on('error', (err) => {
      this.logger.error('peer error', err);
    });

    peer.once('open', (handshakeState: HandshakeState) => {
      this.handleOpen(peer, handshakeState);
    });

    peer.once('close', () => {
      this.peers.remove(peer);
    });

    peer.once('ban', () => {
      this.logger.debug(`Banning peer (${peer.id})`);
      this.hosts.ban(peer);

      if (peer) {
        peer.destroy();
      }
    });
  }

  private destroyPeers = (): void => {
    this.peers.forEach(peer => peer.destroy());
  }

  private listen = (): void => {
    this.server.listen(this.config.port, '0.0.0.0');
  }

  private unlisten = async (): Promise<void> => {
    await this.server.close();
  }
}

export default Pool;
export { PoolConfig };
