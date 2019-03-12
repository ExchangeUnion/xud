import { default as mainnet } from './mainnet';
import { default as testnet } from './testnet';
import { default as simnet } from './simnet';
import * as db from '../../db/types';
import { XUNetwork } from '../../constants/enums';

const seeds: { [network: string]: db.NodeAttributes[] | undefined } = {
  [XUNetwork.MainNet]: mainnet,
  [XUNetwork.TestNet]: testnet,
  [XUNetwork.SimNet]: simnet,
};

export default {
  get: (xuNetwork: XUNetwork): db.NodeAttributes[] | undefined => {
    const nodes = seeds[xuNetwork];
    if (!nodes) {
      return;
    }
    return nodes.map(node => ({ ...node, network: xuNetwork }));
  },
};
