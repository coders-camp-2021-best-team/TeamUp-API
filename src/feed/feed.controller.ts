import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { instanceToPlain } from 'class-transformer';
import { AuthMiddleware, Controller } from '../common';
import { FeedService } from '.';

export class FeedController extends Controller {
    constructor() {
        super('/feed');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/recommended', this.getRecommended);
    }

    async getRecommended(req: Request, res: Response) {
        const users = await FeedService.getRecommended(req.session.userID);

        if (!users) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        }

        return res.json(instanceToPlain(users));
    }
}
