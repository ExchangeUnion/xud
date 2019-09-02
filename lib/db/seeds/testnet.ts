import * as db from '../../db/types';
import { SwapClientType } from '../../constants/enums';

const nodes = [
  {
    nodePubKey: '03640f9e41cf77349ef29ed84ab02671dfc0a76963b8e84209cdeab4c9639ace0b',
    addresses: [{ host: 'xud1.testnet.exchangeunion.com', port: 8885 }],
  },
] as db.NodeAttributes[];

const currencies = [
  { id: 'BTC', swapClient: SwapClientType.Lnd, decimalPlaces: 8 },
  { id: 'LTC', swapClient: SwapClientType.Lnd, decimalPlaces: 8 },
  {
    id: 'WETH',
    swapClient: SwapClientType.Raiden,
    decimalPlaces: 18,
    tokenAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
  },
  {
    id: 'DAI',
    swapClient: SwapClientType.Raiden,
    decimalPlaces: 18,
    tokenAddress: '0xad6d458402f60fd3bd25163575031acdce07538d',
  },
] as db.CurrencyAttributes[];

const pairs = [
  { baseCurrency: 'LTC', quoteCurrency: 'BTC' },
  { baseCurrency: 'WETH', quoteCurrency: 'BTC' },
  { baseCurrency: 'BTC', quoteCurrency: 'DAI' },
  { baseCurrency: 'LTC', quoteCurrency: 'DAI' },
] as db.PairAttributes[];

export {
  nodes,
  currencies,
  pairs,
};
