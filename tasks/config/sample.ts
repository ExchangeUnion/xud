import Config from '../../lib/Config';
import { isPlainObject } from '../../lib/utils/utils';
import fs from 'fs';
import path from 'path';

export default async () => {
  let result = '';

  const recursivelyConvertJsonToToml = (json: any, prefix: string) => {
    const nestedPairs: any = [];
    const simplePairs: any = [];

    if (!json) return;

    Object.keys(json).sort().forEach((key: any) => {
      if (Object.prototype.toString.call(json[key]) !== '[object Function]') {
        (isPlainObject(json[key]) ? nestedPairs : simplePairs).push([key, json[key]]);
      }
    });

    if (!(prefix === '' || simplePairs.length === 0)) {
      result += '\n[' + prefix + ']\n';
    }

    simplePairs.forEach((value: any) => {
      result += value[0] + ' = ' + value[1] + '\n';
    });
    nestedPairs.forEach((value: any) => {
      recursivelyConvertJsonToToml(value[1], (prefix === null || prefix === '') ? value[0] : [prefix, value[0]].join('.'));
    });
  };

  recursivelyConvertJsonToToml(new Config(), '');

  fs.writeFileSync(path.join(__dirname, '../', '../', 'sample-xud.conf'), result);
};
