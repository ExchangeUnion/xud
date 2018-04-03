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

    this.shutdown = this.shutdown.bind(this);
  }

  async start() {
    await this.config.load();
    this.logger.info('config loaded');

    try {
      this.db = new DB(this.config.db);
      this.orderBook = new OrderBook(this.db);

      if (this.config.isLndEnabled()) {
        this.lndClient = new LndClient(this.config);
      }

      this.p2p = new P2P(this.orderBook);
      if (this.config.p2p.listen) {
        this.p2pServer = new P2PServer(this.p2p);
        await this.p2pServer.listen(this.config.p2p.port);
      }
      this.rpcServer = new RpcServer({
        orderBook: this.orderBook,
        lndClient: this.lndClient,
        p2p: this.p2p,
        shutdown: this.shutdown,
      });
      await this.db.init();
      await this.rpcServer.listen(this.config.rpcPort);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async shutdown() {
    // ensure we stop listening for new peers before disconnecting from peers
    if (this.p2pServer) {
      this.p2pServer.close();
    }
    this.p2p.closeAllConnections();

    // TODO: ensure we are not in the middle of executing any trades

    const msg = 'XUD shutdown gracefully';
    (async () => {
      // we use an immediately invoked function here to close rpcServer and exit process AFTER the
      // shutdown method returns a response.
      await this.rpcServer.close();
      this.logger.info(msg);
      process.exit();
    })();

    return msg;
  }
}

if (!module.parent) {
  const xud = new Xud();
  xud.start();
}

module.exports = Xud;
