import { expect } from 'chai';
import data from './data/grpc_status_0.json';
import grpc from 'grpc';
import env from '../env';
import { XudClient } from '../../../../lib/proto/xudrpc_grpc_pb';
import { ExecuteSwapRequest, SwapPayload } from '../../../../lib/proto/xudrpc_pb';

describe('client.executeSwap()', () => {
  const credentials = grpc.credentials.createInsecure();
  let client = new XudClient(env.host + ':' + env.port, credentials);

  it('returns a response on success', (done) => {
    data.argv.forEach(function(argv) {
      const request = new ExecuteSwapRequest();
      request.setTargetAddress(argv.target_address);
      const payload = new SwapPayload();
      payload.setSendingAmount(argv.sending_amount);
      payload.setSendingToken(argv.sending_token);
      payload.setReceivingAmount(argv.receiving_amount);
      payload.setReceivingToken(argv.receiving_token);
      request.setPayload(payload);
      client.executeSwap(request, (error, response) => {
        if (error) {
          done(error);
        } else if (response) {
          expect(response.toObject()).to.have.property('result');
          done();
        }
      });
    });
  });
});
