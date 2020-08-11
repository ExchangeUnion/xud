import * as db from '../../db/types';
import { SwapClientType } from '../../constants/enums';

const nodes = [
  {
    nodePubKey: '0314a964a6a9cca7426e5b6b55d7f0527d36cedd039373fe489a18718c327768a1',
    addresses: [
      { host: 'boltz.exchange', port: 8885 },
    ],
  },
  {
    nodePubKey: '036553224025f2a4ad562686718895ae0ba99d8b2fa26b8cb0f81abd8e6260d9ff',
    addresses: [
      { host: 'xud.kilrau.com', port: 8885 },
      { host: '256d4llrbzvnya237nvyptdkfmmj7cros4mgfmioxlkpi6xu6gzzisyd.onion', port: 8885 },
    ],
  },
  {
    nodePubKey: '03a4196edd6475d24088f806b2a3425bb63f65ee4125363eaa1d3db6764459e27a',
    addresses: [
      { host: 'h3jxbox7cuje73rktuejyabkcefoimp7ylfn3qnzpvoo7acxoz3p3gad.onion', port: 8885 },
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
  { baseCurrency: 'ETH', quoteCurrency: 'BTC' },
  { baseCurrency: 'LTC', quoteCurrency: 'BTC' },
  { baseCurrency: 'LTC', quoteCurrency: 'USDT' },
  { baseCurrency: 'BTC', quoteCurrency: 'USDT' },
] as db.PairAttributes[];

export {
  nodes,
  currencies,
  pairs,
};
