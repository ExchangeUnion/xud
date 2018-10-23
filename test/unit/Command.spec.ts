import { expect } from 'chai';
import { callback } from '../../lib/cli/command';

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
