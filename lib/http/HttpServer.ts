import http from 'http';
import Service from '../service/Service';
import HttpService from './HttpService';
import Logger from '../Logger';
import errorCodes from '../service/errors';
import { errorCodes as swapErrorCodes } from '../swaps/errors';

const reqToJson = (req: http.IncomingMessage) => {
  return new Promise<object>((resolve, reject) => {
    const body: any[] = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      const bodyStr = Buffer.concat(body).toString();
      const reqContentLength = parseInt(req.headers['content-length'] || '', 10);

      if (bodyStr.length !== reqContentLength) {
        reject('invalid content-length header');
        return;
      }

      try {
        resolve(JSON.parse(bodyStr));
      } catch (err) {
        reject('cannot parse request json');
      }
    });
  });
};

class HttpServer {
  private server: http.Server;
  private httpService: HttpService;

  constructor(private logger: Logger, service: Service) {
    this.server = http.createServer(this.requestListener);
    this.httpService = new HttpService(service);
  }

  private requestListener: http.RequestListener = async (req, res) => {
    if (!req.headers['content-length']) {
      res.writeHead(411);
      res.end();
      return;
    }

    let reqJson: any;
    try {
      reqJson = await reqToJson(req);
      this.logger.debug(`http server request json: ${JSON.stringify(reqJson)}`);
    } catch (err) {
      res.writeHead(400);
      res.end(err);
      return;
    }

    let resJson: any;
    try {
      switch (req.url) {
        case '/resolveraiden':
          resJson = await this.httpService.resolveHashRaiden(reqJson);
          break;
        default:
          res.writeHead(404);
          res.end();
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(resJson));
    } catch (err) {
      if (err.code === errorCodes.INVALID_ARGUMENT) {
        res.writeHead(400);
        res.end(err.message);
      } else if (err.code === swapErrorCodes.PAYMENT_HASH_NOT_FOUND) {
        res.writeHead(404);
        res.end(err.message);
      } else {
        res.writeHead(500);
        res.end(JSON.stringify(err));
      }
    }
  }

  /**
   * Starts the server and begins listening on the provided port.
   */
  public listen = async (port: number) => {
    return new Promise<void>((resolve, reject) => {
      const listenErrHandler = (err: Error) => {
        reject(err);
      };

      this.server.listen(port, '127.0.0.1').once('listening', () => {
        this.logger.info(`http server listening on 127.0.0.1:${port}`);
        this.server.removeListener('error', listenErrHandler);
        resolve();
      }).on('error', listenErrHandler);
    });
  }

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
  }
}

export default HttpServer;
