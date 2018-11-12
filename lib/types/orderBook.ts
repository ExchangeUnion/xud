import { OwnOrder } from './orders';
import { SwapResult } from 'lib/swaps/types';

export type PlaceOrderResult = {
  internalMatches: OwnOrder[];
  swapResults: SwapResult[];
  remainingOrder?: OwnOrder;
};

export type PlaceOrderEvent = {
  case: PlaceOrderEventCase;
  payload: OwnOrder | SwapResult;
};

export enum PlaceOrderEventCase {
  InternalMatch,
  SwapResult,
  RemainingOrder,
}
