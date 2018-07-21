import { EventEmitter } from 'events';
import { packetUtils } from './packets';

class ParserError {
  constructor(public type: ParserErrorType, public payload: string) { }
}

enum ParserErrorType {
  UNPARSABLE_MESSAGE,
  UNKNOWN_PACKET_TYPE,
}

/** Protocol packet parser */
class Parser extends EventEmitter {
  public feed = (data): void => {
    const dataStr = data.toString();
    const packets = dataStr.split('\r\n');
    packets.forEach((packet) => {
      if (!packet) {
        return;
      }
      const typeStr = dataStr.split(' ', 1)[0];
      const packetStr = dataStr.substring(typeStr.length + 1);
      try {
        const packet = packetUtils.fromRaw(typeStr, packetStr);
        if (packet) {
          this.emit('packet', packet);
        } else {
          this.emit('error', new ParserError(ParserErrorType.UNKNOWN_PACKET_TYPE, typeStr));
        }
      } catch (err) {
        this.emit('error', new ParserError(ParserErrorType.UNPARSABLE_MESSAGE, `${dataStr}: ${err}`));
      }
    });
  }
}

export default Parser;
export { ParserError, ParserErrorType };
