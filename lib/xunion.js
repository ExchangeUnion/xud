const logger = require('./log');
const Config = require('./config');
const DB = require('./db/db');
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
      this.db = new DB(this.config.db);
      this.orderBook = new OrderBook(this.db);
      this.lndClient = new LndClient(this.config.lndDir);
      this.rpcServer = new RpcServer(this.orderBook, this.lndClient);
      this.p2pServer = new P2PServer(this.orderBook);
      if (this.config.p2p.listen) {
        await this.p2pServer.listen(this.config.p2p.port);
      }
      await this.db.init();
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
