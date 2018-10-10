import { StampedOrder, StampedOwnOrder } from './orders';

export type OrderMatch = {
  maker: StampedOrder;
  taker: StampedOwnOrder;
};

export type MatchingResult = {
  matches: OrderMatch[];
  remainingOrder?: StampedOwnOrder;
};
