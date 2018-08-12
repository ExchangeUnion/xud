import chai, { assert, expect } from 'chai';
import chaiHttp from 'chai-http';
import data from './data/http_status_200.json';
import env from '../env';

const url = env.protocol + '://' + env.host + ':' + env.port + '/api/' + env.version;
const action = '/cancelorder';

describe(url + action, () => {
  chai.use(chaiHttp);
  
  it('responds with http status 200', (done) => {
    data.httpBody.forEach(function(httpBody) {
      chai.request(url)
        .post(action)
        .set('content-type', 'application/json')
        .send({
          'pair_id': httpBody.pair_id,
          'order_id': httpBody.order_id
        })
        .then((res: ChaiHttp.Response) => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          done();
        }, (err: any) => {
          done(err);
        });
    });
  });
});
