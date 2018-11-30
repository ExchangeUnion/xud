import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { env } from '../bootstrap';
import * as codes from '../codes';

const baseUrl = `${env.protocol}://${env.host}:${env.port}/api/${env.version}`;
const endpoint = '/info';

describe(`${baseUrl}${endpoint}`, () => {
  chai.use(chaiHttp);

  it(`GET responds with http status ${codes.grpcToHttp(0)}`, () => {
    return chai.request(baseUrl)
      .get(endpoint)
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(codes.grpcToHttp(0));
        expect(res).to.be.json;
      }, (err: any) => {
        throw err;
      });
  });
});
