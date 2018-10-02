import { SwapResult, StampedOwnOrder } from './orders';

export type PlaceOrderResult = {
  internalMatches: StampedOwnOrder[];
  swapResults: SwapResult[]
  remainingOrder?: StampedOwnOrder;
};

export type PlaceOrderEvent = {
  internalMatch?: StampedOwnOrder;
  swapResult?: SwapResult
  remainingOrder?: StampedOwnOrder;
};
