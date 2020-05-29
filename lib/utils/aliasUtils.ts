import { wordlist } from '../constants/wordlist';
import errors from '../service/errors';

/**
 * Gets a two-word alias from a node pubkey. Throws an error if the pubkey is
 * not a valid 66 character hex string.
 * @param pubkey a public key in hex format to convert to an alias
 */
export const pubKeyToAlias = (pubkey: string): string => {
  const getWord = (substring: string): string | undefined => {
    const asNumber = parseInt(substring, 16);
    if (!isNaN(asNumber)) {
      const index = asNumber % wordlist.length;
      return wordlist[index];
    }
    return undefined;
  };
  if (pubkey.length === 66) {
    const a = getWord(pubkey.slice(0, 33));
    const b = getWord(pubkey.slice(33));
    if (a && b) {
      return a + b;
    }
  }
  throw errors.INVALID_ARGUMENT('Not a valid public key');
};

/**
 * Returns true if a given node identifier could be a node pub key, namely
 * if it is a hex string with the correct length.
 */
export const isNodePubKey = (nodeIdentifier: string): boolean => {
  return nodeIdentifier.length === 66 && /^[0-9a-fA-F]+$/.test(nodeIdentifier);
};
