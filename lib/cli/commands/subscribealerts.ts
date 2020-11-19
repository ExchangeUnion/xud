import { Arguments, Argv } from 'yargs';
import { XudClient } from '../../proto/xudrpc_grpc_pb';
import * as xudrpc from '../../proto/xudrpc_pb';
import { loadXudClient } from '../command';
import { AlertType } from '../../constants/enums';
import { onStreamError, waitForClient } from '../utils';

export const command = 'subscribealerts';

export const describe = 'subscribe alerts such as low balance';

export const builder = (argv: Argv) => argv
    .option('pretty', {
      type: 'boolean',
    })
    .example('$0 subscribealerts -j', 'prints alert payload in a JSON structure')
    .example('$0 subscribealerts', 'prints alert message only');

export const handler = async (argv: Arguments) => {
  await ensureConnection(argv, true);
};

let client: XudClient;

const ensureConnection = async (argv: Arguments, printError?: boolean) => {
  if (!client) {
    client = await loadXudClient(argv);
  }

  waitForClient(client, argv, ensureConnection, subscribeAlerts, printError);
};

const subscribeAlerts = (argv: Arguments<any>) => {
  const request = new xudrpc.SubscribeAlertsRequest();
  const alertsSubscription = client.subscribeAlerts(request);

  alertsSubscription.on('data', (alert: xudrpc.Alert) => {
    if (argv.json) {
      console.log(JSON.stringify(alert, undefined, 2));
    } else {
      console.log(`${AlertType[alert.getType()]}: ${alert.getMessage()}`);
    }
  });
  alertsSubscription.on('end', reconnect.bind(undefined, argv));
  alertsSubscription.on('error', onStreamError.bind(undefined, ensureConnection.bind(undefined, argv)));
};

const reconnect = async (argv: Arguments) => {
  console.log('Stream has closed, trying to reconnect');
  await ensureConnection(argv, false);
};
