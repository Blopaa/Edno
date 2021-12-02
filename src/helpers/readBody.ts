import { IncomingMessage } from "http";

/**
 * collects the body of the request
 * @param {Request} req - endpoint request
 */
export default function readBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (c) => {
            body += c;
        });
        req.on("end", () => {
            resolve(body);
        });
        req.on("error", (err) => {
            reject(err);
        });
    });
}
