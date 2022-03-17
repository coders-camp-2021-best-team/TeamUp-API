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

        try {
            const results = await SearchService.getResults(
                search as string | undefined
            );

            if (!results || !results.length) {
                return res.status(StatusCodes.NOT_FOUND).send('No matches');
            }
        } catch (error) {
            console.error(error);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
        }
    }
}
