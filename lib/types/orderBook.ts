import { SwapResult, StampedOwnOrder } from './orders';

export type PlaceOrderResult = {
  internalMatches: StampedOwnOrder[];
  swapResults: SwapResult[];
  remainingOrder?: StampedOwnOrder;
};

export type PlaceOrderEvent = {
  case: PlaceOrderEventCase;
  payload: StampedOwnOrder | SwapResult;
};

export enum PlaceOrderEventCase {
  InternalMatch,
  SwapResult,
  RemainingOrder,
}
