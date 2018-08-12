import chai, { assert, expect } from 'chai';
import grpc from 'grpc';
import env from '../env';
import { XudClient } from '../../../../lib/proto/xudrpc_grpc_pb';
import { GetInfoRequest } from '../../../../lib/proto/xudrpc_pb';

describe('client.getInfo()', () => {
  const credentials = grpc.credentials.createInsecure();
  let client = new XudClient(env.host + ':' + env.port, credentials);

  it('returns a response on success', (done) => {
      const request = new GetInfoRequest();
      client.getInfo(request, (error, response) => {
        if (error) {
          done(error);
        } else if (response) {
          expect(response.toObject()).to.have.property('numPeers');
          expect(response.toObject()).to.have.property('numPairs');
          expect(response.toObject()).to.have.property('version');
          expect(response.toObject()).to.have.property('orders');
          expect(response.toObject()).to.have.property('lnd');
          expect(response.toObject()).to.have.property('raiden');
          done();
        }
      });
  });
});
