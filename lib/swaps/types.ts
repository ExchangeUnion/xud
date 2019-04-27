import { SwapRole, SwapPhase, SwapState, SwapFailureReason } from '../constants/enums';

export type SwapDeal = {
  /** Our role in the swap. */
  role: SwapRole;
  /** The most updated deal phase */
  phase: SwapPhase;
  /**
   * The most updated deal state. State works together with phase to indicate where the
   * deal is in its life cycle and if the deal is active, errored, or completed.
   */
  state: SwapState;
  /** The reason for being in the current state. */
  errorMessage?: string;
  failureReason?: SwapFailureReason;
  /** The xud node pub key of the counterparty to this swap deal. */
  peerPubKey: string;
  /** The global order id in the XU network for the maker order being executed. */
  orderId: string;
  /** Whether the maker order is a buy order. */
  isBuy: boolean;
  /** The local id of the own order involved in the swap. */
  localId: string;
  /** The quantity of the order to execute as proposed by the taker. */
  proposedQuantity: number;
  /** The quantity of the order to execute as accepted by the maker. */
  quantity?: number;
  /** The trading pair for the swap. The pairId together with the orderId are needed to find the maker order in the order book. */
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
  /** The hex-encoded hash of the preimage. */
  rHash: string;
  /** The hex-encoded preimage. */
  rPreimage?: string;
  /** The routes the maker should use to send to the taker. */
  makerToTakerRoutes?: Route[];
  /** The identifier for the payment channel network node we should pay to complete the swap.  */
  destination?: string;
  createTime: number;
  executeTime?: number;
  completeTime?: number;
};

/** The result of a successful swap. */
export type SwapSuccess = Pick<SwapDeal, 'orderId' | 'localId' | 'pairId' | 'rHash' | 'peerPubKey' | 'price' | 'rPreimage' | 'role'> & {
  /** The amount of satoshis (or equivalent) received. */
  amountReceived: number;
  /** The amount of satoshis (or equivalent) sent. */
  amountSent: number;
  /** The ticker symbol of the currency received. */
  currencyReceived: string;
  /** The ticker symbol of the currency sent. */
  currencySent: string;
  /** The quantity that was swapped. */
  quantity: number;
};

export type SwapFailure = Pick<SwapDeal, 'orderId' | 'pairId' | 'quantity' | 'peerPubKey' > & {
  /** The quantity that was attempted and failed for the swap. */
  quantity: number;
  failureReason: SwapFailureReason;
};

export type Route = {
  getTotalTimeLock: Function,
};

/** Tracks the state of a pending swap of 1 satoshi for 1 satoshi of a specified currency. */
export type SanitySwap =  Pick<SwapDeal, 'rHash' | 'rPreimage' | 'peerPubKey'> & {
  /** The currency for the swap. */
  currency: string;
};
