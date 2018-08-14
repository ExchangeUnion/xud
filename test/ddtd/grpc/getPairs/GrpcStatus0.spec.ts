import { expect } from 'chai';
import grpc from 'grpc';
import env from '../env';
import { XudClient } from '../../../../lib/proto/xudrpc_grpc_pb';
import { GetPairsRequest } from '../../../../lib/proto/xudrpc_pb';

describe('client.getPairs()', () => {
  const credentials = grpc.credentials.createInsecure();
  let client = new XudClient(env.host + ':' + env.port, credentials);

  it('returns a response on success', (done) => {
      const request = new GetPairsRequest();
      client.getPairs(request, (error, response) => {
        if (error) {
          done(error);
        } else if (response) {
          expect(response.toObject()).to.have.property('pairsList');
          done();
        }
      });
  });
});
