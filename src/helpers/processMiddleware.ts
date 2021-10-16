import {Request} from "../types/route";
import {ServerResponse} from "http";

export default function processMiddleware(middleware: (req: Request, res: ServerResponse, next: () => void) => void, req: Request, res: ServerResponse){
    if(!middleware){
        //handling
        return new Promise((resolve) => resolve(true))
    }

    return new Promise((resolve) => {
        middleware(req, res, () => {
            resolve(true);
        })
    })
}