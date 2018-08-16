import { expect } from 'chai';
import Peer from '../../lib/p2p/Peer';
import Parser from '../../lib/p2p/Parser';
import { PingPacket, HelloPacket } from '../../lib/p2p/packets/types';
import { Packet } from '../../lib/p2p/packets';

describe('Parser', () => {
  const delimiter = Packet.PROTOCOL_DELIMITER;
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser(delimiter);
  });

  function waitOne(): Promise<Packet> {
    return new Promise((resolve, reject) => {
      parser.once('packet', resolve);
      parser.once('error', reject);
    });
  }

  function waitMany(num: number): Promise<Packet[]> {
    return new Promise((resolve, reject) => {
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

  function verifyParsingOne(packet: Packet): Promise<Packet[]> {
    return new Promise((resolve, reject) => {
      waitOne()
        .then((parsedPacket) => {
          expect(packet).to.deep.equal(parsedPacket);
          resolve();
        })
        .catch(err => reject(err));
    });
  }

  function verifyParsingMany(packets: Packet[]): Promise<Packet[]> {
    return new Promise((resolve, reject) => {
      waitMany(packets.length)
        .then((parsedPackets) => {
          for (let i = 0; i <= packets.length; i += 1) {
            expect(packets[i]).to.deep.equal(parsedPackets[i]);
          }
          resolve();
        })
        .catch(err => reject(err));
    });
  }

  function testPacket(packet: Packet) {
    it(`should parse ${packet.type}`, (done) => {

      verifyParsingOne(packet)
        .then(done)
        .catch(done);

      const packetStr = packet.toRaw();
      parser.feed(packetStr + delimiter);
    });
  }

  function testSplitPacket(packet: Packet) {
    it(`should parse ${packet.type} split`, (done) => {

      verifyParsingOne(packet)
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

      verifyParsingMany(packets)
        .then(done)
        .catch(done);

      parser.feed(packets.map(packet => packet.toRaw() + delimiter).join(''));
    });
  }

  function testConcatenatedAndSplitOnTheDelimiter(packets: Packet[]) {
    it(`should parse ${packets.map(packet => packet.type).join(' ')} concatenated and split on the delimiter`, (done) => {

      verifyParsingMany(packets)
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

  const pingPacket = new PingPacket();
  const helloPacket = new HelloPacket({
    version: '1.0.0',
    nodePubKey: '0479BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F8179',
    listenPort: 4001,
    pairs: ['BTC/LTC'],
    raidenAddress: '8483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8',
  });

  testPacket(pingPacket);
  testPacket(helloPacket);

  testSplitPacket(pingPacket);
  testSplitPacket(helloPacket);

  testConcatenatedPackets([pingPacket, helloPacket, pingPacket]);

  testConcatenatedAndSplitOnTheDelimiter([pingPacket, helloPacket, pingPacket]);

});
