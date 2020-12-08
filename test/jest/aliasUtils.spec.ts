import { isNodePubKey, pubKeyToAlias } from '../../lib/utils/aliasUtils';

const nodePubKey = '028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0a';
const invalidPubKey = 'notarealnodepubkey028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0a';
const alias = 'LabelSystem';

describe('pubKeyToAlias', () => {
  test('generates a deterministic alias from a node pub key', () => {
    expect(pubKeyToAlias(nodePubKey)).toEqual(alias);
  });

  test('throws an error when passed an invalid node pub key', () => {
    expect(() => pubKeyToAlias(invalidPubKey)).toThrow();
  });
});

describe('isNodePubKey', () => {
  test('indicates that an alias cannot be a node pub key', () => {
    expect(isNodePubKey(alias)).toEqual(false);
  });
  test('indicates that an invalid string cannot be a node pub key', () => {
    expect(isNodePubKey(invalidPubKey)).toEqual(false);
  });
  test('indicates when a node identifier could be a node pub key', () => {
    expect(isNodePubKey(nodePubKey)).toEqual(true);
  });
});
