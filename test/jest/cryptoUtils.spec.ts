import { decrypt, encrypt } from '../../lib/utils/cryptoUtils';

const password = 'wasspord';
const payload = 'itsasecrettoeverybody';

describe('encrypt & decrypt', () => {
  test('encrypts a message and then decrypts it', async () => {
    const encrypted = await encrypt(payload, password);
    const decrypted = decrypt(encrypted, password);
    expect(decrypted.toString()).toEqual(payload);
  });

  test('encrypts a message, converts the decrypted bytes to base64 string, and then decrypts it', async () => {
    const encrypted = await encrypt(payload, password);
    const encryptedString = encrypted.toString('base64');
    const decrypted = decrypt(encryptedString, password);
    expect(decrypted.toString()).toEqual(payload);
  });

  test('can not decrypt message using wrong password', async () => {
    const encrypted = await encrypt(payload, password);
    expect(() => decrypt(encrypted, 'wrongpass')).toThrow(
      'error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt',
    );
  });
});
