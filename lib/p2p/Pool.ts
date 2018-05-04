import net, {Server, Socket} from 'net';
import {EventEmitter} from 'events';
import Peer from './Peer';
import Hosts from './Hosts';
import NetAddress from './NetAddress';
import Logger from '../Logger';

interface PoolConfig {
  listen: boolean,
  port: number,
}

/** A pool of peers for handling all network activity */
 class Pool extends EventEmitter {
  private peers: { [key :string] : Peer };
  private server: Server;
  private logger: Logger;
  private connected: boolean;
  private hosts: Hosts;

  constructor(private config: PoolConfig) {
    super();
    this.peers = {};
    this.logger = Logger.global;
    this.server = net.createServer();
    this.hosts = new Hosts();
    this.connected = false;

    this._init();
  }

  public connect = async (): Promise<void> => {
    if(this.connected)
      return;

    await this.hosts.init();

    // p2p bootstrap process here

    this.listen();
    this.connected = true;
  };

  public disconnect = async (): Promise<void> => {
    if(!this.connected)
      return;

    await this.unlisten();
    this.destroyPeers();

    this.connected = false;
  };

  public addOutbound = async (host: string, port: number): Promise<Peer> => {
    const address = new NetAddress(host, port);
    const peer = Peer.fromOutbound(address);

    this.bindPeer(peer);

    await peer.open();
    this.addPeer(peer);

    return peer;
  };

  public broadcastOrder = (order: any) => {
    Object.keys(this.peers).map(key => {
      this.peers[key].sendOrder(order);
    })
  };

  private _init = () => {
    this.server.on('error', (err) => {
      console.log('err: ' + err)
    });

    this.server.on('connection', (socket: Socket) => {
      this.handleSocket(socket);
    });

    this.server.on('listening', () => {
      const {address, port} = this.server.address();
      this.logger.info(`pool server listening on ${address}:${port}`);
    });
  };

  private addInbound = async (socket: Socket): Promise<Peer> => {
    const peer = Peer.fromInbound(socket);

    this.bindPeer(peer);

    await peer.open();
    this.addPeer(peer);

    return peer;
  };


  private handleSocket = (socket: Socket) => {
    if (!socket.remoteAddress) {
      this.logger.debug('Ignoring disconnected peer');
      socket.destroy();
      return;
    }

    const host = socket.remoteAddress;
    if (this.hosts.isBanned(host)) {
      this.logger.debug(`Ignoring banned peer (${host})`);
      socket.destroy();
      return;
    }

    this.addInbound(socket)
  };

  private handlePacket = (packet) => {
    // TODO: handle
    console.log('packet: ' + JSON.stringify(packet))
  };

  private bindPeer = (peer: Peer) => {
    peer.on('packet', (packet) => {
      this.handlePacket(packet);
    });

    peer.on('error', (err) => {
      this.logger.error('peer error', err);
    });

    peer.once('close', () => {
      this.removePeer(peer);
    });

    peer.once('ban', () => {
      this.logger.debug(`Banning peer (${peer.id})`);
      this.hosts.ban(peer.address.host);

      if (peer)
        peer.destroy();
    });
  };

  private addPeer = (peer: Peer): void => {
    if(this.peers[peer.id]) {
      this.logger.info(`Peer (${peer.id}) already exists`);
      return;
    }
    this.peers[peer.id] = peer;
  };

  private removePeer = (peer: Peer): void => {
    delete this.peers[peer.id];
  };

  private destroyPeers = (): void => {
    Object.keys(this.peers).map(key => {
      this.peers[key].destroy();
    });
  };

  private listen = (): void => {
    this.server.listen(this.config.port, '0.0.0.0');
  };

  private unlisten = async (): Promise<void> => {
    await this.server.close();
  };
}

export default Pool;