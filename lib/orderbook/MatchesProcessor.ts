import Logger, { Context } from '../Logger';

class MatchesProcessor {
  private buffer: any[];
  private logger: Logger;

  constructor(instanceId: number) {
    this.buffer = [];
    this.logger = new Logger({ instanceId, context: Context.ORDERBOOK });
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
