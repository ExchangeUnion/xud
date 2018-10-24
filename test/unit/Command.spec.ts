import { expect } from 'chai';
import { callback } from '../../lib/cli/command';
import { formatOrders } from '../../lib/cli/commands/getorders';
import { GetOrdersResponse } from '../../lib/proto/xudrpc_pb';

describe('Command.callback', () => {
  it('should call displayTable callback when provided', () => {
    let called = false;
    const displayTable = () => {
      called = true;
    };
    const mockGrpcResponse = {
      toObject: () => {
        return {
          orderMap: [],
        };
      },
    };
    /* tslint:disable */
    callback(displayTable)(null, mockGrpcResponse);
    expect(called).to.equal(true);
  });
});

describe('Command.getorders.formatOrders', () => {
  it('should flatten and format orders', () => {
    const rawOrders = {
      "ordersMap": [
        [
          "LTC/BTC",
          {
            "buyOrdersList": [
              {
                "price": 60,
                "quantity": 1e-8,
                "pairId": "LTC/BTC",
                "id": "e7c89751-d6ce-11e8-8ab6-e145328fd9a5",
                "peerPubKey": "03c57ca4c90a97dffbac5e6cb4488d42c43e359ef5647f7115595ba32d658613a5",
                "localId": "",
                "createdAt": 1540304477511,
                "side": 0,
                "isOwnOrder": false
              }
            ],
            "sellOrdersList": [
              {
                "price": 120,
                "quantity": 1e-8,
                "pairId": "LTC/BTC",
                "id": "e7ac5cc1-d6ce-11e8-b33c-53836c57c7be",
                "peerPubKey": "",
                "localId": "e7ac5cc0-d6ce-11e8-b33c-53836c57c7be",
                "createdAt": 1540304477324,
                "side": 1,
                "isOwnOrder": true
              }
            ]
          }
        ]
      ]
    } as GetOrdersResponse.AsObject;
    const output = formatOrders(rawOrders);
    expect(output.length).to.equal(1);
    expect(output[0].pairId).to.equal('LTC/BTC');
    const expectedRow = [
      '0.00000001',
      '60',
      '',
      '\u001b[36m0.00000001\u001b[39m',
      '\u001b[36m120\u001b[39m',
      '\u001b[36mX\u001b[39m',
    ];
    expect(output[0].orders.length).to.equal(1);
    expect(output[0].orders[0]).to.deep.equal(expectedRow);
  });
});
