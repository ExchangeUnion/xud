import request from 'supertest';
import HttpServer from '../../lib/http/HttpServer';
import Logger from '../../lib/Logger';
import Service from '../../lib/service/Service';
import { getUnusedPort } from '../utils';

jest.mock('../../lib/Logger');
jest.mock('../../lib/service/Service');
const mockedService = <jest.Mock<Service>>(<any>Service);

describe('HttpServer - preimage', () => {
  const httpLogger = new Logger({});
  httpLogger.info = jest.fn();
  httpLogger.debug = jest.fn();

  const service = new mockedService();
  service.providePreimage = jest.fn();

  const httpServer = new HttpServer(httpLogger, service);
  let port: number;

  const preImage = 'd55dd2b285a815f9449d9e665ed61dd19663e08e9d4e84db621ca3e78082fabf';

  beforeAll(async () => {
    port = await getUnusedPort();
    await httpServer.listen(port, 'localhost');
  });

  it('should receive and parse a preimage request', (done) => {
    request(`http://localhost:${port}`)
      .post('/preimage')
      .send({ transfer: { transferResolver: { preImage } } })
      .expect(200)
      .expect('Content-Type', 'application/json')
      .end((err) => {
        expect(err).toBeNull();
        expect(service.providePreimage).toHaveBeenCalledTimes(1);
        done();
      });
  });

  it('should return a bad request error if the request is not valid json', (done) => {
    request(`http://localhost:${port}`)
      .post('/preimage')
      .send('notjson')
      .expect(400)
      .expect('Content-Type', 'application/json')
      .end((err) => {
        expect(err).toBeNull();
        done();
      });
  });

  it('should 404 if a bad path is used', (done) => {
    request(`http://localhost:${port}`)
      .post('/badendpoint')
      .send({})
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
