import request from 'supertest';
import HttpServer from '../../lib/http/HttpServer';
import Logger from '../../lib/Logger';
import Service from '../../lib/service/Service';
import errors from '../../lib/swaps/errors';
import { ResolveRequest } from '../../lib/swaps/types';
import { getUnusedPort } from '../utils';

jest.mock('../../lib/Logger');
jest.mock('../../lib/service/Service');
const mockedService = <jest.Mock<Service>><any>Service;

describe('HttpServer - resolveraiden', () => {
  const httpLogger = new Logger({});
  httpLogger.info = jest.fn();
  httpLogger.debug = jest.fn();

  const service = new mockedService();
  service.resolveHash = jest.fn().mockImplementation((resolveRequest: ResolveRequest) => {
    switch (resolveRequest.rHash) {
      case wrongHash:
        throw errors.PAYMENT_HASH_NOT_FOUND(resolveRequest.rHash);
      case finalErrorHash:
        throw errors.FINAL_PAYMENT_ERROR(resolveRequest.rHash);
      case unknownErrorHash:
        throw errors.UNKNOWN_PAYMENT_ERROR(resolveRequest.rHash);
      case paymentPendingHash:
        throw errors.PAYMENT_PENDING(resolveRequest.rHash);
      default:
        return preimage;
    }
  });

  const httpServer = new HttpServer(httpLogger, service);
  let port: number;

  const amount = 10;
  const secrethash = 'rhash';
  const token = 'contractaddress';
  const preimage = 'rpreimage';

  const wrongHash = 'wronghash';
  const finalErrorHash = 'finalerrorhash';
  const unknownErrorHash = 'unknownerrorhash';
  const paymentPendingHash = 'paymentpendinghash';

  beforeAll(async () => {
    port = await getUnusedPort();
    await httpServer.listen(port, 'localhost');
  });

  it('should receive and parse a raiden resolve request', (done) => {
    request(`http://localhost:${port}`)
      .post('/resolveraiden')
      .send({ amount, secrethash, token })
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body.secret).toEqual(preimage);
        done();
      });
  });

  it('should return not found 404 when wrong secret hash provided', (done) => {
    request(`http://localhost:${port}`)
      .post('/resolveraiden')
      .send({ amount, token, secrethash: `0x${wrongHash}` })
      .expect(404)
      .expect('Content-Type', 'application/json')
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body.retry).toEqual(false);
        done();
      });
  });

  it('should return retry=false if a final payment error is encountered internally', (done) => {
    request(`http://localhost:${port}`)
      .post('/resolveraiden')
      .send({ amount, token, secrethash: `0x${finalErrorHash}` })
      .expect(500)
      .expect('Content-Type', 'application/json')
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body.retry).toEqual(false);
        done();
      });
  });

  it('should return retry=true if an unknown payment error is encountered internally', (done) => {
    request(`http://localhost:${port}`)
      .post('/resolveraiden')
      .send({ amount, token, secrethash: `0x${unknownErrorHash}` })
      .expect(503)
      .expect('Content-Type', 'application/json')
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body.retry).toEqual(true);
        done();
      });
  });

  it('should return retry=true if the resolve request cannot be completed due to a pending payment', (done) => {
    request(`http://localhost:${port}`)
      .post('/resolveraiden')
      .send({ amount, token, secrethash: `0x${paymentPendingHash}` })
      .expect(503)
      .expect('Content-Type', 'application/json')
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body.retry).toEqual(true);
        done();
      });
  });

  it('should return a bad request error if the request is malformed', (done) => {
    request(`http://localhost:${port}`)
      .post('/resolveraiden')
      .send({ amount, token, secrethash: 1 }) // secrethash should be a string
      .expect(400)
      .expect('Content-Type', 'application/json')
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body.retry).toEqual(false);
        done();
      });
  });

  it('should return a bad request error if the request is not valid json', (done) => {
    request(`http://localhost:${port}`)
      .post('/resolveraiden')
      .send('notjson')
      .expect(400)
      .expect('Content-Type', 'application/json')
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.body.retry).toEqual(false);
        done();
      });
  });

  it('should 404 if a bad path is used', (done) => {
    request(`http://localhost:${port}`)
      .post('/badendpoint')
      .send({ amount, secrethash, token })
      .expect(404)
      .end((err) => {
        expect(err).toBeNull();
        done();
      });
  });

  afterAll(async () => {
    await httpServer.close();
  });
});
