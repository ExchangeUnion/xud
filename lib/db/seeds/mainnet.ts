import * as db from '../../db/types';
import { SwapClientType } from '../../constants/enums';

const nodes = [
  {
    nodePubKey: '02529a91d073dda641565ef7affccf035905f3d8c88191bdea83a35f37ccce5d64',
    addresses: [
      { host: 'xud1.exchangeunion.com', port: 8885 },
      { host: 'rgz5icb5jdxzmu7r7tbis64q23ioytzd4tqikuyb5kz75w75rbe6veyd.onion', port: 8885 },
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
  {
    id: 'WETH',
    swapClient: SwapClientType.Raiden,
    decimalPlaces: 18,
    tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  {
    id: 'DAI',
    swapClient: SwapClientType.Raiden,
    decimalPlaces: 18,
    tokenAddress: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
  },
] as db.CurrencyAttributes[];

const pairs = [
  { baseCurrency: 'LTC', quoteCurrency: 'BTC' },
  { baseCurrency: 'ETH', quoteCurrency: 'BTC' },
  { baseCurrency: 'WETH', quoteCurrency: 'BTC' },
  { baseCurrency: 'BTC', quoteCurrency: 'DAI' },
  { baseCurrency: 'LTC', quoteCurrency: 'DAI' },
  { baseCurrency: 'BTC', quoteCurrency: 'USDT' },
  { baseCurrency: 'LTC', quoteCurrency: 'USDT' },
] as db.PairAttributes[];

export {
  nodes,
  currencies,
  pairs,
};
