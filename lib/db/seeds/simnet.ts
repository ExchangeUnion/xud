import * as db from '../../db/types';
import { SwapClientType } from '../../constants/enums';

const nodes = [
  {
    nodePubKey: '025443023c0303eb5671522cda0d49acb0e74c77f1371bf86262bad637835eb9e4',
    addresses: [
      { host: 'xud1.simnet.exchangeunion.com', port: 28885 },
      { host: 'xe4vwapndzzxlz47fb3n7ysqq4wynqic4cceel3pv3s6ehr6j2t663qd.onion', port: 28885 },
    ],
  },
] as db.NodeAttributes[];

const currencies = [
  { id: 'BTC', swapClient: SwapClientType.Lnd, decimalPlaces: 8 },
  { id: 'LTC', swapClient: SwapClientType.Lnd, decimalPlaces: 8 },
  {
    id: 'XUC',
    swapClient: SwapClientType.Connext,
    decimalPlaces: 18,
    tokenAddress: '0xEcFcaB0A285d3380E488A39B4BB21e777f8A4EaC',
  },
  {
    id: 'ETH',
    swapClient: SwapClientType.Connext,
    decimalPlaces: 18,
    tokenAddress: '0x0000000000000000000000000000000000000000',
  },
  {
    id: 'WETH',
    swapClient: SwapClientType.Raiden,
    decimalPlaces: 18,
    tokenAddress: '0x892F91dc428Fc3Dc0a57eC46C8245F2511b8a542',
  },
  {
    id: 'DAI',
    swapClient: SwapClientType.Raiden,
    decimalPlaces: 18,
    tokenAddress: '0x4115652c9025d99512e9026B8F11C3E265bfecD7',
  },
] as db.CurrencyAttributes[];

const pairs = [
  { baseCurrency: 'LTC', quoteCurrency: 'BTC' },
  { baseCurrency: 'ETH', quoteCurrency: 'BTC' },
  { baseCurrency: 'WETH', quoteCurrency: 'BTC' },
  { baseCurrency: 'BTC', quoteCurrency: 'DAI' },
  { baseCurrency: 'LTC', quoteCurrency: 'DAI' },
  { baseCurrency: 'XUC', quoteCurrency: 'BTC' },
] as db.PairAttributes[];

export {
  nodes,
  currencies,
  pairs,
};
