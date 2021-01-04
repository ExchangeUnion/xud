import { ServiceError } from '@grpc/grpc-js';
import http from 'http';
import { defer, from, Observable, of, throwError } from 'rxjs';
import { catchError, concat, concatAll, delay, mergeMap, retryWhen, share, take, mapTo } from 'rxjs/operators';
import { loadXudClient } from '../cli/command';
import { XudClient } from '../proto/xudrpc_grpc_pb';
import { GetBalanceRequest, GetBalanceResponse, GetInfoRequest, GetInfoResponse } from '../proto/xudrpc_pb';

type Balances = {
  channelBalance: number;
  walletBalance: number;
};

type ChannelsConfig = {
  channels: ChannelConfig[];
  retryInterval: number;
};

type ChannelConfig = {
  currency: string;
  channelAmount: number;
  minChannelAmount: number;
};

const processResponse = (resolve: Function, reject: Function) => {
  return (error: ServiceError | null, response: any) => {
    if (error) {
      reject(error);
    } else {
      resolve(response);
    }
  };
};

const getBalance = async (client: XudClient, currency?: string): Promise<GetBalanceResponse> => {
  const request = new GetBalanceRequest();
  if (currency) {
    request.setCurrency(currency.toUpperCase());
  }
  const balances = await new Promise((resolve, reject) => {
    client.getBalance(request, processResponse(resolve, reject));
  });
  return balances as GetBalanceResponse;
};

const checkBalanceObservable = (
  client: XudClient,
  currency: string,
  minimumBalance: number,
  getBalance$: Observable<GetBalanceResponse>,
): Observable<Balances> => {
  return getBalance$.pipe(
    mergeMap((balanceResponse: GetBalanceResponse) => {
      const balancesMap = balanceResponse.getBalancesMap();
      const currencyBalance = balancesMap.get(currency);
      const balances = {
        walletBalance: currencyBalance.getWalletBalance(),
        channelBalance: currencyBalance.getChannelBalance(),
      };
      if (balances.channelBalance < minimumBalance) {
        // the balance is under our specified threshold
        // we'll hit the faucet with our connext address
        // and then recheck the balance
        return getConnextAddressObservable(client).pipe(
          mergeMap((connextAddress) => {
            return from(faucetRequest(connextAddress)).pipe(
              // we wait 31 seconds (~2 blocks) before checking the balance again
              delay(31000),
              mergeMap(() => checkBalanceObservable(client, currency, minimumBalance, getBalance$)),
            );
          }),
        );
      } else {
        return of(balances);
      }
    }),
  );
};

const getInfo = async (client: XudClient): Promise<GetInfoResponse> => {
  const request = new GetInfoRequest();
  const info = await new Promise((resolve, reject) => {
    client.getInfo(request, processResponse(resolve, reject));
  });
  return info as GetInfoResponse;
};

const getConnextAddressObservable = (client: XudClient): Observable<string> => {
  return from(getInfo(client)).pipe(
    mergeMap((info: GetInfoResponse) => {
      const connext = info.getConnext();
      if (connext && connext.getAddress()) {
        return of(connext.getAddress());
      }
      return throwError('connext address not found');
    }),
    catchError((_error, caught) => {
      return caught.pipe(
        delay(5000), // we wait 5 seconds before trying getinfo again
      );
    }),
  );
};

const faucetRequest = (connextAddress: string) => {
  return new Promise((resolve, reject) => {
    const options: http.RequestOptions = {
      method: 'POST',
      hostname: 'xud1.simnet.exchangeunion.com',
      port: 9000,
      path: '/faucet',
    };

    const payload = { address: connextAddress };

    const payloadStr = JSON.stringify(payload);
    options.headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payloadStr),
    };

    const req = http.request(options, (res) => {
      switch (res.statusCode) {
        case 200:
          resolve(res);
          break;
        default:
          reject('faucet request failed');
          break;
      }
    });

    req.on('error', reject);

    if (payloadStr) {
      req.write(payloadStr);
    }
    req.end();
  });
};

const createSimnetChannel = ({
  client,
  currency,
  channelAmount,
  retryInterval,
  getBalance$,
}: {
  client: XudClient;
  currency: string;
  minChannelAmount: number;
  channelAmount: number;
  retryInterval: number;
  getBalance$: Observable<GetBalanceResponse>;
}) => {
  const balances$ = checkBalanceObservable(client, currency, channelAmount, getBalance$);
  const simnetChannel$ = balances$.pipe(
    // when error happens
    retryWhen((errors) =>
      errors.pipe(
        // we wait for retryInterval and attempt again
        delay(retryInterval),
        // for a maximum of 10 times
        take(10),
        // until we give up completely
        concat(throwError('unrecoverable error happened - giving up')),
      ),
    ),
    mapTo(currency),
    // complete the observable when the flow is successful
    take(1),
  );
  return simnetChannel$;
};

const createSimnetChannels = (config: ChannelsConfig): Observable<any> => {
  const client$ = defer(() => from(loadXudClient({}))).pipe(share());
  return client$.pipe(
    mergeMap((client) => {
      const getBalance$ = defer(() => from(getBalance(client))).pipe(share());
      return from(
        // we map our channels config into observables
        config.channels.map((channelConfig) =>
          createSimnetChannel({
            ...channelConfig,
            client,
            getBalance$,
            retryInterval: config.retryInterval,
          }),
        ),
      ).pipe(
        // execute them in order
        concatAll(),
      );
    }),
  );
};

export { createSimnetChannels };
