import http from 'http';
// @ts-ignore
import createKeccakHash from 'keccak';
import moment from 'moment';
import os from 'os';
import path from 'path';
import { promisify } from 'util';
import { Pair, SortableOrder } from '../orderbook/types';
import p2pErrors from '../p2p/errors';

const MAX_DECIMAL_PLACES = 12;

/**
 * Gets the external IP of the node.
 */
export const getExternalIp = () => {
  return new Promise<string>((resolve, reject) => {
    http
      .get('http://ipv4.icanhazip.com/', (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          // Removes new line at the end of the string
          body = body.trimRight();
          resolve(body);
        });
        res.on('error', (err: Error) => {
          reject(p2pErrors.EXTERNAL_IP_UNRETRIEVABLE(err));
        });
      })
      .on('error', (err: Error) => {
        reject(p2pErrors.EXTERNAL_IP_UNRETRIEVABLE(err));
      })
      .on('error', (err: Error) => {
        reject(p2pErrors.EXTERNAL_IP_UNRETRIEVABLE(err));
      });
  });
};

/**
 * Check whether a variable is a non-array object
 */
export const isObject = (val: any): boolean => {
  return val && typeof val === 'object' && !Array.isArray(val);
};

/**
 * Check whether a variable is an empty object
 */
export const isEmptyObject = (val: any): boolean => {
  return isObject(val) && Object.keys(val).length === 0;
};

/** Get the current date in the given dateFormat, if not provided formats with `YYYY-MM-DD hh:mm:ss.sss`.
 */
export const getTsString = (dateFormat?: string): string => moment().format(dateFormat || 'YYYY-MM-DD hh:mm:ss.sss');

/**
 * Recursively merge properties from different sources into a target object, overriding any
 * existing properties.
 * @param target the destination object to merge into.
 * @param sources the sources objects to copy from.
 */
export const deepMerge = (target: any, ...sources: any[]): object => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else if (source[key] !== undefined) {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }

  return deepMerge(target, ...sources);
};

/**
 * Get all methods from an object whose name doesn't start with an underscore.
 */
export const getPublicMethods = (obj: any): any => {
  const ret: any = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).forEach((name) => {
    const func = obj[name];
    if (func instanceof Function && name !== 'constructor' && !name.startsWith('_')) {
      ret[name] = func;
    }
  });
  return ret;
};

export const groupBy = (arr: object[], keyGetter: (item: any) => string | number): any => {
  const ret: any = {};
  arr.forEach((item) => {
    const key = keyGetter(item);
    const group = ret[key];
    if (!group) {
      ret[key] = [item];
    } else {
      group.push(item);
    }
  });
  return ret;
};

/** Returns true if number has more than MAX_DECIMAL_PLACES, false otherwise. */
export const checkDecimalPlaces = (digits: number) => {
  const fixed = Number(digits.toFixed(MAX_DECIMAL_PLACES));
  return fixed < digits;
};

/**
 * Get current time in unix time (milliseconds).
 */
export const ms = (): number => {
  return Date.now();
};

/**
 * Convert a pair's base currency and quote currency to a ticker symbol pair id.
 */
export const derivePairId = (pair: Pair) => {
  return `${pair.baseCurrency}/${pair.quoteCurrency}`;
};

/**
 * A simplified copy of lodash's isPlainObject;
 *
 * A plain object is;
 * - prototype should be [object Object]
 * - shouldn't be null
 * - its type should be 'object' (does extra check because typeof null == object)
 *
 * Examples;
 * isPlainObject(new Foo); => false
 * isPlainObject([1, 2, 3]); => false
 * isPlainObject({ 'x': 0, 'y': 0 }); => true
 * isPlainObject(Object.create(null)); => true
 */
export const isPlainObject = (obj: any) => {
  if (typeof obj !== 'object' || obj === null || Object.prototype.toString.call(obj) !== '[object Object]') {
    return false;
  }
  if (Object.getPrototypeOf(obj) === null) {
    return true;
  }
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
};

/** A promisified wrapper for the NodeJS `setTimeout` method. */
export const setTimeoutPromise = promisify(setTimeout);

export const removeUndefinedProps = <T>(typedObj: T): T => {
  const obj = typedObj as any;
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      removeUndefinedProps(obj[key]);
    }
  });

  return obj;
};

export const setObjectToMap = (obj: any, map: { set: (key: string, value: any) => any }) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      map.set(key, obj[key]);
    }
  });
};

/**
 * Converts an array of key value pair arrays into an object with the key value pairs.
 */
export const convertKvpArrayToKvps = <T>(kvpArray: [string, T][]): { [key: string]: T } => {
  const kvps: { [key: string]: T } = {};
  kvpArray.forEach((kvp) => {
    kvps[kvp[0]] = kvp[1]; // eslint-disable-line prefer-destructuring
  });

  return kvps;
};

export const sortOrders = <T extends SortableOrder>(orders: T[], isBuy: boolean): T[] => {
  return orders.sort((a: T, b: T) => {
    if (a.price === b.price) {
      return a.createdAt - b.createdAt;
    }
    return isBuy ? a.price - b.price : b.price - a.price;
  });
};

export const base64ToHex = (b64: string) => {
  return Buffer.from(b64, 'base64').toString('hex');
};

export const hexToUint8Array = (hex: string) => {
  return Uint8Array.from(Buffer.from(hex, 'hex'));
};

export const uint8ArrayToHex = (uint8: Uint8Array) => {
  return Buffer.from(uint8).toString('hex');
};

/**
 * Converts input to EIP55 format.
 * Prints the ith digit in uppercase if it's a letter and the 4*ith bit of the hash of the lowercase hexadecimal address is 1
 * otherwise prints it in lowercase.
 * Example: '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359' is converted to '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359'
 */
export const toEip55Address = (address: string) => {
  const lowercaseAddress = address.toLowerCase().replace('0x', '');
  const hash = createKeccakHash('keccak256').update(lowercaseAddress).digest('hex');
  let ret = '0x';

  for (let i = 0; i < lowercaseAddress.length; i += 1) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += lowercaseAddress[i].toUpperCase();
    } else {
      ret += lowercaseAddress[i];
    }
  }
  return ret;
};

export const getDefaultBackupDir = () => {
  switch (os.platform()) {
    case 'win32':
      return path.join(process.env.LOCALAPPDATA!, 'Xud Backup');
    default:
      return path.join(process.env.HOME!, '.xud-backup');
  }
};

/**
 * A utility function to parse the payload from an http response.
 */
export async function parseResponseBody<T>(res: http.IncomingMessage): Promise<T> {
  res.setEncoding('utf8');
  return new Promise<T>((resolve, reject) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      resolve(JSON.parse(body));
    });
    res.on('error', (err) => {
      reject(err);
    });
  });
}
