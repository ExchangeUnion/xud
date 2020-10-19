import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon, { SinonStub } from 'sinon';
import { OrderSide, Owner, SwapClientType } from '../../lib/constants/enums';
import p2pErrors from '../../lib/p2p/errors';
import Service from '../../lib/service/Service';
import Xud from '../../lib/Xud';
import { getTempDir } from '../utils';
import { ServiceOrderSidesArrays } from '../../lib/service/types';
import { TradingLimits } from '../../lib/swaps/types';

chai.use(chaiAsPromised);

describe('API Service', () => {
  let xud: Xud;
  let service: Service;
  let orderId: string | undefined;

  const pairId = 'LTC/BTC';
  const placeOrderArgs = {
    pairId,
    orderId: '1',
    price: 1,
    quantity: 100,
    side: OrderSide.Buy,
    immediateOrCancel: false,
    replaceOrderId: '',
  };

  before(async () => {
    const config = {
      initdb: false,
      noencrypt: true,
      nosanityswaps: true,
      nobalancechecks: true,
      dbpath: ':memory:',
      loglevel: 'warn',
      logpath: '',
      xudir: getTempDir(true),
      p2p: {
        listen: false,
      },
      http: {
        disable: true,
      },
      rpc: {
        disable: true,
      },
      lnd: {
        LTC: {
          disable: true,
        },
        BTC: {
          disable: true,
        },
      },
      connext: {
        disable: true,
      },
    };

    xud = new Xud();
    await xud.start(config);
    service = xud.service;
  });

  it('should add two currencies', async () => {
    const addCurrencyPromises = [service.addCurrency({ currency: 'LTC', swapClient: SwapClientType.Lnd, decimalPlaces: 0 }),
      service.addCurrency({ currency: 'BTC', swapClient: SwapClientType.Lnd, decimalPlaces: 0 })];
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
    const result = await service.placeOrder(placeOrderArgs);
    expect(result.remainingOrder).to.not.be.undefined;
    expect(result.remainingOrder!.pairId).to.equal(pairId);
    orderId = result.remainingOrder!.id;
  });

  it('should get orders', async () => {
    const args = {
      pairId,
      owner: Owner.Both,
      limit: 0,
      includeAliases: false,
    };
    const orders = service.listOrders(args);

    const pairOrders = orders.get(args.pairId);
    expect(pairOrders).to.not.be.undefined;

    expect(pairOrders!.buyArray).to.have.length(1);

    const order = pairOrders!.buyArray[0];
    expect(order.price).to.equal(placeOrderArgs.price);
    expect(order.quantity).to.equal(placeOrderArgs.quantity);
    expect(order.pairId).to.equal(placeOrderArgs.pairId);
    expect(order.side).to.equal(placeOrderArgs.side);
    expect(order.id).to.equal(orderId);
  });

  it('should remove an order', () => {
    const tp = xud['orderBook'].tradingPairs.get('LTC/BTC')!;
    expect(tp.ownOrders.buyMap.has(orderId!)).to.be.true;
    const args = {
      orderId: '1',
    };
    service.removeOrder(args);
    expect(tp.ownOrders.buyMap.has(orderId!)).to.be.false;
  });

  it('should fail adding a currency with a ticker that is not 2 to 5 characters long', async () => {
    const tooLongAddCurrencyPromise = service.addCurrency({ currency: 'BITCOIN', swapClient: SwapClientType.Lnd, decimalPlaces: 0 });
    await expect(tooLongAddCurrencyPromise).to.be.rejectedWith('currency must consist of 2 to 5 upper case English letters or numbers');
  });

  it('should fail adding a currency with an invalid letter in its ticker', async () => {
    const invalidLetterAddCurrencyPromise = service.addCurrency({ currency: 'ÑEO', swapClient: SwapClientType.Lnd, decimalPlaces: 0 });
    await expect(invalidLetterAddCurrencyPromise).to.be.rejectedWith('currency must consist of 2 to 5 upper case English letters or numbers');
  });

  it('should fail adding a currency with an invalid swap client', async () => {
    const addCurrencyPromise = service.addCurrency({ currency: 'BBQ', swapClient: -1, decimalPlaces: 0 });
    await expect(addCurrencyPromise).to.be.rejectedWith('swap client is not recognized');
  });

  it('should fail adding a currency that already exists', async () => {
    const addCurrencyPromise = service.addCurrency({ currency: 'LTC', swapClient: SwapClientType.Lnd, decimalPlaces: 0 });
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

  it('should fail to ban a node by alias that does not exist', async () => {
    const alias = 'doesNotExist';
    const banNodePromise = service.ban({ nodeIdentifier: alias });
    await expect(banNodePromise).to.be.rejectedWith(p2pErrors.ALIAS_NOT_FOUND(alias).message);
  });

  it('should fail to ban a node by nodePubKey that does not exist', async () => {
    const nodePubKey = '028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0b';
    const banNodePromise = service.ban({ nodeIdentifier: nodePubKey });
    await expect(banNodePromise).to.be.rejectedWith(p2pErrors.NODE_NOT_FOUND(nodePubKey).message);
  });

  it('should shutdown', async () => {
    service.shutdown();
    const shutdownPromise = new Promise((resolve) => {
      xud.on('shutdown', () => resolve());
    });
    await expect(shutdownPromise).to.be.fulfilled;
  });

  describe('Max Gettable From Orderbook Calculation', () => {
    const sinonSandbox = sinon.createSandbox();

    before(async () => {
      const map = new Map<string, ServiceOrderSidesArrays>();
      map.set('BTC/DAI', {
        buyArray: [
          { quantity: 0.01, price: 200000, pairId: 'BTC/DAI', id: 'test_1', createdAt: 1, side: OrderSide.Buy,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key' } },
          { quantity: 0.01, price: 500000, pairId: 'BTC/DAI', id: 'test_2', createdAt: 1, side: OrderSide.Buy,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key2' } },
          { quantity: 0.05, price: 1000000, pairId: 'BTC/DAI', id: 'test_3', createdAt: 1, side: OrderSide.Buy,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key3' } },
        ],
        sellArray: [
          { quantity: 0.01, price: 20000, pairId: 'BTC/DAI', id: 'test_1', createdAt: 1, side: OrderSide.Sell,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key' } },
          { quantity: 0.01, price: 50000, pairId: 'BTC/DAI', id: 'test_2', createdAt: 1, side: OrderSide.Sell,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key2' } },
          { quantity: 0.05, price: 100000, pairId: 'BTC/DAI', id: 'test_3', createdAt: 1, side: OrderSide.Sell,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key3' } },
        ],
      });

      sinonSandbox.stub(service, 'listOrders').returns(map);
    });

    after(async () => {
      sinonSandbox.restore();
    });

    it('should return `0` for 0 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Sell, 'BTC/DAI', 0);
      await expect(number).to.equal(0);
    });

    it('should return `0.0005` for 100 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Sell, 'BTC/DAI', 100);
      await expect(number).to.equal(0.0005);
    });

    it('should return `0.001` for 200 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Sell, 'BTC/DAI', 200);
      await expect(number).to.equal(0.001);
    });

    it('should return `0.0025` for 500 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Sell, 'BTC/DAI', 500);
      await expect(number).to.equal(0.0025);
    });

    it('should return `0.0035` for 700 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Sell, 'BTC/DAI', 700);
      await expect(number).to.equal(0.0035);
    });

    it('should return `0.004` for 800 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Sell, 'BTC/DAI', 800);
      await expect(number).to.equal(0.004);
    });

    it('should return `0.0174` for 5700 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Sell, 'BTC/DAI', 5700);
      await expect(number).to.equal(0.0174);
    });

    it('should return `0.023` for 10000 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Sell, 'BTC/DAI', 10000);
      await expect(number).to.equal(0.023);
    });

    it('should return `0` for 0 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Buy, 'BTC/DAI', 0);
      await expect(number).to.equal(0);
    });

    it('should return `0.005` for 100 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Buy, 'BTC/DAI', 100);
      await expect(number).to.equal(0.005);
    });

    it('should return `0.01` for 200 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Buy, 'BTC/DAI', 200);
      await expect(number).to.equal(0.01);
    });

    it('should return `0.016` for 500 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Buy, 'BTC/DAI', 500);
      await expect(number).to.equal(0.016);
    });

    it('should return `-0.02` for 700 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Buy, 'BTC/DAI', 700);
      await expect(number).to.equal(0.02);
    });

    it('should return `0.021` for 800 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Buy, 'BTC/DAI', 800);
      await expect(number).to.equal(0.021);
    });

    it('should return `0.07` for 5700 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Buy, 'BTC/DAI', 5700);
      await expect(number).to.equal(0.07);
    });

    it('should return `0.07` for 10000 balance', async () => {
      const number = service['calculateMaxGettableFromOrderBook'](OrderSide.Buy, 'BTC/DAI', 10000);
      await expect(number).to.equal(0.07);
    });
  });

  describe('Max Quantity Market Buy Calculation', () => {
    let tradingLimitsStub: SinonStub;
    const sinonSandbox = sinon.createSandbox();

    beforeEach(async () => {
      const ltcBtc = new Map<string, ServiceOrderSidesArrays>();
      ltcBtc.set('LTC/BTC', {
        buyArray: [],
        sellArray: [
          { quantity: 0.01, price: 2, pairId: 'LTC/BTC', id: 'test_1', createdAt: 1, side: OrderSide.Sell,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key' } },
          { quantity: 0.01, price: 50000, pairId: 'LTC/BTC', id: 'test_2', createdAt: 1, side: OrderSide.Sell,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key2' } },
        ],
      });
      const usdtDai = new Map<string, ServiceOrderSidesArrays>();
      usdtDai.set('USDT/DAI', {
        buyArray: [],
        sellArray: [
          { quantity: 3, price: 100000, pairId: 'USDT/DAI', id: 'test_1', createdAt: 1, side: OrderSide.Sell,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key1' } },
          { quantity: 50, price: 150000, pairId: 'USDT/DAI', id: 'test_2', createdAt: 1, side: OrderSide.Sell,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key2' } },
        ],
      });
      const btcUsdt = new Map<string, ServiceOrderSidesArrays>();
      btcUsdt.set('BTC/USDT', {
        buyArray: [],
        sellArray: [
          { quantity: 0.00045, price: 15000, pairId: 'BTC/USDT', id: 'test_1', createdAt: 1, side: OrderSide.Sell,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key1' } },
          { quantity: 1.05, price: 20000, pairId: 'BTC/USDT', id: 'test_2', createdAt: 1, side: OrderSide.Sell,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key2' } },
        ],
      });
      const ethBtc = new Map<string, ServiceOrderSidesArrays>();
      ethBtc.set('ETH/BTC', {
        buyArray: [],
        sellArray: [
          { quantity: 0.75, price: 500, pairId: 'ETH/BTC', id: 'test_1', createdAt: 1, side: OrderSide.Sell,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key1' } },
          { quantity: 1.95, price: 750, pairId: 'ETH/BTC', id: 'test_2', createdAt: 1, side: OrderSide.Sell,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key2' } },
        ],
      });

      sinonSandbox.stub(service, 'listOrders')
      .withArgs({ pairId: 'LTC/BTC', owner: Owner.Both, limit: 0, includeAliases: false }).returns(ltcBtc)
      .withArgs({ pairId: 'USDT/DAI', owner: Owner.Both, limit: 0, includeAliases: false }).returns(usdtDai)
      .withArgs({ pairId: 'BTC/USDT', owner: Owner.Both, limit: 0, includeAliases: false }).returns(btcUsdt)
      .withArgs({ pairId: 'ETH/BTC', owner: Owner.Both, limit: 0, includeAliases: false }).returns(ethBtc);
      tradingLimitsStub = sinonSandbox.stub(service, 'tradingLimits');
    });

    afterEach(async () => {
      sinonSandbox.restore();
    });

    it('should return min(max amount of base using max sell bound for quote, buy max base) lnd/lnd mkt buy', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('BTC', {
        maxSell: 1.025,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('LTC', {
        maxSell: 0,
        maxBuy : 5,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsStub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('LTC', 'BTC', OrderSide.Buy, undefined, SwapClientType.Lnd, SwapClientType.Lnd);
      await expect(number).to.equal(0.0100201);
    });

    it('should return min(max amount of base using max sell bound for quote, buy max base) lnd/lnd mkt buy-2', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('BTC', {
        maxSell: 1.025,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('LTC', {
        maxSell: 0,
        maxBuy : 1,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsStub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('LTC', 'BTC', OrderSide.Buy, undefined, SwapClientType.Lnd, SwapClientType.Lnd);
      await expect(number).to.equal(0.0100201);
    });

    it('should return (uses max sell bound for quote to calculate base amount) connext/connext mkt buy', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('USDT', {
        maxSell: 0,
        maxBuy : 1.025,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('DAI', {
        maxSell: 5,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsStub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('USDT', 'DAI',
          OrderSide.Buy, 0.5, SwapClientType.Connext, SwapClientType.Connext);
      await expect(number).to.equal(10);
    });

    it('should return min(max amount of base using max sell bound for quote, buy max base) lnd/connext mkt buy', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('BTC', {
        maxSell: 0,
        maxBuy : 1.025,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('USDT', {
        maxSell: 5,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsStub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('BTC', 'USDT', OrderSide.Buy, undefined, SwapClientType.Lnd, SwapClientType.Connext);
      await expect(number).to.equal(0.0003333333333333333);
    });

    it('should return min(max amount of base using max sell bound for quote, buy max base) lnd/connext mkt buy - 2', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('BTC', {
        maxSell: 0,
        maxBuy : 5,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('USDT', {
        maxSell: 1,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsStub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('BTC', 'USDT', OrderSide.Buy, undefined, SwapClientType.Lnd, SwapClientType.Connext);
      await expect(number).to.equal(0.00006666666666666667);
    });

    it('should return (uses max sell bound for quote to calculate base amount) connext/lnd mkt buy', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('ETH', {
        maxSell: 0,
        maxBuy : 1.025,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('BTC', {
        maxSell: 5,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsStub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('ETH', 'BTC', OrderSide.Buy, undefined, SwapClientType.Connext, SwapClientType.Lnd);
      await expect(number).to.equal(0.01);
    });
  });

  describe('Max Quantity Market Sell Calculation', () => {
    let stub: SinonStub;
    const sinonSandbox = sinon.createSandbox();

    beforeEach(async () => {
      const ltcBtc = new Map<string, ServiceOrderSidesArrays>();
      ltcBtc.set('LTC/BTC', {
        sellArray: [],
        buyArray: [
          { quantity: 0.01, price: 20000, pairId: 'LTC/BTC', id: 'test_1', createdAt: 1, side: OrderSide.Buy,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key' } },
          { quantity: 0.01, price: 50000, pairId: 'LTC/BTC', id: 'test_2', createdAt: 1, side: OrderSide.Buy,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key2' } },
        ],
      });
      const usdtDai = new Map<string, ServiceOrderSidesArrays>();
      usdtDai.set('USDT/DAI', {
        sellArray: [],
        buyArray: [
          { quantity: 3, price: 100000, pairId: 'USDT/DAI', id: 'test_1', createdAt: 1, side: OrderSide.Buy,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key1' } },
          { quantity: 50, price: 150000, pairId: 'USDT/DAI', id: 'test_2', createdAt: 1, side: OrderSide.Buy,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key2' } },
        ],
      });
      const btcUsdt = new Map<string, ServiceOrderSidesArrays>();
      btcUsdt.set('BTC/USDT', {
        sellArray: [],
        buyArray: [
          { quantity: 0.00045, price: 15000, pairId: 'BTC/USDT', id: 'test_1', createdAt: 1, side: OrderSide.Buy,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key1' } },
          { quantity: 1.05, price: 20000, pairId: 'BTC/USDT', id: 'test_2', createdAt: 1, side: OrderSide.Buy,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key2' } },
        ],
      });
      const ethBtc = new Map<string, ServiceOrderSidesArrays>();
      ethBtc.set('ETH/BTC', {
        sellArray: [],
        buyArray: [
          { quantity: 0.75, price: 500, pairId: 'ETH/BTC', id: 'test_1', createdAt: 1, side: OrderSide.Buy,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key1' } },
          { quantity: 1.95, price: 750, pairId: 'ETH/BTC', id: 'test_2', createdAt: 1, side: OrderSide.Buy,
            isOwnOrder: false, nodeIdentifier: { nodePubKey: 'some_key2' } },
        ],
      });

      sinonSandbox.stub(service, 'listOrders')
      .withArgs({ pairId: 'LTC/BTC', owner: Owner.Both, limit: 0, includeAliases: false }).returns(ltcBtc)
      .withArgs({ pairId: 'USDT/DAI', owner: Owner.Both, limit: 0, includeAliases: false }).returns(usdtDai)
      .withArgs({ pairId: 'BTC/USDT', owner: Owner.Both, limit: 0, includeAliases: false }).returns(btcUsdt)
      .withArgs({ pairId: 'ETH/BTC', owner: Owner.Both, limit: 0, includeAliases: false }).returns(ethBtc);
      stub = sinonSandbox.stub(service, 'tradingLimits');
    });

    afterEach(async () => {
      sinonSandbox.restore();
    });

    it('should return min(max amount of base using max buy bound for quote, sell max base) lnd/lnd mkt sell', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('BTC', {
        maxBuy: 1.025,
        maxSell : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('LTC', {
        maxBuy: 0,
        maxSell : 5,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('LTC', 'BTC', OrderSide.Sell, undefined, SwapClientType.Lnd, SwapClientType.Lnd);
      await expect(number).to.equal(0.00005125);
    });

    it('should return min(max amount of base using max buy bound for quote, sell max base) lnd/lnd mkt sell-2', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('BTC', {
        maxBuy: 1.025,
        maxSell : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('LTC', {
        maxBuy: 0,
        maxSell : 1,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('LTC', 'BTC', OrderSide.Sell, undefined, SwapClientType.Lnd, SwapClientType.Lnd);
      await expect(number).to.equal(0.00005125);
    });

    it('should return (use max sell bound for base) connext/connext sell', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('USDT', {
        maxBuy: 0,
        maxSell : 1.025,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('DAI', {
        maxBuy: 0,
        maxSell : 5,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('USDT', 'DAI',
                OrderSide.Sell, 0.5, SwapClientType.Connext, SwapClientType.Connext);
      await expect(number).to.equal(1.025);
    });

    it('should return (use max sell bound for base) lnd/connext sell', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('BTC', {
        maxBuy: 0,
        maxSell : 1.025,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('USDT', {
        maxBuy: 5,
        maxSell : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('BTC', 'USDT', OrderSide.Sell, undefined, SwapClientType.Lnd, SwapClientType.Connext);
      await expect(number).to.equal(1.025);
    });

    it('should return min(max amount of base using max buy bound for quote, max sell bound for base) connext/lnd mkt sell', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('ETH', {
        maxBuy: 0,
        maxSell : 1.025,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('BTC', {
        maxBuy: 5,
        maxSell : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('ETH', 'BTC', OrderSide.Sell, undefined, SwapClientType.Connext, SwapClientType.Lnd);
      await expect(number).to.equal(0.01);
    });

    it('should return min(max amount of base using max buy bound for quote, max sell bound for base) connext/lnd mkt sell-2', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('ETH', {
        maxBuy: 0,
        maxSell : 5,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('BTC', {
        maxBuy: 1,
        maxSell : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('ETH', 'BTC', OrderSide.Sell, undefined, SwapClientType.Connext, SwapClientType.Lnd);
      await expect(number).to.equal(0.002);
    });
  });

  describe('Max Quantity Limit Buy Calculation', () => {
    let stub: SinonStub;
    const sinonSandbox = sinon.createSandbox();

    beforeEach(async () => {
      stub = sinonSandbox.stub(service, 'tradingLimits');
    });

    afterEach(async () => {
      sinonSandbox.restore();
    });

    it('should return min(max amount of base using max sell bound for quote, buy max base) lnd/lnd buy', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('BTC', {
        maxSell: 1.025,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('LTC', {
        maxSell: 0,
        maxBuy : 5,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('LTC', 'BTC', OrderSide.Buy, 0.5, SwapClientType.Lnd, SwapClientType.Lnd);
      await expect(number).to.equal(2.05);
    });

    it('should return min(max amount of base using max sell bound for quote, buy max base) lnd/lnd buy-2', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('BTC', {
        maxSell: 1.025,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('LTC', {
        maxSell: 0,
        maxBuy : 1,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('LTC', 'BTC', OrderSide.Buy, 0.5, SwapClientType.Lnd, SwapClientType.Lnd);
      await expect(number).to.equal(1);
    });

    it('should return (uses max sell bound for quote to calculate base amount) connext/connext buy', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('USDT', {
        maxSell: 0,
        maxBuy : 1.025,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('DAI', {
        maxSell: 5,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('USDT', 'DAI',
          OrderSide.Buy, 0.5, SwapClientType.Connext, SwapClientType.Connext);
      await expect(number).to.equal(10);
    });

    it('should return min(max amount of base using max sell bound for quote, buy max base) lnd/connext buy', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('BTC', {
        maxSell: 0,
        maxBuy : 1.025,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('USDT', {
        maxSell: 5,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('BTC', 'USDT', OrderSide.Buy, 0.5, SwapClientType.Lnd, SwapClientType.Connext);
      await expect(number).to.equal(1.025);
    });

    it('should return min(max amount of base using max sell bound for quote, buy max base) lnd/connext buy - 2', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('BTC', {
        maxSell: 0,
        maxBuy : 5,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('USDT', {
        maxSell: 1,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('BTC', 'USDT', OrderSide.Buy, 0.5, SwapClientType.Lnd, SwapClientType.Connext);
      await expect(number).to.equal(2);
    });

    it('should return (uses max sell bound for quote to calculate base amount) connext/lnd buy', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('ETH', {
        maxSell: 0,
        maxBuy : 1.025,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('BTC', {
        maxSell: 5,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('ETH', 'BTC', OrderSide.Buy, 0.5, SwapClientType.Connext, SwapClientType.Lnd);
      await expect(number).to.equal(10);
    });
  });

  describe('Max Quantity Limit Sell Calculation', () => {
    let stub: SinonStub;
    const sinonSandbox = sinon.createSandbox();

    beforeEach(async () => {
      stub = sinonSandbox.stub(service, 'tradingLimits');
    });

    afterEach(async () => {
      sinonSandbox.restore();
    });

    it('should return min(max amount of base using max buy bound for quote, sell max base) lnd/lnd sell', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('BTC', {
        maxSell: 0,
        maxBuy : 1.025,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('LTC', {
        maxSell: 5,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('LTC', 'BTC', OrderSide.Sell, 0.5, SwapClientType.Lnd, SwapClientType.Lnd);
      await expect(number).to.equal(2.05);
    });

    it('should return min(max amount of base using max buy bound for quote, sell max base) lnd/lnd sell-2', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('BTC', {
        maxSell: 0,
        maxBuy : 1.025,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('LTC', {
        maxSell: 1,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('LTC', 'BTC', OrderSide.Sell, 0.5, SwapClientType.Lnd, SwapClientType.Lnd);
      await expect(number).to.equal(1);
    });

    it('should return (use max sell bound for base) connext/connext sell', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('USDT', {
        maxSell: 1.025,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('DAI', {
        maxSell: 5,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('USDT', 'DAI',
          OrderSide.Sell, 0.5, SwapClientType.Connext, SwapClientType.Connext);
      await expect(number).to.equal(1.025);
    });

    it('should return (use max sell bound for base) lnd/cnxt sell', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('BTC', {
        maxSell: 1.025,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('USDT', {
        maxSell: 0,
        maxBuy : 5,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('BTC', 'USDT', OrderSide.Sell, 0.5, SwapClientType.Lnd, SwapClientType.Connext);
      await expect(number).to.equal(1.025);
    });

    it('should return min(max amount of base using max buy bound for quote, max sell bound for base) connext/lnd sell', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('ETH', {
        maxSell: 1.025,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('BTC', {
        maxSell: 0,
        maxBuy : 5,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('ETH', 'BTC', OrderSide.Sell, 0.5, SwapClientType.Connext, SwapClientType.Lnd);
      await expect(number).to.equal(1.025);
    });

    it('should return min(max amount of base using max buy bound for quote, max sell bound for base) connext/lnd sell-2', async () => {
      const tradingLimitsMap = new Map<string, TradingLimits>();
      tradingLimitsMap.set('ETH', {
        maxSell: 5,
        maxBuy : 0,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      tradingLimitsMap.set('BTC', {
        maxSell: 0,
        maxBuy : 1,
        reservedOutbound: 0,
        reservedInbound: 0,
      });
      stub.returns(Promise.resolve(tradingLimitsMap));

      const number = await service['calculateOrderMaxQuantity']('ETH', 'BTC', OrderSide.Sell, 0.5, SwapClientType.Connext, SwapClientType.Lnd);
      await expect(number).to.equal(2);
    });
  });
});
