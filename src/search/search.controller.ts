import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AuthMiddleware, Controller } from '../common';
import { SearchService } from '.';
import { instanceToPlain } from 'class-transformer';

export class SearchController extends Controller {
    constructor() {
        super('/search');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/', this.getResults);
    }

    async getResults(req: Request, res: Response) {
        const search = req.query.q;
        const skip = req.query.skip ? +req.query.skip : undefined;
        const take = req.query.take ? +req.query.take : undefined;

        const results = await SearchService.getResults(
            search as string,
            take,
            skip
        );

        res.send(instanceToPlain(results));
    }
}
