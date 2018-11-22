# Data-Driven Test Development (DDTD)

A DDTD methodology consists in using a classical TDD cycle:

- Add a test
- Write something in the test
- Let it fail at the beginning
- Refactor the code of your class/library
- Make the test pass

And so on, iterating through this process until the functionality being implemented is okay.

We're using sample data stored in JSON files.

## Run the tests

    npm run test:ddtd

## Conventions

The subfolders in `test/ddtd` represent the endpoints available:

- `addcurrency`
- `info`
- `removeorder`
- `...`

The files are named according to status code expected:

- `HttpStatus200.spec.ts`
- `HttpStatus400.spec.ts`
- `...`
- `GrpcStatus0.spec.ts`
- `GrpcStatus1.spec.ts`

Here is the output obtained when running the tests:

```
api/v1/info
  ✓ GET responds with http status 200 (95ms)
  ...
```


## Conclusion

The API is defined at development time by using sample data, hence the name data-driven test development (DDTD).
