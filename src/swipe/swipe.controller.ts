import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';

import { AuthMiddleware, Controller, validate } from '../common';
import { CreateSwipeDto, SwipeService } from '.';

export class SwipeController extends Controller {
    constructor() {
        super('/swipe');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/', this.getSwipes);
        router.post('/:id', this.createSwipe);
        router.delete('/:id', this.removeSwipe);
    }

    async getSwipes(req: Request, res: Response) {
        const swipes = await SwipeService.getSwipes(req.user!);

        res.send(instanceToPlain(swipes));
    }

    async createSwipe(req: Request, res: Response) {
        const targetID = req.params.id;
        const body = validate(CreateSwipeDto, req.body);

        const created = await SwipeService.createSwipe(
            req.user!,
            targetID,
            body.status
        );

        return res.send(instanceToPlain(created));
    }

    async removeSwipe(req: Request, res: Response) {
        const swipeID = req.params.id;

        await SwipeService.removeSwipe(req.user!, swipeID);

        res.send();
    }
}
