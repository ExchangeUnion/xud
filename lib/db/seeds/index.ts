import {
  nodes as mainnetNodes,
  currencies as mainnetCurrencies,
  pairs as mainnetPairs,
} from './mainnet';
import {
  nodes as testnetNodes,
  currencies as testnetCurrencies,
  pairs as testnetPairs,
} from './testnet';
import {
  nodes as simnetNodes,
  currencies as simnetCurrencies,
  pairs as simnetPairs,
} from './simnet';
import * as db from '../../db/types';
import { XuNetwork } from '../../constants/enums';

const nodes: { [network: string]: db.NodeAttributes[] | undefined } = {
  [XuNetwork.MainNet]: mainnetNodes,
  [XuNetwork.TestNet]: testnetNodes,
  [XuNetwork.SimNet]: simnetNodes,
};

const currencies: { [network: string]: db.CurrencyAttributes[] | undefined } = {
  [XuNetwork.MainNet]: mainnetCurrencies,
  [XuNetwork.TestNet]: testnetCurrencies,
  [XuNetwork.SimNet]: simnetCurrencies,
};

const pairs: { [network: string]: db.PairAttributes[] | undefined } = {
  [XuNetwork.MainNet]: mainnetPairs,
  [XuNetwork.TestNet]: testnetPairs,
  [XuNetwork.SimNet]: simnetPairs,
};

const defaultNodes = (xuNetwork: XuNetwork): db.NodeAttributes[] | undefined => nodes[xuNetwork];
const defaultCurrencies = (xuNetwork: XuNetwork): db.CurrencyAttributes[] | undefined => currencies[xuNetwork];
const defaultPairs = (xuNetwork: XuNetwork): db.PairAttributes[] | undefined => pairs[xuNetwork];

export {
  defaultNodes,
  defaultCurrencies,
  defaultPairs,
};
