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

        router.post('/:id', this.createSwipe);
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

        const temp = await SwipeService.swipeMatch(created);

        return res.status(StatusCodes.CREATED).json(instanceToPlain(temp));
    }
}
