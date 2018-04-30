import Logger from 'lib/Logger';

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

  notifyPeer(args) {
    console.log(args);
    // TODO: notify the peer to trigger swap execution from his side
  }

  notifyClient(args) {
    console.log(args);
    // TODO: notify the local exchange client on the match
  }

  executeSwap(args) {
    console.log(args);
    // TODO: execute the swap procedure
  }
}

export default MatchesProcessor;
