import { expect } from 'chai';
import { callback } from '../../lib/cli/command';

describe('Command.callback', () => {
  it('shows raw and table output', () => {
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
    const defaultArgv = {
      _: [],
      $0: '',
      json: false,
    };
    // tslint:disable-next-line
    callback(defaultArgv, displayTable)(null, mockGrpcResponse);
    expect(called).to.equal(true);
    called = false;
    const withJsonArgv = {
      _: [],
      $0: '',
      json: true,
    };
    // tslint:disable-next-line
    callback(withJsonArgv, displayTable)(null, mockGrpcResponse);
    expect(called).to.equal(false);
  });

});
