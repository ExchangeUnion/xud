import { getAlias, isAlias } from '../../lib/utils/aliasUtils';

describe('getAlias', () => {
  test('generates a deterministic alias from public key', () => {
    const pubkey = '028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0a';
    const alias = 'SoccerFrost';
    expect(getAlias(pubkey)).toEqual(alias);
  });
});

describe('isAlias', () => {
  test('provides an accurate hint about whether or not a node identifier is an alias', () => {
    const alias = 'SoccerFrost';
    expect(isAlias(alias)).toEqual(true);
  });
  test('provides an accurate hint about whether or not a node identifier is a public key', () => {
    const nodeIdentifier = '028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0a';
    expect(isAlias(nodeIdentifier)).toEqual(false);
  });
});
