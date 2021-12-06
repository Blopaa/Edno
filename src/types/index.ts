import { IncomingMessage, ServerResponse } from "http";
import { HttpStatusCode } from "./HttpStatus";

export interface Request extends IncomingMessage {
    params: Record<string, any>;
    body: Record<string, any>;
}

export type RouteFunction = (...args: any[]) => void;

export interface ControllerDef {
    path: string;
    target: unknown;
}

export interface EndpointDef {
    path: string;
    method: Methods;
    propertyKey: string;
    controller: string;
    descriptor: RouteFunction;
}

export interface ErrorHandlerDef {
    target: string;
    handler: (message: string | Record<string, any>) => unknown;
    propertyKey: string;
    exceptionHandled: string;
}

export enum Methods {
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Delete = "DELETE",
}

export interface ConfiguredRoute {
    method: Methods;
    path: string;
    functions: Array<RouteFunction>;
    headers: HeaderDef[];
    status: HttpStatusCode;
    key: string;
}

export interface Injector {
    toInject: string;
    target: new () => unknown;
    index: number;
}

export interface Injectable {
    controller: string;
    target: new () => unknown;
}

export type unknownArgClass = new (...args: any[]) => unknown;
export type unknownClass = new () => unknown;

export interface Response extends ServerResponse {
    send: (message: string) => void;
    json: (message: { [key: string]: any }) => void;
    status: (status: number) => Omit<Response, "status">;
}

export interface Options {
    port: number;
    root: string;
    middlewares?: RouteFunction[];
    paths?: {
        exception?: string;
        controller?: string;
        component?: string;
    };
}

export interface IFile {
    name: string;
    ext: string;
}

export interface HeaderDef {
    name: string;
    value: string;
    propertyKey: string;
    target: string;
}

export interface MethodDef {
    status: HttpStatusCode;
    cb: RouteFunction;
    middleware?: RouteFunction[];
    headers?: HeaderDef[];
    key: string;
}

export interface StatusDef {
    status: HttpStatusCode;
    propertyKey: string;
    target: string;
}

export enum ParamTypes {
    PARAM = "PARAM",
    BODY = "BODY",
    RESPONSE = "RESPONSE",
    NEXT = "NEXT",
    HEADER = "HEADER",
}

export interface ParamDef {
    name: string;
    type: ParamTypes;
    index: number;
    target: string;
    propertyKey: string;
    value: any;
}
