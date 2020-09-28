import * as db from '../../db/types';
import { SwapClientType } from '../../constants/enums';

const nodes = [
  {
    nodePubKey: '03ece33a30db1dbce4b62fa96a5e9541138a24997ef5672eebed2d332270e39542',
    addresses: [
      { host: 'xud1.simnet.exchangeunion.com', port: 28885 },
      { host: 'hsfkqybnlkql5fgm3h72mqnrl5rh543hulkp7j6tzs7thq3fznjrkcid.onion', port: 28885 },
    ],
  },
  {
    nodePubKey: '03df4f36fa35bd242263e8d09d6b422108dab1f08d91237bb3aa2dad957cf08a71',
    addresses: [
      { host: 'xud.kilrau.com', port: 28885 },
      { host: 'ri3khz45h25dzxh32z2r7f3s2fgque6f77zygtanldio3z3ps3b3s3id.onion', port: 28885 },
    ],
  },
] as db.NodeAttributes[];

const currencies = [
  { id: 'BTC', swapClient: SwapClientType.Lnd, decimalPlaces: 8 },
  { id: 'LTC', swapClient: SwapClientType.Lnd, decimalPlaces: 8 },
  {
    id: 'USDT',
    swapClient: SwapClientType.Connext,
    decimalPlaces: 6,
    tokenAddress: '0x292Ba2F10dbFB8925A209d3AdF09C2D2b1f491d4',
  },
  {
    id: 'DAI',
    swapClient: SwapClientType.Connext,
    decimalPlaces: 18,
    tokenAddress: '0x5CF98f1782117a20D8613Bf42701026c86061111',
  },
  {
    id: 'XUC',
    swapClient: SwapClientType.Connext,
    decimalPlaces: 18,
    tokenAddress: '0x468ee988fD0228A79f6CcC33fEc04249cdfD809E',
  },
  
] as db.CurrencyAttributes[];

const pairs = [
  { baseCurrency: 'ETH', quoteCurrency: 'BTC' },
  { baseCurrency: 'LTC', quoteCurrency: 'BTC' },
  { baseCurrency: 'LTC', quoteCurrency: 'USDT' },
  //{ baseCurrency: 'BTC', quoteCurrency: 'USDT' },
  { baseCurrency: 'BTC', quoteCurrency: 'DAI' },
  { baseCurrency: 'USDT', quoteCurrency: 'DAI' },
  { baseCurrency: 'DAI', quoteCurrency: 'USDT' },
  // { baseCurrency: 'XUC', quoteCurrency: 'BTC' },
  // { baseCurrency: 'ETH', quoteCurrency: 'USDT' },
  // { baseCurrency: 'ETH', quoteCurrency: 'DAI' },
  // { baseCurrency: 'LTC', quoteCurrency: 'DAI' },
  // { baseCurrency: 'XUC', quoteCurrency: 'USDT' },
  // { baseCurrency: 'XUC', quoteCurrency: 'DAI' },
] as db.PairAttributes[];

export {
  nodes,
  currencies,
  pairs,
};
