export const http = {
  "Continue"                      : 100, // RFC 7231, 6.2.1
  "SwitchingProtocols"            : 101, // RFC 7231, 6.2.2
  "Processing"                    : 102, // RFC 2518, 10.1

  "OK"                            : 200, // RFC 7231, 6.3.1
  "Created"                       : 201, // RFC 7231, 6.3.2
  "Accepted"                      : 202, // RFC 7231, 6.3.3
  "NonAuthoritativeInfo"          : 203, // RFC 7231, 6.3.4
  "NoContent"                     : 204, // RFC 7231, 6.3.5
  "ResetContent"                  : 205, // RFC 7231, 6.3.6
  "PartialContent"                : 206, // RFC 7233, 4.1
  "Multi"                         : 207, // RFC 4918, 11.1
  "AlreadyReported"               : 208, // RFC 5842, 7.1
  "IMUsed"                        : 226, // RFC 3229, 10.4.1

  "MultipleChoices"               : 300, // RFC 7231, 6.4.1
  "MovedPermanently"              : 301, // RFC 7231, 6.4.2
  "Found"                         : 302, // RFC 7231, 6.4.3
  "SeeOther"                      : 303, // RFC 7231, 6.4.4
  "NotModified"                   : 304, // RFC 7232, 4.1
  "UseProxy"                      : 305, // RFC 7231, 6.4.5

  "TemporaryRedirect"             : 307, // RFC 7231, 6.4.7
  "PermanentRedirect"             : 308, // RFC 7538, 3

  "BadRequest"                    : 400, // RFC 7231, 6.5.1
  "Unauthorized"                  : 401, // RFC 7235, 3.1
  "PaymentRequired"               : 402, // RFC 7231, 6.5.2
  "Forbidden"                     : 403, // RFC 7231, 6.5.3
  "NotFound"                      : 404, // RFC 7231, 6.5.4
  "MethodNotAllowed"              : 405, // RFC 7231, 6.5.5
  "NotAcceptable"                 : 406, // RFC 7231, 6.5.6
  "ProxyAuthRequired"             : 407, // RFC 7235, 3.2
  "RequestTimeout"                : 408, // RFC 7231, 6.5.7
  "Conflict"                      : 409, // RFC 7231, 6.5.8
  "Gone"                          : 410, // RFC 7231, 6.5.9
  "LengthRequired"                : 411, // RFC 7231, 6.5.10
  "PreconditionFailed"            : 412, // RFC 7232, 4.2
  "RequestEntityTooLarge"         : 413, // RFC 7231, 6.5.11
  "RequestURITooLong"             : 414, // RFC 7231, 6.5.12
  "UnsupportedMediaType"          : 415, // RFC 7231, 6.5.13
  "RequestedRangeNotSatisfiable"  : 416, // RFC 7233, 4.4
  "ExpectationFailed"             : 417, // RFC 7231, 6.5.14
  "Teapot"                        : 418, // RFC 7168, 2.3.3
  "MisdirectedRequest"            : 421, // RFC 7540, 9.1.2
  "UnprocessableEntity"           : 422, // RFC 4918, 11.2
  "Locked"                        : 423, // RFC 4918, 11.3
  "FailedDependency"              : 424, // RFC 4918, 11.4
  "UpgradeRequired"               : 426, // RFC 7231, 6.5.15
  "PreconditionRequired"          : 428, // RFC 6585, 3
  "TooManyRequests"               : 429, // RFC 6585, 4
  "RequestHeaderFieldsTooLarge"   : 431, // RFC 6585, 5
  "UnavailableForLegalReasons"    : 451, // RFC 7725, 3

  "InternalServerError"           : 500, // RFC 7231, 6.6.1
  "NotImplemented"                : 501, // RFC 7231, 6.6.2
  "BadGateway"                    : 502, // RFC 7231, 6.6.3
  "ServiceUnavailable"            : 503, // RFC 7231, 6.6.4
  "GatewayTimeout"                : 504, // RFC 7231, 6.6.5
  "HTTPVersionNotSupported"       : 505, // RFC 7231, 6.6.6
  "VariantAlsoNegotiates"         : 506, // RFC 2295, 8.1
  "InsufficientStorage"           : 507, // RFC 4918, 11.5
  "LoopDetected"                  : 508, // RFC 5842, 7.2
  "NotExtended"                   : 510, // RFC 2774, 7
  "NetworkAuthenticationRequired" : 511 // RFC 6585, 6
}

export const grpc = {
  // Not an error, returned on success
  //
  // HTTP Mapping: 200 OK
  "OK": 0,

  // The operation was cancelled, typically by the caller.
  //
  // HTTP Mapping: 499 Client Closed Request
  "CANCELLED": 1,

  // Unknown error.  For example, this error may be returned when
  // a `Status` value received from another address space belongs to
  // an error space that is not known in this address space.  Also
  // errors raised by APIs that do not return enough error information
  // may be converted to this error.
  //
  // HTTP Mapping: 500 Internal Server Error
  "UNKNOWN": 2,

  // The client specified an invalid argument.  Note that this differs
  // from `FAILED_PRECONDITION`.  `INVALID_ARGUMENT` indicates arguments
  // that are problematic regardless of the state of the system
  // (e.g., a malformed file name).
  //
  // HTTP Mapping: 400 Bad Request
  "INVALID_ARGUMENT": 3,

  // The deadline expired before the operation could complete. For operations
  // that change the state of the system, this error may be returned
  // even if the operation has completed successfully.  For example, a
  // successful response from a server could have been delayed long
  // enough for the deadline to expire.
  //
  // HTTP Mapping: 504 Gateway Timeout
  "DEADLINE_EXCEEDED": 4,

  // Some requested entity (e.g., file or directory) was not found.
  //
  // Note to server developers: if a request is denied for an entire class
  // of users, such as gradual feature rollout or undocumented whitelist,
  // `NOT_FOUND` may be used. If a request is denied for some users within
  // a class of users, such as user-based access control, `PERMISSION_DENIED`
  // must be used.
  //
  // HTTP Mapping: 404 Not Found
  "NOT_FOUND": 5,

  // The entity that a client attempted to create (e.g., file or directory)
  // already exists.
  //
  // HTTP Mapping: 409 Conflict
  "ALREADY_EXISTS": 6,

  // The caller does not have permission to execute the specified
  // operation. `PERMISSION_DENIED` must not be used for rejections
  // caused by exhausting some resource (use `RESOURCE_EXHAUSTED`
  // instead for those errors). `PERMISSION_DENIED` must not be
  // used if the caller can not be identified (use `UNAUTHENTICATED`
  // instead for those errors). This error code does not imply the
  // request is valid or the requested entity exists or satisfies
  // other pre-conditions.
  //
  // HTTP Mapping: 403 Forbidden
  "PERMISSION_DENIED": 7,

  // The request does not have valid authentication credentials for the
  // operation.
  //
  // HTTP Mapping: 401 Unauthorized
  "UNAUTHENTICATED": 16,

  // Some resource has been exhausted, perhaps a per-user quota, or
  // perhaps the entire file system is out of space.
  //
  // HTTP Mapping: 429 Too Many Requests
  "RESOURCE_EXHAUSTED": 8,

  // The operation was rejected because the system is not in a state
  // required for the operation's execution.  For example, the directory
  // to be deleted is non-empty, an rmdir operation is applied to
  // a non-directory, etc.
  //
  // Service implementors can use the following guidelines to decide
  // between `FAILED_PRECONDITION`, `ABORTED`, and `UNAVAILABLE`:
  //  (a) Use `UNAVAILABLE` if the client can retry just the failing call.
  //  (b) Use `ABORTED` if the client should retry at a higher level
  //      (e.g., when a client-specified test-and-set fails, indicating the
  //      client should restart a read-modify-write sequence).
  //  (c) Use `FAILED_PRECONDITION` if the client should not retry until
  //      the system state has been explicitly fixed.  E.g., if an "rmdir"
  //      fails because the directory is non-empty, `FAILED_PRECONDITION`
  //      should be returned since the client should not retry unless
  //      the files are deleted from the directory.
  //
  // HTTP Mapping: 400 Bad Request
  "FAILED_PRECONDITION": 9,

  // The operation was aborted, typically due to a concurrency issue such as
  // a sequencer check failure or transaction abort.
  //
  // See the guidelines above for deciding between `FAILED_PRECONDITION`,
  // `ABORTED`, and `UNAVAILABLE`.
  //
  // HTTP Mapping: 409 Conflict
  "ABORTED": 10,

  // The operation was attempted past the valid range.  E.g., seeking or
  // reading past end-of-file.
  //
  // Unlike `INVALID_ARGUMENT`, this error indicates a problem that may
  // be fixed if the system state changes. For example, a 32-bit file
  // system will generate `INVALID_ARGUMENT` if asked to read at an
  // offset that is not in the range [0,2^32-1], but it will generate
  // `OUT_OF_RANGE` if asked to read from an offset past the current
  // file size.
  //
  // There is a fair bit of overlap between `FAILED_PRECONDITION` and
  // `OUT_OF_RANGE`.  We recommend using `OUT_OF_RANGE` (the more specific
  // error) when it applies so that callers who are iterating through
  // a space can easily look for an `OUT_OF_RANGE` error to detect when
  // they are done.
  //
  // HTTP Mapping: 400 Bad Request
  "OUT_OF_RANGE": 11,

  // The operation is not implemented or is not supported/enabled in this
  // service.
  //
  // HTTP Mapping: 501 Not Implemented
  "UNIMPLEMENTED": 12,

  // Internal errors.  This means that some invariants expected by the
  // underlying system have been broken.  This error code is reserved
  // for serious errors.
  //
  // HTTP Mapping: 500 Internal Server Error
  "INTERNAL": 13,

  // The service is currently unavailable.  This is most likely a
  // transient condition, which can be corrected by retrying with
  // a backoff.
  //
  // See the guidelines above for deciding between `FAILED_PRECONDITION`,
  // `ABORTED`, and `UNAVAILABLE`.
  //
  // HTTP Mapping: 503 Service Unavailable
  "UNAVAILABLE": 14,

  // Unrecoverable data loss or corruption.
  //
  // HTTP Mapping: 500 Internal Server Error
  "DATA_LOSS": 15
}

export function grpcToHttp(code: number): number {
	switch (code) {
  	case grpc.OK:
  		return http.OK;
  	case grpc.CANCELLED:
  		return http.RequestTimeout;
  	case grpc.UNKNOWN:
  		return http.InternalServerError;
  	case grpc.INVALID_ARGUMENT:
  		return http.BadRequest;
  	case grpc.DEADLINE_EXCEEDED:
  		return http.GatewayTimeout;
  	case grpc.NOT_FOUND:
  		return http.NotFound;
  	case grpc.ALREADY_EXISTS:
  		return http.Conflict;
  	case grpc.PERMISSION_DENIED:
  		return http.Forbidden;
  	case grpc.UNAUTHENTICATED:
  		return http.Unauthorized;
  	case grpc.RESOURCE_EXHAUSTED:
  		return http.TooManyRequests;
  	case grpc.FAILED_PRECONDITION:
  		return http.PreconditionFailed;
  	case grpc.ABORTED:
  		return http.Conflict;
  	case grpc.OUT_OF_RANGE:
  		return http.BadRequest;
  	case grpc.UNIMPLEMENTED:
  		return http.NotImplemented;
  	case grpc.INTERNAL:
  		return http.InternalServerError;
  	case grpc.UNAVAILABLE:
  		return http.ServiceUnavailable;
  	case grpc.DATA_LOSS:
  		return http.InternalServerError;
	}

	return http.InternalServerError;
}
