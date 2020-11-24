import colors from 'colors/safe';
import { accessSync, watch } from 'fs';
import os from 'os';
import path from 'path';
import { XudClient } from '../proto/xudrpc_grpc_pb';
import { Arguments } from 'yargs';
import { ServiceError, status } from 'grpc';
import { setTimeoutPromise } from '../utils/utils';

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

export const waitForClient = (client: XudClient, argv: Arguments, ensureConnection: Function, successCallback: Function, printError?: boolean) => {
  client.waitForReady(Date.now() + 3000, (error: Error | null) => {
    if (error) {
      if (error.message === 'Failed to connect before the deadline') {
        console.error(`could not connect to xud at ${argv.rpchost}:${argv.rpcport}, is xud running?`);
        process.exit(1);
      }

      if (printError) console.error(`${error.name}: ${error.message}`);
      setTimeout(ensureConnection.bind(undefined, argv, printError), 3000);
    } else {
      console.log('Successfully connected, streaming');
      successCallback(argv);
    }
  });
};

export const onStreamError = async (ensureConnection: Function, err: ServiceError) => {
  if (err.code === status.UNIMPLEMENTED) {
    console.error("xud is locked, run 'xucli unlock', 'xucli create', or 'xucli restore' then try again");
    process.exit(1);
  }
  console.warn(`Unexpected error occured: ${err.message}, reconnecting in 1 second`);
  await setTimeoutPromise(1000);
  await ensureConnection();
};
