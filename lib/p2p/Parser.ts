import {EventEmitter} from 'events';

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
    const packetType = dataStr.split(' ', 1)[0];
    try {
      const payload = JSON.parse(dataStr.substring(packetType.length + 1));

      switch (packetType) {
        case 'order': {
          this.emit('packet', {packetType, payload});
          break;
        }
        default:
          this.emit('error', new ParserError(ParserErrorType.UNKNOWN_PACKET_TYPE, packetType));
      }
    } catch (err) {
      this.emit('error', new ParserError(ParserErrorType.UNPARSABLE_MESSAGE, dataStr));
    }
  }
}

export default Parser;
export {ParserError, ParserErrorType}