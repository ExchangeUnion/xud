import assert = require('assert');

export type UriParts = {
  nodePubKey: string;
  host: string;
  port: number;
};

/**
 * Creates a URI string from the public key, host and port.
 */
export const toUri = (uriParts: UriParts): string => {
  const { nodePubKey, host, port } = uriParts;
  return `${nodePubKey}@${host}:${port}`;
};

/**
 * Splits a URI in the [pubkey]@[host]:[port] format into the public key, host and port components.
 * If port is not present in the URI, it defaults to 8885.
 */
export const parseUri = (uri: string): UriParts => {
  // A regex that splits the string by the symbols "@" and ":"
  const split = uri.split(/[@:]+/);

  assert(split.length === 3 || split.length === 2);

  const port = split[2] !== undefined ? Number(split[2]) : 8885;
  assert(!isNaN(port));

  return {
    port,
    nodePubKey: split[0],
    host: split[1],
  };
};
