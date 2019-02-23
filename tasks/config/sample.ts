import Config from '../../lib/Config';
import { isPlainObject } from '../../lib/utils/utils';
import fs from 'fs';
import path from 'path';

export default async () => {
  let result = `# Sample configuration file for xud
#
# This sample file contains the default values for all configuration
# options for xud. Directories and file path options are platform &
# user specific and are not included, but are explained below.
#
# 'xudir' is the directory for data stored by xud including logs,
# keys, config and its database. Individual paths can be overridden
# by settings such as 'logpath' and 'dbpath'.
#
# Each lnd config section will have 'macaroonpath' and 'certpath'
# options specific to its chain.
#
# Default values:
#
# Linux
# xudir = "/home/<user>/.xud"
# certpath = "/home/<user>/.lnd/tls.cert"
# macaroonpath = "/home/<user>/.lnd/data/chain/<currency>/<network>/admin.macaroon"
#
# Darwin (macOS)
# xudir = "/Users/<user>/Library/Application Support/Xud"
# certpath = "/Users/<user>/Library/Application Support/Lnd/tls.cert"
# macaroonpath = "/Users/<user>/Library/Application Support/data/chain/<currency>/<network>/admin.macaroon"
#
# Windows
# xudir = "C:\\Users\\<user>\\AppData\\Local\\Xud"
# certpath = "C:\\Users\\<user>\\AppData\\Local\\Lnd\\tls.cert"
# macaroonpath = "C:\\Users\\<user>\\AppData\\Local\\Lnd\\data\\chain\\<currency>\\<network>\\admin.macaroon"

`;

  const recursivelyConvertJsonToToml = (json: any, prefix: string) => {
    const nestedPairs: any = [];
    const simplePairs: any = [];

    if (!json) return;

    Object.keys(json).sort().forEach((key) => {
      if (typeof json[key] !== 'function') {
        if (!key.endsWith('path') && key !== 'xudir') {
          (isPlainObject(json[key]) ? nestedPairs : simplePairs).push([key, json[key]]);
        }
      }
    });

    if (!(prefix === '' || simplePairs.length === 0)) {
      result += '\n[' + prefix + ']\n';
    }

    simplePairs.forEach((value: any) => {
      result += value[0] + ' = ';
      if (typeof value[1] === 'string') {
        result += '"' + value[1] + '"\n';
      } else if (Array.isArray(value[1])) {
        result += '[]\n';
      } else {
        result += value[1] + '\n';
      }
    });
    nestedPairs.forEach((value: any) => {
      recursivelyConvertJsonToToml(value[1], (prefix === null || prefix === '') ? value[0] : [prefix, value[0]].join('.'));
    });
  };

  recursivelyConvertJsonToToml(new Config(), '');

  fs.writeFileSync(path.join(__dirname, '../', '../', 'sample-xud.conf'), result);
};
