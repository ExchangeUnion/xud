import errorCodesPrefix from '../constants/errorCodesPrefix';
import addressUtils from '../utils/addressUtils';
import { Address } from './types';

const codesPrefix = errorCodesPrefix.P2P;
const errorCodes = {
  NODE_ALREADY_CONNECTED: codesPrefix.concat('.1'),
  NOT_CONNECTED: codesPrefix.concat('.2'),
  UNEXPECTED_NODE_PUB_KEY: codesPrefix.concat('.3'),
  ATTEMPTED_CONNECTION_TO_SELF: codesPrefix.concat('.4'),
  EXTERNAL_IP_UNRETRIEVABLE: codesPrefix.concat('.5'),
  CONNECTION_RETRIES_MAX_PERIOD_EXCEEDED: codesPrefix.concat('.6'),
  CONNECTION_RETRIES_REVOKED: codesPrefix.concat('.7'),
  COULD_NOT_CONNECT: codesPrefix.concat('.7'),
  NODE_UNKNOWN: codesPrefix.concat('.8'),
  NODE_ALREADY_BANNED: codesPrefix.concat('.9'),
  NODE_NOT_BANNED: codesPrefix.concat('.10'),
  NODE_IS_BANNED: codesPrefix.concat('.11'),
  ALREADY_CONNECTING: codesPrefix.concat('.12'),
  RESPONSE_TIMEOUT: codesPrefix.concat('.13'),
  AUTH_FAILURE_INVALID_TARGET: codesPrefix.concat('.14'),
  AUTH_FAILURE_INVALID_SIGNATURE: codesPrefix.concat('.15'),
  PARSER_INVALID_PACKET: codesPrefix.concat('.16'),
  PARSER_UNKNOWN_PACKET_TYPE: codesPrefix.concat('.17'),
  PARSER_DATA_INTEGRITY_ERR: codesPrefix.concat('.18'),
  PARSER_MAX_BUFFER_SIZE_EXCEEDED: codesPrefix.concat('.19'),
  FRAMER_MSG_NOT_ENCRYPTED: codesPrefix.concat('.`20'),
  FRAMER_INVALID_NETWORK_MAGIC_VALUE: codesPrefix.concat('.21'),
  FRAMER_INVALID_MSG_LENGTH: codesPrefix.concat('.22'),
};

const errors = {
  NODE_ALREADY_CONNECTED: (nodePubKey: string, address: Address) => ({
    message: `node ${nodePubKey} at ${addressUtils.toString(address)} already connected`,
    code: errorCodes.NODE_ALREADY_CONNECTED,
  }),
  NOT_CONNECTED: (nodePubKey: string) => ({
    message: `node (${nodePubKey}) is not connected`,
    code: errorCodes.NOT_CONNECTED,
  }),
  UNEXPECTED_NODE_PUB_KEY: (nodePubKey: string, expectedNodePubKey: string, address: string) => ({
    message: `node at ${address} sent pub key ${nodePubKey}, expected ${expectedNodePubKey}`,
    code: errorCodes.UNEXPECTED_NODE_PUB_KEY,
  }),
  MALFORMED_VERSION: (address: string, peerVersion: string | undefined) => ({
    message: `node at ${address} has version ${peerVersion}, which is malformed, should be in semantic format`,
    code: errorCodes.UNEXPECTED_NODE_PUB_KEY,
  }),
  INCOMPATIBLE_VERSION: (address: string, minCompatibleVersion: string, peerVersion: string | undefined) => ({
    message: `node at ${address} has version ${peerVersion}, expected minimum ${minCompatibleVersion}`,
    code: errorCodes.UNEXPECTED_NODE_PUB_KEY,
  }),
  ATTEMPTED_CONNECTION_TO_SELF: {
    message: 'cannot attempt connection to self',
    code: errorCodes.ATTEMPTED_CONNECTION_TO_SELF,
  },
  EXTERNAL_IP_UNRETRIEVABLE: (err: Error) => ({
    message: `could not retrieve external IP: ${err.message}`,
    code: errorCodes.EXTERNAL_IP_UNRETRIEVABLE,
  }),
  CONNECTION_RETRIES_MAX_PERIOD_EXCEEDED: {
    message: `Connection retry attempts to peer exceeded maximum time allotment`,
    code: errorCodes.CONNECTION_RETRIES_MAX_PERIOD_EXCEEDED,
  },
  CONNECTION_RETRIES_REVOKED: {
    message: `Connection retry attempts to peer were revoked`,
    code: errorCodes.CONNECTION_RETRIES_REVOKED,
  },
  COULD_NOT_CONNECT: (address: Address, err: Error) => ({
    message: `could not connect to peer at ${addressUtils.toString(address)}: ${err.message}`,
    code: errorCodes.COULD_NOT_CONNECT,
  }),
  NODE_UNKNOWN: (nodePubKey: string) => ({
    message: `node ${nodePubKey} is unknown`,
    code: errorCodes.NODE_UNKNOWN,
  }),
  NODE_ALREADY_BANNED: (nodePubKey: string) => ({
    message: `node ${nodePubKey} has already been banned`,
    code: errorCodes.NODE_ALREADY_BANNED,
  }),
  NODE_NOT_BANNED: (nodePubKey: string) => ({
    message: `node ${nodePubKey} has not been banned`,
    code: errorCodes.NODE_NOT_BANNED,
  }),
  NODE_IS_BANNED: (nodePubKey: string) => ({
    message: `could not connect to node ${nodePubKey} because it is banned`,
    code: errorCodes.NODE_IS_BANNED,
  }),
  ALREADY_CONNECTING: (nodePubKey: string) => ({
    message: `there is already an existing connection attempt to node ${nodePubKey}`,
    code: errorCodes.ALREADY_CONNECTING,
  }),
  RESPONSE_TIMEOUT: (request: string) => ({
    message: `response timeout (${request}) `,
    code: errorCodes.RESPONSE_TIMEOUT,
  }),
  AUTH_FAILURE_INVALID_TARGET: (nodePubKey: string, target: string) => ({
    message: `could not authenticate peer (${nodePubKey}): invalid target (${target})`,
    code: errorCodes.AUTH_FAILURE_INVALID_TARGET,
  }),
  AUTH_FAILURE_INVALID_SIGNATURE: (nodePubKey: string) => ({
    message: `could not authenticate peer (${nodePubKey}): invalid signature`,
    code: errorCodes.AUTH_FAILURE_INVALID_SIGNATURE,
  }),
  PARSER_INVALID_PACKET: (packet: string) => ({
    message: `parser: invalid packet: ${packet}`,
    code: errorCodes.PARSER_INVALID_PACKET,
  }),
  PARSER_UNKNOWN_PACKET_TYPE: (packetType: string) => ({
    message: `parser: unknown packet type: ${packetType}`,
    code: errorCodes.PARSER_UNKNOWN_PACKET_TYPE,
  }),
  PARSER_DATA_INTEGRITY_ERR: (packet: string) => ({
    message: `parser: packet data integrity error: ${packet}`,
    code: errorCodes.PARSER_DATA_INTEGRITY_ERR,
  }),
  PARSER_MAX_BUFFER_SIZE_EXCEEDED: (size: number) => ({
    message: `parser: max buffer size exceeded: ${size.toString()}`,
    code: errorCodes.PARSER_MAX_BUFFER_SIZE_EXCEEDED,
  }),
  FRAMER_MSG_NOT_ENCRYPTED: {
    message: `framer: msg is not encrypted`,
    code: errorCodes.FRAMER_MSG_NOT_ENCRYPTED,
  },
  FRAMER_INVALID_NETWORK_MAGIC_VALUE: {
    message: `framer: msg has an invalid network magic value (might be encrypted)`,
    code: errorCodes.FRAMER_INVALID_NETWORK_MAGIC_VALUE,
  },
  FRAMER_INVALID_MSG_LENGTH: (expected: number, found: number) => ({
    message: `framer: invalid msg length (expected: ${expected} found: ${found})`,
    code: errorCodes.FRAMER_INVALID_NETWORK_MAGIC_VALUE,
  }),
};

export { errorCodes };
export default errors;
