import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Parser, { ParserErrorType } from '../../lib/p2p/Parser';
import { Packet, PacketType } from '../../lib/p2p/packets';
import * as packets from '../../lib/p2p/packets/types';
import { removeUndefinedProps } from '../../lib/utils/utils';
import { DisconnectionReason, SwapFailureReason } from '../../lib/types/enums';
import uuid = require('uuid');
import {Address, NodeState, NodeStateUpdate} from '../../lib/types/p2p';
import {HelloRequestPacketBody} from "../../lib/p2p/packets/types/HelloRequestPacket";

chai.use(chaiAsPromised);

describe('Parser', () => {
  const timeoutError = 'timeout';
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
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
          for (let i = 0; i < packets.length; i += 1) {
            expect(packets[i]).to.deep.equal(parsedPackets[i]);
            expect(packets[i].type).to.equal(parsedPackets[i].type);
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

  function testSplitPacket(packet: Packet) {
    it(`should parse ${PacketType[packet.type]} packet split`, (done) => {
      verify([packet])
        .then(done)
        .catch(done);

      const buffer = packet.toRaw();
      const middleIndex = buffer.length >> 1;
      parser.feed(buffer.slice(0, middleIndex));
      parser.feed(buffer.slice(middleIndex));
    });
  }

  function testConcatenatedPackets(packets: Packet[]) {
    it(`should parse ${packets.map(packet => PacketType[packet.type]).join(' ')} concatenated`, (done) => {
      verify(packets)
        .then(done)
        .catch(done);

      parser.feed(Buffer.concat(packets.map(packet => packet.toRaw())));
    });
  }

  function testConcatenatedAndSplit(packets: Packet[], splitByte: number) {
    const packetsStr = packets.map(packet => PacketType[packet.type]).join(' ');
    it(`should parse ${packetsStr} concatenated and split on byte ${splitByte} from each packet beginning`, (done) => {
      verify(packets)
        .then(done)
        .catch(done);

      let remaining = Buffer.alloc(0);
      packets.forEach((packet) => {
        const buffer = Buffer.concat([remaining, packet.toRaw()]);
        const chunk = buffer.slice(0, splitByte); // split on a specific byte
        remaining = buffer.slice(splitByte); // keep the remaining for the next chunk
        parser.feed(chunk);
      });
      parser.feed(remaining);
    });
  }

  const nodeState: NodeState = {
    version: '1.0.0',
    nodePubKey: uuid(),
    addresses: [{ host: '1.1.1.1', port: 8885 }, { host: '2.2.2.2', port: 8885 }],
    pairs: [uuid()],
    raidenAddress: uuid(),
    lndbtcPubKey: uuid(),
    lndltcPubKey: uuid(),
  };


  const helloRequestPacketBody: HelloRequestPacketBody = {
    sign: uuid(),
    peerPubKey: uuid(),
    ephemeralPubKey: uuid(),
    nodeState: nodeState,
  }

  describe('test packets validation', () => {
    testValidPacket(new packets.PingPacket());
    testInvalidPacket(new packets.PingPacket(undefined, uuid()));

    testValidPacket(new packets.PongPacket(undefined, uuid()));
    testInvalidPacket(new packets.PongPacket(undefined));

    testValidPacket(new packets.HelloRequestPacket(helloRequestPacketBody));
    testValidPacket(new packets.HelloRequestPacket({...helloRequestPacketBody, nodeState: {...nodeState, pairs: [] }}));
    testValidPacket(new packets.HelloRequestPacket({...helloRequestPacketBody, nodeState: {...nodeState, addresses: [] }}));
    testValidPacket(new packets.HelloRequestPacket({...helloRequestPacketBody, nodeState: removeUndefinedProps({ ...nodeState, raidenAddress: undefined })}));
    testValidPacket(new packets.HelloRequestPacket({...helloRequestPacketBody, nodeState: removeUndefinedProps({ ...nodeState, lndbtcPubKey: undefined })}));
    testValidPacket(new packets.HelloRequestPacket({...helloRequestPacketBody, nodeState: removeUndefinedProps({ ...nodeState, lndltcPubKey: undefined })}));
    testInvalidPacket(new packets.HelloRequestPacket(helloRequestPacketBody, uuid()));
    testInvalidPacket(new packets.HelloRequestPacket(removeUndefinedProps({ ...helloRequestPacketBody, sign: undefined })));
    testInvalidPacket(new packets.HelloRequestPacket(removeUndefinedProps({ ...helloRequestPacketBody, ephemeralPubKey: undefined })));
    testInvalidPacket(new packets.HelloRequestPacket(removeUndefinedProps({ ...helloRequestPacketBody, peerPubKey: undefined })));
    testInvalidPacket(new packets.HelloRequestPacket({...helloRequestPacketBody, nodeState: removeUndefinedProps({ ...nodeState, nodePubKey: undefined })}));
    testInvalidPacket(new packets.HelloRequestPacket({...helloRequestPacketBody, nodeState: removeUndefinedProps({ ...nodeState, version: undefined })}));
    testInvalidPacket(new packets.HelloRequestPacket({...helloRequestPacketBody, nodeState: { ...nodeState, addresses: [{} as Address] }}));

    const { ephemeralPubKey, ...helloResponsePacketBody} = helloRequestPacketBody;
    testValidPacket(new packets.HelloResponsePacket(helloResponsePacketBody));
    testValidPacket(new packets.HelloResponsePacket({...helloResponsePacketBody, nodeState: {...nodeState, pairs: [] }}));
    testValidPacket(new packets.HelloResponsePacket({...helloResponsePacketBody, nodeState: {...nodeState, addresses: [] }}));
    testValidPacket(new packets.HelloResponsePacket({...helloResponsePacketBody, nodeState: removeUndefinedProps({ ...nodeState, raidenAddress: undefined })}));
    testValidPacket(new packets.HelloResponsePacket({...helloResponsePacketBody, nodeState: removeUndefinedProps({ ...nodeState, lndbtcPubKey: undefined })}));
    testValidPacket(new packets.HelloResponsePacket({...helloResponsePacketBody, nodeState: removeUndefinedProps({ ...nodeState, lndltcPubKey: undefined })}));
    testInvalidPacket(new packets.HelloResponsePacket(helloRequestPacketBody, uuid()));
    testInvalidPacket(new packets.HelloResponsePacket(removeUndefinedProps({ ...helloResponsePacketBody, sign: undefined })));
    testInvalidPacket(new packets.HelloResponsePacket(removeUndefinedProps({ ...helloResponsePacketBody, peerPubKey: undefined })));
    testInvalidPacket(new packets.HelloResponsePacket({...helloResponsePacketBody, nodeState: removeUndefinedProps({ ...nodeState, nodePubKey: undefined })}));
    testInvalidPacket(new packets.HelloResponsePacket({...helloResponsePacketBody, nodeState: removeUndefinedProps({ ...nodeState, version: undefined })}));
    testInvalidPacket(new packets.HelloResponsePacket({...helloResponsePacketBody, nodeState: { ...nodeState, addresses: [{} as Address] }}));

    const { version, nodePubKey, ...nodeStateUpdate} = nodeState;
    testValidPacket(new packets.NodeStateUpdatePacket(nodeStateUpdate));
    testValidPacket(new packets.NodeStateUpdatePacket({...nodeStateUpdate, pairs: [] }));
    testValidPacket(new packets.NodeStateUpdatePacket({...nodeStateUpdate, addresses: [] }));
    testValidPacket(new packets.NodeStateUpdatePacket(removeUndefinedProps({ ...nodeStateUpdate, raidenAddress: undefined })));
    testValidPacket(new packets.NodeStateUpdatePacket(removeUndefinedProps({ ...nodeStateUpdate, lndbtcPubKey: undefined })));
    testValidPacket(new packets.NodeStateUpdatePacket(removeUndefinedProps({ ...nodeStateUpdate, lndltcPubKey: undefined })))
    testInvalidPacket(new packets.NodeStateUpdatePacket(nodeStateUpdate, uuid()));
    testInvalidPacket(new packets.NodeStateUpdatePacket({ ...nodeStateUpdate, addresses: [{} as Address] }));

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
      errorMessage: 'this is a test',
      failureReason: SwapFailureReason.SendPaymentFailure,
    };
    testValidPacket(new packets.SwapFailedPacket(swapFailedPacketBody));
    testValidPacket(new packets.SwapFailedPacket(swapFailedPacketBody, uuid()));
    testValidPacket(new packets.SwapFailedPacket(removeUndefinedProps({ ...swapFailedPacketBody, errorMessage: undefined })));
    testInvalidPacket(new packets.SwapFailedPacket(removeUndefinedProps({ ...swapFailedPacketBody, rHash: undefined })));
    testInvalidPacket(new packets.SwapFailedPacket(removeUndefinedProps({ ...swapFailedPacketBody, failureReason: undefined })));

  });
  describe('test TCP segmentation/concatenation support', () => {
    const pingPacket = new packets.PingPacket();
    const helloRequestPacket = new packets.HelloRequestPacket(helloRequestPacketBody);

    testSplitPacket(pingPacket);
    testSplitPacket(helloRequestPacket);
    testConcatenatedPackets([pingPacket, helloRequestPacket, pingPacket]);
    testConcatenatedAndSplit([pingPacket, helloRequestPacket, pingPacket], Parser.PACKET_METADATA_SIZE - 1);
    testConcatenatedAndSplit([pingPacket, helloRequestPacket, pingPacket], Parser.PACKET_METADATA_SIZE);
    testConcatenatedAndSplit([pingPacket, helloRequestPacket, pingPacket], Parser.PACKET_METADATA_SIZE + 1);
  });

  describe('test more edge-cases', () => {
    it(`should not try to parse an empty buffer`, async () => {
      await expect(wait()).to.be.rejectedWith(timeoutError);
      parser.feed(Buffer.alloc(0));
    });

    it(`should not try parse just the metadata as a packet`, (done) => {
      wait()
        .then(() => done('err: packet should not be parsed'))
        .catch((err) => {
          if (err && err.type === ParserErrorType.InvalidPacket) {
            done();
          } else {
            done(err);
          }
        });

      parser.feed(Buffer.alloc(Parser.PACKET_METADATA_SIZE));
    });

    it(`should buffer a max buffer length`, async () => {
      parser = new Parser(Parser.PACKET_METADATA_SIZE, 10);

      await expect(wait()).to.be.rejectedWith(timeoutError);
      parser.feed(Buffer.allocUnsafe(10));
    });

    it(`should not buffer when max buffer size exceeds`,  (done) => {
      parser = new Parser(Parser.PACKET_METADATA_SIZE, 10);

      wait()
        .then(() => done('err: packet should not be parsed'))
        .catch((err) => {
          if (err && err.type === ParserErrorType.MaxBufferSizeExceeded) {
            done();
          } else {
            done(err);
          }
        });

      parser.feed(Buffer.allocUnsafe(11));
    });

  });
});
