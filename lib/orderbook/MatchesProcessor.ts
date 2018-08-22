import Logger from '../Logger';
import { OrderMatch } from '../types/matchingEngine';
import { isPeerOrder, StampedPeerOrder, StampedOwnOrder } from '../types/orders';
import Pool from '../p2p/Pool';
import Swaps from '../swaps/Swaps';

class MatchesProcessor {
  constructor(private logger: Logger, private pool?: Pool, private swaps?: Swaps) { }

  public process = (match: OrderMatch) => {
    if (isPeerOrder(match.maker)) {
      // we matched a remote order
      if (this.pool && this.swaps) {
        this.swaps.beginSwap(match.maker, match.taker as StampedOwnOrder);
      }
    } else {
      // internal match
      this.notifyClient(match);
    }
  }

  private notifyClient(_match: OrderMatch) {
    // TODO: notify the local exchange client on the match
  }
}

export default MatchesProcessor;
