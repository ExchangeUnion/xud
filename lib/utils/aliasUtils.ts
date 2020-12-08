import { wordlist } from '../constants/wordlist';
import errors from '../service/errors';

/**
 * Gets a two-word alias from a node pubkey. Throws an error if the pubkey is
 * not a valid 66 character hex string.
 * @param pubkey a public key in hex format to convert to an alias
 */
export const pubKeyToAlias = (pubkey: string): string => {
  const getAlias = (substring: string): string | undefined => {
    const asNumber = parseInt(substring, 16);
    if (!isNaN(asNumber)) {
      const { length } = wordlist;
      const index = asNumber % (length * length);
      const alias = wordlist[Math.floor(index / length)] + wordlist[index % length];
      return alias;
    }
    return undefined;
  };
  if (pubkey.length === 66) {
    const alias = getAlias(pubkey);
    if (alias) {
      return alias;
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
