import { wordlist } from '../constants/wordlist';

export const getAlias = (pubkey: string): string => {
  const getWord = (substring: string): string | undefined => {
    const asNumber = parseInt(substring, 16);
    if (asNumber) {
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
  return '';
};

export const isAlias = (nodeIdentifier: string): boolean => {
  if (nodeIdentifier.length !== 66) {
    return true;
  } else {
    return false;
  }
};
