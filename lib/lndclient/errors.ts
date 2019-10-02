import errorCodesPrefix from '../constants/errorCodesPrefix';
import { ClientStatus } from '../swaps/SwapClient';

const codesPrefix = errorCodesPrefix.LND;
const errorCodes = {
  DISABLED: codesPrefix.concat('.1'),
  UNAVAILABLE: codesPrefix.concat('.2'),
  NO_ACTIVE_CHANNELS: codesPrefix.concat('.3'),
};

const errors = {
  DISABLED: (currency: string) => ({
    message: `lnd-${currency} is disabled`,
    code: errorCodes.DISABLED,
  }),
  UNAVAILABLE: (currency: string, status: ClientStatus) => ({
    message: `lnd-${currency} is ${ClientStatus[status]}`,
    code: errorCodes.UNAVAILABLE,
  }),
  NO_ACTIVE_CHANNELS: (currency: string) => ({
    message: `lnd-${currency} has no active channels`,
    code: errorCodes.NO_ACTIVE_CHANNELS,
  }),
};

export { errorCodes };
export default errors;
