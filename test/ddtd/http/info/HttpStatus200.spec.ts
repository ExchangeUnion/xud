import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import env from '../env';

const url = env.protocol + '://' + env.host + ':' + env.port + '/api/' + env.version + '/info';

describe(url, () => {
  chai.use(chaiHttp);

  it('responds with http status 200', (done) => {
    chai.request(url)
      .get('/')
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        done();
      }, (err: any) => {
        done(err);
      });
  });

});
