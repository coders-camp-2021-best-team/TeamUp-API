import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';

import { AuthMiddleware, Controller, validate } from '../common';
import { SearchQueryDto, SearchService } from '.';

export class SearchController extends Controller {
    constructor() {
        super('/search');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/', this.getResults);
    }

    async getResults(req: Request, res: Response) {
        const query = validate(SearchQueryDto, req.query);

        const results = await SearchService.getResults(query);

        res.send(instanceToPlain(results));
    }
}
