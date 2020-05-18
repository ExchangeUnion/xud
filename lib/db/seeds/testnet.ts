import * as db from '../../db/types';
import { SwapClientType } from '../../constants/enums';

const nodes = [
  {
    nodePubKey: '037a74737630bb5a9979762b2163ef9f95c81e00caf347bacc17f16991cdbb61f7',
    addresses: [
      { host: 'xud1.testnet.exchangeunion.com', port: 18885 },
      { host: 'pso32ae2l5nyh3clgee2nj2hgpmcnluhaqibjm2r2fjcsn4gclxfmrid.onion', port: 18885 },
    ],
  },
] as db.NodeAttributes[];

const currencies = [
  { id: 'BTC', swapClient: SwapClientType.Lnd, decimalPlaces: 8 },
  { id: 'LTC', swapClient: SwapClientType.Lnd, decimalPlaces: 8 },
  {
    id: 'ETH',
    swapClient: SwapClientType.Connext,
    decimalPlaces: 18,
    tokenAddress: '0x0000000000000000000000000000000000000000',
  },
  {
    id: 'USDT',
    swapClient: SwapClientType.Connext,
    decimalPlaces: 6,
    tokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
] as db.CurrencyAttributes[];

const pairs = [
  { baseCurrency: 'LTC', quoteCurrency: 'BTC' },
  { baseCurrency: 'ETH', quoteCurrency: 'BTC' },
  { baseCurrency: 'BTC', quoteCurrency: 'USDT' },
  { baseCurrency: 'LTC', quoteCurrency: 'USDT' },
] as db.PairAttributes[];

export {
  nodes,
  currencies,
  pairs,
};
