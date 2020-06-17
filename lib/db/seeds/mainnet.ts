import * as db from '../../db/types';
import { SwapClientType } from '../../constants/enums';

const nodes = [
  {
    nodePubKey: '02d167d1fe523d4ea777e06cf34c7d19a8a278165f68b4033224f05a8c678e982c',
    addresses: [
      { host: 'xud.kilrau.com', port: 8885 },
      { host: 'fsq22euwtdh6dshiq4ewq2k7zy6iyzykacqlad54z4ixunftkjqc3vad.onion', port: 8885 },
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
