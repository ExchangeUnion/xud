import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { getEnv } from '../bootstrap';

const env = getEnv();
const baseUrl = env.protocol + '://' + env.host + ':' + env.port + '/api/' + env.version;
const endpoint = '/info';

describe(baseUrl + endpoint, () => {
  chai.use(chaiHttp);

  it('GET responds with http status 200', () => {
    return chai.request(baseUrl)
      .get(endpoint)
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
      }, (err: any) => {
        throw err;
      });
  });
});
