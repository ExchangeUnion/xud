import { SwapResult, StampedOwnOrder } from './orders';

export type InternalMatch = {
  maker: StampedOwnOrder;
  taker: StampedOwnOrder;
};

export type PlaceOrderResult = {
  internalMatches: InternalMatch[];
  swapResults: SwapResult[]
  remainingOrder?: StampedOwnOrder;
};
