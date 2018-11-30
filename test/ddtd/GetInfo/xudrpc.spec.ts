import { expect } from 'chai';
import grpc from 'grpc';
import { env } from '../bootstrap';
import { XudClient } from '../../../lib/proto/xudrpc_grpc_pb';
import { GetInfoRequest } from '../../../lib/proto/xudrpc_pb';
import * as codes from '../codes';

const method = 'GetInfo';

describe(method, () => {
  const credentials = grpc.credentials.createInsecure();
  let client = new XudClient(`${env.xudrpc.host}:${env.xudrpc.port}`, credentials);

  it('responds successfully', (done) => {
    const request = new GetInfoRequest();
    client.getInfo(request, (error, response) => {
      if (error) {
        done(error);
      } else if (response) {
        // TODO:
        // expect(response.toObject()).to.have.property('foo');
        done();
      }
    });
  });
});
