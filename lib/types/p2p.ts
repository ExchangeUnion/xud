import { NodeFactory } from './db';

export type Address = {
  host: string;
  port: number;
};

/** Information used for connecting to a remote node. */
export type NodeConnectionInfo = NodeFactory;

export type HandshakeState = {
  version: string;
  nodePubKey: string;
  addresses?: Address[];
  pairs: string[];
  raidenAddress?: string;
};

export function isHandshakeState(obj: any): obj is HandshakeState {
  return obj && typeof obj.version === 'string' && typeof obj.nodePubKey === 'string' && Array.isArray(obj.addresses)
    && Array.isArray(obj.pairs);
}
