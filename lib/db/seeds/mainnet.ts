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
    nodePubKey: '02d167d1fe523d4ea777e06cf34c7d19a8a278165f68b4033224f05a8c678e982c',
    addresses: [
      { host: 'xud.kilrau.com', port: 8885 },
      { host: 'fsq22euwtdh6dshiq4ewq2k7zy6iyzykacqlad54z4ixunftkjqc3vad.onion', port: 8885 },
    ],
  },
  {
    nodePubKey: '030084542e5dfda849095e12fc56040b9d01cd4120f41457d49abac6273e52e9f1',
    addresses: [
      { host: '4z72tnfp453b2jahwjw2t7v24q6obv2bb3qc4czpgxvyjpojbrx4qbid.onion', port: 8885 },
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
] as db.CurrencyAttributes[];

const pairs = [
  { baseCurrency: 'LTC', quoteCurrency: 'BTC' },
  { baseCurrency: 'ETH', quoteCurrency: 'BTC' },
] as db.PairAttributes[];

export {
  nodes,
  currencies,
  pairs,
};
