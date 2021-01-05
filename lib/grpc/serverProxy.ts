/* eslint-disable */
// MIT License
//
// Copyright (c) 2019 Echo
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// code taken from https://github.com/echo-health/node-grpc-interceptors with some adjustments

import { status, Server } from '@grpc/grpc-js';

const getType = (method: any) => {
  if (method.requestStream === false && method.responseStream === false) {
    return 'unary';
  }
  return 'unknown';
};

const toLowerCamelCase = (str: any) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

const lookupServiceMetadata = (service: any, implementation: any) => {
  const serviceKeys = Object.keys(service);
  const implementationKeys = Object.keys(implementation);
  const intersectingMethods = serviceKeys
    .filter((k) => {
      return implementationKeys.map((k) => toLowerCamelCase(k)).indexOf(k) !== -1;
    })
    .reduce((acc: any, k) => {
      const method = service[k];
      if (!method) {
        throw new Error(`cannot find method ${k} on service`);
      }
      const components = method.path.split('/');
      acc[k] = {
        name: components[1],
        method: components[2],
        type: getType(method),
        path: method.path,
        responseType: method.responseType,
        requestType: method.requestType,
      };
      return acc;
    }, {});

  return (key: any) => {
    return Object.keys(intersectingMethods)
      .filter((k) => toLowerCamelCase(key) === k)
      .map((k) => intersectingMethods[k])
      .pop();
  };
};

const handler = {
  get(target: any, propKey: any) {
    if (propKey !== 'addService') {
      return target[propKey];
    }
    return (service: any, implementation: any) => {
      const newImplementation: any = {};
      const lookup = lookupServiceMetadata(service, implementation);
      for (const k in implementation) {
        const name = k;
        const fn = implementation[k];
        newImplementation[name] = (call: any, callback: any): any => {
          const ctx: any = {
            call,
            service: lookup(name),
          };
          const newCallback = (callback: any) => {
            return (...args: any) => {
              ctx.status = { code: status.OK };
              const err = args[0];
              if (err) {
                ctx.status = {
                  code: status.UNKNOWN,
                  details: err,
                };
              }
              callback(...args);
            };
          };

          const interceptors = target.intercept();
          const first = interceptors.next();
          if (!first.value) {
            // if we don't have any interceptors
            return new Promise((resolve) => {
              return resolve(fn(call, newCallback(callback)));
            });
          }
          first.value(ctx, function next() {
            return new Promise((resolve) => {
              const i = interceptors.next();
              if (i.done) {
                return resolve(fn(call, newCallback(callback)));
              }
              return resolve(i.value(ctx, next));
            });
          });
        };
      }
      return target.addService(service, newImplementation);
    };
  },
};

export function serverProxy(server: Server): ServerProxy {
  const serverProxy = server as ServerProxy;
  serverProxy.interceptors = [];
  serverProxy.use = (fn: any) => {
    serverProxy.interceptors.push(fn);
  };
  serverProxy.intercept = function* intercept() {
    let i = 0;
    while (i < serverProxy.interceptors.length) {
      yield serverProxy.interceptors[i];
      i += 1;
    }
  };
  const x = new Proxy(serverProxy, handler);
  return x;
}

export type ServerProxy = Server & {
  use: Function;
  intercept: Function;
  interceptors: Function[];
};
