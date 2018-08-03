import P2PRepository from './P2PRepository';
import SocketAddress from './SocketAddress';
import Host from './Host';
import Peer from './Peer';
import assert from 'assert';
import { HostFactory } from '../types/db';

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
   * Return an array of hosts that haven't been banned.
   */
  public toHostFactoryArray = (): HostFactory[] => {
    const hostValues = Object.values(this.hosts);
    const hostFactories: HostFactory[] = Array.from({ length: hostValues.length });
    for (let i = 0; i < hostValues.length; i += 1) {
      const hostValue = hostValues[i];
      hostFactories[i] = {
        address: hostValue.socketAddress.address,
        port: hostValue.socketAddress.port,
      };
    }
    return hostFactories;
  }

  /**
   * Get a host by a peer's socket address, or create the host if none exists.
   */
  public getOrCreateHost = async (peer: Peer): Promise<Host> => {
    const { socketAddress } = peer;
    assert(socketAddress instanceof SocketAddress);
    const host = this.hosts[socketAddress.toString()];
    return host || this.createHost({
      address: socketAddress.address,
      port: socketAddress.port,
    });
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
    const [hosts, bannedHosts] = await Promise.all([this.repository.getHosts(), this.repository.getBannedHosts()]);

    hosts.forEach((host) => {
      const address = new SocketAddress(host.address, host.port);
      this.hosts[address.toString()] = new Host(host);
    });

    this.bannedHosts = new Set<string>(bannedHosts.map(bannedHost => bannedHost.address));
  }

  private createHost = async (hostFactory: HostFactory): Promise<Host> => {
    const dbHost = await this.repository.addHost(hostFactory);
    const host = new Host(dbHost);
    this.hosts[host.socketAddress.toString()] = host;
    return host;
  }
}

export default HostList;
