import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Parser from '../../lib/p2p/Parser';
import { PingPacket, HelloPacket } from '../../lib/p2p/packets/types';
import { Packet } from '../../lib/p2p/packets';

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

  function testPacket(packet: Packet) {
    it(`should parse ${packet.type}`, (done) => {
      verify([packet])
        .then(done)
        .catch(done);

      const packetStr = packet.toRaw();
      parser.feed(packetStr + delimiter);
    });
  }

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

  const pingPacket = new PingPacket();
  const helloPacket = new HelloPacket({
    version: '1.0.0',
    nodePubKey: '0479BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F8179',
    addresses: [{ host: '1.1.1.1', port: 8885 }],
    pairs: ['LTC/BTC'],
    raidenAddress: '8483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8',
  });

  testPacket(pingPacket);
  testPacket(helloPacket);
  testSplitPacket(pingPacket);
  testSplitPacket(helloPacket);
  testConcatenatedPackets([pingPacket, helloPacket, pingPacket]);
  testConcatenatedAndSplitOnTheDelimiter([pingPacket, helloPacket, pingPacket]);

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
});
