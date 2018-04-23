import Logger from '../Logger';

class MatchesProcessor {
  buffer: any[];
  logger: any;

  constructor() {
    this.buffer = [];
    this.logger = Logger.global;
  }

  add(match) {
    this.buffer.push(match);

    if (match.maker.peerId) {
      this.notifyPeer(match);
    } else if (match.taker.peerId) {
      this.executeSwap(match);
    } else {
      this.notifyClient(match);
    }
  }

  notifyPeer(arg) {
    // TODO: notify the peer to trigger swap execution from his side
  }

  notifyClient(arg) {
    // TODO: notify the local exchange client on the match
  }

  executeSwap(arg) {
    // TODO: execute the swap procedure
  }
}

export default MatchesProcessor;
