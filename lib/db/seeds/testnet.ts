import * as db from '../types';
import { SwapClientType } from '../../constants/enums';

const nodes = [
  {
    nodePubKey: '02c22007d3367713a3f938595d5f9ad4b049c2fc27cad07035fc6b62b2f3a20149',
    addresses: [{ host: 'testnet.boltz.exchange', port: 18885 }],
  },
  {
    nodePubKey: '02799dff47d38da549c9f9e3dcd94388e3a9fe05b4ea50ea0636562b4ba2b4ca4a',
    addresses: [
      { host: 'xud.kilrau.com', port: 18885 },
      {
        host: 'k3wdrskfge6cvvoebekjf6krgl73a6mh4y6qciyonisiwanmxhcgr5qd.onion',
        port: 18885,
      },
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

export { nodes, currencies, pairs };
