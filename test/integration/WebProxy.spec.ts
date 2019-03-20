import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import Xud from '../../lib/Xud';
import { getUnusedPort } from '../utils';

describe('WebProxy', async () => {
  let xud: Xud;
  let config: any;
  chai.use(chaiHttp);
  const port = await getUnusedPort();

  before(async () => {
    config = {
      dbpath: ':memory:',
      initdb: false,
      webproxy: {
        port,
        disable: false,
      },
      logpath: '',
      loglevel: 'warn',
      p2p: {
        listen: false,
      },
      lnd: {
        LTC: {
          disable: true,
        },
        BTC: {
          disable: true,
        },
      },
      raiden: {
        disable: true,
      },
    };

    xud = new Xud();
    await xud.start(config);
  });

  it('should respond with http status 200', (done) => {
    chai.request(`http://localhost:${config.webproxy.port}/api/v1/info`)
                .get('/')
                .then((res: ChaiHttp.Response) => {
                  expect(res.status).to.equal(200);
                  expect(res).to.be.json;
                  done();
                }, (err: any) => {
                  throw err;
                });
  });

  after(async () => {
    await xud['shutdown']();
  });
});
