const logger = require('./log');
const Config = require('./config');
const OrderBook = require('./orderbook/orderbook');
const LndClient = require('./lndclient/lndclient');
const RpcServer = require('./rpcserver/rpcserver');
const P2PServer = require('./p2p/p2pserver');

class XUnion {
  async start() {
    this.config = new Config();
    await this.config.load();
    logger.info('config loaded');

    try {
      this.orderBook = new OrderBook();
      this.lndClient = new LndClient(this.config.lndDir);
      this.rpcServer = new RpcServer(this.orderBook, this.lndClient);
      if (this.config.p2p.listen) {
        this.p2pServer = new P2PServer();
      }
      await this.orderBook.init(this.config.db);
      await this.p2pServer.listen(this.config.p2p.port);
      await this.rpcServer.listen(this.config.rpcPort);
    } catch (err) {
      logger.error(err);
    }
  }
}

if (!module.parent) {
  const xUnion = new XUnion();
  xUnion.start();
}

module.exports = XUnion;
