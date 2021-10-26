import { Response } from "../types/route";

export default function ResponseBuilder(res: Response): Response {
    res.send = (message) => res.end(message);
    res.json = (message) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(message));
    };
    res.status = (status) => {
        res.statusCode = status;
        return <Omit<Response, "status">>ResponseBuilder(res);
    };

    return res;
}
