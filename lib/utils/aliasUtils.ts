import { wordlist } from '../constants/wordlist';
import errors from '../service/errors';

/**
 * Gets a two-word alias from a node pubkey. Throws an error if the pubkey is
 * not a valid 66 character hex string.
 * @param pubkey a public key in hex format to convert to an alias
 */
export const pubKeyToAlias = (pubkey: string): string => {
  const getWord = (substring: string, getIndex: boolean): string | undefined => {
    const asNumber = parseInt(substring, 16);
    if (!isNaN(asNumber)) {
      const index = asNumber % wordlist.length;
      if (getIndex) {
        return index.toString();
      }
      return wordlist[index];
    }
    return undefined;
  };
  if (pubkey.length === 66) {
    const a = getWord(pubkey.slice(0, 22), false);
    const b = getWord(pubkey.slice(22, 44), false);
    const c = getWord(pubkey.slice(44), true);
    if (a && b && c) {
      return `${a}${b}-${c}`;
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
