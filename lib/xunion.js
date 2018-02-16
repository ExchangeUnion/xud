const logger = require('./log');
const config = require('./config');
const rpcserver = require('./rpcserver/rpcserver');

config.load().then(() => {
  logger.info('config loaded');
  rpcserver.start();
});
