import { Request, Response } from 'express';
import { AuthMiddleware, Controller } from '../common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { SearchQueryDto, SearchService } from '.';
import { validateSync } from 'class-validator';
import { StatusCodes } from 'http-status-codes';

export class SearchController extends Controller {
    constructor() {
        super('/search');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/', this.getResults);
    }

    async getResults(req: Request, res: Response) {
        const query = plainToInstance(SearchQueryDto, req.query);
        const errors = validateSync(query);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const results = await SearchService.getResults(query);

        res.send(instanceToPlain(results));
    }
}
