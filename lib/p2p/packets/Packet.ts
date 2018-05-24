import PacketType from './PacketType';

abstract class Packet {
  public abstract type: PacketType;
  public abstract body: any;
  public abstract toRaw(): string;
}

export default Packet;
