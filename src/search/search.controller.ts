import { Request, Response } from 'express';
import { SearchService } from './search.service';
import { Controller } from '../common';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export class SearchController extends Controller {
    constructor() {
        super('/search');

        const router = this.getRouter();

        router.get('/', this.getResults);
    }

    async getResults(req: Request, res: Response) {
        const search = req.query.q;

        const results = await SearchService.getResults(search as string);

        if (!results) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .send(ReasonPhrases.NOT_FOUND);
        }
        res.send(results);
    }
}
