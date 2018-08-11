import chai, { assert } from 'chai';
import grpc from 'grpc';
import env from '../env';
import { XudClient } from '../../../../lib/proto/xudrpc_grpc_pb';
import { GetInfoRequest } from '../../../../lib/proto/xudrpc_pb';

describe('client.getInfo()', () => {
  const credentials = grpc.credentials.createInsecure();
  let client = new XudClient(env.host + ':' + env.port, credentials);

  it('responds with grpc status 0', () => {
      const request = new GetInfoRequest();
      client.getInfo(request, (response) => {
        assert.equal(0, response.toObject().code);
      });
  });
});
