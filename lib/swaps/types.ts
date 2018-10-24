import { SwapRole, SwapPhase, SwapState } from 'lib/types/enums';
import { Route } from '../proto/lndrpc_pb';

export type SwapDeal = {
  /** The role of the local node in the swap. */
  role: SwapRole;
  /** The most updated deal phase */
  phase: SwapPhase;
  /**
   * The most updated deal state. State works together with phase to indicate where the
   * deal is in its life cycle and if the deal is active, errored, or completed.
   */
  state: SwapState;
  /** The reason for being in the current state. */
  errorReason?: string;
  /** The xud node pub key of the counterparty to this swap deal. */
  peerPubKey: string;
  /** The global order id in the XU network for the maker order being executed. */
  orderId: string;
  /** The local id of the own order involved in the swap. */
  localId: string;
  /** The quantity of the order to execute as proposed by the taker. */
  proposedQuantity: number;
  /** The accepted quantity of the order to execute as accepted by the maker. */
  quantity?: number;
  /** The trading pair of the order. The pairId together with the orderId are needed to find the deal in orderBook. */
  pairId: string;
  /** The number of satoshis (or equivalent) the taker is expecting to receive. */
  takerAmount: number;
  /** The currency the taker is expecting to receive. */
  takerCurrency: string;
  /** Taker's lnd pubkey on the taker currency's network. */
  takerPubKey?: string;
  /** The CLTV delta from the current height that should be used to set the timelock for the final hop when sending to taker. */
  takerCltvDelta: number;
  /** The number of satoshis (or equivalent) the maker is expecting to receive. */
  makerAmount: number;
  /** The currency the maker is expecting to receive. */
  makerCurrency: string;
  /** The CLTV delta from the current height that should be used to set the timelock for the final hop when sending to maker. */
  makerCltvDelta?: number;
  /** The price of the order that's being executed. */
  price: number;
  /** The hash of the preimage. */
  r_hash: string;
  r_preimage?: string;
  /** The routes the maker should use to send to the taker. */
  makerToTakerRoutes?: Route[];
  createTime: number;
  executeTime?: number;
  completeTime?: number
};

/** The result of a successful swap. */
export type SwapResult = Pick<SwapDeal, 'orderId' | 'localId' | 'pairId' | 'quantity' | 'r_hash' | 'peerPubKey' | 'role'> & {
  /** The amount of satoshis (or equivalent) received. */
  amountReceived: number;
  /** The amount of satoshis (or equivalent) sent. */
  amountSent: number;
  quantity: number;
};
