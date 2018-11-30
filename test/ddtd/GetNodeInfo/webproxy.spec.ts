import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { env } from '../bootstrap';
import * as codes from '../codes';
import grpcStatus3 from './data/03_INVALID_ARGUMENT.json';
import grpcStatus5 from './data/05_NOT_FOUND.json';

const baseUrl = `${env.protocol}://${env.host}:${env.port}/api/${env.version}`;
const endpoint = '/nodeinfo';

describe(`${baseUrl}${endpoint}`, () => {
  chai.use(chaiHttp);

  grpcStatus3.parameters.forEach(function(parameters) {
    it(`GET ${parameters.node_pub_key} responds with http status ${codes.grpcToHttp(3)}`, () => {
      return chai.request(baseUrl)
        .get(`${endpoint}/${parameters.node_pub_key}`)
        .then((res: ChaiHttp.Response) => {
          expect(res.status).to.equal(codes.grpcToHttp(3));
          expect(res).to.be.json;
          let text = JSON.parse(res.text);
          expect(text.message).to.equal('Bad Request: The node pub key must be specified');
        }, (err: any) => {
          throw err;
        });
    });
  });

  grpcStatus5.parameters.forEach(function(parameters) {
    it(`GET ${parameters.node_pub_key} responds with http status ${codes.grpcToHttp(5)}`, () => {
      return chai.request(baseUrl)
        .get(`${endpoint}/${parameters.node_pub_key}`)
        .then((res: ChaiHttp.Response) => {
          expect(res.status).to.equal(codes.grpcToHttp(3));
          expect(res).to.be.json;
          let text = JSON.parse(res.text);
          expect(text.message).to.equal('Not Found');
        }, (err: any) => {
          throw err;
        });
    });
  });

});
