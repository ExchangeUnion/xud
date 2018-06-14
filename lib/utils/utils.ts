import path from 'path';
import fs from 'fs';

/**
 * Check whether a variable is a non-array object
 */
export const isObject = (val: any): boolean => {
  return (val && typeof val === 'object' && !Array.isArray(val));
};

/** Get the current date in the LocaleString format.
 */
export const getTsString = (): string => (new Date()).toLocaleString();

/**
 * Recursively merge properties from different sources into a target object, overriding any
 * existing properties.
 * @param target The destination object to merge into.
 * @param sources The sources objects to copy from.
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
  const ret = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).forEach((name) => {
    const func = obj[name];
    if ((func instanceof Function) && name !== 'constructor' && !name.startsWith('_')) {
      ret[name] = func;
    }
  });
  return ret;
};

export const groupBy = (arr: object[], keyGetter: (item: any) => string | number): any => {
  const ret = {};
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
 * Create nested directories or folder path recursively (like mkdir -p in linux)
 * @param targetDir directory path to be created.
 * @param isRelative is supplied targetDir is relative path.
 */
export const mkdirRecursiveSync = (targetDir: string, isRelative = false): any => {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelative ? __dirname : '.';

  targetDir.split(sep).reduce((prevDirPath, dirToCreate) => {
    const curDirPathToCreate = path.resolve(baseDir, prevDirPath, dirToCreate);
    try {
      fs.mkdirSync(curDirPathToCreate);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    // caught EEXIST error if curDirPathToCreate already existed (not a problem for us).
    }
    return curDirPathToCreate; // becomes prevDirPath on next call to reduce
  }, initDir);
};
