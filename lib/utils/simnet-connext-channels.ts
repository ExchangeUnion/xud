import { from, of, empty, Observable, combineLatest, throwError } from 'rxjs';
import { mergeMap, concat, map, catchError, delay, repeat, retryWhen, take } from 'rxjs/operators';
import { XudClient } from '../proto/xudrpc_grpc_pb';
import grpc from 'grpc';
import http from 'http';
import { loadXudClient } from '../cli/command';
import {
  GetBalanceRequest,
  GetBalanceResponse,
  GetInfoRequest,
  GetInfoResponse,
  OpenChannelRequest,
  OpenChannelResponse,
 } from '../proto/xudrpc_pb';

type Balances = {
  channelBalance: number;
  walletBalance: number;
};

const processResponse = (resolve: Function, reject: Function) => {
  return (error: grpc.ServiceError | null, response: any) => {
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

const openConnextChannel = async (client: XudClient, currency: string, amount: number): Promise<OpenChannelResponse> => {
  const request = new OpenChannelRequest();
  request.setCurrency(currency.toUpperCase());
  request.setAmount(amount);
  const openChannelResponse = await new Promise((resolve, reject) => {
    client.openChannel(request, processResponse(resolve, reject));
  });
  return openChannelResponse as OpenChannelResponse;
};

const checkBalanceObservable = (client: XudClient, currency: string, minimumWalletBalance: number): Observable<Balances> => {
  return from(
    getBalance(client, currency),
  ).pipe(
    map((balanceResponse: GetBalanceResponse) => {
      const balancesMap = balanceResponse.getBalancesMap();
      const balances = balancesMap.get(currency);
      return {
        walletBalance: balances.getWalletBalance(),
        channelBalance: balances.getChannelBalance(),
      };
    }),
    mergeMap((balances) => {
      if (balances.walletBalance < minimumWalletBalance) {
        // the balance is under our specified threshold
        // we'll hit the faucet with our connext address
        // and then recheck the balance
        return getConnextAddressObservable(client).pipe(
          mergeMap((connextAddress) => {
            return from(faucetRequest(connextAddress)).pipe(
              delay(3000), // we wait 3 seconds before checking the balance again
              mergeMap(() => checkBalanceObservable(client, currency, minimumWalletBalance)),
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
      hostname: '35.193.71.174',
      port: 9000,
      path: '/faucet',
    };

    const payload = {
      address: connextAddress,
    };

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

const createSimnetChannel = (
  { currency, minChannelAmount, channelAmount, minWalletAmount, retryInterval }:
  { currency: string, minChannelAmount: number, channelAmount: number, minWalletAmount: number, retryInterval: number },
) => {
  const client$ = from(loadXudClient({}));
  const balances$ = client$.pipe(
    // once we have the client we'll attempt to check the balances
    mergeMap(client => checkBalanceObservable(client, currency, minWalletAmount)),
  );
  const simnetChannels$ = combineLatest(balances$, client$)
    .pipe(
      mergeMap(([balances, client]) => {
        if (balances.channelBalance >= minChannelAmount) {
          // in case we already have enough channelBalance we won't attempt
          // to open a channel
          return empty();
        } else {
          return from(openConnextChannel(client, currency, channelAmount));
        }
      }),
      // when the flow is completed we wait until the retryInterval
      delay(retryInterval),
      // and repeat the flow
      repeat(),
      // when error happens
      retryWhen(errors =>
        errors.pipe(
          // we wait for retryInterval and attempt again
          delay(retryInterval),
          // for a maximum of 10 times
          take(10),
          // until we give up completely
          concat(throwError('unrecoverable error happened - giving up')),
        ),
      ),
    );
  return simnetChannels$;
};

export { createSimnetChannel };
