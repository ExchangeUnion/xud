'use strict';

const util = exports;

util.copyObject = function(source, dest) {
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

util.modifyArgs = (args) => {
  const modifiedArgs = {};
  const argKeys = Object.keys(args);
  for (let n = 0; n < argKeys.length; n += 1) {
    const key = argKeys[n];
    const arg = args[key];
    if (key.indexOf('.') !== -1) {
      const parentKey = key.substring(0, key.indexOf('.'));
      if (!modifiedArgs[parentKey]) {
        modifiedArgs[parentKey] = {};
      }
      const childKey = key.substring(key.indexOf('.') + 1);
      modifiedArgs[parentKey][childKey] = arg;
    } else {
      modifiedArgs[key] = arg;
    }
  }
  return modifiedArgs;
}

util.getTsString = function() {
  return (new Date()).toLocaleString();
};