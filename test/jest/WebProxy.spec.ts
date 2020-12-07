import request from 'supertest';
import Xud from '../../lib/Xud';
import { getTempDir, getUnusedPort } from '../utils';

console.log = jest.fn();
describe('WebProxy', () => {
  let xud: Xud;
  let config: any;

  beforeAll(async () => {
    const port = await getUnusedPort();
    config = {
      xudir: getTempDir(true),
      dbpath: ':memory:',
      initdb: false,
      noencrypt: true,
      webproxy: {
        port,
        disable: false,
      },
      logpath: '',
      loglevel: 'error',
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
      connext: {
        disable: true,
      },
    };

    xud = new Xud();
    await xud.start(config);
  });

  it('should respond with http status 200', done => {
    request(`http://localhost:${config.webproxy.port}/api/v1/info`)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end(err => {
        expect(err).toBeNull();
        done();
      });
  });

  afterAll(async () => {
    await xud['shutdown']();
  });
});
