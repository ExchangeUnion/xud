import * as db from '../../db/types';

export default [
  {
    nodePubKey: '02b66438730d1fcdf4a4ae5d3d73e847a272f160fee2938e132b52cab0a0d9cfc6',
    addresses: [{ host: 'xud1.test.exchangeunion.com', port: 8885 }],
  },
  {
    nodePubKey: '028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0a',
    addresses: [{ host: 'xud2.test.exchangeunion.com', port: 8885 }],
  },
  {
    nodePubKey: '03fd337659e99e628d0487e4f87acf93e353db06f754dccc402f2de1b857a319d0',
    addresses: [{ host: 'xud3.test.exchangeunion.com', port: 8885 }],
  },
] as db.NodeAttributes[];
