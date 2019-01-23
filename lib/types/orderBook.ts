import { OwnOrder, PeerOrder } from './orders';
import { SwapResult } from 'lib/swaps/types';

export type PlaceOrderResult = {
  internalMatches: OwnOrder[];
  swapResults: SwapResult[];
  remainingOrder?: OwnOrder;
};

export type PlaceOrderEvent = {
  type: PlaceOrderEventType;
  payload: OwnOrder | SwapResult | PeerOrder;
};

export enum PlaceOrderEventType {
  InternalMatch,
  SwapSuccess,
  RemainingOrder,
  SwapFailure,
}
