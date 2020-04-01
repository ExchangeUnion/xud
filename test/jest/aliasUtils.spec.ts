import { getAlias, isNodePubKey } from '../../lib/utils/aliasUtils';

const nodePubKey = '028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0a';
const alias = 'SoccerFrost';

describe('getAlias', () => {
  test('generates a deterministic alias from a node pub key', () => {
    expect(getAlias(nodePubKey)).toEqual(alias);
  });
});

describe('isNodePubKey', () => {
  test('indicates when a node identifier cannot be a node pub key', () => {
    expect(isNodePubKey(alias)).toEqual(false);
  });
  test('indicates when a node identifier could be a node pub key', () => {
    expect(isNodePubKey(nodePubKey)).toEqual(true);
  });
});
