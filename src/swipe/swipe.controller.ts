import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { Controller } from '../common/controller.class';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';
import { SwipeService } from './swipe.service';
import { SwipeUserDto } from './dto/create-swipe.dto';

export class SwipeController extends Controller {
    constructor() {
        super('/swipe');

        const router = this.getRouter();

        router.post('/', this.createSwipe);
    }

    async createSwipe(req: Request, res: Response) {
        const body = plainToInstance(SwipeUserDto, req.body as SwipeUserDto);
        const errors = await validate(body);
        if (errors.length) {
            return res.status(StatusCodes.BAD_REQUEST).json(errors);
        }

        const created = await SwipeService.changeUser(body);

        return res.status(StatusCodes.CREATED).send(instanceToPlain(created));
    }
}
