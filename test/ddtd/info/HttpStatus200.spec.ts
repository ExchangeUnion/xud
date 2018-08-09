import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

const protocol = 'http';
const host = 'localhost';
const port = '8080';
const action = '/api/v1/info';
const url = protocol + '://' + host + ':' + port + action;

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
