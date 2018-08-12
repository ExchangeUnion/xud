# Data-Driven Test Development (DDTD) Approach

The DDTD methodology being implemented here consists in using a classical TDD cycle:

- Add a test
- Write something in the test
- Let it fail at the beginning
- Refactor the code of your class/library
- Make the test pass

And so on, iterating through this process until you're happy with the functionality being implemented.

We're using sample data stored in JSON files, interacting with the API layer through a client — HTTP client and XudClient — in a manner that can be called functional, or integration if you like.

## Run the tests

    ./xud --webproxy.disable false --lnd.disable true --raiden.disable true

    npm run test:ddtd

    ./xucli shutdown

## Conventions

The following conventions are implemented in order to write the code of the tests systematically.

### `test/ddtd/http`

HTTP client.

The subfolders represent the endpoints available in the HTTP/JSON API:

- `info`
- `cancelorder`
- `placeorder`
- `...`

The tests are named like this:

- `HttpStatus200.spec.ts`
- `HttpStatus400.spec.ts`
- `...`

### `test/ddtd/grpc`

gRPC client.

The subfolders represent the methods available in the gRPC client:

- `getInfo`
- `cancelOrder`
- `placeOrder`
- `...`

The tests are named like this:

- `GrpcStatus0.spec.ts`
- `GrpcStatus1.spec.ts`
- `...`

## Conclusion

We are defining at development time how the API responds by using sample data through clients, hence the name data-driven test development (DDTD).
