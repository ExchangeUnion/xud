const Logger = require('../Logger');

class MatchesProcessor {
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

  notifyPeer() { // eslint-disable-line class-methods-use-this
    // TODO: notify the peer to trigger swap execution from his side
  }

  notifyClient() { // eslint-disable-line class-methods-use-this
    // TODO: notify the local exchange client on the match
  }

  executeSwap() { // eslint-disable-line class-methods-use-this
    // TODO: execute the swap procedure
  }
}

module.exports = MatchesProcessor;
