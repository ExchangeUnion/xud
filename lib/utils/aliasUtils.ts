import { wordlist } from '../constants/wordlist';
import errors from '../service/errors';

export const getAlias = (pubkey: string): string => {
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

export const isAlias = (nodeIdentifier: string): boolean => {
  if (nodeIdentifier.length !== 66) {
    return true;
  } else {
    return false;
  }
};
