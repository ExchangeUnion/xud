import secp256k1 from 'secp256k1';
import { SwapClientType } from '../../lib/constants/enums';
import NodeKey from '../../lib/nodekey/NodeKey';
import { randomBytes } from '../../lib/utils/cryptoUtils';
import { getTempDir } from '../utils';

function validateNodeKey(nodeKey: NodeKey) {
  expect(nodeKey.pubKey).toHaveLength(66);
  expect(secp256k1.privateKeyVerify(nodeKey['privKey'])).toEqual(true);
  expect(secp256k1.publicKeyVerify(Buffer.from(nodeKey.pubKey, 'hex'))).toEqual(true);
}

describe('NodeKey', () => {
  const path = NodeKey.getPath(getTempDir(true));

  test('it should generate a valid node key', async () => {
    const nodeKey = await NodeKey['generate']();
    validateNodeKey(nodeKey);
  });

  test('it should write a nodekey to disk and read it back without encryption', async () => {
    const nodeKey = await NodeKey['generate'](path);
    await nodeKey.toFile();
    const nodeKeyFromDisk = await NodeKey.fromFile(path);
    expect(nodeKey.privKey.compare(nodeKeyFromDisk.privKey)).toEqual(0);
  });

  test('it should write a nodekey to disk and read it back with encryption', async () => {
    const password = 'wasspord';
    const nodeKey = await NodeKey['generate'](path);
    await nodeKey.toFile(password);
    const nodeKeyFromDisk = await NodeKey.fromFile(path, password);
    expect(nodeKey.privKey.compare(nodeKeyFromDisk.privKey)).toEqual(0);
  });

  test('it should write a nodekey to disk with encryption and fail reading it with the wrong password', async () => {
    const password = 'wasspord';
    const nodeKey = await NodeKey['generate'](path);
    await nodeKey.toFile(password);
    await expect(NodeKey.fromFile(path, 'wrongpassword')).rejects.toThrow();
  });

  test('it should create a valid nodekey from a 32 byte buffer', async () => {
    // we can't use allocUnsafe here because creating a nodekey from 32 bytes of zeros will fail
    // instead we generate 32 random bytes that ~never will be all 0s, unlike allocUnsafe
    const nodeKey = NodeKey.fromBytes(await randomBytes(32));
    validateNodeKey(nodeKey);
  });

  test('it should error when creating a nodekey from a 32 zeroed bytes', () => {
    expect(() => NodeKey.fromBytes(Buffer.alloc(32))).toThrowError('private was invalid, try again');
  });

  test('it should create a valid nodekey from a greater than 32 byte buffer', async () => {
    const nodeKey = NodeKey.fromBytes(await randomBytes(42));
    validateNodeKey(nodeKey);
  });

  test('it should create a valid nodekey from a lesser than 32 byte buffer', async () => {
    const nodeKey = NodeKey.fromBytes(await randomBytes(22));
    validateNodeKey(nodeKey);
  });

  test('it should derive a child seed from private key', async () => {
    const nodeKey = NodeKey.fromBytes(
      Buffer.from([
        0x60,
        0x6c,
        0x9b,
        0xfe,
        0x90,
        0x76,
        0xdd,
        0x00,
        0x9b,
        0x7a,
        0xbb,
        0x5b,
        0xa0,
        0x82,
        0x4d,
        0x14,
        0xb1,
        0x18,
        0x49,
        0x8c,
        0x4c,
        0x5e,
      ]),
    );
    expect(nodeKey.childSeed(SwapClientType.Connext)).toMatchSnapshot();
  });
});
