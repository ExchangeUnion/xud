const Logger = require('./Logger');
const Config = require('./Config');
const DB = require('./db/DB');
const OrderBook = require('./orderbook/OrderBook');
const LndClient = require('./lndclient/LndClient');
const RpcServer = require('./rpcserver/RpcServer');
const P2P = require('./p2p/P2P');
const P2PServer = require('./p2p/P2PServer');

class Xud {
  constructor(args) {
    this.logger = Logger.global;
    this.config = new Config(args);
  }

  async start() {
    await this.config.load();
    this.logger.info('config loaded');

    try {
      this.db = new DB(this.config.db);
      this.orderBook = new OrderBook(this.db);
      this.lndClient = new LndClient(this.config);
      this.p2p = new P2P(this.orderBook);
      this.rpcServer = new RpcServer(this.orderBook, this.lndClient, this.p2p);
      if (this.config.p2p.listen) {
        this.p2pServer = new P2PServer(this.p2p);
        await this.p2pServer.listen(this.config.p2p.port);
      }
      await this.db.init();
      await this.rpcServer.listen(this.config.rpcPort);
    } catch (err) {
      this.logger.error(err);
    }
  }
}

if (!module.parent) {
  const xud = new Xud();
  xud.start();
}

module.exports = Xud;
