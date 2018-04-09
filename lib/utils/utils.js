const utils = exports;

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

utils.getTsString = () => (new Date()).toLocaleString();

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

utils.getGuid = () => {
  // TODO: make it truly unique
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};
