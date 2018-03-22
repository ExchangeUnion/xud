'use strict';

const util = exports;

util.copyObject = function (source, dest) {
  const sourceKeys = Object.keys(source);
  for (let n = 0; n < sourceKeys.length; n += 1) {
    const key = sourceKeys[n];
    if (typeof dest[key] === 'object' && !Array.isArray(dest[key])) {
      copyObject(source[key], dest[key]);
    } else {
      dest[key] = source[key]; // eslint-disable-line no-param-reassign
    }
  }
};

util.getTsString = function () {
  return (new Date()).toLocaleString();
};

util.getPublicFunctions = function (obj) {
  const ret = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).forEach(name => {
    let func = obj[name];
    if ((func instanceof Function) && name !== 'constructor' && !name.startsWith('_')) {
      ret[name] = func;
    }
  });
  return ret;
};