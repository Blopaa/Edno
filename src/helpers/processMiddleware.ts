import { MiddlewareFunc, Request, Response } from "../types/route";

export default function processMiddleware(middleware: MiddlewareFunc, req: Request, res: Response){
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