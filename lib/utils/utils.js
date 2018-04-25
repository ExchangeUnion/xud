const utils = exports;

/**
 * Check whether a variable is a non-array object
 * @returns {boolean}
 */
function isObject(val) {
  return (val && typeof val === 'object' && !Array.isArray(val));
}

/** Get the current date in the LocaleString format.
 * @returns {string}
 */
utils.getTsString = () => (new Date()).toLocaleString();

/**
 * Recursively merge properties from different sources into a target object, overriding any
 * existing properties.
 * @param {object} target - The destination object to merge into.
 * @param {object} sources - The sources objects to copy from.
 */
utils.deepMerge = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        utils.deepMerge(target[key], source[key]);
      } else if (source[key] !== undefined) {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }

  return utils.deepMerge(target, ...sources);
};

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
