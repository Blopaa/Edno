import { IncomingMessage, ServerResponse } from "http";

export class Request extends IncomingMessage {
    private _params: { [key: string]: any } | undefined;
    private _body: {} | undefined;

    get body(): { [key: string]: any } | undefined {
        return this._body;
    }

    set body(value: {} | undefined) {
        this._body = value;
    }

    get params(): { [p: string]: any } | undefined {
        return this._params;
    }

    set params(value: { [p: string]: any } | undefined) {
        this._params = value;
    }
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
    method: string;
    path: string;
    functions: Array<EndpointFunc | MiddlewareFunc>;
}

export interface Response extends ServerResponse {
    send: (message: string) => void;
    json: (message: { [key: string]: any }) => void;
    status: (status: number) => Omit<Response, "status">;
}

export interface Options {
    port: number;
    root: string;
    exceptionPath?: string;
    middlewares?: MiddlewareFunc[];
}
