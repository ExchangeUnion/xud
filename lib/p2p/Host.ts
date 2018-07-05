import SocketAddress from './SocketAddress';
import { db } from '../types';

class Host {
  public socketAddress: SocketAddress;
  public id: number;
  constructor(private instance: db.HostInstance) {
    this.socketAddress = new SocketAddress(instance.address, instance.port);
    this.id = instance.id;
  }
}

export default Host;
