import { expect } from 'chai';
import grpc from 'grpc';
import { env } from '../bootstrap';
import { XudClient } from '../../../lib/proto/xudrpc_grpc_pb';
import { GetNodeInfoRequest } from '../../../lib/proto/xudrpc_pb';
import * as codes from '../codes';
import grpcStatus3 from './data/03_INVALID_ARGUMENT.json';
import grpcStatus5 from './data/05_NOT_FOUND.json';

const method = 'GetNodeInfo';

describe(method, () => {
  const credentials = grpc.credentials.createInsecure();
  let client = new XudClient(`${env.xudrpc.host}:${env.xudrpc.port}`, credentials);

  grpcStatus3.parameters.forEach(function(parameters) {
    it(`${parameters.node_pub_key} responds with grp status 3`, (done) => {
      const request = new GetNodeInfoRequest();
      request.setNodePubKey(parameters.node_pub_key);
      client.getNodeInfo(request, (error, response) => {
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

  grpcStatus5.parameters.forEach(function(parameters) {
    it(`${parameters.node_pub_key} responds with grp status 5`, (done) => {
      const request = new GetNodeInfoRequest();
      request.setNodePubKey(parameters.node_pub_key);
      client.getNodeInfo(request, (error, response) => {
        if (error) {
          done(error);
        } else if (response) {
          // TODO:
          // expect(response.toObject()).to.have.property('bar');
          done();
        }
      });
    });
  });

});
