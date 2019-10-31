import sys
from ethereum import utils

if len(sys.argv) > 1:
    address = sys.argv[1]
else:
    raise Exception("Expecting address as input.")

def checksum_encode(addr): # Takes a 20-byte binary address as input
    o = ''
    v = utils.big_endian_to_int(utils.sha3(addr.hex()))
    for i, c in enumerate(addr.hex()):
        if c in '0123456789':
            o += c
        else:
            o += c.upper() if (v & (2**(255 - 4*i))) else c.lower()
    return '0x'+o

print(checksum_encode(bytes.fromhex(address[2:])))
