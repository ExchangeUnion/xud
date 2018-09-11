import chai, { expect } from 'chai';
import Xud from '../../lib/Xud';
import chaiAsPromised from 'chai-as-promised';
import Service from '../../lib/service/Service';
import { SwapClients } from '../../lib/types/enums';

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
      logPath: '',
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
    expect(orders.ownOrders.buy).to.have.length(1);
    expect(orders.ownOrders.buy[0].price).to.equal(placeOrderArgs.price);
    expect(orders.ownOrders.buy[0].quantity).to.equal(placeOrderArgs.quantity);
    expect(orders.ownOrders.buy[0].pairId).to.equal(placeOrderArgs.pairId);
  });

  it('should cancel an order', async () => {
    const args = {
      pairId: 'LTC/BTC',
      orderId: '1',
    };
    await expect(service.cancelOrder(args)).to.be.fulfilled;
  });

  it('should add two currencies', async () => {
    const addCurrencyPromises = [service.addCurrency({ currency: 'ABC', swapClient: SwapClients.LND, decimalPlaces: 0 }),
      service.addCurrency({ currency: 'XYZ', swapClient: SwapClients.LND, decimalPlaces: 0 })];
    await expect(Promise.all(addCurrencyPromises)).to.be.fulfilled;
  });

  it('should add a trading pair', async () => {
    const addPairPromise = service.addPair({
      baseCurrency: 'ABC',
      quoteCurrency: 'XYZ',
    });
    await expect(addPairPromise).to.be.fulfilled;
  });

  it('should fail adding a currency with a ticker that is not 2 to 5 characters long', async () => {
    const tooLongAddCurrencyPromise = service.addCurrency({ currency: 'BITCOIN', swapClient: SwapClients.LND, decimalPlaces: 0 });
    await expect(tooLongAddCurrencyPromise).to.be.rejectedWith('currency must consist of 2 to 5 upper case English letters or numbers');
  });

  it('should fail adding a currency with an invalid letter in its ticker', async () => {
    const invalidLetterAddCurrencyPromise = service.addCurrency({ currency: 'ÑEO', swapClient: SwapClients.LND, decimalPlaces: 0 });
    await expect(invalidLetterAddCurrencyPromise).to.be.rejectedWith('currency must consist of 2 to 5 upper case English letters or numbers');
  });

  it('should fail adding a currency with an invalid swap client', async () => {
    const addCurrencyPromise = service.addCurrency({ currency: 'BTC', swapClient: -1, decimalPlaces: 0 });
    await expect(addCurrencyPromise).to.be.rejectedWith('swap client is not recognized');
  });

  it('should fail adding a currency that already exists', async () => {
    const addCurrencyPromise = service.addCurrency({ currency: 'ABC', swapClient: SwapClients.LND, decimalPlaces: 0 });
    await expect(addCurrencyPromise).to.be.rejectedWith('currency ABC already exists');
  });

  it('should fail adding a pair that already exists', async () => {
    const addPairPromise = service.addPair({
      baseCurrency: 'ABC',
      quoteCurrency: 'XYZ',
    });
    await expect(addPairPromise).to.be.rejectedWith('pair ABC/XYZ already exists');
  });

  it('should fail adding a pair with a currency that does not exist', async () => {
    const addCurrencyPromise = service.addPair({ baseCurrency: 'XXX', quoteCurrency: 'ABC' });
    await expect(addCurrencyPromise).to.be.rejectedWith('currency XXX does not exist');
  });

  it('should fail removing a currency used in an existing trading pair', async () => {
    const removeCurrencyPromise = service.removeCurrency({ currency: 'ABC' });
    await expect(removeCurrencyPromise).to.be.rejectedWith('currency ABC cannot be removed because it is used for ABC/XYZ');
  });

  it('should remove a trading pair', async () => {
    await expect(service.removePair({ pairId: 'ABC/XYZ' })).to.be.fulfilled;
  });

  it('should remove two currencies', async () => {
    const removeCurrencyPromises = [service.removeCurrency({ currency: 'ABC' }), service.removeCurrency({ currency: 'XYZ' })];
    await expect(Promise.all(removeCurrencyPromises)).to.be.fulfilled;
  });

  it('should shutdown', async () => {
    service.shutdown();
    const shutdownPromise = new Promise((resolve) => {
      xud.on('shutdown', () => resolve());
    });
    await expect(shutdownPromise).to.be.fulfilled;
  });
});
