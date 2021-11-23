import { IncomingMessage, ServerResponse } from "http";

export interface Request extends IncomingMessage {
    params: Record<string, any>;
    body: Record<string, any>;
}

export type MiddlewareFunc = (
    req: Request,
    res: Response,
    next: (err?: unknown) => void
) => void;

export type EndpointFunc = (req: Request, res: Response) => void;

export interface ControllerDef {
    path: string;
    target: unknown;
}

export interface EndpointDef {
    path: string;
    method: Methods;
    propertyKey: string;
    controller: string;
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
    functions: Array<EndpointFunc | MiddlewareFunc>;
    headers: HeaderDef[]
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

export type unknownClass = new (...args: any[]) => unknown;

export interface Response extends ServerResponse {
    send: (message: string ) => void;
    json: (message: { [key: string]: any }) => void;
    status: (status: number) => Omit<Response, "status">;
}

export interface Options {
    port: number;
    root: string;
    middlewares?: MiddlewareFunc[];
    paths?: {
        exception?: string;
        controller?: string;
        component?: string;
    };
}

export interface RouteTableEndpoint {
    cb: EndpointFunc
    headers: HeaderDef[]
}

export interface IFile {
    name: string;
    ext: string;
}

export interface HeaderDef {
    name: string;
    value: string;
    propertyKey: string;
    target: string
}
