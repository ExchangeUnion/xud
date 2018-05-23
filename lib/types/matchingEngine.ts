import { StampedOrder } from './orders';

export type OrderMatch = {
  maker: StampedOrder;
  taker: StampedOrder;
};

export type MatchingResult = {
  matches: OrderMatch[];
  remainingOrder: StampedOrder;
};
