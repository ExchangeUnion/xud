import PacketType from './PacketType';

abstract class Packet {
  public abstract type: PacketType;
  public abstract body: any;
  public abstract responseType?: PacketType;
  public abstract responseTimeout?: number;
  public abstract toRaw(): string;
}

export default Packet;
