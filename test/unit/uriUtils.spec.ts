import { expect } from 'chai';
import { parseUri } from '../../lib/utils/uriUtils';

describe('parseUri', () => {
  it('should parse a valid uri', async () => {
    const nodePubKey = '03029c6a4d80c91da9e40529ec41c93b17cc9d7956b59c7d8334b0318d4a86aef8';
    const host = '127.0.0.1';
    const port = 9885;
    const uriParts = parseUri(`${nodePubKey}@${host}:${port}`);
    expect(uriParts.nodePubKey).to.equal(nodePubKey);
    expect(uriParts.host).to.equal(host);
    expect(uriParts.port).to.equal(port);
  });

  it('should parse a valid uri without a port specified', async () => {
    const nodePubKey = '03029c6a4d80c91da9e40529ec41c93b17cc9d7956b59c7d8334b0318d4a86aef8';
    const host = 'localhost';
    const uriParts = parseUri(`${nodePubKey}@${host}`);
    expect(uriParts.nodePubKey).to.equal(nodePubKey);
    expect(uriParts.host).to.equal(host);
    expect(uriParts.port).to.equal(8885);
  });

  it('should error a uri without a host specified', async () => {
    const nodePubKey = '03029c6a4d80c91da9e40529ec41c93b17cc9d7956b59c7d8334b0318d4a86aef8';
    expect(() => parseUri(`${nodePubKey}`)).to.throw();
  });

  it('should error a uri without with extra parts', async () => {
    const nodePubKey = '03029c6a4d80c91da9e40529ec41c93b17cc9d7956b59c7d8334b0318d4a86aef8';
    const host = '127.0.0.1';
    const port = 9885;
    expect(() => parseUri(`${nodePubKey}@${host}:${port}:extra@part`)).to.throw();
  });

  it('should error a uri with a non-numeric port', async () => {
    const nodePubKey = '03029c6a4d80c91da9e40529ec41c93b17cc9d7956b59c7d8334b0318d4a86aef8';
    const host = '127.0.0.1';
    const port = 'notanumber';
    expect(() => parseUri(`${nodePubKey}@${host}:${port}`)).to.throw();
  });
});
