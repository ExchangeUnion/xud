class GRPCError {
  constructor(public message: string) {}
}

export default {
  COULDNOT_BIND: (port: string) => new GRPCError(`gRPC couldn't bind on port: ${port}`),
};
