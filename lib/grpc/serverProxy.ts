// code taken from https://github.com/echo-health/node-grpc-interceptors with some adjustments

import grpc from 'grpc';

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
      return implementationKeys.map(k => toLowerCamelCase(k)).indexOf(k) !== -1;
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
      .filter(k => toLowerCamelCase(key) === k)
      .map(k => intersectingMethods[k]).pop();
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
              ctx.status = {
                code: grpc.status.OK,
              };
              const err = args[0];
              if (err) {
                ctx.status = {
                  code: grpc.status.UNKNOWN,
                  details: err,
                };
              }
              callback(...args);
            };
          };

          const interceptors = target.intercept();
          const first = interceptors.next();
          if (!first.value) { // if we don't have any interceptors
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

export default (server: any) => {
  server.interceptors = [];
  server.use = (fn: any) => {
    server.interceptors.push(fn);
  };
  server.intercept = function* intercept() {
    let i = 0;
    while (i < server.interceptors.length) {
      yield server.interceptors[i];
      i = i + 1;
    }
  };
  return new Proxy(server, handler);
};
