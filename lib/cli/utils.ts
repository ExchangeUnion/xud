import colors from 'colors/safe';
import { accessSync, watch } from 'fs';
import os from 'os';
import path from 'path';

const SATOSHIS_PER_COIN = 10 ** 8;

export function getDefaultCertPath() {
  switch (os.platform()) {
    case 'win32': {
      const homeDir = process.env.LOCALAPPDATA!;
      return path.join(homeDir, 'Xud', 'tls.cert');
    }
    case 'darwin': {
      const homeDir = process.env.HOME!;
      return path.join(homeDir, '.xud', 'tls.cert');
    }
    default: {
      const homeDir = process.env.HOME!;
      return path.join(homeDir, '.xud', 'tls.cert');
    }
  }
}

export function shorten(key: string, length = 10) {
  if (key.length <= (length * 2) + 3) {
    return key;
  }
  return `${key.slice(0, length)}...${key.slice(key.length - length)}`;
}

export function trim(key: string, length = 10) {
  if (key.length <= length + 3) {
    return '';
  }
  return `${key.slice(0, length)}...`;
}

export const generateHeaders = (headers: string[]) => {
  return headers.map((header) => {
    return colors.blue(header);
  });
};

/** Returns a number of coins as an integer number of satoshis. */
export const coinsToSats = (coinsQuantity: number) => {
  return Math.round(coinsQuantity * SATOSHIS_PER_COIN);
};

/** Returns a number of satoshis as a string representation of coins with up to 8 decimal places. */
export const satsToCoinsStr = (satsQuantity: number) => {
  return (satsQuantity / SATOSHIS_PER_COIN).toFixed(8).replace(/\.?0+$/, '');
};

/** Waits up to 5 seconds for the tls.cert file to be created in case this is the first time xud has been run. */
export const waitForCert = (certPath: string) => {
  return new Promise<void>((resolve, reject) => {
    try {
      accessSync(certPath);
      resolve();
    } catch (err) {
      if (err.code === 'ENOENT') {
        const certDir = path.dirname(certPath);
        const certFilename = path.basename(certPath);
        const fsWatcher = watch(certDir, (event, filename) => {
          if (event === 'change' && filename === certFilename) {
            clearTimeout(timeout);
            fsWatcher.close();
            resolve();
          }
        });
        const timeout = setTimeout(() => {
          fsWatcher.close();
          reject(`timed out waiting for cert to be created at ${certPath}`);
        }, 5000);
      } else {
        // we handle errors due to file not existing, otherwise reject
        reject(err);
      }
    }
  });
};

export const argChecks = {
  NUMBER_CHECK: ({ param, paramName, allowedValues }: { param: any, paramName: string, allowedValues?: string[] }) => {
    if (!param || (isNaN(param) && allowedValues?.indexOf(param) === -1)) {
      throw `${paramName} is not a valid number`;
    }
  },
  PAIR_ID_CHECK: ({ pairId }: { pairId: string }) => {
    const [firstCurrency, secondCurrency] = pairId.split('/');
    if (!firstCurrency || !secondCurrency) {
      throw `${pairId} is not a valid pair`;
    }
  },
};
