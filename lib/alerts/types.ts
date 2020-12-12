import { AlertType, ChannelSide } from '../constants/enums';

export type Alert = BalanceAlert;

export type BalanceAlert = BaseAlert & {
  /** The total balance of the channel when the alert is triggered. */
  totalBalance: number;
  /** The side of the balance either local or remote. */
  side: ChannelSide;
  /** The balance that triggered the alert. */
  sideBalance: number;
  /** The alert threshold in percentage, e.g. 10 means %10. */
  bound: number;
  /** The currency of the channel. */
  currency: string;
};

type BaseAlert = {
  type: AlertType;
  message: string;
  date: number;
};
