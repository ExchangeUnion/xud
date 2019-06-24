import { expect } from 'chai';
import { formatOrders } from '../../lib/cli/commands/listorders';
import { ListOrdersResponse } from '../../lib/proto/xudrpc_pb';
import { satsToCoinsStr, coinsToSats } from '../../lib/cli/utils';

describe('Command.listorders.formatOrders', () => {
  it('should flatten and format orders', () => {
    const jsonOrders: ListOrdersResponse.AsObject = {
      ordersMap: [
        [
          'LTC/BTC',
          {
            buyOrdersList: [
              {
                price: 0.004321,
                quantity: 1,
                pairId: 'LTC/BTC',
                id: '10270831-e755-11e8-a96e-13e8282e2780',
                peerPubKey: '',
                localId: '10270830-e755-11e8-a96e-13e8282e2780',
                createdAt: 1542121316403,
                side: 0,
                isOwnOrder: true,
                hold: 0,
              },
              {
                price: 0.00321,
                quantity: 1,
                pairId: 'LTC/BTC',
                id: '107a5851-e755-11e8-a96e-13e8282e2780',
                peerPubKey: '',
                localId: '107a5850-e755-11e8-a96e-13e8282e2780',
                createdAt: 1542121316949,
                side: 0,
                isOwnOrder: true,
                hold: 0,
              },
            ],
            sellOrdersList: [
              {
                price: 0.00832,
                quantity: 1,
                pairId: 'LTC/BTC',
                id: '0f9af4d1-e755-11e8-8145-13a272c3a58d',
                peerPubKey: '030130758847ada485520016a075833b8638c7e5a56889cb4b76e10c0f61f3520c',
                localId: '',
                createdAt: 1542121315487,
                side: 1,
                isOwnOrder: false,
                hold: 0,
              },
              {
                price: 0.00859,
                quantity: 1,
                pairId: 'LTC/BTC',
                id: '0fb6e141-e755-11e8-8145-13a272c3a58d',
                peerPubKey: '030130758847ada485520016a075833b8638c7e5a56889cb4b76e10c0f61f3520c',
                localId: '',
                createdAt: 1542121315669,
                side: 1,
                isOwnOrder: false,
                hold: 0,
              },
              {
                price: 0.00458,
                quantity: 1,
                pairId: 'LTC/BTC',
                id: '10b23131-e755-11e8-8145-13a272c3a58d',
                peerPubKey: '030130758847ada485520016a075833b8638c7e5a56889cb4b76e10c0f61f3520c',
                localId: '',
                createdAt: 1542121317316,
                side: 1,
                isOwnOrder: false,
                hold: 0,
              },
              {
                price: 0.00725,
                quantity: 1,
                pairId: 'LTC/BTC',
                id: '109644c1-e755-11e8-8145-13a272c3a58d',
                peerPubKey: '030130758847ada485520016a075833b8638c7e5a56889cb4b76e10c0f61f3520c',
                localId: '',
                createdAt: 1542121317133,
                side: 1,
                isOwnOrder: false,
                hold: 0,
              },
              {
                price: 0.00458,
                quantity: 1,
                pairId: 'LTC/BTC',
                id: '10ce92d1-e755-11e8-8145-13a272c3a58d',
                peerPubKey: '030130758847ada485520016a075833b8638c7e5a56889cb4b76e10c0f61f3520c',
                localId: '',
                createdAt: 1542121317502,
                side: 1,
                isOwnOrder: false,
                hold: 0,
              },
            ],
          },
        ],
      ],
    };
    const output = formatOrders(jsonOrders);
    expect(output.length).to.equal(1);
    expect(output[0].pairId).to.equal('LTC/BTC');
    expect(output[0].orders.length).to.equal(5);
  });
});

describe('Satoshi/Coin conversion', () => {
  it('should convert satoshis to coins as strings with up to 8 decimal places', () => {
    expect(satsToCoinsStr(123456789)).to.deep.equal('1.23456789');
    expect(satsToCoinsStr(1234567890000)).to.deep.equal('12345.6789');
    expect(satsToCoinsStr(123456789.1234)).to.deep.equal('1.23456789');
    expect(satsToCoinsStr(123450000)).to.deep.equal('1.2345');
    expect(satsToCoinsStr(100000000)).to.deep.equal('1');
  });

  it('should convert coins to satoshis as integers', () => {
    expect(coinsToSats(1.23456789)).to.deep.equal(123456789);
    expect(coinsToSats(12345.6789)).to.deep.equal(1234567890000);
    expect(coinsToSats(1.234567891234)).to.deep.equal(123456789);
    expect(coinsToSats(1.2345)).to.deep.equal(123450000);
    expect(coinsToSats(1)).to.deep.equal(100000000);
  });
});
