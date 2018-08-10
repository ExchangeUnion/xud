import chai, { assert, expect } from 'chai';
import grpc from 'grpc';
import env from '../env';
import { XudClient } from '../../../../lib/proto/xudrpc_grpc_pb';

describe('client.getInfo()', () => {
  const credentials = grpc.credentials.createInsecure();
  let client = new XudClient(env.host + ':' + env.port, credentials);

  it('responds with grpc status 0', () => {
    // client.getInfo();
    // TODO
    assert.isOk(false, 'TODO');
  });

});
