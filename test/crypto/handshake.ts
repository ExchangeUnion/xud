import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import secp256k1 from 'secp256k1';
import NodeKey from '../../lib/nodekey/NodeKey';
import { expect } from 'chai';

describe('key exchange and symmetric encryption', () => {
  let aliceSecretKey: Buffer;
  let bobSecretKey: Buffer;

  it('alice and bob should successfully exchange shared secret key', async () => {
    const alice = crypto.createECDH('secp256k1');
    const bob = crypto.createECDH('secp256k1');

    // alice create an ephemeral key pair for the key exchange
    const aliceEphemeralPubKey = alice.generateKeys();

    // bob is using his node key pair
    const bobNodeKey = await NodeKey['generate']();
    const bobNodePubKey = bobNodeKey.nodePubKey;
    const bobNodePrivKey = bobNodeKey['privKey'];
    bob.setPrivateKey(bobNodePrivKey);

    // as the initiator, alice knows bob nodePubKey
    aliceSecretKey = alice.computeSecret(bobNodePubKey, 'hex');

    // bob got aliceEphemeralPubKey from the handshake request
    bobSecretKey = bob.computeSecret(aliceEphemeralPubKey);

    // both alice and bob should derive the same secret key
    expect(Buffer.compare(aliceSecretKey, bobSecretKey)).to.equal(0);
  });

  it('alice should encrypt messages that bob can decrypt', async () => {
    const msg = crypto.randomBytes(100);

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', aliceSecretKey, iv);
    const encrypted = Buffer.concat([iv, cipher.update(msg), cipher.final()]);

    const decipher = crypto.createDecipheriv('aes-256-cbc', bobSecretKey, encrypted.slice(0, 16));
    const decrypted = Buffer.concat([decipher.update(encrypted.slice(16)), decipher.final()]);

    expect(msg.toString('hex')).to.be.equal(decrypted.toString('hex'));
  });

  it('bob should encrypt messages that alice can decrypt', async () => {
    const serializedPacket = crypto.randomBytes(100).toString('hex');

    const encrypted = CryptoJS.AES.encrypt(serializedPacket, bobSecretKey.toString('hex')).toString();
    const decrypted = CryptoJS.AES.decrypt(encrypted, aliceSecretKey.toString('hex')).toString(CryptoJS.enc.Utf8);

    expect(serializedPacket).to.be.equal(decrypted);
  });

});

describe('authentication', () => {
  it('alice should sign its handshake request data and bob should be able to verify it', async () => {
    const aliceNodeKey = await NodeKey['generate']();
    const aliceNodePubKey = aliceNodeKey.nodePubKey;
    const aliceNodePrivKey = aliceNodeKey['privKey'];

    const alice = crypto.createECDH('secp256k1');
    const aliceEphemeralPubKey = alice.generateKeys();

    const aliceHandshakeRequestData = {
      nodePubKey: aliceNodePubKey,
      ephemeralPubKey: aliceEphemeralPubKey,
    };

    const msg = crypto
      .createHash('sha256')
      .update(JSON.stringify(aliceHandshakeRequestData))
      .digest();

    // alice signs the hash of its handshake request data and send it to bob
    const { signature } = secp256k1.sign(msg, aliceNodePrivKey);

    // bob verifies the signature on the handshake request data hash using alice's public key
    const verified = secp256k1.verify(msg, signature, Buffer.from(aliceHandshakeRequestData.nodePubKey, 'hex'));

    expect(verified).to.be.true;
  });
});
