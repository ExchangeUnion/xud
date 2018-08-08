import net, { Server, Socket } from 'net';
import { EventEmitter } from 'events';
import errors from './errors';
import Peer, { PeerInfo } from './Peer';
import HostList from './HostList';
import SocketAddress from './SocketAddress';
import PeerList from './PeerList';
import P2PRepository from './P2PRepository';
import { Packet, PacketType, OrderPacket, OrderInvalidationPacket, GetOrdersPacket, HostsPacket, OrdersPacket, GetHostsPacket } from './packets';
import { PeerOrder, OutgoingOrder, OrderIdentifier } from '../types/orders';
import DB from '../db/DB';
import Logger from '../Logger';
import { HandshakeState } from '../types/p2p';

type PoolConfig = {
  listen: boolean;
  port: number;
};

interface Pool {
  on(event: 'packet.order', listener: (order: PeerOrder) => void);
  on(event: 'packet.getOrders', listener: (peer: Peer, reqId: string) => void);
  on(event: 'packet.orderInvalidation', listener: (orderInvalidation: OrderIdentifier) => void);
  on(event: 'peer.close', listener: (peer: Peer) => void);
  emit(event: 'packet.order', order: PeerOrder);
  emit(event: 'packet.getOrders', peer: Peer, reqId: string);
  emit(event: 'packet.orderInvalidation', orderInvalidation: OrderIdentifier);
  emit(event: 'peer.close', peer: Peer);
}

/** A pool of peers for handling all network activity */
class Pool extends EventEmitter {
  private hosts: HostList;
  private peers: PeerList = new PeerList();
  private server: Server = net.createServer();
  private logger: Logger = Logger.p2p;
  private connected: boolean = false;
  private handshakeData!: HandshakeState;

  constructor(private config: PoolConfig, db: DB) {
    super();

    this.hosts = new HostList(new P2PRepository(db));
  }

  public get peerCount(): number {
    return this.peers.length;
  }

  /**
   * Initialize the Pool by connecting to known hosts and listening to incoming peer connections, if configured to do so.
   */
  public init = async (handshakeData: HandshakeState): Promise<void> => {
    if (this.connected) {
      return;
    }

    this.handshakeData = handshakeData;

    this.logger.info('Connecting to known / previously connected peers');
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

    this.closePeers();

    this.connected = false;
  }

  /**
   * Attempt to add an outbound peer by connecting to a given SocketAddress.
   * Throws an error if a connection already exists for the provided address.
   * If the connection is successful, send a [[GetHostsPacket]] to discover new XUD hosts to connect to.
   */
  public addOutbound = async (socketAddress: SocketAddress): Promise<Peer> => {
    if (this.peers.has(socketAddress)) {
      const err = errors.ADDRESS_ALREADY_CONNECTED(socketAddress.address);
      this.logger.info(err.message);
      throw err;
    }

    const peer = Peer.fromOutbound(socketAddress);
    await this.tryOpenPeer(peer);
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

  private tryOpenPeer = async (peer: Peer): Promise<void> => {
    try {
      await this.openPeer(peer);
    } catch (err) {
      this.logger.warn(`error while connecting to peer ${peer.id}: ${err}`);
    }
  }

  private openPeer = async (peer: Peer): Promise<void> => {
    this.bindPeer(peer);
    await peer.open(this.handshakeData);
    this.peers.add(peer);
  }

  public closePeer = async (address: string, port: number): Promise<void> => {
    const socketAddress = new SocketAddress(address, port);
    const peer = this.peers.get(socketAddress);
    if (peer) {
      peer.close();
    } else {
      throw(errors.NOT_CONNECTED(socketAddress.toString()));
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

  private addInbound = async (socket: Socket): Promise<Peer> => {
    const peer = Peer.fromInbound(socket);
    await this.openPeer(peer);
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
        const order = (packet as OrderPacket).body!;
        this.emit('packet.order', { ...order, peerId: peer.id } as PeerOrder);
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
          this.emit('packet.order', { ...order, peerId: peer.id } as PeerOrder);
        });
        break;
      }
      case PacketType.GET_HOSTS: {
        peer.sendHosts(this.hosts.toHostFactoryArray(), packet.header.id);
        break;
      }
      case PacketType.HOSTS: {
        const hosts = (packet as HostsPacket).body!;
        hosts.forEach(async (host) => {
          try {
            await this.addOutbound(new SocketAddress(host.address, host.port));
          } catch (err) {
            this.logger.info(err);
          }
        });
        break;
      }
    }
  }

  private handleOpen = async (peer: Peer, handshakeState: HandshakeState): Promise<void> => {
    this.setPeerHost(peer, handshakeState.listenPort);

    // request peer's orders and known hosts
    peer.sendPacket(new GetOrdersPacket());
    peer.sendPacket(new GetHostsPacket());
  }

  private setPeerHost = async (peer: Peer, listenPort?: number): Promise<void> => {
    if (!peer.inbound) {
      const host = await this.hosts.getOrCreateHost(peer);
      peer.setHost(host);
    } else if (listenPort) {
      const socketAddress = new SocketAddress(peer.socketAddress.address, listenPort);
      const host = await this.hosts.getOrCreateHost(peer);
      peer.setHost(host);
    }
  }

  private bindServer = (server: Server) => {
    server.on('error', (err) => {
      console.log('err: ' + err);
    });

    server.on('connection', (socket) => {
      this.handleSocket(socket);
    });

    server.on('listening', () => {
      const { address, port } = this.server.address();
      this.logger.info(`p2p server listening on ${address}:${port}`);
    });
  }

  private bindPeer = (peer: Peer) => {
    peer.on('packet', (packet) => {
      this.handlePacket(peer, packet);
    });

    peer.on('error', (err) => {
      this.logger.error(`peer error (${peer.id}): ${err.message}`);
    });

    peer.once('open', (handshakeState) => {
      this.handleOpen(peer, handshakeState);
    });

    peer.once('close', () => {
      this.peers.remove(peer.socketAddress);
      this.emit('peer.close', peer);
    });

    peer.once('ban', () => {
      this.logger.debug(`Banning peer (${peer.id})`);
      this.hosts.ban(peer);

      if (peer) {
        peer.close();
      }
    });
  }

  private closePeers = (): void => {
    this.peers.forEach(peer => peer.close());
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
