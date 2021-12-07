import { Response } from "../types";
import { HttpStatus } from "../types/HttpStatus";

/**
 * Build IncomingMessage from node
 * @param {Response} res - response to build
 * @param {number} status - status to return, default 200
 */
export default function ResponseBuilder(
    res: Response,
    status: number = HttpStatus.OK
): Response {
    res.statusCode = status;
    res.send = (message) => {
        res.end(message);
    };
    res.json = (message) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(message));
    };
    res.status = (status) => {
        res.statusCode = status;
        return <Omit<Response, "status">>res;
    };

    return res;
}
