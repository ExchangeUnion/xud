const utils = exports;

/**
 * Copy the properties of one object to another, overriding any existing
 * properties. Object properties are copied recursively.
 * @param {object} source - The source object to copy from.
 * @param {object} dest - The destination object to copy to.
 */
utils.copyObject = (source, dest) => {
  const sourceKeys = Object.keys(source);
  for (let n = 0; n < sourceKeys.length; n += 1) {
    const key = sourceKeys[n];
    if (typeof dest[key] === 'object' && !Array.isArray(dest[key])) {
      utils.copyObject(source[key], dest[key]);
    } else {
      dest[key] = source[key]; // eslint-disable-line no-param-reassign
    }
  }
};

/**
 * Nest the properties of an object that contain a '.' in them. The part before the '.' becomes
 * the parent key and the part after becomes the nested child key.
 * @param {object} obj - The object to nest.
 */
utils.nestObject = (obj) => {
  const nestedObject = {};
  const keys = Object.keys(obj);
  for (let n = 0; n < keys.length; n += 1) {
    const key = keys[n];
    const arg = obj[key];
    if (key.indexOf('.') !== -1) {
      const parentKey = key.substring(0, key.indexOf('.'));
      if (!nestedObject[parentKey]) {
        nestedObject[parentKey] = {};
      }
      const childKey = key.substring(key.indexOf('.') + 1);
      nestedObject[parentKey][childKey] = arg;
    } else {
      nestedObject[key] = arg;
    }
  }
  return nestedObject;
};

/** Get the current date in the LocaleString format.
 * @returns {string}
*/
utils.getTsString = () => (new Date()).toLocaleString();

/** Get all methods from an object whose name doesn't start with an underscore.
 * @returns {object}
*/
utils.getPublicMethods = (obj) => {
  const ret = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).forEach((name) => {
    const func = obj[name];
    if ((func instanceof Function) && name !== 'constructor' && !name.startsWith('_')) {
      ret[name] = func;
    }
  });
  return ret;
};

utils.groupBy = (arr, keyGetter) => {
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