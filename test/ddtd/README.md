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

    node node_modules/.bin/mocha -r ts-node/register test/ddtd/GetInfo/webproxy.spec.ts

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
node node_modules/.bin/mocha -r ts-node/register test/ddtd/GetNodeInfo/webproxy.spec.ts


  http://localhost:8080/api/v1/nodeinfo
    1) GET  responds with http status 400
    2) GET ?foo=bar responds with http status 400
    3) GET 律絕諸篇俱宇宙古今مليارات في мале,тъйжалнопе responds with http status 400
    4) GET foo responds with http status 404
    5) GET bar responds with http status 404
    6) GET foobar responds with http status 404


  0 passing (175ms)
  6 failing

  1) http://localhost:8080/api/v1/nodeinfo
       GET  responds with http status 400:

      AssertionError: expected 500 to equal 400
      + expected - actual

      -500
      +400

      at chai_1.default.request.get.then (test/ddtd/GetNodeInfo/webproxy.spec.ts:19:33)
      at <anonymous>
      at process._tickCallback (internal/process/next_tick.js:182:7)

  2) http://localhost:8080/api/v1/nodeinfo
       GET ?foo=bar responds with http status 400:

      AssertionError: expected 500 to equal 400
      + expected - actual

      -500
      +400

      at chai_1.default.request.get.then (test/ddtd/GetNodeInfo/webproxy.spec.ts:19:33)
      at <anonymous>
      at process._tickCallback (internal/process/next_tick.js:182:7)

  3) http://localhost:8080/api/v1/nodeinfo
       GET 律絕諸篇俱宇宙古今مليارات في мале,тъйжалнопе responds with http status 400:

      AssertionError: expected 404 to equal 400
      + expected - actual

      -404
      +400

      at chai_1.default.request.get.then (test/ddtd/GetNodeInfo/webproxy.spec.ts:19:33)
      at <anonymous>
      at process._tickCallback (internal/process/next_tick.js:182:7)

  4) http://localhost:8080/api/v1/nodeinfo
       GET foo responds with http status 404:

      AssertionError: expected 404 to equal 400
      + expected - actual

      -404
      +400

      at chai_1.default.request.get.then (test/ddtd/GetNodeInfo/webproxy.spec.ts:34:33)
      at <anonymous>
      at process._tickCallback (internal/process/next_tick.js:182:7)

  5) http://localhost:8080/api/v1/nodeinfo
       GET bar responds with http status 404:

      AssertionError: expected 404 to equal 400
      + expected - actual

      -404
      +400

      at chai_1.default.request.get.then (test/ddtd/GetNodeInfo/webproxy.spec.ts:34:33)
      at <anonymous>
      at process._tickCallback (internal/process/next_tick.js:182:7)

  6) http://localhost:8080/api/v1/nodeinfo
       GET foobar responds with http status 404:

      AssertionError: expected 404 to equal 400
      + expected - actual

      -404
      +400

      at chai_1.default.request.get.then (test/ddtd/GetNodeInfo/webproxy.spec.ts:34:33)
      at <anonymous>
      at process._tickCallback (internal/process/next_tick.js:182:7)

```
