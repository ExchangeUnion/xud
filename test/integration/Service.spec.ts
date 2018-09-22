import chai, { expect } from 'chai';
import Xud from '../../lib/Xud';
import chaiAsPromised from 'chai-as-promised';
import Service from '../../lib/service/Service';
import { SwapClients } from '../../lib/types/enums';

chai.use(chaiAsPromised);

describe('API Service', () => {
  let xud: Xud;
  let service: Service;

  const pairId = 'LTC/BTC';
  const placeOrderArgs = {
    pairId,
    orderId: '1',
    price: 100,
    quantity: 1,
  };

  before(async () => {
    const config = {
      initDb: false,
      dbPath: ':memory:',
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
    };

    xud = new Xud();
    await xud.start(config);
    service = xud.service;
  });

  it('should add two currencies', async () => {
    const addCurrencyPromises = [service.addCurrency({ currency: 'LTC', swapClient: SwapClients.LND, decimalPlaces: 0 }),
      service.addCurrency({ currency: 'BTC', swapClient: SwapClients.LND, decimalPlaces: 0 })];
    await expect(Promise.all(addCurrencyPromises)).to.be.fulfilled;
  });

  it('should add a trading pair', async () => {
    const addPairPromise = service.addPair({
      baseCurrency: 'LTC',
      quoteCurrency: 'BTC',
    });
    await expect(addPairPromise).to.be.fulfilled;
  });

  it('should list pairs', () => {
    const pairs = service.listPairs();
    expect(pairs).to.have.lengthOf(1);
    expect(pairs).to.include(pairId);
  });

  it('should place an order', async () => {
    await expect(service.placeOrder(placeOrderArgs)).to.be.fulfilled;
  });

  it('should get orders', async () => {
    const args = {
      pairId,
      includeOwnOrders: true,
    };
    const orders = service.getOrders(args);

    const pairOrders = orders.get(args.pairId);
    expect(pairOrders).to.not.be.undefined;

    expect(pairOrders!.buy).to.have.length(1);

    const order = pairOrders!.buy[0];
    expect(order.price).to.equal(placeOrderArgs.price);
    expect(order.quantity).to.equal(placeOrderArgs.quantity);
    expect(order.pairId).to.equal(placeOrderArgs.pairId);
  });

  it('should cancel an order', async () => {
    const args = {
      orderId: '1',
    };
    await expect(service.cancelOrder(args)).to.be.fulfilled;
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
    const addCurrencyPromise = service.addCurrency({ currency: 'BBQ', swapClient: -1, decimalPlaces: 0 });
    await expect(addCurrencyPromise).to.be.rejectedWith('swap client is not recognized');
  });

  it('should fail adding a currency that already exists', async () => {
    const addCurrencyPromise = service.addCurrency({ currency: 'LTC', swapClient: SwapClients.LND, decimalPlaces: 0 });
    await expect(addCurrencyPromise).to.be.rejectedWith('currency LTC already exists');
  });

  it('should fail adding a pair that already exists', async () => {
    const addPairPromise = service.addPair({
      baseCurrency: 'LTC',
      quoteCurrency: 'BTC',
    });
    await expect(addPairPromise).to.be.rejectedWith('pair LTC/BTC already exists');
  });

  it('should fail adding a pair with a currency that does not exist', async () => {
    const addCurrencyPromise = service.addPair({ baseCurrency: 'XXX', quoteCurrency: 'LTC' });
    await expect(addCurrencyPromise).to.be.rejectedWith('currency XXX does not exist');
  });

  it('should fail removing a currency used in an existing trading pair', async () => {
    const removeCurrencyPromise = service.removeCurrency({ currency: 'LTC' });
    await expect(removeCurrencyPromise).to.be.rejectedWith('currency LTC cannot be removed because it is used for LTC/BTC');
  });

  it('should remove a trading pair', async () => {
    await expect(service.removePair({ pairId })).to.be.fulfilled;
  });

  it('should remove two currencies', async () => {
    const removeCurrencyPromises = [service.removeCurrency({ currency: 'LTC' }), service.removeCurrency({ currency: 'BTC' })];
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
