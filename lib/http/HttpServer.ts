import http from 'http';
import Service from '../service/Service';
import HttpService from './HttpService';
import Logger from '../Logger';

class HttpServer {
  private server: http.Server;
  private httpService: HttpService;

  constructor(private logger: Logger, service: Service) {
    this.server = http.createServer(this.requestListener);
    this.httpService = new HttpService(service);
  }

  private processRequest = async (req: http.IncomingMessage, res: http.ServerResponse) => {
    let statusCode = 200;
    let resJson: any;
    let reqJson: any;

    try {
      reqJson = await this.reqToJson(req);
    } catch (err) {
      statusCode = 400;
      resJson = { message: JSON.stringify(err), retry: false };
    }

    if (reqJson) {
      try {
        switch (req.url) {
          case '/preimage':
            resJson = await this.httpService.providePreimage(reqJson);
            break;
          case '/incoming-transfer':
            resJson = await this.httpService.incomingTransfer(reqJson);
            break;
          case '/deposit-confirmed':
            reqJson = this.httpService.depositConfirmed(reqJson);
            break;
          default:
            throw new Error(`unable to process request to ${req.url}`);
        }
      } catch (err) {
        const msg = `processing request to ${req.url} failed`;
        this.logger.error(msg, err);
        statusCode = 500;
        resJson = { message: msg };
      }
    }
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(resJson));
  };

  private requestListener: http.RequestListener = async (req, res) => {
    if (!req.headers['content-length']) {
      res.writeHead(411);
      res.end();
      return;
    }

    const SUPPORTED_ENDPOINTS = ['/preimage', '/incoming-transfer', '/deposit-confirmed'];

    if (req.url && SUPPORTED_ENDPOINTS.includes(req.url)) {
      await this.processRequest(req, res);
    } else {
      res.writeHead(404);
      res.end();
    }
  };

  private reqToJson = (req: http.IncomingMessage) => {
    return new Promise<object>((resolve, reject) => {
      const body: any[] = [];
      req
        .on('data', (chunk) => {
          body.push(chunk);
        })
        .on('end', () => {
          const bodyStr = Buffer.concat(body).toString();
          const reqContentLength = parseInt(req.headers['content-length'] || '', 10);

          if (bodyStr.length !== reqContentLength) {
            reject('invalid content-length header');
            return;
          }

          try {
            const reqJson = JSON.parse(bodyStr);
            this.logger.debug(`http server request json: ${JSON.stringify(reqJson)}`);
            resolve(reqJson);
          } catch (err) {
            reject('cannot parse request json');
          }
        });
    });
  };

  /**
   * Starts the server and begins listening on the provided port.
   */
  public listen = async (port: number, host: string) => {
    return new Promise<void>((resolve, reject) => {
      const listenErrHandler = (err: Error) => {
        reject(err);
      };

      this.server
        .listen(port, host)
        .once('listening', () => {
          this.logger.info(`http server listening on ${host}:${port}`);
          this.server.removeListener('error', listenErrHandler);
          resolve();
        })
        .on('error', listenErrHandler);
    });
  };

  /**
   * Stops listening for requests.
   */
  public close = () => {
    return new Promise<void>((resolve) => {
      this.server.close(() => {
        this.logger.info('http server has closed');
        resolve();
      });
    });
  };
}

export default HttpServer;
