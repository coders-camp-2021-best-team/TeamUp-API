import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validateSync } from 'class-validator';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { AuthMiddleware, Controller } from '../common';
import { SwipeService, CreateSwipeDto } from '.';

export class SwipeController extends Controller {
    constructor() {
        super('/swipe');

        const router = this.getRouter();
        router.use(AuthMiddleware);

        router.get('/', this.getSwipes);
        router.post('/:id', this.createSwipe);
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
}
