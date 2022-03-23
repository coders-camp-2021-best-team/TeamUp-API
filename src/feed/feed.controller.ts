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

        router.get('/', this.getFeed);
    }

    async getFeed(req: Request, res: Response) {
        const feed = await FeedService.getFeed(req.session.userID);

        if (!feed) {
            return res.status(StatusCodes.NO_CONTENT).send();
        }

        return res.json(instanceToPlain(feed));
    }
}
