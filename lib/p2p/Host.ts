import assert from 'assert';
import SocketAddress from './SocketAddress';
import { db } from '../types';

class Host {
  public socketAddress: SocketAddress;

  public get id(): number {
    assert(this.instance);
    return this.instance.id;
  }

  constructor(private instance: db.HostInstance) {
    this.socketAddress = new SocketAddress(instance.address, instance.port);
  }
}

export default Host;
