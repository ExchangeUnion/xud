import Logger from '../Logger';

class MatchesProcessor {
  private buffer: any[];
  private logger: Logger;

  constructor() {
    this.buffer = [];
    this.logger = Logger.orderbook;
  }

  public add(match) {
    this.buffer.push(match);

    if (match.maker.peerId) {
      this.notifyPeer(match);
    } else if (match.taker.peerId) {
      this.executeSwap(match);
    } else {
      this.notifyClient(match);
    }
  }

  public notifyPeer(_args) {
    // TODO: notify the peer to trigger swap execution from his side
  }

  public notifyClient(_args) {
    // TODO: notify the local exchange client on the match
  }

  public executeSwap(_args) {
    // TODO: execute the swap procedure
  }
}

export default MatchesProcessor;
