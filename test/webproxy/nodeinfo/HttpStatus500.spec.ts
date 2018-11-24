import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import Xud from '../../../lib/Xud';
import { getUnusedPort } from '../../utils';
import { getConfig } from '../bootstrap';

const endpoint = 'api/v1/nodeinfo';

describe(endpoint, () => {
  let xud: Xud;
  let config: any;
  chai.use(chaiHttp);

  before(async () => {
    const port = await getUnusedPort();
    config = getConfig(port);
    xud = new Xud();
    await xud.start(config);
  });

  it('GET responds with http status 500', (done) => {
    chai.request(`http://localhost:${config.webproxy.port}/${endpoint}`)
                .get('/')
                .then((res: ChaiHttp.Response) => {
                  expect(res.status).to.equal(500);
                  expect(res).to.be.json;
                  let text = JSON.parse(res.text);
                  expect(text.code).to.equal(3);
                  done();
                }, (err: any) => {
                  throw err;
                });
  });

  after(async () => {
    await xud['shutdown']();
  });
});
