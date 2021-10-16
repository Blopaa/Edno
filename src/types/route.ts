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

export class Response extends ServerResponse {
    private _send: ((message: any) => void) | undefined;
    private _json: ((message: { [key: string]: any } | undefined) => void) | undefined;


    get send(): ((message: any) => void) | undefined {
        return this._send;
    }

    set send(value: ((message: any) => void) | undefined) {
        this._send = value;
    }

    get json(): ((message: ({ [p: string]: any } | undefined)) => void) | undefined {
        return this._json;
    }

    set json(value: ((message: ({ [p: string]: any } | undefined)) => void) | undefined) {
        this._json = value;
    }
}