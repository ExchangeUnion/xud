import { Arguments, Argv } from 'yargs';
import { XudClient } from '../../proto/xudrpc_grpc_pb';
import * as xudrpc from '../../proto/xudrpc_pb';
import { loadXudClient } from '../command';
import { AlertType, ChannelSide } from '../../constants/enums';
import { onStreamError, waitForClient } from '../utils';
import moment from 'moment';

export const command = 'streamalerts';

export const describe = 'stream alert notifications from xud';

export const builder = (argv: Argv) => argv
    .option('pretty', {
      type: 'boolean',
    })
    .example('$0 streamalerts -j', 'prints alert payload in a JSON structure')
    .example('$0 streamalerts', 'prints alert message only');

export const handler = async (argv: Arguments) => {
  await ensureConnection(argv, true);
};

let client: XudClient;

const ensureConnection = async (argv: Arguments, printError?: boolean) => {
  if (!client) {
    client = await loadXudClient(argv);
  }

  waitForClient(client, argv, ensureConnection, streamalerts, printError);
};

const structAlertJson = (alertObject: xudrpc.Alert.AsObject) => {
  const result: {type: string, payload: {
    totalBalance?: number,
    side?: string,
    bound?: number,
    sideBalance?: number,
    channelPoint?: string,
    currency?: string,
  } | undefined } = {
    type: AlertType[alertObject.type],
    payload: undefined,
  };

  if (alertObject.type === xudrpc.Alert.AlertType.LOW_TRADING_BALANCE) {
    result.payload = {
      totalBalance: alertObject.balanceAlert?.totalBalance,
      side: ChannelSide[alertObject.balanceAlert?.side || 0],
      sideBalance: alertObject.balanceAlert?.sideBalance,
      bound: alertObject.balanceAlert?.bound,
      currency: alertObject.balanceAlert?.currency,
    };
  }

  return result;
};

const streamalerts = (argv: Arguments<any>) => {
  const request = new xudrpc.SubscribeAlertsRequest();
  const alertsSubscription = client.subscribeAlerts(request);

  alertsSubscription.on('data', (alert: xudrpc.Alert) => {
    if (argv.json) {
      console.log(JSON.stringify(structAlertJson(alert.toObject()), undefined, 2));
    } else {
      console.log(`(${moment()}) ${AlertType[alert.getType()]}: ${alert.getMessage()}`);
    }
  });
  alertsSubscription.on('end', reconnect.bind(undefined, argv));
  alertsSubscription.on('error', onStreamError.bind(undefined, ensureConnection.bind(undefined, argv)));
};

const reconnect = async (argv: Arguments) => {
  console.log('Stream has closed, trying to reconnect');
  await ensureConnection(argv, false);
};
