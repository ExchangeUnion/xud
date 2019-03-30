import { default as mainnet } from './mainnet';
import { default as testnet } from './testnet';
import { default as simnet } from './simnet';
import * as db from '../../db/types';
import { XuNetwork } from '../../constants/enums';

const seeds: { [network: string]: db.NodeAttributes[] | undefined } = {
  [XuNetwork.MainNet]: mainnet,
  [XuNetwork.TestNet]: testnet,
  [XuNetwork.SimNet]: simnet,
};

export default {
  get: (xuNetwork: XuNetwork): db.NodeAttributes[] | undefined => seeds[xuNetwork],
};
