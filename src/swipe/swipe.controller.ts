import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validate } from 'class-validator';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Controller } from '../common';
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

        return res.status(StatusCodes.CREATED).send(instanceToPlain(created));
    }
}
