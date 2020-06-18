import * as db from '../../db/types';
import { SwapClientType } from '../../constants/enums';

const nodes = [
  {
    nodePubKey:
      '025443023c0303eb5671522cda0d49acb0e74c77f1371bf86262bad637835eb9e4',
    addresses: [
      { host: 'xud1.simnet.exchangeunion.com', port: 28885 },
      {
        host: 'xe4vwapndzzxlz47fb3n7ysqq4wynqic4cceel3pv3s6ehr6j2t663qd.onion',
        port: 28885,
      },
    ],
  },
  {
    nodePubKey:
      '03929f9962bd8f6c108fb0f2a15024f0d11a833ee465094361b71b0e94c903cec2',
    addresses: [
      { host: 'xud.kilrau.com', port: 28885 },
      {
        host: 'gamd4wqbllf5ww34abgl4xiekf7slbt2kwsrbnp4rfilyav6wfcxvdyd.onion',
        port: 28885,
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

export { nodes, currencies, pairs };
