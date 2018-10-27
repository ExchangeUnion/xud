import { StampedOwnOrder } from './orders';
import { SwapResult } from 'lib/swaps/types';

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
