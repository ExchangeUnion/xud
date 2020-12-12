import * as db from '../types';
import { SwapClientType } from '../../constants/enums';

const nodes = [
  {
    nodePubKey: '0314a964a6a9cca7426e5b6b55d7f0527d36cedd039373fe489a18718c327768a1',
    addresses: [{ host: 'boltz.exchange', port: 8885 }],
  },
  {
    nodePubKey: '03c7a8cdc3cf7203c1ba1ad5602622d551ae84a8e2aec5b6e50df73c287a6097f7',
    addresses: [
      { host: 'xud.kilrau.com', port: 8885 },
      {
        host: 'omo6nzhpcq3lsnicotyoufxst4iy57o5g2mjjp3weztots5azhcc5gad.onion',
        port: 8885,
      },
    ],
  },
  {
    nodePubKey: '02f9cd8fbe9c115d399a6d616ae241d1e6a3c437a91de229dc7bfdb42dd3df21c3',
    addresses: [
      {
        host: 'vpecld6ehywi4opa6t2zvo42cgl2wyh5ji4ryx76ghrqdl56m76zdbad.onion',
        port: 8885,
      },
    ],
  },
  {
    nodePubKey: '024efa32a46533258d9f6497b3927c34b01bff7ceb927f8f789b56a8601dde993a',
    addresses: [
      {
        host: 'wkoyje5mlrlzlgrdbqwscsyotr7hcv4423nnmu2tbgtwmmk3lb6mmwid.onion',
        port: 8885,
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
  {
    id: 'USDT',
    swapClient: SwapClientType.Connext,
    decimalPlaces: 6,
    tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
  {
    id: 'DAI',
    swapClient: SwapClientType.Connext,
    decimalPlaces: 18,
    tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
] as db.CurrencyAttributes[];

const pairs = [
  // { baseCurrency: 'BTC', quoteCurrency: 'DAI' },
  { baseCurrency: 'BTC', quoteCurrency: 'USDT' },
  { baseCurrency: 'ETH', quoteCurrency: 'BTC' },
  // { baseCurrency: 'ETH', quoteCurrency: 'DAI' },
  // { baseCurrency: 'ETH', quoteCurrency: 'USDT' },
  { baseCurrency: 'LTC', quoteCurrency: 'BTC' },
  // { baseCurrency: 'LTC', quoteCurrency: 'DAI' },
  // { baseCurrency: 'LTC', quoteCurrency: 'USDT' },
  { baseCurrency: 'USDT', quoteCurrency: 'DAI' },
  // { baseCurrency: 'XUC', quoteCurrency: 'BTC' },
  // { baseCurrency: 'XUC', quoteCurrency: 'ETH' },
  // { baseCurrency: 'XUC', quoteCurrency: 'DAI' },
  // { baseCurrency: 'XUC', quoteCurrency: 'USDT' },
] as db.PairAttributes[];

export { nodes, currencies, pairs };
