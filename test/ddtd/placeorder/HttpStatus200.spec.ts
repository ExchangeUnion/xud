import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import dev from '../../../lib/constants/dev';
import data from './data/http_status_200.json';

const url = dev.protocol + '://' + dev.host + ':' + dev.port + '/api/' + dev.version;
const action = '/placeorder';

describe(url + action, () => {
  chai.use(chaiHttp);
  it('responds with http status 200', (done) => {
    data.httpBody.forEach(function(httpBody) {
      chai.request(url)
        .post(action)
        .set('content-type', 'application/json')
        .send({
          'pair_id': httpBody.pair_id,
          'order_id': httpBody.order_id,
          'price': httpBody.price,
          'quantity': httpBody.quantity
        })
        .then((res: ChaiHttp.Response) => {
          expect(res.status).to.equal(200);
          expect(res).to.be.json;
          done();
        }, (err: any) => {
          throw err;
        });
    });
  });
});
