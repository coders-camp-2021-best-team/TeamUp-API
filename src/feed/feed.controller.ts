import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Controller } from '../common';
import { RecomendedDTo } from './dto/recomended.dto';
import { FeedService } from './feed.service';

export class FeedController extends Controller {
    constructor() {
        super('/feed');

        const router = this.getRouter();

        router.get('/recomended', this.recomended);
    }
    async recomended(req: Request, res: Response) {
        const body = plainToInstance(RecomendedDTo, req.body as RecomendedDTo);
        const errors = await validate(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }
        const users = await FeedService.recomended(body);
        if (!users) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        return res.json(instanceToPlain(users));
    }
}
