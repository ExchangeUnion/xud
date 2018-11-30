import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Parser from '../../lib/p2p/Parser';
import { Packet, PacketType } from '../../lib/p2p/packets';
import * as packets from '../../lib/p2p/packets/types';
import { removeUndefinedProps } from '../../lib/utils/utils';
import { DisconnectionReason } from '../../lib/types/enums';
import uuid = require('uuid');
import { Address } from '../../lib/types/p2p';

chai.use(chaiAsPromised);

describe('Parser', () => {
  const delimiter = Packet.PROTOCOL_DELIMITER;
  const timeoutError = 'timeout';
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser(delimiter);
  });

  function wait(num = 1): Promise<Packet[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject(timeoutError), 0); // expecting results to be fulfilled synchronously
      const parsedPackets: Packet[] = [];
      parser.on('packet', (parsedPacket: Packet) => {
        parsedPackets.push(parsedPacket);
        if (parsedPackets.length === num) {
          resolve(parsedPackets);
        }
      });
      parser.once('error', reject);
    });
  }

  function verify(packets: Packet[]): Promise<Packet[]> {
    return new Promise((resolve, reject) => {
      wait(packets.length)
        .then((parsedPackets) => {
          for (let i = 0; i <= packets.length; i += 1) {
            expect(packets[i]).to.deep.equal(parsedPackets[i]);
          }
          resolve();
        })
        .catch(err => reject(err));
    });
  }

  function testValidPacket(packet: Packet) {
    it(`should parse a valid ${PacketType[packet.type]} packet`, (done) => {
      verify([packet])
        .then(done)
        .catch(done);

      const raw = packet.toRaw();
      parser.feed(raw);
    });
  }

  function testInvalidPacket(packet: Packet) {
    it(`should not parse an invalid ${PacketType[packet.type]} packet`, (done) => {
      verify([packet])
        .then(() => done('err: packet is valid'))
        .catch(() => done());

      const raw = packet.toRaw();
      parser.feed(raw);
    });
  }
/*
  function testSplitPacket(packet: Packet) {
    it(`should parse ${packet.type} split`, (done) => {
      verify([packet])
        .then(done)
        .catch(done);

      const packetStr = packet.toRaw();
      const middleIndex = packetStr.length >> 1;
      parser.feed(packetStr.slice(0, middleIndex));
      parser.feed(packetStr.slice(middleIndex) + delimiter);
    });
  }

  function testConcatenatedPackets(packets: Packet[]) {
    it(`should parse ${packets.map(packet => packet.type).join(' ')} concatenated`, (done) => {
      verify(packets)
        .then(done)
        .catch(done);

      parser.feed(packets.map(packet => packet.toRaw() + delimiter).join(''));
    });
  }

  function testConcatenatedAndSplitOnTheDelimiter(packets: Packet[]) {
    it(`should parse ${packets.map(packet => packet.type).join(' ')} concatenated and split on the delimiter`, (done) => {
      verify(packets)
        .then(done)
        .catch(done);

      let remaining = '';
      packets.forEach((packet) => {
        const packetStr = remaining + packet.toRaw() + delimiter;
        const chunk = packetStr.slice(0, packetStr.length - 1); // split just before the delimiter ends
        remaining = packetStr.slice(packetStr.length - 1); // keep the remaining of the delimiter for the next chunk
        parser.feed(chunk);
      });
      parser.feed(remaining);
    });
  }
  */

  testValidPacket(new packets.PingPacket());
  testInvalidPacket(new packets.PingPacket(undefined, uuid()));

  testValidPacket(new packets.PongPacket(undefined, uuid()));
  testInvalidPacket(new packets.PongPacket(undefined));

  const helloPacketBody = {
    version: '1.0.0',
    nodePubKey: uuid(),
    addresses: [{ host: '1.1.1.1', port: 8885 }, { host: '2.2.2.2', port: 8885 }],
    pairs: [uuid()],
    raidenAddress: uuid(),
    lndbtcPubKey: uuid(),
    lndltcPubKey: uuid(),
  };
  testValidPacket(new packets.HelloPacket(helloPacketBody));
  testValidPacket(new packets.HelloPacket({ ...helloPacketBody, pairs: [] }));
  testValidPacket(new packets.HelloPacket({ ...helloPacketBody, addresses: [] }));
  testValidPacket(new packets.HelloPacket(removeUndefinedProps({ ...helloPacketBody, raidenAddress: undefined })));
  testValidPacket(new packets.HelloPacket(removeUndefinedProps({ ...helloPacketBody, lndbtcPubKey: undefined })));
  testValidPacket(new packets.HelloPacket(removeUndefinedProps({ ...helloPacketBody, lndltcPubKey: undefined })));
  testInvalidPacket(new packets.HelloPacket(helloPacketBody, uuid()));
  testInvalidPacket(new packets.HelloPacket(removeUndefinedProps({ ...helloPacketBody, version: undefined })));
  testInvalidPacket(new packets.HelloPacket(removeUndefinedProps({ ...helloPacketBody, nodePubKey: undefined })));
  testInvalidPacket(new packets.HelloPacket({ ...helloPacketBody, addresses: [{} as Address] }));

  const disconnectingPacketBody = {
    reason: DisconnectionReason.IncompatibleProtocolVersion,
    payload: uuid(),
  };
  testValidPacket(new packets.DisconnectingPacket(disconnectingPacketBody));
  testValidPacket(new packets.DisconnectingPacket(removeUndefinedProps({ ...disconnectingPacketBody, payload: undefined })));
  testInvalidPacket(new packets.DisconnectingPacket(disconnectingPacketBody, uuid()));
  testInvalidPacket(new packets.DisconnectingPacket(removeUndefinedProps({ ...disconnectingPacketBody, reason: undefined })));

  testValidPacket(new packets.GetNodesPacket());
  testInvalidPacket(new packets.GetNodesPacket(undefined, uuid()));

  const node = {
    nodePubKey: uuid(),
    addresses: [{ host: '1.1.1.1', port: 8885 }, { host: '2.2.2.2', port: 8885 }],
  };
  testValidPacket(new packets.NodesPacket([node], uuid()));
  testInvalidPacket(new packets.NodesPacket([node]));
  testInvalidPacket(new packets.NodesPacket([removeUndefinedProps({ ...node, nodePubKey: undefined })], uuid()));
  testInvalidPacket(new packets.NodesPacket([{ ...node, addresses: [] }], uuid()));

  const orderPacketBody = {
    id: uuid(),
    pairId: uuid(),
    price: 10,
    quantity: 10,
    isBuy: false,
  };
  testValidPacket(new packets.OrderPacket(orderPacketBody));
  testValidPacket(new packets.OrderPacket(removeUndefinedProps({ ...orderPacketBody, isBuy: true })));
  testInvalidPacket(new packets.OrderPacket(orderPacketBody, uuid()));
  testInvalidPacket(new packets.OrderPacket(removeUndefinedProps({ ...orderPacketBody, id: undefined })));
  testInvalidPacket(new packets.OrderPacket(removeUndefinedProps({ ...orderPacketBody, pairId: undefined })));
  testInvalidPacket(new packets.OrderPacket(removeUndefinedProps({ ...orderPacketBody, price: undefined })));
  testInvalidPacket(new packets.OrderPacket(removeUndefinedProps({ ...orderPacketBody, price: 0 })));
  testInvalidPacket(new packets.OrderPacket(removeUndefinedProps({ ...orderPacketBody, quantity: undefined })));
  testInvalidPacket(new packets.OrderPacket(removeUndefinedProps({ ...orderPacketBody, quantity: 0 })));

  const orderInvalidationPacketBody = {
    id: uuid(),
    pairId: uuid(),
    quantity: 10,
  };
  testValidPacket(new packets.OrderInvalidationPacket(orderInvalidationPacketBody));
  testInvalidPacket(new packets.OrderInvalidationPacket(orderInvalidationPacketBody, uuid()));
  testInvalidPacket(new packets.OrderInvalidationPacket(removeUndefinedProps({ ...orderPacketBody, id: undefined })));
  testInvalidPacket(new packets.OrderInvalidationPacket(removeUndefinedProps({ ...orderPacketBody, pairId: undefined })));
  testInvalidPacket(new packets.OrderInvalidationPacket(removeUndefinedProps({ ...orderPacketBody, quantity: undefined })));
  testInvalidPacket(new packets.OrderInvalidationPacket(removeUndefinedProps({ ...orderPacketBody, quantity: 0 })));

  const getOrdersPacketBody = {
    pairIds: [uuid()],
  };
  testValidPacket(new packets.GetOrdersPacket(getOrdersPacketBody));
  testInvalidPacket(new packets.GetOrdersPacket(getOrdersPacketBody, uuid()));
  testInvalidPacket(new packets.OrderInvalidationPacket(removeUndefinedProps({ ...getOrdersPacketBody, pairIds: undefined })));
  testInvalidPacket(new packets.OrderInvalidationPacket(removeUndefinedProps({ ...getOrdersPacketBody, pairIds: [] })));

  const ordersPacketBody = [
    orderPacketBody,
  ];
  testValidPacket(new packets.OrdersPacket(ordersPacketBody, uuid()));
  testValidPacket(new packets.OrdersPacket([], uuid()));
  testInvalidPacket(new packets.OrdersPacket(ordersPacketBody));

  const swapRequestPacketBody = {
    proposedQuantity: 10,
    pairId: uuid(),
    orderId: uuid(),
    rHash: uuid(),
    takerCltvDelta: 10,
  };
  testValidPacket(new packets.SwapRequestPacket(swapRequestPacketBody));
  testInvalidPacket(new packets.SwapRequestPacket(swapRequestPacketBody, uuid()));
  testInvalidPacket(new packets.SwapRequestPacket(removeUndefinedProps({ ...swapRequestPacketBody, proposedQuantity: undefined })));
  testInvalidPacket(new packets.SwapRequestPacket(removeUndefinedProps({ ...swapRequestPacketBody, proposedQuantity: 0 })));
  testInvalidPacket(new packets.SwapRequestPacket(removeUndefinedProps({ ...swapRequestPacketBody, orderId: undefined })));
  testInvalidPacket(new packets.SwapRequestPacket(removeUndefinedProps({ ...swapRequestPacketBody, rHash: undefined })));
  testInvalidPacket(new packets.SwapRequestPacket(removeUndefinedProps({ ...swapRequestPacketBody, takerCltvDelta: undefined })));
  testInvalidPacket(new packets.SwapRequestPacket(removeUndefinedProps({ ...swapRequestPacketBody, takerCltvDelta: 0 })));

  const swapAcceptedPacketBody = {
    rHash: uuid(),
    quantity: 10,
    makerCltvDelta: 10,
  };
  testValidPacket(new packets.SwapAcceptedPacket(swapAcceptedPacketBody, uuid()));
  testInvalidPacket(new packets.SwapAcceptedPacket(swapAcceptedPacketBody));
  testInvalidPacket(new packets.SwapAcceptedPacket(removeUndefinedProps({ ...swapAcceptedPacketBody, rHash: undefined })));
  testInvalidPacket(new packets.SwapAcceptedPacket(removeUndefinedProps({ ...swapAcceptedPacketBody, quantity: undefined })));
  testInvalidPacket(new packets.SwapAcceptedPacket(removeUndefinedProps({ ...swapAcceptedPacketBody, quantity: 0 })));
  testInvalidPacket(new packets.SwapAcceptedPacket(removeUndefinedProps({ ...swapAcceptedPacketBody, makerCltvDelta: undefined })));
  testInvalidPacket(new packets.SwapAcceptedPacket(removeUndefinedProps({ ...swapAcceptedPacketBody, makerCltvDelta: 0 })));

  const swapCompletePacketBody = {
    rHash: uuid(),
  };
  testValidPacket(new packets.SwapCompletePacket(swapCompletePacketBody));
  testInvalidPacket(new packets.SwapCompletePacket(swapCompletePacketBody, uuid()));
  testInvalidPacket(new packets.SwapCompletePacket(removeUndefinedProps({ ...swapCompletePacketBody, rHash: undefined })));

  const swapFailedPacketBody = {
    rHash: uuid(),
    errorMessage: uuid(),
  };
  testValidPacket(new packets.SwapFailedPacket(swapFailedPacketBody));
  testValidPacket(new packets.SwapFailedPacket(swapFailedPacketBody, uuid()));
  testValidPacket(new packets.SwapCompletePacket(removeUndefinedProps({ ...swapCompletePacketBody, errorMessage: undefined })));
  testInvalidPacket(new packets.SwapCompletePacket(removeUndefinedProps({ ...swapCompletePacketBody, rHash: undefined })));

  // testSplitPacket(pingPacket);
 // testSplitPacket(helloPacket);
 // testConcatenatedPackets([pingPacket, helloPacket, pingPacket]);
 // testConcatenatedAndSplitOnTheDelimiter([pingPacket, helloPacket, pingPacket]);

  /*
  it(`should not try to parse an empty string`, () => {
    expect(wait()).to.be.rejected;

    parser.feed('');
  });

  it(`should try parse a standalone delimiter and fail`, () => {
    expect(wait()).to.be.rejected; // UNPARSEABLE_MESSAGE

    parser.feed(delimiter);
  });

  it(`should buffer a max buffer length`, () => {
    parser = new Parser(delimiter, 10);
    expect(wait()).to.be.rejected;

    parser.feed(Buffer.allocUnsafe(10).toString());
  });

  it(`should not buffer when max buffer size exceeds`, () => {
    parser = new Parser(delimiter, 10);
    expect(wait()).to.be.rejected; // MAX_BUFFER_SIZE_EXCEEDED

    parser.feed(Buffer.allocUnsafe(11).toString());
  });
  */
});
