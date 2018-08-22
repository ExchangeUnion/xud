import errorCodesPrefix from '../constants/errorCodesPrefix';
const codesPrefix = errorCodesPrefix.P2P;
const errorCodes = {
  NODE_ALREADY_CONNECTED: codesPrefix.concat('.1'),
  NOT_CONNECTED: codesPrefix.concat('.2'),
  UNEXPECTED_NODE_PUB_KEY: codesPrefix.concat('.3'),
  ATTEMPTED_CONNECTION_TO_SELF: codesPrefix.concat('.4'),
  EXTERNAL_IP_UNRETRIEVABLE: codesPrefix.concat('.5'),
};

const errors = {
  NODE_ALREADY_CONNECTED: (nodePubKey: string, address: string) => ({
    message: `Node ${nodePubKey} at (${address}) already connected`,
    code: errorCodes.NODE_ALREADY_CONNECTED,
  }),
  NOT_CONNECTED: (nodePubKey: string) => ({
    message: `Node (${nodePubKey}) is not connected`,
    code: errorCodes.NOT_CONNECTED,
  }),
  UNEXPECTED_NODE_PUB_KEY: (nodePubKey: string, expectedNodePubKey: string, address: string) => ({
    message: `Node at ${address} sent pub key ${nodePubKey}, expected ${expectedNodePubKey}`,
    code: errorCodes.UNEXPECTED_NODE_PUB_KEY,
  }),
  ATTEMPTED_CONNECTION_TO_SELF: {
    message: 'Cannot attempt connection to self',
    code: errorCodes.ATTEMPTED_CONNECTION_TO_SELF,
  },
  EXTERNAL_IP_UNRETRIEVABLE: (err: Error) => ({
    message: `could not retrieve external IP: ${err.message}`,
    code: errorCodes.EXTERNAL_IP_UNRETRIEVABLE,
  }),
};

export { errorCodes };
export default errors;
