import http from 'http';
import p2pErrors from '../p2p/errors';
import { Pair } from '../orderbook/types';
import crypto from 'crypto';
import { promisify } from 'util';
import moment from 'moment';

/**
 * Gets the external IP of the node.
 */
export const getExternalIp = () => {
  return new Promise<string>((resolve, reject) => {
    http.get('http://ipv4.icanhazip.com/', (res) => {
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

    }).on('error', (err: Error) => {
      reject(p2pErrors.EXTERNAL_IP_UNRETRIEVABLE(err));
    });
  });
};

/**
 * Check whether a variable is a non-array object
 */
export const isObject = (val: any): boolean => {
  return (val && typeof val === 'object' && !Array.isArray(val));
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
    if ((func instanceof Function) && name !== 'constructor' && !name.startsWith('_')) {
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

/** A promisified wrapper for the NodeJS `crypto.randomBytes` method. */
export const randomBytes = promisify(crypto.randomBytes);

export const removeUndefinedProps = (obj: any) => {
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
  for (const key in obj) {
    if (obj[key] !== undefined) {
      map.set(key, obj[key]);
    }
  }
};

/**
 * Converts an array of key value pair arrays into an object with the key value pairs.
 */
export const convertKvpArrayToKvps = <T>(kvpArray: [string, T][]): { [key: string]: T } => {
  const kvps: { [key: string]: T } = {};
  for (const kvp of kvpArray.values()) {
    kvps[kvp[0]] = kvp[1];
  }
  return kvps;
};
