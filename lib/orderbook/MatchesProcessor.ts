import Logger from '../Logger';
import { OrderMatch } from '../types/matchingEngine';
import { isPeerOrder } from '../types/orders';

class MatchesProcessor {
  private buffer: any[];
  private logger: Logger;

  constructor() {
    this.buffer = [];
    this.logger = Logger.orderbook;
  }

  public add(match: OrderMatch) {
    this.buffer.push(match);

    if (isPeerOrder(match.maker)) {
      this.notifyPeer(match);
    } else if (isPeerOrder(match.taker)) {
      this.executeSwap(match);
    } else {
      this.notifyClient(match);
    }
  }

  public notifyPeer(_args: any) {
    // TODO: notify the peer to trigger swap execution from his side
  }

  public notifyClient(_args: any) {
    // TODO: notify the local exchange client on the match
  }

  public executeSwap(_args: any) {
    // TODO: execute the swap procedure
  }
}

export default MatchesProcessor;
