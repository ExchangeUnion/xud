import chai, { assert } from 'chai';
import data from './data/grpc_status_0.json';
import grpc from 'grpc';
import env from '../env';
import { XudClient } from '../../../../lib/proto/xudrpc_grpc_pb';
import { PlaceOrderRequest, Order } from '../../../../lib/proto/xudrpc_pb';

describe('client.placeOrder()', () => {
  const credentials = grpc.credentials.createInsecure();
  let client = new XudClient(env.host + ':' + env.port, credentials);

  it('responds with grpc status 0', () => {
    data.argv.forEach(function(argv) {
      const request = new PlaceOrderRequest();
      const order = new Order();
      order.setPairId(argv.pair_id);
      order.setLocalId(argv.order_id);
      order.setQuantity(argv.quantity);
      order.setPrice(argv.price);
      request.setOrder(order);
      client.placeOrder(request, (error: Error | null, response) => {
        if (error) {
          throw error;
        } else if (response) {
          assert.equal(0, response.toObject().code);
        }
      });
    });
  });

});
