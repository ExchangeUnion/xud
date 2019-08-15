import * as db from '../../db/types';
import { SwapClientType } from '../../constants/enums';

const nodes = [] as db.NodeAttributes[];

const currencies = [
  { id: 'BTC', swapClient: SwapClientType.Lnd, decimalPlaces: 8 },
  { id: 'LTC', swapClient: SwapClientType.Lnd, decimalPlaces: 8 },
  {
    id: 'WETH',
    swapClient: SwapClientType.Raiden,
    decimalPlaces: 18,
    tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  {
    id: 'DAI',
    swapClient: SwapClientType.Raiden,
    decimalPlaces: 18,
    tokenAddress: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
  },
] as db.CurrencyAttributes[];

const pairs = [
  { baseCurrency: 'LTC', quoteCurrency: 'BTC' },
  { baseCurrency: 'WETH', quoteCurrency: 'BTC' },
  { baseCurrency: 'BTC', quoteCurrency: 'DAI' },
  { baseCurrency: 'LTC', quoteCurrency: 'DAI' },
] as db.PairAttributes[];

export {
  nodes,
  currencies,
  pairs,
};
