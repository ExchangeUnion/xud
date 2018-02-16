const mysql = require('promise-mysql');
const logger = require('winston');

let pool;
mysql.createPool({
  host: 'localhost',
  database: 'mordor',
}).then((result) => {
  pool = result;
}).catch((err) => {
  logger.error(err);
  throw err;
});

async function getOrderbook() {
  const [bids, asks] = await Promise.all([
    pool.query('SELECT `price`, `quantity`, FROM orders WHERE `quantity` > 0 ORDER BY `price` DESC'),
    pool.query('SELECT `price`, `quantity`, FROM orders WHERE `quantity` < 0 ORDER BY `price` ASC'),
  ]);
  return {
    bids,
    asks,
  };
}

async function placeOrder(order) {
  const result = await pool.query('INSERT INTO orders SET ?', order);
  logger.info(`placed order: ${order}`);
  return result;
}

exports.getOrderbook = getOrderbook;
exports.placeOrder = placeOrder;
