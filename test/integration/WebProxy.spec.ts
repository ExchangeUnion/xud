import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import Xud from '../../lib/Xud';

describe('WebProxy', () => {
  let xud: Xud;
  let config: any;
  chai.use(chaiHttp);

  before(async () => {
    config = {
      webproxy: {
        disable: false,
        port: 8080,
      },
      logLevel: 'warn',
      p2p: {
        listen: false,
      },
      lndbtc: {
        disable: true,
      },
      lndltc: {
        disable: true,
      },
      raiden: {
        disable: true,
      },
      db: {
        database: 'xud_test',
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
