import { SwapResult, StampedOwnOrder } from './orders';

export type PlaceOrderResult = {
  internalMatches: StampedOwnOrder[];
  swapResults: SwapResult[]
  remainingOrder?: StampedOwnOrder;
};
