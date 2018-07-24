import P2PRepository from './P2PRepository';
import SocketAddress from './SocketAddress';
import Host from './Host';
import Peer from './Peer';

/** Represents a list of hosts for managing network peers activity */
class HostList {
  public hosts: { [ address: string ]: Host } = {};
  public bannedHosts!: Set<string>;

  constructor(private repository: P2PRepository) {}

  /**
   * Return an array of hosts that haven't been banned.
   */
  public toArray = (): Host[] => {
    const hosts: Host[] = [];
    Object.keys(this.hosts).map((socketAddress) => {
      if (!this.bannedHosts.has(SocketAddress.fromString(socketAddress).address)) {
        hosts.push(this.hosts[socketAddress]);
      }
    });
    return hosts;
  }

  /**
   * Get a host by socket address, or create the host if none exists.
   */
  public getOrCreateHost = async (socketAddress: SocketAddress): Promise<Host> => {
    const host = this.hosts[socketAddress.toString()];
    return host || this.createHost(socketAddress);
  }

  public ban = async (peer: Peer): Promise<void> => {
    const { address } = peer.socketAddress;
    this.bannedHosts.add(address);
    await this.repository.addBannedHost({ address });
  }

  public isBanned = (address: string): boolean => {
    return this.bannedHosts.has(address);
  }

  /**
   * Load this HostList from the database
   */
  public load = async (): Promise<void> => {
    const [hosts, bannedHosts] =  await Promise.all([this.repository.getHosts(), this.repository.getBannedHosts()]);

    hosts.forEach((host) => {
      const address = new SocketAddress(host.address, host.port);
      this.hosts[address.toString()] = new Host(host);
    });

    this.bannedHosts = new Set<string>(bannedHosts.map(bannedHost => bannedHost.address));
  }

  private createHost = async (socketAddress: SocketAddress): Promise<Host> => {
    const dbHost = await this.repository.addHost(socketAddress);
    const host = new Host(dbHost);
    this.hosts[host.socketAddress.toString()] = host;
    return host;
  }
}

export default HostList;
