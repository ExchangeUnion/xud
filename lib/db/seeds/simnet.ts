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
    nodePubKey: '03929f9962bd8f6c108fb0f2a15024f0d11a833ee465094361b71b0e94c903cec2',
    addresses: [
      { host: 'xud.kilrau.com', port: 28885 },
      { host: 'gamd4wqbllf5ww34abgl4xiekf7slbt2kwsrbnp4rfilyav6wfcxvdyd.onion', port: 28885 },
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
  /*
  {
    id: 'XUC',
    swapClient: SwapClientType.Connext,
    decimalPlaces: 18,
    tokenAddress: '0x468ee988fD0228A79f6CcC33fEc04249cdfD809E',
  },
  {
    id: 'DAI',
    swapClient: SwapClientType.Connext,
    decimalPlaces: 18,
    tokenAddress: '0x302171031c4fB3cca3395DDb489AC7c0E5Bf5D96',
  },
  {
    id: 'USDT',
    swapClient: SwapClientType.Connext,
    decimalPlaces: 18,
    tokenAddress: '0xc3d29467bfe09d061764F2D841FeD98fBF23c088',
  },
  */
] as db.CurrencyAttributes[];

const pairs = [
  { baseCurrency: 'ETH', quoteCurrency: 'BTC' },
  { baseCurrency: 'LTC', quoteCurrency: 'BTC' },
  // { baseCurrency: 'BTC', quoteCurrency: 'USDT' },
  // { baseCurrency: 'BTC', quoteCurrency: 'DAI' },
  // { baseCurrency: 'XUC', quoteCurrency: 'BTC' },
  // { baseCurrency: 'ETH', quoteCurrency: 'USDT' },
  // { baseCurrency: 'ETH', quoteCurrency: 'DAI' },
  // { baseCurrency: 'LTC', quoteCurrency: 'USDT' },
  // { baseCurrency: 'LTC', quoteCurrency: 'DAI' },
  // { baseCurrency: 'XUC', quoteCurrency: 'USDT' },
  // { baseCurrency: 'XUC', quoteCurrency: 'DAI' },
  // { baseCurrency: 'DAI', quoteCurrency: 'USDT' },
] as db.PairAttributes[];

export {
  nodes,
  currencies,
  pairs,
};
