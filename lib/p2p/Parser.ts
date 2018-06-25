import { EventEmitter } from 'events';
import { packetUtils } from './packets';

class ParserError {
  constructor(public type: ParserErrorType, public payload: string) {}
}

enum ParserErrorType {
  UNPARSABLE_MESSAGE,
  UNKNOWN_PACKET_TYPE,
}

/** Protocol packet parser */
class Parser extends EventEmitter {
  public feed = (data): void => {
    const dataStr = data.toString();
    const type = dataStr.split(' ', 1)[0];
    const body = dataStr.substring(type.length + 1);
    try {
      const packet = packetUtils.fromRaw(type, body);
      if (packet) {
        this.emit('packet', packet);
      } else {
        this.emit('error', new ParserError(ParserErrorType.UNKNOWN_PACKET_TYPE, type));
      }
    } catch (err) {
      this.emit('error', new ParserError(ParserErrorType.UNPARSABLE_MESSAGE, `${dataStr}: ${err}`));
    }
  }
}

export default Parser;
export { ParserError, ParserErrorType };
