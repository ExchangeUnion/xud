// package: routerrpc
// file: lndrouter.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import {handleClientStreamingCall} from "@grpc/grpc-js/build/src/server-call";
import * as lndrouter_pb from "./lndrouter_pb";
import * as lndrpc_pb from "./lndrpc_pb";

interface IRouterService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    sendPaymentV2: IRouterService_ISendPaymentV2;
    trackPaymentV2: IRouterService_ITrackPaymentV2;
    estimateRouteFee: IRouterService_IEstimateRouteFee;
    sendToRoute: IRouterService_ISendToRoute;
    sendToRouteV2: IRouterService_ISendToRouteV2;
    resetMissionControl: IRouterService_IResetMissionControl;
    queryMissionControl: IRouterService_IQueryMissionControl;
    queryProbability: IRouterService_IQueryProbability;
    buildRoute: IRouterService_IBuildRoute;
    subscribeHtlcEvents: IRouterService_ISubscribeHtlcEvents;
    sendPayment: IRouterService_ISendPayment;
    trackPayment: IRouterService_ITrackPayment;
    htlcInterceptor: IRouterService_IHtlcInterceptor;
}

interface IRouterService_ISendPaymentV2 extends grpc.MethodDefinition<lndrouter_pb.SendPaymentRequest, lndrpc_pb.Payment> {
    path: "/routerrpc.Router/SendPaymentV2";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<lndrouter_pb.SendPaymentRequest>;
    requestDeserialize: grpc.deserialize<lndrouter_pb.SendPaymentRequest>;
    responseSerialize: grpc.serialize<lndrpc_pb.Payment>;
    responseDeserialize: grpc.deserialize<lndrpc_pb.Payment>;
}
interface IRouterService_ITrackPaymentV2 extends grpc.MethodDefinition<lndrouter_pb.TrackPaymentRequest, lndrpc_pb.Payment> {
    path: "/routerrpc.Router/TrackPaymentV2";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<lndrouter_pb.TrackPaymentRequest>;
    requestDeserialize: grpc.deserialize<lndrouter_pb.TrackPaymentRequest>;
    responseSerialize: grpc.serialize<lndrpc_pb.Payment>;
    responseDeserialize: grpc.deserialize<lndrpc_pb.Payment>;
}
interface IRouterService_IEstimateRouteFee extends grpc.MethodDefinition<lndrouter_pb.RouteFeeRequest, lndrouter_pb.RouteFeeResponse> {
    path: "/routerrpc.Router/EstimateRouteFee";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<lndrouter_pb.RouteFeeRequest>;
    requestDeserialize: grpc.deserialize<lndrouter_pb.RouteFeeRequest>;
    responseSerialize: grpc.serialize<lndrouter_pb.RouteFeeResponse>;
    responseDeserialize: grpc.deserialize<lndrouter_pb.RouteFeeResponse>;
}
interface IRouterService_ISendToRoute extends grpc.MethodDefinition<lndrouter_pb.SendToRouteRequest, lndrouter_pb.SendToRouteResponse> {
    path: "/routerrpc.Router/SendToRoute";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<lndrouter_pb.SendToRouteRequest>;
    requestDeserialize: grpc.deserialize<lndrouter_pb.SendToRouteRequest>;
    responseSerialize: grpc.serialize<lndrouter_pb.SendToRouteResponse>;
    responseDeserialize: grpc.deserialize<lndrouter_pb.SendToRouteResponse>;
}
interface IRouterService_ISendToRouteV2 extends grpc.MethodDefinition<lndrouter_pb.SendToRouteRequest, lndrpc_pb.HTLCAttempt> {
    path: "/routerrpc.Router/SendToRouteV2";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<lndrouter_pb.SendToRouteRequest>;
    requestDeserialize: grpc.deserialize<lndrouter_pb.SendToRouteRequest>;
    responseSerialize: grpc.serialize<lndrpc_pb.HTLCAttempt>;
    responseDeserialize: grpc.deserialize<lndrpc_pb.HTLCAttempt>;
}
interface IRouterService_IResetMissionControl extends grpc.MethodDefinition<lndrouter_pb.ResetMissionControlRequest, lndrouter_pb.ResetMissionControlResponse> {
    path: "/routerrpc.Router/ResetMissionControl";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<lndrouter_pb.ResetMissionControlRequest>;
    requestDeserialize: grpc.deserialize<lndrouter_pb.ResetMissionControlRequest>;
    responseSerialize: grpc.serialize<lndrouter_pb.ResetMissionControlResponse>;
    responseDeserialize: grpc.deserialize<lndrouter_pb.ResetMissionControlResponse>;
}
interface IRouterService_IQueryMissionControl extends grpc.MethodDefinition<lndrouter_pb.QueryMissionControlRequest, lndrouter_pb.QueryMissionControlResponse> {
    path: "/routerrpc.Router/QueryMissionControl";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<lndrouter_pb.QueryMissionControlRequest>;
    requestDeserialize: grpc.deserialize<lndrouter_pb.QueryMissionControlRequest>;
    responseSerialize: grpc.serialize<lndrouter_pb.QueryMissionControlResponse>;
    responseDeserialize: grpc.deserialize<lndrouter_pb.QueryMissionControlResponse>;
}
interface IRouterService_IQueryProbability extends grpc.MethodDefinition<lndrouter_pb.QueryProbabilityRequest, lndrouter_pb.QueryProbabilityResponse> {
    path: "/routerrpc.Router/QueryProbability";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<lndrouter_pb.QueryProbabilityRequest>;
    requestDeserialize: grpc.deserialize<lndrouter_pb.QueryProbabilityRequest>;
    responseSerialize: grpc.serialize<lndrouter_pb.QueryProbabilityResponse>;
    responseDeserialize: grpc.deserialize<lndrouter_pb.QueryProbabilityResponse>;
}
interface IRouterService_IBuildRoute extends grpc.MethodDefinition<lndrouter_pb.BuildRouteRequest, lndrouter_pb.BuildRouteResponse> {
    path: "/routerrpc.Router/BuildRoute";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<lndrouter_pb.BuildRouteRequest>;
    requestDeserialize: grpc.deserialize<lndrouter_pb.BuildRouteRequest>;
    responseSerialize: grpc.serialize<lndrouter_pb.BuildRouteResponse>;
    responseDeserialize: grpc.deserialize<lndrouter_pb.BuildRouteResponse>;
}
interface IRouterService_ISubscribeHtlcEvents extends grpc.MethodDefinition<lndrouter_pb.SubscribeHtlcEventsRequest, lndrouter_pb.HtlcEvent> {
    path: "/routerrpc.Router/SubscribeHtlcEvents";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<lndrouter_pb.SubscribeHtlcEventsRequest>;
    requestDeserialize: grpc.deserialize<lndrouter_pb.SubscribeHtlcEventsRequest>;
    responseSerialize: grpc.serialize<lndrouter_pb.HtlcEvent>;
    responseDeserialize: grpc.deserialize<lndrouter_pb.HtlcEvent>;
}
interface IRouterService_ISendPayment extends grpc.MethodDefinition<lndrouter_pb.SendPaymentRequest, lndrouter_pb.PaymentStatus> {
    path: "/routerrpc.Router/SendPayment";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<lndrouter_pb.SendPaymentRequest>;
    requestDeserialize: grpc.deserialize<lndrouter_pb.SendPaymentRequest>;
    responseSerialize: grpc.serialize<lndrouter_pb.PaymentStatus>;
    responseDeserialize: grpc.deserialize<lndrouter_pb.PaymentStatus>;
}
interface IRouterService_ITrackPayment extends grpc.MethodDefinition<lndrouter_pb.TrackPaymentRequest, lndrouter_pb.PaymentStatus> {
    path: "/routerrpc.Router/TrackPayment";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<lndrouter_pb.TrackPaymentRequest>;
    requestDeserialize: grpc.deserialize<lndrouter_pb.TrackPaymentRequest>;
    responseSerialize: grpc.serialize<lndrouter_pb.PaymentStatus>;
    responseDeserialize: grpc.deserialize<lndrouter_pb.PaymentStatus>;
}
interface IRouterService_IHtlcInterceptor extends grpc.MethodDefinition<lndrouter_pb.ForwardHtlcInterceptResponse, lndrouter_pb.ForwardHtlcInterceptRequest> {
    path: "/routerrpc.Router/HtlcInterceptor";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<lndrouter_pb.ForwardHtlcInterceptResponse>;
    requestDeserialize: grpc.deserialize<lndrouter_pb.ForwardHtlcInterceptResponse>;
    responseSerialize: grpc.serialize<lndrouter_pb.ForwardHtlcInterceptRequest>;
    responseDeserialize: grpc.deserialize<lndrouter_pb.ForwardHtlcInterceptRequest>;
}

export const RouterService: IRouterService;

export interface IRouterServer extends grpc.UntypedServiceImplementation {
    sendPaymentV2: grpc.handleServerStreamingCall<lndrouter_pb.SendPaymentRequest, lndrpc_pb.Payment>;
    trackPaymentV2: grpc.handleServerStreamingCall<lndrouter_pb.TrackPaymentRequest, lndrpc_pb.Payment>;
    estimateRouteFee: grpc.handleUnaryCall<lndrouter_pb.RouteFeeRequest, lndrouter_pb.RouteFeeResponse>;
    sendToRoute: grpc.handleUnaryCall<lndrouter_pb.SendToRouteRequest, lndrouter_pb.SendToRouteResponse>;
    sendToRouteV2: grpc.handleUnaryCall<lndrouter_pb.SendToRouteRequest, lndrpc_pb.HTLCAttempt>;
    resetMissionControl: grpc.handleUnaryCall<lndrouter_pb.ResetMissionControlRequest, lndrouter_pb.ResetMissionControlResponse>;
    queryMissionControl: grpc.handleUnaryCall<lndrouter_pb.QueryMissionControlRequest, lndrouter_pb.QueryMissionControlResponse>;
    queryProbability: grpc.handleUnaryCall<lndrouter_pb.QueryProbabilityRequest, lndrouter_pb.QueryProbabilityResponse>;
    buildRoute: grpc.handleUnaryCall<lndrouter_pb.BuildRouteRequest, lndrouter_pb.BuildRouteResponse>;
    subscribeHtlcEvents: grpc.handleServerStreamingCall<lndrouter_pb.SubscribeHtlcEventsRequest, lndrouter_pb.HtlcEvent>;
    sendPayment: grpc.handleServerStreamingCall<lndrouter_pb.SendPaymentRequest, lndrouter_pb.PaymentStatus>;
    trackPayment: grpc.handleServerStreamingCall<lndrouter_pb.TrackPaymentRequest, lndrouter_pb.PaymentStatus>;
    htlcInterceptor: grpc.handleBidiStreamingCall<lndrouter_pb.ForwardHtlcInterceptResponse, lndrouter_pb.ForwardHtlcInterceptRequest>;
}

export interface IRouterClient {
    sendPaymentV2(request: lndrouter_pb.SendPaymentRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrpc_pb.Payment>;
    sendPaymentV2(request: lndrouter_pb.SendPaymentRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrpc_pb.Payment>;
    trackPaymentV2(request: lndrouter_pb.TrackPaymentRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrpc_pb.Payment>;
    trackPaymentV2(request: lndrouter_pb.TrackPaymentRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrpc_pb.Payment>;
    estimateRouteFee(request: lndrouter_pb.RouteFeeRequest, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.RouteFeeResponse) => void): grpc.ClientUnaryCall;
    estimateRouteFee(request: lndrouter_pb.RouteFeeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.RouteFeeResponse) => void): grpc.ClientUnaryCall;
    estimateRouteFee(request: lndrouter_pb.RouteFeeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.RouteFeeResponse) => void): grpc.ClientUnaryCall;
    sendToRoute(request: lndrouter_pb.SendToRouteRequest, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.SendToRouteResponse) => void): grpc.ClientUnaryCall;
    sendToRoute(request: lndrouter_pb.SendToRouteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.SendToRouteResponse) => void): grpc.ClientUnaryCall;
    sendToRoute(request: lndrouter_pb.SendToRouteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.SendToRouteResponse) => void): grpc.ClientUnaryCall;
    sendToRouteV2(request: lndrouter_pb.SendToRouteRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.HTLCAttempt) => void): grpc.ClientUnaryCall;
    sendToRouteV2(request: lndrouter_pb.SendToRouteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.HTLCAttempt) => void): grpc.ClientUnaryCall;
    sendToRouteV2(request: lndrouter_pb.SendToRouteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.HTLCAttempt) => void): grpc.ClientUnaryCall;
    resetMissionControl(request: lndrouter_pb.ResetMissionControlRequest, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.ResetMissionControlResponse) => void): grpc.ClientUnaryCall;
    resetMissionControl(request: lndrouter_pb.ResetMissionControlRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.ResetMissionControlResponse) => void): grpc.ClientUnaryCall;
    resetMissionControl(request: lndrouter_pb.ResetMissionControlRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.ResetMissionControlResponse) => void): grpc.ClientUnaryCall;
    queryMissionControl(request: lndrouter_pb.QueryMissionControlRequest, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.QueryMissionControlResponse) => void): grpc.ClientUnaryCall;
    queryMissionControl(request: lndrouter_pb.QueryMissionControlRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.QueryMissionControlResponse) => void): grpc.ClientUnaryCall;
    queryMissionControl(request: lndrouter_pb.QueryMissionControlRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.QueryMissionControlResponse) => void): grpc.ClientUnaryCall;
    queryProbability(request: lndrouter_pb.QueryProbabilityRequest, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.QueryProbabilityResponse) => void): grpc.ClientUnaryCall;
    queryProbability(request: lndrouter_pb.QueryProbabilityRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.QueryProbabilityResponse) => void): grpc.ClientUnaryCall;
    queryProbability(request: lndrouter_pb.QueryProbabilityRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.QueryProbabilityResponse) => void): grpc.ClientUnaryCall;
    buildRoute(request: lndrouter_pb.BuildRouteRequest, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.BuildRouteResponse) => void): grpc.ClientUnaryCall;
    buildRoute(request: lndrouter_pb.BuildRouteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.BuildRouteResponse) => void): grpc.ClientUnaryCall;
    buildRoute(request: lndrouter_pb.BuildRouteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.BuildRouteResponse) => void): grpc.ClientUnaryCall;
    subscribeHtlcEvents(request: lndrouter_pb.SubscribeHtlcEventsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrouter_pb.HtlcEvent>;
    subscribeHtlcEvents(request: lndrouter_pb.SubscribeHtlcEventsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrouter_pb.HtlcEvent>;
    sendPayment(request: lndrouter_pb.SendPaymentRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrouter_pb.PaymentStatus>;
    sendPayment(request: lndrouter_pb.SendPaymentRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrouter_pb.PaymentStatus>;
    trackPayment(request: lndrouter_pb.TrackPaymentRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrouter_pb.PaymentStatus>;
    trackPayment(request: lndrouter_pb.TrackPaymentRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrouter_pb.PaymentStatus>;
    htlcInterceptor(): grpc.ClientDuplexStream<lndrouter_pb.ForwardHtlcInterceptResponse, lndrouter_pb.ForwardHtlcInterceptRequest>;
    htlcInterceptor(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<lndrouter_pb.ForwardHtlcInterceptResponse, lndrouter_pb.ForwardHtlcInterceptRequest>;
    htlcInterceptor(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<lndrouter_pb.ForwardHtlcInterceptResponse, lndrouter_pb.ForwardHtlcInterceptRequest>;
}

export class RouterClient extends grpc.Client implements IRouterClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public sendPaymentV2(request: lndrouter_pb.SendPaymentRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrpc_pb.Payment>;
    public sendPaymentV2(request: lndrouter_pb.SendPaymentRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrpc_pb.Payment>;
    public trackPaymentV2(request: lndrouter_pb.TrackPaymentRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrpc_pb.Payment>;
    public trackPaymentV2(request: lndrouter_pb.TrackPaymentRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrpc_pb.Payment>;
    public estimateRouteFee(request: lndrouter_pb.RouteFeeRequest, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.RouteFeeResponse) => void): grpc.ClientUnaryCall;
    public estimateRouteFee(request: lndrouter_pb.RouteFeeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.RouteFeeResponse) => void): grpc.ClientUnaryCall;
    public estimateRouteFee(request: lndrouter_pb.RouteFeeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.RouteFeeResponse) => void): grpc.ClientUnaryCall;
    public sendToRoute(request: lndrouter_pb.SendToRouteRequest, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.SendToRouteResponse) => void): grpc.ClientUnaryCall;
    public sendToRoute(request: lndrouter_pb.SendToRouteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.SendToRouteResponse) => void): grpc.ClientUnaryCall;
    public sendToRoute(request: lndrouter_pb.SendToRouteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.SendToRouteResponse) => void): grpc.ClientUnaryCall;
    public sendToRouteV2(request: lndrouter_pb.SendToRouteRequest, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.HTLCAttempt) => void): grpc.ClientUnaryCall;
    public sendToRouteV2(request: lndrouter_pb.SendToRouteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.HTLCAttempt) => void): grpc.ClientUnaryCall;
    public sendToRouteV2(request: lndrouter_pb.SendToRouteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrpc_pb.HTLCAttempt) => void): grpc.ClientUnaryCall;
    public resetMissionControl(request: lndrouter_pb.ResetMissionControlRequest, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.ResetMissionControlResponse) => void): grpc.ClientUnaryCall;
    public resetMissionControl(request: lndrouter_pb.ResetMissionControlRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.ResetMissionControlResponse) => void): grpc.ClientUnaryCall;
    public resetMissionControl(request: lndrouter_pb.ResetMissionControlRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.ResetMissionControlResponse) => void): grpc.ClientUnaryCall;
    public queryMissionControl(request: lndrouter_pb.QueryMissionControlRequest, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.QueryMissionControlResponse) => void): grpc.ClientUnaryCall;
    public queryMissionControl(request: lndrouter_pb.QueryMissionControlRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.QueryMissionControlResponse) => void): grpc.ClientUnaryCall;
    public queryMissionControl(request: lndrouter_pb.QueryMissionControlRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.QueryMissionControlResponse) => void): grpc.ClientUnaryCall;
    public queryProbability(request: lndrouter_pb.QueryProbabilityRequest, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.QueryProbabilityResponse) => void): grpc.ClientUnaryCall;
    public queryProbability(request: lndrouter_pb.QueryProbabilityRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.QueryProbabilityResponse) => void): grpc.ClientUnaryCall;
    public queryProbability(request: lndrouter_pb.QueryProbabilityRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.QueryProbabilityResponse) => void): grpc.ClientUnaryCall;
    public buildRoute(request: lndrouter_pb.BuildRouteRequest, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.BuildRouteResponse) => void): grpc.ClientUnaryCall;
    public buildRoute(request: lndrouter_pb.BuildRouteRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.BuildRouteResponse) => void): grpc.ClientUnaryCall;
    public buildRoute(request: lndrouter_pb.BuildRouteRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: lndrouter_pb.BuildRouteResponse) => void): grpc.ClientUnaryCall;
    public subscribeHtlcEvents(request: lndrouter_pb.SubscribeHtlcEventsRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrouter_pb.HtlcEvent>;
    public subscribeHtlcEvents(request: lndrouter_pb.SubscribeHtlcEventsRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrouter_pb.HtlcEvent>;
    public sendPayment(request: lndrouter_pb.SendPaymentRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrouter_pb.PaymentStatus>;
    public sendPayment(request: lndrouter_pb.SendPaymentRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrouter_pb.PaymentStatus>;
    public trackPayment(request: lndrouter_pb.TrackPaymentRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrouter_pb.PaymentStatus>;
    public trackPayment(request: lndrouter_pb.TrackPaymentRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<lndrouter_pb.PaymentStatus>;
    public htlcInterceptor(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<lndrouter_pb.ForwardHtlcInterceptResponse, lndrouter_pb.ForwardHtlcInterceptRequest>;
    public htlcInterceptor(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<lndrouter_pb.ForwardHtlcInterceptResponse, lndrouter_pb.ForwardHtlcInterceptRequest>;
}
