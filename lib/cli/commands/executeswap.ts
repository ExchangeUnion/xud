import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ExecuteSwapRequest, SwapPayload } from '../../proto/xudrpc_pb';

export const command = 'executeSwap <identifier> <role> <sending_amount> <sending_token> <receiving_amount> <receiving_token>';

export const describe = 'execute an atomic swap';

export const builder = {
  sending_amount: {
    type: 'number',
  },
  receiving_amount: {
    type: 'number',
  },
};

/*function callHandler(xuClient: XUClient, argv: Arguments) {
  const payload = {
    role: argv.role,
    sending_amount: argv.sending_amount,
    sending_token: argv.sending_token,
    receiving_amount: argv.receiving_amount,
    receiving_token: argv.receiving_token,
  };
  return xuClient.tokenSwap(argv.target_address, payload, argv.identifier);
}*/

export const handler = (argv: Arguments) => {
  const request = new ExecuteSwapRequest();
  request.setTargetAddress = argv.target_address;
  request.setIdentifier = argv.identifier;

  const payload = new SwapPayload();
  payload.setSendingAmount(argv.sending_amount);
  payload.setSendingToken(argv.sending_token);
  payload.setReceivingAmount(argv.receiving_amount);
  payload.setReceivingToken(argv.receiving_token);
  request.setPayload(payload);

  loadXudClient(argv).executeSwap(request, callback);
};
