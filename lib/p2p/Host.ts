import SocketAddress from './SocketAddress';
import { db } from '../types';

class Host {
  public socketAddress: SocketAddress;

  constructor(private instance: db.HostInstance) {
    this.socketAddress = new SocketAddress(instance.address, instance.port);
  }
}

export default Host;
