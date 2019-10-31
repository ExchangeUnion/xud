import { toEip55Address } from '../../lib/utils/utils';

describe('toEip55Address', () => {
  test('converts to EIP55 address', () => {
    // example taken from spec at https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
    const orig = '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359';
    const eip55 = '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359';
    expect(toEip55Address(orig)).toEqual(eip55);
  });
});
