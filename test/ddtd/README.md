# Data-Driven Test Development (DDTD)

A DDTD methodology consists in using a classical TDD cycle:

- Add a test
- Write something in the test
- Let it fail at the beginning
- Refactor the code of your class/library
- Make the test pass

And so on, iterating through this process until the functionality being implemented is okay. We're using sample data stored in JSON files.

## Run the tests

Start the webproxy:

    ./xud --webproxy.disable false --lnd.disable true --raiden.disable true

Run all tests:

    npm run test:ddtd

Run one test in particular:

    node node_modules/.bin/mocha -r ts-node/register test/ddtd/getInfo/webproxy.spec.ts

Shutdown:

    ./xucli shutdown

## Conventions

The folders in `test/ddtd` represent the gRPC methods available:

- `AddCurrency`
- `AddPair`
- `...`
- `GetInfo`
- `GetNodeInfo`
- `...`

Each gRPC method folder contains two files:

- `webproxy.spec.ts`
- `xudrpc.spec.ts`

If a gRPC method takes parameters, its corresponding testing folder contains a `data` folder with sample data:

```
test
  ddtd
    GetNodeInfo
      data
        03_INVALID_ARGUMENT.json
        05_NOT_FOUND.json
      webproxy.spec.ts
      xudrpc.spec.ts
```

As you can see, the sample data is exactly the same for both the webproxy and the Xud client.

As an example, here is the output obtained when running a test:

```
node node_modules/.bin/mocha -r ts-node/register test/ddtd/getNodeInfo/xudrpc.spec.ts


  getNodeInfo
    1) ?foo=bar responds with grp status 3
    2) 律絕諸篇俱宇宙古今مليارات في мале,тъйжалнопе responds with grp status 3
    3)  responds with grp status 5
    4) foo responds with grp status 5
    5) bar responds with grp status 5
    6) foobar responds with grp status 5


  0 passing (355ms)
  6 failing

  1) getNodeInfo
       ?foo=bar responds with grp status 3:
     Error: 14 UNAVAILABLE: Trying to connect an http1.x server
      at Object.exports.createStatusError (node_modules/grpc/src/common.js:87:15)
      at Object.onReceiveStatus (node_modules/grpc/src/client_interceptors.js:1188:28)
      at InterceptingListener._callNext (node_modules/grpc/src/client_interceptors.js:564:42)
      at InterceptingListener.onReceiveStatus (node_modules/grpc/src/client_interceptors.js:614:8)
      at callback (node_modules/grpc/src/client_interceptors.js:841:24)

  2) getNodeInfo
       律絕諸篇俱宇宙古今مليارات في мале,тъйжалнопе responds with grp status 3:
     Error: 14 UNAVAILABLE: Trying to connect an http1.x server
      at Object.exports.createStatusError (node_modules/grpc/src/common.js:87:15)
      at Object.onReceiveStatus (node_modules/grpc/src/client_interceptors.js:1188:28)
      at InterceptingListener._callNext (node_modules/grpc/src/client_interceptors.js:564:42)
      at InterceptingListener.onReceiveStatus (node_modules/grpc/src/client_interceptors.js:614:8)
      at callback (node_modules/grpc/src/client_interceptors.js:841:24)

  3) getNodeInfo
        responds with grp status 5:
     Error: 14 UNAVAILABLE: Trying to connect an http1.x server
      at Object.exports.createStatusError (node_modules/grpc/src/common.js:87:15)
      at Object.onReceiveStatus (node_modules/grpc/src/client_interceptors.js:1188:28)
      at InterceptingListener._callNext (node_modules/grpc/src/client_interceptors.js:564:42)
      at InterceptingListener.onReceiveStatus (node_modules/grpc/src/client_interceptors.js:614:8)
      at callback (node_modules/grpc/src/client_interceptors.js:841:24)

  4) getNodeInfo
       foo responds with grp status 5:
     Error: 14 UNAVAILABLE: Trying to connect an http1.x server
      at Object.exports.createStatusError (node_modules/grpc/src/common.js:87:15)
      at Object.onReceiveStatus (node_modules/grpc/src/client_interceptors.js:1188:28)
      at InterceptingListener._callNext (node_modules/grpc/src/client_interceptors.js:564:42)
      at InterceptingListener.onReceiveStatus (node_modules/grpc/src/client_interceptors.js:614:8)
      at callback (node_modules/grpc/src/client_interceptors.js:841:24)

  5) getNodeInfo
       bar responds with grp status 5:
     Error: 14 UNAVAILABLE: Trying to connect an http1.x server
      at Object.exports.createStatusError (node_modules/grpc/src/common.js:87:15)
      at Object.onReceiveStatus (node_modules/grpc/src/client_interceptors.js:1188:28)
      at InterceptingListener._callNext (node_modules/grpc/src/client_interceptors.js:564:42)
      at InterceptingListener.onReceiveStatus (node_modules/grpc/src/client_interceptors.js:614:8)
      at callback (node_modules/grpc/src/client_interceptors.js:841:24)

  6) getNodeInfo
       foobar responds with grp status 5:
     Error: 14 UNAVAILABLE: Trying to connect an http1.x server
      at Object.exports.createStatusError (node_modules/grpc/src/common.js:87:15)
      at Object.onReceiveStatus (node_modules/grpc/src/client_interceptors.js:1188:28)
      at InterceptingListener._callNext (node_modules/grpc/src/client_interceptors.js:564:42)
      at InterceptingListener.onReceiveStatus (node_modules/grpc/src/client_interceptors.js:614:8)
      at callback (node_modules/grpc/src/client_interceptors.js:841:24)
```
