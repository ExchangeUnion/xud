import http from 'http';
import p2pErrors from '../p2p/errors';
import { assert } from 'chai';
import { Pair } from '../types/orders';

export type UriParts = {
  nodePubKey: string;
  host: string;
  port: number;
};

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
 * Creates a URI from the public key, host and port.
 */
export const getUri = (uriParts: UriParts): string => {
  const { nodePubKey, host, port } = uriParts;
  return `${nodePubKey}@${host}:${port}`;
};

/**
 * Splits a URI into the public key, host and port.
 */
export const parseUri = (uri: string): UriParts => {
  // A regex that splits the string by the symbols "@" and ":"
  const split = uri.split(/[@:]+/);

  assert(split.length === 3);

  return {
    nodePubKey: split[0],
    host: split[1],
    port: Number(split[2]),
  };
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

/** Get the current date in the LocaleString format.
 */
export const getTsString = (): string => (new Date()).toLocaleString();

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
