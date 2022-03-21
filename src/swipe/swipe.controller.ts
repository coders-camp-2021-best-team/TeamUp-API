import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { Controller } from '../common/controller.class';
import { plainToInstance } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';
import { SwipeService, CreateSwipeDto } from '.';

export class SwipeController extends Controller {
    constructor() {
        super('/swipe');

        const router = this.getRouter();

        router.post('/:id', this.createSwipe);
    }

    async createSwipe(req: Request, res: Response) {
        const body = plainToInstance(CreateSwipeDto, req.body);
        const errors = await validate(body);
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

        return res.status(StatusCodes.CREATED).json(temp);
    }
}
