import chai, { expect } from 'chai';
import Xud from '../../lib/Xud';
import chaiAsPromised from 'chai-as-promised';
import Service from '../../lib/service/Service';

chai.use(chaiAsPromised);

describe('API Service', () => {
  let xud: Xud;
  let service: Service;

  const placeOrderArgs = {
    orderId: '1',
    pairId: 'LTC/BTC',
    price: 100,
    quantity: 1,
  };

  before(async () => {
    const config = {
      logLevel: 'warn',
      p2p: {
        listen: false,
      },
      rpc: {
        disable: true,
      },
      lndbtc: {
        disable: true,
      },
      lndltc: {
        disable: true,
      },
      raiden: {
        disable: true,
      },
      db: {
        database: 'xud_test',
      },
    };

    xud = new Xud();
    await xud.start(config);
    service = xud.service;
  });

  it('should place an order', () => {
    expect(service.placeOrder(placeOrderArgs)).to.be.fulfilled;
  });

  it('should get orders', async () => {
    const args = {
      pairId: 'LTC/BTC',
      maxResults: 0,
    };
    const orders = service.getOrders(args);
    expect(orders.ownOrders.buyOrders).to.have.length(1);
    expect(orders.ownOrders.buyOrders[0].price).to.equal(placeOrderArgs.price);
    expect(orders.ownOrders.buyOrders[0].quantity).to.equal(placeOrderArgs.quantity);
    expect(orders.ownOrders.buyOrders[0].pairId).to.equal(placeOrderArgs.pairId);
  });

  it('should cancel an order', async () => {
    const args = {
      pairId: 'LTC/BTC',
      orderId: '1',
    };
    const cancelOrderPromise = service.cancelOrder(args);
    expect(cancelOrderPromise).to.be.fulfilled;
    const canceledOrder = await cancelOrderPromise;
    expect(canceledOrder.canceled).to.be.true;
  });

  it('should shutdown', async () => {
    service.shutdown();
    const shutdownPromise = new Promise((resolve) => {
      xud.on('shutdown', () => resolve());
    });
    expect(shutdownPromise).to.be.fulfilled;
    await shutdownPromise;
  });
});
