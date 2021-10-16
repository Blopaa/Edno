import { Response } from '../types/route';

export default function createResponse(res: Response) {
    res.send = (message) => res.end(message);
    res.json = (message: { [key: string]: string } | undefined) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    };
    return res;
}
