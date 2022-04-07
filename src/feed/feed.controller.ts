import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';

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
        const feed = await FeedService.getFeed(req.user!);

        return res.json(instanceToPlain(feed));
    }
}
