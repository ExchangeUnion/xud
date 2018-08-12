import { expect } from 'chai';
import data from './data/grpc_status_0.json';
import grpc from 'grpc';
import env from '../env';
import { XudClient } from '../../../../lib/proto/xudrpc_grpc_pb';
import { PlaceOrderRequest, Order } from '../../../../lib/proto/xudrpc_pb';

describe('client.placeOrder()', () => {
  const credentials = grpc.credentials.createInsecure();
  let client = new XudClient(env.host + ':' + env.port, credentials);

  it('returns a response on success', (done) => {
    data.argv.forEach(function(argv) {
      const request = new PlaceOrderRequest();
      const order = new Order();
      order.setPairId(argv.pair_id);
      order.setLocalId(argv.order_id);
      order.setQuantity(argv.quantity);
      order.setPrice(argv.price);
      request.setOrder(order);
      client.placeOrder(request, (error, response) => {
        if (error) {
          done(error);
        } else if (response) {
          expect(response.toObject()).to.have.property('matchesList');
          expect(response.toObject()).to.have.property('remainingOrder');
          done();
        }
      });
    });
  });
});
