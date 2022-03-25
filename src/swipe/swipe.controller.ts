import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AuthMiddleware, Controller } from '../common';
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
        const swipes = await SwipeService.getSwipes(req.session.userID || '');

        if (!swipes) {
            return res.status(StatusCodes.UNAUTHORIZED).send();
        }

        res.send(instanceToPlain(swipes));
    }

    async createSwipe(req: Request, res: Response) {
        const body = plainToInstance(CreateSwipeDto, req.body);
        const errors = validateSync(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const targetID = req.params.id;

        const created = await SwipeService.createSwipe(
            req.session.userID || '',
            targetID,
            body.status
        );

        if (!created) {
            return res.status(StatusCodes.BAD_REQUEST).send();
        }

        return res.send(instanceToPlain(created));
    }

    async removeSwipe(req: Request, res: Response) {
        const swipeID = req.params.id;

        const removed = await SwipeService.removeSwipe(
            req.session.userID || '',
            swipeID
        );

        if (!removed) {
            return res.status(StatusCodes.NOT_FOUND).send();
        }

        res.send();
    }
}
