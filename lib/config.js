const fs = require('fs');
const toml = require('toml');

let props;

let xuDir;
let lndDir;
if (process.env.APPDATA) {
  // windows
  const homeDir = process.env.LOCALAPPDATA;
  xuDir = `${homeDir}/Xunion/`;
  lndDir = `${homeDir}/Lnd/`;
} else {
  const homeDir = process.env.HOME;
  // linux
  xuDir = `${homeDir}/.xunion/`;
  lndDir = `${homeDir}/.lnd/`;
}

async function load() {
  const configText = fs.readFileSync(`${xuDir}xunion.conf`);
  try {
    props = toml.parse(configText);
  } catch (e) {
    throw new Error(`Parsing error on line ${e.line}, column ${e.column
    }: ${e.message}`);
  }
}

function get(key) {
  return props[key];
}

exports.get = get;
exports.load = load;
exports.lndDir = lndDir;
exports.configDir = xuDir;
