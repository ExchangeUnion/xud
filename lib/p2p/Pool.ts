import net, { Server, Socket } from 'net';
import { EventEmitter } from 'events';
import errors from './errors';
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
import SwapDeals, { SwapDeal } from '../orderbook/SwapDeals';
import { getExternalIp } from '../utils/utils';
import { randomBytes, createHash } from 'crypto';
import { SwapDealRole } from '../types/enums';
import LndClient from '../lndclient/LndClient';
import * as lndrpc from '../proto/lndrpc_pb';

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
  emit(event: 'packet.order', order: StampedPeerOrder): boolean;
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
  /** The local handshake data to be sent to newly connected peers. */
  public handshakeData!: HandshakeState;
  public swapDeals = new SwapDeals();
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

  constructor(config: PoolConfig, private logger: Logger, models: Models, private lndBtcClient?: LndClient, private lndLtcClient?: LndClient) {
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

    if (this.listenPort) {
      // Append the external IP if no address was specified by the user
      if (this.addresses.length === 0) {
        try {
          // TODO: verify that this address is reachable
          const externlIp = await getExternalIp();

          this.logger.info(`retrieved external IP: ${externlIp}`);

          this.addresses.push({
            host: externlIp,
            port: this.listenPort,
          });

        } catch (error) {
          this.logger.error(error.message);
        }
      }
    }

    this.handshakeData = handshakeData;
    this.handshakeData.addresses = this.addresses;

    this.logger.info('Connecting to known / previously connected peers');
    await this.nodes.load();
    this.connectNodes(this.nodes).then(() => {
      this.logger.info('Completed start-up connections to known peers.');
    }).catch((reason) => {
      this.logger.error('Unexpected error connecting to known peers on startup', reason);
    });

    if (this.server && this.listenPort) {
      await this.listen(this.listenPort);
      this.bindServer();
    }

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
        this.handleDealRequest(packet, peer);
        break;
      }
      case PacketType.DEAL_RESPONSE: {
        this.handleDealResponse(packet, peer);
        break;
      }
      case PacketType.SWAP_REQUEST: {
        await this.handleSwapRequest(packet, peer);
        break;
      }
      case PacketType.SWAP_RESPONSE: {
        this.handleSwapResponse(packet);
        break;
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

  private handleDealRequest = (requestPacket: packets.DealRequest, peer: Peer)  => {
    this.logger.debug('[SWAP] Received packet: ' + JSON.stringify(requestPacket));
    const requestBody = requestPacket.body;
    if (!requestBody) {
      return;
    }
    const r_preimage = randomBytes(32);
    const hash = createHash('sha256');
    const r_hash = hash.update(r_preimage).digest('hex');
    const makerDealId = randomBytes(32).toString('hex');
    let makerPubKey: string | undefined;

    switch (requestBody.makerCurrency){
      case 'BTC':
        makerPubKey = this.handshakeData.lndbtcPubKey;
        break;
      case 'LTC':
        makerPubKey = this.handshakeData.lndltcPubKey;
        break;
      default:
        return;
    }

    if (!makerPubKey) {
      // TODO: proper error handling.
      return;
    }

    const deal: SwapDeal = {
      ...requestBody,
      makerDealId,
      makerPubKey,
      r_hash,
      r_preimage: r_preimage.toString('hex'),
      myRole: SwapDealRole.Maker,
      createTime: Date.now(),
    };

    const responseBody = {
      makerPubKey,
      makerDealId,
      r_hash,
      takerDealId: requestBody.takerDealId,
    };

    this.swapDeals.add(deal);
    this.logger.debug('[SWAP] Deal: ' + JSON.stringify(deal));

    this.logger.debug('[SWAP] Responding to peer: ' + JSON.stringify(responseBody));

    const responsePacket = new packets.DealResponse(responseBody, requestPacket.header.id);

    peer.sendPacket(responsePacket);
  }

  private handleDealResponse = (dealResponsePacket: packets.DealResponse, peer: Peer): void  => {
    if (!dealResponsePacket.body) {
      return;
    }
    const deal = this.swapDeals.get(SwapDealRole.Taker, dealResponsePacket.body.takerDealId);
    if (!deal) {
      return;
    }

    deal.makerPubKey = dealResponsePacket.body.makerPubKey;
    deal.makerDealId = dealResponsePacket.body.makerDealId;
    deal.r_hash = dealResponsePacket.body.r_hash;
    this.logger.debug('[SWAP] Updated deal: ' + JSON.stringify(this.swapDeals.get(SwapDealRole.Taker, dealResponsePacket.body.takerDealId)));

    const body: packets.SwapRequestPacketBody = {
      makerDealId: deal.makerDealId,
    };
    const swapRequestPacket = new packets.SwapRequest(body);

    peer.sendPacket(swapRequestPacket);
  }

  private handleSwapRequest = async (requestPacket: packets.SwapRequest, peer: Peer)  => {
    this.logger.debug('[SWAP] Received packet: ' + JSON.stringify(requestPacket));
    if (!requestPacket.body) {
      return;
    }

    const deal = this.swapDeals.get(SwapDealRole.Maker, requestPacket.body.makerDealId);
    if (!deal) {
      // TODO: respond with a failure message, possibly penalize peer
      return;
    }
    if (!deal.r_hash) {
      // TODO: respond with a failure message, possibly penalize peer
      return;
    }

    let cmdLnd = this.lndLtcClient;

  	switch (deal.makerCurrency) {
    case 'BTC':
      break;
    case 'LTC':
      cmdLnd = this.lndBtcClient;
      break;
  	}
  	if (!cmdLnd) {
  	  return;
  	}

    const request = new lndrpc.SendRequest();
  	request.setAmt(deal.takerAmount);
  	request.setDestString(deal.takerPubKey);
  	request.setPaymentHashString(deal.r_hash);

    // TODO: use timeout on call

    try {
      const response = await cmdLnd.sendPaymentSync(request);
      if (response.getPaymentError()) {
        this.logger.error(`Got error from sendPaymentSync: ${response.getPaymentError()} ${JSON.stringify(request.toObject())}`);
        return;
      }

      const body: packets.SwapResponsePacketBody = {
        r_preimage: Buffer.from(response.getPaymentPreimage_asB64(), 'base64').toString('hex'),
      };
      const swapResponsePacket = new packets.SwapResponse(body, requestPacket.header.id);

      this.logger.debug(`Responding to peer: ${JSON.stringify(body)}`);

      peer.sendPacket(swapResponsePacket);
    } catch (err) {
      this.logger.error(`Got exception from sendPaymentSync ${JSON.stringify(request.toObject())}`, err);
    }
  }

  private handleSwapResponse = (response: packets.SwapResponse): void  => {
    // TODO: Remove this method as it only exists for debugging/logging purposes
    if (!response) {
      return;
    }
    if (!response.body) {
      return;
    }
    this.logger.debug('[SWAP] Swap completed. preimage = ' + response.body.r_preimage);
  }

  private handleOpen = async (peer: Peer): Promise<void> => {
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

  /**
   * Start listening for incoming p2p connections on the given port.
   * @return a promise that resolves once the server is listening, or rejects if it fails to listen
   */
  private listen = (port: number) => {
    return new Promise<void>((resolve, reject) => {
      const listenErrHandler = (err: Error) => {
        reject(err);
      };

      this.server!.listen(port, '0.0.0.0').on('listening', () => {
        const { address, port } = this.server!.address();
        this.logger.info(`p2p server listening on ${address}:${port}`);

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
