import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import dev from '../../../../lib/constants/dev';

const url = dev.protocol + '://' + dev.host + ':' + dev.port + '/api/' + dev.version + '/info';

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
                  throw err;
                });
  });

});
