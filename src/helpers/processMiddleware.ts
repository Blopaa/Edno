import { Middleware, Request, Response } from "../types/route";
import {ServerResponse} from "http";

export default function processMiddleware(middleware: Middleware, req: Request, res: Response){
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