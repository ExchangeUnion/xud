import uuidv1 from 'uuid/v1';
import { GetOrdersResponse, Order } from '../lib/proto/xudrpc_pb';
import { toFixed } from '../lib/utils/utils';

// Random enough for testing purposes
const randomNumber = (min: number, max: number) => {
  return (Math.random() * (max - min) + min);
};

const createOrder = () => {
  const id = uuidv1();
  return {
    id,
    localId: id,
    price: toFixed(randomNumber(0.001, 0.999)),
    quantity: toFixed(randomNumber(0.00000001, 0.04000000)),
    // TODO: Specify trading pair
    pairId: 'LTC/BTC',
    // TODO: Randomize rest of the properties
    peerPubKey: '',
    createdAt: 1542121316403,
    side: 0,
    isOwnOrder: true,
    hold: 0,
  };
};

export const createOrdersResponse = (buyOrdersAmount = 0, sellOrdersAmount = 0) => {
  const buyOrdersList = Array.from(Array(buyOrdersAmount))
    .map(createOrder);
  const sellOrdersList = Array.from(Array(sellOrdersAmount))
    .map(createOrder);
  const getOrdersResponse: GetOrdersResponse.AsObject = {
    ordersMap: [
      [
        'LTC/BTC',
        {
          sellOrdersList,
          buyOrdersList,
        },
      ],
    ],
  };
  return getOrdersResponse;
};
