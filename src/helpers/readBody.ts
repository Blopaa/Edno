import {IncomingMessage} from 'http';

export default function readBody(req: IncomingMessage): Promise<String> {
    return new Promise((resolve, reject) => {
        let body: string = '';
        req.on('data', (c) => {
            body += c;
        });
        req.on('end', () => {
            resolve(body);
        });
        req.on('error', (err) => {
            reject(err);
        });
    });
}
