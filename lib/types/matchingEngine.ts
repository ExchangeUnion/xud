import { Order, OwnOrder } from './orders';

export type OrderMatch = {
  maker: Order;
  taker: OwnOrder;
};

export type MatchingResult = {
  matches: OrderMatch[];
  remainingOrder?: OwnOrder;
};
