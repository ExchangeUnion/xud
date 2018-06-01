import P2PRepository from './P2PRepository';
import SocketAddress from './SocketAddress';
import Host from './Host';

/** Represents a list of hosts for managing network peers activity */
class HostList {
  public hosts: { [ socketAddress: string ]: Host } = {};
  public bannedHosts!: Set<string>;
  private loaded: boolean = false;

  constructor(private repository: P2PRepository) {}

  public get = async (): Promise<Host[]> => {
    if (!this.loaded) {
      await this.load();
    }

    const hosts: Host[] = [];
    Object.keys(this.hosts).map((socketAddress) => {
      if (!this.bannedHosts.has(SocketAddress.fromString(socketAddress).address)) {
        hosts.push(this.hosts[socketAddress]);
      }
    });
    return hosts;
  }

  public getOrCreate = async (socketAddress: SocketAddress): Promise<Host> => {
    const host = this.hosts[socketAddress.toString()];
    return host || this.create(socketAddress);
  }

  public ban = async (address: string): Promise<void> => {
    this.bannedHosts.add(address);
    await this.repository.addBannedHost({ address });
  }

  public isBanned = (address: string): boolean => {
    return this.bannedHosts.has(address);
  }

  private load = async (): Promise<void> => {
    const [hosts, bannedHosts] =  await Promise.all([this.repository.getHosts(), this.repository.getBannedHosts()]);

    hosts.forEach((host) => {
      const address = new SocketAddress(host.address, host.port);
      this.hosts[address.toString()] = new Host(host);
    });

    this.bannedHosts = new Set<string>(bannedHosts.map(bannedHost => bannedHost.address));

    this.loaded = true;
  }

  private create = async (socketAddress: SocketAddress): Promise<Host> => {
    const dbHost = await this.repository.addHost(socketAddress);
    const host = new Host(dbHost);
    this.hosts[host.socketAddress.toString()] = host;
    return host;
  }
}

export default HostList;
