const logger = require('./log');
const Config = require('./config');
const OrderBook = require('./orderbook/orderbook');
const LndClient = require('./lndclient/lndclient');
const RpcServer = require('./rpcserver/rpcserver');

class XUnion {
  constructor() {
    this.config = new Config();
    this.orderBook = new OrderBook();
    this.rpcServer = new RpcServer();
  }

  async start() {
    await this.config.load();
    logger.info('config loaded');

    this.lndClient = new LndClient(this.config.lndDir);
    await this.orderBook.init();
    await this.rpcServer.listen();
    logger.info('RPC server listening');
  }
}

module.exports = XUnion;
