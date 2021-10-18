import { IncomingMessage, ServerResponse } from 'http';

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

export type Middleware = (
    req: Request,
    res: Response,
    next: (err?: unknown) => void
) => void;

export interface Response extends ServerResponse {
    send: (message: string) => void;
    json: (message: { [key: string]: any }) => void;
    status: (status: number) => Omit<Response, 'status'>;
}
