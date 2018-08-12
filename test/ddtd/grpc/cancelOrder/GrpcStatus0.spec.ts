import { expect } from 'chai';
import data from './data/grpc_status_0.json';
import grpc from 'grpc';
import env from '../env';
import { XudClient } from '../../../../lib/proto/xudrpc_grpc_pb';
import { CancelOrderRequest } from '../../../../lib/proto/xudrpc_pb';

describe('client.cancelOrder()', () => {
  const credentials = grpc.credentials.createInsecure();
  let client = new XudClient(env.host + ':' + env.port, credentials);

  it('returns a response on success', (done) => {
    data.argv.forEach(function(argv) {
      const request = new CancelOrderRequest();
      request.setPairId(argv.pair_id);
      request.setOrderId(argv.order_id);
      client.cancelOrder(request, (error, response) => {
        if (error) {
          done(error);
        } else if (response) {
          expect(response.toObject()).to.have.property('canceled');
          done();
        }
      });
    });
  });
});
