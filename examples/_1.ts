import { Edno } from '../src/edno';
import { Request, Response } from '../src/types/route';

const edno = new Edno();

const ednoApp = edno.create();

ednoApp.get(
    '/product/:id',

    (req: Request, res: Response, next: () => void) => {
        console.log("CALLED FROM MIDDLEWARE");
        next();
    },({ body, params }: Request, res: Response) => {
        console.log("MAIN METHOD")
        console.log(body);
        console.log(params);
        res.json?.({works: true});
    }
);
