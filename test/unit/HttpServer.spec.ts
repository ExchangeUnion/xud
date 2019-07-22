import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import HttpServer from '../../lib/http/HttpServer';
import Logger, { Level } from '../../lib/Logger';
import { getUnusedPort } from '../utils';
import chaiAsPromised = require('chai-as-promised');
import sinon from 'sinon';
import Service from '../../lib/service/Service';
import { ResolveRequest } from '../../lib/swaps/types';
import { errors } from '../../lib/swaps/errors';

chai.use(chaiAsPromised);
chai.use(chaiHttp);

const loggers = Logger.createLoggers(Level.Warn);

describe('HttpServer', () => {
  const sandbox = sinon.createSandbox();
  const service = sandbox.createStubInstance(Service) as any;
  const httpServer = new HttpServer(loggers.http, service);
  let port: number;

  const amount = 10;
  const secrethash = 'rhash';
  const token = 'contractaddress';
  const preimage = 'rpreimage';

  service.resolveHash = (resolveRequest: ResolveRequest) => {
    if (resolveRequest.rHash === 'wronghash') {
      throw errors.PAYMENT_HASH_NOT_FOUND(resolveRequest.rHash);
    }
    return preimage;
  };

  before(async () => {
    port = await getUnusedPort();
    await httpServer.listen(port, 'localhost');
  });

  it('should receive and parse a raiden resolve request', (done) => {
    chai.request(`http://localhost:${port}`)
      .post('/resolveraiden')
      .send({ amount, secrethash, token })
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(200);
        expect(res).to.be.json;
        expect(res.body.secret).to.equal(preimage);
        done();
      }).catch((reason) => {
        done(reason);
      });
  });

  it('should return not found 404 when wrong secret hash provided', (done) => {
    chai.request(`http://localhost:${port}`)
      .post('/resolveraiden')
      .send({ amount, token, secrethash: '0xwronghash' })
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(404);
        done();
      }).catch((reason) => {
        done(reason);
      });
  });

  it('should return an internal error if an exception is thrown internally', (done) => {
    chai.request(`http://localhost:${port}`)
      .post('/resolveraiden')
      .send({ amount, token, secret_hash: 1 }) // expecting a string
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(500);
        done();
      }).catch((reason) => {
        done(reason);
      });
  });

  it('should return a bad request error if the request is not valid json', (done) => {
    chai.request(`http://localhost:${port}`)
      .post('/resolveraiden')
      .send('notjson')
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(400);
        done();
      }).catch((reason) => {
        done(reason);
      });
  });

  it('should 404 if a bad path is used', (done) => {
    chai.request(`http://localhost:${port}`)
      .post('/badendpoint')
      .send({ amount, secrethash, token })
      .then((res: ChaiHttp.Response) => {
        expect(res.status).to.equal(404);
        done();
      }).catch((reason) => {
        done(reason);
      });
  });

  after(async () => {
    await httpServer.close();
    sandbox.restore();
  });
});
