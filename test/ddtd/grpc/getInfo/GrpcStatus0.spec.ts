import chai, { assert, expect } from 'chai';
import dev from '../../../../lib/constants/dev';
import grpc from 'grpc';
import { XudClient } from '../../../../lib/proto/xudrpc_grpc_pb';

describe('client.getInfo()', () => {
  const credentials = grpc.credentials.createInsecure();
  let client = new XudClient('localhost:8886', credentials);

  it('responds with grpc status 0', () => {
    // client.getInfo();
    // TODO
    assert.isOk(false, 'TODO');
  });

});
