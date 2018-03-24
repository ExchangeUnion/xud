const util = exports;

util.copyObject = (source, dest) => {
  const sourceKeys = Object.keys(source);
  for (let n = 0; n < sourceKeys.length; n += 1) {
    const key = sourceKeys[n];
    if (typeof dest[key] === 'object' && !Array.isArray(dest[key])) {
      util.copyObject(source[key], dest[key]);
    } else {
      dest[key] = source[key]; // eslint-disable-line no-param-reassign
    }
  }
};

util.nestObject = (obj) => {
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

util.getTsString = () => (new Date()).toLocaleString();
